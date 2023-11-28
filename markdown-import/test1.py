import zipfile
import os
import re
import json
import random
import datetime

def append_to_log_file(file_path: str, content: str):
    with open(file_path, 'a') as file:
        file.write(content + os.linesep)

def get_formatted_timestamp():
    return datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

def info(id: str, message: str):
    print(F"{get_formatted_timestamp} INFO: " + message)
    append_to_log_file(id + ".debug.log", F"{get_formatted_timestamp} INFO: " + message)

def error(id: str, message: str):
    print(F"{get_formatted_timestamp} ERROR: " + message)
    append_to_log_file(id + ".log.err", F"{get_formatted_timestamp} ERROR: " + message)    

def upload_file(absolute_file_path: str) -> str:
    return "<uploaded_id>"

def generate_15_digit_guid():
    return str(random.randint(10**14, 10**15 - 1))

def unzip_file(zip_path, extract_path):
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(extract_path)

def write_json_file(file_path, content):
    with open(file_path, 'w') as outfile:
        json.dump(content, outfile, indent=4)

def parse_markdown(file_path):
    try:
        content_array = []
        media_ids = []

        print("Parsing markdown file: " + file_path)
        with open(file_path, 'r') as md_file:
            content = md_file.read()

            # Match the image references in markdown content
            img_matches = re.findall(r'!\[(.*?)\]\((.*?)\)', content)

            last_pos = 0
            for alt_text, img_path in img_matches:
                start_pos = content.find('![' + alt_text + ']', last_pos)
                
                # Append the text before the image
                content_array.append({
                    "type": "markdown",
                    "data": {
                        "code": content[last_pos:start_pos]
                    }
                })

                # Upload the image and get the ID
                img_id = upload_file(os.path.join(os.path.dirname(file_path), img_path))
                media_ids.append(img_id)

                content_array.append({
                    "type": "medium",
                    "data": {
                        "id": img_id
                    }
                })

                last_pos = start_pos + len('![' + alt_text + '](' + img_path + ')')

            # Append the remaining text after the last image
            content_array.append({
                "type": "markdown",
                "data": {
                    "code": content[last_pos:]
                }
            })

        return content_array, media_ids
    except Exception as e:
        print("Error while parsing markdown file: " + file_path)
        print(e)
        return [], []

def extract_md_title(content: str) -> str:
    title_match = re.match(r'^#\s+(.*)', content, re.MULTILINE)
    if title_match:
        return title_match.group(1)
    return None    

def traverse_directory(directory, base_directory, job_id: str):
    results = []

    for entry in os.listdir(directory):
        full_path = os.path.join(directory, entry)

        gen_id = generate_15_digit_guid()
        if os.path.isfile(full_path) and entry.endswith(".md"):
            content, media = parse_markdown(full_path)
            relative_path = os.path.relpath(full_path, base_directory)
            folder_name = os.path.basename(os.path.dirname(full_path))

            # Check if it's an index.md file and extract title
            title = None
            if entry == "index.md":
                title_content = next((item["data"]["code"] for item in content if item["type"] == "markdown"), None)
                if title_content:
                    title = extract_md_title(title_content)            
            
            results.append({
                "id": gen_id,
                "version": 1,
                "header": title or folder_name if entry == "index.md" else entry,
                "name": title or folder_name if entry == "index.md" else entry,
                "description": "",
                "content": content,
                "langCode": "<language code>",  # Adjust as required
                "media": media,
                "type": "document",
                "children": None
            })
            info(job_id, "Added document: " + relative_path)

        elif os.path.isdir(full_path):
            children = traverse_directory(full_path, base_directory)

            results.append({
                "id": gen_id,
                "version": 1,
                "header": entry,
                "name": entry,
                "description": "",
                "content": None,
                "langCode": "<language code>",  # Adjust as required
                "media": [],
                "type": "folder",
                "children": children
            })
            info(job_id, "Added folder: " + os.path.relpath(full_path, base_directory))

    return results


def parse_zip(zip_path):   
    job_id = generate_15_digit_guid()

    info(job_id, "Starting job with ID: " + job_id)
    # extract_path = os.path.join("/tmp", str(uuid.uuid4()))  # Creating a unique path
    # unzip_file(zip_path, extract_path)

    extract_path = "D:\\Entwicklung\\GitHub\\Privat\\elearning-content-editor\\aisearch\\importer\\test"
    return traverse_directory(extract_path, extract_path, job_id)


if __name__ == "__main__":
    parse_zip("sample.zip")
