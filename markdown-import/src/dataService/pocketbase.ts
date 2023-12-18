import PocketBase from "pocketbase";
import type { DataProvider } from "./index";
import type { DocumentItem, Medium, MediumType } from "./types";

const URL: string = process.env.POCKETBASE_URL || "http://127.0.0.1:8090";

export default {
  name: "pocketbase",

  cache: {
    pb: null,
  },

  async initialize() {
    this.cache.pb = new PocketBase(URL);
  },

  async uploadDocument(document: DocumentItem): Promise<DocumentItem> {
    const result = await this.cache.pb.collection("documents").create({
      content: document,
    });
    return { ...result.content, id: result.id };
  },

  async uploadMedium(
    file: File,
    langCode: string,
    documentId?: string | string[],
    originId?: string,
  ): Promise<Medium> {
    try {
      let type: MediumType = "image";

      if (file.name.endsWith(".mp4") || file.name.endsWith(".webm")) {
        type = "video";
      }
      // first upload the file itself
      const result = await this.cache.pb.collection("media").create({
        file,
      });

      const url = await this.cache.pb.files.getUrl(result, result.file);

      const dbEntry: Medium = {
        id: result.id,
        version: 1,
        type,
        langCode,
        name: result.id,
        url,
        hash: "",
        filename: result.id,
        originId: originId || undefined,
        documents: documentId
          ? Array.isArray(documentId)
            ? documentId
            : [documentId]
          : [],
      };

      // update db
      const updatedMedium = await this.cache.pb
        .collection("media")
        .update(result.id, {
          content: dbEntry,
        });

      return updatedMedium.content;
    } catch (e) {
      throw Error(`Medium ${file.name} could not be uploaded. ${e}`);
    }
  },

  async getFileURL(id: string) {
    const result = await this.cache.pb.collection("media").getOne(id);
    
    if (result.status && result.status !== 200) {
      throw Error(`Medium ${id} could not be fetched. ${result.message}`);
    }

    const url = await this.cache.pb.files.getUrl(result, result.file);

    return url.startsWith("http") ? url : URL + url;
  },
} satisfies DataProvider;
