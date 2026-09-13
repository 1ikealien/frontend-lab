<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
<template>
  <div class="home">
    <section class="hero">
      <p class="hero-label">PERSONAL FRONTEND LAB</p>
      <h1>Frontend Lab</h1>
      <p class="hero-description">个人前端技术实验室</p>
      <p class="hero-intro">用于学习、实践和记录现代前端技术</p>
      <p class="hero-tech">Vue 3 · TypeScript · Vite · Qiankun</p>
    </section>

    <section class="experiments">
      <h2>技术实验</h2>
      <p>通过实际项目学习和实践前端技术</p>

      <div class="experiment-grid">
        <RouterLink
          to="/techLab"
          class="experiment-card"
        >
          <h3>File Upload</h3>
          <p>分片上传、断点续传、秒传与并发控制实验</p>
        </RouterLink>
        <div class="experiment-card">
          <h3>Form Builder</h3>
          <p>动态表单、组件配置与Schema 驱动实验</p>
        </div>
        <div class="experiment-card">
          <h3>Web Worker</h3>
          <p>Worker、多线程计算与前端性能试验</p>
        </div>
        <div class="experiment-card">
          <h3>Canvas</h3>
          <p>Canvas 绘画、Pointer Events 与历史记录实验</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.home {
  padding: 40px 20px;

  .hero {
    max-width: 800px;
    text-align: center;
    margin: 80px auto 0;

    .hero-label {
      font-size: 12px;
      color: #868686;
    }

    h1 {
      font-size: 48px;
      margin: 16px 0;
    }

    .hero-description {
      font-size: 20px;
    }

    p {
      margin: 8px 0;
    }
  }

  .experiments {
    .experiment-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;

      .experiment-card {
        display: block;
        padding: 24px;
        border: 1px solid #ddd;
        border-radius: 8px;
        text-decoration: none;
        color: inherit;
        cursor: pointer;
        transition: transform 0.2s ease;

        &:hover {
          transform: translateY(-4px);
        }

        h3 {
          margin: 0 0 12px;
          font-size: 20px;
        }

        p {
          margin: 0;
          color: #666;
          line-height: 1.6;
        }
      }
    }

    @media (max-width: 768px) {
      .experiment-grid {
        grid-template-columns: 1fr;
      }
    }
  }
}
</style>
