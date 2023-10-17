// import MenuExtEdit from './EditMenu.vue';
import Block from './Block.vue';
import { BlockMarkdown } from './types';
import { BlockPlugin } from 'vue-blockful-editor';

const name = 'markdown';
const emptyData: BlockMarkdown = {
  type: name,
  data: {
    code: '# A Markdown Block\n\nWrite your markdown code here...',
  },
};

export const PluginMarkdown: BlockPlugin = {
  name: name,
  block: Block,
  emptyBlock: () => emptyData,
  menuExtension: {
    addMenuEntry: {
      icon: 'fa-solid fa-code',
      label: 'Markdown',
    },
    // editMenuTemplate: MenuExtEdit,
  },
};
