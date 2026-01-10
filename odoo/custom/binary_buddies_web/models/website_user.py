# -*- coding: utf-8 -*-

from odoo import models, fields, api
from datetime import datetime


class WebsiteUser(models.Model):
    _name = 'bbweb.website.user'
    _description = 'Website User (Google OAuth)'
    _order = 'last_login desc'

    # Core fields from Google OAuth
    google_id = fields.Char('Google ID', required=True, index=True,
                           help='Unique identifier from Google OAuth')
    email = fields.Char('Email', required=True, index=True)
    name = fields.Char('Name', required=True)
    image_url = fields.Char('Profile Image URL')

    # Tracking
    first_login = fields.Datetime('First Login', default=fields.Datetime.now, readonly=True)
    last_login = fields.Datetime('Last Login')
    login_count = fields.Integer('Login Count', default=1)

    # Status
    active = fields.Boolean('Active', default=True)
    is_banned = fields.Boolean('Banned', default=False,
                              help='Banned users cannot comment or author content')
    ban_reason = fields.Text('Ban Reason')

    # Permissions for future features
    can_comment = fields.Boolean('Can Comment', default=True,
                                help='Allow user to comment on blog posts')
    can_author_blogs = fields.Boolean('Can Author Blogs', default=False,
                                     help='Allow user to create blog posts')

    # Constraints
    _sql_constraints = [
        ('google_id_unique', 'UNIQUE(google_id)', 'Google ID must be unique!'),
        ('email_unique', 'UNIQUE(email)', 'Email address must be unique!'),
    ]

    def name_get(self):
        """Display name with email"""
        result = []
        for record in self:
            name = f"{record.name} ({record.email})"
            result.append((record.id, name))
        return result

    @api.model
    def sync_user(self, google_id, email, name, image_url=None):
        """
        Sync user from NextAuth on Google sign-in.
        Creates new user or updates existing one.
        Returns dict with user info and status.
        """
        existing_user = self.search([('google_id', '=', google_id)], limit=1)

        if existing_user:
            # Update existing user
            existing_user.write({
                'name': name,
                'email': email,
                'image_url': image_url,
                'last_login': fields.Datetime.now(),
                'login_count': existing_user.login_count + 1,
            })
            return {
                'status': 'success',
                'action': 'updated',
                'user_id': existing_user.id,
                'is_banned': existing_user.is_banned,
                'can_comment': existing_user.can_comment,
                'can_author_blogs': existing_user.can_author_blogs,
            }
        else:
            # Create new user
            new_user = self.create({
                'google_id': google_id,
                'email': email,
                'name': name,
                'image_url': image_url,
                'last_login': fields.Datetime.now(),
            })
            return {
                'status': 'success',
                'action': 'created',
                'user_id': new_user.id,
                'is_banned': False,
                'can_comment': True,
                'can_author_blogs': False,
            }

    @api.model
    def verify_user(self, google_id):
        """
        Verify user exists and is not banned.
        Used for protected actions like commenting.
        """
        user = self.search([
            ('google_id', '=', google_id),
            ('active', '=', True),
            ('is_banned', '=', False),
        ], limit=1)

        if user:
            return {
                'valid': True,
                'user_id': user.id,
                'name': user.name,
                'email': user.email,
                'can_comment': user.can_comment,
                'can_author_blogs': user.can_author_blogs,
            }
        return {'valid': False}

    def action_ban_user(self):
        """Ban user action for admin"""
        for record in self:
            record.is_banned = True

    def action_unban_user(self):
        """Unban user action for admin"""
        for record in self:
            record.is_banned = False
            record.ban_reason = False
