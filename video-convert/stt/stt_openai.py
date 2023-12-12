from openai import OpenAI
from config import OPENAI_API_KEY

client = OpenAI(
    api_key=OPENAI_API_KEY,
)

audio_file = open("/path/to/file/audio.mp3", "rb")
transcript = client.audio.transcriptions.create(model="whisper-1", file=audio_file)
