import { DocumentItem } from "../types";
import type { DocumentTreeItem } from "../types";

// Diese Daten sollen den originalen Daten entsprechen, die in einer DB lagern
// Die Daten liegen flach in der DB und können über id und parent id verknüpft werden
const demoData: DocumentItem[] = [
  {
    version: 1,
    id: "1",
    originId: null,
    type: "document",
    parent: "3",
    icon: "fa-solid fa-file",
    name: "Document 1",
    header: "This is the first document",
    description: "This is a short description of the first document",
    langCode: "de",
    content: [
      {
        type: "paragraph",
        data: "This is the first paragraph of the first document",
      },
      {
        type: "paragraph",
        data: "This is the second paragraph of the first document",
      },
    ],
  },
  {
    version: 1,
    id: "2",
    originId: null,
    type: "document",
    parent: null,
    icon: "fa-solid fa-folder",
    name: "Document 2",
    header: "This is the second document",
    description: "This is a short description of the second document",
    langCode: "de",
    content: [
      {
        type: "paragraph",
        data: "This is the first paragraph of the second document",
      },
      {
        type: "paragraph",
        data: "This is the second paragraph of the second document",
      },
    ],
  },
  {
    version: 1,
    id: "3",
    originId: null,
    type: "folder",
    parent: null,
    icon: "fa-solid fa-folder",
    name: "Folder 1",
    header: "This is the first folder",
    description: "This is a short description of the first folder",
    langCode: "de",
    content: [],
  },
  {
    version: 1,
    id: "4",
    originId: null,
    type: "folder",
    parent: "3",
    icon: "fa-solid fa-folder",
    name: "Folder 2",
    header: "This is the second folder",
    description: "This is a short description of the second folder",
    langCode: "de",
    content: [],
  },
  {
    version: 1,
    id: "5",
    originId: null,
    type: "document",
    parent: "4",
    icon: "fa-solid fa-file",
    name: "Document 3",
    header: "This is the third document",
    description: "This is a short description of the third document",
    langCode: "de",
    content: [
      {
        type: "paragraph",
        data: "This is the first paragraph of the third document",
      },
      {
        type: "paragraph",
        data: "This is the second paragraph of the third document",
      },
    ],
  },
];

/**
 * helper function to build the tree
 */
function buildTree(item: DocumentItem): DocumentTreeItem {
  const children = demoData
    .filter((childItem) => childItem.parent === item.id)
    .map((childItem) => buildTree(childItem));
  return {
    key: item.id,
    label: item.name,
    icon: item.icon ?? null,
    type: item.type,
    // data: => leeve this empty that the tree size is smaller! load data on demand
    children: children.length ? children : undefined,
  };
}

/**
 * Diese Stanardfunktionen braucht jeder Provider
 */
export default {
  name: "mock",
  async getDocuments(): Promise<
    { tree: DocumentTreeItem[]; list: DocumentItem[] }
  > {
    const rootItems = demoData.filter((item) => item.parent == null);

    const tree = rootItems.map((rootItem) => buildTree(rootItem));
    return {
      tree,
      list: demoData,
    };
  },

  async getDataForDocument(id: string): Promise<DocumentItem> {
    console.log("getDataForDocument");
    const item = demoData.find((item) => item.id === id);
    if (!item) {
      throw new Error(`Document with id ${id} not found`);
    }
    return item;
  },

  async addDocument(document: DocumentItem): Promise<void> {
    console.log("addDocument");
    demoData.push(document);
  },

  async dropDocument(id: string): Promise<void> {
    console.log("dropDocument");
    const index = demoData.findIndex((item) => item.id === id);
    demoData.splice(index, 1);
  },

  async updateDocument(document: DocumentItem): Promise<void> {
    console.log("updateDocument");
    const index = demoData.findIndex((item) => item.id === document.id);
    demoData[index] = document;
  },
};
