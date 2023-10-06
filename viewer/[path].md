<script setup>
  import { useData } from 'vitepress'

  // All used Vue components have to imported here.
  import Medium from "@/components/Medium.vue"

  // These params are collected and used in `renderMarkdown.ts`.
  const { params } = useData()
</script>

# {{ $params.name }}

<!-- @content -->
