import { TreeNode } from 'primevue/tree';
import type { UniversalBlock } from 'vue-blockful-editor';

export type DocumentItem = {
  id: string;
  version: number;
  type: 'document' | 'folder';
  parent?: string;
  originId?: string; // id of the original document (e.g. translations)
  icon?: string; // fontawesome icon
  name: string; // short document name
  header: string; // long document name
  description: string; // short description
  langCode: string; // 'de', 'en', 'fr', ...
  content: UniversalBlock[];
  media: string[]; // list of medium ids
  hidden: boolean;
};

export type DocumentAddRequest = Omit<DocumentItem, 'id' | 'version'>;

export type MediumType = 'video' | 'audio' | 'image';

export interface Medium {
  id: string;
  version: number;
  type: MediumType;
  langCode: string;
  name: string;
  url: string;
  hash: string; // Ein hash über die Datei, um ggf. in Zukunft festzustellen, ob sich ein Upload/Download lohnt.
  filename: string;
  originId?: string; // id of the original document (e.g. translations)
  providerSpecific?: any; // provider specific data
  documents: string[]; // list of document ids
}
export type MediumAddRequest = Omit<Medium, 'id' | 'version'>;

export interface DocumentTreeItem extends TreeNode, DocumentItem {
  type: 'document' | 'folder';
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
  originId?: string;
}

export interface DataProvider {
  name: string;

  cache?: any; // provider specific cache

  initialize(): void;
  checkLogin(): Promise<boolean>;
  login(data?: any): Promise<boolean>;
  logout(): Promise<void>;
  register(
    username: string,
    password: string,
    email: string,
    name: string,
  ): Promise<void>;
  requestPasswordReset(email: string): Promise<void>;
  updateEmail(email: string): Promise<void>;
  requestEmailVerification(email: string): Promise<void>;

  getDocuments(
    query?: DocumentQuery,
  ): Promise<{ tree: DocumentTreeItem[]; list: DocumentItem[] }>;
  getDataForDocument(id: string): Promise<DocumentItem>;
  addDocument(document: DocumentItem): Promise<DocumentItem>;
  dropDocument(id: string): Promise<void>;
  updateDocument(document: DocumentItem): Promise<DocumentItem>;

  getMediums(query?: MediumQuery): Promise<Medium[]>;
  getMedium(id: string): Promise<Medium | undefined>;
  addMedium(
    file: File,
    langCode: string,
    documentId?: string | string[],
    originId?: string,
  ): Promise<Medium>;
  updateMedium(mediumId: string, file: File): Promise<Medium>;
  dropMedium(mediumId: string): Promise<void>;
  getMediumUrl(mediumId: string): Promise<string>;

  dropNodes(ids: string[]): Promise<void>;
  moveNode(id: string, parentId: string | undefined): Promise<void>;

  addPDF(file: File): Promise<string>;
  getPDFUrl(id: string): Promise<string>;
  dropPDF(id: string): Promise<void>;

  addVideoTask(file: File): Promise<string>;
  dropVideoTask(id: string): Promise<void>;
  updateVideoStatus(id: string, status: SmartVideoStatus): Promise<void>;
  updateVideoTranscript(
    id: string,
    sentences: SmartVideoTranscriptWithTimestamps[],
  ): Promise<void>;
  getVideoTask(id?: string): Promise<SmartVideoConvertTask[]>;
  getVideoTasks(status: SmartVideoStatus[]): Promise<SmartVideoTask[]>;
}

export type SmartVideoStatus =
  | 'unpreprocessed'
  | 'preprocessed'
  | 'preprocessing'
  | 'unprocessed'
  | 'processing'
  | 'processed'
  | 'done'
  | 'error';

export interface SmartVideoConvertTask {
  id: string;
  status: SmartVideoStatus;
  text: string;
  file: string; // filename
}

export interface SmartVideoTranscriptWithTimestamps {
  text: string;
  start_time: number;
}

export interface SmartVideoConvertTransscript {
  sentences: SmartVideoTranscriptWithTimestamps[];
}

export interface SmartVideoCreationRequest {
  id: string;
  langCode: string;
  sentences: SmartVideoTranscriptWithTimestamps[];
}

export interface SmartVideoTask {
  id: string;
  status: SmartVideoStatus;
  errors: any;
  sentences: SmartVideoTranscriptWithTimestamps[];
}
