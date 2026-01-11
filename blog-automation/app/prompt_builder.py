"""
Master prompt builder for blog content generation.
"""

from typing import List
from .logger import logger


class PromptBuilder:
    """Builds system and user prompts for LLM content generation."""
    
    # Static system prompt (never changes)
    SYSTEM_PROMPT = """You are a professional content writer and SEO editor.

Rules you must follow strictly:
- Write 100% original content.
- Do NOT copy or rewrite text from any source.
- Use provided SERP data only for understanding topics and intent.
- Do NOT mention SERP, Google, or scraping.
- If a fact is uncertain, generalize it or avoid exact numbers.
- Use clear structure, headings, and natural language.
- Content must be suitable for publishing directly on a professional blog."""
    
    @staticmethod
    def build_user_prompt(
        topic: str,
        related_searches: List[str],
        paa_questions: List[str],
        top_links: List[str]
    ) -> str:
        """
        Build dynamic user prompt with SERP signals.
        
        Args:
            topic: Primary topic for the blog
            related_searches: Related search queries from SERP
            paa_questions: People Also Ask questions
            top_links: Top search result URLs (for reference only)
            
        Returns:
            Formatted user prompt string
        """
        # Format lists for prompt
        related_searches_str = "\n".join(f"- {s}" for s in related_searches[:5])
        paa_questions_str = "\n".join(f"- {q}" for q in paa_questions[:5])
        top_links_str = "\n".join(f"- {link}" for link in top_links[:5])
        
        prompt = f"""TASK:
Generate a complete blog post ready for publishing.

BLOG REQUIREMENTS:
- Language: English
- Tone: Professional, clear, human-written
- Audience: General readers
- Length: 900–1200 words
- SEO optimized but natural
- No emojis
- No fluff

TOPIC:
{topic}

SEARCH INTENT SIGNALS:
Related searches:
{related_searches_str if related_searches else "N/A"}

People also ask:
{paa_questions_str if paa_questions else "N/A"}

REFERENCE LINKS (for understanding only, do not copy):
{top_links_str if top_links else "N/A"}

STRUCTURE REQUIRED:
1. SEO-friendly title
2. Short introduction (2–3 paragraphs)
3. Well-structured sections using H2 and H3
4. Practical explanations and examples
5. One optional comparison or list section (if relevant)
6. Conclusion with summary and takeaway

SEO METADATA:
- Meta title (max 60 characters)
- Meta description (max 160 characters)
- URL slug
- 5 relevant tags

OUTPUT FORMAT (JSON ONLY):
{{
  "title": "",
  "slug": "",
  "meta_title": "",
  "meta_description": "",
  "tags": [],
  "content_html": ""
}}"""
        
        logger.debug(f"Built user prompt for topic: {topic}")
        return prompt
    
    @staticmethod
    def get_system_prompt() -> str:
        """Get the static system prompt."""
        return PromptBuilder.SYSTEM_PROMPT
