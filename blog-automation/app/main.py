"""
Main application loop for blog automation system.
Implements 24-hour posting logic with SERP → LLM → Odoo pipeline.
"""

import time
from datetime import datetime
from .config import settings
from .logger import logger
from .utils import (
    load_last_post_time, 
    save_last_post_time, 
    calculate_hours_since,
    extract_excerpt,
    estimate_read_time
)
from .models import LastPostTime, OdooBlogRequest
from .serp_client import SerpAPIClient
from .prompt_builder import PromptBuilder
from .llm_client import LLMClient
from .odoo_client import OdooBlogClient


class BlogAutomationSystem:
    """Main blog automation system orchestrator."""
    
    def __init__(self):
        """Initialize all clients."""
        logger.info("=" * 80)
        logger.info("🤖 Blog Automation System Starting Up")
        logger.info("=" * 80)
        
        self.serp_client = SerpAPIClient()
        self.llm_client = LLMClient()
        self.odoo_client = OdooBlogClient()
        self.prompt_builder = PromptBuilder()
        
        logger.info(f"Configuration:")
        logger.info(f"  - Max blogs per run: {settings.MAX_BLOGS_PER_RUN}")
        logger.info(f"  - Post interval: {settings.POST_INTERVAL_HOURS} hours")
        logger.info(f"  - LLM model: {settings.LLM_MODEL}")
        logger.info(f"  - Odoo URL: {settings.ODOO_URL}")
        logger.info("=" * 80)
    
    def test_connections(self) -> bool:
        """Test all API connections."""
        logger.info("Testing API connections...")
        
        all_ok = True
        
        # Test LLM
        if not self.llm_client.test_connection():
            logger.error("❌ LLM connection failed")
            all_ok = False
        else:
            logger.info("✅ LLM connection OK")
        
        # Test Odoo
        if not self.odoo_client.test_connection():
            logger.error("❌ Odoo connection failed")
            all_ok = False
        else:
            logger.info("✅ Odoo connection OK")
        
        return all_ok
    
    def generate_and_post_blog(self, topic: str, category: str) -> dict:
        """
        Generate and post a single blog.
        
        Args:
            topic: Blog topic
            category: Blog category
            
        Returns:
            Result dictionary with success status
        """
        try:
            logger.info(f"\n{'='*60}")
            logger.info(f"📝 Generating blog: {topic}")
            logger.info(f"{'='*60}")
            
            # Step 1: Get SERP signals (use cached if available)
            serp_data = self.serp_client.get_search_signals()
            
            # Step 2: Build prompts
            system_prompt = self.prompt_builder.get_system_prompt()
            user_prompt = self.prompt_builder.build_user_prompt(
                topic=topic,
                related_searches=serp_data.related_searches,
                paa_questions=serp_data.paa_questions,
                top_links=serp_data.top_links
            )
            
            # Step 3: Generate content with LLM
            blog_content = self.llm_client.generate_blog(system_prompt, user_prompt)
            
            # Step 4: Prepare Odoo request
            excerpt = extract_excerpt(blog_content.content_html)
            read_time = estimate_read_time(blog_content.content_html)
            
            odoo_request = OdooBlogRequest(
                title=blog_content.title,
                excerpt=excerpt,
                content=blog_content.content_html,
                category=category,
                author_name=settings.AUTHOR_NAME,
                author_avatar=settings.AUTHOR_AVATAR,
                tags=blog_content.tags,
                read_time=read_time,
                seo_title=blog_content.meta_title,
                seo_description=blog_content.meta_description,
                seo_keywords=", ".join(blog_content.tags)
            )
            
            # Step 5: Post to Odoo
            response = self.odoo_client.create_blog(odoo_request)
            
            if response.status == 'success':
                return {
                    'success': True,
                    'blog_id': response.data.get('id') if response.data else None,
                    'slug': response.data.get('slug') if response.data else None,
                    'title': blog_content.title
                }
            else:
                return {
                    'success': False,
                    'error': response.message
                }
                
        except Exception as e:
            logger.error(f"❌ Failed to generate/post blog: {e}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def run_posting_cycle(self) -> int:
        """
        Run a full posting cycle (generate and post multiple blogs).
        
        Returns:
            Number of successfully posted blogs
        """
        logger.info("\n" + "=" * 80)
        logger.info("🚀 Starting blog posting cycle")
        logger.info("=" * 80)
        
        successful_posts = 0
        categories = settings.BLOG_CATEGORIES
        
        for i in range(settings.MAX_BLOGS_PER_RUN):
            # Rotate through categories
            category = categories[i % len(categories)]
            
            # Generate topic based on category
            topic_map = {
                'ai_ml': f"AI and Machine Learning trends {datetime.now().year}",
                'automation': f"Automation best practices {datetime.now().year}",
                'development': f"Software development innovations {datetime.now().year}",
                'industry_news': f"Tech industry updates {datetime.now().year}"
            }
            topic = topic_map.get(category, "Technology trends")
            
            # Generate and post
            result = self.generate_and_post_blog(topic, category)
            
            if result['success']:
                successful_posts += 1
                logger.info(f"✅ Blog {i+1}/{settings.MAX_BLOGS_PER_RUN} posted: {result['slug']}")
            else:
                logger.error(f"❌ Blog {i+1}/{settings.MAX_BLOGS_PER_RUN} failed: {result.get('error')}")
            
            # Small delay between posts to avoid rate limiting
            if i < settings.MAX_BLOGS_PER_RUN - 1:
                time.sleep(2)
        
        logger.info("\n" + "=" * 80)
        logger.info(f"📊 Posting cycle complete: {successful_posts}/{settings.MAX_BLOGS_PER_RUN} successful")
        logger.info("=" * 80)
        
        return successful_posts
    
    def run(self):
        """Main execution loop with 24-hour scheduling."""
        logger.info("🔄 Entering main loop (24-hour scheduling)")
        
        # Test connections on startup
        if not self.test_connections():
            logger.error("⚠️  Some API connections failed. Proceeding anyway...")
        
        while True:
            try:
                # Load last post time
                last_post = load_last_post_time()
                hours_since = calculate_hours_since(last_post.timestamp)
                
                logger.info(f"\n⏰ Hours since last post: {hours_since:.1f} / {settings.POST_INTERVAL_HOURS}")
                
                if hours_since >= settings.POST_INTERVAL_HOURS:
                    logger.info("✨ Time to post new blogs!")
                    
                    # Run posting cycle
                    posted_count = self.run_posting_cycle()
                    
                    # Update last post time
                    new_post_time = LastPostTime(
                        timestamp=datetime.now(),
                        blogs_posted=posted_count
                    )
                    save_last_post_time(new_post_time)
                    
                    logger.info(f"💾 Saved posting timestamp. Next cycle in {settings.POST_INTERVAL_HOURS} hours.")
                else:
                    remaining_hours = settings.POST_INTERVAL_HOURS - hours_since
                    logger.info(f"⏳ Next posting cycle in {remaining_hours:.1f} hours")
                
                # Sleep for 1 hour before next check
                logger.info("😴 Sleeping for 1 hour...\n")
                time.sleep(3600)
                
            except KeyboardInterrupt:
                logger.info("\n🛑 Received shutdown signal. Exiting gracefully...")
                break
            
            except Exception as e:
                logger.error(f"❌ Error in main loop: {e}")
                logger.info("⏳ Retrying in 5 minutes...")
                time.sleep(300)


def main():
    """Entry point for the application."""
    try:
        system = BlogAutomationSystem()
        system.run()
    except Exception as e:
        logger.error(f"💥 Fatal error: {e}", exc_info=True)
        exit(1)


if __name__ == "__main__":
    main()
