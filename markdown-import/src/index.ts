import fs, { Dirent } from "fs";
import type { Root } from "mdast";
import { remark } from "remark";
import remarkParse from "remark-parse";
import { visit } from "unist-util-visit";
import type { UniversalBlock } from "vue-blockful-editor";
import { toString } from "mdast-util-to-string";

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
          // TODO: Create markdown block.
          blocks.push({
            type: "markdown",
            data: {
              code: "", // ...
            },
          });
        }
        break;

      // TODO: More cases.
      // case "image":
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
  mainLanguage: string,
  directory: string,
) {
  const dir = directory + "/" + mainLanguage;
  const languages = fs.readdirSync(directory).filter((file) => {
    return file !== mainLanguage;
  });

  importFiles(dir, mainLanguage, languages);
}

async function importFiles(
  dir: string,
  mainLanguage: string,
  languages: string[] = [],
) {
  const handleFile = async (file: Dirent, isTranslation: boolean = false) => {
    console.log("import file", file.name);

    const extension = file.name.split(".").pop();

    if (extension !== "md") return;

    // const content = await fs.promises.readFile(dir + "/" + file.name, "utf-8");
    // const blocks = transformMarkdown(content);

    // TODO: save to database
    const originId = "TODO";

    if (isTranslation) {
      return;
    }
  
    // check if translation exists in different language
    console.log("Path: ", dir + "/" + file.name);
    
    languages.map((language) => {
      const path = (dir + "/" + file.name).replace(
        `/${mainLanguage}/`,
        `/${language}/`,
      );

      if (fs.existsSync(path)) {
        handleFile(file, true);
      }
    });
  };

  const handleFolder = async (folder: Dirent) => {
    console.log("import folder", folder.name);

    // TODO: save to database

    importFiles(dir + "/" + folder.name, mainLanguage, languages);
  };

  for await (const file of await fs.promises.opendir(dir)) {
    if (file.isDirectory()) {
      handleFolder(file);
    } else if (file.isFile()) {
      handleFile(file);
    }
  }
}
