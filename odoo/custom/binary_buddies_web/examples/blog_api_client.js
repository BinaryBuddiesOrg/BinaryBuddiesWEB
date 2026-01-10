const axios = require('axios');
const fs = require('fs');

/**
 * Blog API Client for Binary Buddies
 * Node.js example for creating blog posts programmatically
 */

class BlogAPIClient {
    /**
     * Initialize API client
     * @param {string} odooUrl - Odoo server URL (default: from ODOO_URL env or localhost)
     * @param {string} apiKey - API key (default: from BLOG_API_KEY env)
     */
    constructor(odooUrl = null, apiKey = null) {
        this.odooUrl = odooUrl || process.env.ODOO_URL || 'http://localhost:8069';
        this.apiKey = apiKey || process.env.BLOG_API_KEY;

        if (!this.apiKey) {
            throw new Error(
                'API key not provided. Set BLOG_API_KEY environment variable or pass apiKey parameter'
            );
        }
    }

    /**
     * Create a new blog post
     * @param {Object} blogData - Blog post data
     * @returns {Promise<Object>} API response
     */
    async createBlog(blogData) {
        const {
            title,
            excerpt,
            content,
            category,
            author_name,
            ...optionalFields
        } = blogData;

        // Validate required fields
        if (!title || !excerpt || !content || !category || !author_name) {
            throw new Error('Missing required fields: title, excerpt, content, category, author_name');
        }

        const payload = {
            jsonrpc: '2.0',
            method: 'call',
            params: {
                title,
                excerpt,
                content,
                category,
                author_name,
                ...optionalFields
            }
        };

        try {
            const response = await axios.post(
                `${this.odooUrl}/api/bbweb/blogs/create`,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-API-Key': this.apiKey
                    }
                }
            );

            // Check for JSON-RPC error
            if (response.data.error) {
                throw new Error(`API Error: ${JSON.stringify(response.data.error)}`);
            }

            return response.data.result || response.data;
        } catch (error) {
            if (error.response) {
                throw new Error(`HTTP ${error.response.status}: ${JSON.stringify(error.response.data)}`);
            }
            throw error;
        }
    }

    /**
     * Create blog with image
     * @param {Object} blogData - Blog data
     * @param {string} imagePath - Path to image file
     * @returns {Promise<Object>} API response
     */
    async createBlogWithImage(blogData, imagePath) {
        if (imagePath && fs.existsSync(imagePath)) {
            const imageBuffer = fs.readFileSync(imagePath);
            const imageBase64 = imageBuffer.toString('base64');
            blogData.image_base64 = imageBase64;
        }

        return this.createBlog(blogData);
    }
}

// =============================================================================
// USAGE EXAMPLES
// =============================================================================

async function exampleBasicBlog() {
    console.log('\n▶ Example 1: Basic blog');

    const client = new BlogAPIClient();

    const result = await client.createBlog({
        title: 'Getting Started with Node.js',
        excerpt: 'Learn the fundamentals of Node.js development',
        content: `
      <h2>Introduction</h2>
      <p>Node.js is a powerful JavaScript runtime...</p>
      
      <h2>Key Features</h2>
      <ul>
        <li>Asynchronous I/O</li>
        <li>Event-driven architecture</li>
        <li>NPM ecosystem</li>
      </ul>
    `,
        category: 'development',
        author_name: 'Node Bot',
        tags: ['Node.js', 'JavaScript', 'Tutorial'],
        read_time: '10 min read'
    });

    console.log('✅ Blog created successfully!');
    console.log(`   ID: ${result.data.id}`);
    console.log(`   Slug: ${result.data.slug}`);
    console.log(`   URL: ${result.data.url}`);
}

async function exampleBlogWithImage() {
    console.log('\n▶ Example 2: Blog with image');

    const client = new BlogAPIClient();

    const result = await client.createBlogWithImage(
        {
            title: 'Latest Industry News',
            excerpt: 'Breaking news in the tech industry',
            content: '<p>Today we announce...</p>',
            category: 'industry_news',
            author_name: 'News Team',
            tags: ['News', 'Industry'],
            featured: true,
            seo_title: 'Breaking: Latest Tech Industry News',
            seo_description: 'Stay updated with the latest tech news',
            seo_keywords: 'tech, news, industry, updates'
        },
        './preview-image.jpg' // Image will be uploaded to S3
    );

    console.log('✅ Featured blog with image created!');
    console.log(`   Slug: ${result.data.slug}`);
}

async function exampleBatchImport() {
    console.log('\n▶ Example 3: Batch import');

    const client = new BlogAPIClient();

    const blogs = [
        {
            title: 'Blog Post #1',
            excerpt: 'First imported blog',
            content: '<p>Content 1</p>',
            category: 'ai_ml',
            author_name: 'Import Bot',
            tags: ['Imported']
        },
        {
            title: 'Blog Post #2',
            excerpt: 'Second imported blog',
            content: '<p>Content 2</p>',
            category: 'automation',
            author_name: 'Import Bot',
            tags: ['Imported']
        }
        // Add more...
    ];

    const results = [];

    for (const blogData of blogs) {
        try {
            const result = await client.createBlog(blogData);
            results.push(result.data);
            console.log(`✅ Created: ${result.data.slug}`);
        } catch (error) {
            console.error(`❌ Failed to create '${blogData.title}': ${error.message}`);
        }
    }

    console.log(`\n📊 Successfully created ${results.length}/${blogs.length} blogs`);
}

// =============================================================================
// MAIN
// =============================================================================

async function main() {
    console.log('Binary Buddies Blog API - Node.js Client\n');

    // Check for API key
    if (!process.env.BLOG_API_KEY) {
        console.error('⚠️  BLOG_API_KEY environment variable not set!');
        console.error('Set it with: export BLOG_API_KEY="your-api-key-here"');
        process.exit(1);
    }

    try {
        // Run examples
        await exampleBasicBlog();

        // Uncomment to run other examples:
        // await exampleBlogWithImage();
        // await exampleBatchImport();

    } catch (error) {
        console.error(`\n❌ Error: ${error.message}`);
        process.exit(1);
    }
}

// Run if executed directly
if (require.main === module) {
    main();
}

module.exports = BlogAPIClient;
