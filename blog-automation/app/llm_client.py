"""
LLM client for content generation using LangChain + OpenRouter.
"""

import json
import time
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage
from .config import settings
from .models import BlogContent
from .logger import logger


class LLMClient:
    """Client for generating blog content using LLM via LangChain."""
    
    def __init__(self):
        """Initialize LangChain ChatOpenAI client for OpenRouter."""
        self.model = settings.LLM_MODEL
        
        # Initialize LangChain ChatOpenAI with OpenRouter configuration
        self.client = ChatOpenAI(
            model=self.model,
            openai_api_key=settings.OPENROUTER_API_KEY,
            openai_api_base="https://openrouter.ai/api/v1",
            temperature=settings.LLM_TEMPERATURE,
            max_tokens=settings.LLM_MAX_TOKENS,
            default_headers={
                "HTTP-Referer": "https://binary-buddies.com",
                "X-Title": "Blog Automation System"
            }
        )
        
        logger.info(f"Initialized LangChain LLM client with model: {self.model}")
    
    def generate_blog(self, system_prompt: str, user_prompt: str, retries: int = 3) -> BlogContent:
        """
        Generate blog content using LLM.
        
        Args:
            system_prompt: System instructions
            user_prompt: User prompt with topic and signals
            retries: Number of retry attempts on failure
            
        Returns:
            BlogContent object
            
        Raises:
            Exception: If generation fails after all retries
        """
        # Add JSON instruction to user prompt
        json_instruction = "\n\nIMPORTANT: Respond with ONLY valid JSON in the exact format specified above. No markdown, no explanations, just the raw JSON object."
        user_prompt_with_json = user_prompt + json_instruction
        
        for attempt in range(retries):
            try:
                logger.info(f"Generating blog content (attempt {attempt + 1}/{retries})")
                
                # Create messages
                messages = [
                    SystemMessage(content=system_prompt),
                    HumanMessage(content=user_prompt_with_json)
                ]
                
                # Generate response
                response = self.client.invoke(messages)
                content = response.content
                
                # Try to extract JSON from response
                # Sometimes LLMs wrap JSON in markdown code blocks
                if "```json" in content:
                    content = content.split("```json")[1].split("```")[0].strip()
                elif "```" in content:
                    content = content.split("```")[1].split("```")[0].strip()
                
                # Parse JSON
                blog_data = json.loads(content)
                
                # Validate and create BlogContent
                blog_content = BlogContent(**blog_data)
                
                logger.info(f"Blog generated successfully via LangChain")
                logger.info(f"  Title: {blog_content.title[:50]}...")
                logger.info(f"  Content length: {len(blog_content.content_html)} chars")
                
                return blog_content
                
            except json.JSONDecodeError as e:
                logger.error(f"JSON parse error: {e}")
                logger.debug(f"Raw response: {content[:200]}...")
                if attempt < retries - 1:
                    logger.warning(f"Retrying in 5 seconds...")
                    time.sleep(5)
                else:
                    raise Exception(f"Failed to parse LLM response as JSON: {e}")
            
            except Exception as e:
                logger.error(f"LLM generation error: {e}")
                if attempt < retries - 1:
                    wait_time = 2 ** attempt  # Exponential backoff: 1s, 2s, 4s
                    logger.warning(f"Retrying in {wait_time} seconds...")
                    time.sleep(wait_time)
                else:
                    raise Exception(f"Failed to generate blog after {retries} attempts: {e}")
    
    def test_connection(self) -> bool:
        """
        Test connection to LLM API.
        
        Returns:
            True if connection successful, False otherwise
        """
        try:
            messages = [HumanMessage(content="Say 'OK'")]
            response = self.client.invoke(messages)
            logger.info("LLM connection test successful")
            logger.debug(f"Test response: {response.content}")
            return True
        except Exception as e:
            logger.error(f"LLM connection test failed: {e}")
            return False
