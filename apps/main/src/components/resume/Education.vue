<script setup lang="ts">
const props = defineProps<{
  school: string
  major: string
  time: string
}>()
</script>

<template>
  <section class="education">
    <h2>教育经历</h2>
    <p>{{ props.school }}</p>
    <p>{{ props.major }}</p>
    <p>{{ props.time }}</p>
  </section>
</template>

<style scoped lang="scss">
.education {
  max-width: 800px;
  margin: 40px auto 0;

  h2 {
    margin-bottom: 15px;
  }
}
</style>