import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
GOOGLE_CREDENTIALS_PATH = os.getenv("GOOGLE_CREDENTIALS_PATH")
GOOGLE_BLOB_BUCKET = os.getenv("GOOGLE_BLOB_BUCKET")
LOG_LEVEL = os.getenv("LOG_LEVEL")
VIDEO_UPLOAD_USER = os.getenv("VIDEO_UPLOAD_USER") or ""
VIDEO_UPLOAD_PASSWORD = os.getenv("VIDEO_UPLOAD_PASSWORD") or ""
VIDEO_UPLOAD_URL = os.getenv("VIDEO_UPLOAD_URL") or ""

OPTIMIZE_TRANSCRIPT = os.getenv("OPTIMIZE_TRANSCRIPT", "true").lower() != "false"

if LOG_LEVEL is None:
    LOG_LEVEL = "ERROR"

TTS_BACKEND = os.getenv("TTS_BACKEND")
STT_BACKEND = os.getenv("STT_BACKEND")

if not TTS_BACKEND:
    raise Exception("Please set the environment variable TTS_BACKEND")
if (TTS_BACKEND == "google" or STT_BACKEND == "google") and not GOOGLE_CREDENTIALS_PATH:
    raise Exception("Please set the environment variable GOOGLE_CREDENTIALS_PATH")
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
