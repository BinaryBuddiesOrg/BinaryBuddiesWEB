# Docker Setup for Binary Buddies Web

This document provides instructions for running the Binary Buddies Web application using Docker.

## 🚀 Quick Start

### Production Deployment

```bash
# Build and start the application
docker-compose up -d

# Or use the Makefile
make up
```

The application will be available at: http://localhost:3000

### Development Environment

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# Or use the Makefile
make dev
```

The development server will be available at: http://localhost:5173

## 📋 Available Commands

### Using Docker Compose

```bash
# Production
docker-compose up -d          # Start production
docker-compose down           # Stop production
docker-compose restart        # Restart production
docker-compose logs -f        # View logs

# Development
docker-compose -f docker-compose.dev.yml up -d    # Start development
docker-compose -f docker-compose.dev.yml down     # Stop development
docker-compose -f docker-compose.dev.yml logs -f  # View dev logs
```

### Using Makefile (Recommended)

```bash
make build     # Build production image
make up        # Start production
make down      # Stop containers
make restart   # Restart containers
make logs      # View logs
make dev       # Start development
make clean     # Clean up Docker resources
make health    # Check service health
```

## 🏗️ Build Optimization Features

### Multi-Stage Build
- **Builder Stage**: Optimized for building the React application
- **Production Stage**: Minimal nginx-based serving with security optimizations

### Performance Optimizations
- **Layer Caching**: Package files copied first for better Docker layer caching
- **Alpine Linux**: Lightweight base images for smaller final image size
- **Nginx**: High-performance web server for serving static files
- **Gzip Compression**: Enabled for all text-based assets
- **Static Asset Caching**: 1-year cache for static assets

### Security Features
- **Non-root User**: Application runs as non-root user
- **Security Headers**: Comprehensive security headers added
- **Minimal Attack Surface**: Only necessary packages installed
- **Health Checks**: Built-in health monitoring

## 📁 File Structure

```
binary-buddies-spark/
├── Dockerfile              # Production Docker image
├── Dockerfile.dev          # Development Docker image
├── docker-compose.yml      # Production compose file
├── docker-compose.dev.yml  # Development compose file
├── nginx.conf              # Nginx configuration
├── .dockerignore           # Docker ignore file
├── Makefile                # Convenient commands
└── DOCKER_README.md        # This file
```

## 🔧 Configuration

### Environment Variables

The application supports the following environment variables:

```bash
NODE_ENV=production    # Environment mode
```

### Port Configuration

- **Production**: Port 3000
- **Development**: Port 5173

### Nginx Configuration

The nginx configuration includes:
- Gzip compression
- Static asset caching
- Security headers
- Client-side routing support
- Health check endpoint

## 🐳 Docker Images

### Production Image
- **Base**: nginx:alpine
- **Size**: ~50MB (optimized)
- **Features**: Multi-stage build, security hardened

### Development Image
- **Base**: node:18-alpine
- **Features**: Hot reload, volume mounting

## 📊 Monitoring

### Health Checks
- **Endpoint**: http://localhost:3000/health
- **Interval**: 30 seconds
- **Timeout**: 10 seconds
- **Retries**: 3

### Logs
```bash
# View real-time logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f binary-buddies-web
```

## 🧹 Cleanup

### Remove Everything
```bash
make clean
```

### Manual Cleanup
```bash
# Stop and remove containers
docker-compose down -v

# Remove images
docker rmi binary-buddies-spark_binary-buddies-web

# Clean up system
docker system prune -f
```

## 🚨 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   lsof -i :3000
   
   # Kill the process or change port in docker-compose.yml
   ```

2. **Build Failures**
   ```bash
   # Clean build
   make clean
   make build
   ```

3. **Permission Issues**
   ```bash
   # Fix permissions
   sudo chown -R $USER:$USER .
   ```

### Debug Mode
```bash
# Run with debug output
docker-compose up --build

# Check container status
docker-compose ps

# Inspect container
docker-compose exec binary-buddies-web sh
```

## 📈 Performance Tips

1. **Use .dockerignore**: Excludes unnecessary files from build context
2. **Layer Caching**: Package files are copied first for better caching
3. **Multi-stage Build**: Reduces final image size
4. **Alpine Images**: Lightweight base images
5. **Nginx Optimization**: Configured for high performance

## 🔒 Security Best Practices

1. **Non-root User**: Application runs as non-root
2. **Minimal Base Image**: Only necessary packages installed
3. **Security Headers**: Comprehensive security headers
4. **Regular Updates**: Keep base images updated
5. **Health Monitoring**: Built-in health checks

## 📝 Notes

- The production build uses nginx to serve static files
- Development environment supports hot reload
- All static assets are cached for 1 year
- Gzip compression is enabled for all text assets
- Health check endpoint is available at `/health`
