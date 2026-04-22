# -*- coding: utf-8 -*-

from odoo import models, fields, api
from odoo.exceptions import ValidationError, AccessError


class CommentLike(models.Model):
    """
    Comment Like Model - tracks user likes on comments.
    Each user can only like a comment once (enforced by unique constraint).
    Automatically updates Comment's like_count for performance.
    """
    _name = 'bbweb.comment.like'
    _description = 'Comment Like'
    _order = 'create_date desc'

    comment_id = fields.Many2one(
        'bbweb.blog.comment',
        string='Comment',
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
        ('unique_comment_like', 'UNIQUE(comment_id, user_id)', 'You have already liked this comment'),
    ]

    @api.model
    def create(self, vals):
        """Increment comment's like_count on create"""
        result = super(CommentLike, self).create(vals)
        if result.comment_id:
            result.comment_id.increment_like_count()
        return result

    def unlink(self):
        """Decrement comment's like_count on delete"""
        for record in self:
            if record.comment_id:
                record.comment_id.decrement_like_count()
        return super(CommentLike, self).unlink()

    @api.model
    def toggle_like(self, comment_id, user_id):
        """
        Toggle like status for a user on a comment.
        Returns the new like status and count.

        Args:
            comment_id: ID of the comment
            user_id: ID of the website user (bbweb.website.user)

        Returns:
            dict with 'is_liked' (bool) and 'like_count' (int)
        """
        # Validate comment exists
        Comment = self.env['bbweb.blog.comment'].sudo()
        comment = Comment.browse(comment_id)
        if not comment.exists() or not comment.active:
            raise ValidationError("Comment not found")

        # Validate user exists and is not banned
        User = self.env['bbweb.website.user'].sudo()
        user = User.browse(user_id)
        if not user.exists() or not user.active:
            raise ValidationError("User not found")
        if user.is_banned:
            raise AccessError("You are banned from liking content")

        # Check if already liked
        existing_like = self.search([
            ('comment_id', '=', comment_id),
            ('user_id', '=', user_id),
        ], limit=1)

        if existing_like:
            # Unlike - delete the like record
            existing_like.unlink()
            is_liked = False
        else:
            # Like - create a new like record
            self.create({
                'comment_id': comment_id,
                'user_id': user_id,
            })
            is_liked = True

        # Refresh comment to get updated count
        comment = Comment.browse(comment_id)

        return {
            'is_liked': is_liked,
            'like_count': comment.like_count,
        }
