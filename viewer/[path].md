<script setup>
    import MediaViewer from "/components/media-viewer.vue"
    import UsersActivity from "/components/users-activity.vue"
    // the components will be uses inside the renderMardownfunction which runs before that here
    import { useData } from 'vitepress'

  // These params are collected and used in `renderMarkdown.ts`.
  const { params } = useData()
</script>

# {{ $params.name }}

<!-- CONTENT AREA -->
<!-- @content -->
