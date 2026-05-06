# -*- coding: utf-8 -*-

from odoo import models, fields, api
import re
import unicodedata


class BlogCategory(models.Model):
    _name = 'bbweb.blog.category'
    _description = 'Blog Category'
    _order = 'sequence, name'

    name = fields.Char(string='Name', required=True)
    code = fields.Char(
        string='Code',
        required=True,
        index=True,
        help='Stable API key (e.g. ai_ml). Used in filters and integrations.',
    )
    sequence = fields.Integer(default=10)
    active = fields.Boolean(default=True)

    post_ids = fields.One2many('bbweb.blog.post', 'category_id', string='Posts')

    _sql_constraints = [
        ('blog_category_code_unique', 'UNIQUE(code)', 'Category code must be unique.'),
    ]

    def _slugify_code(self, text):
        """Lowercase API-safe code: letters, digits, underscores."""
        if not text:
            return ''
        text = unicodedata.normalize('NFKD', text)
        text = text.encode('ascii', 'ignore').decode('ascii')
        text = text.lower().strip()
        text = re.sub(r'[^\w]+', '_', text)
        text = re.sub(r'_+', '_', text).strip('_')
        if len(text) > 64:
            text = text[:64].rstrip('_')
        return text or 'category'

    def _next_unique_code(self, base_code):
        code = base_code
        counter = 1
        while self.search([('code', '=', code)], limit=1):
            suffix = f'_{counter}'
            prefix_len = max(1, 64 - len(suffix))
            code = f'{base_code[:prefix_len].rstrip("_")}{suffix}'
            counter += 1
        return code

    @api.model
    def resolve_from_api_filter(self, param):
        """Match category for GET ?category= (code, name, or legacy label). No create."""
        if param is None or not str(param).strip():
            return self.env['bbweb.blog.category']
        raw = str(param).strip()
        Category = self.sudo()
        cat = Category.search([('code', '=', raw), ('active', '=', True)], limit=1)
        if cat:
            return cat
        cat = Category.search([('name', '=ilike', raw), ('active', '=', True)], limit=1)
        if cat:
            return cat
        legacy = {
            'AI/ML': 'ai_ml',
            'Automation': 'automation',
            'Development': 'development',
            'Industry News': 'industry_news',
        }
        if raw in legacy:
            return Category.search([('code', '=', legacy[raw]), ('active', '=', True)], limit=1)
        return self.env['bbweb.blog.category']

    @api.model
    def get_or_create_from_api_value(self, value):
        """Resolve category for writes; create when unknown (trimmed non-empty string)."""
        if value is None:
            return False
        raw = str(value).strip()
        if not raw:
            return False
        Category = self.sudo()
        cat = Category.search([('code', '=', raw)], limit=1)
        if cat:
            return cat
        cat = Category.search([('name', '=ilike', raw)], limit=1)
        if cat:
            return cat
        legacy = {
            'AI/ML': 'ai_ml',
            'Automation': 'automation',
            'Development': 'development',
            'Industry News': 'industry_news',
        }
        if raw in legacy:
            cat = Category.search([('code', '=', legacy[raw])], limit=1)
            if cat:
                return cat
        base = self._slugify_code(raw)
        code = self._next_unique_code(base)
        return Category.create({
            'name': raw,
            'code': code,
            'active': True,
        })

    @api.model
    def get_api_list(self):
        """Public API payload: active categories ordered for menus."""
        cats = self.search([('active', '=', True)], order='sequence, name, id')
        return [
            {
                'id': c.id,
                'name': c.name,
                'code': c.code,
            }
            for c in cats
        ]
