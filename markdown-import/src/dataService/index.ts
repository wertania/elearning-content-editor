import "dotenv/config";
import PocketBaseProvider from "./pocketbase";
import { DocumentItem, Medium } from "./types";

export interface DataProvider {
  name: string;

  cache?: any; // provider specific cache

  initialize(options?: any): Promise<void>;

  login(data?: { username: string; password: string }): Promise<boolean>;
  checkLogin(): Promise<boolean>;

  clear(): Promise<void>;

  uploadMedium(
    filePath: string,
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
export let dataProvider: DataProvider;

export async function initializeDataProvider(
  dataProviderName: string,
  options?: any,
) {
  console.log(`Using data provider '${dataProviderName}'.`);

  for (const p of providerOptions) {
    if (p.name === dataProviderName) {
      dataProvider = p;
      await dataProvider.initialize?.(options);

      return;
    }
  }

  throw Error(`Cannot find unregistered data provider '${dataProviderName}'.`);
}
