<script setup lang="ts">
const props = defineProps<{
  skills: string[]
}>()
</script>
<template>
  <section class="skills">
    <h2>技术栈</h2>
    <ul>
      <li
        v-for="skill in props.skills"
        :key="skill"
      >{{ skill }}</li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.skills {
  max-width: 800px;
  margin: 40px auto 0;

  ul {
    padding-left: 20px;
  }
}
</style>
