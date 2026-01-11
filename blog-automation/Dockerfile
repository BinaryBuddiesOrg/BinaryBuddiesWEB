FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies (minimal)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY app/ ./app/

# Create data and logs directories
RUN mkdir -p data logs

# Create non-root user for security
RUN useradd -m -u 1000 blogbot && \
    chown -R blogbot:blogbot /app
USER blogbot

# Expose API port
EXPOSE 8000

# Health check via API
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s \
    CMD curl -f http://localhost:8000/health || exit 1

# Run the API server (includes scheduler)
CMD ["python3", "-m", "uvicorn", "app.server:app", "--host", "0.0.0.0", "--port", "8000"]
