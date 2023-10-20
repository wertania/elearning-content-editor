
I need a python module that exports a function to parse a folder of markdown files to a object structure.

The function gets a ZIP file. This zip file must be extracted to a unique path (with guid).
In that extracted folder there will be a deep structure of folders and markdown files.

Here are some specs:
If the markdown file is called "index.md" it will get the name of its parent folder else it will get the name of the markdown file.

The markdown content must be checked for image references like that: "![alt-text?](some-file)". This file must be uploaded to a server. I have an existing external function called "upload_file(absolute_file_path: str): str" which returns an ID.

The markdown content will be splitted to an array in this structure:
[
  ...
      {
        "type": "medium",
        "data": {
          "id": "<the uploaded id of the image>"
        }        
      },
      {
        "type": "markdown",
        "data": {
          "code": "<the text markdown goes here>"
        }        
      },
  ...
]

One file or folder will be "converted" to an object in this stucture:
[
  {
    "id": "<relative-path-to-the-file>",
    "version": 1,
    "header": "<Name of the parent folder>",
    "name": "<Name of the parent folder>",
    "description": "",
    "content": <the-content-array>,    
    "langCode": "<language code>",
    "media": [<list of media ids>],    
    "type": "document" or "folder",    
    "children": null or [<list of child objects>]
  }
]
