/**
 * The main Pinia cache between Backend and Users Interaction
 * Will cache all documents and the tree
 * Will handle the interaction with the backend
 */

import { defineStore } from "pinia";
import { dataProvider } from "../services/data";
import { DocumentItem, DocumentTreeItem } from "../services/data/types";
import aiservice from "../services/openai/aiservice";
import {
  availableLanguages,
  baseLanguage,
  getLanguageItem,
  LanguageItem,
  mapLangCodesToLanguageItems,
} from "./../services/language/languageService";
import { UniversalBlock } from "vue-blockful-editor";
import { getItemFromTree, isDescendant } from "./helper";
import { error, info } from "./../services/toast";
import { buildTreeItem } from "./../services/data/helpers";

const DATASOURCE: string = import.meta.env.VITE_DOCUMENT_DATASOURCE ?? "mock";

interface DocumentState {
  dataSource: string;
  // doc states
  documentTree: DocumentTreeItem[];
  documentsFlat: DocumentItem[];
  // states for selected document
  selectedDocument: DocumentItem | null;
  baseDocument: DocumentItem | null;
  subDocuments: DocumentItem[] | null;
  editMode: "new" | "edit";
  changesDetected: boolean;
  // languages
  languages: LanguageItem[];
  baseLanguage: string;
  availableLanguages: LanguageItem[];
  missingLanguages: LanguageItem[];
  selectedLanguage: string;
}

export const useDocumentStore = defineStore("documents", {
  state: () =>
    ({
      // general states
      dataSource: DATASOURCE,
      // doc states
      documentTree: [],
      documentsFlat: [],
      // states for selected document
      selectedDocument: null,
      baseDocument: null,
      subDocuments: null,
      editMode: "new",
      changesDetected: false,
      // languages for selected document
      languages: availableLanguages, // all available languages in app
      baseLanguage: baseLanguage, // base language of app
      availableLanguages: [], // available languages for selected document
      missingLanguages: [], // missing languages for selected document
      selectedLanguage: baseLanguage, // selected language for selected document
    }) as DocumentState,

  actions: {
    /**
     * Initialize the store with data from the backend
     * get all documents and build a tree
     */
    async initialize(): Promise<void> {
      try {
        const data = await dataProvider.getDocuments({
          langCodes: [this.$state.baseLanguage],
        });
        this.$state.documentTree = data.tree;
        this.$state.documentsFlat = data.list;
      } catch (e) {
        error(e + "");
      }
    },

    /**
     * Get a document from the backend and set it as selected document
     */
    async getDocument(
      id: string,
      preferedLanguageCode?: string,
    ): Promise<DocumentItem | undefined> {
      try {
        // rest first
        this.$state.selectedDocument = null;
        // get new document
        const document = await dataProvider.getDataForDocument(id);
        this.$state.baseDocument = document;
        this.$state.selectedLanguage = document.langCode;
        this.$state.availableLanguages = [getLanguageItem(document.langCode)];

        // check if document has translations
        const translations = await dataProvider.getDocuments({ originId: id });
        if (translations.list.length > 0) {
          this.$state.subDocuments = translations.list;
        } else {
          this.$state.subDocuments = null;
        }
        this.refreshLanguagesCache();

        // set prefered language if available
        if (preferedLanguageCode && preferedLanguageCode !== baseLanguage) {
          console.log("preferedLanguageCode", preferedLanguageCode);
          const translation = this.$state.subDocuments?.find((item) =>
            item.langCode === preferedLanguageCode
          );
          if (translation) {
            console.log("translation found", translation);
            this.$state.selectedDocument = translation;
            this.$state.selectedLanguage = translation.langCode;
            return translation;
          } else {
            // else fallback to base document
            this.$state.selectedDocument = document;
            return document;
          }
        } else {
          // set selected document
          this.$state.selectedDocument = document;
          return document;
        }
      } catch (e) {
        error(e + "");
      }
    },

    /**
     * calulate the available languages and filter the missing languages
     */
    async refreshLanguagesCache(): Promise<void> {
      // available languages
      const subDocs = this.$state.subDocuments ?? [];
      this.$state.availableLanguages = mapLangCodesToLanguageItems([
        this.$state.baseLanguage,
        ...subDocs.map((item) => item.langCode),
      ]);
      // missing languages
      this.$state.missingLanguages = this.$state.languages.filter(
        (item) =>
          !this.$state.availableLanguages.find((lang) =>
            lang.code === item.code
          ),
      );
    },

    /**
     * Switch the selected language
     * look in subDocuments for the document with the new selected language
     */
    async switchLanguage(langCode: string) {
      let document;
      // if langCode is baseLanguage, set baseDocument as selectedDocument
      if (langCode === this.$state.baseLanguage) {
        document = this.$state.baseDocument;
      } // else look in subDocuments for the document with the new selected language
      else {document = this.$state.subDocuments?.find((item) =>
          item.langCode === langCode
        );}

      if (!document) {
        error(`Document with langCode ${langCode} not found`);
      } else {
        this.$state.selectedDocument = document;
        this.$state.selectedLanguage = langCode;
      }
    },

    /**
     * Reset the selected document to NULL
     */
    async resetSelectedDocument(): Promise<void> {
      this.$state.selectedDocument = null;
      this.$state.baseDocument = null;
      this.$state.subDocuments = null;
      this.$state.availableLanguages = [];
    },

    /**
     * Update the selected document and save it to the backend
     */
    async updateDocument(document: DocumentItem): Promise<void> {
      try {
        const doc = await dataProvider.updateDocument(document);

        // update current tree
        let item = getItemFromTree(document.id, this.$state.documentTree);
        if (item) {
          item = doc;
        }
        info("Document updated successfully");
      } catch (e) {
        error(e + "");
      }
    },

    /**
     * Drop the selected document
     * reset the selected document to NULL
     * update the tree
     */
    async dropDocument(id: string): Promise<void> {
      try {
        await dataProvider.dropDocument(id);
        this.resetSelectedDocument();
        // update current tree
        await this.initialize();
        info("Document deleted successfully");
      } catch (e) {
        error(e + "");
      }
    },

    /**
     * Add a new document to the backend and show
     */
    async addDocument(document: DocumentItem): Promise<void> {
      try {
        // get all mediumIds from content
        const mediumIds: string[] = [];
        document.content.forEach((block) => {
          if (block.type === "medium" && block.data.id) {
            mediumIds.push(block.data.id);
          }
        });
        document.media = mediumIds;
        const doc = await dataProvider.addDocument(document);
        // update current tree. find parent and add new document to children
        const treeItem = buildTreeItem(doc, []);
        if (doc.parent) {
          const parent = getItemFromTree(doc.parent, this.$state.documentTree);
          if (parent) {
            parent.children
              ? parent.children.push(treeItem)
              : (parent.children = [treeItem]);
          }
        } else {
          this.$state.documentTree.push(treeItem);
        }
      } catch (e) {
        error(e + "");
      }
    },

    /**
     * Delete a document from the backend
     */
    async dropNode(id: string) {
      try {
        await dataProvider.dropDocument(id);
        this.resetSelectedDocument();
        // update current tree
        await this.initialize();
        info("Node deleted successfully");
      } catch (e) {
        error(e + "");
      }
    },

    async moveNode(nodeId: DocumentItem, parentId: DocumentItem | undefined) {
      if (!parentId) {
        // If parentId is undefined, it's probably being moved to the root or is not being moved to a different parent.
        // Depending on your requirements, you might allow or disallow this.
        // Assuming it is allowed, proceed with the move:
        await dataProvider.moveNode(nodeId.id, undefined);
        await this.initialize();
        return;
      }
      // If parentId is defined, check if the node is being moved to a descendant of itself.
      if (isDescendant(nodeId, parentId.id)) {
        return;
      }
      await dataProvider.moveNode(nodeId.id, parentId.id);
      await this.initialize();
      info("Node moved successfully");
    },

    /**
     * add a new empty document to the backend and show it in the editor
     */
    async addTranslation(
      translate?: boolean,
      destLangCode?: string,
    ): Promise<void> {
      // new empty content
      let content: UniversalBlock[] = [
        {
          type: "paragraph",
          data: { text: "go here..." },
        },
      ];

      let name = "", description = "", header = "";

      // should a translation be created?
      if (translate && destLangCode && this.$state.selectedDocument) {
        console.log("Translation will be created");
        const translationBaseDocument: DocumentItem =
          this.$state.selectedDocument;

        // get full names of languageCodes
        const langName = (this.$state.languages.find((item) =>
          item.code === destLangCode
        )?.name) ?? destLangCode;
        const sourceLangName = (this.$state.languages.find((item) =>
          item.code === translationBaseDocument.langCode
        )?.name) ?? translationBaseDocument.langCode;

        const translatedContent = translationBaseDocument.content;
        // iterate through all blocks and translate the texts
        for (const block of translatedContent) {
          if (block.type === "paragraph") {
            const translation = await aiservice.getTranslation(
              block.data.text,
              sourceLangName,
              langName,
            );
            console.log("paragraph translated to", translation);
            block.data.text = translation;
          } else if (block.type === "header") {
            const translation = await aiservice.getTranslation(
              block.data.text,
              sourceLangName,
              langName,
            );
            console.log("header translated to", translation);
            block.data.text = translation;
          } else if (block.type === "markdown") {
            const translation = await aiservice.getTranslation(
              block.data.code,
              sourceLangName,
              langName,
            );
            console.log("markdown translated to", translation);
            block.data.code = translation;
          } else {
            console.error("unknown block type", block.type);
          }
        }
        content = translatedContent;

        if (translationBaseDocument.name !== "") {
          console.log("translate name", translationBaseDocument.name);
          name = await aiservice.getTranslation(
            translationBaseDocument.name,
            sourceLangName,
            langName,
          );
        }
        if (translationBaseDocument.description !== "") {
          console.log(
            "translate description",
            translationBaseDocument.description,
          );
          description = await aiservice.getTranslation(
            translationBaseDocument.description,
            sourceLangName,
            langName,
          );
        }
        if (translationBaseDocument.header !== "") {
          console.log("translate header", translationBaseDocument.header);
          header = await aiservice.getTranslation(
            translationBaseDocument.header,
            sourceLangName,
            langName,
          );
        }
      }

      const document: DocumentItem = {
        id: "",
        version: 1,
        name,
        description,
        header,
        type: "document",
        langCode: translate && destLangCode
          ? destLangCode
          : this.$state.baseLanguage,
        content,
        parent: this.$state.selectedDocument?.parent ?? undefined,
        originId: translate ? this.$state.selectedDocument?.id : undefined,
        media: this.$state.selectedDocument?.media ?? [],
        hidden: false,
      };

      // create document in backend
      console.log("addTranslation", document);
      const doc = await dataProvider.addDocument(document);
      this.$state.selectedDocument = doc;
      this.$state.subDocuments = [...(this.$state.subDocuments ?? []), doc];
      this.refreshLanguagesCache();
      this.$state.selectedLanguage = doc.langCode;
    },

    /**
     * add a new empty document. only add to the editor. do not save to backend initially
     */
    addEmtpyDocument(type: "document" | "folder", parent?: string) {
      const document: DocumentItem = {
        id: "",
        version: 1,
        name: "",
        description: "",
        header: "",
        type,
        langCode: this.$state.baseLanguage,
        content: type === "document"
          ? [
            {
              type: "paragraph",
              data: { text: "" },
            },
          ]
          : [],
        parent: parent ?? undefined,
        media: [],
        hidden: false,
      };

      this.resetSelectedDocument();
      this.$state.editMode = "new";
      this.$state.selectedDocument = document;
      this.$state.selectedLanguage = baseLanguage;
      this.refreshLanguagesCache();
    },
  },
});
