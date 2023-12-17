"""
Small helper to make a audio shorter for testing purposes.
"""

from moviepy.editor import AudioFileClip, VideoFileClip


def cut_audio_len(audio_file, length):
    # Laden Sie die WAV-Datei
    audio = AudioFileClip(audio_file)

    if audio.duration > length:
        audio = audio.subclip(0, length)

    audio_file_new = audio_file.replace(".wav", f"_short_{length}.wav")

    # Speichern Sie das gekürzte Audio
    audio.write_audiofile(
        audio_file_new,
        ffmpeg_params=["-ac", "1", "-stats"],  # Stereo zu Mono
    )

    return audio_file_new


def cut_video_len(video_file: str, length: int):
    # Laden Sie die WAV-Datei
    video = VideoFileClip(video_file)

    if video.duration > length:
        video = video.subclip(0, length)

    video_file_new = video_file.replace(".webm", f"_short_{length}.webm")

    # Speichern Sie das gekürzte Audio
    video.write_videofile(
        video_file_new,
    )

    return video_file_new
