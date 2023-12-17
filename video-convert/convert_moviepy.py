from moviepy.editor import (
    VideoFileClip,
    AudioFileClip,
    CompositeAudioClip,
    VideoClip,
)
from config import raw_video_base_path, export_video_base_path, tts_base_path
import os
from logging_output import info, error, warning, debug


def concatenate_audioclips(clips):
    """
    Alternative of moviepy.editor.concatenate_audioclips.
    Preserves the start time of the individual clips.
    """

    result = CompositeAudioClip(clips)
    result.fps = max([c.fps for c in clips if getattr(c, "fps", None)])

    return result


def create_video_with_audio(
    video_source_file,
    sentences: list,
    audio_source_base_name: str,
    audio_source_extension: str,
) -> str:
    # Load the video file.
    video = VideoFileClip(os.path.join(raw_video_base_path, video_source_file))

    # Create a list to hold audio clips.
    audio_clips = []

    # Loop through the sentences.
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

            # Append the audio clip to the list.
            audio_clips.append(audio)

        except Exception as e:
            error(
                f"Error loading audio file {audio_source_base_name}_{i}.{audio_source_extension}: {str(e)}"
            )
            continue

    # Create a single audio file from all individual sentences.
    full_audio = concatenate_audioclips(audio_clips)

    # Overlay the original video with the new audio.
    # It does not matter if the audio clip is shorter than the video
    # as it will be padded with silence at the end.
    final_video: VideoClip = video.set_audio(full_audio)

    # Write the new video file to disk
    output_path = os.path.join(export_video_base_path, video_source_file)
    final_video.write_videofile(
        output_path,
    )

    # Close the video file
    video.close()

    return output_path
