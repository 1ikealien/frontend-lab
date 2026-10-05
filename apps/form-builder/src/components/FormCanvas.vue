<script setup lang="ts">
import { ref } from 'vue'
import type { FieldType, FormSchema } from '@/types/form'
import FieldRenderer from '@/components/FieldRenderer.vue'

const props = defineProps<{
  schema: FormSchema
  selectedFieldId: string | null
}>()

const emit = defineEmits<{
  select: [fieldId: string]
  drop: [draggingFieldId: string, targetFieldId: string, position: 'before' | 'after']
  'drop-between': [draggingFieldId: string, targetFieldId: string, position: 'before' | 'after']
  'drop-end': [draggingFieldId: string]
  'drop-material': [type: FieldType, targetFieldId: string, position: 'before' | 'after',],
  'drop-material-end': [type: FieldType]
}>()

const draggingFieldId = ref<string | null>(null)

function getDraggedMaterial(event: DragEvent) {
  return event.dataTransfer?.getData(
    'application/x-form-field'
  ) as FieldType | ''
}

function handleDragStart(fieldId: string) {
  draggingFieldId.value = fieldId
}

function handleDragOver(event: DragEvent, fieldId: string) {
  if (draggingFieldId.value === fieldId) {
    return
  }

  event.preventDefault()
}

function handleBetweenDragOver(event: DragEvent, targetFieldId: string) {
  if (!draggingFieldId.value) {
    return
  }

  if (draggingFieldId.value === targetFieldId) {
    return
  }

  event.preventDefault()
}

function handleEndDragOver(event: DragEvent) {
  event.preventDefault()
}

function handleBetweenDrop(event: DragEvent, targetFieldId: string) {
  event.preventDefault()

  const materialType = getDraggedMaterial(event)

  if (materialType) {
    emit(
      'drop-material',
      materialType,
      targetFieldId,
      'before'
    )
    return
  }

  if (!draggingFieldId.value) {
    return
  }

  if (draggingFieldId.value === targetFieldId) {
    return
  }

  emit(
    'drop-between',
    draggingFieldId.value,
    targetFieldId,
    'before'
  )
}

function handleEndDrop(event: DragEvent) {
  event.preventDefault()

  const materialType = getDraggedMaterial(event)

  if (materialType) {
    emit('drop-material-end', materialType)
    return
  }

  if (!draggingFieldId.value) {
    return
  }

  emit('drop-end', draggingFieldId.value)
}

function handleDrop(event: DragEvent, targetFieldId: string) {
  event.preventDefault()

  const materialType = getDraggedMaterial(event)

  if (materialType) {
    const target = event.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect()
    const middleY = rect.top + rect.height / 2

    const position = event.clientY < middleY ? 'before' : 'after'

    emit(
      'drop-material',
      materialType,
      targetFieldId,
      position
    )

    return
  }

  if (!draggingFieldId.value) {
    return
  }

  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()

  const middleY = rect.top + rect.height / 2

  const position = event.clientY < middleY ? 'before' : 'after'

  emit(
    'drop',
    draggingFieldId.value,
    targetFieldId,
    position
  )
}

</script>
<template>
  <main class="form-canvas">
    <h3>表单画布</h3>
    <div
      v-if="props.schema.fields.length === 0"
      class="empty-drop-zone"
      @dragover="handleEndDragOver"
      @drop="handleEndDrop"
    >
      <div class="empty-drop-content">
        <div class="empty-drop-icon">＋</div>

        <div class="empty-drop-title">
          暂无表单组件
        </div>

        <div class="empty-drop-description">
          从左侧拖拽组件到这里
        </div>
      </div>
    </div>

    <div
      v-for="field in props.schema.fields"
      :key="field.id"
    >
      <div
        class="drop-zone"
        @dragover="handleBetweenDragOver($event, field.id)"
        @drop="handleBetweenDrop($event, field.id)"
      >
        拖到「{{ field.label }}」前面
      </div>
      <div
        class="form-field"
        :class="{ selected: field.id === props.selectedFieldId }"
        draggable="true"
        @click="emit('select', field.id)"
        @dragstart="handleDragStart(field.id)"
        @dragover="handleDragOver($event, field.id)"
        @drop="handleDrop($event, field.id)"
      >
        <label>{{ field.label }}</label>

        <FieldRenderer :field="field" />
      </div>

      <div
        v-if="field.id === props.schema.fields[props.schema.fields.length - 1]?.id"
        class="drop-zone"
        @dragover="handleEndDragOver($event)"
        @drop="handleEndDrop($event)"
      >
        拖到最后面
      </div>
    </div>
  </main>
</template>

<style scoped>
.form-canvas {
  min-height: 100%;
  padding: 20px 24px 40px;
  box-sizing: border-box;
}

.form-canvas>h3 {
  margin: 0 0 16px;
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
  color: #303133;
}

.empty-drop-zone {
  min-height: 280px;
  border: 1px dashed #c0c4cc;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  transition:
    border-color 0.2s,
    background-color 0.2s,
    box-shadow 0.2s;
}

.empty-drop-zone:hover {
  border-color: #409eff;
  background: #f5faff;
  box-shadow: 0 2px 10px rgb(64 158 255 / 8%);
}

.empty-drop-content {
  text-align: center;
}

.empty-drop-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #ecf5ff;
  color: #409eff;
  font-size: 28px;
  line-height: 48px;
}

.empty-drop-title {
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  color: #606266;
}

.empty-drop-description {
  margin-top: 6px;
  font-size: 12px;
  line-height: 18px;
  color: #909399;
}

.drop-zone {
  height: 28px;
  margin: 2px 0;
  border: 1px dashed transparent;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  font-size: 12px;
  color: #a8abb2;
  transition:
    border-color 0.2s,
    background-color 0.2s,
    color 0.2s;
}

.drop-zone:hover {
  border-color: #79bbff;
  background: #f5faff;
  color: #409eff;
}

.form-field {
  position: relative;
  padding: 16px 18px;
  border: 1px solid #ebeef5;
  border-radius: 10px;
  background: #fff;
  box-sizing: border-box;
  cursor: pointer;
  transition:
    border-color 0.2s,
    box-shadow 0.2s,
    background-color 0.2s;
}

.form-field:hover {
  border-color: #c6e2ff;
  box-shadow: 0 2px 8px rgb(0 0 0 / 5%);
}

.form-field.selected {
  border-color: #409eff;
  box-shadow:
    0 0 0 2px rgb(64 158 255 / 10%),
    0 2px 8px rgb(64 158 255 / 8%);
}

.form-field.selected::before {
  content: '';
  position: absolute;
  left: -1px;
  top: 12px;
  bottom: 12px;
  width: 3px;
  border-radius: 0 3px 3px 0;
  background: #409eff;
}

.form-field>label {
  display: block;
  margin-bottom: 10px;
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  color: #303133;
}

.form-canvas>div:not(.empty-drop-zone) {
  margin-bottom: 0;
}
</style>