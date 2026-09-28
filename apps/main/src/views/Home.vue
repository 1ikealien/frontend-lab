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

      <div class="hero-actions">
        <RouterLink to="/techLab">
          <el-button
            type="primary"
            size="large"
          >
            开始探索
          </el-button>
        </RouterLink>

        <el-button size="large">
          GitHub
        </el-button>
      </div>
    </section>

    <section class="experiments">
      <h2>技术实验</h2>
      <p>通过实际项目学习和实践前端技术</p>

      <div class="experiment-grid">
        <RouterLink
          to="/lab/upload"
          class="experiment-link"
        >
          <el-card
            class="experiment-card"
            shadow="hover"
          >
            <div class="experiment-card__header">
              <h3>File Upload</h3>
              <el-tag type="success">Demo</el-tag>
            </div>

            <p>分片上传、断点续传、秒传与并发控制实验</p>

            <span class="experiment-card__action">
              查看 Demo ->
            </span>
          </el-card>
        </RouterLink>

        <RouterLink
          to="/lab/form"
          class="experiment-link"
        >
          <el-card
            class="experiment-card"
            shadow="hover"
          >
            <div class="experiment-card__header">
              <h3>Form Builder</h3>
              <el-tag type="success">Demo</el-tag>
            </div>

            <p>动态表单、组件配置与 Schema 驱动实验</p>

            <span class="experiment-card__action">
              查看 Demo ->
            </span>
          </el-card>
        </RouterLink>

        <el-card
          class="experiment-card"
          shadow="hover"
        >
          <div class="experiment-card__header">
            <h3>Web Worker</h3>
            <el-tag>Experiment</el-tag>
          </div>

          <p>Worker、多线程计算与前端性能实验</p>
        </el-card>

        <el-card
          class="experiment-card"
          shadow="hover"
        >
          <div class="experiment-card__header">
            <h3>Canvas</h3>
            <el-tag>Experiment</el-tag>
          </div>

          <p>Canvas 绘画、Pointer Events 与历史记录实验</p>
        </el-card>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.home {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 32px 80px;
  box-sizing: border-box;

  .hero {
    max-width: 820px;
    text-align: center;
    margin: 72px auto 0;

    .hero-label {
      margin: 0 0 16px;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.16em;
      color: var(--el-color-primary);
    }

    h1 {
      margin: 0;
      font-size: clamp(42px, 6vw, 64px);
      line-height: 1.1;
      letter-spacing: -0.03em;
    }

    .hero-description {
      margin-top: 20px;
      font-size: 22px;
      color: #303133;
    }

    .hero-intro {
      margin-top: 12px;
      color: #909399;
      line-height: 1.7;
    }

    .hero-tech {
      margin-top: 20px;
      color: #606266;
      font-size: 14px;
    }

    p {
      margin: 8px 0;
    }

    .hero-actions {
      display: flex;
      justify-content: center;
      gap: 12px;
      margin-top: 28px;
    }
  }

  .experiments {
    margin-top: 96px;

    >h2 {
      margin: 0;
      font-size: 28px;
      line-height: 1.3;
    }

    >p {
      margin: 10px 0 28px;
      color: #909399;
    }

    .experiment-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;

      .experiment-link {
        display: block;
        text-decoration: none;
        color: inherit;
      }

      .experiment-card {
        height: 100%;
        border-radius: 12px;

        :deep(.el-card__body) {
          height: 100%;
          box-sizing: border-box;
        }

        .experiment-card__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;

          h3 {
            margin: 0;
            font-size: 20px;
          }
        }

        p {
          margin: 16px 0;
          color: #666;
          line-height: 1.6;
        }

        .experiment-card__action {
          display: inline-block;
          color: var(--el-color-primary);
          font-size: 14px;
          font-weight: 500;
        }
      }
    }

    @media (max-width: 768px) {
      .home {
        padding: 32px 20px 56px;
      }

      .hero {
        margin-top: 40px;
      }

      .hero-actions {
        flex-direction: column;
        align-items: stretch;

        :deep(.el-button) {
          width: 100%;
        }
      }

      .experiments {
        margin-top: 64px;
      }

      .experiment-grid {
        grid-template-columns: 1fr;
      }
    }
  }
}
</style>
