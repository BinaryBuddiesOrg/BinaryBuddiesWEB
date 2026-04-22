# -*- coding: utf-8 -*-

from odoo import models, fields, api


class Certification(models.Model):
    _name = 'bbweb.certification'
    _description = 'Team Member Certification'
    _order = 'sequence, id'

    team_member_id = fields.Many2one('bbweb.team.member', string='Team Member', required=True, ondelete='cascade')
    name = fields.Char(string='Certification Name', required=True)
    sequence = fields.Integer(string='Sequence', default=10)
