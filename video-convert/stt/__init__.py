from config import STT_BACKEND
from typing import Callable
from video_types import Transcript

# This is the type of the text_to_speech procedure.
# It takes the text and a destination filename as input.
# Should return the filename of the generated audio file.
speech_to_text: Callable[[str], Transcript]

# Conditionally import STT modules based on the app config.
if STT_BACKEND == "google":
    from stt.stt_google import speech_to_text as _speech_to_text

    speech_to_text = _speech_to_text
elif STT_BACKEND == "openai":
    from stt.stt_openai import speech_to_text as _speech_to_text

    speech_to_text = _speech_to_text
else:
    raise Exception("Invalid STT_BACKEND")
