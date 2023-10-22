export interface DocumentMeta {
  id: string;
  langCode: string;
  name: string;
  source: string;
}

export interface DocumentSearchResult {
  id: string;
  distance: number;
  metadata: DocumentMeta;
  markdown: string;
}

export interface AiSearchResult {
  answer: string;
  documents: DocumentMeta[];
}
