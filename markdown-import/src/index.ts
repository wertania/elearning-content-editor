import fs from "fs";
import path from "path";
import type { Root, Image as MarkdownImage } from "mdast";
import { remark } from "remark";
import remarkParse from "remark-parse";
import { visit } from "unist-util-visit";
import type { UniversalBlock } from "vue-blockful-editor";
import { toString } from "mdast-util-to-string";
import { dataProvider } from "./dataService";
import { DocumentItem, Medium } from "./dataService/types";

type TDocument = {
  name: string;
  path: string;
  type: "document" | "folder";
  translations: string[];
  children?: TDocument[];
  parent?: string;
  originId?: string;
  media?: Set<string>;
};

const parser = remark().use(remarkParse);

function checkIsLocalFile(url: string) {
  return !(url.startsWith("http://") || url.startsWith("https://"));
}

function getLocalImages(ast: Root): MarkdownImage[] {
  const localImages: MarkdownImage[] = [];

  visit(ast, "image", (node: MarkdownImage) => {
    const url = node.url;
    const isLocalFile = checkIsLocalFile(url);

    if (isLocalFile) {
      localImages.push(node);
    }
  });

  return localImages;
}

/**
 * Parses the markdown and uploads all images it finds, replacing the image URLs.
 */
async function replaceImages(
  ast: Root,
  currentPath: string,
  language: string,
): Promise<Root> {
  const uploadedImages = new Map<string, Medium>();
  const localImages = getLocalImages(ast);

  for (const node of localImages) {
    const url = node.url;
    const filePath = path.join(currentPath, url);

    // Get cached image or upload it.
    let image = uploadedImages.get(filePath);
    if (!image) {
      image = await dataProvider.uploadMedium(filePath, language);
      uploadedImages.set(filePath, image);
    }

    node.url = image.url;

    // Remember the medium ID.
    node.data = {
      ...node.data,
      id: image.id,
    };
  }

  return ast;
}

async function transformMarkdown(
  file: TDocument,
  md: string,
  language: string, // current language of the file
): Promise<UniversalBlock[]> {
  // Parse the tree.
  const plainRoot = parser.parse(md);

  // Upload all images.
  const root = await replaceImages(
    plainRoot,
    path.dirname(file.path),
    language,
  );

  const addMediumBlock = (id: string) => {
    // Add the image ID to the file's media array.
    if (!file.media) file.media = new Set();
    file.media.add(id);

    blocks.push({
      type: "medium",
      data: {
        id,
      },
    });
  };

  // Transform the tree.
  const blocks: UniversalBlock[] = [];

  for (const node of root.children) {
    switch (node.type) {
      case "heading":
        {
          blocks.push({
            type: "header",
            data: {
              level: node.depth,
              text: toString(node),
            },
          });
        }
        break;

      case "paragraph":
        {
          // Filter out text nodes that only contain whitespace.
          const nodesWithoutEmptyText = node.children.filter(
            (child) => child.type !== "text" || /\w/g.test(toString(child)),
          );

          // If the paragraph contains only images, insert an image block for each one.
          if (nodesWithoutEmptyText.every((child) => child.type === "image")) {
            const images = nodesWithoutEmptyText as MarkdownImage[];

            images.forEach((image) => {
              // @ts-ignore
              addMediumBlock(image.data.id);
            });

            break;
          }

          // Interpret the block as pure markdown.
          const code = node.position
            ? md.slice(node.position.start.offset, node.position.end.offset)
            : toString(node);

          blocks.push({
            type: "markdown",
            data: {
              code,
            },
          });
        }
        break;

      case "image": {
        // @ts-ignore
        addMediumBlock(node.data.id);
      }
    }
  }

  return blocks;
}

const getTranslationPath = (
  path: string,
  baseLanguage: string,
  language: string,
) => {
  return path.replace(`/${baseLanguage}/`, `/${language}/`);
};

const buildStructure = async (
  dir: string,
  baseLanguage: string,
  languages: string[],
): Promise<TDocument[]> => {
  const documentStructure = [];

  for await (const file of await fs.promises.opendir(dir)) {
    // Only look at markdown files and directories.
    if (!file.name.endsWith(".md") && !file.isDirectory()) continue;

    const fullPath = path.join(dir, file.name);
    const translations = [];

    for await (const language of languages) {
      const languagePath = getTranslationPath(fullPath, baseLanguage, language);
      if (fs.existsSync(languagePath)) {
        translations.push(language);
      }
    }

    const document: TDocument = {
      name: file.name,
      path: fullPath,
      type: file.isDirectory() ? "folder" : "document",
      translations: translations,
    };

    documentStructure.push(document);

    if (file.isDirectory()) {
      const childDocuments = await buildStructure(
        fullPath,
        baseLanguage,
        languages,
      );

      document.children = childDocuments;
    }
  }

  return documentStructure;
};

const uploadDocument = async (
  document: TDocument,
  content: UniversalBlock[],
  language: string,
) => {
  return await dataProvider.uploadDocument({
    name: document.name,
    type: document.type,
    version: 1,
    parent: document.parent,
    header: document.name,
    description: "",
    langCode: language,
    content: content,
    originId: document.originId,
    media: Array.from(document.media ?? []),
  });
};

const processFile = async (
  file: TDocument,
  language: string,
): Promise<DocumentItem | undefined> => {
  if (file.type === "folder") {
    return await uploadDocument(file, [], language);
  } else if (file.type === "document") {
    const content = fs.readFileSync(file.path, "utf-8");
    const blocks = await transformMarkdown(file, content, language);
    return await uploadDocument(file, blocks, language);
  }
};

const processFiles = async (
  structure: TDocument[],
  baseLanguage: string,
  languages: string[],
  parentIdsMap: Map<string, string> = new Map(),
) => {
  const childParentIdsMap = new Map();

  for (const document of structure) {
    // Set the parent ID for the base language version
    document.parent = parentIdsMap.get(baseLanguage);

    // Process the base language version
    const base = await processFile(document, baseLanguage);

    if (!base || !base.id) continue;

    // Update the parent IDs map for the base language
    childParentIdsMap.set(baseLanguage, base.id);

    // Process each translation of the current document
    for (const language of document.translations) {
      document.path = getTranslationPath(document.path, baseLanguage, language);
      document.parent = parentIdsMap.get(language);
      document.originId = base.id;

      const translatedDocument = await processFile(document, language);

      // Update the parent IDs map with the translated document's ID
      if (translatedDocument && translatedDocument.id) {
        childParentIdsMap.set(language, translatedDocument.id);
      }
    }

    // Process children
    if (document.children) {
      // Process children with the updated parent IDs map
      await processFiles(
        document.children,
        baseLanguage,
        languages,
        childParentIdsMap,
      );
    }
  }
};

export async function importFromDirectory(
  directory: string,
  baseLanguage: string,
) {
  const dir = path.join(directory, baseLanguage);

  const languages = fs
    .readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== baseLanguage)
    .map(({ name }) => name);

  console.log("Available languages", languages);

  const structure = await buildStructure(dir, baseLanguage, languages);
  await processFiles(structure, baseLanguage, languages);
}
