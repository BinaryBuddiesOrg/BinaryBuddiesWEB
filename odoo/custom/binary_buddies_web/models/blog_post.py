# -*- coding: utf-8 -*-

from odoo import models, fields, api
import base64


class BlogPost(models.Model):
    _name = 'bbweb.blog.post'
    _description = 'Blog Post'
    _order = 'publish_date desc, id desc'

    title = fields.Char(string='Title', required=True)
    excerpt = fields.Text(string='Excerpt', required=True, help='Short summary of the blog post')
    content = fields.Html(string='Content', required=True)
    
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
            result.append({
                'id': str(post.id),
                'title': post.title,
                'excerpt': post.excerpt,
                'content': post.content,
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
