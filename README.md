# SWE40006 - University Computer Lab Equipment Tracker

Full-stack lab inventory and device lending web application built with FastAPI, React, and PostgreSQL, deployed using automated CI/CD pipelines, Docker Compose, and Prometheus/Grafana monitoring.

## System Architecture

- **Frontend**: React Single Page Application (`frontend/`) with Tailwind CSS and Lucide React
- **Backend**: FastAPI REST API (`backend/`)
- **Database**: PostgreSQL (relational storage for lab hardware, categories, and loan records)
- **Containerization**: Docker & Docker Compose (`docker-compose.yml`)
- **CI/CD**: GitHub Actions workflows (`.github/workflows/`)
- **Observability**: Prometheus & Grafana (`monitoring/`)
