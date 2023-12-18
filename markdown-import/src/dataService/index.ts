import "dotenv/config";
import PocketBaseProvider from "./pocketbase";
import { DocumentItem, Medium } from "./types";

export interface DataProvider {
  name: string;

  cache?: any; // provider specific cache

  initialize(): void;

  uploadMedium(
    file: File,
    langCode: string,
    documentId?: string | string[],
    originId?: string,
  ): Promise<Medium>;

  uploadDocument(document: DocumentItem): Promise<DocumentItem>;

  getFileURL(id: string): Promise<string>;
}

// Register your providers here.
const providerOptions: DataProvider[] = [PocketBaseProvider];

// Instantiate a provider.
export const dataProvider = (() => {
  const providerName = process.env.DOCUMENT_DATASOURCE;
  console.log(`Using data provider '${providerName}'.`);

  for (const p of providerOptions) {
    if (p.name === providerName) {
      return p;
    }
  }

  throw Error(`Cannot find unregistered data provider '${providerName}'.`);
})();
