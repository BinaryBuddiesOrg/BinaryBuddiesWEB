"""
Pydantic models for type-safe data structures.
"""

from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class SerpData(BaseModel):
    """Data extracted from SerpAPI search results."""
    related_searches: List[str] = Field(default_factory=list)
    paa_questions: List[str] = Field(default_factory=list)
    top_links: List[str] = Field(default_factory=list)
    timestamp: datetime = Field(default_factory=datetime.now)
    query: str


class BlogContent(BaseModel):
    """LLM-generated blog content structure."""
    title: str
    slug: str
    meta_title: str = Field(max_length=60)
    meta_description: str = Field(max_length=160)
    tags: List[str]
    content_html: str


class OdooBlogRequest(BaseModel):
    """Request payload for Odoo blog creation API."""
    title: str
    excerpt: str
    content: str
    category: str
    author_name: str
    author_avatar: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
    featured: bool = False
    active: bool = True
    read_time: str = "5 min read"
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    seo_keywords: Optional[str] = None
    image_base64: Optional[str] = None
    og_image_base64: Optional[str] = None


class OdooBlogResponse(BaseModel):
    """Response from Odoo blog creation API."""
    status: str
    message: str
    data: Optional[dict] = None
    authenticated_as: Optional[str] = None


class LastPostTime(BaseModel):
    """Tracks the last blog posting time."""
    timestamp: datetime
    blogs_posted: int = 0
