from pocketbase import PocketBase
from pocketbase.client import FileUpload
from logging_output import error, debug
from config import export_video_base_path
from config import VIDEO_UPLOAD_URL, VIDEO_UPLOAD_USER, VIDEO_UPLOAD_PASSWORD

def upload_file(id: str):
    print("Connecting to PocketBase...")
    try:
        client = PocketBase(VIDEO_UPLOAD_URL)

        # authenticate as regular user
        user_data = client.collection("users").auth_with_password(VIDEO_UPLOAD_USER, VIDEO_UPLOAD_PASSWORD)
        # print(f"Authenticated as {user_data}")
        file = export_video_base_path + id + ".webm"

        # upload file
        debug("Uploading file...")
        result = client.collection("media").create({
            "file": FileUpload(("image.png", file)),
        })
        print(result)
        debug("File uploaded. Extend with columns.")
        url = client.get_file_url(result, id,{})
        print(f"File URL is {url}")
        db_entry = {
            "id": result.id,
            "version": 1,
            "type": "video",
            "langCode": "de",
            "name": result.id,
            "url": url,
            "hash": "",
            "filename": result.id,
            "originId": None,
            "documents": []
        }
        updated_medium = client.collection("media").update(result.id, {
            "content": db_entry
        })
        print(f"Updated medium: {updated_medium}")
        return updated_medium
    
    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    upload_file("11e3a4a0-348b-4c34-b7e4-614f3c734217")