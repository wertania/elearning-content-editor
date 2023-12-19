"""
Library to parse audio files to text using Google Speech Recognition
This version can output also timestamps
"""

import json
import os
from typing import List

from config import (
    GOOGLE_BLOB_BUCKET,
    audio_base_path,
    google_creds,
    transscription_base_path,
)
from google.cloud import speech
from google.cloud import speech_v1 as speech
from google.cloud import storage
from google.cloud.speech_v1.types import SpeechContext
from google.oauth2 import service_account
from google.protobuf.json_format import MessageToDict
from logging_output import debug, error, info, warning
from video_types import Sentence, Transcript

bucket_name = GOOGLE_BLOB_BUCKET
credentials = None


def authenticate():
    global credentials

    if credentials is not None:
        return

    # get google cloud credentials as file
    credentials = service_account.Credentials.from_service_account_info(google_creds)


def upload_wav_to_gcs(source_file_name: str) -> str:
    """Uploads a WAV file to the specified Cloud Storage bucket. Needed to convert big files."""

    authenticate()

    storage_client = storage.Client(credentials=credentials)
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(source_file_name)

    blob.upload_from_filename(audio_base_path + source_file_name)

    return f"gs://{bucket_name}/{source_file_name}"


def convert_to_transcript(result) -> Transcript:
    sentences = []
    current_sentence = []
    start_time = 0

    for res in result["results"]:
        for word_info in res["alternatives"][0]["words"]:
            word = word_info["word"]

            if not current_sentence:  # if the current sentence is empty, set start time
                start_time = float(word_info["startTime"][:-1])

            # appending the word to current_sentence and checking if it ends with any of the specified delimiters
            if word.endswith((".", "?", "!")):
                current_sentence.append(word)
                sentence_text = " ".join(current_sentence)
                sentences.append(Sentence(text=sentence_text, start_time=start_time))
                current_sentence = []  # reset for the next sentence
            else:
                current_sentence.append(word)

    # handling the case where the last sentence does not end with a delimiter
    if current_sentence:
        sentence_text = " ".join(current_sentence)
        sentences.append(Sentence(text=sentence_text, start_time=start_time))

    return Transcript(sentences=sentences)


def get_speech_contexts() -> List[SpeechContext]:
    phrases = []
    boost = 20
    # read context from file ".custom_context.json"
    if os.path.exists(".custom_context.json"):
        debug("Found custom context file")
        with open(".custom_context.json", "r", encoding="utf-8") as f:
            data = json.load(f)
            phrases = data["phrases"]
            boost = data["boost"]

    return [
        SpeechContext(
            phrases=phrases,
            boost=boost,
        )
    ]


def transcribe_gcs(uri: str, contexts: List[SpeechContext]) -> dict:
    authenticate()

    client = speech.SpeechClient(credentials=credentials)
    config = speech.RecognitionConfig(
        # encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        # sample_rate_hertz=16000,
        language_code="de-DE",
        enable_automatic_punctuation=True,
        enable_word_time_offsets=True,
        speech_contexts=contexts,
    )
    """Transcribe the given audio file with Google Cloud Speech API."""

    # initialize audio object
    audio = speech.RecognitionAudio(uri=uri)
    request = speech.LongRunningRecognizeRequest(config=config, audio=audio)

    # make the request
    operation = client.long_running_recognize(request=request)
    debug("Waiting for operation to complete...")

    response = operation.result()

    debug("Operation complete. Returning results...")

    # convert to dict
    return MessageToDict(response._pb)  # type: ignore


def speech_to_text(
    audio_file_path: str,
) -> Transcript:
    # upload file to google cloud storage
    debug(f"Uploading file ({audio_file_path}) to Google Cloud Storage")

    gcs_uri = upload_wav_to_gcs(audio_file_path)
    debug(gcs_uri)
    # gcs_uri = "gs://dev-hochhuth/audio_35192687-b033-4f1a-873e-971cb1613cb9.wav"
    debug("File uploaded to Google Cloud Storage. URI: " + gcs_uri)
    context = get_speech_contexts()
    response = transcribe_gcs(gcs_uri, context)

    # get file extension
    fname, fextension = os.path.splitext(audio_file_path)

    json_file_raw = transscription_base_path + fname + ".raw.json"
    with open(json_file_raw, "w", encoding="utf-8") as f:
        json.dump(response, f, indent=4, ensure_ascii=False)

    # convert to transcript object
    converted = convert_to_transcript(response)

    # save to json file
    json_file_transcript = transscription_base_path + fname + ".ts.json"
    with open(json_file_transcript, "w", encoding="utf-8") as f:
        json.dump(converted.to_dict(), f, indent=4, ensure_ascii=False)

    return converted
