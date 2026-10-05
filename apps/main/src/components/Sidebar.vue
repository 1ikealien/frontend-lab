<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <aside class="aside">
    <el-menu
      :default-active="route.path"
      router
      class="sidebar-menu"
    >
      <el-menu-item index="/home">
        <span>Home</span>
      </el-menu-item>

      <el-menu-item index="/resume">
        <span>Resume</span>
      </el-menu-item>

      <el-menu-item index="/projects">
        <span>Projects</span>
      </el-menu-item>

      <el-sub-menu index="tech-lab">
        <template #title>
          <span>Tech Lab</span>
        </template>

        <el-menu-item index="/lab/upload">
          File Upload
        </el-menu-item>

        <el-menu-item index="/lab/form">
          Form Builder
        </el-menu-item>

        <el-menu-item index="/lab/worker">
          Web Worker
        </el-menu-item>

        <el-menu-item index="/lab/canvas">
          Canvas
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </aside>
</template>

<style scoped lang="scss">
.aside {
  width: 220px;
  height: 100%;
  padding: 16px 12px;
  box-sizing: border-box;
  border-right: 1px solid #ebeef5;
  background: #ffffff;

  .sidebar-menu {
    border-right: none;
  }
}
</style>