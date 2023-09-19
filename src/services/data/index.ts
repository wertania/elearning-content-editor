import MockProvider from "./provider/mock";
import { DocumentItem } from "./types";
// some more providers later...
// es soll hier möglich sein, verschiedene Provider zu verwenden, damit das projekt nicht nur mit z.B. Azure funktioniert

// das sollte dann auch noch verbessert werden
export class DataProvider {
  provider: string;

  constructor(type: string) {
    this.provider = type;
  }

  /**
   * Returns the document tree for all documents in tree structure
   */
  getDocumentTree() {
    switch (this.provider) {
      case "mock":
        return MockProvider.getDocumentTree();
      default:
        throw new Error(`Provider ${this.provider} not found`);
    }
  }

  getDataForDocument(id: string) {
    switch (this.provider) {
      case "mock":
        return MockProvider.getDataForDocument(id);
      default:
        throw new Error(`Provider ${this.provider} not found`);
    }
  }

  /**
   * add a new document
   */
  addDocument(document: DocumentItem) {
    switch (this.provider) {
      case "mock":
        return MockProvider.addDocument(document);
      default:
        throw new Error(`Provider ${this.provider} not found`);
    }
  }

  dropDocument(id: string) {
    switch (this.provider) {
      case "mock":
        return MockProvider.dropDocument(id);
      default:
        throw new Error(`Provider ${this.provider} not found`);
    }
  }

  updateDocument(document: DocumentItem) {
    switch (this.provider) {
      case "mock":
        return MockProvider.updateDocument(document);
      default:
        throw new Error(`Provider ${this.provider} not found`);
    }
  }
}
