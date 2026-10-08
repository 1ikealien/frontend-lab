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

function selectFiles() {
  fileInput.value?.click()
}
</script>

<template>
  <div class="upload-panel">

    <div class="toolbar">
      <input
        ref="fileInput"
        class="file-input"
        type="file"
        multiple
        @change="handleChange"
      >

      <el-button
        type="primary"
        @click="selectFiles"
      >
        选择文件
      </el-button>

      <el-button
        v-if="files.length"
        type="success"
        @click="testUpload"
      >
        开始上传
      </el-button>

      <el-button
        v-if="files.length"
        @click="clearFiles"
      >
        清除文件
      </el-button>
    </div>


    <div
      v-if="files.length"
      class="file-list"
    >

      <el-card
        v-for="file in files"
        :key="file.hash"
        class="file-card"
      >

        <div class="file-header">

          <div class="file-meta">
            <h3>
              {{ file.file.name }}
            </h3>

            <p>
              {{ formatSize(file.file.size) }}
            </p>
          </div>

          <div class="file-actions">
            <el-tag :type="file.status === 'success'
              ? 'success'
              : file.status === 'uploading'
                ? 'primary'
                : file.status === 'error'
                  ? 'danger'
                  : 'info'
              ">
              {{ formatStatus(file.status) }}
            </el-tag>

            <el-button
              v-if="file.status === 'uploading' || file.paused"
              size="small"
              @click="handlePause(file)"
            >
              {{ file.paused ? '继续' : '暂停' }}
            </el-button>
          </div>

        </div>


        <div class="progress-wrapper">
          <el-progress
            :percentage="file.progress"
            :stroke-width="8"
          />

          <span class="progress-text">
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


        <el-collapse>
          <el-collapse-item
            title="查看分片详情"
            name="chunks"
          >
            <div
              v-for="chunk in file.chunks"
              :key="chunk.index"
              class="chunk-item"
            >
              <p>
                第 {{ chunk.index + 1 }} 片
              </p>

              <p>
                大小：
                {{ formatSize(chunk.chunk.size) }}
              </p>

              <p>
                状态：
                {{ chunk.status }}
              </p>

              <p>
                Hash：
                {{ chunk.hash }}
              </p>
            </div>
          </el-collapse-item>
        </el-collapse>


      </el-card>

    </div>

  </div>
</template>

<style scoped lang="scss">
.upload-panel {
  padding: 20px;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.file-input {
  display: none;
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.file-card {
  border-radius: 10px;
}

.file-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.file-meta {
  min-width: 0;

  h3 {
    margin: 0 0 6px;
    font-size: 16px;
    font-weight: 600;
    color: #303133;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  p {
    margin: 0;
    color: #909399;
    font-size: 13px;
  }
}

.file-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.progress-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-wrapper :deep(.el-progress) {
  flex: 1;
}

.progress-text {
  min-width: 45px;
  text-align: right;
}

.info {
  margin-top: 12px;
}

.chunk-item {
  padding: 10px 0;

  &+.chunk-item {
    border-top: 1px solid #ebeef5;
  }

  p {
    margin: 4px 0;
    color: #606266;
    font-size: 13px;
  }
}
</style>