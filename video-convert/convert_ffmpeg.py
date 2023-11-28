"""
Library for extracting audio from video files
ffmpeg needs to be added to "Path" environment variable!!!
"""
from pydub import AudioSegment
from config import video_base_path, audio_base_path, raw_video_base_path
import os
import subprocess
from config import raw_video_base_path
from logging_output import info, error, warning, debug

def extract_audio(video_file: str) -> str:
    """
    Extracts audio from video file and saves it to wav file
    """    
    try:
        # Load the video file
        debug("Loading video file and extracting to wav")

        # get file extension
        fname, fextension = os.path.splitext(video_file)

        video = AudioSegment.from_file(video_base_path + video_file, format=fextension.replace(".",""))
        audio = video.set_channels(1).set_frame_rate(16000).set_sample_width(2)
        
        audio_file = audio_base_path + fname + ".wav"
        debug("Saving audio file to: " + audio_file)
        audio.export(audio_file, format="wav")

        return fname + ".wav"

    except Exception as e:
        error("ffmpeg needs to be added to 'Path' environment variable!")
        error("Error: " + str(e))
        raise e


def remove_audio(video_file: str) -> str:
    """
    Removes audio from video file
    """
    source_video_file = video_base_path + video_file
    new_video_file = raw_video_base_path + video_file
    
    # Use ffmpeg to remove the audio from the video
    subprocess.run(["ffmpeg", "-i", source_video_file, "-an", "-vcodec", "copy", new_video_file], check=True)

    # Alternative:
    # subprocess.run(["ffmpeg", "-i", source_video_file, "-an", "-c:v", "libx264", "-crf", "18", new_video_file], check=True)
    
    return video_file

if __name__ == "__main__":
    remove_audio("Testvideo_short_20.webm")
