# -*- coding: utf-8 -*-

from odoo import models, fields, api
from datetime import datetime


class JobApplication(models.Model):
    _name = 'bbweb.job.application'
    _description = 'Job Application'
    _order = 'applied_date desc, id desc'

    name = fields.Char(string='Applicant Name', required=True)
    email = fields.Char(string='Email', required=True)
    phone = fields.Char(string='Phone')
    
    career_id = fields.Many2one('bbweb.career', string='Position Applied For', required=True, ondelete='cascade')
    
    resume = fields.Binary(string='Resume', attachment=True)
    resume_filename = fields.Char(string='Resume Filename')
    
    cover_letter = fields.Text(string='Cover Letter')
    
    status = fields.Selection([
        ('new', 'New'),
        ('reviewed', 'Reviewed'),
        ('interviewed', 'Interviewed'),
        ('hired', 'Hired'),
        ('rejected', 'Rejected'),
    ], string='Status', default='new', required=True)
    
    applied_date = fields.Datetime(string='Applied Date', default=fields.Datetime.now, readonly=True)
    
    # Related fields for display
    position_title = fields.Char(related='career_id.title', string='Position Title', store=True)
    department = fields.Char(related='career_id.department', string='Department', store=True)
