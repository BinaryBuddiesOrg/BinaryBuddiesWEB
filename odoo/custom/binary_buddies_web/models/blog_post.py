# -*- coding: utf-8 -*-

from odoo import models, fields, api
import base64
import re


class BlogPost(models.Model):
    _name = 'bbweb.blog.post'
    _description = 'Blog Post'
    _order = 'publish_date desc, id desc'

    title = fields.Char(string='Title', required=True)
    excerpt = fields.Text(string='Excerpt', required=True, help='Short summary of the blog post')
    # Completely disable sanitization to allow iframe embeds (YouTube, Vimeo, etc.)
    # Note: Only trusted admin users should edit blog content
    content = fields.Html(
        string='Content', 
        required=True, 
        sanitize=False,
        sanitize_tags=False,
        sanitize_attributes=False,
        sanitize_style=False,
        sanitize_form=False,
        strip_style=False,
        strip_classes=False,
    )
    
    category = fields.Selection([
        ('ai_ml', 'AI/ML'),
        ('automation', 'Automation'),
        ('development', 'Development'),
        ('industry_news', 'Industry News'),
    ], string='Category', required=True, default='development')
    
    # Author information
    author_name = fields.Char(string='Author Name', required=True)
    author_avatar = fields.Char(string='Author Avatar', help='Initials for avatar (e.g., "SC" for Sarah Chen)')
    
    # Publishing details
    publish_date = fields.Date(string='Publish Date', required=True, default=fields.Date.today)
    read_time = fields.Char(string='Read Time', default='5 min read', help='e.g., "8 min read"')
    
    # Image field
    image = fields.Binary(string='Featured Image', attachment=True)
    image_filename = fields.Char(string='Image Filename')
    
    # Status
    featured = fields.Boolean(string='Featured Post', default=False)
    active = fields.Boolean(string='Active', default=True)
    
    def _get_base_url(self):
        """Get the base URL for the Odoo instance"""
        base_url = self.env['ir.config_parameter'].sudo().get_param('web.base.url')
        return base_url or 'http://localhost:8069'
    
    def _process_html_content(self, html_content):
        """
        Process HTML content to convert relative URLs to absolute URLs.
        This ensures images and other resources load correctly on the frontend.
        """
        if not html_content:
            return html_content
        
        base_url = self._get_base_url()
        
        # Pattern to match src attributes with relative URLs
        # Matches: src="/web/image/...", src="/web/content/...", src="/web_editor/..."
        patterns = [
            (r'src="(/web/image[^"]*)"', f'src="{base_url}\\1"'),
            (r'src="(/web/content[^"]*)"', f'src="{base_url}\\1"'),
            (r'src="(/web_editor[^"]*)"', f'src="{base_url}\\1"'),
            (r"src='(/web/image[^']*)'", f"src='{base_url}\\1'"),
            (r"src='(/web/content[^']*)'", f"src='{base_url}\\1'"),
            (r"src='(/web_editor[^']*)'", f"src='{base_url}\\1'"),
            # Also handle href for links to images/files
            (r'href="(/web/image[^"]*)"', f'href="{base_url}\\1"'),
            (r'href="(/web/content[^"]*)"', f'href="{base_url}\\1"'),
        ]
        
        processed_content = html_content
        for pattern, replacement in patterns:
            processed_content = re.sub(pattern, replacement, processed_content)
        
        return processed_content
    
    @api.model
    def get_api_data(self, category_filter=None, featured_only=False):
        """Return data formatted for API consumption"""
        domain = [('active', '=', True)]
        
        if category_filter:
            domain.append(('category', '=', category_filter))
        
        if featured_only:
            domain.append(('featured', '=', True))
        
        posts = self.search(domain, order='publish_date desc, id desc')
        result = []
        
        # Category mapping for API
        category_map = {
            'ai_ml': 'AI/ML',
            'automation': 'Automation',
            'development': 'Development',
            'industry_news': 'Industry News',
        }
        
        for post in posts:
            # Process content to fix relative URLs
            processed_content = post._process_html_content(post.content)
            
            result.append({
                'id': str(post.id),
                'title': post.title,
                'excerpt': post.excerpt,
                'content': processed_content,
                'category': category_map.get(post.category, post.category),
                'author': {
                    'name': post.author_name,
                    'avatar': post.author_avatar or post.author_name[:2].upper(),
                },
                'date': post.publish_date.strftime('%Y-%m-%d') if post.publish_date else '',
                'readTime': post.read_time,
                'image': base64.b64encode(post.image).decode('utf-8') if post.image else None,
                'featured': post.featured,
            })
        
        return result

