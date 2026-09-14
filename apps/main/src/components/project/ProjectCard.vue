<script setup lang="ts">
const props = defineProps<{
  name: string
  description: string
  techStack: string[]
  github: string
  features: string[]
}>()
</script>

<template>
  <div class="projectCard">
    <h2>{{ props.name }}</h2>
    <p>{{ props.description }}</p>
    <h3>技术栈</h3>
    <ul>
      <li
        v-for="item in props.techStack"
        :key="item"
      >{{ item }}</li>
    </ul>
    <a
      :href="props.github"
      target="_blank"
      rel="noopener noreferrer"
    >GitHub</a>
    <h3>功能</h3>
    <ul>
      <li
        v-for="feature in props.features"
        :key="feature"
      >{{ feature }}</li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.projectCard {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;

  ul {
    padding-left: 20px;
  }
}
</style>