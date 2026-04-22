# -*- coding: utf-8 -*-

from odoo import models, fields, api


class ProjectResult(models.Model):
    _name = 'bbweb.project.result'
    _description = 'Project Result'
    _order = 'sequence, id'

    project_id = fields.Many2one('bbweb.featured.project', string='Project', required=True, ondelete='cascade')
    result = fields.Char(string='Result', required=True, help='Key achievement or metric (e.g., "50% faster diagnosis")')
    sequence = fields.Integer(string='Sequence', default=10)
