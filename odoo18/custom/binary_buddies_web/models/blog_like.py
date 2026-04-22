# -*- coding: utf-8 -*-

from odoo import models, fields, api
from odoo.exceptions import ValidationError, AccessError


class BlogLike(models.Model):
    """
    Blog Like Model - tracks user likes on blog posts.
    Each user can only like a blog once (enforced by unique constraint).
    Automatically updates Blog's like_count for performance.
    """
    _name = 'bbweb.blog.like'
    _description = 'Blog Post Like'
    _order = 'create_date desc'

    blog_id = fields.Many2one(
        'bbweb.blog.post',
        string='Blog Post',
        required=True,
        index=True,
        ondelete='cascade'
    )
    user_id = fields.Many2one(
        'bbweb.website.user',
        string='User',
        required=True,
        index=True,
        ondelete='cascade'
    )
    create_date = fields.Datetime(
        string='Liked At',
        default=fields.Datetime.now,
        readonly=True
    )

    _sql_constraints = [
        ('unique_blog_like', 'UNIQUE(blog_id, user_id)', 'You have already liked this blog post'),
    ]

    @api.model
    def create(self, vals):
        """Increment blog's like_count on create"""
        result = super(BlogLike, self).create(vals)
        if result.blog_id:
            result.blog_id.sudo().write({
                'like_count': result.blog_id.like_count + 1
            })
        return result

    def unlink(self):
        """Decrement blog's like_count on delete"""
        for record in self:
            if record.blog_id:
                record.blog_id.sudo().write({
                    'like_count': max(0, record.blog_id.like_count - 1)
                })
        return super(BlogLike, self).unlink()

    @api.model
    def toggle_like(self, blog_id, user_id):
        """
        Toggle like status for a user on a blog post.
        Returns the new like status and count.

        Args:
            blog_id: ID of the blog post
            user_id: ID of the website user (bbweb.website.user)

        Returns:
            dict with 'is_liked' (bool) and 'like_count' (int)
        """
        # Validate blog exists
        Blog = self.env['bbweb.blog.post'].sudo()
        blog = Blog.browse(blog_id)
        if not blog.exists() or not blog.active:
            raise ValidationError("Blog post not found")

        # Validate user exists and is not banned
        User = self.env['bbweb.website.user'].sudo()
        user = User.browse(user_id)
        if not user.exists() or not user.active:
            raise ValidationError("User not found")
        if user.is_banned:
            raise AccessError("You are banned from liking content")

        # Check if already liked
        existing_like = self.search([
            ('blog_id', '=', blog_id),
            ('user_id', '=', user_id),
        ], limit=1)

        if existing_like:
            # Unlike - delete the like record
            existing_like.unlink()
            is_liked = False
        else:
            # Like - create a new like record
            self.create({
                'blog_id': blog_id,
                'user_id': user_id,
            })
            is_liked = True

        # Refresh blog to get updated count
        blog = Blog.browse(blog_id)

        return {
            'is_liked': is_liked,
            'like_count': blog.like_count,
        }

    @api.model
    def get_like_status(self, blog_id, user_id):
        """
        Check if a user has liked a blog post.

        Args:
            blog_id: ID of the blog post
            user_id: ID of the website user (can be None for anonymous)

        Returns:
            dict with 'is_liked' (bool) and 'like_count' (int)
        """
        Blog = self.env['bbweb.blog.post'].sudo()
        blog = Blog.browse(blog_id)
        if not blog.exists():
            raise ValidationError("Blog post not found")

        is_liked = False
        if user_id:
            existing_like = self.search([
                ('blog_id', '=', blog_id),
                ('user_id', '=', user_id),
            ], limit=1)
            is_liked = bool(existing_like)

        return {
            'is_liked': is_liked,
            'like_count': blog.like_count,
        }
