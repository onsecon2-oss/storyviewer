"""
Run this once to authenticate with Instagram and save session.
Usage: python setup_login.py
"""
from instagrapi import Client
from urllib.parse import unquote
import json
import sys

cl = Client()

print("=== Instagram Session Setup ===")
print("1. Open instagram.com in Chrome (while logged in)")
print("2. Press F12 -> Application tab -> Cookies -> https://www.instagram.com")
print("3. Find 'sessionid' and copy the Value")
print()

session_id = unquote(input("Paste your sessionid here: ").strip())

if not session_id:
    print("[ERROR] No session ID entered.")
    sys.exit(1)

print("\nSetting session...")

try:
    cl.set_settings({"cookies": {"sessionid": session_id}})
    cl.private.cookies.set("sessionid", session_id)

    # Try to get current user to verify session works
    user_id = cl.user_id_from_username("instagram")
    cl.dump_settings("session.json")
    print(f"\n[OK] Session is valid! session.json saved.")
    print("You can now start the server:")
    print("  venv\\Scripts\\uvicorn main:app --reload")

except Exception as e:
    print(f"[ERROR] Failed: {e}")
    sys.exit(1)
