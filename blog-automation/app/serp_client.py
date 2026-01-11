"""
SerpAPI client for topic discovery and search intent signals.
"""

import json
from pathlib import Path
from datetime import datetime
from serpapi import Client
from .config import settings
from .models import SerpData
from .logger import logger


class SerpAPIClient:
    """Client for fetching search signals from SerpAPI."""
    
    def __init__(self):
        """Initialize SerpAPI client."""
        self.client = Client(api_key=settings.SERPAPI_API_KEY)
        self.cache_file = Path("data/serp_cache.json")
        self.cache_file.parent.mkdir(exist_ok=True)
    
    def get_search_signals(self, query: str = None) -> SerpData:
        """
        Get search intent signals from Google SERP.
        
        Args:
            query: Search query (defaults to configured query)
            
        Returns:
            SerpData object with related searches, PAA questions, and top links
        """
        query = query or settings.SERP_SEARCH_QUERY
        
        # Try to fetch fresh data
        try:
            logger.info(f"Fetching SERP data for query: {query}")
            results = self.client.search({
                'q': query,
                'engine': 'google',
                'num': 10
            })
            
            serp_data = self._extract_signals(results, query)
            self._save_cache(serp_data)
            logger.info(f"Successfully fetched SERP data: {len(serp_data.related_searches)} related searches, "
                       f"{len(serp_data.paa_questions)} PAA questions")
            return serp_data
            
        except Exception as e:
            logger.error(f"Error fetching SERP data: {e}")
            logger.warning("Attempting to load cached SERP data")
            return self._load_cache(query)
    
    def _extract_signals(self, results: dict, query: str) -> SerpData:
        """Extract relevant signals from SERP results."""
        
        # Extract related searches
        related_searches = []
        if 'related_searches' in results:
            related_searches = [
                rs.get('query', '') for rs in results['related_searches']
                if rs.get('query')
            ][:10]  # Limit to 10
        
        # Extract People Also Ask questions
        paa_questions = []
        if 'related_questions' in results:
            paa_questions = [
                rq.get('question', '') for rq in results['related_questions']
                if rq.get('question')
            ][:10]  # Limit to 10
        
        # Extract top organic result links (for reference only)
        top_links = []
        if 'organic_results' in results:
            top_links = [
                result.get('link', '') for result in results['organic_results']
                if result.get('link')
            ][:10]  # Limit to 10
        
        return SerpData(
            related_searches=related_searches,
            paa_questions=paa_questions,
            top_links=top_links,
            timestamp=datetime.now(),
            query=query
        )
    
    def _save_cache(self, serp_data: SerpData) -> None:
        """Save SERP data to cache file."""
        try:
            with open(self.cache_file, 'w') as f:
                json.dump(serp_data.model_dump(mode='json'), f, indent=2, default=str)
            logger.debug(f"Saved SERP data to cache")
        except Exception as e:
            logger.error(f"Error saving SERP cache: {e}")
    
    def _load_cache(self, query: str) -> SerpData:
        """Load SERP data from cache file."""
        if not self.cache_file.exists():
            logger.warning("No SERP cache found, returning minimal data")
            return SerpData(
                related_searches=[query],
                paa_questions=[],
                top_links=[],
                timestamp=datetime.now(),
                query=query
            )
        
        try:
            with open(self.cache_file, 'r') as f:
                data = json.load(f)
                # Convert timestamp string back to datetime
                data['timestamp'] = datetime.fromisoformat(data['timestamp'])
                return SerpData(**data)
        except Exception as e:
            logger.error(f"Error loading SERP cache: {e}")
            return SerpData(
                related_searches=[query],
                paa_questions=[],
                top_links=[],
                timestamp=datetime.now(),
                query=query
            )
