import type { DocumentItem, DocumentTreeItem } from 'src/services/data/types';
import { vitepressDataProvider } from './vitepressDataService';
import { writeFileSync } from 'fs';

const baseLang = process.env.VITE_BASE_LANGUAGE || 'en';

/**
 * Converts a string to a part of a URL.
 * @example toUrl("My Folder 1") === "my-folder-1"
 */
const toUrl = (text: string) =>
  text
    .split('')
    .filter((s) => /[\da-zA-Z0-9\s]/.test(s))
    .join('')
    .split(/\s+/g)
    .map((s) => s.toLowerCase())
    .join('-');

export interface Page {
  name: string;
  path: string;
  doc: DocumentItem;
  children?: Page[];
  isTopic: boolean;
}

// internal simple cache
let pagesCache: { list: Page[]; tree: Page[]; availableLanguages: string[] };

export const loadPages = async () => {
  // check cache first!
  if (pagesCache) return pagesCache;

  // get tree and list for base language. this will build the main tree also
  const base = await vitepressDataProvider.getDocuments({
    langCodes: [baseLang],
  });

  // get full list of all non-base-language documents
  // and create a dict with [originId + langCode] as key
  const allWithOrigin = await vitepressDataProvider.getDocuments({
    hasOrigin: true,
  });
  // extract all possible language codes from allWithOrigin list
  const allLangCodes = allWithOrigin.list.map((item) => item.langCode);
  // create list without baseLang inside (only to be sure to have no duplicates later)
  const additionalLanguages = allLangCodes.filter((lang) => lang !== baseLang);

  let dictWithOriginAndLangCode: { [id: string]: DocumentItem } = {};
  // form list to dictionary with id as key
  dictWithOriginAndLangCode = allWithOrigin.list.reduce(
    (acc, item) => {
      acc[item.originId + '_' + item.langCode] = item;
      return acc;
    },
    {} as { [id: string]: DocumentItem },
  );

  // --------------------------------
  // define some internal helpers to map the tree to an navigation tree
  const getPath = (item: DocumentItem): string => {
    const parent = item.parent && base.list.find((i) => i.id === item.parent);
    const myPathPart = '/' + toUrl(item.name);

    if (parent) {
      return getPath(parent) + myPathPart;
    } else {
      return myPathPart;
    }
  };
  const mapItem = (item: DocumentItem, langCode?: string): Page => ({
    doc: item,
    name: item.name,
    path: langCode ?? baseLang + getPath(item),
    isTopic: false,
  });
  const mapTreeItem = (item: DocumentTreeItem): Page => ({
    ...mapItem(item),
    children: item.children && item.children.map(mapTreeItem),
  });
  // --------------------------------

  // create main tree and list
  const baseLangList = base.list.map((i) => mapItem(i));
  const baseLangTree = base.tree.map(mapTreeItem);

  // object creator
  const createLanguagePageDummy = (
    langCode: string,
    children?: Page[],
  ): Page => {
    return {
      name: 'Language: ' + langCode.toUpperCase(),
      path: `${langCode}/main`,
      doc: {
        // some empty dummy document
        version: 1,
        id: 'dummy_' + langCode,
        type: 'document',
        name: langCode,
        header: '',
        description: '',
        langCode: langCode,
        content: [
          {
            type: 'paragraph',
            data: { text: '' },
          },
        ],
      },
      children,
      isTopic: true,
    };
  };

  // main tree
  // create a sub-path for each additional language if some languages are available
  const fullTree: Page[] = [];
  if (additionalLanguages.length > 0) {
    // add base language
    fullTree.push(createLanguagePageDummy(baseLang, baseLangTree));
    baseLangList.push(createLanguagePageDummy(baseLang));

    // add additional languages
    // --------------------------------
    // helper to switch one Page to Page with different langCode
    const replaceLangCode = (path: string, langCode: string): string => {
      return path.replace(baseLang + '/', langCode + '/');
    };
    const mapDocItem = (
      item: DocumentItem,
      langCode: string,
      orgPath: string,
    ): Page => ({
      doc: item,
      name: item.name,
      path: replaceLangCode(orgPath, langCode),
      isTopic: false,
    });
    const replaceByTranslated = (item: Page, langCode: string): Page => {
      const itemWithSameOriginId =
        dictWithOriginAndLangCode[item.doc.id + '_' + langCode] ?? null;
      if (itemWithSameOriginId) {
        // replace item
        item = mapDocItem(itemWithSameOriginId, langCode, item.path);
      }
      // else return original item but change the path
      item.path = replaceLangCode(item.path, langCode);
      return item;
    };
    const mapPageTree = (tree: Page[], lang: string) => {
      return tree.map((item) => {
        const newItem = replaceByTranslated(item, lang);
        if (newItem.children) {
          newItem.children = mapPageTree(newItem.children, lang);
        }
        // add also to baseLangList
        baseLangList.push(newItem);
        return newItem;
      });
    };
    // --------------------------------

    for (const lang of additionalLanguages) {
      // browse full tree path and check for each item if there is a item with the same originId in dictWithOriginAndLangCode
      // create a new tree with the found items. if an item is not found, use the baseLang item
      const copyBaseLangTree = JSON.parse(JSON.stringify(baseLangTree));
      const treeForLang = mapPageTree(copyBaseLangTree, lang);
      // add to full tree
      const langPage = createLanguagePageDummy(lang, treeForLang);
      fullTree.push(langPage);
      baseLangList.push(langPage);
    }
  } // simple case: no additional languages
  else {
    fullTree.push(...baseLangTree);
  }

  // debug: write to JSON file
  writeFileSync('./debug.fullTree.json', JSON.stringify(fullTree, null, 2));
  writeFileSync(
    './debug.baseLangList.json',
    JSON.stringify(baseLangList, null, 2),
  );

  // set cache
  pagesCache = {
    list: baseLangList,
    tree: fullTree,
    availableLanguages: [baseLang, ...additionalLanguages],
  };

  return pagesCache;
};
