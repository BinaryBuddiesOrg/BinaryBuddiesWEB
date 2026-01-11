"""
Configuration management for blog automation system.
Uses Pydantic Settings for type-safe environment variable loading.
"""

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # API Keys (Required)
    OPENROUTER_API_KEY: str
    SERPAPI_API_KEY: str
    ODOO_BLOG_API_KEY: str
    
    # Odoo Configuration
    ODOO_URL: str = "http://localhost:8069"
    
    # Automation Settings
    MAX_BLOGS_PER_RUN: int = 30
    POST_INTERVAL_HOURS: int = 24
    
    # LLM Configuration
    LLM_MODEL: str = "openai/gpt-4o"
    LLM_TEMPERATURE: float = 0.7
    LLM_MAX_TOKENS: int = 2500
    
    # SERP Configuration
    SERP_SEARCH_QUERY: str = "AI automation trends"
    
    # Blog Categories (will rotate through these)
    BLOG_CATEGORIES: List[str] = ["ai_ml", "automation", "development"]
    
    # Author Settings
    AUTHOR_NAME: str = "AI Content Bot"
    AUTHOR_AVATAR: str = "AI"
    
    # Logging
    LOG_LEVEL: str = "INFO"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()
