import os
from config import video_base_path, export_video_base_path
from logging_output import error, debug
from fastapi import FastAPI, Request
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from typing_extensions import List, TypedDict
from pydantic import BaseModel
from converter import create_video_transcript, create_video
from threading import Thread
from starlette.concurrency import run_in_threadpool

app = FastAPI()


class Worker:
    def __init__(self, thread: Thread, status):
        self.thread = thread
        self.status = status


worker_threads: dict[str, Worker] = {}

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
    return {"message": True}


###
### Endpoint to POST a video in a FormData object
### will return a json object with the transcript
###
@app.post("/processVideo")
async def process_video(request: Request):
    form = await request.form()
    file = form["file"]
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
        file_extension = "." + filename.split(".")[-1]

        return await run_in_threadpool(
            create_video_transcript, contents, file_extension
        )
        # return create_video_transcript(contents, file_extension)
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


# Background task to create video
def create_video_background(req: CreateVideoRequest):
    id = req.id
    sentences = req.sentences

    try:
        create_video(id, sentences)
    except Exception as e:
        error("Error while processing video: " + str(e))


@app.post("/createVideo")
async def createVideo(req: CreateVideoRequest):
    # Start the video creation process as a background task
    worker = Thread(target=create_video_background, args=(req))
    worker.start()
    worker_threads[req.id] = Worker(worker, "running")

    # Return a response immediately
    return {
        "message": "Video creation process started. It might take a while to complete."
    }


@app.get("/status/{id}")
def get_status(id: str):
    """Endpoint to get the status of a task by ID."""
    worker = worker_threads.get(id)
    if not worker or not worker.status:
        return {"error": "Task not found"}
    return {
        "id": id,
        "status": worker.status["status"],
        "message": worker.status["message"],
    }


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
    return FileResponse(
        os.path.join(video_base_path, filename),
        media_type=f"video/{fextension}",
        filename=filename,
    )
