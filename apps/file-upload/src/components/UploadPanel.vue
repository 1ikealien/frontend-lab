<script setup lang="ts">
import { ref } from 'vue'
import { formatSize } from '@/utils/format'
import type { UploadFile } from '@/types/file'
import { UploadManager } from '@/services/uploadManager'

const files = ref<UploadFile[]>([])
const fileInput = ref<HTMLInputElement | null>(null)

async function handlePause(file: UploadFile) {
  if (file.paused) {
    file.paused = false

    await uploadManager.upload(file)
  } else {
    file.paused = true
  }
}

const uploadManager = new UploadManager()

async function testUpload() {
  if (!files.value.length) return

  for (const file of files.value) {
    if (file.isInstant) {
      file.status = 'success'
      file.progress = 100
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

  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>

<template>
  <div class="upload-panel">

    <div class="toolbar">
      <input
        ref="fileInput"
        type="file"
        multiple
        @change="handleChange"
      >

      <button
        v-if="files.length"
        @click="testUpload"
      >
        开始上传
      </button>

      <button
        v-if="files.length"
        @click="clearFiles"
      >
        清除文件
      </button>
    </div>


    <div
      v-if="files.length"
      class="file-list"
    >

      <div
        v-for="file in files"
        :key="file.hash"
        class="file-card"
      >

        <div class="file-header">

          <div>
            <h3>
              {{ file.file.name }}
            </h3>

            <p>
              {{ formatSize(file.file.size) }}
            </p>
          </div>

          <div class="file-actions">
            <span
              class="status"
              :class="file.status"
            >
              {{ formatStatus(file.status) }}
            </span>

            <button
              v-if="file.status === 'uploading' || file.paused"
              @click="handlePause(file)"
            >
              {{ file.paused ? '继续' : '暂停' }}
            </button>
          </div>

        </div>


        <div class="progress-wrapper">

          <div class="progress">

            <div
              class="progress-bar"
              :style="{
                width: `${file.progress}%`
              }"
            />

          </div>

          <span>
            {{ file.progress }}%
          </span>

        </div>


        <div class="info">

          <p>
            类型:
            {{ file.file.type || '未知' }}
          </p>

          <p>
            Hash:
            {{ file.hash }}
          </p>

          <p>
            分片数量:
            {{ file.chunks.length }}
          </p>

        </div>


        <details>

          <summary>
            查看分片详情
          </summary>


          <div
            v-for="chunk in file.chunks"
            :key="chunk.index"
            class="chunk-item"
          >

            <p>
              第 {{ chunk.index + 1 }} 片
            </p>

            <p>
              大小:
              {{ formatSize(chunk.chunk.size) }}
            </p>

            <p>
              状态:
              {{ chunk.status }}
            </p>

            <p>
              Hash:
              {{ chunk.hash }}
            </p>

          </div>

        </details>


      </div>

    </div>

  </div>
</template>

<style scoped lang="scss">
.upload-panel {
  padding: 20px;
}


.toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}


button {
  padding: 6px 14px;
  cursor: pointer;
}


.file-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}


.file-card {
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
}


.file-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}


.status.success {
  color: green;
}


.status.uploading {
  color: blue;
}


.status.error {
  color: red;
}


.progress-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}


.progress {
  flex: 1;
  height: 8px;
  background: #eee;
  border-radius: 4px;
  overflow: hidden;
}


.progress-bar {
  height: 100%;
  background: #409eff;
}


.info {
  margin-top: 12px;
}


.chunk-item {
  padding: 8px;
  margin-top: 8px;
  border-top: 1px solid #eee;
}
</style>