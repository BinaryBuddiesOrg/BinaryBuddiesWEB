# -*- coding: utf-8 -*-

from odoo import http
from odoo.http import request
import json


class BinaryBuddiesWebAPI(http.Controller):
    """Public API endpoints for Binary Buddies website content"""

    def _json_response(self, data, status=200):
        """Helper method to create JSON responses with CORS headers"""
        response = request.make_response(
            json.dumps(data, ensure_ascii=False),
            headers=[
                ('Content-Type', 'application/json'),
                ('Access-Control-Allow-Origin', '*'),
                ('Access-Control-Allow-Methods', 'GET, OPTIONS'),
                ('Access-Control-Allow-Headers', 'Content-Type'),
            ]
        )
        response.status_code = status
        return response

    def _error_response(self, message, status=400):
        """Helper method to create error responses"""
        return self._json_response({'error': message}, status=status)

    # Featured Projects Endpoints
    @http.route('/api/bbweb/projects', type='http', auth='public', methods=['GET', 'OPTIONS'], csrf=False, cors='*')
    def get_projects(self, **kwargs):
        """Get all active featured projects"""
        try:
            if request.httprequest.method == 'OPTIONS':
                return self._json_response({})
            
            projects = request.env['bbweb.featured.project'].sudo().get_api_data()
            return self._json_response(projects)
        except Exception as e:
            return self._error_response(str(e), status=500)

    @http.route('/api/bbweb/projects/<int:project_id>', type='http', auth='public', methods=['GET', 'OPTIONS'], csrf=False, cors='*')
    def get_project(self, project_id, **kwargs):
        """Get a single featured project by ID"""
        try:
            if request.httprequest.method == 'OPTIONS':
                return self._json_response({})
            
            project = request.env['bbweb.featured.project'].sudo().browse(project_id)
            if not project.exists() or not project.active:
                return self._error_response('Project not found', status=404)
            
            data = {
                'id': project.id,
                'title': project.name,
                'category': project.category,
                'description': project.description,
                'results': [r.result for r in project.result_ids],
                'tags': [t.name for t in project.tag_ids],
                'gradient': project.gradient,
                'image': project.image.decode('utf-8') if project.image else None,
            }
            return self._json_response(data)
        except Exception as e:
            return self._error_response(str(e), status=500)

    # Team Members Endpoints
    @http.route('/api/bbweb/team', type='http', auth='public', methods=['GET', 'OPTIONS'], csrf=False, cors='*')
    def get_team(self, **kwargs):
        """Get all active team members"""
        try:
            if request.httprequest.method == 'OPTIONS':
                return self._json_response({})
            
            team = request.env['bbweb.team.member'].sudo().get_api_data()
            return self._json_response(team)
        except Exception as e:
            return self._error_response(str(e), status=500)

    @http.route('/api/bbweb/team/<int:member_id>', type='http', auth='public', methods=['GET', 'OPTIONS'], csrf=False, cors='*')
    def get_team_member(self, member_id, **kwargs):
        """Get a single team member by ID"""
        try:
            if request.httprequest.method == 'OPTIONS':
                return self._json_response({})
            
            member = request.env['bbweb.team.member'].sudo().browse(member_id)
            if not member.exists() or not member.active:
                return self._error_response('Team member not found', status=404)
            
            data = {
                'id': member.id,
                'name': member.name,
                'role': member.role,
                'specialty': member.specialty,
                'bio': member.bio,
                'certifications': [c.name for c in member.certification_ids],
                'image': member.image.decode('utf-8') if member.image else None,
                'linkedin_url': member.linkedin_url or '',
                'github_url': member.github_url or '',
                'twitter_url': member.twitter_url or '',
            }
            return self._json_response(data)
        except Exception as e:
            return self._error_response(str(e), status=500)

    # Blog Posts Endpoints
    @http.route('/api/bbweb/blogs', type='http', auth='public', methods=['GET', 'OPTIONS'], csrf=False, cors='*')
    def get_blogs(self, category=None, **kwargs):
        """Get all active blog posts, optionally filtered by category"""
        try:
            if request.httprequest.method == 'OPTIONS':
                return self._json_response({})
            
            # Map frontend category names to database values
            category_map = {
                'AI/ML': 'ai_ml',
                'Automation': 'automation',
                'Development': 'development',
                'Industry News': 'industry_news',
            }
            
            category_filter = category_map.get(category) if category else None
            blogs = request.env['bbweb.blog.post'].sudo().get_api_data(category_filter=category_filter)
            return self._json_response(blogs)
        except Exception as e:
            return self._error_response(str(e), status=500)

    @http.route('/api/bbweb/blogs/featured', type='http', auth='public', methods=['GET', 'OPTIONS'], csrf=False, cors='*')
    def get_featured_blogs(self, **kwargs):
        """Get all featured blog posts"""
        try:
            if request.httprequest.method == 'OPTIONS':
                return self._json_response({})
            
            blogs = request.env['bbweb.blog.post'].sudo().get_api_data(featured_only=True)
            return self._json_response(blogs)
        except Exception as e:
            return self._error_response(str(e), status=500)

    @http.route('/api/bbweb/blogs/<int:blog_id>', type='http', auth='public', methods=['GET', 'OPTIONS'], csrf=False, cors='*')
    def get_blog(self, blog_id, **kwargs):
        """Get a single blog post by ID"""
        try:
            if request.httprequest.method == 'OPTIONS':
                return self._json_response({})
            
            blog = request.env['bbweb.blog.post'].sudo().browse(blog_id)
            if not blog.exists() or not blog.active:
                return self._error_response('Blog post not found', status=404)
            
            category_map = {
                'ai_ml': 'AI/ML',
                'automation': 'Automation',
                'development': 'Development',
                'industry_news': 'Industry News',
            }
            
            # Process content to fix relative URLs for images
            processed_content = blog._process_html_content(blog.content)
            
            data = {
                'id': str(blog.id),
                'title': blog.title,
                'slug': blog.slug,
                'excerpt': blog.excerpt,
                'content': processed_content,
                'category': category_map.get(blog.category, blog.category),
                'author': {
                    'name': blog.author_name,
                    'avatar': blog.author_avatar or blog.author_name[:2].upper(),
                },
                'date': blog.publish_date.strftime('%Y-%m-%d') if blog.publish_date else '',
                'readTime': blog.read_time,
                'image': blog.image.decode('utf-8') if blog.image else None,
                'featured': blog.featured,
                'seo_title': blog.seo_title or blog.title,
                'seo_description': blog.seo_description or blog.excerpt,
                'seo_keywords': blog.seo_keywords or '',
                'og_image': blog.og_image.decode('utf-8') if blog.og_image else (blog.image.decode('utf-8') if blog.image else None),
            }
            return self._json_response(data)
        except Exception as e:
            return self._error_response(str(e), status=500)

    @http.route('/api/bbweb/blogs/slug/<slug>', type='http', auth='public', methods=['GET', 'OPTIONS'], csrf=False, cors='*')
    def get_blog_by_slug(self, slug, **kwargs):
        """Get a single blog post by slug"""
        try:
            if request.httprequest.method == 'OPTIONS':
                return self._json_response({})
            
            blog = request.env['bbweb.blog.post'].sudo().search([
                ('slug', '=', slug),
                ('active', '=', True)
            ], limit=1)
            
            if not blog:
                return self._error_response('Blog post not found', status=404)
            
            category_map = {
                'ai_ml': 'AI/ML',
                'automation': 'Automation',
                'development': 'Development',
                'industry_news': 'Industry News',
            }
            
            # Process content to fix relative URLs for images
            processed_content = blog._process_html_content(blog.content)
            
            data = {
                'id': str(blog.id),
                'title': blog.title,
                'slug': blog.slug,
                'excerpt': blog.excerpt,
                'content': processed_content,
                'category': category_map.get(blog.category, blog.category),
                'author': {
                    'name': blog.author_name,
                    'avatar': blog.author_avatar or blog.author_name[:2].upper(),
                },
                'date': blog.publish_date.strftime('%Y-%m-%d') if blog.publish_date else '',
                'readTime': blog.read_time,
                'image': blog.image.decode('utf-8') if blog.image else None,
                'featured': blog.featured,
                'seo_title': blog.seo_title or blog.title,
                'seo_description': blog.seo_description or blog.excerpt,
                'seo_keywords': blog.seo_keywords or '',
                'og_image': blog.og_image.decode('utf-8') if blog.og_image else (blog.image.decode('utf-8') if blog.image else None),
            }
            return self._json_response(data)
        except Exception as e:
            return self._error_response(str(e), status=500)

    # Careers Endpoints
    @http.route('/api/bbweb/careers', type='http', auth='public', methods=['GET', 'OPTIONS'], csrf=False, cors='*')
    def get_careers(self, department=None, **kwargs):
        """Get all active career listings, optionally filtered by department"""
        try:
            if request.httprequest.method == 'OPTIONS':
                return self._json_response({})
            
            careers = request.env['bbweb.career'].sudo().get_api_data(department_filter=department)
            return self._json_response(careers)
        except Exception as e:
            return self._error_response(str(e), status=500)

    @http.route('/api/bbweb/careers/<int:career_id>', type='http', auth='public', methods=['GET', 'OPTIONS'], csrf=False, cors='*')
    def get_career(self, career_id, **kwargs):
        """Get a single career listing by ID"""
        try:
            if request.httprequest.method == 'OPTIONS':
                return self._json_response({})
            
            career = request.env['bbweb.career'].sudo().browse(career_id)
            if not career.exists() or not career.active:
                return self._error_response('Career listing not found', status=404)
            
            type_map = {
                'full_time': 'Full-time',
                'part_time': 'Part-time',
                'contract': 'Contract',
                'remote': 'Remote',
                'hybrid': 'Hybrid',
            }
            
            data = {
                'id': str(career.id),
                'title': career.title,
                'department': career.department,
                'location': career.location,
                'type': type_map.get(career.employment_type, career.employment_type),
                'description': career.description,
                'requirements': [r.requirement for r in career.requirement_ids],
                'responsibilities': [r.responsibility for r in career.responsibility_ids],
            }
            return self._json_response(data)
        except Exception as e:
            return self._error_response(str(e), status=500)
