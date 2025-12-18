# -*- coding: utf-8 -*-

from odoo import models, fields, api
import base64


class TeamMember(models.Model):
    _name = 'bbweb.team.member'
    _description = 'Team Member'
    _order = 'sequence, id'

    name = fields.Char(string='Full Name', required=True)
    role = fields.Char(string='Role/Position', required=True, help='e.g., CEO & Co-Founder')
    specialty = fields.Char(string='Specialty', required=True, help='e.g., AI Strategy & Vision')
    bio = fields.Text(string='Biography', required=True)
    
    # Image field
    image = fields.Binary(string='Avatar Image', attachment=True)
    image_filename = fields.Char(string='Image Filename')
    
    # Social links
    linkedin_url = fields.Char(string='LinkedIn URL')
    github_url = fields.Char(string='GitHub URL')
    twitter_url = fields.Char(string='Twitter URL')
    
    # Relational fields
    certification_ids = fields.One2many('bbweb.certification', 'team_member_id', string='Certifications')
    
    # Ordering and status
    sequence = fields.Integer(string='Sequence', default=10)
    active = fields.Boolean(string='Active', default=True)
    
    @api.model
    def get_api_data(self):
        """Return data formatted for API consumption"""
        members = self.search([('active', '=', True)], order='sequence, id')
        result = []
        
        for member in members:
            result.append({
                'id': member.id,
                'name': member.name,
                'role': member.role,
                'specialty': member.specialty,
                'bio': member.bio,
                'certifications': [c.name for c in member.certification_ids],
                'image': base64.b64encode(member.image).decode('utf-8') if member.image else None,
                'linkedin_url': member.linkedin_url or '',
                'github_url': member.github_url or '',
                'twitter_url': member.twitter_url or '',
            })
        
        return result
