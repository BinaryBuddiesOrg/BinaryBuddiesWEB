from odoo import http
from odoo.http import request
import json
import base64


class ApplicationsController(http.Controller):
    
    @http.route('/api/bbweb/applications/create', type='http', auth='public', methods=['POST'], csrf=False, cors='*')
    def create_application(self, **kwargs):
        try:
            # Check if this is a multipart form submission
            content_type = request.httprequest.content_type or ''
            
            if 'multipart/form-data' in content_type:
                # Handle multipart form data (with file upload)
                name = request.params.get('name')
                email = request.params.get('email')
                phone = request.params.get('phone')
                career_id = request.params.get('career_id')
                cover_letter = request.params.get('cover_letter')
                
                # Handle resume file
                resume_file = request.httprequest.files.get('resume')
                resume_data = None
                resume_filename = None
                
                if resume_file:
                    resume_data = base64.b64encode(resume_file.read())
                    resume_filename = resume_file.filename
            else:
                # Handle JSON data
                data = request.get_json_data()
                name = data.get('name')
                email = data.get('email')
                phone = data.get('phone')
                career_id = data.get('career_id')
                cover_letter = data.get('cover_letter')
                resume_data = None
                resume_filename = None
            
            # Validate required fields
            if not name:
                return request.make_response(
                    json.dumps({'status': 'error', 'message': 'Name is required'}),
                    headers={'Content-Type': 'application/json'},
                    status=400
                )
            if not email:
                return request.make_response(
                    json.dumps({'status': 'error', 'message': 'Email is required'}),
                    headers={'Content-Type': 'application/json'},
                    status=400
                )
            if not career_id:
                return request.make_response(
                    json.dumps({'status': 'error', 'message': 'Position is required'}),
                    headers={'Content-Type': 'application/json'},
                    status=400
                )
            
            # Convert career_id to integer
            try:
                career_id = int(career_id)
            except (ValueError, TypeError):
                return request.make_response(
                    json.dumps({'status': 'error', 'message': 'Invalid position ID'}),
                    headers={'Content-Type': 'application/json'},
                    status=400
                )
            
            # Check if career exists
            career = request.env['bbweb.career'].sudo().browse(career_id)
            if not career.exists():
                return request.make_response(
                    json.dumps({'status': 'error', 'message': 'Position not found'}),
                    headers={'Content-Type': 'application/json'},
                    status=404
                )
            
            # Create application
            application_vals = {
                'name': name,
                'email': email,
                'phone': phone or '',
                'career_id': career_id,
                'cover_letter': cover_letter or '',
            }
            
            if resume_data:
                application_vals['resume'] = resume_data
                application_vals['resume_filename'] = resume_filename
            
            application = request.env['bbweb.job.application'].sudo().create(application_vals)
            
            return request.make_response(
                json.dumps({
                    'status': 'success',
                    'message': 'Application submitted successfully',
                    'id': application.id
                }),
                headers={'Content-Type': 'application/json'}
            )
            
        except Exception as e:
            return request.make_response(
                json.dumps({'status': 'error', 'message': str(e)}),
                headers={'Content-Type': 'application/json'},
                status=500
            )
