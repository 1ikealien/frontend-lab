<script setup lang="ts">
import { ref } from 'vue'

const file = ref<File | null>(null)

function handleChange(event: Event) {
  const target = event.target as HTMLInputElement
  const selectedFile = target.files?.[0]

  if (selectedFile) {
    file.value = selectedFile
  }
}

function formatSize(size: number) {
  if (size < 1024) {
    return size + ' B'
  }

  if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + 'KB'
  }

  return (size / 1024 / 1024).toFixed(2) + ' MB'
}

function clearFile() {
  file.value = null
}
</script>

<template>
  <input
    type="file"
    @change="handleChange"
  >

  <div v-if="file">
    <p>文件名：{{ file.name }}</p>
    <p>文件大小：{{ formatSize(file.size) }}</p>
    <p>文件类型：{{ file.type }}</p>
  </div>

  <button
    v-if="file"
    @click="clearFile"
  >清除文件</button>
</template>