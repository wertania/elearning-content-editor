import os
import zipfile
import re
import uuid
from typing import List, Dict, Union
import json

# Dummy functions for testing. Replace them with actual functions.
def upload_file(absolute_file_path: str) -> str:
    return str(uuid.uuid4())

def create_document(document: Dict) -> str:
    return str(uuid.uuid4())

# Extracts zip file to a unique folder
def extract_zip(zip_file_path: str) -> str:
    extraction_path = os.path.join(os.getcwd(), str(uuid.uuid4()))
    with zipfile.ZipFile(zip_file_path, 'r') as zip_ref:
        zip_ref.extractall(extraction_path)
    return extraction_path

# Parses a markdown file
def parse_markdown(md_path: str, parent_folder: str) -> Dict:
    try:
        with open(md_path, 'r') as file:
            content = file.read()
    except:
        print("Error reading file: " + md_path)
        content = ""

    header_match = re.search(r'^# (.+)', content, re.MULTILINE)
    if header_match:
        header = header_match.group(1)
    else:
        header = os.path.basename(parent_folder)

    content_arr = []
    media_ids = []

    for segment in re.split(r'!\[.*?\]\((.*?)\)', content):
        if segment.endswith('.png') or segment.endswith('.jpg') or segment.endswith('.jpeg') or segment.endswith('.gif'):
            media_id = upload_file(os.path.join(parent_folder, segment))
            media_ids.append(media_id)
            content_arr.append({
                "type": "medium",
                "data": {
                    "id": media_id
                }
            })
        else:
            content_arr.append({
                "type": "markdown",
                "data": {
                    "code": segment
                }
            })

    return {
        "id": None,
        "parent": None,
        "version": 1,
        "header": header,
        "name": header,
        "description": "",
        "content": content_arr,
        "langCode": "en",  # replace with actual langCode logic
        "media": media_ids,
        "type": "document"
    }

# Parses a directory of markdown files recursively
def parse_directory(path: str) -> List[Dict]:
    documents = []
    for root, dirs, files in os.walk(path):
        for file in files:
            if file.endswith('.md'):
                document = parse_markdown(os.path.join(root, file), root)
                doc_id = create_document(document)
                document['id'] = doc_id
                documents.append(document)
    return documents

# Main function to process a zip file
def process_zip(zip_file_path: str) -> None:
    extraction_path = extract_zip(zip_file_path)
    documents = parse_directory(extraction_path)
    
    # Saving documents to disk
    with open('documents.json', 'w') as f:
        f.write(str(documents))

# Example usage:
# process_zip('sample.zip')

extract_path = "D:\\Entwicklung\\GitHub\\Privat\\elearning-content-editor\\aisearch\\importer\\test"
test = parse_directory(extract_path)
with open('test.json', 'w') as outfile:
   json.dump(test, outfile, indent=4)
   