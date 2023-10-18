from pocketbase import PocketBase

def get_document_tree(url, user, pwd, base_language="en"):
    print("Connecting to PocketBase...")
    client = PocketBase(url)

    # authenticate as regular user
    user_data = client.collection("users").auth_with_password(user, pwd)
    # print(f"Authenticated as {user_data}")

    # list and filter "example" collection records
    documents = client.collection("documents").get_list(
        1, 500, {"filter": f"content.langCode = '{base_language}'"})
    print(f"Found {len(documents.items)} documents in {base_language}")

    # each "item" has an "id"(string) and "content"(Json) fields. get new array of just "content" fields. add "id" to each "content" field
    items = [{**item.content, "id": item.id} for item in documents.items]
    # print(items)    

    return items