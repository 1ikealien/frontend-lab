<script setup lang="ts">
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

const changeName = (text: string) => {
  appStore.setUserName(text)
}
</script>
<template>
  <header class="header">
    <h2>{{ appStore.displayName }}</h2>
    <div class="header-actions">
      <el-button @click="changeName('小红')">修改用户名</el-button>
      <el-button
        circle
        @click="appStore.toggleTheme"
      >
        {{ appStore.theme === 'light' ? '🌙' : '☀️' }}
      </el-button>
    </div>
  </header>
</template>

<style scoped lang="scss">
.header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-sizing: border-box;
  border-bottom: 1px solid #ebeef5;
  background: #ffffff;

  h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }
}
</style>