
def render_markdown(blocks):
    # print("render_markdown")
    # print(blocks)
    md = ""
    for block in blocks:
        if block["type"] == "paragraph":
            md += block["data"]["text"] + "\n"
        elif block["type"] == "header":
            md +=  "#" * block["data"]["level"] + " " + block["data"]["text"] + "\n"
        elif block["type"] == "markdown":
            md +=  block["data"]["code"] + "\n"
        elif block["type"] == "medium":
            md += "" + "\n"
    return md

def build_tree(json_data):
    # print(json_data)

    def sorter(item):
        # Sort function to prioritize folders over documents
        return (item['type'] == 'folder', item['name'])

    def build_tree_item(item, json_data, parent_path=""):
        item_path = f"{parent_path}/{item['name']}" if parent_path else item['name']
        children = [build_tree_item(child, json_data, item_path) for child in json_data if child.get('parent') == item['id']]
        children.sort(key=sorter)

        return {
            **item,
            'type': item['type'],
            'path': item_path,
            'children': children if children else None,
            'markdown': render_markdown(item['content'])
        }

    root_items = [item for item in json_data if not 'parent' in item or item['parent'] is None]
    # print(root_items)
    root_items.sort(key=sorter)

    tree = [build_tree_item(root, json_data) for root in root_items]
    return tree

def flatten_documents(json_data):
    flat_list = []

    def recursive_parse(data):
        for item in data:
            if item.get('type') == 'document':
                flat_list.append(item)
            elif item.get('children'):
                recursive_parse(item['children'])

    recursive_parse(json_data)
    return flat_list
