<script setup lang="ts">
const props = defineProps<{
  name: string
  description: string
  techStack: string[]
  demo: string
  features: string[]
}>()
</script>

<template>
  <div class="techCard">
    <h2>{{ props.name }}</h2>
    <p>{{ props.description }}</p>
    <h3>技术栈</h3>
    <ul>
      <li
        v-for="stack in props.techStack"
        :key="stack"
      >{{ stack }}</li>
    </ul>
    <!-- <a :href="props.demo">url</a> -->
    <RouterLink
      class="demo-link"
      :to="props.demo"
    >打开实验</RouterLink>
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
.techCard {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-4px);
  }

  .demo-link {
    display: inline-block;
    margin: 12px 0;
    text-decoration: none;
  }

  ul {
    padding-left: 20px;
  }
}
</style>