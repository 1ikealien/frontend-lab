<script setup lang="ts">
import { techLabData } from '@/data/techLab'
import TechCard from '@/components/techLab/TechCard.vue'
</script>
<template>
  <div class="techLab">
    <TechCard
      v-for="item in techLabData"
      :key="item.name"
      :name="item.name"
      :description="item.description"
      :techStack="item.techStack"
      :demo="item.demo"
      :features="item.features"
    />
  </div>
</template>

<style scoped lang="scss">
.techLab {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

@media (max-width: 768px) {
  .techLab {
    grid-template-columns: 1fr;
  }
}
</style>