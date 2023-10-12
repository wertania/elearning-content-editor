import { buildTree, fileTypeToMediaType } from "../../helpers";
import { DocumentItem } from "../../types";
import type { DataProvider, DocumentTreeItem, Medium } from "../../types";
import { demoData } from "./data";
import { mockMedia } from "./media";
import { guid } from "../../../guid";

export default {
  name: "mock",

  async initialize() {
    console.log("Mock data provider initialized.");
  },

  async checkLogin(): Promise<boolean> {
    return true;
  },

  async login(): Promise<boolean> {
    return true;
  },

  async logout(): Promise<void> {
    return;
  },

  async getDocuments(): Promise<{
    tree: DocumentTreeItem[];
    list: DocumentItem[];
  }> {
    return {
      tree: buildTree(demoData),
      list: demoData,
    };
  },

  // -------------
  // | DOCUMENTS |
  // -------------

  async getDataForDocument(id: string): Promise<DocumentItem> {
    const item = demoData.find((item) => item.id === id);

    if (!item) {
      throw new Error(`Document with id ${id} not found`);
    }

    return item;
  },

  async addDocument(document: DocumentItem): Promise<DocumentItem> {
    demoData.push(document);
    return document;
  },

  async dropDocument(id: string): Promise<void> {
    const index = demoData.findIndex((item) => item.id === id);
    demoData.splice(index, 1);
  },

  async updateDocument(document: DocumentItem): Promise<DocumentItem> {
    const index = demoData.findIndex((item) => item.id === document.id);
    demoData[index] = document;
    return document;
  },

  // ---------
  // | MEDIA |
  // ---------

  async getMedium(id: string): Promise<Medium | undefined> {
    return mockMedia.find((item) => id === item.id);
  },

  async getMediums(): Promise<Medium[]> {
    return mockMedia;
  },

  async addMedium(
    file: File,
    langCode: string,
    documentId: string | string[],
  ): Promise<Medium> {
    const medium: Medium = {
      id: guid(),
      hash: "",
      name: file.name,
      type: fileTypeToMediaType(file),
      url: URL.createObjectURL(file),
      documents: documentId
        ? (Array.isArray(documentId) ? documentId : [documentId])
        : [],
      version: 1,
      filename: file.name,
      langCode: langCode ?? "en",
    };

    mockMedia.push(medium);
    return medium;
  },

  async updateMedium(mediumId: string, file: File): Promise<Medium> {
    console.log(file);
    const m = mockMedia.find((item) => mediumId === item.id);
    if (!m) {
      throw Error(`Medium ${mediumId} not found`);
    }
    return m;
  },

  async dropMedium(mediumId: string): Promise<void> {
    const index = mockMedia.findIndex((item) => mediumId === item.id);
    mockMedia.splice(index, 1);
  },

  async getMediumUrl(mediumId) {
    return mockMedia.find((item) => mediumId === item.id)!.url;
  },

  // ---------
  // | Nodes |
  // ---------

  async dropNodes(ids: string[]): Promise<void> {
    for (const id of ids) {
      const index = demoData.findIndex((item) => item.id === id);
      demoData.splice(index, 1);
    }
  },

  async moveNode(id: string, parentId: string | undefined): Promise<void> {
    const node = demoData.find((item) => item.id === id);

    if (!node) {
      console.error(`Node with id ${id} not found`);
      return;
    }

    node.parent = parentId;
  },
} satisfies DataProvider;
