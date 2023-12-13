from convert_ffmpeg import extract_audio, remove_audio
import uuid
import os
from config import video_base_path, transscription_base_path
from stt import speech_to_text
from tts import text_to_speech
from convert_moviepy import create_video_with_audio
from logging_output import error, debug
from refinement_openai import refine
import json
from typing import Optional


def store_video_file(video_data, file_extension: str):
    # save video to disk
    guid = str(uuid.uuid4())
    filename = guid + file_extension

    with open(os.path.join(video_base_path, filename), "wb") as f:
        f.write(video_data)

    return (guid, filename)


def create_video_transcript(video_data, file_extension: str):
    # save video to disk
    guid, filename = store_video_file(video_data, file_extension)
    debug("Saved video to: " + filename)

    # extract audio from video
    debug("Extract Audio...")
    audio_file = extract_audio(filename)

    debug("Erstelle Transkript...")
    transcript = speech_to_text(audio_file)

    # optimize result by GPT-3.5
    debug("Optimiere Transkript...")
    optimized_transcript = refine(transcript, guid)

    # convert to json and save to session state
    transcript_obj = optimized_transcript.to_dict()

    return {
        "sentences": transcript_obj["sentences"],
        "id": guid,
        "filename": filename,
    }


def create_video(id: str, sentences: Optional[list]):
    if sentences is None:
        debug("Missing sentences in request. Will use original transcript.")
        # read original transcript from JSON file and parse to object
        jf = transscription_base_path + id + ".openai.json"
        with open(jf, "r") as f:
            sentences = json.load(f)["sentences"]
        debug("Loaded original transcript from file: " + jf)

    if sentences is None:
        raise Exception("No sentences found or given for id " + id)

    # iterate over all sentences in edited transcript and create audio files for each sentence
    debug("Create audio slices...")
    for x, sentence in enumerate(sentences):
        filename = id + "_" + str(x)
        created_file = text_to_speech(sentence["text"], filename)
        debug("Created tts: " + created_file)

    # remove audio from original video with pydub
    debug("Video wird erstellt...")

    # search for video file wih <id>.* in video_base_path since the file extension is unknown
    filename = ""
    for file in os.listdir(video_base_path):
        if file.startswith(id):
            filename = file
    if filename == "":
        error("No video file found for id " + id)
        raise Exception("No video file found for id " + id)
    debug("Found video file: " + filename)

    debug("Remove audio from video...")
    raw_video = remove_audio(filename)

    # create new video
    debug("Render video...")
    export_video = create_video_with_audio(raw_video, sentences, id, "mp3")
    debug(f"Video {export_video} fertig gerendert.")

    return export_video
