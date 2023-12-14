from config import (
    video_base_path,
    export_video_base_path,
    audio_base_path,
    transscription_base_path,
    tts_base_path,
    raw_video_base_path,
)
import os
import glob
from logging_output import debug


def clean_up(guid: str) -> None:
    """
    delete all files with the given guid in their names
    """
    # delete all files with the given guid in their names
    for path in [
        video_base_path,
        audio_base_path,
        transscription_base_path,
        tts_base_path,
        raw_video_base_path,
    ]:
        files = glob.glob(path + guid + "*")
        for f in files:
            os.remove(f)
            debug("Deleted file: " + f)
