# -*- coding: utf-8 -*-

from odoo import models, fields, api
import base64


class FeaturedProject(models.Model):
    _name = 'bbweb.featured.project'
    _description = 'Featured Project'
    _order = 'sequence, id'

    name = fields.Char(string='Project Title', required=True)
    category = fields.Char(string='Category', required=True, help='e.g., Healthcare, Retail, Finance')
    description = fields.Text(string='Description', required=True)
    gradient = fields.Char(string='Gradient CSS Class', default='from-primary/20 to-accent/20',
                           help='Tailwind CSS gradient classes for the card background')
    
    # Image field
    image = fields.Binary(string='Project Image', attachment=True)
    image_filename = fields.Char(string='Image Filename')
    
    # Relational fields
    result_ids = fields.One2many('bbweb.project.result', 'project_id', string='Results')
    tag_ids = fields.Many2many('bbweb.project.tag', string='Tags')
    
    # Ordering and status
    sequence = fields.Integer(string='Sequence', default=10)
    active = fields.Boolean(string='Active', default=True)
    
    @api.model
    def get_api_data(self):
        """Return data formatted for API consumption"""
        projects = self.search([('active', '=', True)], order='sequence, id')
        result = []
        
        for project in projects:
            result.append({
                'id': project.id,
                'title': project.name,
                'category': project.category,
                'description': project.description,
                'results': [r.result for r in project.result_ids],
                'tags': [t.name for t in project.tag_ids],
                'gradient': project.gradient,
                'image': base64.b64encode(project.image).decode('utf-8') if project.image else None,
            })
        
        return result
