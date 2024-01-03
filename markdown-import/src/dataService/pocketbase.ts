import PocketBase from "pocketbase";
import type { DataProvider } from "./index";
import type { DocumentItem, Medium, MediumType } from "./types";
import fs from "fs";
import path from "path";
import { getDocumentMediaIds } from "../helpers";

let URL: string;

export default {
  name: "pocketbase",

  cache: {
    pb: null,
  },

  async initialize({ url }: { url: string }) {
    URL = url;
    this.cache.pb = new PocketBase(url);
  },

  async login(data: { username: string; password: string }): Promise<boolean> {
    try {
      await this.cache.pb
        .collection("users")
        .authWithPassword(data.username, data.password);
      return this.checkLogin();
    } catch (err) {
      throw Error(`Login failed. ${err}`);
      // return false;
    }
  },

  async clear(): Promise<void> {
    const documents = await this.cache.pb.collection("documents").getFullList();
    for (const doc of documents) {
      await this.cache.pb.collection("documents").delete(doc.id);
    }

    // delete media
    const media = await this.cache.pb.collection("media").getFullList();
    for (const m of media) {
      await this.cache.pb.collection("media").delete(m.id);
    }
  },

  async checkLogin(): Promise<boolean> {
    console.log("checking login");
    try {
      // console.log("token: ", this.pb.authStore.token);
      const res = await this.cache.pb.collection("users").getList(1, 1, {
        expand: "company",
      });
      if (res.items.length < 1) return false;

      return true;
    } catch (error) {
      console.log("error: ", error);
      return false;
    }
  },

  async uploadDocument(document: DocumentItem): Promise<DocumentItem> {
    const mediaIds = getDocumentMediaIds(document);

    delete document.media;

    const result = await this.cache.pb.collection("documents").create({
      content: document,
      media: mediaIds,
    });

    return { ...result.content, id: result.id, media: result.media };
  },

  async uploadMedium(
    filePath: string,
    langCode: string,
    documentId?: string | string[],
    originId?: string,
  ): Promise<Medium> {
    try {
      let type: MediumType = "image";

      if (filePath.endsWith(".mp4") || filePath.endsWith(".webm")) {
        type = "video";
      }

      const fileName = path.basename(filePath);

      const file = new FormData();
      const blob = new Blob([fs.readFileSync(filePath)]);
      file.append("file", blob, fileName);

      const result = await this.cache.pb.collection("media").create(file);

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

      if (documentId) {
        for (const id of documentId) {
          const document = await this.cache.pb
            .collection("documents")
            .getOne(id);

          await this.cache.pb.collection("documents").update(id, {
            media: [...document.media, updatedMedium.id],
          });
        }
      }

      return updatedMedium.content;
    } catch (e) {
      throw Error(`Medium ${filePath} could not be uploaded. ${e}`);
    }
  },

  async getFileURL(id: string) {
    const result = await this.cache.pb.collection("media").getOne(id);

    console.log(result);

    if (result.status && result.status !== 200) {
      throw Error(`Medium ${id} could not be fetched. ${result.message}`);
    }

    const url = await this.cache.pb.files.getUrl(result, result.file);

    console.log(url);

    return url.startsWith("http") ? url : URL + url;
  },
} satisfies DataProvider;
