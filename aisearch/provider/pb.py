from pocketbase import PocketBase
from tree import build_tree
import json

def get_document_tree():
    print("Connecting to PocketBase...")
    client = PocketBase('https://pocketbase-production-5fbc.up.railway.app')
    user = ""
    pwd = ""
    base_language = "en"

    # authenticate as regular user
    user_data = client.collection("users").auth_with_password(user, pwd)
    print(f"Authenticated as {user_data}")

    # list and filter "example" collection records
    documents = client.collection("documents").get_list(
        1, 500, {"filter": f"content.langCode = '{base_language}'"})
    print(f"Found {len(documents.items)} documents in {base_language}")

    # each "item" has an "id"(string) and "content"(Json) fields. get new array of just "content" fields. add "id" to each "content" field
    items = [{**item.content, "id": item.id} for item in documents.items]
    # print(items)

    print("Building tree...")
    tree = build_tree(items)
    print(json.dumps(tree, indent=2))

    return tree

if __name__ == "__main__":
    get_document_tree()