<script setup lang="ts">
import { projectsData } from '@/data/projects'
import ProjectCard from '@/components/project/ProjectCard.vue'
</script>

<template>
  <div class="projects">
    <ProjectCard
      v-for="item in projectsData"
      :key="item.name"
      :name="item.name"
      :description="item.description"
      :techStack="item.techStack"
      :github="item.github"
      :features="item.features"
    />
  </div>
</template>

<style scoped lang="scss">
.projects {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

@media (max-width: 768px) {
  .projects {
    grid-template-columns: 1fr;
  }
}
</style>