import { Medium } from "../../types";

export const mockMedia: Medium[] = [
  {
    id: "123",
    version: 1,
    type: "image",
    langCode: "en",
    filename: "My first image",
    name: "My first image",
    hash: "123",
    providerSpecific: {
      url: "https://picsum.photos/512/512",
    },
    url: "https://picsum.photos/512/512",
    documents: [],
  },
  {
    id: "video1",
    version: 1,
    type: "video",
    langCode: "en",
    filename: "My second image",
    name: "My second image",
    hash: "123",
    providerSpecific: {
      url: "https://picsum.photos/512/512",
    },
    url: "https://picsum.photos/512/512",
    documents: [],
  },
];
