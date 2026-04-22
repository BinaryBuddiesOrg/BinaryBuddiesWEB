# -*- coding: utf-8 -*-

from odoo import models, fields, api


class JobRequirement(models.Model):
    _name = 'bbweb.job.requirement'
    _description = 'Job Requirement'
    _order = 'sequence, id'

    career_id = fields.Many2one('bbweb.career', string='Career', required=True, ondelete='cascade')
    requirement = fields.Text(string='Requirement', required=True)
    sequence = fields.Integer(string='Sequence', default=10)
