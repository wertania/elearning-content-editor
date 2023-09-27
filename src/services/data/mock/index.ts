import { DocumentItem } from '../types';

const mdData = `# Write your markdown here...

Ich bin ein Paragraph.

\`\`\`ts
let x = 42;
\`\`\`

**I am bold.**
*I am italic now.*

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

/**
 * Diese Daten sollen den originalen Daten entsprechen, die in einer DB lagern.
 * Die Daten liegen flach in der DB und können über id und parent id verknüpft werden
 */
export const mockData: DocumentItem[] = [
  {
    version: 1,
    id: '1',
    // originId: null,
    type: 'document',
    parent: '3',
    name: 'Document 1',
    header: 'This is the first document',
    description: 'This is a short description of the first document',
    langCode: 'de',
    content: [
      {
        type: 'paragraph',
        data: { text: 'This is the first paragraph of the first document' },
      },
      {
        type: 'paragraph',
        data: { text: 'This is the second paragraph of the first document' },
      },
    ],
  },
  {
    version: 1,
    id: '2',
    // originId: null,
    type: 'document',
    // parent: null,
    name: 'Document 2',
    header: 'This is the second document',
    description: 'This is a short description of the second document',
    langCode: 'de',
    content: [
      {
        type: 'paragraph',
        data: { text: 'This is the first paragraph of the second document' },
      },
      {
        type: 'markdown',
        data: {
          code: mdData,
        },
      },
    ],
  },
  {
    version: 1,
    id: '3',
    // originId: null,
    type: 'folder',
    // parent: null,
    name: 'Folder 1',
    header: 'This is the first folder',
    description: 'This is a short description of the first folder',
    langCode: 'de',
    content: [],
  },
  {
    version: 1,
    id: '4',
    // originId: null,
    type: 'folder',
    parent: '3',
    name: 'Folder 2',
    header: 'This is the second folder',
    description: 'This is a short description of the second folder',
    langCode: 'de',
    content: [],
  },
  {
    version: 1,
    id: '5',
    // originId: null,
    type: 'document',
    parent: '4',
    name: 'Document 3',
    header: 'This is the third document',
    description: 'This is a short description of the third document',
    langCode: 'de',
    content: [
      {
        type: 'paragraph',
        data: { text: 'This is the first paragraph of the third document' },
      },
      {
        type: 'paragraph',
        data: { text: 'This is the second paragraph of the third document' },
      },
    ],
  },
];
