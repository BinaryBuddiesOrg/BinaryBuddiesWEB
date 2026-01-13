# Comments & Likes System - Scalability Improvements

> **Reference Document for Future Implementation**  
> Target Scale: 10M+ comments, 100K+ concurrent users

---

## Table of Contents

1. [Current Architecture Summary](#current-architecture-summary)
2. [Database Optimizations](#database-optimizations)
3. [Caching Strategies](#caching-strategies)
4. [Query Optimizations](#query-optimizations)
5. [Architecture Patterns](#architecture-patterns)
6. [Real-time Features](#real-time-features)
7. [Monitoring & Observability](#monitoring--observability)
8. [Implementation Priority](#implementation-priority)

---

## Current Architecture Summary

### What's Already Implemented ✅

| Feature | Description | Scalability |
|---------|-------------|-------------|
| Keyset Pagination | Cursor-based pagination using `id:ts` format | Excellent - O(1) page access |
| Denormalized Counts | `like_count`, `comment_count` on parent records | Excellent - No COUNT(*) needed |
| Lazy-loaded Replies | Nested replies fetched on-demand | Great - Reduces initial payload |
| Indexed Fields | `blog_id`, `user_id`, `is_deleted` indexed | Good - Fast lookups |
| Soft Delete | Preserves thread structure with `is_deleted` flag | Good - No cascade issues |
| Adjacency List | Simple `parent_id` for tree structure | Good for shallow trees |

### Current Bottlenecks ⚠️

| Area | Issue | Impact |
|------|-------|--------|
| Single PostgreSQL | All reads/writes to one DB | Max ~5K concurrent connections |
| No Read Replicas | No horizontal read scaling | Latency spikes under load |
| ORM Overhead | Odoo ORM adds latency | 2-5x slower than raw SQL |
| No Caching | Every request hits database | Unnecessary DB load |
| Synchronous Counters | Like counts updated in-transaction | Lock contention |

---

## Database Optimizations

### 1. Composite Indexes

Add compound indexes for common query patterns:

```sql
-- Most common query: Get root comments for a blog, sorted by date
CREATE INDEX idx_comment_blog_parent_date 
ON bbweb_blog_comment (blog_id, parent_id, create_date, id)
WHERE active = true;

-- Get replies for a comment
CREATE INDEX idx_comment_parent_date 
ON bbweb_blog_comment (parent_id, create_date, id)
WHERE active = true AND parent_id IS NOT NULL;

-- User's comments for profile
CREATE INDEX idx_comment_user_date 
ON bbweb_blog_comment (user_id, create_date DESC)
WHERE active = true;

-- Check if user liked a comment (for batch checks)
CREATE INDEX idx_comment_like_user_comment 
ON bbweb_comment_like (user_id, comment_id);

-- Check if user liked a blog
CREATE INDEX idx_blog_like_user_blog 
ON bbweb_blog_like (user_id, blog_id);
```

### 2. Materialized Path for Tree Queries

Replace simple `parent_id` with materialized path for O(1) subtree queries:

```python
# Current: Adjacency List
parent_id = fields.Many2one('bbweb.blog.comment')

# Enhanced: Add materialized path
path = fields.Char(index=True)  # e.g., "1.45.231.892"
depth = fields.Integer()  # Already have this

# Benefits:
# - Get all ancestors: WHERE '1.45.231' LIKE path || '%'
# - Get all descendants: WHERE path LIKE '1.45.231.%'
# - No recursive queries needed
```

### 3. Partitioning for Large Tables

Partition comments table by date for faster archival and queries:

```sql
-- Partition by month
CREATE TABLE bbweb_blog_comment (
    id SERIAL,
    blog_id INTEGER,
    create_date TIMESTAMP,
    ...
) PARTITION BY RANGE (create_date);

CREATE TABLE bbweb_blog_comment_2026_01 
PARTITION OF bbweb_blog_comment
FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
```

### 4. Read Replicas

Configure PostgreSQL streaming replication:

```yaml
# docker-compose.yml
services:
  postgres-primary:
    image: postgres:15
    environment:
      POSTGRES_REPLICATION_MODE: master
      
  postgres-replica:
    image: postgres:15
    environment:
      POSTGRES_REPLICATION_MODE: slave
      POSTGRES_MASTER_HOST: postgres-primary
```

Route read queries to replica in Odoo config or via PgBouncer.

---

## Caching Strategies

### 1. Redis for Hot Data

```python
# Cache keys structure
CACHE_KEYS = {
    'blog_engagement': 'blog:{blog_id}:engagement',  # TTL: 30s
    'comment_list': 'blog:{blog_id}:comments:page:{cursor}',  # TTL: 60s
    'user_likes': 'user:{user_id}:likes:{type}',  # TTL: 5min
    'user_profile': 'user:{user_id}:profile',  # TTL: 5min
}

# Example: Cache blog engagement
def get_blog_engagement(blog_id, user_id):
    cache_key = f"blog:{blog_id}:engagement"
    cached = redis.get(cache_key)
    if cached:
        data = json.loads(cached)
        # Only fetch user-specific data (is_liked)
        data['is_liked'] = check_user_liked(blog_id, user_id)
        return data
    
    # Fetch from DB and cache
    data = fetch_from_db(blog_id)
    redis.setex(cache_key, 30, json.dumps(data))
    return data
```

### 2. Cache Invalidation Strategy

```python
# Patterns:
# 1. TTL-based (simple, eventual consistency)
# 2. Event-based invalidation (immediate consistency)

def on_comment_created(comment):
    # Invalidate relevant caches
    redis.delete(f"blog:{comment.blog_id}:comments:*")
    redis.delete(f"blog:{comment.blog_id}:engagement")
    if comment.parent_id:
        redis.delete(f"comment:{comment.parent_id}:replies:*")

def on_like_toggled(blog_id, user_id):
    redis.delete(f"blog:{blog_id}:engagement")
    redis.delete(f"user:{user_id}:likes:blogs")
```

### 3. Frontend Caching (React Query)

Already implemented, but can be tuned:

```typescript
// Current
staleTime: 30 * 1000,  // 30 seconds

// For high-traffic pages, consider:
staleTime: 5 * 60 * 1000,  // 5 minutes for profile data
gcTime: 30 * 60 * 1000,    // Keep in cache 30 min
refetchOnWindowFocus: false,
```

---

## Query Optimizations

### 1. Raw SQL for Hot Paths

Replace ORM queries with raw SQL for critical paths:

```python
# Current (ORM) - ~50ms
comments = self.search(domain, order='create_date asc', limit=20)

# Optimized (Raw SQL) - ~15ms
query = """
    SELECT c.id, c.content, c.like_count, c.reply_count,
           c.is_edited, c.is_deleted, c.create_date,
           u.id as user_id, u.name as user_name, u.image_url
    FROM bbweb_blog_comment c
    JOIN bbweb_website_user u ON c.user_id = u.id
    WHERE c.blog_id = %s 
      AND c.parent_id IS NULL 
      AND c.active = true
      AND (c.create_date, c.id) > (%s, %s)  -- Keyset pagination
    ORDER BY c.create_date, c.id
    LIMIT %s
"""
self.env.cr.execute(query, (blog_id, cursor_ts, cursor_id, limit))
```

### 2. Batch Like Status Checks

```python
# Current: N+1 queries for is_liked
for comment in comments:
    comment.is_liked = check_liked(comment.id, user_id)

# Optimized: Single batch query
comment_ids = [c.id for c in comments]
liked_ids = set(
    self.env['bbweb.comment.like']
    .search([('comment_id', 'in', comment_ids), ('user_id', '=', user_id)])
    .mapped('comment_id.id')
)
for comment in comments:
    comment.is_liked = comment.id in liked_ids
```

### 3. Async Counter Updates

Decouple counter updates from main transaction:

```python
# Current: Synchronous (blocks on lock)
def toggle_like(self, blog_id, user_id):
    # ... create/delete like ...
    blog.write({'like_count': blog.like_count + delta})  # Lock!

# Optimized: Queue for batch update
def toggle_like(self, blog_id, user_id):
    # ... create/delete like ...
    redis.hincrby(f"counters:blog:{blog_id}", 'like_count', delta)

# Background worker (every 10 seconds)
def flush_counters():
    for key in redis.scan_iter("counters:blog:*"):
        blog_id = key.split(':')[2]
        counts = redis.hgetall(key)
        Blog.browse(blog_id).write(counts)
        redis.delete(key)
```

---

## Architecture Patterns

### 1. CQRS (Command Query Responsibility Segregation)

Separate read and write models:

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend                              │
└───────────────┬─────────────────┬───────────────────────┘
                │                 │
        ┌───────▼───────┐ ┌───────▼───────┐
        │ Write Service │ │ Read Service  │
        │   (Odoo)      │ │   (FastAPI)   │
        └───────┬───────┘ └───────┬───────┘
                │                 │
        ┌───────▼───────┐ ┌───────▼───────┐
        │  PostgreSQL   │ │  Redis/Denorm │
        │   (Primary)   │ │   (Replica)   │
        └───────────────┘ └───────────────┘
```

### 2. Microservice Extraction

At 10M+ scale, extract comments as a separate service:

```
┌─────────────────────────────────────────────────────────┐
│                     API Gateway                          │
└─────────┬───────────────┬───────────────┬───────────────┘
          │               │               │
┌─────────▼─────┐ ┌───────▼─────┐ ┌───────▼─────────┐
│ Blog Service  │ │ Comment Svc │ │ Notification Svc│
│   (Odoo)      │ │  (FastAPI)  │ │    (Node.js)    │
└───────────────┘ └───────┬─────┘ └─────────────────┘
                          │
                  ┌───────▼───────┐
                  │   MongoDB     │  ← Better for nested docs
                  │   + Redis     │  ← Real-time counters
                  └───────────────┘
```

### 3. Event Sourcing for Likes

Store likes as events for audit and analytics:

```python
# Instead of toggling a single record
class LikeEvent:
    user_id: int
    target_type: str  # 'blog' | 'comment'
    target_id: int
    action: str  # 'like' | 'unlike'
    timestamp: datetime

# Benefits:
# - Full audit trail
# - Easy analytics (likes over time)
# - Event replay for recovery
# - Real-time streaming to analytics
```

---

## Real-time Features

### 1. WebSocket for Live Updates

```typescript
// Frontend: Subscribe to comment updates
const socket = io('wss://api.example.com/comments');
socket.emit('subscribe', { blogId: 123 });

socket.on('new_comment', (comment) => {
    queryClient.setQueryData(['comments', blogId], (old) => ({
        ...old,
        pages: [{ comments: [comment, ...old.pages[0].comments] }]
    }));
});

socket.on('like_update', ({ commentId, likeCount }) => {
    // Update specific comment's like count
});
```

### 2. Server-Sent Events (SSE) - Simpler Alternative

```python
# Odoo controller
@http.route('/api/bbweb/blogs/<int:blog_id>/events', type='http', auth='public')
def stream_events(self, blog_id):
    def generate():
        pubsub = redis.pubsub()
        pubsub.subscribe(f'blog:{blog_id}:events')
        for message in pubsub.listen():
            if message['type'] == 'message':
                yield f"data: {message['data']}\n\n"
    
    return Response(generate(), mimetype='text/event-stream')
```

---

## Monitoring & Observability

### 1. Key Metrics to Track

```python
# Application metrics
METRICS = {
    'comments_created_total': Counter,
    'comments_query_duration_seconds': Histogram,
    'likes_toggled_total': Counter,
    'cache_hit_rate': Gauge,
    'db_connection_pool_size': Gauge,
}
```

### 2. Query Performance Logging

```python
# Log slow queries
import logging
logger = logging.getLogger('bbweb.performance')

def get_comments_paginated(self, blog_id, ...):
    start = time.time()
    result = self._fetch_comments(...)
    duration = time.time() - start
    
    if duration > 0.1:  # 100ms threshold
        logger.warning(f"Slow query: get_comments blog={blog_id} took {duration:.3f}s")
    
    return result
```

### 3. Health Checks

```python
@http.route('/api/bbweb/health', type='json', auth='public')
def health_check(self):
    checks = {
        'database': self._check_db(),
        'redis': self._check_redis(),
        'disk_space': self._check_disk(),
    }
    healthy = all(c['status'] == 'ok' for c in checks.values())
    return {'status': 'healthy' if healthy else 'unhealthy', 'checks': checks}
```

---

## Implementation Priority

### Phase 1: Quick Wins (1-2 days)
| Task | Impact | Effort |
|------|--------|--------|
| Add composite indexes | High | Low |
| Add Redis caching for engagement | High | Medium |
| Tune React Query stale times | Medium | Low |

### Phase 2: Medium Term (1-2 weeks)
| Task | Impact | Effort |
|------|--------|--------|
| Raw SQL for hot queries | High | Medium |
| Async counter updates | High | Medium |
| Add materialized path | Medium | Medium |
| Set up read replica | High | Medium |

### Phase 3: Long Term (1-3 months)
| Task | Impact | Effort |
|------|--------|--------|
| Extract comments microservice | Very High | High |
| Add WebSocket real-time updates | Medium | High |
| Implement event sourcing for likes | Medium | High |
| Table partitioning | Medium | Medium |

---

## Resources & References

- [PostgreSQL Indexing Best Practices](https://www.postgresql.org/docs/current/indexes.html)
- [Redis Caching Patterns](https://redis.io/docs/manual/patterns/)
- [Keyset Pagination Explained](https://use-the-index-luke.com/no-offset)
- [Tree Structures in SQL (Materialized Path)](https://www.slideshare.net/billkarwin/models-for-hierarchical-data)
- [CQRS Pattern](https://martinfowler.com/bliki/CQRS.html)
- [Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html)

---

> **Last Updated**: January 2026  
> **Author**: Binary Buddies Engineering Team
