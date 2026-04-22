from odoo import models, fields

class Lead(models.Model):
    _name = 'bbweb.lead'
    _description = 'Website Leads'
    _order = 'create_date desc'

    first_name = fields.Char(string='First Name', required=True)
    last_name = fields.Char(string='Last Name', required=True)
    email = fields.Char(string='Email', required=True)
    phone = fields.Char(string='Phone')
    service = fields.Char(string='Service Interested In')
    project_details = fields.Text(string='Project Details')
    
    status = fields.Selection([
        ('open', 'Open'),
        ('closed', 'Closed')
    ], string='Status', default='open', required=True)
