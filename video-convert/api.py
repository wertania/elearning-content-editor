from convert_ffmpeg import extract_audio, remove_audio
import uuid
import os
from config import video_base_path, transscription_base_path, export_video_base_path
from transcribe_google import speech_to_text
from tts_google import text_to_speech
from convert_moviepy import create_video_with_audio
from logging_output import error, debug
from cleanup import clean_up
from refinement_openai import refine
from fastapi import FastAPI, Request, BackgroundTasks
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from typing_extensions import List, TypedDict
from pydantic import BaseModel
import json

app = FastAPI()

# CORS
origins = [
    "*",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

debug("Starting API...")

@app.get("/ping")
def ping():
    return { "message": True }

###
### Endpoint to POST a video in a FormData object
### will return a json object with the transcript
###
@app.post("/processVideo")
async def process_video(request: Request):
    form = await request.form()
    file = form['file']
    if file is None:
        error("No file in request")
        raise Exception("No file in request")
    elif isinstance(file, str):
        error("Invalid file in request")
        raise Exception("Invalid file in request")
    filename = file.filename
    contents = await file.read()
    debug("Got video: " + str(filename))

    if filename is not None:
        # save video to disk
        guid = str(uuid.uuid4())

        fname, fextension = os.path.splitext(str(filename)) # get extension from uploaded file
        filename = guid + fextension

        with open(os.path.join(video_base_path,filename),"wb") as f:
            f.write(contents)
            
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
            "id": guid
        }
    else:
        error("No file in request")
        raise Exception("No file in request")

###
class TranscriptSegment(TypedDict):
    text: str
    start_time: float

class CreateVideoRequest(BaseModel):
    id: str
    sentences: List[TranscriptSegment]

# Global dictionary to store the status of each task
task_statuses = {}

# Background task to create video
def create_video_background(req: CreateVideoRequest):
    id = req.id
    sentences = req.sentences

    task_statuses[id] = {"status": "running", "message": "Video creation process started."}

    try:
        if sentences is None:
            debug("Missing sentences in request. Will use original transcript.")
            # read original transcript from JSON file and parse to object
            jf = transscription_base_path + id + ".openai.json"
            with open(jf, "r") as f:
                sentences = json.load(f)["sentences"]
            debug("Loaded original transcript from file: " + jf)

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

        task_statuses[id] = {"status": "done", "message": "Video creation process finished."}
    except Exception as e:
        error("Error while processing video: " + str(e))
        task_statuses[id] = {"status": "error", "message": "Error while processing video: " + str(e)}


@app.post("/createVideo")
async def createVideo(req: CreateVideoRequest, background_tasks: BackgroundTasks):  
    # Start the video creation process as a background task
    background_tasks.add_task(create_video_background, req)

    # Return a response immediately
    return {"message": "Video creation process started. It might take a while to complete."}


@app.get("/status/{id}")
def get_status(id: str):
    """Endpoint to get the status of a task by ID."""
    status = task_statuses.get(id)
    if not status:
        return {"error": "Task not found"}
    return {"id": id, "status": status["status"], "message": status["message"]}

# only download rendered video file
@app.get("/video/{id}")
def get_video(id: str):
    # search for video file wih <id>.* in video_base_path since the file extension is unknown
    filename = ""
    for file in os.listdir(export_video_base_path):
        if file.startswith(id):
            filename = file
    if filename == "":
        error("No video file found for id " + id)
        raise Exception("No video file found for id " + id)
    debug("Found video file: " + filename)

    # get extension from filename
    fname, fextension = os.path.splitext(filename)
    return FileResponse(os.path.join(video_base_path, filename), media_type=f"video/{fextension}", filename=filename)
