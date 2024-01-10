<script setup>
  import MediaViewer from "/components/media-viewer.vue"
  import UsersActivity from "/components/users-activity.vue"
  import PdfDownload from "/components/pdf-download.vue"

  /**
   * The components will be used inside the renderMarkdown function which runs before this one.
   * We need to import them here to make sure they are available.
   */

  import { useData } from 'vitepress'

  // These params are collected and used in `renderMarkdown.ts`.
  const { params } = useData()
</script>

<UsersActivity :documentId="$params.documentId" />

<!-- # {{ $params.name }} -->

<!-- CONTENT AREA -->
<!-- @content -->
