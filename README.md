# Insta Story Viewer

Anonymous Instagram stories, posts, and highlights viewer.

## Stack
- **Frontend**: Next.js 14 + Tailwind CSS → Vercel
- **Backend**: Python FastAPI + instagrapi → Railway

## Local Development

### 1. Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn main:app --reload
```
Backend runs at http://localhost:8000

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at http://localhost:3000

## Deploy

### Backend (Railway)
1. Push to GitHub
2. New project on Railway → connect repo → select `/backend`
3. Add env vars: `INSTAGRAM_USERNAME`, `INSTAGRAM_PASSWORD`

### Frontend (Vercel)
1. New project on Vercel → connect repo → select `/frontend`
2. Add env var: `NEXT_PUBLIC_API_URL=https://your-backend.railway.app`
