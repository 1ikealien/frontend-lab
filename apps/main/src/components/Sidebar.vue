<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
<template>
  <aside class="aside">
    <RouterLink to="/home">Home</RouterLink>
    <RouterLink to="/resume">Resume</RouterLink>
    <RouterLink to="/projects">Projects</RouterLink>
    <RouterLink to="/techLab">Tech Lab</RouterLink>
  </aside>
</template>

<style scoped lang="scss">
.aside {
  height: 100%;
  padding: 20px 12px;

  a {
    display: block;
    margin: 8px 0;
  }
}
</style>