<script setup lang="ts">
import { ref } from 'vue'
import { formatSize } from '@/utils/format'
import type { UploadFile } from '@/types/file'
import { UploadManager } from '@/services/uploadManager'

const files = ref<UploadFile[]>([])

const uploadManager = new UploadManager()

async function testUpload() {
  if (!files.value.length) return

  for (const file of files.value) {
    if (file.isInstant) {
      console.log(`${file.file.name} 秒传完成`)
      continue
    }
    try {
      await uploadManager.upload(file)
      console.log('全部分片上传成功')
    } catch (error) {
      console.error('文件上传失败', error)
    }
  }
}

function formatStatus(status: UploadFile['status']) {
  const map: Record<UploadFile['status'], string> = {
    ready: '等待上传',
    uploading: '上传中',
    success: '上传成功',
    error: '上传失败',
  }
  return map[status]
}

async function handleChange(event: Event) {
  const target = event.target as HTMLInputElement
  const selectedFiles = target.files

  if (selectedFiles) {
    const newFiles = Array.from(selectedFiles)

    const uploadFiles = await Promise.all(
      newFiles.map((file) => {
        return uploadManager.prepareUploadFile(file)
      })
    )

    uploadFiles.forEach((uploadFile) => {
      const exists = files.value.some(
        (item) => item.hash === uploadFile.hash
      )

      if (!exists) {
        files.value.push(uploadFile)
      }
    })
  }
}

function clearFiles() {
  files.value = []
}
</script>

<template>
  <input
    type="file"
    multiple
    @change="handleChange"
  >

  <div v-if="files.length">
    <div
      v-for="file in files"
      :key="file.hash"
    >
      <p>文件名: {{ file.file.name }}</p>
      <p>文件大小: {{ formatSize(file.file.size) }}</p>
      <p>文件类型: {{ file.file.type }}</p>
      <p>Hash: {{ file.hash }}</p>
      <p>状态: {{ formatStatus(file.status) }}</p>
      <p>进度: {{ file.progress }}%</p>
      <p>分片数量: {{ file.chunks.length }}</p>
      <div>
        <p>分片信息: </p>
        <div
          v-for="chunk in file.chunks"
          :key="chunk.index"
        >
          <p>第 {{ chunk.index + 1 }} 片: {{ formatSize(chunk.chunk.size) }}</p>
          <p>hash: {{ chunk.hash }}</p>
          <p>状态: {{ chunk.status }}</p>
        </div>
      </div>
    </div>
  </div>

  <button
    v-if="files.length"
    @click="clearFiles"
  >
    清除文件
  </button>
  <button
    v-if="files.length"
    @click="testUpload"
  >
    测试上传所有分片
  </button>
</template>