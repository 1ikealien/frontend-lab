<script setup lang="ts">
const props = defineProps<{
  experiences: {
    company: string
    position: string
    date: string
    responsibilities: string[]
  }[]
}>()
</script>
<template>
  <section class="experience">
    <h2>实习经历</h2>

    <article
      class="experience-item"
      v-for="experience in props.experiences"
      :key="experience.company"
    >
      <h3>{{ experience.company }}</h3>
      <p>{{ experience.position }}</p>
      <p>{{ experience.date }}</p>
      <ul>
        <li
          v-for="responsibility in experience.responsibilities"
          :key="responsibility"
        >
          {{ responsibility }}
        </li>
      </ul>
    </article>

  </section>
</template>

<style scoped lang="scss">
.experience {
  max-width: 800px;
  margin: 40px auto 0;

  h3 {
    font-size: 20px;
  }

  .experience-item {
    margin-top: 24px;
  }
}
</style>