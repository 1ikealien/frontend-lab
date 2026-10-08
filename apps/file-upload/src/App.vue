<script setup lang="ts">
import UploadPanel from '@/components/UploadPanel.vue'
</script>

<template>
  <main class="upload-page">
    <section class="page-header">
      <div>
        <h1>大文件上传</h1>
        <p>基于分片上传、断点续传、秒传、并发控制与 Worker 实现的大文件分片上传系统</p>
      </div>
    </section>
    <UploadPanel />
  </main>
</template>

<style scoped lang="scss">
.upload-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  box-sizing: border-box;
}

.page-header {
  margin-bottom: 24px;

  h1 {
    margin: 0 0 8px;
    font-size: 28px;
    font-weight: 600;
    color: #303133;
  }

  p {
    margin: 0;
    color: #909399;
    font-size: 14px;
    line-height: 1.6;
  }
}
</style>