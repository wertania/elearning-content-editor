import whisper_timestamped as whisper
import config
from video_types import Transcript
import json
from video_types import Sentence

print(f'ℹ️ Loading model "{config.OPENAI_STT_MODEL}"...')
model = whisper.load_model(config.OPENAI_STT_MODEL, device="cpu")
print("Done!")


def authenticate():
    # TODO: Implement authentication
    pass


def speech_to_text(audio_file_path: str) -> Transcript:
    authenticate()

    global model

    audio = whisper.load_audio(config.audio_base_path + audio_file_path)
    result = whisper.transcribe(
        model=model,
        audio=audio,
        verbose=False,
        plot_word_alignment=False,
    )

    # print(json.dumps(result, ensure_ascii=False))
    with open("./result.json", "w") as file:
        file.write(json.dumps(result, ensure_ascii=False))

    sentences = list(map(lambda x: Sentence(x["text"], x["start"]), result["segments"]))
    transcript = Transcript(sentences)

    with open("./transcript.json", "w") as file:
        file.write(transcript.to_json())

    return transcript
