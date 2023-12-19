import fs, { Dirent } from "fs";
import path from "path";
import type { Root } from "mdast";
import { remark } from "remark";
import remarkParse from "remark-parse";
import { visit } from "unist-util-visit";
import type { UniversalBlock } from "vue-blockful-editor";
import { toString } from "mdast-util-to-string";
import { dataProvider } from "./dataService";
import { DocumentItem } from "./dataService/types";

const parser = remark().use(remarkParse);

/**
 * Parses the markdown and uploads all images it finds, replacing the image URLs.
 */
function uploadImages(ast: Root) {
  visit(ast, "image", (node) => {
    const url = node.url;

    // TODO: Check if `url` is a local file (check for http/https).
    const isLocalFile = true;

    if (isLocalFile) {
      // TODO: If yes, read the file and upload it.
      // Probably needs a base path as well to locate the image file.
      // fs.readFileSync(...)
      // TODO: Replace `url` with the new URL.
      // node.url = newUrl;
    }
  });
}

function transformMarkdown(md: string): UniversalBlock[] {
  // Parse the tree.
  const ast = parser.parse(md);

  // Transform the tree.
  const blocks: UniversalBlock[] = [];

  for (const node of ast.children) {
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
          blocks.push({
            type: "markdown",
            data: {
              code: toString(node),
            },
          });
        }
        break;

      case "image": {
        blocks.push({
          type: "image",
          data: {
            src: node.url,
          },
        });
      }
    }
  }

  return blocks;
}

/**
 * Imports markdown files from a directory.
 *
 * The directory structure can look like this:
 * ```
 * - en
 *   - introduction.md
 *   - image1.png
 * - de
 *   - introduction.md
 *   - image1.png
 * ```
 */
export async function importFromDirectory(
  directory: string,
  baseLanguage: string,
) {
  const dir = path.join(directory, baseLanguage);

  const languages = fs.readdirSync(directory).filter((file) => {
    return file !== baseLanguage && file.length === 2;
  });

  console.log("Available languages", languages);

  await importFiles(dir, baseLanguage, languages);
}

async function importFiles(
  dir: string,
  baseLanguage: string,
  languages: string[] = [],
  parentFolder?: string,
) {
  type TFile = {
    name: string;
    path: string;
  };

  const uploadFolder = async (folder: TFile, parentFolder?: string) => {
    return await dataProvider.uploadDocument({
      name: folder.name,
      type: "folder",
      version: 1,
      parent: parentFolder,
      header: folder.name,
      description: "",
      langCode: baseLanguage,
      content: [],
      media: [],
    });
  };

  const uploadDocuemnt = async (
    file: TFile,
    content: UniversalBlock[] = [],
    language?: string,
    originId?: string,
  ) => {
    return await dataProvider.uploadDocument({
      name: file.name,
      type: "document",
      version: 1,
      parent: parentFolder,
      originId: originId,
      header: file.name,
      description: "",
      langCode: language || baseLanguage,
      content: content,
      media: [],
    });
  };

  const readFile = (file: TFile) => {
    return fs.readFileSync(file.path, "utf8");
  };

  const getExtension = (file: TFile) => {
    return path.extname(file.name).slice(1);
  };

  const translateFile = async (file: TFile, originId?: string) => {
    if (!originId) {
      throw new Error("Cannot translate file without originId");
    }

    await Promise.all(
      languages.map(async (language) => {
        const newPath = file.path.replace(`/${baseLanguage}/`, `/${language}/`);

        if (!fs.existsSync(newPath)) return;

        await processMdFile(
          {
            name: file.name,
            path: newPath,
          },
          language,
          originId,
        );
      }),
    );
  };

  const processMdFile = async (
    file: TFile,
    language?: string,
    originId?: string,
  ): Promise<DocumentItem> => {
    const content = readFile(file);
    const blocks = transformMarkdown(content);
    return await uploadDocuemnt(file, blocks, language, originId);
  };

  const handleFile = async (file: TFile) => {
    const extension = getExtension(file);

    if (extension === "md") {
      const document = await processMdFile(file);
      await translateFile(file, document.id);
    }
  };

  const handleFolder = async (folder: TFile) => {
    const newFolder = await uploadFolder(folder, parentFolder);

    // recursively import nested folders
    await importFiles(
      path.join(dir, folder.name),
      baseLanguage,
      languages,
      newFolder.id,
    );
  };

  for await (const file of await fs.promises.opendir(dir)) {
    const tFile: TFile = {
      name: file.name,
      path: path.join(dir, file.name),
    };

    if (file.isDirectory()) {
      await handleFolder(tFile);
    } else if (file.isFile()) {
      await handleFile(tFile);
    }
  }
}
