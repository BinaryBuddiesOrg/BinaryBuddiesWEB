# -*- coding: utf-8 -*-

from odoo import models, fields, api, _
from odoo.exceptions import ValidationError
from odoo.tools.mail import html2plaintext
from datetime import datetime, timezone
import random
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
    
    category_id = fields.Many2one(
        'bbweb.blog.category',
        string='Category',
        required=False,
        ondelete='restrict',
        index=True,
        help='Stored nullable so upgrades run before category XML is loaded; always set on create.',
    )
    
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
    
    # Engagement counts (denormalized for performance - updated by likes/comments on create/unlink)
    like_count = fields.Integer(string='Like Count', default=0, index=True, help='Number of likes on this blog post')
    comment_count = fields.Integer(string='Comment Count', default=0, help='Number of comments on this blog post')
    
    # Relationships to comments and likes
    comment_ids = fields.One2many('bbweb.blog.comment', 'blog_id', string='Comments')
    like_ids = fields.One2many('bbweb.blog.like', 'blog_id', string='Likes')
    
    _sql_constraints = [
        ('slug_unique', 'UNIQUE(slug)', 'The slug must be unique!'),
    ]

    @api.model
    def _resolve_default_category_id(self):
        """Prefer XML id; fallback search (safe when ref missing during early registry init)."""
        ref = self.env.ref('binary_buddies_web.blog_category_development', raise_if_not_found=False)
        if ref:
            return ref.id
        cat = self.env['bbweb.blog.category'].search([('code', '=', 'development')], limit=1)
        return cat.id if cat else False

    @api.constrains('category_id')
    def _check_category_id(self):
        for post in self:
            if not post.category_id:
                raise ValidationError(_('Blog post must have a category.'))

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
        vals = dict(vals)
        if not vals.get('category_id'):
            cid = self._resolve_default_category_id()
            if not cid:
                raise ValidationError(
                    _('No blog category is configured. Create a category with code "development" or reload module data.')
                )
            vals['category_id'] = cid
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

    @api.model
    def _get_public_site_base_url(self):
        """Public marketing site origin for canonical blog links (LLM / SERP-style API)."""
        param = self.env['ir.config_parameter'].sudo().get_param('bbweb.public_site_url')
        base = (param or '').strip() or self._get_base_url()
        return base.rstrip('/')

    def _get_public_blog_url(self):
        return '%s/blog/%s' % (self._get_public_site_base_url(), self.slug)

    @api.model
    def _plain_snippet(self, text, max_len=320):
        if not text:
            return ''
        text = ' '.join(text.split())
        if len(text) <= max_len:
            return text
        return text[: max_len - 1].rstrip() + '…'

    @api.model
    def _post_plain_body(self, post):
        if not post.content:
            return ''
        try:
            return html2plaintext(post.content, include_references=False)
        except Exception:
            return ''

    @api.model
    def _serp_relevance_key(self, post, q_lower):
        """Lower tier = higher relevance when filtering by q."""
        if not q_lower:
            return (0, -(post.publish_date or fields.Date.today()).toordinal(), -post.id)
        title = (post.title or '').lower()
        excerpt = (post.excerpt or '').lower()
        body = self._post_plain_body(post).lower()
        if title.startswith(q_lower):
            tier = 0
        elif q_lower in title:
            tier = 1
        elif q_lower in excerpt:
            tier = 2
        elif q_lower in body:
            tier = 3
        else:
            tier = 4
        return (tier, -(post.publish_date or fields.Date.today()).toordinal(), -post.id)

    @api.model
    def get_serp_search(
        self,
        q=None,
        category=None,
        category_code=None,
        tag=None,
        slug=None,
        since=None,
        until=None,
        featured_only=False,
        page=1,
        limit=20,
        include_body=False,
        random_sample=False,
        max_snippet_len=320,
        max_body_len=12000,
        random_pool_max=500,
    ):
        """
        Serp-style JSON for integrations / LLMs: metadata + organic_results (plain snippets).

        :param q: Search substring for title, excerpt, HTML body (ilike).
        :param since/until: publish_date bounds (YYYY-MM-DD strings).
        :param random_sample: If True, shuffle posts matching the domain (cap random_pool_max for performance).
        """
        Blog = self.sudo()
        domain = [('active', '=', True)]

        if slug and str(slug).strip():
            domain.append(('slug', '=', str(slug).strip()))

        if featured_only:
            domain.append(('featured', '=', True))

        if category_code and str(category_code).strip():
            cat = Blog.env['bbweb.blog.category'].search(
                [('code', '=', str(category_code).strip()), ('active', '=', True)],
                limit=1,
            )
            if cat:
                domain.append(('category_id', '=', cat.id))
            else:
                domain.append(('id', '=', 0))

        if category and str(category).strip():
            cat = Blog.env['bbweb.blog.category'].resolve_from_api_filter(str(category).strip())
            if cat:
                domain.append(('category_id', '=', cat.id))
            else:
                domain.append(('id', '=', 0))

        if tag and str(tag).strip():
            tag_rec = Blog.env['bbweb.blog.tag'].sudo().search(
                [('name', '=ilike', str(tag).strip())],
                limit=1,
            )
            if tag_rec:
                domain.append(('tag_ids', 'in', [tag_rec.id]))
            else:
                domain.append(('id', '=', 0))

        def _parse_date(label, value):
            if value is None or value == '':
                return None
            s = str(value).strip()
            if not s:
                return None
            try:
                return fields.Date.from_string(s[:10])
            except ValueError:
                raise ValidationError(_('Invalid date for %(label)s: %(value)s') % {'label': label, 'value': value})

        d_since = _parse_date('since', since)
        d_until = _parse_date('until', until)
        if d_since:
            domain.append(('publish_date', '>=', d_since))
        if d_until:
            domain.append(('publish_date', '<=', d_until))

        q_strip = (q or '').strip()
        q_lower = q_strip.lower()
        if q_strip:
            pat = '%%%s%%' % q_strip.replace('\\', '\\\\').replace('%', r'\%').replace('_', r'\_')
            domain = [
                '|', '|',
                ('title', 'ilike', pat),
                ('excerpt', 'ilike', pat),
                ('content', 'ilike', pat),
            ] + domain

        total = Blog.search_count(domain)
        offset = (page - 1) * limit

        try:
            pool_cap = max(1, min(int(random_pool_max), 2000))
        except (TypeError, ValueError):
            pool_cap = 500

        if random_sample:
            pool_size = min(total, pool_cap)
            candidates = Blog.search(domain, order='publish_date desc, id desc', limit=pool_size)
            ids_shuffled = list(candidates.ids)
            random.shuffle(ids_shuffled)
            page_ids = ids_shuffled[offset : offset + limit]
            posts = Blog.browse(page_ids)
        else:
            posts = Blog.search(domain, order='publish_date desc, id desc', limit=limit, offset=offset)
            if q_strip:
                posts = posts.sorted(key=lambda p: Blog._serp_relevance_key(p, q_lower))

        processed_at = datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace('+00:00', 'Z')
        organic = []
        for idx, post in enumerate(posts, start=1):
            pos = offset + idx
            excerpt_plain = ' '.join((post.excerpt or '').split())
            snippet = Blog._plain_snippet(excerpt_plain, max_snippet_len)
            row = {
                'position': pos,
                'title': post.title or '',
                'link': post._get_public_blog_url(),
                'snippet': snippet,
                'blog_id': post.id,
                'slug': post.slug,
                'category': post.category_id.name if post.category_id else '',
                'category_code': post.category_id.code if post.category_id else '',
                'published_date': post.publish_date.strftime('%Y-%m-%d') if post.publish_date else '',
                'author_name': post.author_name or '',
                'tags': [t.name for t in post.tag_ids],
                'featured': post.featured,
                'api_detail_url': '%s/api/bbweb/blogs/%s' % (Blog._get_base_url(), post.id),
                'api_slug_url': '%s/api/bbweb/blogs/slug/%s' % (Blog._get_base_url(), post.slug),
            }
            if include_body:
                body = Blog._post_plain_body(post)
                row['content_text'] = body[:max_body_len] + ('…' if len(body) > max_body_len else '')
            organic.append(row)

        effective_total = min(total, pool_cap) if random_sample else total
        has_more = offset + len(organic) < effective_total

        meta = {
            'status': 'Success',
            'engine': 'bbweb_blog',
            'q': q_strip,
            'total_results': total,
            'page': page,
            'limit': limit,
            'has_more': has_more,
            'processed_at': processed_at,
            'include_body': include_body,
            'random': bool(random_sample),
        }
        if random_sample:
            pool_size = min(total, pool_cap)
            meta['random_pool_size'] = pool_size
            meta['random_pool_capped'] = total > pool_cap
            meta['random_pool_max'] = pool_cap

        return {
            'search_metadata': meta,
            'organic_results': organic,
        }
    
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
            domain.append(('category_id', '=', category_filter.id))
        
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
                'category': post.category_id.name if post.category_id else '',
                'category_code': post.category_id.code if post.category_id else '',
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

