from config import dataprovider_password, dataprovider_user, dataprovider_url, base_language, debug
from provider.pb import get_document_tree
from provider.tree import build_tree, flatten_documents
from vectordb.chroma import add_documents, get_documents_for_search
import json

if debug:
    print("Debug mode enabled")

def init():
    # get document tree from data provider
    documents = get_document_tree(dataprovider_url, dataprovider_user, dataprovider_password, base_language)
    # extend document tree with "path" and "markdown"
    document_tree = build_tree(documents)

    if debug:
        # wirte document_tree to JSON file formatted
        with open('_debug_document_tree.json', 'w') as outfile:
            json.dump(document_tree, outfile, indent=2)

    # create a flat list of document entries. only add documents from type "document".
    # the documents are nested if a document has "children" entries
    document_entries = flatten_documents(document_tree)
    
    if debug:
        # write that result also to a JSON file formatted
        with open('_debug_document_entries.json', 'w') as outfile:
            json.dump(document_entries, outfile, indent=2)

    # write data to vector store
    add_documents(document_entries)

    # test
    results = get_documents_for_search("This is a query document")
    print(results)

    

if __name__ == "__main__":
    init()
