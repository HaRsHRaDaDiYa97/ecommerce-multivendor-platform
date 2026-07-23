# 🚀 100% Free-Tier Deployment & CI/CD Guide

This guide explains step-by-step how to deploy your **Multi-Vendor E-Commerce Platform** completely **FREE OF COST** using:
- 🌐 **Vercel** (Free Tier for React Frontend)
- 🐍 **Render.com** (Free Tier for Django Backend)
- 🐘 **Neon.tech** (Free Tier managed PostgreSQL Database)
- 🔄 **GitHub Actions** (Free Automated CI/CD Pipeline)

---

## 📑 Deployment Architecture Overview

```
                      ┌─────────────────────────────────┐
                      │    Vercel (React Frontend)      │
                      │    https://your-app.vercel.app  │
                      └────────────────┬────────────────┘
                                       │
                                       │ HTTPS API Requests
                                       ▼
                      ┌─────────────────────────────────┐
                      │   Render (Django DRF Backend)   │
                      │   https://your-api.onrender.com │
                      └────────────────┬────────────────┘
                                       │
                                       │ SSL Postgres Protocol
                                       ▼
                      ┌─────────────────────────────────┐
                      │    Neon.tech (PostgreSQL DB)    │
                      │    0.5 GB Serverless DB (Free)  │
                      └─────────────────────────────────┘
```

---

## 📌 Phase 1: Set Up Free PostgreSQL Database (Neon.tech)

1. Go to [Neon.tech](https://neon.tech/) and sign up for a **Free Account**.
2. Click **Create Project**, name it `ecommerce-db`, and click **Create**.
3. Copy your database connection details from the Neon dashboard:
   - **Host**: `ep-xxxxxx.us-east-2.aws.neon.tech`
   - **Database**: `neondb`
   - **User**: `neondb_owner`
   - **Password**: `your_neon_password`
   - **Port**: `5432`

---

## 📌 Phase 2: Deploy Django Backend for Free (Render.com)

1. Sign up for a **Free Account** at [Render.com](https://render.com/).
2. Click **New +** ➔ **Web Service**.
3. Connect your **GitHub Repository** and select the `ecommerce-muti-vendor` project.
4. Fill in the following deployment settings:
   - **Name**: `ecommerce-backend-api`
   - **Region**: Select nearest region (e.g. Singapore / Frankfurt / Oregon)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt && python manage.py migrate`
   - **Start Command**: `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`
   - **Instance Type**: **Free**

5. Under **Environment Variables**, add the following keys:

| Environment Key | Value |
| :--- | :--- |
| `DB_HOST` | `ep-xxxxxx.us-east-2.aws.neon.tech` (From Neon) |
| `DB_PORT` | `5432` |
| `DB_NAME` | `neondb` |
| `DB_USER` | `neondb_owner` |
| `DB_PASSWORD` | `your_neon_password` |
| `SECRET_KEY` | `generate-a-random-secure-key` |
| `DEBUG` | `False` |
| `RAZORPAY_KEY_ID` | `rzp_test_RECMjyRF0o9vji` |
| `RAZORPAY_KEY_SECRET` | `jFDmkf1cc1mMBtdZwqUUPLDe` |

6. Click **Create Web Service**. Once deployed, copy your live backend URL (e.g. `https://ecommerce-backend-api.onrender.com`).

---

## 📌 Phase 3: Deploy React Frontend for Free (Vercel)

1. Sign up for a **Free Account** at [Vercel.com](https://vercel.com/).
2. Click **Add New...** ➔ **Project**.
3. Import your GitHub repository `ecommerce-muti-vendor`.
4. In the project setup screen:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click **Edit** and select `frontend`
5. Expand **Environment Variables** and add:

| Name | Value |
| :--- | :--- |
| `VITE_API_BASE_URL` | `https://ecommerce-backend-api.onrender.com/api/` |

6. Click **Deploy**. Vercel will build and launch your frontend live URL (e.g., `https://your-project.vercel.app`).

---

## 📌 Phase 4: Configure GitHub Actions CI/CD Pipeline

To enable **automated testing and deployment** whenever you push new code to GitHub:

### Step 1: Get Vercel Credentials
Open your terminal and run:
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Link project inside frontend directory
cd frontend
vercel link
```

This generates `.vercel/project.json` containing:
- `orgId` (Your `VERCEL_ORG_ID`)
- `projectId` (Your `VERCEL_PROJECT_ID`)

Get your `VERCEL_TOKEN` from Vercel Account Settings ➔ Tokens ➔ Create Token.

### Step 2: Add Secrets to GitHub Repository
Go to your GitHub Repository ➔ **Settings** ➔ **Secrets and variables** ➔ **Actions** ➔ Click **New repository secret**:

1. `VERCEL_TOKEN`: Paste your Vercel Access Token.
2. `VERCEL_ORG_ID`: Paste `orgId`.
3. `VERCEL_PROJECT_ID`: Paste `projectId`.

---

## 🔄 How the Automated CI/CD Workflow Works

Whenever you push to `main` branch, GitHub Actions automatically:
1. **Tests Backend**: Verifies Python syntax and runs `python manage.py check`.
2. **Builds Frontend**: Runs `npm run build` to verify React Vite production bundle.
3. **Deploys to Vercel**: Triggers an instant production deployment on Vercel.

🎉 **Your entire platform is now 100% live on free-tier cloud hosting with automated CI/CD!**
