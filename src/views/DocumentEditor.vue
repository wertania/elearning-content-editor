<template>
    <Toolbar>
        <template #start>
            <Button label="Load" class="mr-2" @click="loadDocument()" :disabled="selectedDocumentId == null"
                severity="warning" />
            <Button label="New" class="mr-2" @click="addDocument()" severity="success" />
        </template>

        <template #end>
            <Button label="Save" class="mr-2" severity="success" @click="saveDocument()" />
        </template>
    </Toolbar>
    <div class="grid" style="display: flex;">
        <!-- display:flex war nötig, weil tailwind styles die primeflex styles kaputt machen... -->
        <div class="col-4">
            <Tree selectionMode="single" v-model:selectionKeys="selectedDocumentId" :value="documentStore.documentTree"
                @node-select="selectTreeItem"></Tree>
        </div>
        <div class="col-8">
            <MetaData v-if="selectedDocument != null" v-model:header="selectedDocument.header"
                v-model:description="selectedDocument.description" v-model:lang-code="selectedDocument.langCode"
                v-model:name="selectedDocument.name" />
            <!-- mehr abstand hier...-->
            <BlockEditor v-model="editorData" :readOnly="false" :debug="false" :plugins="plugins"
                :showAllBlockControls="true" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue';
import { BlockEditor, PluginHeader, PluginParagraph, BlockPage } from 'vue-blockful-editor';
import Tree from 'primevue/tree';
import { useDocumentStore } from '../stores/documents';
import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';
import MetaData from '../components/MetaData.vue';
import { DocumentItem } from '../services/data/types';
import { guid } from "../services/guid";
import PlugnVideo from "./../services/blocks/video";

// block editor plugins
const plugins = [
    PluginParagraph,
    PluginHeader,
    PlugnVideo, // custom block zum speichern der video url.
    // hier fehlt noch der markdown block. die anderen sind unrelevant. => https://thieleundklose.atlassian.net/browse/HH-390
];

// tree data
const documentStore = useDocumentStore();
const selectedDocumentId: Ref<null | string> = ref(null);
const selectedDocument: Ref<null | DocumentItem> = ref(null);

const selectTreeItem = (event: any) => {
    // not needed, because of v-model:selectionKeys="selectedDocument"
    console.log(event);
};

// document handling
const mode: Ref<'new' | 'edit'> = ref('new');

/**
 * Asynchronously load a document from API.
 */
const loadDocument = async () => {
    if (selectedDocumentId.value == null || Object.keys(selectedDocumentId.value).length === 0) {
        return;
    }
    mode.value = 'edit';
    const id = Object.keys(selectedDocumentId.value)[0];
    console.log('load document', id);
    selectedDocument.value = await documentStore.getDocument(id);
    editorData.value.blocks = selectedDocument.value.content;
};

/**
 * Add a new document.
 */
const addDocument = async () => {
    mode.value = 'new';
    selectedItem.value = null;
    editorData.value.blocks = [];
    selectedDocument.value = {
        version: 1,
        type: "document",
        parent: null, // hier müsste selectedItem.value.key rein
        id: guid(),
        name: 'New_Document',
        header: 'New_Document',
        description: '',
        langCode: 'de',
        content: [
            {
                type: "paragraph",
                data: {
                    text: "Some text here...",
                },
            }
        ],
        icon: 'fa-solid fa-file',
    }
    editorData.value.blocks = selectedDocument.value.content;
};

/**
 * Save the current document depending on the mode.
 */
const saveDocument = async () => {
    if (selectedDocument.value == null) {
        return;
    }
    if (mode.value === 'new') {
        await documentStore.addDocument(selectedDocument.value);
    } else {
        await documentStore.updateDocument(selectedDocument.value);
    }
    selectedDocument.value = null;
    editorData.value.blocks = [];
};

// interactive editor state
const editorData: Ref<BlockPage> = ref({
    blocks: [],
});


</script>

<style>
@import 'vue-blockful-editor/style.css';
/**
die styles hier machen die primeVue button styles etc. kaputt :-(
das muss irgendwie besser gehen
Ideal wäre es, die Tailwind Classes aus vue-blockful-editor mit einem präfix zu versehen direkt im package selbst... "vbe-" oder so
*/

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