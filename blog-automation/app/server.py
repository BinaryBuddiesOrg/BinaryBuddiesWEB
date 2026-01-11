"""
API Server for Blog Automation System.
Provides endpoints for manual blog generation and status checks.
Background scheduler handles automatic 24-hour posting.
"""

import os
import asyncio
import threading
from datetime import datetime
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, List

# Load environment before importing app modules
from dotenv import load_dotenv
load_dotenv(override=True)

from app.config import settings
from app.logger import logger
from app.llm_client import LLMClient
from app.serp_client import SerpAPIClient
from app.odoo_client import OdooBlogClient
from app.prompt_builder import PromptBuilder
from app.models import OdooBlogRequest
from app.utils import (
    load_last_post_time,
    save_last_post_time,
    calculate_hours_since,
    extract_excerpt,
    estimate_read_time
)
from app.models import LastPostTime


# Global state
scheduler_running = False
last_run_result = None


class GenerateRequest(BaseModel):
    """Request to generate blogs."""
    count: int = 2
    topics: Optional[List[str]] = None


class GenerateResponse(BaseModel):
    """Response from blog generation."""
    status: str
    message: str
    blogs_generated: int = 0
    blogs: List[dict] = []


def generate_blogs(count: int = 2, topics: Optional[List[str]] = None) -> dict:
    """
    Generate and post blogs to Odoo.
    
    Args:
        count: Number of blogs to generate
        topics: Optional list of topics (auto-generated if not provided)
    
    Returns:
        Result dictionary
    """
    global last_run_result
    
    try:
        logger.info(f"Starting blog generation: {count} blogs")
        
        # Initialize clients
        llm = LLMClient()
        serp = SerpAPIClient()
        odoo = OdooBlogClient()
        pb = PromptBuilder()
        sys_prompt = pb.get_system_prompt()
        
        # Get SERP signals
        serp_data = serp.get_search_signals(settings.SERP_SEARCH_QUERY)
        
        # Default topics if not provided
        if not topics:
            topics = [
                f"AI Automation Trends {datetime.now().year}",
                f"Automation Tools for Modern Businesses",
                f"Machine Learning Applications in Industry",
                f"Digital Transformation Strategies",
                f"Tech Innovation Updates"
            ]
        
        categories = settings.BLOG_CATEGORIES
        results = []
        
        for i in range(min(count, len(topics))):
            topic = topics[i]
            category = categories[i % len(categories)]
            
            try:
                logger.info(f"Generating blog {i+1}/{count}: {topic}")
                
                # Build prompt
                user_prompt = pb.build_user_prompt(
                    topic,
                    serp_data.related_searches[i*2:(i+1)*2],
                    serp_data.paa_questions[:2],
                    serp_data.top_links[i*2:(i+1)*2]
                )
                
                # Generate content
                blog = llm.generate_blog(sys_prompt, user_prompt)
                
                # Prepare Odoo request
                req = OdooBlogRequest(
                    title=blog.title,
                    excerpt=extract_excerpt(blog.content_html),
                    content=blog.content_html,
                    category=category,
                    author_name=settings.AUTHOR_NAME,
                    author_avatar=settings.AUTHOR_AVATAR,
                    tags=blog.tags,
                    read_time=estimate_read_time(blog.content_html),
                    seo_title=blog.meta_title,
                    seo_description=blog.meta_description
                )
                
                # Post to Odoo
                resp = odoo.create_blog(req)
                
                if resp.status == "success":
                    results.append({
                        "title": blog.title,
                        "id": resp.data.get("id"),
                        "slug": resp.data.get("slug"),
                        "chars": len(blog.content_html),
                        "status": "success"
                    })
                    logger.info(f"✅ Blog {i+1} posted: ID={resp.data.get('id')}")
                else:
                    results.append({
                        "title": blog.title,
                        "status": "failed",
                        "error": resp.message
                    })
                    logger.error(f"❌ Blog {i+1} failed: {resp.message}")
                    
            except Exception as e:
                logger.error(f"Error generating blog {i+1}: {e}")
                results.append({
                    "topic": topic,
                    "status": "failed",
                    "error": str(e)
                })
        
        # Update last post time
        success_count = len([r for r in results if r.get("status") == "success"])
        if success_count > 0:
            save_last_post_time(LastPostTime(
                timestamp=datetime.now(),
                blogs_posted=success_count
            ))
        
        last_run_result = {
            "timestamp": datetime.now().isoformat(),
            "total": count,
            "success": success_count,
            "blogs": results
        }
        
        return {
            "status": "success" if success_count > 0 else "failed",
            "message": f"Generated {success_count}/{count} blogs",
            "blogs_generated": success_count,
            "blogs": results
        }
        
    except Exception as e:
        logger.error(f"Blog generation failed: {e}")
        last_run_result = {
            "timestamp": datetime.now().isoformat(),
            "error": str(e)
        }
        return {
            "status": "error",
            "message": str(e),
            "blogs_generated": 0,
            "blogs": []
        }


def scheduler_loop():
    """Background scheduler loop for automatic posting."""
    global scheduler_running
    scheduler_running = True
    
    logger.info("🔄 Scheduler started - checking every hour")
    
    while scheduler_running:
        try:
            last_post = load_last_post_time()
            hours_since = calculate_hours_since(last_post.timestamp)
            
            logger.info(f"⏰ Hours since last post: {hours_since:.1f} / {settings.POST_INTERVAL_HOURS}")
            
            if hours_since >= settings.POST_INTERVAL_HOURS:
                logger.info("✨ Time to generate blogs!")
                generate_blogs(count=settings.MAX_BLOGS_PER_RUN)
            else:
                remaining = settings.POST_INTERVAL_HOURS - hours_since
                logger.info(f"⏳ Next run in {remaining:.1f} hours")
            
            # Sleep for 1 hour
            for _ in range(3600):  # Check every second if we should stop
                if not scheduler_running:
                    break
                asyncio.run(asyncio.sleep(1))
                
        except Exception as e:
            logger.error(f"Scheduler error: {e}")
            asyncio.run(asyncio.sleep(60))  # Retry after 1 minute
    
    logger.info("Scheduler stopped")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    # Start scheduler in background thread
    scheduler_thread = threading.Thread(target=scheduler_loop, daemon=True)
    scheduler_thread.start()
    logger.info("🚀 Blog Automation API started")
    
    yield
    
    # Shutdown
    global scheduler_running
    scheduler_running = False
    logger.info("👋 Blog Automation API stopped")


# Create FastAPI app
app = FastAPI(
    title="Blog Automation API",
    description="API for automated blog generation and posting to Odoo",
    version="1.0.0",
    lifespan=lifespan
)


@app.get("/")
async def root():
    """Root endpoint with API info."""
    return {
        "name": "Blog Automation API",
        "version": "1.0.0",
        "endpoints": {
            "health": "GET /health",
            "status": "GET /status",
            "generate": "POST /generate",
            "trigger": "POST /trigger"
        }
    }


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}


@app.get("/status")
async def status():
    """Get system status."""
    last_post = load_last_post_time()
    hours_since = calculate_hours_since(last_post.timestamp)
    
    return {
        "scheduler_running": scheduler_running,
        "last_post_time": last_post.timestamp.isoformat(),
        "hours_since_last_post": round(hours_since, 2),
        "next_run_in_hours": round(max(0, settings.POST_INTERVAL_HOURS - hours_since), 2),
        "config": {
            "max_blogs_per_run": settings.MAX_BLOGS_PER_RUN,
            "post_interval_hours": settings.POST_INTERVAL_HOURS,
            "llm_model": settings.LLM_MODEL,
            "serp_query": settings.SERP_SEARCH_QUERY
        },
        "last_run_result": last_run_result
    }


@app.post("/generate", response_model=GenerateResponse)
async def generate(request: GenerateRequest, background_tasks: BackgroundTasks):
    """
    Generate blogs immediately.
    
    Args:
        count: Number of blogs to generate (default: 2)
        topics: Optional list of specific topics
    """
    logger.info(f"Manual trigger: generating {request.count} blogs")
    result = generate_blogs(count=request.count, topics=request.topics)
    return GenerateResponse(**result)


@app.post("/trigger")
async def trigger():
    """
    Quick trigger to generate configured number of blogs.
    Simpler than /generate - uses all defaults.
    """
    logger.info(f"Quick trigger: generating {settings.MAX_BLOGS_PER_RUN} blogs")
    result = generate_blogs(count=settings.MAX_BLOGS_PER_RUN)
    return result


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
