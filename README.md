# SWE40006 - University Computer Lab Equipment Tracker

A full-stack, containerized web application for tracking and lending university computer lab hardware (laptops, desktops, monitors, peripherals, and lab kits). Built with **React**, **FastAPI**, and **PostgreSQL**, with automated container orchestration via **Docker Compose** and observability via **Prometheus & Grafana**.

---

## Architecture Overview

```
                                [ Web Browser ]
                                       │
                    ┌──────────────────┴──────────────────┐
                    │ (Port 80)                           │ (Port 8000)
                    ▼                                     ▼
      ┌───────────────────────────┐         ┌───────────────────────────┐
      │     swe40006-frontend     │         │     swe40006-backend      │
      │   (React SPA on Nginx)    │────────►│  (FastAPI Python 3.11)    │
      └───────────────────────────┘         └─────────────┬─────────────┘
                                                          │
                                                          ▼ (Port 5432 - internal)
                                            ┌───────────────────────────┐
                                            │       swe40006-db         │
                                            │   (PostgreSQL 16 Alpine)  │
                                            └───────────────────────────┘
```

### Container Status in Codebase

All containers are fully implemented and configured:

| Service | Container Name | Technology | Dockerfile / Image | Exposed Port |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend** | `swe40006-frontend` | React 18, Tailwind CSS, Nginx | [`frontend/Dockerfile`](frontend/Dockerfile) | `80:80` |
| **Backend** | `swe40006-backend` | FastAPI, SQLAlchemy, Pydantic | [`backend/Dockerfile`](backend/Dockerfile) | `8000:8000` |
| **Database** | `swe40006-db` | PostgreSQL 16 | `postgres:16-alpine` | `5432` *(internal)* |
| **Metrics** | `inventory-prometheus` | Prometheus v3.5.0 | `prom/prometheus:v3.5.0` | `9090:9090` |
| **Dashboards** | `inventory-grafana` | Grafana v12.1.0 | `grafana/grafana:12.1.0` | `3000:3000` |

---

## Quick Start with Docker (Recommended)

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### 1. Run the Complete Stack
From the project root directory, run:

```bash
docker compose up -d --build
```

This single command will:
1. Initialize the PostgreSQL container and run database health checks.
2. Build and launch the FastAPI backend (automatically creating database tables and seeding initial lab equipment data).
3. Build the React frontend into static assets and serve them via Nginx.

### 2. Access the Application

Once the containers are up:

| Service | URL | Notes |
| :--- | :--- | :--- |
| **React Web App** | [http://localhost](http://localhost) | Main inventory dashboard & CRUD manager |
| **FastAPI Swagger Docs** | [http://localhost:8000/docs](http://localhost:8000/docs) | Interactive API documentation |
| **Backend Health Check** | [http://localhost:8000/health](http://localhost:8000/health) | Verifies live database connectivity |
| **Prometheus Metrics** | [http://localhost:8000/metrics](http://localhost:8000/metrics) | Scraped telemetry data |

### 3. Stop the Containers

```bash
# Stop all running containers
docker compose down

# Stop and remove volumes (resets database data)
docker compose down -v
```

---

## Local Development (Without Docker)

If you wish to develop and test individual services locally without running Docker:

### 1. Backend Setup (FastAPI)

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS / Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run backend development server (defaults to SQLite if Postgres is unavailable)
uvicorn app.main:app --reload --port 8000
```

Backend will be available at [http://localhost:8000](http://localhost:8000) (Interactive Swagger UI at [http://localhost:8000/docs](http://localhost:8000/docs)).

### 2. Frontend Setup (React + Vite)

```bash
cd frontend

# Install Node dependencies
npm install

# Start Vite dev server
npm run dev
```

Frontend will run at [http://localhost:5173](http://localhost:5173) (or `http://localhost:3000`).

---

## Running Automated Tests

### Backend Unit & Integration Tests (Pytest)

The backend includes full test coverage for CRUD operations, database constraints, and health checks.

```bash
# Inside the backend directory (or within virtualenv)
cd backend
pytest -v

# Or run tests with test coverage:
pytest --cov=app tests/
```

### Frontend Build Test

Verify that the React production bundle compiles without errors:

```bash
cd frontend
npm run build
```

---

## Observability & Monitoring (Prometheus + Grafana)

The project includes an optional standalone telemetry stack in the `monitoring/` directory.

### 1. Launch the Monitoring Stack

```bash
# Start Prometheus, Grafana, and Node Exporter
docker compose -f monitoring/docker-compose.yml up -d
```

### 2. Access Dashboards

- **Prometheus UI**: [http://localhost:9090](http://localhost:9090)
- **Grafana Dashboards**: [http://localhost:3000](http://localhost:3000)
  - Default User: `admin`
  - Default Password: Configured via `GRAFANA_ADMIN_PASSWORD` in your `.env` (or default `admin`)
  - Dashboards and Prometheus data sources are automatically provisioned.

---

## Useful Docker Commands

```bash
# View real-time container logs
docker compose logs -f

# View logs for a specific service (e.g. backend)
docker compose logs -f backend

# Rebuild a single service after making code changes
docker compose up -d --build backend
docker compose up -d --build frontend

# Check status of running containers
docker compose ps

# Access database CLI directly inside container
docker exec -it swe40006-db psql -U postgres -d swe40006_db
```

---

## Project Directory Structure

```text
SWE40006-Project/
├── .github/workflows/          # CI/CD deployment pipelines
├── backend/                    # FastAPI application
│   ├── app/
│   │   ├── api/v1/items.py     # CRUD endpoints (/api/v1/items)
│   │   ├── database.py         # SQLAlchemy engine & session maker
│   │   ├── main.py             # FastAPI entrypoint, CORS, /health, /metrics
│   │   ├── models/item.py      # PostgreSQL ORM schema
│   │   ├── schemas/item.py     # Pydantic request/response validation
│   │   └── seed.py             # Automatic initial lab equipment seed data
│   ├── tests/test_api.py       # Pytest automated test suite
│   ├── Dockerfile              # Python 3.11 slim container build
│   └── requirements.txt
├── frontend/                   # React Single-Page Application
│   ├── src/
│   │   ├── components/         # Reusable UI widgets & layouts
│   │   ├── pages/              # DashboardPage & InventoryPage
│   │   └── services/api.js     # Centralized API service with mock fallback
│   ├── Dockerfile              # Multi-stage build (Node -> Nginx)
│   ├── nginx.conf              # SPA routing & caching configuration
│   └── package.json
├── monitoring/                 # Prometheus & Grafana configuration
│   ├── grafana/                # Provisioning & JSON dashboards
│   ├── prometheus/             # Prometheus scrape configs & alert rules
│   └── docker-compose.yml      # Standalone telemetry stack
├── scripts/
│   └── ec2-user-data.sh        # AWS EC2 cloud-init provisioning script
├── docker-compose.yml          # Top-level Docker Compose (Full Stack)
└── README.md
```
