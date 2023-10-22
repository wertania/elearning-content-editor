import chromadb

# init chromadb client
chroma_client = chromadb.Client()
collection = chroma_client.create_collection(name="documents")

"""
docs: add documents to the collection
will add the "markdown" field to the document
ids = "id" field of the document
metadatas = { "source": <path>, "name": <name>, "langCode": <langCode>, "id": <id> } field of the document
[
  {
    "id": "6e5d0bpo57ce371",
    "langCode": "en",    
    "name": "Start",    
    "path": "Start",    
    "markdown": "Welcome to my small wiki. This demo shows the functionallity of RevDocs.\n\n"
  }
]
"""
def add_documents(document_entries: list):
    collection.add(
        documents=[item["markdown"] for item in document_entries],
        metadatas=[{ "source": item["path"], "name": item["name"], "langCode": item["langCode"], "id": item["id"]  } for item in document_entries],
        ids=[item["id"] for item in document_entries],
    )

def get_documents_for_search(search: str, cnt: int = 1):
    results = collection.query(
        query_texts=[search],
        n_results=cnt,
    )
    # will return something like this:
    # {'ids': [['4qlrfbut7mfs4ji']], 'distances': [[1.0073707103729248]], 'metadatas': [[{'langCode': 'en', 'name': 'Some document 2', 'source': 'Subfolder 2/Some document 2'}]], 'embeddings': None, 'documents': [['That is also a small document here...\n']]}
    
    print(results)

    if not results["ids"] or results["ids"][0] == []:
        return []

    # convert the result to an array of objects
    result_array = []
    for i in range(len(results["ids"])):
        result_array.append({
            "id": results["ids"][i][0],
            "distance": results["distances"][i][0],
            "metadata": results["metadatas"][i][0],
            "markdown": results["documents"][i][0]
        })

    return result_array
    