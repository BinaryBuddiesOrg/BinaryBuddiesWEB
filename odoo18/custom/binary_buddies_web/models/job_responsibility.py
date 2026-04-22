# -*- coding: utf-8 -*-

from odoo import models, fields, api


class JobResponsibility(models.Model):
    _name = 'bbweb.job.responsibility'
    _description = 'Job Responsibility'
    _order = 'sequence, id'

    career_id = fields.Many2one('bbweb.career', string='Career', required=True, ondelete='cascade')
    responsibility = fields.Text(string='Responsibility', required=True)
    sequence = fields.Integer(string='Sequence', default=10)
