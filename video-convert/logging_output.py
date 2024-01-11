"""
This module is used to log messages to the console and to a log file.
"""
import os
from datetime import datetime

from dotenv import load_dotenv

load_dotenv()
LOG_LEVEL = os.getenv("LOG_LEVEL")

log_file_path = os.path.join(os.getcwd(), "working", "log.txt")

print("LOG_LEVEL: " + str(LOG_LEVEL))


# function to generate a ISO8601 timestamp
def _get_timestamp():
    # get the current time
    now = datetime.now()
    # format the time to ISO8601
    timestamp = now.strftime("%Y-%m-%dT%H:%M:%S.%f")
    # return the timestamp
    return timestamp[:-3] + "Z"


# function to add a row to a log file and delete the first row if the file is too big
def _log_fo_file(msg: str, context: str):
    row_to_log = f"{_get_timestamp() } - [{context}] " + msg + "\n"

    # check if the file exists
    if os.path.exists(log_file_path):
        # get the size of the file
        file_size = os.path.getsize(log_file_path)
        # if the file is bigger than 1 MB
        if file_size > 1000000:
            # open the file in read mode
            with open(log_file_path, "r") as f:
                # read the file content
                lines = f.readlines()
            # open the file in write mode
            with open(log_file_path, "w") as f:
                # write the file content without the first line
                f.writelines(lines[1:])
        # open the file in append mode
        with open(log_file_path, "a") as f:
            # write the message to the file
            f.write(row_to_log)
    else:
        # open the file in write mode
        with open(log_file_path, "w") as f:
            # write the message to the file
            f.write(row_to_log)


def info(msg: str) -> None:
    if LOG_LEVEL == "ERROR":
        return
    print("INFO: " + msg)
    _log_fo_file(msg, "INFO")


def error(msg: str) -> None:
    print("ERROR: " + msg)
    _log_fo_file(msg, "ERROR")


def warning(msg: str) -> None:
    if LOG_LEVEL == "ERROR" or LOG_LEVEL == "INFO":
        return
    print("WARN: " + msg)
    _log_fo_file(msg, "WARNING")


def debug(msg: str) -> None:
    if LOG_LEVEL == "ERROR" or LOG_LEVEL == "INFO" or LOG_LEVEL == "WARNING":
        return
    print("DEBUG: " + msg)
    _log_fo_file(msg, "DEBUG")
