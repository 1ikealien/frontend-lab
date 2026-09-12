<script setup lang="ts">
import Header from '@/components/Header.vue'
import Sidebar from '@/components/Sidebar.vue'
import Footer from '@/components/Footer.vue'
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="main-layout">
    <Header></Header>
    <div class="layout-middle">
      <div class="content-left">
        <Sidebar class="sidebar"></Sidebar>
      </div>
      <main class="main-content">
        <RouterView />
      </main>
    </div>
    <Footer></Footer>
  </div>
</template>

<style>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout-middle {
  display: flex;
  flex: 1;
}

.main-content {
  flex: 1;
  padding: 16px;
}
</style>