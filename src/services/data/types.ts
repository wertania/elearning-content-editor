import { UniversalBlock } from "vue-blockful-editor";

export interface DocumentItem {
  version: number;
  id: string; // GUID
  type: "document" | "folder";
  parent: null | string;
  originId: null | string; // id of the original document (e.g. translations)
  icon: null | string; // fontawesome icon
  name: string; // short document name
  header: string; // long document name
  description: string; // short description
  langCode: string; // 'de', 'en', 'fr', ...
  content: UniversalBlock[];
}

export interface DataProvider {
  name: string;
}

export interface DocumentTreeItem {
  key: string; // unique key = id
  label: string;
  icon?: null | string; // e.g. 'pi pi-fw pi-inbox'
  type: "document" | "folder";
  data?: DocumentItem;
  children?: DocumentTreeItem[];
}
