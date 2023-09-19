<template>
    <div class="grid" style="display: flex;">
        <div class="col-4">
            <Tree :value="documentStore.documentTree" v-model="selectedDocument" key="key" @node-select=""></Tree>
        </div>
        <div class="col-8">
            <Toolbar>
                <template #start>
                    <Button label="New" icon="pi pi-plus" class="mr-2" />
                </template>

                <template #end>
                    <Button label="Save" icon="pi pi-plus" class="mr-2" severity="success" />
                </template>
            </Toolbar>
            <BlockEditor v-model="demo" :readOnly="false" :debug="false" :plugins="plugins" :showAllBlockControls="true" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue';
import { BlockEditor, PluginHeader, PluginParagraph, BlockPage } from 'vue-blockful-editor';
import Tree, { TreeNode } from 'primevue/tree';
import { useDocumentStore } from '../stores/documents';
import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';

const selectedDocument = ref(null);

const selectNode = (node: TreeNode) => {
    console.log(node);
}

const documentStore = useDocumentStore();

const plugins = [
    PluginParagraph,
    PluginHeader,
];

const demo: Ref<BlockPage> = ref({
    blocks: [
        {
            type: "header",
            data: {
                text: "Hello World!",
                level: 1,
            },
        },
    ],
});
</script>

<style scoped>
@import 'vue-blockful-editor/style.css';

h1 {
    font-size: 2em;
}

h2 {
    font-size: 1.5em;
}

h3 {
    font-size: 1.17em;
}

h4 {
    font-size: 1em;
}

h5 {
    font-size: 0.83em;
}

h6 {
    font-size: 0.67em;
}
</style>