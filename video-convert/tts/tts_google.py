from google.cloud import texttospeech
from google.oauth2 import service_account
from config import GOOGLE_CREDENTIALS_PATH
from config import tts_base_path
from logging_output import info, error, warning, debug


def text_to_speech(text: str, filename: str) -> str:
    """Synthesizes speech from the input string of text."""

    credentials = service_account.Credentials.from_service_account_file(
        GOOGLE_CREDENTIALS_PATH
    )

    client = texttospeech.TextToSpeechClient(credentials=credentials)

    # Set the text input
    input_text = texttospeech.SynthesisInput(text=text)

    # Configure the voice settings
    voice = texttospeech.VoiceSelectionParams(
        language_code="de-DE", name="de-DE-Wavenet-E"
    )

    # Set the audio configuration
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3,
        effects_profile_id=["small-bluetooth-speaker-class-device"],
        pitch=0,
        speaking_rate=1,
    )

    # Perform the text-to-speech request
    response = client.synthesize_speech(
        input=input_text, voice=voice, audio_config=audio_config
    )

    mp3_file = tts_base_path + filename + ".mp3"

    # save response to mp3 file
    with open(mp3_file, "wb") as out:
        out.write(response.audio_content)
        debug(f'Audio content written to file "{mp3_file}"')

    return mp3_file


# debug
if __name__ == "__main__":
    text_to_speech("Hallo Welt", "AAA-TEST-AAA")
