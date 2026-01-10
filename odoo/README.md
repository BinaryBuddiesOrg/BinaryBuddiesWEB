# Odoo 18 with S3 + CloudFront Storage

This setup integrates Odoo 18 with AWS S3 for attachment storage and CloudFront for CDN delivery.

## Table of Contents
- [Quick Start](#quick-start)
- [Required OCA Modules](#required-oca-modules)
- [AWS Setup Guide](#aws-setup-guide)
- [Odoo S3 Configuration](#odoo-s3-configuration)
- [File Storage Behavior](#file-storage-behavior)
- [Docker Commands](#docker-commands)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

```bash
# 1. Clone OCA dependencies (if not done)
cd custom
git clone https://github.com/OCA/storage.git --branch 18.0 --depth 1
git clone https://github.com/OCA/server-tools.git --branch 18.0 --depth 1
git clone https://github.com/OCA/server-env.git --branch 18.0 --depth 1

# 2. Create .env file
cp .env.example .env
# Edit .env with your AWS credentials

# 3. Build and start
docker-compose build
docker-compose up -d
```

---

## Required OCA Modules

Install these modules in Odoo UI (**Settings → Apps**) in **this exact order**:

| # | Module Name | Purpose | Dependencies |
|---|-------------|---------|--------------|
| 1 | `base_sparse_field` | Technical module for sparse fields | None |
| 2 | `server_environment` | Environment-based configuration | base_sparse_field |
| 3 | `fs_storage` | Filesystem storage abstraction layer | server_environment |
| 4 | `fs_attachment` | Store attachments in external storage | fs_storage |
| 5 | `fs_attachment_s3` | S3-specific features (signed URLs) | fs_attachment |

### How to Install Modules:
1. Go to **Settings** → **Activate Developer Mode** (bottom of page)
2. Go to **Apps** → Click **Update Apps List**
3. Search for each module name and click **Install**

---

## AWS Setup Guide

### Step 1: Create S3 Bucket

1. Go to [AWS S3 Console](https://s3.console.aws.amazon.com/)
2. Click **Create bucket**
3. Settings:
   - **Bucket name**: `your-project-attachments` (e.g., `binarybuddies-attachments`)
   - **Region**: Choose closest to users (e.g., `ap-south-1`)
   - **Block all public access**: ✅ Keep enabled (CloudFront will access via OAC)
4. Click **Create bucket**

### Step 2: Create IAM User

1. Go to [AWS IAM Console](https://console.aws.amazon.com/iam/)
2. Click **Users** → **Create user**
3. Settings:
   - **User name**: `your-project-odoo-s3-user`
   - Check **Provide user access to the AWS Management Console** → **No**
4. Click **Next** → Choose **Attach policies directly**
5. Click **Create policy** → **JSON** tab → Paste:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::YOUR-BUCKET-NAME",
                "arn:aws:s3:::YOUR-BUCKET-NAME/*"
            ]
        }
    ]
}
```

6. Save policy, attach to user, and create user
7. Go to user → **Security credentials** → **Create access key**
8. Choose **Application running outside AWS** → Copy Access Key and Secret

### Step 3: Create CloudFront Distribution

1. Go to [AWS CloudFront Console](https://console.aws.amazon.com/cloudfront/)
2. Click **Create distribution**
3. Settings:
   - **Origin domain**: Select your S3 bucket
   - **Origin access**: ✅ **Origin access control settings (recommended)**
   - Click **Create new OAC** → Use default settings → Create
   - **Viewer protocol policy**: **Redirect HTTP to HTTPS**
   - **Cache policy**: **CachingOptimized**
4. Click **Create distribution**
5. **Important**: Copy the bucket policy it shows and apply to your S3 bucket!

### Step 4: Apply S3 Bucket Policy

1. Go to your S3 bucket → **Permissions** → **Bucket policy**
2. Paste the policy from CloudFront (or use this template):

```json
{
    "Version": "2008-10-17",
    "Statement": [{
        "Sid": "AllowCloudFrontServicePrincipal",
        "Effect": "Allow",
        "Principal": {"Service": "cloudfront.amazonaws.com"},
        "Action": "s3:GetObject",
        "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*",
        "Condition": {
            "StringEquals": {
                "AWS:SourceArn": "arn:aws:cloudfront::YOUR-ACCOUNT-ID:distribution/YOUR-DISTRIBUTION-ID"
            }
        }
    }]
}
```

---

## Odoo S3 Configuration

### Step 1: Create .env File

Create `/odoo/.env` with your credentials:

```env
# Database
ODOO_DB_PASSWORD=odoo_password

# AWS S3 Credentials
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxx

# S3 Bucket Details
AWS_S3_BUCKET=binarybuddies-attachments
AWS_S3_REGION=ap-south-1

# CloudFront Domain (without https://)
CLOUDFRONT_DOMAIN=d28amk8ucon4hu.cloudfront.net
```

### Step 2: Configure FS Storage in Odoo UI

After installing all modules, create the S3 storage record:

1. Go to **Settings** → **Technical** → **FS Storage**
2. Click **Create**
3. Fill in the following fields:

| Field | Value | Description |
|-------|-------|-------------|
| **Name** | `S3 Attachments` | Display name |
| **Code** | `s3_attachments` | Internal identifier |
| **Protocol** | `s3a (S3FileSystem)` | Select from dropdown |
| **Directory Path** | `binarybuddies-attachments` | Your S3 bucket name |
| **Is Cacheable** | ✅ Checked | Enable caching |
| **Use As Default For Attachments** | ✅ Checked | **IMPORTANT!** |
| **Autovacuum Garbage Collection** | ✅ Checked | Clean up orphaned files |
| **Check Connection Method** | `Create Marker file` | For testing |

4. In the **Options** field (JSON), enter:

```json
{
    "key": "YOUR_AWS_ACCESS_KEY_ID",
    "secret": "YOUR_AWS_SECRET_ACCESS_KEY",
    "client_kwargs": {
        "region_name": "ap-south-1"
    }
}
```

5. Click **Save**
6. Click **Test Connection** → Should show green success message

### Step 3: Configure Storage Thresholds (Optional)

The **Force Db For Default Attachment Rules** field controls which files go to database vs S3:

```json
{
    "image/": 51200,
    "application/javascript": 0,
    "text/css": 0
}
```

| Rule | Meaning |
|------|---------|
| `"image/": 51200` | Images < 50KB stored in database |
| `"application/javascript": 0` | All JS files stored in database |
| `"text/css": 0` | All CSS files stored in database |

**To send ALL images to S3**: Set `"image/": 0` or remove the rule entirely.

---

## File Storage Behavior

After configuration, files are stored as follows:

| File Type | Size | Storage Location |
|-----------|------|------------------|
| Images | < 50KB | Database |
| Images | ≥ 50KB | **S3 Bucket** ✅ |
| JavaScript | Any | Database |
| CSS | Any | Database |
| Other files | Any | **S3 Bucket** ✅ |

### Verify S3 Storage is Working

1. Upload a **large image** (> 50KB) to any Odoo record
2. Check S3 bucket - you should see the file
3. Check database:
```sql
SELECT id, name, fs_storage_id, store_fname 
FROM ir_attachment 
WHERE fs_storage_id IS NOT NULL;
```
Files in S3 will show `store_fname` like: `s3_attachments://image_XXX.png`

---

## Configuration Files

| File | Purpose |
|------|---------|
| `config/odoo.conf` | Odoo server configuration + addons path |
| `Dockerfile` | Custom image with S3 Python dependencies |
| `docker-compose.yml` | Container orchestration |
| `.env` | AWS credentials (**DO NOT commit!**) |
| `.env.example` | Template for .env file |

### Python Dependencies (in Dockerfile)

These are automatically installed when building Docker image:

| Package | Purpose |
|---------|---------|
| `fsspec[s3]>=2025.3.0` | Filesystem abstraction with S3 support |
| `boto3` | AWS SDK for Python |
| `python_slugify` | Filename handling |
| `packaging` | Version parsing |
| `aiobotocore` | Async S3 support |
| `s3fs` | S3 filesystem interface |

---

## Docker Commands

```bash
# Build image
docker-compose build

# Start containers
docker-compose up -d

# View logs
docker-compose logs -f odoo

# Restart Odoo
docker-compose restart odoo

# Stop all
docker-compose down

# Rebuild from scratch
docker-compose down && docker-compose build --no-cache && docker-compose up -d

# Check S3 bucket contents (from inside container)
docker exec bbweb-odoo python3 -c "
import boto3
s3 = boto3.client('s3', region_name='ap-south-1')
response = s3.list_objects_v2(Bucket='binarybuddies-attachments')
for obj in response.get('Contents', []):
    print(f'{obj[\"Key\"]} ({obj[\"Size\"]} bytes)')
"
```

---

## Access Odoo

| Resource | URL |
|----------|-----|
| Web Interface | http://localhost:8069/web |
| Default Login | admin / admin |
| FS Storage Settings | http://localhost:8069/odoo/action-390 |

---

## Troubleshooting

### White page / CSS not loading
- Clear browser cache (Ctrl+Shift+R)
- Check `addons_path` in odoo.conf points to parent directories:
  ```
  addons_path = /mnt/extra-addons,/mnt/extra-addons/storage,/mnt/extra-addons/server-tools,...
  ```

### Module installation fails
- Check Docker logs: `docker-compose logs odoo`
- Verify Python dependencies: `docker exec bbweb-odoo pip list | grep fsspec`

### S3 connection issues
1. Verify AWS credentials in `.env` are correct
2. Check IAM user has S3 permissions
3. Verify bucket name and region match
4. Test connection in Odoo UI: **FS Storage** → **Test Connection**

### Files not going to S3
1. Check **Use As Default For Attachments** is ✅ checked
2. Verify file size exceeds threshold (default: images < 50KB go to DB)
3. Check `fs_storage_id` in database:
   ```sql
   SELECT name, fs_storage_id FROM ir_attachment ORDER BY id DESC LIMIT 10;
   ```

### Migrate existing attachments to S3
Run in Odoo shell:
```python
env['ir.attachment'].force_storage()
```

---

## CloudFront URL Generation

The `blog_post.py` model automatically generates CloudFront URLs for images:

```python
# In models/blog_post.py - _get_image_url method
cloudfront_domain = os.environ.get('CLOUDFRONT_DOMAIN', '')
if cloudfront_domain:
    return f"https://{cloudfront_domain}/{attachment.store_fname.split('://')[-1]}"
```

This means blog images served via API will use CloudFront URLs like:
```
https://d28amk8ucon4hu.cloudfront.net/image_1024-783-0.png
```

---

## Migrating Old Attachments to S3

When you first set up S3 storage, **existing files remain in their original location** (local filestore or database). Only **new uploads** go to S3 automatically.

### Understanding Storage Locations

| Storage Type | Path Format | Description |
|--------------|-------------|-------------|
| **S3** | `s3_attachments_manual://filename.png` | New files after S3 setup |
| **Local Filestore** | `d9/d919b0af...` (hex path) | Old files in Docker volume |
| **Database** | Empty `store_fname` | Small files < 50KB |

### Check Current Storage Status

```bash
# See where files are stored
docker exec bbweb-postgres-odoo psql -U odoo -d bbweb_odoo -c "
SELECT 
    CASE 
        WHEN fs_storage_id IS NOT NULL THEN 'S3'
        WHEN store_fname IS NOT NULL AND store_fname != '' THEN 'Local Filestore'
        ELSE 'Database'
    END as storage,
    COUNT(*) as count,
    pg_size_pretty(SUM(file_size)) as total_size
FROM ir_attachment 
WHERE file_size > 0
GROUP BY 1
ORDER BY 2 DESC;"
```

### Migration Command

To migrate ALL existing attachments from local filestore to S3:

#### Step 1: Open Odoo Shell
```bash
docker exec -it bbweb-odoo odoo shell -c /etc/odoo/odoo.conf -d bbweb_odoo
```

#### Step 2: Run Migration
```python
# This will move all attachments to the default storage (S3)
env['ir.attachment'].force_storage()

# Commit the changes
env.cr.commit()

# Exit shell
exit()
```

#### Step 3: Verify Migration
```bash
# Check S3 bucket for new files
docker exec bbweb-odoo python3 -c "
import boto3
s3 = boto3.client('s3', region_name='ap-south-1')
response = s3.list_objects_v2(Bucket='binarybuddies-attachments')
print(f'Total files in S3: {response.get(\"KeyCount\", 0)}')"
```

### What Happens During Migration

1. **Files > 50KB** (images, documents) → Copied to S3 bucket
2. **Files < 50KB** (small images) → Kept in database (faster access)
3. **JS/CSS files** → Kept in database (per configuration)
4. **Database updated** → `fs_storage_id` and `store_fname` fields updated
5. **Old files** → Remain in local filestore (can be cleaned later)

### Important Notes

> ⚠️ **Before Migration:**
> - Backup your database: `docker exec bbweb-postgres-odoo pg_dump -U odoo bbweb_odoo > backup.sql`
> - Ensure S3 connection is working (Test Connection in Odoo UI)
> - Migration may take time for large databases

> ⚠️ **After Migration:**
> - Old files in `/var/lib/odoo/filestore/` can be deleted after verification
> - CloudFront will serve the migrated files automatically

---

## Current Production Values

| Setting | Value |
|---------|-------|
| S3 Bucket | `binarybuddies-attachments` |
| AWS Region | `ap-south-1` |
| CloudFront Domain | `d28amk8ucon4hu.cloudfront.net` |
| IAM User | `binarybuddies-odoo-s3-user` |
| FS Storage Code | `s3_attachments_manual` |
