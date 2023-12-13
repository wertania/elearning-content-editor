import MenuExtEdit from './EditMenu.vue';
import Block from './Block.vue';
import { BlockPdf } from './types';
import { BlockPlugin } from 'vue-blockful-editor';

const name = 'pdf';
const emptyData: BlockPdf = {
  type: name,
  data: {},
};

export const PluginPdf: BlockPlugin = {
  name,
  block: Block,
  emptyBlock: () => emptyData,
  menuExtension: {
    addMenuEntry: {
      icon: 'fa-solid fa-file-pdf',
      label: 'PDF',
    },
    editMenuTemplate: MenuExtEdit,
  },
};
