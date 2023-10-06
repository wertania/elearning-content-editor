<script setup>
    import MediaViewer from "/components/media-viewer.vue"
    import UsersActivity from "/components/users-activity.vue"
    // the components will be uses inside the renderMardownfunction which runs before that here
    import { useData } from 'vitepress'

    // All used Vue components have to imported here.
    import Medium from "@/components/Medium.vue"

  // These params are collected and used in `renderMarkdown.ts`.
  const { params } = useData()
</script>

# {{ $params.name }}

The content goes here:

<!-- @content -->
