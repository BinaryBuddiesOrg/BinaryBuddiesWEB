# -*- coding: utf-8 -*-

from odoo import models, fields, api


class ProjectTag(models.Model):
    _name = 'bbweb.project.tag'
    _description = 'Project Tag'
    _order = 'name'

    name = fields.Char(string='Tag Name', required=True)
    color = fields.Integer(string='Color Index', default=0)

    _sql_constraints = [
        ('name_unique', 'UNIQUE(name)', 'Tag name must be unique!')
    ]
