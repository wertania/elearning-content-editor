# Video Conversion Tool

An AI language chain to transform a freely spoken video tutorial into a high-quality instructional video using advanced AI technologies.

## Overview

Chain:

- Import video content with freely spoken audio.
- Extract audio from the imported video.
- Transcribe the audio with corresponding timestamps.
- Optimize the transcription by deploying ChatBot for text correction.
- Generate Text-To-Speech from the newly corrected text in any language.
- Utilize the existing video file and layer in the newly created audio.
- Export the final product as a new video in any language.

The API (`api.py`) exposes the following endpoints:

- `/processVideo`: for transcribing a video file and optimizing the transcript
- `/createVideo`: for creating a new video file from a transcript

You can also use a one-off service that fetches unprocessed video tasks from the data provider, processes them and writes them back to the database. Refer to the file `main.py`.

## Running

You can start the API and the service in combination with all other services. Please refer to [the root README](../README.md).

If you want to start the service manually, you can do so by running the following commands.

```sh
# Build the image.
docker build -t -f docker/Dockerfile.service
  # or
docker build -t -f docker/Dockerfile.api

# Run the image.
docker run \
  -v ./working/export:/app/working/export \ # Mount a volume to the output directory.
  video-convert
```

## Configuration

Configuration is handled via environment variables. For available environment variables refer to the file [./.env.default](`.env.default`).

There are multiple text-to-speech (TTS) and speech-to-text (STT) backends available. You can configure which one to use by setting the environment variable `TTS_BACKEND` and `STT_BACKEND` respectively (`google | openai | elevenlabs`).

### Data provider

The data provider is abstracted so that multiple implementations can be used. You can configure which one to use by setting the environment variable `DATA_PROVIDER` (`mock | pocketbase` at the time of writing).

- `DATA_PROVIDER`: The data provider to use.
- `VIDEO_UPLOAD_USER`
- `VIDEO_UPLOAD_PASSWORD`
- `VIDEO_UPLOAD_URL`

### OpenAI backend

OpenAI is used for TTS as well as transcript optimization. If you want to use OpenAI, you have to set the environment variable `OPENAI_API_KEY`. To opt out of transcript optimization using OpenAI, set the environment variable `OPTIMIZE_TRANSCRIPT` to `false`.

For STT, `openai` is currently not supported as it does not export per-sentence timestamps.

- `OPENAI_API_KEY`

### Google backend

- `GOOGLE_CREDENTIALS_PATH`: The path to a JSON file containing the Google Cloud credentials.
- `GOOGLE_BLOB_BUCKET`: The name of the Google Cloud Storage bucket to use for storing the audio files that are to be processed by Google AI.

### Elevenlabs backend

TBD

- ELEVENLABS_API_KEY

## Deployment using Railway

The `Dockerfile`s are located inside `docker/`.

For the Railway configuration, refer to the following.

- https://docs.railway.app/guides/dockerfiles#custom-dockerfile-path

If you want to configure the service as a cron job, refer to these resources:

- https://docs.railway.app/reference/cron-jobs
- https://docs.railway.app/guides/cron-jobs
