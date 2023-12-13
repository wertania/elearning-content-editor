from abc import abstractmethod
from enum import Enum
from typing import Optional


class UnconvertedVideo:
    def __init__(
        self, url: str, filename: str, sentences: Optional[list], data
    ) -> None:
        self.url = url
        self.filename = filename
        self.file_extension = "." + filename.split(".")[-1]
        self.data = data
        self.sentences = sentences


class ConvertedVideo:
    def __init__(self, filename: str, data) -> None:
        self.filename = filename
        self.file_extension = filename.split(".")[-1]
        self.data = data


class VideoStatus(Enum):
    UNPROCESSED = "unprocessed"
    PROCESSING = "processing"
    PROCESSED = "processed"


class DataProviderBase:
    @abstractmethod
    def read_unconverted_videos(self) -> list[UnconvertedVideo]:
        ...

    @abstractmethod
    def update_video_status(self, video_id: str, status: VideoStatus):
        ...

    @abstractmethod
    def upload_converted_video(self, filename: str, data):
        ...
