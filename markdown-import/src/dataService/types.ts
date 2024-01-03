import { UniversalBlock } from "vue-blockful-editor";

export type DocumentItem = {
  id?: string;
  version: number;
  type: "document" | "folder";
  parent?: string;
  originId?: string; // id of the original document (e.g. translations)
  icon?: string; // fontawesome icon
  name: string; // short document name
  header: string; // long document name
  description: string; // short description
  langCode: string; // 'de', 'en', 'fr', ...
  content: UniversalBlock[];
  media?: string[]; // list of medium ids
};

export type MediumType = "video" | "audio" | "image";

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
