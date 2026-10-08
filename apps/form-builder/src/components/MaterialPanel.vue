<script setup lang="ts">
import type { FieldType } from '@/types/form'

interface Material {
  type: FieldType
  label: string
  description: string
  icon: string
}

const materials: Material[] = [
  {
    type: 'input',
    label: '输入框',
    description: '单行文本输入',
    icon: 'T',
  },
  {
    type: 'select',
    label: '下拉选择',
    description: '选择一个选项',
    icon: '▾',
  },
  {
    type: 'radio',
    label: '单选框',
    description: '单选一个选项',
    icon: '◉',
  },
  {
    type: 'checkbox',
    label: '复选框',
    description: '选择多个选项',
    icon: '☑',
  },
  {
    type: 'date',
    label: '日期选择',
    description: '选择日期',
    icon: '□',
  },
]

const emit = defineEmits<{
  add: [type: FieldType]
}>()

function handleDragStart(
  event: DragEvent,
  type: FieldType
) {
  event.dataTransfer?.setData(
    'application/x-form-field',
    type
  )

  event.dataTransfer!.effectAllowed = 'copy'
}
</script>

<template>
  <aside class="material-panel">
    <div class="panel-header">
      <div>
        <h3>组件</h3>
        <p>拖拽或点击添加</p>
      </div>
    </div>

    <div class="material-list">
      <button
        v-for="material in materials"
        :key="material.type"
        type="button"
        class="material-item"
        @click="emit('add', material.type)"
        draggable="true"
        @dragstart="handleDragStart($event, material.type)"
      >
        <span class="material-icon">
          {{ material.icon }}
        </span>

        <span class="material-content">
          <span class="material-label">
            {{ material.label }}
          </span>

          <span class="material-description">
            {{ material.description }}
          </span>
        </span>
      </button>
    </div>
  </aside>
</template>

<style scoped lang="scss">
.material-panel {
  height: 100%;
  padding: 20px 16px;
  box-sizing: border-box;
}

.panel-header {
  padding: 0 4px;
  margin-bottom: 16px;

  h3 {
    margin: 0;
    font-size: 16px;
    line-height: 24px;
    font-weight: 600;
    color: #303133;
  }

  p {
    margin: 4px 0 0;
    font-size: 12px;
    line-height: 18px;
    color: #909399;
  }
}

.material-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.material-item {
  width: 100%;
  min-height: 64px;
  padding: 10px 12px;

  display: flex;
  align-items: center;
  gap: 12px;

  border: 1px solid #ebeef5;
  border-radius: 8px;
  background: #fff;

  text-align: left;
  cursor: pointer;

  transition:
    border-color 0.2s,
    background-color 0.2s,
    box-shadow 0.2s;

  &:hover {
    border-color: #409eff;
    background: #f5faff;
    box-shadow: 0 2px 8px rgb(0 0 0 / 6%);
  }

  &:active {
    background: #ecf5ff;
  }
}

.material-icon {
  width: 36px;
  height: 36px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 6px;

  background: #ecf5ff;
  color: #409eff;

  font-size: 16px;
  font-weight: 600;
}

.material-content {
  min-width: 0;

  display: flex;
  flex-direction: column;
  gap: 2px;
}

.material-label {
  font-size: 14px;
  line-height: 20px;
  color: #303133;
}

.material-description {
  font-size: 12px;
  line-height: 18px;
  color: #909399;
}
</style>