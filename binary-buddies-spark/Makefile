# Makefile for Binary Buddies Web Docker Commands

.PHONY: help build up down restart logs clean dev prod

# Default target
help:
	@echo "Available commands:"
	@echo "  make build     - Build the production Docker image"
	@echo "  make up        - Start the production container"
	@echo "  make down      - Stop and remove containers"
	@echo "  make restart   - Restart the production container"
	@echo "  make logs      - Show container logs"
	@echo "  make clean     - Clean up Docker resources"
	@echo "  make dev       - Start development environment"
	@echo "  make prod      - Start production environment"

# Production commands
build:
	docker-compose build --no-cache

up:
	docker-compose up -d

down:
	docker-compose down

restart:
	docker-compose restart

logs:
	docker-compose logs -f

# Development commands
dev:
	docker-compose -f docker-compose.dev.yml up -d

dev-down:
	docker-compose -f docker-compose.dev.yml down

dev-logs:
	docker-compose -f docker-compose.dev.yml logs -f

# Cleanup commands
clean:
	docker-compose down -v
	docker system prune -f
	docker image prune -f

# Production environment
prod: build up

# Quick start
start: up
	@echo "Application is running at http://localhost:3000"

# Health check
health:
	@curl -f http://localhost:3000/health || echo "Service is not healthy"
