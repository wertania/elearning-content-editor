import httpx
from fastapi import HTTPException, Request
from config import dataprovider_url
from pocketbase import PocketBase

async def verify_pocketbase_token(token: str) -> bool:
    # print("verify_pocketbase_token")
    # print(token)
    url = f"{dataprovider_url}/api/collections/users/auth-refresh"  # Assuming this is the correct endpoint.
    headers = {
        "Authorization": f"{token}"
    }   
    async with httpx.AsyncClient() as client:
        response = await client.post(url, headers=headers)        
        if response.status_code == 200:
            return True
        else:
            return False

async def get_current_user(request: Request):
    # print("get_current_user")
    token = request.headers.get("Authorization")
    if not token:
        raise HTTPException(status_code=401, detail="Token is missing")
    is_valid = await verify_pocketbase_token(token)
    if not is_valid:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return token  # or return user data if needed
