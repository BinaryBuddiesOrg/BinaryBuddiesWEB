"""
Odoo blog API client for publishing blogs.
"""

import requests
from typing import Dict
from .config import settings
from .models import OdooBlogRequest, OdooBlogResponse
from .logger import logger


class OdooBlogClient:
    """Client for creating blog posts in Odoo."""
    
    def __init__(self):
        """Initialize Odoo API client."""
        self.base_url = settings.ODOO_URL
        self.api_key = settings.ODOO_BLOG_API_KEY
        self.endpoint = f"{self.base_url}/api/bbweb/blogs/create"
        logger.info(f"Initialized Odoo client: {self.base_url}")
    
    def create_blog(self, blog_request: OdooBlogRequest) -> OdooBlogResponse:
        """
        Create a blog post in Odoo.
        
        Args:
            blog_request: OdooBlogRequest object
            
        Returns:
            OdooBlogResponse object
            
        Raises:
            Exception: If blog creation fails
        """
        try:
            logger.info(f"Creating blog in Odoo: {blog_request.title}")
            
            # Prepare JSON-RPC payload
            payload = {
                "jsonrpc": "2.0",
                "method": "call",
                "params": blog_request.model_dump(exclude_none=True)
            }
            
            # Make API request
            response = requests.post(
                self.endpoint,
                headers={
                    'Content-Type': 'application/json',
                    'X-API-Key': self.api_key
                },
                json=payload,
                timeout=30
            )
            
            response.raise_for_status()
            result = response.json()
            
            # Handle JSON-RPC error
            if 'error' in result:
                error_msg = result['error'].get('message', str(result['error']))
                raise Exception(f"Odoo API error: {error_msg}")
            
            # Extract result
            api_result = result.get('result', result)
            odoo_response = OdooBlogResponse(**api_result)
            
            if odoo_response.status == 'success':
                slug = odoo_response.data.get('slug', 'N/A') if odoo_response.data else 'N/A'
                blog_id = odoo_response.data.get('id', 'N/A') if odoo_response.data else 'N/A'
                logger.info(f"✅ Blog created successfully: ID={blog_id}, slug={slug}")
            else:
                logger.error(f"❌ Blog creation failed: {odoo_response.message}")
            
            return odoo_response
            
        except requests.exceptions.RequestException as e:
            logger.error(f"HTTP request error: {e}")
            raise Exception(f"Failed to connect to Odoo API: {e}")
        
        except Exception as e:
            logger.error(f"Error creating blog in Odoo: {e}")
            raise
    
    def test_connection(self) -> bool:
        """
        Test connection to Odoo API.
        
        Returns:
            True if connection successful, False otherwise
        """
        try:
            # Try to reach the base URL
            response = requests.get(f"{self.base_url}/web/database/selector", timeout=10)
            logger.info("Odoo connection test successful")
            return True
        except Exception as e:
            logger.error(f"Odoo connection test failed: {e}")
            return False
