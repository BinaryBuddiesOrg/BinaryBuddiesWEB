# -*- coding: utf-8 -*-

from odoo import models, fields, api
from odoo.exceptions import ValidationError, AccessError
from datetime import datetime


class BlogComment(models.Model):
    """
    Blog Comment Model with nested replies support.
    Uses adjacency list pattern (parent_id) for hierarchical structure.
    Optimized for scalability with denormalized counts and keyset pagination.
    """
    _name = 'bbweb.blog.comment'
    _description = 'Blog Comment'
    _order = 'create_date asc'

    # Core relationships
    blog_id = fields.Many2one(
        'bbweb.blog.post',
        string='Blog Post',
        required=True,
        index=True,
        ondelete='cascade'
    )
    user_id = fields.Many2one(
        'bbweb.website.user',
        string='Author',
        required=True,
        index=True,
        ondelete='cascade'
    )
    parent_id = fields.Many2one(
        'bbweb.blog.comment',
        string='Parent Comment',
        index=True,
        ondelete='cascade'
    )
    child_ids = fields.One2many(
        'bbweb.blog.comment',
        'parent_id',
        string='Replies'
    )

    # Content
    content = fields.Text(string='Content', required=True)

    # Edit tracking
    is_edited = fields.Boolean(string='Is Edited', default=False)
    edited_at = fields.Datetime(string='Last Edited')

    # Soft delete (preserves thread structure, shows "[deleted]" in UI)
    is_deleted = fields.Boolean(string='Is Deleted', default=False, index=True)
    deleted_at = fields.Datetime(string='Deleted At')

    # Denormalized counts (updated via create/unlink overrides for performance)
    like_count = fields.Integer(string='Like Count', default=0, index=True)
    reply_count = fields.Integer(string='Reply Count', default=0)

    # Depth level (cached for optimization and validation)
    depth = fields.Integer(string='Depth', default=0)

    # Active status
    active = fields.Boolean(string='Active', default=True)

    # Constraints
    _sql_constraints = [
        ('max_depth_check', 'CHECK(depth <= 30)', 'Maximum comment depth is 30 levels'),
        ('content_not_empty', "CHECK(content IS NOT NULL AND content != '')", 'Comment content cannot be empty'),
    ]

    @api.model
    def create(self, vals):
        """Calculate depth on create and increment parent's reply_count"""
        if vals.get('parent_id'):
            parent = self.browse(vals['parent_id'])
            if not parent.exists():
                raise ValidationError("Parent comment does not exist")
            vals['depth'] = parent.depth + 1
            if vals['depth'] > 30:
                raise ValidationError("Maximum comment depth of 30 levels exceeded")
            # Increment parent's reply_count
            parent.sudo().write({'reply_count': parent.reply_count + 1})
        else:
            vals['depth'] = 0

        result = super(BlogComment, self).create(vals)

        # Increment blog's comment_count
        if result.blog_id:
            result.blog_id.sudo().write({
                'comment_count': result.blog_id.comment_count + 1
            })

        return result

    def unlink(self):
        """Decrement counts on delete"""
        for record in self:
            # Decrement parent's reply_count
            if record.parent_id:
                record.parent_id.sudo().write({
                    'reply_count': max(0, record.parent_id.reply_count - 1)
                })
            # Decrement blog's comment_count
            if record.blog_id:
                record.blog_id.sudo().write({
                    'comment_count': max(0, record.blog_id.comment_count - 1)
                })
        return super(BlogComment, self).unlink()

    def soft_delete(self, user_id):
        """
        Soft delete a comment - preserves thread structure.
        Shows "[deleted]" in UI but keeps replies intact.
        """
        self.ensure_one()
        if self.user_id.id != user_id:
            raise AccessError("You can only delete your own comments")
        if self.is_deleted:
            raise ValidationError("Comment is already deleted")

        self.write({
            'is_deleted': True,
            'deleted_at': fields.Datetime.now(),
            'content': '[deleted]',  # Clear content for privacy
        })

    def edit_comment(self, user_id, new_content):
        """Edit a comment - only owner can edit"""
        self.ensure_one()
        if self.user_id.id != user_id:
            raise AccessError("You can only edit your own comments")
        if self.is_deleted:
            raise ValidationError("Cannot edit a deleted comment")
        if not new_content or not new_content.strip():
            raise ValidationError("Comment content cannot be empty")

        self.write({
            'content': new_content.strip(),
            'is_edited': True,
            'edited_at': fields.Datetime.now(),
        })

    def increment_like_count(self):
        """Increment like count (called by CommentLike on create)"""
        self.ensure_one()
        self.sudo().write({'like_count': self.like_count + 1})

    def decrement_like_count(self):
        """Decrement like count (called by CommentLike on unlink)"""
        self.ensure_one()
        self.sudo().write({'like_count': max(0, self.like_count - 1)})

    @api.model
    def get_comments_paginated(self, blog_id, parent_id=None, limit=20, cursor=None, current_user_id=None):
        """
        Fetch comments with keyset pagination for scalability.

        Args:
            blog_id: ID of the blog post
            parent_id: ID of parent comment (None for root comments)
            limit: Number of comments to fetch
            cursor: Cursor string in format "id:123:ts:2026-01-13T10:00:00"
            current_user_id: ID of current website user for is_liked/is_own checks

        Returns:
            dict with 'comments' list and 'pagination' info
        """
        # Build domain
        domain = [
            ('blog_id', '=', blog_id),
            ('active', '=', True),
        ]

        if parent_id:
            domain.append(('parent_id', '=', parent_id))
        else:
            domain.append(('parent_id', '=', False))

        # Parse cursor for keyset pagination
        if cursor:
            try:
                parts = cursor.split(':')
                cursor_id = int(parts[1])
                cursor_ts = parts[3]
                # Keyset condition: get comments after the cursor
                domain.append('|')
                domain.append(('create_date', '>', cursor_ts))
                domain.append('&')
                domain.append(('create_date', '=', cursor_ts))
                domain.append(('id', '>', cursor_id))
            except (IndexError, ValueError):
                pass  # Invalid cursor, ignore

        # Fetch comments
        comments = self.search(domain, order='create_date asc, id asc', limit=limit + 1)

        # Check if there are more
        has_more = len(comments) > limit
        if has_more:
            comments = comments[:limit]

        # Get total count (cached query)
        total_domain = [
            ('blog_id', '=', blog_id),
            ('active', '=', True),
        ]
        if parent_id:
            total_domain.append(('parent_id', '=', parent_id))
        else:
            total_domain.append(('parent_id', '=', False))
        total_count = self.search_count(total_domain)

        # Get user's likes for these comments
        liked_comment_ids = set()
        if current_user_id:
            CommentLike = self.env['bbweb.comment.like'].sudo()
            likes = CommentLike.search([
                ('comment_id', 'in', comments.ids),
                ('user_id', '=', current_user_id),
            ])
            liked_comment_ids = set(like.comment_id.id for like in likes)

        # Build response
        result = []
        for comment in comments:
            result.append({
                'id': comment.id,
                'content': comment.content if not comment.is_deleted else '[This comment has been deleted]',
                'user': {
                    'id': comment.user_id.id,
                    'name': comment.user_id.name,
                    'image_url': comment.user_id.image_url,
                },
                'parent_id': comment.parent_id.id if comment.parent_id else None,
                'depth': comment.depth,
                'like_count': comment.like_count,
                'reply_count': comment.reply_count,
                'is_liked': comment.id in liked_comment_ids,
                'is_own': current_user_id and comment.user_id.id == current_user_id,
                'is_edited': comment.is_edited,
                'edited_at': comment.edited_at.isoformat() if comment.edited_at else None,
                'is_deleted': comment.is_deleted,
                'created_at': comment.create_date.isoformat() if comment.create_date else None,
            })

        # Build next cursor
        next_cursor = None
        if has_more and comments:
            last = comments[-1]
            next_cursor = f"id:{last.id}:ts:{last.create_date.isoformat()}"

        return {
            'comments': result,
            'pagination': {
                'next_cursor': next_cursor,
                'has_more': has_more,
                'total_count': total_count,
            }
        }

    @api.model
    def create_comment(self, blog_id, user_id, content, parent_id=None):
        """
        Create a new comment with validation.

        Args:
            blog_id: ID of the blog post
            user_id: ID of the website user (bbweb.website.user)
            content: Comment text
            parent_id: Optional parent comment ID for replies

        Returns:
            dict with created comment data
        """
        # Validate blog exists
        Blog = self.env['bbweb.blog.post'].sudo()
        blog = Blog.browse(blog_id)
        if not blog.exists() or not blog.active:
            raise ValidationError("Blog post not found")

        # Validate user exists and can comment
        User = self.env['bbweb.website.user'].sudo()
        user = User.browse(user_id)
        if not user.exists() or not user.active:
            raise ValidationError("User not found")
        if user.is_banned:
            raise AccessError("You are banned from commenting")
        if not user.can_comment:
            raise AccessError("You do not have permission to comment")

        # Validate content
        if not content or not content.strip():
            raise ValidationError("Comment content cannot be empty")
        content = content.strip()
        if len(content) > 10000:
            raise ValidationError("Comment is too long (max 10,000 characters)")

        # Validate parent if provided
        if parent_id:
            parent = self.browse(parent_id)
            if not parent.exists() or parent.blog_id.id != blog_id:
                raise ValidationError("Invalid parent comment")

        # Create comment
        comment = self.create({
            'blog_id': blog_id,
            'user_id': user_id,
            'content': content,
            'parent_id': parent_id,
        })

        return {
            'id': comment.id,
            'content': comment.content,
            'user': {
                'id': comment.user_id.id,
                'name': comment.user_id.name,
                'image_url': comment.user_id.image_url,
            },
            'parent_id': comment.parent_id.id if comment.parent_id else None,
            'depth': comment.depth,
            'like_count': 0,
            'reply_count': 0,
            'is_liked': False,
            'is_own': True,
            'is_edited': False,
            'edited_at': None,
            'is_deleted': False,
            'created_at': comment.create_date.isoformat() if comment.create_date else None,
        }
