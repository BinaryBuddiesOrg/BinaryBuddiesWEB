# -*- coding: utf-8 -*-

from odoo import models, fields


class BlogTag(models.Model):
    _name = 'bbweb.blog.tag'
    _description = 'Blog Tag'
    _order = 'name'

    name = fields.Char(string='Tag Name', required=True, translate=True)
    color = fields.Integer(string='Color Index', default=0)
    description = fields.Text(string='Description', help='Optional description of the tag')

    _sql_constraints = [
        ('name_unique', 'UNIQUE(name)', 'Tag name must be unique!')
    ]
