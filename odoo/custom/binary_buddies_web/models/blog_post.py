# -*- coding: utf-8 -*-

from odoo import models, fields, api
import re
import unicodedata


class BlogPost(models.Model):
    _name = 'bbweb.blog.post'
    _description = 'Blog Post'
    _order = 'publish_date desc, id desc'

    title = fields.Char(string='Title', required=True)
    slug = fields.Char(
        string='Slug',
        required=True,
        index=True,
        help='URL-friendly version of the title (auto-generated)'
    )
    excerpt = fields.Text(string='Excerpt', required=True, help='Short summary of the blog post')
    
    # SEO fields
    seo_title = fields.Char(
        string='SEO Title',
        help='Custom title for search engines (defaults to title if not set)'
    )
    seo_description = fields.Text(
        string='SEO Description',
        help='Meta description for search engines (defaults to excerpt if not set)'
    )
    seo_keywords = fields.Char(
        string='SEO Keywords',
        help='Comma-separated keywords for SEO'
    )
    og_image = fields.Binary(
        string='Open Graph Image',
        attachment=True,
        help='Image for social media sharing (defaults to featured image if not set)'
    )
    og_image_filename = fields.Char(string='OG Image Filename')
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
    image = fields.Binary(
        string='Preview Image',
        attachment=True,
        help='Preview image displayed in blog listing page. Recommended size: 800x400px. If not set, a placeholder will be shown.'
    )
    image_filename = fields.Char(string='Image Filename')
    
    # Tags
    tag_ids = fields.Many2many(
        'bbweb.blog.tag',
        string='Tags',
        help='Tags for categorizing and organizing blog posts'
    )
    
    # Status
    featured = fields.Boolean(string='Featured Post', default=False)
    active = fields.Boolean(string='Active', default=True)
    
    # View count for analytics
    view_count = fields.Integer(string='View Count', default=0, help='Number of times this blog post has been viewed')
    
    _sql_constraints = [
        ('slug_unique', 'UNIQUE(slug)', 'The slug must be unique!'),
    ]
    
    def increment_view_count(self):
        """Increment the view count for this blog post"""
        self.write({'view_count': self.view_count + 1})
    
    def _slugify(self, text):
        """
        Convert text to a URL-friendly slug.
        - Lowercase
        - Replace spaces and special chars with hyphens
        - Remove non-alphanumeric except hyphens
        - Limit length
        """
        if not text:
            return ''
        
        # Normalize unicode characters (e.g., é -> e)
        text = unicodedata.normalize('NFKD', text)
        text = text.encode('ascii', 'ignore').decode('ascii')
        
        # Convert to lowercase and replace spaces/special chars with hyphens
        text = re.sub(r'[^\w\s-]', '', text.lower())
        text = re.sub(r'[-\s]+', '-', text)
        text = text.strip('-')
        
        # Limit length to 100 characters
        if len(text) > 100:
            text = text[:100].rstrip('-')
        
        return text
    
    def _generate_unique_slug(self, base_slug, exclude_id=None):
        """Generate a unique slug by appending a number if needed"""
        slug = base_slug
        counter = 1
        
        while True:
            domain = [('slug', '=', slug)]
            if exclude_id:
                domain.append(('id', '!=', exclude_id))
            
            existing = self.search(domain, limit=1)
            if not existing:
                return slug
            
            slug = f"{base_slug}-{counter}"
            counter += 1
    
    @api.model
    def create(self, vals):
        """Auto-generate slug if not provided"""
        if 'slug' not in vals or not vals.get('slug'):
            if 'title' in vals and vals.get('title'):
                base_slug = self._slugify(vals['title'])
                vals['slug'] = self._generate_unique_slug(base_slug)
        elif vals.get('slug'):
            # Ensure slug is properly formatted
            base_slug = self._slugify(vals['slug'])
            vals['slug'] = self._generate_unique_slug(base_slug)
        
        return super(BlogPost, self).create(vals)
    
    def write(self, vals):
        """Update slug if title changes"""
        for record in self:
            if 'title' in vals and vals.get('title') != record.title:
                # Only auto-update slug if it wasn't manually changed
                if 'slug' not in vals:
                    base_slug = self._slugify(vals['title'])
                    vals['slug'] = self._generate_unique_slug(base_slug, exclude_id=record.id)
            elif 'slug' in vals and vals.get('slug'):
                # Ensure slug is properly formatted
                base_slug = self._slugify(vals['slug'])
                vals['slug'] = self._generate_unique_slug(base_slug, exclude_id=record.id)
        
        return super(BlogPost, self).write(vals)
    
    @api.model
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
    
    def _get_image_url(self, has_image, image_id):
        """Generate URL for serving image via API - use relative URL for Next.js proxy"""
        # Check if image exists (binary field can be False, empty bytes, or None)
        if not has_image:
            return None
        # Use relative URL so it goes through Next.js rewrite proxy
        return f"/api/bbweb/blogs/{image_id}/image"
    
    def _get_og_image_url(self, has_og_image, has_image, image_id):
        """Generate URL for serving OG image via API - use relative URL for Next.js proxy"""
        if has_og_image:
            return f"/api/bbweb/blogs/{image_id}/og-image"
        elif has_image:
            return f"/api/bbweb/blogs/{image_id}/image"
        return None
    
    @api.model
    def get_api_data(self, category_filter=None, featured_only=False, page=1, limit=None):
        """
        Return data formatted for API consumption with pagination support
        
        Args:
            category_filter: Filter by category
            featured_only: Only return featured posts
            page: Page number (1-indexed)
            limit: Number of items per page (None = all)
        
        Returns:
            dict with 'data' (list of posts) and 'pagination' (dict with total, page, limit, has_more)
        """
        domain = [('active', '=', True)]
        
        if category_filter:
            domain.append(('category', '=', category_filter))
        
        if featured_only:
            domain.append(('featured', '=', True))
        
        # Get total count for pagination
        total_count = self.search_count(domain)
        
        # Calculate offset
        if limit:
            offset = (page - 1) * limit
            posts = self.search(domain, order='publish_date desc, id desc', limit=limit, offset=offset)
        else:
            posts = self.search(domain, order='publish_date desc, id desc')
        
        result = []
        base_url = self._get_base_url()
        
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
            
            # Generate image URLs instead of base64
            # Check if images exist (binary fields can be False, empty, or None)
            has_image = bool(post.image)
            has_og_image = bool(post.og_image)
            image_url = post._get_image_url(has_image, post.id)
            og_image_url = post._get_og_image_url(has_og_image, has_image, post.id)
            
            result.append({
                'id': str(post.id),
                'title': post.title,
                'slug': post.slug,
                'excerpt': post.excerpt,
                'content': processed_content,
                'category': category_map.get(post.category, post.category),
                'author': {
                    'name': post.author_name,
                    'avatar': post.author_avatar or post.author_name[:2].upper(),
                },
                'date': post.publish_date.strftime('%Y-%m-%d') if post.publish_date else '',
                'readTime': post.read_time,
                'image': image_url,  # URL instead of base64
                'featured': post.featured,
                'tags': [t.name for t in post.tag_ids],
                'seo_title': post.seo_title or post.title,
                'seo_description': post.seo_description or post.excerpt,
                'seo_keywords': post.seo_keywords or '',
                'og_image': og_image_url,  # URL instead of base64
                'view_count': post.view_count,
            })
        
        # Build pagination info
        pagination = {
            'total': total_count,
            'page': page,
            'limit': limit or total_count,
            'has_more': limit and (offset + len(posts) < total_count) if limit else False,
        }
        
        return {
            'data': result,
            'pagination': pagination,
        }

