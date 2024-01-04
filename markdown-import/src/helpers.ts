import { BlockMedium } from "./blocks/medium/types";
import { DocumentItem, MediumType } from "./dataService/types";

export const getDocumentMediaIds = (document: DocumentItem) =>
  document.content
    .filter((block): block is BlockMedium => block.type === "medium")
    .map((block) => block.data.id)
    .filter((id): id is string => !!id);

export const getFileType = (filename: string): MediumType | "unknown" => {
  const ext = filename.split(".").pop()?.toLowerCase();
  if (!ext) return "unknown";
  if (["jpg", "jpeg", "png", "gif", "svg"].includes(ext)) return "image";
  if (["mp3", "wav", "ogg"].includes(ext)) return "audio";
  if (["mp4", "webm"].includes(ext)) return "video";

  return "unknown";
};
