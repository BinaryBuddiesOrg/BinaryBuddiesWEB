# -*- coding: utf-8 -*-
{
    'name': 'Binary Buddies Web',
    'version': '1.0.0',
    'category': 'Website',
    'summary': 'Manage Binary Buddies website content - Projects, Team, Blog, Careers',
    'description': """
Binary Buddies Web Content Management
======================================

This module provides models and public APIs to manage dynamic content for the Binary Buddies website:

Features:
---------
* Featured Projects management with results and tags
* Team Members with certifications and social links
* Blog Posts with categories and featured posts
* Career Listings with requirements and responsibilities
* Public REST API endpoints for frontend integration
* Image management for all content types

API Endpoints:
--------------
* /api/bbweb/projects - Featured projects
* /api/bbweb/team - Team members
* /api/bbweb/blogs - Blog posts
* /api/bbweb/careers - Career listings

All endpoints are publicly accessible and return JSON data.
    """,
    'author': 'Binary Buddies',
    'website': 'https://binarybuddies.com',
    'license': 'LGPL-3',
    'depends': ['base', 'web'],
    'data': [
        'security/ir.model.access.csv',
        'views/featured_project_views.xml',
        'views/team_member_views.xml',
        'views/blog_post_views.xml',
        'views/career_views.xml',
        'views/lead_views.xml',
        'views/job_application_views.xml',
        'views/website_page_seo_views.xml',
        'views/website_user_views.xml',
        'views/menu.xml',
        'demo/demo_projects.xml',
        'demo/demo_team.xml',
        'demo/demo_blogs.xml',
        'demo/demo_careers.xml',
    ],
    'demo': [],
    'installable': True,
    'application': True,
    'auto_install': False,
}
