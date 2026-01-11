# Blog Automation System

Automated blog generation and posting system that uses SerpAPI for topic discovery and OpenRouter/OpenAI for content generation, then publishes to Odoo Blog API.

## Features

- ✅ **100% Original Content** - Uses LLM to generate unique, non-plagiarized blog posts
- ✅ **SEO Optimized** - Automatic meta tags, descriptions, and keyword optimization
- ✅ **24-Hour Scheduling** - Automatically posts blogs every 24 hours
- ✅ **Docker Ready** - Single container deployment with auto-restart
- ✅ **SERP-Based Topics** - Uses real search trends and questions for relevant content
- ✅ **Multi-Category** - Rotates through AI/ML, Automation, and Development categories
- ✅ **Persistent State** - Caches SERP data and tracks posting times

## Architecture

```
SERP API          LLM (OpenRouter)          Odoo Blog API
   ↓                    ↓                         ↓
Topic Discovery  →  Content Generation  →  Publishing
```

**Flow:**
1. Fetch search signals from SerpAPI (related searches, PAA questions)
2. Build master prompt with topic and signals
3. Generate 900-1200 word blog post using LLM
4. Extract excerpt and estimate read time
5. Post to Odoo via authenticated API

## Quick Start

### Prerequisites

- Docker and Docker Compose
- API keys for:
  - [OpenRouter](https://openrouter.ai/keys) (or OpenAI)
  - [SerpAPI](https://serpapi.com/manage-api-key)
  - Odoo Blog API key (generate with: `openssl rand -hex 32`)

### Setup

1. **Clone and navigate to directory:**
   ```bash
   cd /home/messi/messi/HH/BBWeb/blog-automation
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   nano .env  # Fill in your API keys
   ```

3. **Build and run:**
   ```bash
   docker-compose up --build -d
   ```

4. **Monitor logs:**
   ```bash
   docker-compose logs -f
   ```

## Configuration

### Environment Variables

Edit `.env` file:

```bash
# Required API Keys
OPENROUTER_API_KEY=your-key-here
SERPAPI_API_KEY=your-key-here
ODOO_BLOG_API_KEY=your-key-here

# Odoo Configuration
ODOO_URL=http://localhost:8069

# Automation Settings
MAX_BLOGS_PER_RUN=30          # Number of blogs to generate per cycle
POST_INTERVAL_HOURS=24        # Hours between posting cycles

# LLM Configuration
LLM_MODEL=openai/gpt-4o       # Model to use (see OpenRouter models)
```

### Supported LLM Models

Via OpenRouter:
- `openai/gpt-4o` (recommended)
- `anthropic/claude-3.5-sonnet`
- `meta-llama/llama-3.1-70b-instruct`
- And many more at [openrouter.ai/models](https://openrouter.ai/models)

### Blog Categories

The system rotates through these categories:
- `ai_ml` - AI and Machine Learning
- `automation` - Automation and DevOps  
- `development` - Software Development

Edit `BLOG_CATEGORIES` in `.env` to customize.

## Project Structure

```
blog-automation/
├── app/
│   ├── main.py              # Main loop with 24-hour scheduling
│   ├── config.py            # Configuration management
│   ├── models.py            # Pydantic models
│   ├── serp_client.py       # SerpAPI integration
│   ├── llm_client.py        # OpenRouter/OpenAI integration
│   ├── odoo_client.py       # Odoo API integration
│   ├── prompt_builder.py    # Master prompt system
│   ├── utils.py             # Helper functions
│   └── logger.py            # Logging configuration
├── data/
│   ├── serp_cache.json      # Cached SERP data (auto-created)
│   └── last_post_time.json  # Last posting timestamp (auto-created)
├── logs/
│   └── blog_automation.log  # Application logs
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── .env.example
└── README.md
```

## Master Prompt System

The system uses a **two-part prompt approach**:

###System Prompt (Static)

```
You are a professional content writer and SEO editor.

Rules you must follow strictly:
- Write 100% original content.
- Do NOT copy or rewrite text from any source.
- Use provided SERP data only for understanding topics and intent.
- Do NOT mention SERP, Google, or scraping.
- If a fact is uncertain, generalize it or avoid exact numbers.
- Use clear structure, headings, and natural language.
- Content must be suitable for publishing directly on a professional blog.
```

### User Prompt (Dynamic)

Built dynamically with:
- Primary topic
- Related search queries
- People Also Ask questions
- Reference links (for context only)
- Required structure and SEO metadata

## 24-Hour Posting Logic

The system uses a simple, timezone-agnostic approach:

```python
while True:
    hours_since_last_post = (now - last_post_time).hours
    
    if hours_since_last_post >= 24:
        generate_and_post_blogs()
        save_last_post_time(now)
    else:
        sleep(1 hour)
```

**Benefits:**
- No cron complexity
- No timezone issues  
- Posts exactly 24 hours from last successful post
- Survives container restarts

## Monitoring

### View Logs

```bash
# Real-time logs
docker-compose logs -f

# Last 100 lines
docker-compose logs --tail=100

# Search for errors
docker-compose logs | grep ERROR
```

### Check Status

```bash
# Container status
docker-compose ps

# Check last post time
cat data/last_post_time.json

# View cached SERP data
cat data/serp_cache.json
```

### Log Files

Log files are persisted in `logs/blog_automation.log` with rotation.

## Troubleshooting

### Container Won't Start

**Problem:** Docker container exits immediately

**Solution:**
```bash
# Check logs for errors
docker-compose logs

# Verify environment file
cat .env | grep -v "^#" | grep "="

# Test manually
docker-compose run --rm blog-automation python3 -c "from app.config import settings; print(settings)"
```

### "Missing API Key" Error

**Problem:** Environment variables not loaded

**Solution:**
- Ensure `.env` file exists in the same directory as `docker-compose.yml`
- Check file permissions: `chmod 644 .env`
- Verify no typos in variable names

### "LLM Connection Failed"

**Problem:** Can't connect to OpenRouter/OpenAI

**Solution:**
```bash
# Test API key
curl https://openrouter.ai/api/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"

# Check network connectivity from container
docker-compose exec blog-automation ping -c 3 openrouter.ai
```

### "Odoo API Error" ### **Problem:** Can't post to Odoo

**Solution:**
- Verify Odoo is running: `curl http://localhost:8069`
- Check API key configured in Odoo: Settings → Technical → System Parameters → `bbweb.blog_api_key`
- Test API manually: See [Blog API Documentation](../odoo/custom/binary_buddies_web/README_BLOG_API.md)

### SERP Data Not Updating

**Problem:** Using old cached data

**Solution:**
```bash
# Delete cache to force refresh
rm data/serp_cache.json

# Restart container
docker-compose restart
```

## Development

### Run Locally (Without Docker)

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env
# Edit .env with your API keys

# Run
python3 -m app.main
```

### Test Individual Components

```python
# Test SERP client
from app.serp_client import SerpAPIClient
from app.config import settings

client = SerpAPIClient()
data = client.get_search_signals()
print(f"Related searches: {len(data.related_searches)}")

# Test LLM client
from app.llm_client import LLMClient

client = LLMClient()
assert client.test_connection()

# Test Odoo client
from app.odoo_client import OdooBlogClient

client = OdooBlogClient()
assert client.test_connection()
```

## Cost Estimation

**For 30 blogs/day, 900 days:**

| Service | Usage | Cost/Month |
|---------|-------|------------|
| **SerpAPI** | 30 searches/month | ~$5-10 |
| **OpenRouter** (GPT-4o) | ~75k tokens/blog | ~$30-50 |
| **Total** | | **~$35-60/month** |

**Cost savings tips:**
- Use cheaper models (Llama 3.1, Mistral)
- Cache SERP data for multiple blogs
- Reduce MAX_BLOGS_PER_RUN

## API Integration

This system posts to the existing Odoo Blog API at `/api/bbweb/blogs/create`.

See full API documentation: [Blog API README](../odoo/custom/binary_buddies_web/README_BLOG_API.md)

**Authentication:**
- Header: `X-API-Key: your-api-key`
- Format: JSON-RPC

**Example Payload:**
```json
{
  "jsonrpc": "2.0",
  "method": "call",
  "params": {
    "title": "Blog Title",
    "excerpt": "Short summary",
    "content": "<html>...</html>",
    "category": "ai_ml",
    "author_name": "AI Content Bot",
    "tags": ["AI", "Automation"]
  }
}
```

## Security Notes

- **Never commit `.env` file** to version control
- Rotate API keys every 90 days
- Use different keys for dev/prod environments
- Monitor logs for unauthorized access attempts
- Run container as non-root user (already configured)

## Scaling

### Increase Blog Volume

Edit `.env`:
```bash
MAX_BLOGS_PER_RUN=50  # Generate 50 blogs per cycle
```

### Change Posting Frequency

```bash
POST_INTERVAL_HOURS=12  # Post every 12 hours instead of 24
```

### Use Multiple Containers

Run separate containers for different topics/categories:

```bash
# Copy directory
cp -r blog-automation blog-automation-tech
cp -r blog-automation blog-automation-business

# Edit .env in each with different SERP_SEARCH_QUERY
# Run both
cd blog-automation-tech && docker-compose up -d
cd blog-automation-business && docker-compose up -d
```

## License

Internal use only. Not for redistribution.

## Support

For issues or questions:
1. Check logs: `docker-compose logs`
2. Review troubleshooting section above
3. Test individual components
4. Contact system administrator

---

**Version:** 1.0.0  
**Last Updated:** 2026-01-10
