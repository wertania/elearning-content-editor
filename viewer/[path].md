<script setup>
    import MediaViewer from "/components/media-viewer.vue"
    import UsersActivity from "/components/users-activity.vue"
    import PdfDownload from "/components/pdf-download.vue"
    // the components will be uses inside the renderMardownfunction which runs before that here
    import { useData } from 'vitepress'

  // These params are collected and used in `renderMarkdown.ts`.
  const { params } = useData()
</script>

<UsersActivity :documentId="$params.documentId" />

# {{ $params.name }}

<!-- CONTENT AREA -->
<!-- @content -->
