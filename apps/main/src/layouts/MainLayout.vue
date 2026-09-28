<script setup lang="ts">
import Header from '@/components/Header.vue'
import Sidebar from '@/components/Sidebar.vue'
import Footer from '@/components/Footer.vue'
import { RouterView } from 'vue-router'
import { watch } from 'vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

watch(
  () => appStore.theme,
  (theme) => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  },
  { immediate: true }
)
</script>

<template>
  <div class="main-layout">
    <Header />

    <div class="layout-middle">
      <Sidebar />

      <main class="main-content">
        <RouterView />
        <div id="subapp-container"></div>
      </main>
    </div>

    <Footer />
  </div>
</template>

<style scoped lang="scss">
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

.layout-middle {
  display: flex;
  flex: 1;
  min-height: 0;
}

.main-content {
  flex: 1;
  min-width: 0;
  padding: 24px;
  box-sizing: border-box;
  overflow: auto;
}
</style>