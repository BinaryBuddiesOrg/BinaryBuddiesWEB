from odoo import http
from odoo.http import request
import json

class LeadsController(http.Controller):
    
    @http.route('/api/bbweb/leads/create', type='http', auth='public', methods=['POST'], csrf=False, cors='*')
    def create_lead(self, **kwargs):
        try:
            data = request.get_json_data()
            
            # Validate required fields
            required_fields = ['first_name', 'last_name', 'email']
            for field in required_fields:
                if not data.get(field):
                    return request.make_response(
                        json.dumps({'status': 'error', 'message': f'Missing required field: {field}'}),
                        headers={'Content-Type': 'application/json'}
                    )
            
            # Create lead
            lead = request.env['bbweb.lead'].sudo().create({
                'first_name': data.get('first_name'),
                'last_name': data.get('last_name'),
                'email': data.get('email'),
                'phone': data.get('phone'),
                'service': data.get('service'),
                'project_details': data.get('project_details'),
                'status': 'open'
            })
            
            return request.make_response(
                json.dumps({
                    'status': 'success',
                    'message': 'Lead created successfully',
                    'id': lead.id
                }),
                headers={'Content-Type': 'application/json'}
            )
            
        except Exception as e:
            return request.make_response(
                json.dumps({'status': 'error', 'message': str(e)}),
                headers={'Content-Type': 'application/json'}
            )
