import os

from dotenv import load_dotenv

load_dotenv()

# Environment Variables
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
LOG_LEVEL = os.getenv("LOG_LEVEL")
VIDEO_UPLOAD_USER = os.getenv("VIDEO_UPLOAD_USER") or ""
VIDEO_UPLOAD_PASSWORD = os.getenv("VIDEO_UPLOAD_PASSWORD") or ""
VIDEO_UPLOAD_URL = os.getenv("VIDEO_UPLOAD_URL") or ""
OPTIMIZE_TRANSCRIPT = os.getenv("OPTIMIZE_TRANSCRIPT", "true").lower() != "false"

# Google service user file
GOOGLE_BLOB_BUCKET = os.getenv("GOOGLE_BLOB_BUCKET")
GOOGLE_PROJECT_ID = os.getenv("GOOGLE_PROJECT_ID")
GOOGLE_PRIV_KEY_ID = os.getenv("GOOGLE_PRIV_KEY_ID")
GOOGLE_PRIV_KEY = os.getenv("GOOGLE_PRIV_KEY") or ""
GOOGLE_CLIENT_EMAIL = os.getenv("GOOGLE_CLIENT_EMAIL")
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_X509_CERT_URL = os.getenv("GOOGLE_CLIENT_X509_CERT_URL")

# build a google cred
google_creds = {
    "type": "service_account",
    "project_id": GOOGLE_PROJECT_ID,
    "private_key_id": GOOGLE_PRIV_KEY_ID,
    "private_key": GOOGLE_PRIV_KEY.replace("\\n", "\n"),
    "client_email": GOOGLE_CLIENT_EMAIL,
    "client_id": GOOGLE_CLIENT_ID,
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": GOOGLE_CLIENT_X509_CERT_URL,
    "universe_domain": "googleapis.com",
}

if LOG_LEVEL is None:
    LOG_LEVEL = "ERROR"

TTS_BACKEND = os.getenv("TTS_BACKEND")
STT_BACKEND = os.getenv("STT_BACKEND")

if not TTS_BACKEND:
    raise Exception("Please set the environment variable TTS_BACKEND")
if (TTS_BACKEND == "google" or STT_BACKEND == "google") and (
    not GOOGLE_BLOB_BUCKET
    or not GOOGLE_PROJECT_ID
    or not GOOGLE_PRIV_KEY_ID
    or not GOOGLE_PRIV_KEY
    or not GOOGLE_CLIENT_EMAIL
    or not GOOGLE_CLIENT_ID
    or not GOOGLE_CLIENT_X509_CERT_URL
):
    raise Exception("Please set the environment variables for GOOGLE")
elif (
    TTS_BACKEND == "elevenlabs" or STT_BACKEND == "elevenlabs"
) and not ELEVENLABS_API_KEY:
    raise Exception("Please set the environment variable ELEVENLABS_API_KEY")
elif (TTS_BACKEND == "openai" or STT_BACKEND == "whisper") and not OPENAI_API_KEY:
    raise Exception("Please set the environment variable OPENAI_API_KEY")

if not OPENAI_API_KEY:
    raise Exception("Please set the environment variable OPENAI_API_KEY")

# Global Variables
video_base_path = os.path.join(os.getcwd(), "working", "uploads") + "/"
audio_base_path = os.path.join(os.getcwd(), "working", "extracted") + "/"
transscription_base_path = os.path.join(os.getcwd(), "working", "transcriptions") + "/"
tts_base_path = os.path.join(os.getcwd(), "working", "tts") + "/"
raw_video_base_path = os.path.join(os.getcwd(), "working", "rawvideos") + "/"
export_video_base_path = os.path.join(os.getcwd(), "working", "export") + "/"
