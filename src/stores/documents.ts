import { defineStore } from "pinia";
import { dataProvider } from "../services/data";
import { DocumentItem, DocumentTreeItem } from "../services/data/types";

const DATASOURCE: string = import.meta.env.VITE_DOCUMENT_DATASOURCE ?? "mock";
const BASE_LANGUAGE: string = import.meta.env.VITE_BASE_LANGUAGE ?? "en";

console.log("DOCUMENT_DATASOURCE", DATASOURCE);

interface DocumentState {
  // doc states
  documentSource: null | string;
  documentTree: DocumentTreeItem[];
  documentsFlat: DocumentItem[];
  // states for selected document
  selectedDocument: DocumentItem | null;
  baseDocument: DocumentItem | null;
  subDocuments: DocumentItem[] | null;
  // languages
  baseLanguage: string;
  availableLanguages: string[];
  selectedLanguage: string;
}

const isDescendant = (
  parent: DocumentItem | DocumentTreeItem,
  childId: string,
): boolean => {
  if (parent.type === "folder" && "children" in parent && parent.children) {
    if (parent.children.some((child) => child.id === childId)) {
      return true;
    }
    return parent.children.some((child) => isDescendant(child, childId));
  }
  return false;
};

export const useDocumentStore = defineStore("documents", {
  state: () =>
    ({
      // doc states
      documentSource: null,
      documentTree: [],
      documentsFlat: [],
      // states for selected document
      selectedDocument: null,
      baseDocument: null,
      subDocuments: null,
      // languages
      baseLanguage: BASE_LANGUAGE,
      availableLanguages: [],
      selectedLanguage: BASE_LANGUAGE,
    }) as DocumentState,

  actions: {
    async initialize() {
      this.$state.documentSource = DATASOURCE;
      const data = await dataProvider.getDocuments({
        langCodes: [this.$state.baseLanguage],
      });
      this.$state.documentTree = data.tree;
      this.$state.documentsFlat = data.list;
    },

    async resetSelectedDocument() {
      this.$state.selectedDocument = null;
      this.$state.baseDocument = null;
      this.$state.subDocuments = null;
      this.$state.availableLanguages = [];
    },

    async updateDocument(document: DocumentItem) {
      await dataProvider.updateDocument(document);

      // update current tree
      let item = this.$state.documentsFlat.find(
        (item) => item.id === document.id,
      );

      if (item) {
        item = document;
      }
    },

    async dropDocument(id: string) {
      await dataProvider.dropDocument(id);
      this.resetSelectedDocument();
      await this.initialize(); // TODO: optimize
    },

    async addDocument(document: DocumentItem) {
      await dataProvider.addDocument(document);
      // update current tree
      await this.initialize(); // TODO: optimize
    },

    async getDocument(id: string): Promise<DocumentItem> {
      const document = await dataProvider.getDataForDocument(id);
      this.$state.selectedDocument = document;
      this.$state.baseDocument = document;
      this.$state.selectedLanguage = document.langCode;
      // check if document has translations
      const translations = await dataProvider.getDocuments({ originId: id });
      if (translations.tree.length > 0) {
        this.$state.subDocuments = translations.tree;
        this.$state.availableLanguages = [
          this.$state.baseLanguage,
          ...translations.tree.map(
            (item) => item.langCode,
          ),
        ];
      } else {
        this.$state.subDocuments = null;
        this.$state.availableLanguages = [this.$state.baseLanguage];
      }
      return document;
    },

    async switchLanguage(langCode: string) {
      let document;
      if (langCode === this.$state.baseLanguage) {
        document = this.$state.baseDocument;
      } else {document = this.$state.subDocuments?.find((item) =>
          item.langCode === langCode
        );}

      if (!document) {
        throw new Error(`Document with langCode ${langCode} not found`);
      }
      this.$state.selectedDocument = document;
      this.$state.selectedLanguage = langCode;
    },

    async dropNode(id: string) {
      // const node = this.$state.documentsFlat.find((item) => item.id === id);

      // if (!node) {
      //   console.error(`Node with id ${id} not found`);
      //   return;
      // }

      // const getNodes = (node: DocumentItem | DocumentTreeItem): string[] => {
      //   let nodes: string[] = [];

      //   if (node.type === 'document') {
      //     nodes.push(node.id);
      //   } else if (node.type === 'folder') {
      //     nodes.push(node.id);
      //     this.$state.documentsFlat.forEach((item) => {
      //       if (item.parent === node.id) {
      //         nodes = nodes.concat(getNodes(item));
      //       }
      //     });
      //   }

      //   return nodes;
      // };

      // const nodes = getNodes(node);
      await dataProvider.dropNodes([id]);
      // update state with selected document
      this.resetSelectedDocument();
      // update current tree
      await this.initialize(); // TODO: optimize
    },

    async moveNode(nodeId: DocumentItem, parentId: DocumentItem | undefined) {
      if (!parentId) {
        // If parentId is undefined, it's probably being moved to the root or is not being moved to a different parent.
        // Depending on your requirements, you might allow or disallow this.
        // Assuming it is allowed, proceed with the move:
        await dataProvider.moveNode(nodeId.id, undefined);
        await this.initialize(); // TODO: optimize
        return;
      }

      if (isDescendant(nodeId, parentId.id)) {
        return;
      }

      await dataProvider.moveNode(nodeId.id, parentId.id);
      await this.initialize(); // TODO: optimize
    },
  },
});
