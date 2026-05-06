# Blog Creation API - Setup Guide

## Quick Start

### 1. Generate API Key

Generate a secure random API key:

```bash
# Linux/Mac
openssl rand -hex 32

# Or using Python
python3 -c "import secrets; print(secrets.token_hex(32))"
```

Example output: `5f4dcc3b5aa765d61d8327deb882cf99a06fbba9c4c4e8a95e1f6b3b6d18c82f`

### 2. Configure API Key in Odoo

**Option A: Via Odoo UI (Recommended)**

1. Login to Odoo admin panel: http://localhost:8069/web
2. Navigate to: **Settings → Technical → Parameters → System Parameters**
3. Click **Create**
4. Fill in:
   - **Key**: `bbweb.blog_api_key`
   - **Value**: `<paste-your-generated-key>`
5. Click **Save**

**Option B: Via Database (Advanced)**

```sql
INSERT INTO ir_config_parameter (key, value, create_date, write_date, create_uid, write_uid)
VALUES (
    'bbweb.blog_api_key',
    '5f4dcc3b5aa765d61d8327deb882cf99a06fbba9c4c4e8a95e1f6b3b6d18c82f',
    NOW(),
    NOW(),
    1,
    1
);
```

### 3. Test the API

Using cURL:

```bash
export BLOG_API_KEY="your-generated-key"
export ODOO_URL="http://localhost:8069"

curl -X POST "$ODOO_URL/api/bbweb/blogs/create" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $BLOG_API_KEY" \
  -d '{
    "jsonrpc": "2.0",
    "method": "call",
    "params": {
      "title": "Test Blog Post",
      "excerpt": "This is a test blog post created via API",
      "content": "<p>Hello World!</p>",
      "category": "development",
      "author_name": "API Tester",
      "tags": ["Test", "API"]
    }
  }'
```

Expected response:

```json
{
  "jsonrpc": "2.0",
  "id": null,
  "result": {
    "status": "success",
    "message": "Blog post created successfully",
    "data": {
      "id": 1,
      "slug": "test-blog-post",
      "title": "Test Blog Post",
      "url": "/blog/test-blog-post",
      "author": "API Tester",
      "category": "development",
      "publish_date": "2026-01-10",
      "featured": false,
      "active": true,
      "tags": ["Test", "API"]
    },
    "authenticated_as": "api_key"
  }
}
```

---

## API Documentation

### Endpoint

```
POST /api/bbweb/blogs/create
```

### Authentication

**Method 1: API Key (for programs)**
```http
X-API-Key: your-api-key-here
```

**Method 2: Session (for website users)**
```json
{
  "params": {
    "google_id": "user-google-id-from-nextauth",
    ...
  }
}
```

### Request Body

```json
{
  "jsonrpc": "2.0",
  "method": "call",
  "params": {
    // REQUIRED
    "title": "string",
    "excerpt": "string",
    "content": "string (HTML)",
    "category": "ai_ml | automation | development | industry_news",
    "author_name": "string",
    
    // OPTIONAL
    "slug": "string",
    "author_avatar": "string",
    "publish_date": "YYYY-MM-DD",
    "read_time": "string",
    "tags": ["array", "of", "strings"],
    "featured": false,
    "active": true,
    
    // OPTIONAL - Images (base64 encoded, stored in S3 if >50KB)
    "image_base64": "base64-string (max 10MB)",
    "og_image_base64": "base64-string (max 10MB)",
    
    // OPTIONAL - SEO
    "seo_title": "string",
    "seo_description": "string",
    "seo_keywords": "string"
  }
}
```

### Categories

| Value | Display Name |
|-------|-------------|
| `ai_ml` | AI/ML |
| `automation` | Automation |
| `development` | Development |
| `industry_news` | Industry News |

### Image Handling

Images are stored using Odoo Binary fields with **automatic S3 backend**:

- **ALL images** (any size): **Automatically uploaded to S3 bucket**
- **Maximum size**: 10MB per image
- **Format**: Base64 encoded string
- **Serving**: Via CloudFront CDN (if configured)
- **Note**: Only JS/CSS files stay in database for performance

To include an image in your request:

```javascript
// JavaScript example
const fs = require('fs');
const imageBuffer = fs.readFileSync('preview.jpg');
const imageBase64 = imageBuffer.toString('base64');

const request = {
  params: {
    ...otherFields,
    image_base64: imageBase64
  }
};
```

```python
# Python example
import base64

with open('preview.jpg', 'rb') as f:
    image_data = base64.b64encode(f.read()).decode('utf-8')

request['params']['image_base64'] = image_data
```

### Response

**Success Response:**
```json
{
  "jsonrpc": "2.0",
  "result": {
    "status": "success",
    "message": "Blog post created successfully",
    "data": {
      "id": 42,
      "slug": "my-blog-post",
      "title": "My Blog Post",
      "url": "/blog/my-blog-post",
      "author": "Author Name",
      "category": "development",
      "publish_date": "2026-01-10",
      "featured": false,
      "active": true,
      "tags": ["Tag1", "Tag2"]
    },
    "authenticated_as": "api_key"
  }
}
```

**Error Responses:**

```json
// Missing authentication
{
  "status": "error",
  "message": "Authentication required. Provide \"google_id\" parameter (for website users) or \"X-API-Key\" header (for API access)."
}

// Invalid API key
{
  "status": "error",
  "message": "Invalid API key. Access denied."
}

// Missing required fields
{
  "status": "error",
  "message": "Missing required fields: title, excerpt",
  "required_fields": ["title", "excerpt", "content", "category", "author_name"]
}

// Invalid category
{
  "status": "error",
  "message": "Invalid category. Must be one of: ai_ml, automation, development, industry_news",
  "valid_categories": ["ai_ml", "automation", "development", "industry_news"]
}

// Image too large
{
  "status": "error",
  "message": "Preview image too large (12.34MB). Maximum allowed: 10MB."
}
```

---

## Using the Client Scripts

### Python Client

```bash
# Install dependencies
pip install requests

# Set API key
export BLOG_API_KEY="your-api-key"
export ODOO_URL="http://localhost:8069"

# Run example
cd /path/to/odoo/custom/binary_buddies_web/examples
python3 blog_api_client.py
```

### Node.js Client

```bash
# Install dependencies
npm install axios

# Set API key
export BLOG_API_KEY="your-api-key"
export ODOO_URL="http://localhost:8069"

# Run example
cd /path/to/odoo/custom/binary_buddies_web/examples
node blog_api_client.js
```

---

## S3 Storage Verification

After creating a blog with images, verify S3 storage:

### Check S3 Bucket

```bash
# Using AWS CLI
aws s3 ls s3://binarybuddies-attachments/ --recursive

# Using Docker (inside Odoo container)
docker exec bbweb-odoo python3 -c "
import boto3
s3 = boto3.client('s3', region_name='ap-south-1')
response = s3.list_objects_v2(Bucket='binarybuddies-attachments')
for obj in response.get('Contents', []):
    print(f'{obj[\"Key\"]} ({obj[\"Size\"]} bytes)')
"
```

### Check Database

```sql
-- View blog attachments
SELECT 
    bp.id as blog_id,
    bp.title,
    bp.slug,
    CASE 
        WHEN bp.image IS NOT NULL THEN 'Has image'
        ELSE 'No image'
    END as image_status,
    LENGTH(bp.image) as image_size_bytes
FROM bbweb_blog_post bp
ORDER BY bp.id DESC
LIMIT 10;

-- View all attachments in S3
SELECT 
    id,
    name,
    store_fname,
    file_size,
    mimetype
FROM ir_attachment
WHERE fs_storage_id IS NOT NULL
ORDER BY id DESC
LIMIT 20;
```

---

## Security Best Practices

### API Key Storage

✅ **DO:**
- Store API key in environment variables
- Use `.env` files (add to `.gitignore`)
- Rotate keys periodically (every 90 days)
- Use different keys for dev/staging/production

❌ **DON'T:**
- Commit API keys to version control
- Hard-code keys in scripts
- Share keys via email/chat
- Use the same key across environments

### Example .env File

```bash
# .env
ODOO_URL=http://localhost:8069
BLOG_API_KEY=5f4dcc3b5aa765d61d8327deb882cf99a06fbba9c4c4e8a95e1f6b3b6d18c82f

# AWS (if running migrations)
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxx
```

Add to `.gitignore`:
```
.env
.env.local
.env.*.local
```

### API Key Rotation

To rotate the API key:

1. Generate new key: `openssl rand -hex 32`
2. Update in Odoo: Settings → Technical → System Parameters → `bbweb.blog_api_key`
3. Update in all scripts/services using the API
4. Monitor logs for old key usage
5. After grace period, delete old key

---

## Troubleshooting

### "Authentication required" error

**Problem:** API returns authentication error

**Solution:**
```bash
# Check if header is being sent correctly
curl -v -X POST "http://localhost:8069/api/bbweb/blogs/create" \
  -H "X-API-Key: your-key" \
  ... | grep "X-API-Key"

# Verify key in Odoo
docker exec bbweb-odoo odoo shell -c /etc/odoo/odoo.conf -d bbweb_odoo
>>> env['ir.config_parameter'].get_param('bbweb.blog_api_key')
'5f4dcc3b...'
```

### "Invalid API key" error

**Problem:** API key doesn't match configured value

**Solution:**
1. Verify key in Odoo system parameters
2. Check for extra spaces/newlines in key
3. Ensure key is exactly 64 characters (hex)

### Images not going to S3

**Problem:** Images stored in database instead of S3

**Solution:**
1. Check image size (must be >50KB for S3)
2. Verify S3 storage is configured: Settings → Technical → FS Storage
3. Check "Use As Default For Attachments" is enabled
4. Review threshold rules in FS Storage configuration

### "Image too large" error

**Problem:** Image exceeds 10MB limit

**Solution:**
1. Compress image before encoding
2. Resize to recommended dimensions (800x400px for previews)
3. Use optimized formats (WebP, optimized JPEG)

---

## Permission Management (Website Users)

To grant blog authoring permission to website users:

1. Go to: **Settings → Users & Companies → Website Users**
2. Find the user
3. Check **Can Author Blogs** checkbox
4. Click **Save**

Users can then create blogs via the website UI (if implemented) or by passing their `google_id` in the API request.

---

## Monitoring & Logs

### View API Logs

```bash
# View Odoo logs
docker logs bbweb-odoo -f | grep "Blog creation"

# Filter for API key auth
docker logs bbweb-odoo -f | grep "authenticated via API key"

# Filter for errors
docker logs bbweb-odoo -f | grep "ERROR" | grep "blog"
```

### Log Messages

The API logs the following:

- `Blog creation authenticated via session for user: {email}` - Successful session auth
- `Blog creation authenticated via API key from IP: {ip}` - Successful API key auth
- `Invalid API key attempt from IP: {ip}` - Failed authentication
- `Blog post created successfully: ID={id}, slug={slug}` - Successful creation
- `Created new blog tag: {tag_name}` - New tag created

---

## Blog search API (SERP-style, LLM-friendly)

`GET /api/bbweb/blogs/search` returns a **stable JSON envelope** similar in spirit to search-engine result APIs: `search_metadata` plus `organic_results`. Each result includes a **plain-text `snippet`** (from the excerpt) and optional stripped **`content_text`** for retrieval workflows.

### Query parameters

| Parameter | Description |
|-----------|-------------|
| `q` | Substring search over **title**, **excerpt**, and **HTML body** (case-insensitive). |
| `category` | Category label or code (same resolution as `GET /api/bbweb/blogs?category=...`). Unknown → no results. |
| `category_code` | Exact active category **code** (e.g. `development`). Unknown → no results. |
| `tag` | Tag name (case-insensitive). Unknown → no results. |
| `slug` | Exact post slug. |
| `since` / `until` | Filter `publish_date` (`YYYY-MM-DD`). Invalid dates → `400`. |
| `featured` | `1` / `true` to restrict to featured posts. |
| `page` | Page number (default `1`, minimum `1`). |
| `random` | `1` / `true` to **shuffle** matching posts (then paginate). Ignores relevance sort when `q` is set. Pool capped at **500** IDs (`random_pool_max` server-side); see `random_pool_capped` in metadata when total exceeds cap. |
| `limit` | Page size (default `20`, max `50`). |
| `include_body` | `1` / `true` to add `content_text` (HTML → plain text, capped at 12000 characters). |

### Canonical URLs (`link`)

Each hit includes **`link`**: `{public_origin}/blog/{slug}`.

- **`bbweb.public_site_url`** in *Settings → Technical → Parameters → System Parameters* overrides the origin when set (e.g. `https://binarybuddies.com`).
- Otherwise **`web.base.url`** is used (Odoo base URL).

### Example

```bash
curl -s "http://localhost:8069/api/bbweb/blogs/search?q=automation&limit=5"
curl -s "http://localhost:8069/api/bbweb/blogs/search?random=1&limit=5"
```

Minimal response shape:

```json
{
  "search_metadata": {
    "status": "Success",
    "engine": "bbweb_blog",
    "q": "automation",
    "total_results": 3,
    "page": 1,
    "limit": 5,
    "has_more": false,
    "processed_at": "2026-05-06T12:00:00Z",
    "include_body": false,
    "random": false
  },
  "organic_results": [
    {
      "position": 1,
      "title": "...",
      "link": "https://example.com/blog/my-post",
      "snippet": "Plain excerpt text…",
      "blog_id": 1,
      "slug": "my-post",
      "category": "Automation",
      "category_code": "automation",
      "published_date": "2026-01-15",
      "author_name": "...",
      "tags": ["RPA"],
      "featured": false,
      "api_detail_url": "http://localhost:8069/api/bbweb/blogs/1",
      "api_slug_url": "http://localhost:8069/api/bbweb/blogs/slug/my-post"
    }
  ]
}
```

Use **`snippet`** for short LLM context; call **`api_slug_url`** or **`api_detail_url`** when full HTML is required.

---

## Next Steps

1. ✅ Generate and configure API key
2. ✅ Test with cURL or client scripts
3. ✅ Verify S3 storage is working
4. Create blog posts programmatically
5. Monitor logs and S3 bucket
6. Set up API key rotation schedule

For questions or issues, check Odoo logs or contact your system administrator.
