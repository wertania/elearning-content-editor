import PocketBase from "pocketbase";
import {
  POCKETBASE_PASSWORD,
  POCKETBASE_URL,
  POCKETBASE_USERNAME,
} from "./env";
import {
  DocumentItem,
  DocumentTreeItem,
} from "./../../editor/src/services/data/types";

const buildTree = (items: DocumentItem[]): DocumentTreeItem[] => {
  const rootItems = items.filter((item) => !item.parent).sort(sorter);

  return rootItems.map((item) => buildTreeItem(item, items));
};

const sorter = (a: DocumentTreeItem, b: DocumentTreeItem): number => {
  // Folders take precedence.
  if (a.type === "folder" && b.type === "document") return -1;

  return a.name.localeCompare(b.name);
};

const buildTreeItem = (
  item: DocumentItem,
  documents: DocumentItem[],
): DocumentTreeItem => {
  const children = documents
    .filter((childItem) => childItem.parent === item.id)
    .map((childItem) => buildTreeItem(childItem, documents))
    .sort(sorter);

  const icon = item.type === "folder" ? "folder" : "file";

  return {
    ...item,
    key: item.id,
    label: item.name,
    icon: "fa-solid fa-" + (item.icon ?? icon),
    type: item.type,
    children: children.length ? children : undefined,
  };
};

export const vitepressDataProvider = {
  name: "pocketbase",

  cache: {
    pb: null,
    login: null,
  },

  async initialize() {
    this.cache.pb = new PocketBase(POCKETBASE_URL);
    this.cache.pb.autoCancellation(false);
  },

  async login(): Promise<boolean> {
    try {
      await this.cache.pb
        .collection("users")
        .authWithPassword(POCKETBASE_USERNAME, POCKETBASE_PASSWORD);
      return this.checkLogin();
    } catch (err) {
      throw Error(`Login failed. ${err}`);
      // return false;
    }
  },

  async checkLogin(): Promise<boolean> {
    console.log("checking login");
    try {
      // console.log("token: ", this.pb.authStore.token);
      const res = await this.cache.pb.collection("users").getList(1, 1, {
        expand: "company",
      });
      if (res.items.length < 1) return false;
      return true;
    } catch (error) {
      console.log("error: ", error);
      return false;
    }
  },

  async getDocuments(query?: any): Promise<{
    tree: any[];
    list: any[];
  }> {
    const filterParts: string[] = [];

    if (query?.langCodes) {
      filterParts.push("content.langCode ~ '" + query.langCodes + "'");
    }

    if (query?.hasOrigin) {
      filterParts.push("content.originId != null");
    }

    if (query?.originId) {
      filterParts.push("content.originId = '" + query.originId + "'");
    }

    filterParts.push("content.hidden = false");

    // Join all filter parts with ' && ' to form a valid Pocketbase filter query
    const filter = filterParts.join(" && ").trim();

    console.log("getDocuments from pocketbase", filter);
    const result = await this.cache.pb.collection("documents").getList(1, 500, {
      filter,
    });
    if (result.status && result.status !== 200) {
      throw Error(`Documents could not be fetched. ${result.message}`);
    }
    const contents = result.items.map((item: any) => {
      return { ...item.content, id: item.id }; // overwrite id since this is empty in content
    });

    return {
      tree: buildTree(contents),
      list: contents,
    };
  },

  async getMedium(id) {
    console.log("getMedium from pocketbase", id);
    const result = await this.cache.pb.collection("media").getOne(id);
    if (result.status && result.status !== 200) {
      throw Error(`Medium ${id} could not be fetched. ${result.message}`);
    }
    return { ...result.content, id: result.id };
  },

  async getPDFUrl(id: string): Promise<{ url: string; name: string }> {
    const item = await this.cache.pb.collection("pdfs").getOne(id);

    return {
      name: item.file,
      url: await this.cache.pb.files.getUrl(item, item.file),
    };
  },
};
