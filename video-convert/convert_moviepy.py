from moviepy.editor import (
    VideoFileClip,
    AudioFileClip,
    concatenate_videoclips,
)
from config import raw_video_base_path, export_video_base_path, tts_base_path
import os
from logging_output import info, error, warning, debug


def create_video_with_audio(
    video_source_file,
    sentences: list,
    audio_source_base_name: str,
    audio_source_extension: str,
) -> str:
    # Load the video file
    video = VideoFileClip(os.path.join(raw_video_base_path, video_source_file))

    # Create a list to hold video segments with audio
    video_segments = []

    # Loop through the array
    for i, item in enumerate(sentences):
        try:
            # Load the audio file by index
            audio = AudioFileClip(
                f"{tts_base_path}{audio_source_base_name}_{i}.{audio_source_extension}"
            )

            # Set the start time of the audio file
            debug(
                f"Add audio file {audio_source_base_name}_{i}.{audio_source_extension} to video {video_source_file} at {item['start_time']}"
            )
            audio = audio.set_start(item["start_time"])

            # Calculate the end time of the audio
            audio_end_time = item["start_time"] + audio.duration

            # Create a video segment for this audio
            video_segment = video.subclip(item["start_time"], audio_end_time)

            # Set the audio for the video segment
            video_segment = video_segment.set_audio(audio)

            # Add the video segment to the list
            video_segments.append(video_segment)

        except Exception as e:
            error(
                f"Error loading audio file {audio_source_base_name}_{i}.{audio_source_extension}: {str(e)}"
            )
            continue

    # Calculate the duration of the remaining portion of the video without audio
    last_audio_end_time = video_segments[-1].end if video_segments else 0
    remaining_duration = video.duration - last_audio_end_time

    if remaining_duration > 0:
        # Create a stumm (stummes Audio) clip for the remaining duration
        silent_audio = AudioFileClip("./assets/10-minutes-of-silence.mp3").subclip(
            0, remaining_duration
        )
        silent_audio = silent_audio.set_start(last_audio_end_time)

        # Create a video segment for the silent audio
        video_segment = video.subclip(last_audio_end_time, video.duration)
        video_segment = video_segment.set_audio(silent_audio)
        video_segments.append(video_segment)

    # Create a composite video from the video segments
    final_video = concatenate_videoclips(video_segments)

    # Write the new video file to disk
    output_path = os.path.join(export_video_base_path, video_source_file)
    final_video.write_videofile(
        output_path,
    )

    # Close the video file
    video.close()

    return output_path
