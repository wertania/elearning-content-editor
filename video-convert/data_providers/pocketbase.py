from pocketbase import PocketBase
from pocketbase.client import FileUpload
from data_providers.base import (
    BaseDataProvider,
    UnconvertedVideo,
    VideoStatus,
    VideoContent,
)
from config import VIDEO_UPLOAD_URL, VIDEO_UPLOAD_USER, VIDEO_UPLOAD_PASSWORD
from typing import Optional
import urllib.request


class PocketBaseUnconvertedVideo(UnconvertedVideo):
    def __init__(
        self,
        url: str,
        filename: str,
        sentences: Optional[list],
        data,
        task_id: str,
        errors: Optional[list[str]],
    ) -> None:
        super().__init__(url, filename, sentences, data)
        self.task_id = task_id
        self.errors = list(errors) if errors else []


def _fetch_data(url: str):
    bla = urllib.request.urlopen(url)
    contents = bla.read()
    return contents


def _create_unconverted_video(pb: PocketBase, task) -> PocketBaseUnconvertedVideo:
    url = pb.get_file_url(task, task.file, {})
    sentences = task.sentences
    file_data = _fetch_data(url)

    return PocketBaseUnconvertedVideo(
        url=url,
        filename=task.file,
        sentences=sentences,
        data=file_data,
        task_id=task.id,
        errors=task.errors,
    )


class PocketBaseDataProvider(BaseDataProvider):
    def __init__(self) -> None:
        super().__init__()

        self.pb = PocketBase(VIDEO_UPLOAD_URL)
        self.pb.collection("users").auth_with_password(
            VIDEO_UPLOAD_USER, VIDEO_UPLOAD_PASSWORD
        )

    def read_unconverted_videos(self) -> list[PocketBaseUnconvertedVideo]:
        tasks = self.pb.collection("videoTasks").get_full_list(
            200, {"filter": f'status = "{VideoStatus.UNPROCESSED}"'}
        )

        return list(map(lambda task: _create_unconverted_video(self.pb, task), tasks))

    def update_video_status(
        self, video: PocketBaseUnconvertedVideo, status: VideoStatus
    ):
        self.pb.collection("videoTasks").update(video.task_id, {"status": status})

    def upload_converted_video(self, filename: str, file):
        self.pb.collection("media").create(
            {
                "file": FileUpload((filename, file)),
                "content": VideoContent("video").to_json(),
                # TODO: langCode
            }
        )

    def add_errors(self, video: PocketBaseUnconvertedVideo, *errors: str):
        self.pb.collection("videoTasks").update(
            video.task_id,
            {"errors": video.errors + list(errors)},
        )
