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
    <button @click="changeName('小红')">修改用户名</button>
  </header>
</template>

<style scoped lang="scss">
.header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
}
</style>