import MockProvider from "./provider/mock";
// some more providers...

// this must be improved later!
export class DataProvider {
  provider: string;

  constructor(type: string) {
    this.provider = type;
  }

  getDocumentTree() {
    switch (this.provider) {
      case "mock":
        return MockProvider.getDocumentTree();
      default:
        throw new Error(`Provider ${this.provider} not found`);
    }
  }
}
