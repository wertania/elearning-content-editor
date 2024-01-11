import whisper_timestamped as whisper
import config
from video_types import Transcript, Sentence

model = None


def speech_to_text(audio_file_path: str) -> Transcript:
    global model

    # Load model
    if not model:
        print(
            f'ℹ️ Loading model "{config.OPENAI_STT_MODEL}"... This might take a while.'
        )
        model = whisper.load_model(config.OPENAI_STT_MODEL, device="cpu")
        print("Done!")

    audio = whisper.load_audio(config.audio_base_path + audio_file_path)
    result = whisper.transcribe(
        model=model,
        audio=audio,
        verbose=False,
        plot_word_alignment=False,
    )

    sentences = list(map(lambda x: Sentence(x["text"], x["start"]), result["segments"]))
    transcript = Transcript(sentences)

    return transcript
