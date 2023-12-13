from data_providers import data_provider
from data_providers.base import VideoStatus
import converter
import logging_output as logger

if __name__ == "__main__":
    # Fetch videos to convert.
    unconverted_videos = data_provider.read_unconverted_videos()

    # Execute the video converter.
    for video in unconverted_videos:
        # Update the video status to "processing".
        data_provider.update_video_status(video, VideoStatus.PROCESSING)

        try:
            if not video.sentences or len(video.sentences) == 0:
                # Create a new video transcript and store the audio data to a file.
                result = converter.create_video_transcript(
                    video.data, video.file_extension
                )
                id = result["id"]
                video.sentences = result["sentences"]
                filename = result["filename"]
            else:
                # Store the original video file and process it.
                id, filename = converter.store_video_file(
                    video.data, video.file_extension
                )

            new_filename = converter.create_video(id, video.sentences)

            # Write the results to the database.
            with open(new_filename, "rb") as file:
                data_provider.upload_converted_video(filename, file)

            # Update the video status to "processed".
            data_provider.update_video_status(video, VideoStatus.PROCESSED)
        except Exception as e:
            logger.warning(
                f"Failed to convert video: {video.filename}. Reverting status to 'unprocessed'."
            )
            logger.error("Original error:")
            logger.error(str(e))

            # Revert the video status to "unprocessed".
            data_provider.update_video_status(video, VideoStatus.UNPROCESSED)
