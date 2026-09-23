<script setup lang="ts">
import type { FieldType } from '@/types/form'

interface Material {
  type: FieldType
  label: string
}

const materials: Material[] = [
  {
    type: 'input',
    label: '输入框',
  },
  {
    type: 'select',
    label: '下拉选择',
  },
  {
    type: 'radio',
    label: '单选框',
  },
  {
    type: 'checkbox',
    label: '复选框',
  },
  {
    type: 'date',
    label: '日期选择'
  },
]

const emit = defineEmits<{
  add: [type: FieldType]
}>()
</script>

<template>
  <aside class="material-panel">
    <h3>组件</h3>
    <div
      v-for="material in materials"
      :key="material.type"
      class="material-item"
      @click="emit('add', material.type)"
    >
      {{ material.label }}
    </div>
  </aside>
</template>