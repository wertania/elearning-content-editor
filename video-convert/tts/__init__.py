from config import TTS_BACKEND
from typing import Callable

# This is the type of the text_to_speech procedure.
# It takes the text and a destination filename as input.
# Should return the filename of the generated audio file.
text_to_speech: Callable[[str, str], str]

# Conditionally import TTS modules based on the app config.
if TTS_BACKEND == "google":
    from tts.tts_google import text_to_speech as _text_to_speech

    text_to_speech = _text_to_speech
elif TTS_BACKEND == "elevenlabs":
    from tts.tts_elevenlabs import text_to_speech as _text_to_speech

    text_to_speech = _text_to_speech
elif TTS_BACKEND == "openai":
    from tts.tts_openai import text_to_speech as _text_to_speech

    text_to_speech = _text_to_speech
else:
    raise Exception("Invalid TTS_BACKEND")
