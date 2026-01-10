# =============================================================================
# ODOO 18 DOCKERFILE WITH S3 SUPPORT
# Binary Buddies Web - Production Image
# =============================================================================

FROM odoo:18.0

# Switch to root to install packages
USER root

# -----------------------------------------------------------------------------
# Install System Dependencies
# -----------------------------------------------------------------------------
RUN apt-get update && apt-get install -y --no-install-recommends \
    # Required for some Python packages
    build-essential \
    python3-dev \
    # Cleanup
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# -----------------------------------------------------------------------------
# Install Python Dependencies for S3 Storage
# -----------------------------------------------------------------------------
# OCA fs_storage requirements:
# - fsspec[s3]: Filesystem abstraction with S3 support
# - boto3: AWS SDK for Python (required by fsspec S3)
# - python_slugify: For filename handling in fs_attachment
# 
# server_environment: No additional deps (uses configparser)
# base_sparse_field: No additional deps

RUN pip3 install --no-cache-dir --break-system-packages \
    # S3 Storage - Core Requirements
    "fsspec[s3]>=2025.3.0" \
    boto3 \
    # fs_attachment requirements
    python_slugify \
    packaging \
    # Optional: For better S3 performance
    aiobotocore \
    s3fs

# -----------------------------------------------------------------------------
# Create Log Directory
# -----------------------------------------------------------------------------
RUN mkdir -p /var/log/odoo \
    && chown -R odoo:odoo /var/log/odoo

# -----------------------------------------------------------------------------
# Copy Configuration
# -----------------------------------------------------------------------------
COPY ./config/odoo.conf /etc/odoo/odoo.conf
RUN chown odoo:odoo /etc/odoo/odoo.conf

# Switch back to odoo user
USER odoo

# -----------------------------------------------------------------------------
# Healthcheck
# -----------------------------------------------------------------------------
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8069/web/health || exit 1

# Default command uses the config file
CMD ["odoo", "-c", "/etc/odoo/odoo.conf"]
