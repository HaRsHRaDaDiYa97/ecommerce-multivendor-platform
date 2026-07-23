# 🐳 Complete Docker Setup & Run Guide

This project is fully containerized using **Docker** and **Docker Compose**. Anyone can clone this repository and run the full stack (Frontend, Backend, and PostgreSQL Database) on **Windows, macOS (Intel & Apple Silicon M1/M2/M3), or Linux** with a single command!

---

## 📋 Prerequisites

Make sure you have installed on your computer:
1. **Docker Desktop** (or Docker Engine + Docker Compose on Linux).
   - [Download Docker Desktop for Windows / Mac](https://www.docker.com/products/docker-desktop/)

---

## 🚀 How to Run the Project with Docker

### Step 1: Clone or Open Project Directory
Open your terminal or command prompt in the project root:
```bash
cd ecommerce-muti-vendor
```

### Step 2: Build & Start All Services
Run the following command:
```bash
docker compose up --build
```

> **What happens automatically when you run this command:**
> 1. Starts a PostgreSQL 16 database container on port `5432`.
> 2. Builds the Django REST Framework container, installs requirements, executes database migrations (`python manage.py migrate`), and starts server on port `8000`.
> 3. Builds the React (Vite) Frontend container, installs npm packages, and starts dev server on port `5173`.

---

## 🌐 Access Points

Once all services are running, open your browser:

| Component | URL | Description |
| :--- | :--- | :--- |
| **Frontend Store & Portals** | [http://localhost:5173](http://localhost:5173) | Buyer, Seller, & Admin Web App |
| **Backend REST API** | [http://localhost:8000/api/](http://localhost:8000/api/) | Django REST API endpoints |
| **Django Admin Panel** | [http://localhost:8000/admin/](http://localhost:8000/admin/) | Django Superadmin dashboard |

---

## ⚙️ Useful Docker Commands

### 1. Create Superuser inside Docker Container
To access Django admin portal (`http://localhost:8000/admin/`), run:
```bash
docker compose exec backend python manage.py createsuperuser
```

### 2. Run Commands in Background (Detached Mode)
```bash
docker compose up -d
```

### 3. Stop All Running Services
```bash
docker compose down
```

### 4. Stop Services & Wipe Database Volume (Fresh Start)
```bash
docker compose down -v
```

### 5. View Logs in Real-time
```bash
# View logs from all services
docker compose logs -f

# View logs from backend only
docker compose logs -f backend

# View logs from frontend only
docker compose logs -f frontend
```

---

## 🛠️ Architecture Overview

```
                          ┌──────────────────────────┐
                          │   Frontend (React Vite)   │
                          │   http://localhost:5173  │
                          └─────────────┬────────────┘
                                        │
                                        │ API Requests
                                        ▼
                          ┌──────────────────────────┐
                          │   Backend (Django DRF)   │
                          │   http://localhost:8000  │
                          └─────────────┬────────────┘
                                        │
                                        │ PostgreSQL Protocol
                                        ▼
                          ┌──────────────────────────┐
                          │   Database (PostgreSQL)  │
                          │   Port 5432 (Internal)   │
                          └──────────────────────────┘
```
