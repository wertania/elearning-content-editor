from data_providers.base import BaseDataProvider, UnconvertedVideo, VideoStatus

from .base import UnconvertedVideo


class MockDataProvider(BaseDataProvider):
    def __init__(self) -> None:
        self.videoTasks = [
            {
                "id": "1",
                "status": VideoStatus.UNPROCESSED,
                "filename": "demo_input.mp4",
            }
        ]

    def read_unconverted_videos(self) -> list[UnconvertedVideo]:
        filename = "demo_input.mp4"

        return list(
            map(
                lambda task: UnconvertedVideo(
                    task["filename"],
                    task["filename"],
                    [{"start_time": 0, "text": "This is a demo sentence."}],
                    open("./assets/" + filename, "rb").read(),
                ),
                self.videoTasks,
            )
        )

    def read_unpreprocessed_videos(self) -> list[UnconvertedVideo]:
        filename = "demo_input.mp4"

        return list(
            map(
                lambda task: UnconvertedVideo(
                    task["filename"],
                    task["filename"],
                    [{"start_time": 0, "text": "This is a demo sentence."}],
                    open("./assets/" + filename, "rb").read(),
                ),
                self.videoTasks,
            )
        )

    def update_video_status(self, video_id: str, status: VideoStatus):
        ...

    def upload_converted_video(self, filename: str, data, transcript: list):
        ...

    def add_errors(self, video_id: str, *errors: str):
        ...

    def update_video_sentences(self, video_id: str, sentences: list[str]):
        ...

    def reset_errors(self, video: UnconvertedVideo):
        ...
