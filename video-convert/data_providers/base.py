from abc import abstractmethod
from enum import Enum
from typing import Optional, Literal
import json


class UnconvertedVideo:
    def __init__(
        self, url: str, filename: str, sentences: Optional[list], data
    ) -> None:
        self.url = url
        self.filename = filename
        self.file_extension = "." + filename.split(".")[-1]
        self.data = data
        self.sentences = sentences

    def __str__(self):
        return str((self.url, self.filename, self.file_extension, self.sentences))


class VideoContent:
    def __init__(self, type: Literal["image", "video", "audio"]):
        self.type = type

    def to_json(self) -> str:
        return json.dumps(self.__dict__)


class VideoStatus(str, Enum):
    UNPROCESSED = "unprocessed"
    PROCESSING = "processing"
    PROCESSED = "processed"


class BaseDataProvider:
    @abstractmethod
    def read_unconverted_videos(self) -> list[UnconvertedVideo]:
        ...

    @abstractmethod
    def update_video_status(self, video: UnconvertedVideo, status: VideoStatus):
        ...

    @abstractmethod
    def upload_converted_video(self, filename: str, file):
        ...

    @abstractmethod
    def add_errors(self, video: UnconvertedVideo, *errors: str):
        ...
