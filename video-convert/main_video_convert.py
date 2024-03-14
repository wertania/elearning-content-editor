import time
from datetime import datetime

import converter
import logging_output as logger
from cleanup import clean_up
from data_providers import data_provider
from data_providers.base import UnconvertedVideo, VideoStatus


def process_video(video: UnconvertedVideo):
    if not video.sentences or len(video.sentences) == 0:
        # Create a new video transcript and store the audio data to a file.
        result = converter.create_video_transcript(video.data, video.file_extension)
        id = result["id"]
        video.sentences = result["sentences"]
        filename = result["filename"]
    else:
        # Store the original video file and process it.
        id, filename = converter.store_video_file(video.data, video.file_extension)

    new_filename = converter.create_video(id, video.sentences)

    # Write the results to the database.
    new_id = None
    with open(new_filename, "rb") as file:
        new_id = data_provider.upload_converted_video(filename, file, video.sentences)

    # Update the video status to "processed".
    try:
        data_provider.update_video_status(video, VideoStatus.PROCESSED)
        data_provider.update_video_media_id(video, new_id)
    except Exception as e:
        logger.error("Failed to update video meta-data. " + str(e))

    # Clean up the temporary files.
    clean_up(id)


def main():
    # Fetch videos to convert.
    unconverted_videos = data_provider.read_unconverted_videos()

    # Mark all videos as "processing" so other workers do not take them.
    try:
        for video in unconverted_videos:
            data_provider.update_video_status(video, VideoStatus.PROCESSING)
    except Exception as e:
        now = datetime.now()
        message = f"{now.isoformat()} - {str(e)}"

        logger.warning(
            "Failed to update video status to 'processing'. Reverting status to 'unprocessed'."
        )
        logger.error("Original error:")
        logger.error(message)

        # Revert the video status to "unprocessed".
        for video in unconverted_videos:
            data_provider.update_video_status(video, VideoStatus.UNPROCESSED)
            data_provider.add_errors(video, message)

    # Work on all videos.
    for video in unconverted_videos:
        logger.info(f"Processing video: {video.filename}")

        try:
            process_video(video)
        except Exception as e:
            now = datetime.now()
            message = f"{now.isoformat()} - {str(e)}"

            logger.warning(
                f"Failed to convert video: {video.filename}. Reverting status to 'unprocessed'."
            )
            logger.error("Original error:")
            logger.error(message)

            # Revert the video status to "unprocessed".
            data_provider.update_video_status(video, VideoStatus.UNPROCESSED)

            # Add error message.
            data_provider.add_errors(video, message)

    # wait 15s
    # service will restart and run again. so this sleep will prevent the service from running too fast
    logger.info("Waiting 15s...")
    time.sleep(15)


if __name__ == "__main__":
    # run main in a endless loop
    while True:
        main()
