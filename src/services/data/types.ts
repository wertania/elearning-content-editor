import { TreeNode } from 'primevue/tree';
import type { UniversalBlock } from 'vue-blockful-editor';

export interface DocumentItem {
  version: number;
  id: string; // GUID
  type: 'document' | 'folder';
  parent?: string;
  originId?: string; // id of the original document (e.g. translations)
  icon?: string; // fontawesome icon
  name: string; // short document name
  header: string; // long document name
  description: string; // short description
  langCode: string; // 'de', 'en', 'fr', ...
  content: UniversalBlock[];
}

export interface DataProvider {
  name: string;

  initialize?(): void;
  getDocuments(): Promise<{ tree: DocumentTreeItem[]; list: DocumentItem[] }>;
  getDataForDocument(id: string): Promise<DocumentItem>;
  addDocument(document: DocumentItem): Promise<void>;
  dropDocument(id: string): Promise<void>;
  updateDocument(document: DocumentItem): Promise<void>;
}

export interface DocumentTreeItem extends TreeNode, DocumentItem {
  type: 'document' | 'folder';
  children?: DocumentTreeItem[];
  // data: DocumentItem;
}
