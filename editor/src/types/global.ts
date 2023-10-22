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

export interface SmartVideoSentence {
  text: string;
  start_time: number;
}

export interface SmartVideoInitResult {
  id: string;
  sentences: SmartVideoSentence[];
}
