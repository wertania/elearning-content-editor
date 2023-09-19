import MenuExtEdit from "./menu-ext-edit.vue";
import Block from "./block.vue";
import { BlockVideo } from "./types";
import { BlockPlugin } from "vue-blockful-editor";

const name = "video";
const emptyData: BlockVideo = {
  type: name,
  // style: {
  //   spaceTop: 0,
  //   spaceBottom: 0,
  // },
  data: {
    src: "",
  },
};

export default <BlockPlugin> {
  name: name,
  block: Block,
  emptyBlock: () => emptyData,
  menuExtension: {
    addMenuEntry: {
      icon: "fa-solid fa-video",
      label: "Video",
    },
    editMenuTemplate: MenuExtEdit,
  },
};
