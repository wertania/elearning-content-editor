import { type } from "os";
import { TreeNode } from "primevue/tree";
import type { UniversalBlock } from "vue-blockful-editor";

export interface DocumentItem {
  version: number;
  id: string; // GUID
  type: "document" | "folder";
  parent?: string;
  originId?: string; // id of the original document (e.g. translations)
  icon?: string; // fontawesome icon
  name: string; // short document name
  header: string; // long document name
  description: string; // short description
  langCode: string; // 'de', 'en', 'fr', ...
  content: UniversalBlock[];
}

export type MediumType = "video" | "audio" | "image";

export interface Medium {
  id: string;
  url: string; // blob url
  name: string;
  hash: string; // Ein hash über die Datei, um ggf. in Zukunft festzustellen, ob sich ein Upload/Download lohnt.
  type: MediumType;
  langCode: string;
  originId?: string; // id of the original document (e.g. translations)
}

export interface DocumentTreeItem extends TreeNode, DocumentItem {
  type: "document" | "folder";
  children?: DocumentTreeItem[];
}

export interface DocumentQuery {
  langCodes?: string[]; // only documents with given langCode(s)
  hasOrigin?: boolean; // only documents with originId
  originId?: string; // id of the original document (e.g. translations)
  noContent?: boolean; // to minimize the data transfer
}

export interface MediumQuery {
  type?: MediumType;
  documentId?: string;
}

export interface DataProvider {
  name: string;

  initialize?(): void;

  getDocuments(
    query?: DocumentQuery,
  ): Promise<{ tree: DocumentTreeItem[]; list: DocumentItem[] }>;
  getDataForDocument(id: string): Promise<DocumentItem>;
  addDocument(document: DocumentItem): Promise<DocumentItem>;
  dropDocument(id: string): Promise<void>;
  updateDocument(document: DocumentItem): Promise<DocumentItem>;

  getMediums(query?: MediumQuery): Promise<Medium[]>;
  getMedium(id: string): Promise<Medium | undefined>;
  addMedium(file: File, langCode: string, originId?: string): Promise<Medium>;
  getMediumUrl(mediumId: string): Promise<string>;

  dropNodes(ids: string[]): Promise<void>;
  moveNode(id: string, parentId: string | undefined): Promise<void>;
}
