import { DocumentItem } from "../types";
import type {
  DataProvider,
  DocumentQuery,
  DocumentTreeItem,
  MediumQuery,
} from "../types";
import { buildTree } from "../helpers";
import env from "../../env";

const URL = env.VITE_LOCALDB_HOST || "http://localhost:8077";
const DOCUMENTS_URL = URL + "/document/";
const MEDIA_URL = URL + "/media/";
const STATIC_URL = URL + "/static/";

export default {
  name: "localdb",

  initialize() {
    console.log("localdb: nothing to initialize");
  },

  async getDocuments(query?: DocumentQuery): Promise<{
    tree: DocumentTreeItem[];
    list: DocumentItem[];
  }> {
    let q = "?";
    if (query?.langCodes) {
      q += `langCodes=${query.langCodes.join(",")}&`;
    }
    if (query?.hasOrigin) {
      q += `hasOrigin=${query.hasOrigin}&`;
    }
    if (query?.originId) {
      q += `originId=${query.originId}&`;
    }
    const url = DOCUMENTS_URL + "query" + q;
    const res = await fetch(url);
    let documents: DocumentItem[] = await res.json();
    // "noContent" not implemented yet

    return {
      tree: buildTree(documents),
      list: documents,
    };
  },

  // -------------
  // | DOCUMENTS |
  // -------------

  async getDataForDocument(id: string): Promise<DocumentItem> {
    const res = await fetch(DOCUMENTS_URL + id);
    const document = await res.json();
    // console.log(document);
    return document;
  },

  async addDocument(document: DocumentItem): Promise<DocumentItem> {
    const res = await fetch(URL + "/document", {
      method: "POST",
      body: JSON.stringify(document),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const newDocument = await res.json();
    console.log(newDocument);
    return newDocument;
  },

  async dropDocument(id: string): Promise<void> {
    console.log("dropDocument", id);
    const res = await fetch(DOCUMENTS_URL + id, {
      method: "DELETE",
    });
    const deletedDocument = await res.json();
    console.log(deletedDocument);
    return;
  },

  async updateDocument(document: DocumentItem): Promise<DocumentItem> {
    const res = await fetch(DOCUMENTS_URL + document.id, {
      method: "PUT",
      body: JSON.stringify(document),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const updatedDocument = await res.json();
    console.log(updatedDocument);
    return updatedDocument;
  },

  // ---------
  // | MEDIA |
  // ---------

  async getMediums(query?: MediumQuery): Promise<any> {
    console.log("getMediums", query);
    const res = await fetch(MEDIA_URL);
    const media = await res.json();
    return media;
  },

  async getMedium(id) {
    const res = await fetch(`${MEDIA_URL}${id}`);
    // check status code
    if (res.status !== 200) {
      console.warn(`Medium with ID ${id} could not be found.`);
      return null;
    }
    const medium = await res.json();
    return medium;
  },

  async addMedium(file: File, langCode: string, originId?: string) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("langCode", langCode);
    if (originId) formData.append("originId", originId);
    const res = await fetch(MEDIA_URL, {
      method: "POST",
      body: formData,
    });
    const medium = await res.json();
    return medium;
  },

  async getMediumUrl(id) {
    return `${STATIC_URL}${id}`;
  },

  // ---------
  // | Nodes |
  // ---------

  async dropNodes(ids: string[]): Promise<void> {
    for (const id of ids) {
      await fetch(DOCUMENTS_URL + id, {
        method: "DELETE",
      });
    }
  },

  async moveNode(id: string, parentId: string): Promise<void> {
    // to do
    console.log(id, parentId);
  },
  // end
} satisfies DataProvider;
