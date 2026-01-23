# -*- coding: utf-8 -*-

from odoo import http
from odoo.http import request


class AppAdsTxtController(http.Controller):
    """Controller to serve app-ads.txt file"""

    @http.route('/app-ads.txt', type='http', auth='public', methods=['GET'], csrf=False, cors='*')
    def app_ads_txt(self, **kwargs):
        """
        Serve the app-ads.txt file as plain text.
        This file is used by ad platforms like Google AdMob to verify authorized sellers.
        """
        try:
            # Get the app-ads.txt model
            app_ads_model = request.env['bbweb.app.ads.txt'].sudo()
            
            # Generate content from active entries
            content = app_ads_model.get_app_ads_txt_content()
            
            # If no content, return a default message
            if not content or content.strip() == '':
                content = '# app-ads.txt\n# No entries configured yet\n'
            
            # Return as plain text with proper headers
            response = request.make_response(
                content,
                headers=[
                    ('Content-Type', 'text/plain; charset=utf-8'),
                    ('Content-Disposition', 'inline; filename="app-ads.txt"'),
                    ('Cache-Control', 'public, max-age=3600'),  # Cache for 1 hour
                ]
            )
            return response
            
        except Exception as e:
            # Log the error and return a minimal valid file
            import logging
            _logger = logging.getLogger(__name__)
            _logger.error(f'Error generating app-ads.txt: {str(e)}')
            
            error_content = '# app-ads.txt\n# Error generating content\n'
            response = request.make_response(
                error_content,
                headers=[
                    ('Content-Type', 'text/plain; charset=utf-8'),
                ]
            )
            response.status_code = 500
            return response

