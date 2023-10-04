import { DocumentItem, DocumentTreeItem } from '../../src/services/data/types';
import { dataProvider } from '../../src/services/data';

export const vitepressDataProvider = dataProvider;

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
}

let pagesCache: { list: Page[]; tree: Page[] };

export const loadPages = async () => {
  if (pagesCache) return pagesCache;

  const { tree, list } = await vitepressDataProvider.getDocuments();

  const getPath = (item: DocumentItem): string => {
    const parent = item.parent && list.find((i) => i.id === item.parent);
    const myPathPart = '/' + toUrl(item.name);

    if (parent) {
      return getPath(parent) + myPathPart;
    } else {
      return myPathPart;
    }
  };

  const mapItem = (item: DocumentItem): Page => ({
    doc: item,
    name: item.name,
    path: /*(item.langCode ?? '')*/ 'en' + getPath(item),
  });

  const mapTreeItem = (item: DocumentTreeItem): Page => ({
    ...mapItem(item),
    children: item.children && item.children.map(mapTreeItem),
  });

  pagesCache = {
    list: list.map(mapItem),
    tree: tree.map(mapTreeItem),
  };

  return pagesCache;
};
