<script setup lang="ts">
import ResumeHeader from '@/components/resume/ResumeHeader.vue'
import Education from '@/components/resume/Education.vue'
import Skills from '@/components/resume/Skills.vue'
import Experience from '@/components/resume/Experience.vue'
import { resumeData } from '@/data/resume'

</script>
<template>
  <div class="resume">
    <ResumeHeader
      :name="resumeData.name"
      :job="resumeData.job"
      :github="resumeData.github"
    />

    <Education
      :school="resumeData.school"
      :major="resumeData.major"
      :time="resumeData.time"
    />

    <Skills :skills="resumeData.skills" />

    <Experience :experiences="resumeData.experiences" />
  </div>
</template>

<style scoped lang="scss">
.resume {
  padding: 20px 10px;
}
</style>