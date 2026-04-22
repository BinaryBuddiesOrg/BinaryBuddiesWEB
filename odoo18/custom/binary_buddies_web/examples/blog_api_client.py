#!/usr/bin/env python3
"""
Blog Creation Script - Python Example
Demonstrates how to create blog posts programmatically using the Binary Buddies API
"""

import requests
import os
import json
import base64
from pathlib import Path


class BlogAPIClient:
    """Client for Binary Buddies Blog API"""
    
    def __init__(self, odoo_url=None, api_key=None):
        """
        Initialize API client
        
        Args:
            odoo_url: Odoo server URL (default: from ODOO_URL env var or localhost)
            api_key: API key for authentication (default: from BLOG_API_KEY env var)
        """
        self.odoo_url = odoo_url or os.getenv('ODOO_URL', 'http://localhost:8069')
        self.api_key = api_key or os.getenv('BLOG_API_KEY')
        
        if not self.api_key:
            raise ValueError(
                "API key not provided. Set BLOG_API_KEY environment variable "
                "or pass api_key parameter"
            )
    
    def create_blog(self, title, excerpt, content, category, author_name, **kwargs):
        """
        Create a new blog post
        
        Args:
            title: Blog title
            excerpt: Short summary
            content: Full HTML content
            category: One of: ai_ml, automation, development, industry_news
            author_name: Author's display name
            **kwargs: Optional fields (see documentation)
        
        Returns:
            dict: API response
        """
        # Prepare request payload
        payload = {
            "jsonrpc": "2.0",
            "method": "call",
            "params": {
                "title": title,
                "excerpt": excerpt,
                "content": content,
                "category": category,
                "author_name": author_name,
                **kwargs  # Optional: slug, tags, featured, image_base64, etc.
            }
        }
        
        # Make API request
        response = requests.post(
            f"{self.odoo_url}/api/bbweb/blogs/create",
            headers={
                'Content-Type': 'application/json',
                'X-API-Key': self.api_key
            },
            json=payload
        )
        
        response.raise_for_status()
        result = response.json()
        
        # Check for JSON-RPC error
        if 'error' in result:
            raise Exception(f"API Error: {result['error']}")
        
        return result.get('result', result)
    
    def create_blog_with_image(self, title, excerpt, content, category, author_name,
                               image_path=None, **kwargs):
        """
        Create blog post with preview image
        
        Args:
            image_path: Path to image file (will be converted to base64)
            ... (other args same as create_blog)
        """
        if image_path:
            image_base64 = self.image_to_base64(image_path)
            kwargs['image_base64'] = image_base64
        
        return self.create_blog(title, excerpt, content, category, author_name, **kwargs)
    
    @staticmethod
    def image_to_base64(image_path):
        """Convert image file to base64 string"""
        with open(image_path, 'rb') as f:
            image_data = f.read()
        return base64.b64encode(image_data).decode('utf-8')


# =============================================================================
# USAGE EXAMPLES
# =============================================================================

def example_basic_blog():
    """Example 1: Create a simple blog post"""
    client = BlogAPIClient()
    
    result = client.create_blog(
        title="Getting Started with AI",
        excerpt="A beginner's guide to understanding artificial intelligence",
        content="""
            <h2>Introduction</h2>
            <p>Artificial Intelligence (AI) is transforming the world...</p>
            
            <h2>Key Concepts</h2>
            <ul>
                <li>Machine Learning</li>
                <li>Neural Networks</li>
                <li>Deep Learning</li>
            </ul>
        """,
        category="ai_ml",
        author_name="AI Bot",
        tags=["AI", "Tutorial", "Beginner"],
        read_time="8 min read"
    )
    
    print(f"✅ Blog created successfully!")
    print(f"   ID: {result['data']['id']}")
    print(f"   Slug: {result['data']['slug']}")
    print(f"   URL: {result['data']['url']}")


def example_blog_with_image():
    """Example 2: Create blog with preview image"""
    client = BlogAPIClient()
    
    result = client.create_blog_with_image(
        title="Automation Trends 2026",
        excerpt="Exploring the latest automation technologies",
        content="<p>2026 brings exciting automation innovations...</p>",
        category="automation",
        author_name="Tech Writer",
        image_path="./preview-image.jpg",  # Will be uploaded to S3
        tags=["Automation", "Trends", "2026"],
        featured=True,
        seo_title="Top Automation Trends in 2026",
        seo_description="Discover the most impactful automation trends",
        seo_keywords="automation, AI, trends, 2026"
    )
    
    print(f"✅ Featured blog with image created!")
    print(f"   Slug: {result['data']['slug']}")


def example_custom_slug():
    """Example 3: Create blog with custom slug"""
    client = BlogAPIClient()
    
    result = client.create_blog(
        title="How to Build Scalable APIs",
        excerpt="Best practices for API development",
        content="<p>Building scalable APIs requires...</p>",
        category="development",
        author_name="DevOps Engineer",
        slug="api-best-practices-2026",  # Custom slug
        tags=["API", "Development", "Best Practices"]
    )
    
    print(f"✅ Blog with custom slug created!")
    print(f"   Slug: {result['data']['slug']}")


def example_draft_blog():
    """Example 4: Create draft blog (not published)"""
    client = BlogAPIClient()
    
    result = client.create_blog(
        title="Work in Progress Blog",
        excerpt="This is a draft",
        content="<p>Draft content...</p>",
        category="development",
        author_name="Author",
        active=False  # Creates as draft (not visible on website)
    )
    
    print(f"✅ Draft blog created!")
    print(f"   ID: {result['data']['id']}")
    print(f"   Active: {result['data']['active']}")


def example_batch_import():
    """Example 5: Batch import multiple blogs"""
    client = BlogAPIClient()
    
    blogs = [
        {
            "title": "Blog #1",
            "excerpt": "First blog",
            "content": "<p>Content 1</p>",
            "category": "ai_ml",
            "author_name": "Bot",
        },
        {
            "title": "Blog #2",
            "excerpt": "Second blog",
            "content": "<p>Content 2</p>",
            "category": "development",
            "author_name": "Bot",
        },
        # Add more...
    ]
    
    created_blogs = []
    
    for blog_data in blogs:
        try:
            result = client.create_blog(**blog_data)
            created_blogs.append(result['data'])
            print(f"✅ Created: {result['data']['slug']}")
        except Exception as e:
            print(f"❌ Failed to create '{blog_data['title']}': {e}")
    
    print(f"\n📊 Successfully created {len(created_blogs)} blogs")


# =============================================================================
# MAIN
# =============================================================================

if __name__ == "__main__":
    print("Binary Buddies Blog API - Python Client\n")
    
    # Check for API key
    if not os.getenv('BLOG_API_KEY'):
        print("⚠️  BLOG_API_KEY environment variable not set!")
        print("Set it with: export BLOG_API_KEY='your-api-key-here'")
        exit(1)
    
    # Run examples
    try:
        print("\n▶ Example 1: Basic blog")
        example_basic_blog()
        
        # Uncomment to run other examples:
        # print("\n▶ Example 2: Blog with image")
        # example_blog_with_image()
        
        # print("\n▶ Example 3: Custom slug")
        # example_custom_slug()
        
        # print("\n▶ Example 4: Draft blog")
        # example_draft_blog()
        
        # print("\n▶ Example 5: Batch import")
        # example_batch_import()
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        exit(1)
