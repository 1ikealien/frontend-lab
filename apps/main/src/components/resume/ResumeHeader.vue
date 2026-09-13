<script setup lang="ts">
const props = defineProps<{
  name: string
  job: string
  github: string
}>()
</script>

<template>
  <header class="resume-header">
    <h1>{{ props.name }}</h1>
    <p>{{ props.job }}</p>
    <a
      :href="props.github"
      target="_blank"
      rel="noopener noreferrer"
    >
      GitHub
    </a>
  </header>
</template>

<style scoped lang="scss">
.resume-header {
  max-width: 800px;
  margin: 15px auto 0;
  text-align: center;

  h1 {
    font-size: 40px;
  }
}
</style>