from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from dotenv import load_dotenv
import os
import httpx

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET"],
    allow_headers=["*"],
)

APIFY_TOKEN = os.getenv("APIFY_TOKEN", "")
ACTOR_ID = "shu8hvrXbJbY3Eb9W"
APIFY_BASE = "https://api.apify.com/v2"

SESSION_ID = os.getenv("INSTAGRAM_SESSION_ID", "")
CSRF_TOKEN = os.getenv("INSTAGRAM_CSRF_TOKEN", "")
DS_USER_ID = os.getenv("INSTAGRAM_DS_USER_ID", "")
MID = os.getenv("INSTAGRAM_MID", "")


async def run_actor(input_data: dict) -> list:
    """Run Apify Instagram scraper and return results."""
    async with httpx.AsyncClient(timeout=120) as client:
        # Start actor run
        r = await client.post(
            f"{APIFY_BASE}/acts/{ACTOR_ID}/run-sync-get-dataset-items",
            params={"token": APIFY_TOKEN},
            json=input_data,
        )
        if not r.is_success:
            raise HTTPException(status_code=500, detail=f"Apify error: {r.status_code} {r.text[:200]}")
        return r.json()


@app.get("/api/profile/{username}")
async def get_profile(username: str):
    try:
        items = await run_actor({
            "directUrls": [f"https://www.instagram.com/{username}/"],
            "resultsType": "details",
            "resultsLimit": 1,
        })
        if not items:
            raise HTTPException(status_code=404, detail="User not found")
        u = items[0]
        return {
            "username": u.get("username", username),
            "full_name": u.get("fullName", ""),
            "biography": u.get("biography", ""),
            "profile_pic_url": u.get("profilePicUrl", ""),
            "follower_count": u.get("followersCount", 0),
            "following_count": u.get("followsCount", 0),
            "media_count": u.get("postsCount", 0),
            "is_private": u.get("private", False),
            "is_verified": u.get("verified", False),
            "external_url": u.get("externalUrl"),
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/stories/{username}")
async def get_stories(username: str):
    try:
        items = await run_actor({
            "directUrls": [f"https://www.instagram.com/stories/{username}/"],
            "resultsType": "stories",
            "resultsLimit": 100,
        })
        result = []
        for s in items:
            media_type = 2 if s.get("type") == "Video" else 1
            result.append({
                "id": s.get("id", ""),
                "media_type": media_type,
                "url": s.get("displayUrl", ""),
                "video_url": s.get("videoUrl"),
                "taken_at": s.get("timestamp"),
            })
        result.sort(key=lambda x: x.get("taken_at") or "", reverse=True)
        return {"stories": result, "count": len(result)}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/posts/{username}")
async def get_posts(username: str, limit: int = 12):
    try:
        items = await run_actor({
            "directUrls": [f"https://www.instagram.com/{username}/"],
            "resultsType": "posts",
            "resultsLimit": limit,
        })
        result = []
        for p in items:
            media_type = 2 if p.get("type") == "Video" else 1
            result.append({
                "id": p.get("id", ""),
                "media_type": media_type,
                "thumbnail_url": p.get("displayUrl"),
                "video_url": p.get("videoUrl"),
                "caption": (p.get("caption") or "")[:200],
                "like_count": p.get("likesCount", 0),
                "comment_count": p.get("commentsCount", 0),
                "taken_at": p.get("timestamp"),
            })
        result.sort(key=lambda x: x.get("taken_at") or "", reverse=True)
        return {"posts": result, "count": len(result)}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


async def get_user_id_from_apify(username: str) -> str:
    """Get Instagram user ID via Apify."""
    items = await run_actor({
        "directUrls": [f"https://www.instagram.com/{username}/"],
        "resultsType": "details",
        "resultsLimit": 1,
    })
    if not items:
        raise HTTPException(status_code=404, detail="User not found")
    user_id = items[0].get("id") or items[0].get("userId")
    if not user_id:
        raise HTTPException(status_code=500, detail="Could not get user ID")
    return str(user_id)


@app.get("/api/highlights/{username}")
async def get_highlights(username: str):
    try:
        items = await run_actor({
            "directUrls": [f"https://www.instagram.com/{username}/"],
            "resultsType": "stories",
            "resultsLimit": 500,
        })
        result = []
        for h in items:
            media_type = 2 if h.get("type") == "Video" else 1
            result.append({
                "id": h.get("id", ""),
                "media_type": media_type,
                "url": h.get("displayUrl", ""),
                "video_url": h.get("videoUrl"),
                "taken_at": h.get("timestamp"),
            })
        result.sort(key=lambda x: x.get("taken_at") or "", reverse=True)
        return {"highlights": result, "count": len(result)}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/proxy")
async def proxy_image(url: str):
    try:
        async with httpx.AsyncClient(timeout=15, follow_redirects=True) as client:
            r = await client.get(url, headers={
                "User-Agent": "Mozilla/5.0",
                "Referer": "https://www.instagram.com/",
            })
        return Response(content=r.content, media_type=r.headers.get("content-type", "image/jpeg"))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
def health():
    return {"status": "ok"}
