import os
from typing import Iterator
from elevenlabs import generate
from config import ELEVENLABS_API_KEY


def text_to_speech(text, audio_file):
    """
    Converts text to speech using ElevenLabs API
    """
    # check key
    if ELEVENLABS_API_KEY is None:
        raise Exception(
            "No ElevenLabs API key found in environment variables. Please set ELEVENLABS_API_KEY to your API key."
        )

    # use ElevenLabs to convert speech to text
    audio = generate(
        text=text,
        voice="Daniel",
        model="eleven_multilingual_v1",
        api_key=ELEVENLABS_API_KEY,
    )

    # convert audio to bytes if it is an iterator
    if isinstance(audio, Iterator):
        audio = b"".join(audio)

    # save audio to file
    filename = audio_file.replace(".wav", ".mp3")
    with open(filename, "wb") as file:
        file.write(audio)

    return filename
