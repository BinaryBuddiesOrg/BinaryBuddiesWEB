# -*- coding: utf-8 -*-

from odoo import models, fields, api


class Career(models.Model):
    _name = 'bbweb.career'
    _description = 'Career Listing'
    _order = 'sequence, id'

    title = fields.Char(string='Job Title', required=True)
    department = fields.Char(string='Department', required=True, help='e.g., Engineering, Marketing, Design')
    location = fields.Char(string='Location', required=True, help='e.g., Remote, Hybrid, New York')
    
    employment_type = fields.Selection([
        ('full_time', 'Full-time'),
        ('part_time', 'Part-time'),
        ('contract', 'Contract'),
        ('remote', 'Remote'),
        ('hybrid', 'Hybrid'),
    ], string='Employment Type', required=True, default='full_time')
    
    description = fields.Text(string='Job Description', required=True)
    
    # Relational fields
    requirement_ids = fields.One2many('bbweb.job.requirement', 'career_id', string='Requirements')
    responsibility_ids = fields.One2many('bbweb.job.responsibility', 'career_id', string='Responsibilities')
    
    # Ordering and status
    sequence = fields.Integer(string='Sequence', default=10)
    active = fields.Boolean(string='Active', default=True)
    
    @api.model
    def get_api_data(self, department_filter=None):
        """Return data formatted for API consumption"""
        domain = [('active', '=', True)]
        
        if department_filter:
            domain.append(('department', '=', department_filter))
        
        careers = self.search(domain, order='sequence, id')
        result = []
        
        # Employment type mapping for API
        type_map = {
            'full_time': 'Full-time',
            'part_time': 'Part-time',
            'contract': 'Contract',
            'remote': 'Remote',
            'hybrid': 'Hybrid',
        }
        
        for career in careers:
            result.append({
                'id': str(career.id),
                'title': career.title,
                'department': career.department,
                'location': career.location,
                'type': type_map.get(career.employment_type, career.employment_type),
                'description': career.description,
                'requirements': [r.requirement for r in career.requirement_ids],
                'responsibilities': [r.responsibility for r in career.responsibility_ids],
            })
        
        return result
