# -*- coding: utf-8 -*-

from odoo import models, fields, api
import base64


class WebsitePageSEO(models.Model):
    _name = 'bbweb.website.page.seo'
    _description = 'Website Page SEO Settings'
    _order = 'page_path'
    _rec_name = 'page_path'

    # Page identification
    page_path = fields.Char(
        string='Page Path',
        required=True,
        help='URL path of the page (e.g., /, /services/web-development, /products/chatbot)',
        index=True
    )
    page_name = fields.Char(
        string='Page Name',
        required=True,
        help='Human-readable name of the page (e.g., Homepage, Web Development Services)'
    )
    
    # SEO fields
    seo_title = fields.Char(
        string='SEO Title',
        help='Page title for search engines (defaults to page name if not set)'
    )
    seo_description = fields.Text(
        string='SEO Description',
        help='Meta description for search engines'
    )
    seo_keywords = fields.Char(
        string='SEO Keywords',
        help='Comma-separated keywords for SEO (e.g., web development, software, AI)'
    )
    og_image = fields.Binary(
        string='Open Graph Image',
        attachment=True,
        help='Image for social media sharing (defaults to site logo if not set)'
    )
    og_image_filename = fields.Char(string='OG Image Filename')
    
    # Status
    active = fields.Boolean(string='Active', default=True, help='If unchecked, will use default/hardcoded SEO')
    
    # Metadata
    page_type = fields.Selection([
        ('website', 'Website'),
        ('article', 'Article'),
        ('product', 'Product'),
    ], string='Page Type', default='website', help='Type of page for Open Graph')
    
    _sql_constraints = [
        ('page_path_unique', 'UNIQUE(page_path)', 'Page path must be unique!'),
    ]

    @api.model
    def get_seo_by_path(self, page_path):
        """Get SEO settings for a specific page path"""
        seo = self.search([
            ('page_path', '=', page_path),
            ('active', '=', True)
        ], limit=1)
        
        if not seo:
            return None
        
        return {
            'page_path': seo.page_path,
            'page_name': seo.page_name,
            'seo_title': seo.seo_title or seo.page_name,
            'seo_description': seo.seo_description or '',
            'seo_keywords': seo.seo_keywords or '',
            'og_image': base64.b64encode(seo.og_image).decode('utf-8') if seo.og_image else None,
            'page_type': seo.page_type,
        }

    @api.model
    def get_all_active_seo(self):
        """Get all active SEO settings"""
        seo_records = self.search([('active', '=', True)])
        result = []
        
        for seo in seo_records:
            result.append({
                'page_path': seo.page_path,
                'page_name': seo.page_name,
                'seo_title': seo.seo_title or seo.page_name,
                'seo_description': seo.seo_description or '',
                'seo_keywords': seo.seo_keywords or '',
                'og_image': base64.b64encode(seo.og_image).decode('utf-8') if seo.og_image else None,
                'page_type': seo.page_type,
            })
        
        return result

