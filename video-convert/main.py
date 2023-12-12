from data_providers.mock import MockDataProvider, VideoStatus
import converter
import os


def initialize_data_provider():
    DATA_PROVIDER = os.environ.get("DATA_PROVIDER", "mock")
    print("Using data provider: " + DATA_PROVIDER)

    if DATA_PROVIDER == "mock":
        return MockDataProvider()
    # elif DATA_PROVIDER == "pocketbase":
    # return PocketBaseDataProvider()
    else:
        raise Exception("Invalid data provider: " + DATA_PROVIDER)


if __name__ == "__main__":
    # Initialize the data provider.
    data_provider = initialize_data_provider()

    # Fetch videos to convert.
    unconverted_videos = data_provider.read_unconverted_videos()

    # Execute the video converter.
    for video in unconverted_videos:
        # Update the video status to "processing".
        data_provider.update_video_status(video.filename, VideoStatus.PROCESSING)

        # Store the original video file and process it.
        id, filename = converter.store_video_file(video.data, video.file_extension)
        new_filename = converter.create_video(id, video.sentences)

        # Write the results to the database.
        with open(new_filename, "rb") as file:
            data = file.read()
            data_provider.upload_converted_video(filename, data)

        # Update the video status to "processed".
        data_provider.update_video_status(video.filename, VideoStatus.PROCESSED)
