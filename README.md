# Inventory Tracker Web Application

Full-stack inventory management web application built with FastAPI, React, and PostgreSQL, deployed using automated CI/CD pipelines, Docker Compose, and Prometheus/Grafana monitoring.

## System Architecture

- **Frontend**: React SPA (`frontend/`)
- **Backend**: FastAPI REST API (`backend/`)
- **Database**: PostgreSQL (relational storage for items, categories, and audit logs)
- **Containerization**: Docker & Docker Compose (`docker-compose.yml`)
- **CI/CD**: GitHub Actions workflows (`.github/workflows/`)
- **Observability**: Prometheus & Grafana (`monitoring/`)
