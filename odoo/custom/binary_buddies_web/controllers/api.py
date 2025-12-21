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
    def get_blogs(self, category=None, page=1, limit=None, **kwargs):
        """Get all active blog posts, optionally filtered by category, with pagination"""
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
            
            # Parse pagination parameters
            try:
                page = int(page) if page else 1
                limit = int(limit) if limit else None
            except (ValueError, TypeError):
                page = 1
                limit = None
            
            result = request.env['bbweb.blog.post'].sudo().get_api_data(
                category_filter=category_filter,
                page=page,
                limit=limit
            )
            return self._json_response(result)
        except Exception as e:
            return self._error_response(str(e), status=500)

    @http.route('/api/bbweb/blogs/featured', type='http', auth='public', methods=['GET', 'OPTIONS'], csrf=False, cors='*')
    def get_featured_blogs(self, page=1, limit=None, **kwargs):
        """Get all featured blog posts with pagination"""
        try:
            if request.httprequest.method == 'OPTIONS':
                return self._json_response({})
            
            # Parse pagination parameters
            try:
                page = int(page) if page else 1
                limit = int(limit) if limit else None
            except (ValueError, TypeError):
                page = 1
                limit = None
            
            result = request.env['bbweb.blog.post'].sudo().get_api_data(
                featured_only=True,
                page=page,
                limit=limit
            )
            return self._json_response(result)
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
            
            # Generate image URLs instead of base64
            has_image = bool(blog.image)
            has_og_image = bool(blog.og_image)
            image_url = blog._get_image_url(has_image, blog.id)
            og_image_url = blog._get_og_image_url(has_og_image, has_image, blog.id)
            
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
                'image': image_url,  # URL instead of base64
                'featured': blog.featured,
                'tags': [t.name for t in blog.tag_ids],
                'seo_title': blog.seo_title or blog.title,
                'seo_description': blog.seo_description or blog.excerpt,
                'seo_keywords': blog.seo_keywords or '',
                'og_image': og_image_url,  # URL instead of base64
                'view_count': blog.view_count,
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
            
            # Generate image URLs instead of base64
            has_image = bool(blog.image)
            has_og_image = bool(blog.og_image)
            image_url = blog._get_image_url(has_image, blog.id)
            og_image_url = blog._get_og_image_url(has_og_image, has_image, blog.id)
            
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
                'image': image_url,  # URL instead of base64
                'featured': blog.featured,
                'tags': [t.name for t in blog.tag_ids],
                'seo_title': blog.seo_title or blog.title,
                'seo_description': blog.seo_description or blog.excerpt,
                'seo_keywords': blog.seo_keywords or '',
                'og_image': og_image_url,  # URL instead of base64
                'view_count': blog.view_count,
            }
            return self._json_response(data)
        except Exception as e:
            return self._error_response(str(e), status=500)
    
    @http.route('/api/bbweb/blogs/<int:blog_id>/image', type='http', auth='public', methods=['GET', 'OPTIONS'], csrf=False, cors='*')
    def get_blog_image(self, blog_id, **kwargs):
        """Serve blog preview image"""
        try:
            if request.httprequest.method == 'OPTIONS':
                return request.make_response(
                    b'',
                    headers=[
                        ('Access-Control-Allow-Origin', '*'),
                        ('Access-Control-Allow-Methods', 'GET, OPTIONS'),
                        ('Access-Control-Allow-Headers', 'Content-Type'),
                    ]
                )
            
            blog = request.env['bbweb.blog.post'].sudo().browse(blog_id)
            if not blog.exists() or not blog.image:
                return self._error_response('Image not found', status=404)
            
            # Get image data - Odoo binary fields are stored as base64 strings
            import base64
            image_data = blog.image
            if not image_data:
                return self._error_response('Image not found', status=404)
            
            # Decode base64 to get actual binary data
            # Odoo stores binary fields as base64-encoded strings
            if isinstance(image_data, str):
                try:
                    image_data = base64.b64decode(image_data)
                except Exception as e:
                    return self._error_response(f'Failed to decode image: {str(e)}', status=500)
            elif isinstance(image_data, bytes):
                # If it's already bytes, check if it's base64-encoded text
                try:
                    # Try to decode as base64 if it looks like base64
                    decoded = base64.b64decode(image_data)
                    image_data = decoded
                except:
                    # If decoding fails, assume it's already binary
                    pass
            
            # Detect image type from binary data
            content_type = 'image/jpeg'  # Default
            
            # Check image signature to determine type
            if len(image_data) > 0:
                if image_data.startswith(b'\x89PNG\r\n\x1a\n'):
                    content_type = 'image/png'
                elif image_data.startswith(b'GIF87a') or image_data.startswith(b'GIF89a'):
                    content_type = 'image/gif'
                elif len(image_data) > 12 and image_data.startswith(b'RIFF') and b'WEBP' in image_data[:12]:
                    content_type = 'image/webp'
                elif image_data.startswith(b'\xff\xd8\xff'):
                    content_type = 'image/jpeg'
            
            # Return image with proper headers
            return request.make_response(
                image_data,
                headers=[
                    ('Content-Type', content_type),
                    ('Cache-Control', 'public, max-age=31536000'),  # Cache for 1 year
                    ('Access-Control-Allow-Origin', '*'),
                    ('Access-Control-Allow-Methods', 'GET, OPTIONS'),
                    ('Access-Control-Allow-Headers', 'Content-Type'),
                ]
            )
        except Exception as e:
            import traceback
            traceback.print_exc()
            return self._error_response(str(e), status=500)
    
    @http.route('/api/bbweb/blogs/<int:blog_id>/og-image', type='http', auth='public', methods=['GET', 'OPTIONS'], csrf=False, cors='*')
    def get_blog_og_image(self, blog_id, **kwargs):
        """Serve blog OG image"""
        try:
            if request.httprequest.method == 'OPTIONS':
                return request.make_response(
                    b'',
                    headers=[
                        ('Access-Control-Allow-Origin', '*'),
                        ('Access-Control-Allow-Methods', 'GET, OPTIONS'),
                        ('Access-Control-Allow-Headers', 'Content-Type'),
                    ]
                )
            
            blog = request.env['bbweb.blog.post'].sudo().browse(blog_id)
            if not blog.exists():
                return self._error_response('Blog post not found', status=404)
            
            # Use OG image if available, otherwise fallback to preview image
            import base64
            image_data = blog.og_image if blog.og_image else blog.image
            if not image_data:
                return self._error_response('Image not found', status=404)
            
            # Decode base64 to get actual binary data
            # Odoo stores binary fields as base64-encoded strings
            if isinstance(image_data, str):
                try:
                    image_data = base64.b64decode(image_data)
                except Exception as e:
                    return self._error_response(f'Failed to decode image: {str(e)}', status=500)
            elif isinstance(image_data, bytes):
                # If it's already bytes, check if it's base64-encoded text
                try:
                    # Try to decode as base64 if it looks like base64
                    decoded = base64.b64decode(image_data)
                    image_data = decoded
                except:
                    # If decoding fails, assume it's already binary
                    pass
            
            # Detect image type from binary data
            content_type = 'image/jpeg'  # Default
            
            # Check image signature to determine type
            if len(image_data) > 0:
                if image_data.startswith(b'\x89PNG\r\n\x1a\n'):
                    content_type = 'image/png'
                elif image_data.startswith(b'GIF87a') or image_data.startswith(b'GIF89a'):
                    content_type = 'image/gif'
                elif len(image_data) > 12 and image_data.startswith(b'RIFF') and b'WEBP' in image_data[:12]:
                    content_type = 'image/webp'
                elif image_data.startswith(b'\xff\xd8\xff'):
                    content_type = 'image/jpeg'
            
            # Return image with proper headers
            return request.make_response(
                image_data,
                headers=[
                    ('Content-Type', content_type),
                    ('Cache-Control', 'public, max-age=31536000'),  # Cache for 1 year
                    ('Access-Control-Allow-Origin', '*'),
                    ('Access-Control-Allow-Methods', 'GET, OPTIONS'),
                    ('Access-Control-Allow-Headers', 'Content-Type'),
                ]
            )
        except Exception as e:
            import traceback
            traceback.print_exc()
            return self._error_response(str(e), status=500)
    
    @http.route('/api/bbweb/blogs/<int:blog_id>/view', type='http', auth='public', methods=['POST', 'OPTIONS'], csrf=False, cors='*')
    def increment_blog_view(self, blog_id, **kwargs):
        """Increment view count for a blog post"""
        try:
            if request.httprequest.method == 'OPTIONS':
                return self._json_response({})
            
            blog = request.env['bbweb.blog.post'].sudo().browse(blog_id)
            if not blog.exists() or not blog.active:
                return self._error_response('Blog post not found', status=404)
            
            blog.increment_view_count()
            return self._json_response({'status': 'success', 'view_count': blog.view_count})
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

    # Website Page SEO Endpoints
    @http.route('/api/bbweb/seo/<path:page_path>', type='http', auth='public', methods=['GET', 'OPTIONS'], csrf=False, cors='*')
    def get_page_seo(self, page_path, **kwargs):
        """Get SEO settings for a specific page path"""
        try:
            if request.httprequest.method == 'OPTIONS':
                return self._json_response({})
            
            # Ensure path starts with /
            if not page_path.startswith('/'):
                page_path = '/' + page_path
            
            seo = request.env['bbweb.website.page.seo'].sudo().get_seo_by_path(page_path)
            
            if not seo:
                return self._error_response('SEO settings not found for this page', status=404)
            
            return self._json_response(seo)
        except Exception as e:
            return self._error_response(str(e), status=500)

    @http.route('/api/bbweb/seo', type='http', auth='public', methods=['GET', 'OPTIONS'], csrf=False, cors='*')
    def get_all_seo(self, **kwargs):
        """Get all active SEO settings"""
        try:
            if request.httprequest.method == 'OPTIONS':
                return self._json_response({})
            
            seo_list = request.env['bbweb.website.page.seo'].sudo().get_all_active_seo()
            return self._json_response(seo_list)
        except Exception as e:
            return self._error_response(str(e), status=500)
