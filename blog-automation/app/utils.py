"""
Utility functions for the blog automation system.
"""

import json
from pathlib import Path
from datetime import datetime
from .models import LastPostTime
from .logger import logger


def load_last_post_time() -> LastPostTime:
    """
    Load the last post time from persistent storage.
    
    Returns:
        LastPostTime object, defaults to epoch if file doesn't exist
    """
    file_path = Path("data/last_post_time.json")
    
    if not file_path.exists():
        logger.info("No previous post time found, initializing to epoch")
        return LastPostTime(timestamp=datetime.fromtimestamp(0))
    
    try:
        with open(file_path, 'r') as f:
            data = json.load(f)
            return LastPostTime(**data)
    except Exception as e:
        logger.error(f"Error loading last post time: {e}, defaulting to epoch")
        return LastPostTime(timestamp=datetime.fromtimestamp(0))


def save_last_post_time(post_time: LastPostTime) -> None:
    """
    Save the last post time to persistent storage.
    
    Args:
        post_time: LastPostTime object to save
    """
    file_path = Path("data/last_post_time.json")
    file_path.parent.mkdir(exist_ok=True)
    
    try:
        with open(file_path, 'w') as f:
            json.dump({
                "timestamp": post_time.timestamp.isoformat(),
                "blogs_posted": post_time.blogs_posted
            }, f, indent=2)
        logger.info(f"Saved last post time: {post_time.timestamp}")
    except Exception as e:
        logger.error(f"Error saving last post time: {e}")


def calculate_hours_since(timestamp: datetime) -> float:
    """
    Calculate hours elapsed since a given timestamp.
    
    Args:
        timestamp: Past datetime
        
    Returns:
        Hours elapsed as float
    """
    delta = datetime.now() - timestamp
    return delta.total_seconds() / 3600


def extract_excerpt(html_content: str, max_length: int = 200) -> str:
    """
    Extract a plain text excerpt from HTML content.
    
    Args:
        html_content: HTML string
        max_length: Maximum excerpt length
        
    Returns:
        Plain text excerpt
    """
    from bs4 import BeautifulSoup
    
    soup = BeautifulSoup(html_content, 'html.parser')
    text = soup.get_text(separator=' ', strip=True)
    
    if len(text) <= max_length:
        return text
    
    # Truncate at word boundary
    truncated = text[:max_length].rsplit(' ', 1)[0]
    return truncated + '...'


def estimate_read_time(content: str) -> str:
    """
    Estimate reading time based on word count.
    Average reading speed: 200 words per minute.
    
    Args:
        content: Text content
        
    Returns:
        Formatted read time string (e.g., "5 min read")
    """
    words = len(content.split())
    minutes = max(1, round(words / 200))
    return f"{minutes} min read"
