#!/usr/bin/env python3
"""
Test script for blog automation system components.
Run this before deploying to verify all integrations work.
"""

import sys
import os

# Add app directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app.config import settings
from app.logger import logger
from app.serp_client import SerpAPIClient
from app.llm_client import LLMClient
from app.odoo_client import OdooBlogClient
from app.prompt_builder import PromptBuilder
from app.models import OdooBlogRequest


def test_configuration():
    """Test 1: Verify configuration is loaded."""
    logger.info("=" * 60)
    logger.info("TEST 1: Configuration Loading")
    logger.info("=" * 60)
    
    try:
        assert settings.OPENROUTER_API_KEY, "OPENROUTER_API_KEY not set"
        assert settings.SERPAPI_API_KEY, "SERPAPI_API_KEY not set"
        assert settings.ODOO_BLOG_API_KEY, "ODOO_BLOG_API_KEY not set"
        assert settings.ODOO_URL, "ODOO_URL not set"
        
        logger.info("✅ Configuration loaded successfully")
        logger.info(f"   LLM Model: {settings.LLM_MODEL}")
        logger.info(f"   Odoo URL: {settings.ODOO_URL}")
        logger.info(f"   Max blogs per run: {settings.MAX_BLOGS_PER_RUN}")
        return True
    except AssertionError as e:
        logger.error(f"❌ Configuration test failed: {e}")
        return False


def test_serp_client():
    """Test 2: SerpAPI integration."""
    logger.info("\n" + "=" * 60)
    logger.info("TEST 2: SerpAPI Integration")
    logger.info("=" * 60)
    
    try:
        client = SerpAPIClient()
        serp_data = client.get_search_signals("AI automation")
        
        assert len(serp_data.related_searches) > 0, "No related searches found"
        
        logger.info("✅ SerpAPI integration working")
        logger.info(f"   Related searches: {len(serp_data.related_searches)}")
        logger.info(f"   PAA questions: {len(serp_data.paa_questions)}")
        logger.info(f"   Top links: {len(serp_data.top_links)}")
        
        # Show samples
        if serp_data.related_searches:
            logger.info(f"   Sample search: {serp_data.related_searches[0]}")
        if serp_data.paa_questions:
            logger.info(f"   Sample question: {serp_data.paa_questions[0]}")
        
        return True
    except Exception as e:
        logger.error(f"❌ SerpAPI test failed: {e}")
        return False


def test_llm_client():
    """Test 3: LLM integration."""
    logger.info("\n" + "=" * 60)
    logger.info("TEST 3: LLM Integration")
    logger.info("=" * 60)
    
    try:
        client = LLMClient()
        
        # Test connection
        assert client.test_connection(), "LLM connection failed"
        
        # Test blog generation
        prompt_builder = PromptBuilder()
        system_prompt = prompt_builder.get_system_prompt()
        user_prompt = prompt_builder.build_user_prompt(
            topic="Test blog about AI automation",
            related_searches=["AI automation tools", "automation trends"],
            paa_questions=["What is AI automation?"],
            top_links=["https://example.com"]
        )
        
        blog = client.generate_blog(system_prompt, user_prompt)
        
        assert blog.title, "No title generated"
        assert blog.content_html, "No content generated"
        assert len(blog.tags) > 0, "No tags generated"
        assert len(blog.content_html) > 500, "Content too short"
        
        logger.info("✅ LLM integration working")
        logger.info(f"   Title: {blog.title[:50]}...")
        logger.info(f"   Content length: {len(blog.content_html)} characters")
        logger.info(f"   Tags: {', '.join(blog.tags[:3])}")
        logger.info(f"   Meta title: {blog.meta_title}")
        
        return True
    except Exception as e:
        logger.error(f"❌ LLM test failed: {e}")
        logger.exception(e)
        return False


def test_odoo_client():
    """Test 4: Odoo API integration."""
    logger.info("\n" + "=" * 60)
    logger.info("TEST 4: Odoo API Integration")
    logger.info("=" * 60)
    
    try:
        client = OdooBlogClient()
        
        # Test connection
        assert client.test_connection(), "Odoo connection failed"
        
        logger.info("✅ Odoo connection working")
        logger.info(f"   Odoo URL: {settings.ODOO_URL}")
        logger.info(f"   API endpoint: {client.endpoint}")
        
        # Note: We don't create a test blog here to avoid cluttering the database
        # The connection test is sufficient for verification
        
        return True
    except Exception as e:
        logger.error(f"❌ Odoo test failed: {e}")
        return False


def test_end_to_end():
    """Test 5: Full end-to-end blog creation (creates actual blog)."""
    logger.info("\n" + "=" * 60)
    logger.info("TEST 5: End-to-End Blog Creation")
    logger.info("=" * 60)
    logger.warning("⚠️  This will create an actual blog post in Odoo!")
    
    try:
        # Step 1: Get SERP data
        serp_client = SerpAPIClient()
        serp_data = serp_client.get_search_signals("Test automation")
        logger.info("   ✓ SERP data retrieved")
        
        # Step 2: Generate content
        llm_client = LLMClient()
        prompt_builder = PromptBuilder()
        
        system_prompt = prompt_builder.get_system_prompt()
        user_prompt = prompt_builder.build_user_prompt(
            topic="Testing Automated Blog Generation Systems",
            related_searches=serp_data.related_searches[:3],
            paa_questions=serp_data.paa_questions[:3],
            top_links=serp_data.top_links[:3]
        )
        
        blog_content = llm_client.generate_blog(system_prompt, user_prompt)
        logger.info("   ✓ Blog content generated")
        
        # Step 3: Prepare Odoo request
        from app.utils import extract_excerpt
        
        excerpt = extract_excerpt(blog_content.content_html)
        
        odoo_request = OdooBlogRequest(
            title="[TEST] " + blog_content.title,
            excerpt=excerpt,
            content=blog_content.content_html,
            category="development",
            author_name="Test Bot",
            author_avatar="TB",
            tags=blog_content.tags,
            read_time="5 min read",
            seo_title=blog_content.meta_title,
            seo_description=blog_content.meta_description,
            active=False  # Create as draft to avoid showing on website
        )
        
        # Step 4: Post to Odoo
        odoo_client = OdooBlogClient()
        response = odoo_client.create_blog(odoo_request)
        
        assert response.status == 'success', f"Blog creation failed: {response.message}"
        
        logger.info("✅ End-to-end test successful!")
        logger.info(f"   Blog ID: {response.data.get('id')}")
        logger.info(f"   Slug: {response.data.get('slug')}")
        logger.info(f"   Status: Created as DRAFT (not visible on website)")
        
        return True
    except Exception as e:
        logger.error(f"❌ End-to-end test failed: {e}")
        logger.exception(e)
        return False


def main():
    """Run all tests."""
    logger.info("\n" + "=" * 60)
    logger.info("🧪 BLOG AUTOMATION SYSTEM TEST SUITE")
    logger.info("=" * 60)
    
    tests = [
        ("Configuration", test_configuration),
        ("SerpAPI Integration", test_serp_client),
        ("LLM Integration", test_llm_client),
        ("Odoo API Integration", test_odoo_client),
    ]
    
    results = {}
    
    for test_name, test_func in tests:
        try:
            results[test_name] = test_func()
        except Exception as e:
            logger.error(f"Test '{test_name}' crashed: {e}")
            results[test_name] = False
    
    # Summary
    logger.info("\n" + "=" * 60)
    logger.info("TEST SUMMARY")
    logger.info("=" * 60)
    
    for test_name, passed in results.items():
        status = "✅ PASS" if passed else "❌ FAIL"
        logger.info(f"{status} - {test_name}")
    
    all_passed = all(results.values())
    
    if all_passed:
        logger.info("\n🎉 All tests passed! System is ready.")
        logger.info("\nOptional: Run end-to-end test (creates actual blog)?")
        logger.info("  python3 test/run_tests.py --e2e")
    else:
        logger.error("\n⚠️  Some tests failed. Fix issues before deployment.")
        sys.exit(1)


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Test blog automation system")
    parser.add_argument("--e2e", action="store_true", help="Run end-to-end test (creates blog)")
    args = parser.parse_args()
    
    if args.e2e:
        test_end_to_end()
    else:
        main()
