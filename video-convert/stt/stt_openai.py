from openai import OpenAI
from config import OPENAI_API_KEY
from video_types import Transcript

client = OpenAI(
    api_key=OPENAI_API_KEY,
)


def speech_to_text(audio_file_path: str) -> Transcript:
    audio_file = open(audio_file_path, "rb")
    transcript = client.audio.transcriptions.create(model="whisper-1", file=audio_file)

    print("****************** TRANSCRIPT ******************")
    print(transcript)

    return Transcript([])
    # return Transcript.from_json()
    # return Transcript([...])
