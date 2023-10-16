import MenuExtEdit from './EditMenu.vue';
import Block from './Block.vue';
import { BlockMedium } from './types';
import { BlockPlugin } from 'vue-blockful-editor';

const name = 'medium';
const emptyData: BlockMedium = {
  type: name,
  data: {},
};

export const PluginMedium: BlockPlugin = {
  name: name,
  block: Block,
  emptyBlock: () => emptyData,
  menuExtension: {
    addMenuEntry: {
      icon: 'fa-solid fa-image',
      label: 'Medium',
    },
    editMenuTemplate: MenuExtEdit,
  },
};
