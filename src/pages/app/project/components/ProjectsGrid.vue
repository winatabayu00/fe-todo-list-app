<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <ProjectCard
      v-for="project in projects"
      :key="project.id"
      :project="project"
      @edit="$emit('edit', project)"
      @delete="$emit('delete', project.id)"
      @restore="$emit('restore', project.id)"
    />
  </div>
</template>

<script setup lang="ts">
import type { Project } from '../Projects'
import ProjectCard from './ProjectCard.vue'

defineProps<{ projects: Project[] }>()
defineEmits<{
  edit: [project: Project]
  delete: [id: string]
  restore: [id: string]
}>()
</script>

