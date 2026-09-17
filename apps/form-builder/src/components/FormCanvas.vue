<script setup lang="ts">
import { ref } from 'vue'
import type { FormSchema } from '@/types/form'

const props = defineProps<{
  schema: FormSchema
  selectedFieldId: string | null
}>()

const emit = defineEmits<{
  select: [fieldId: string]
  drop: [draggingFieldId: string, targetFieldId: string, position: 'before' | 'after']
  'drop-between': [draggingFieldId: string, targetFieldId: string, position: 'before' | 'after']
  'drop-end': [draggingFieldId: string]
}>()

const draggingFieldId = ref<string | null>(null)

function handleDragStart(fieldId: string) {
  draggingFieldId.value = fieldId
  console.log('dragging field:', draggingFieldId.value)
}

function handleDragOver(event: DragEvent, fieldId: string) {
  if (draggingFieldId.value === fieldId) {
    return
  }

  event.preventDefault()

  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()

  const middleY = rect.top + rect.height / 2

  const position = event.clientY < middleY ? 'before' : 'after'

  console.log('drag over:', fieldId, position)
}

function handleBetweenDragOver(event: DragEvent, targetFieldId: string) {
  if (!draggingFieldId.value) {
    return
  }

  if (draggingFieldId.value === targetFieldId) {
    return
  }

  event.preventDefault()

  console.log(
    'between drag over:',
    targetFieldId
  )
}

function handleEndDragOver(event: DragEvent) {
  if (!draggingFieldId.value) {
    return
  }

  event.preventDefault()
}

function handleBetweenDrop(event: DragEvent, targetFieldId: string) {
  if (!draggingFieldId.value) {
    return
  }

  if (draggingFieldId.value === targetFieldId) {
    return
  }

  event.preventDefault()

  console.log(
    'between drop:',
    draggingFieldId.value,
    targetFieldId
  )

  emit(
    'drop-between',
    draggingFieldId.value,
    targetFieldId,
    'before'
  )
}

function handleEndDrop(event: DragEvent) {
  if (!draggingFieldId.value) {
    return
  }

  event.preventDefault()

  console.log(
    'end drop:',
    draggingFieldId.value
  )

  emit('drop-end', draggingFieldId.value)
}

function handleDrop(event: DragEvent, targetFieldId: string) {
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
    <div v-if="props.schema.fields.length === 0">
      暂无表单组件
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
        <input
          v-if="field.type === 'input'"
          :placeholder="field.props?.placeholder"
          :disabled="field.props?.disabled"
        >
        <select
          v-else-if="field.type === 'select'"
          :disabled="field.props?.disabled"
        >
          <option
            v-for="option in field.props?.options ?? []"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>

        <div v-else-if="field.type === 'radio'">
          <label
            v-for="option in field.props?.options ?? []"
            :key="option.value"
          >
            <input
              type="radio"
              :name="field.id"
              :value="option.value"
              :disabled="field.props?.disabled"
            />
            {{ option.label }}
          </label>
        </div>
        <div v-else-if="field.type === 'checkbox'">
          <label
            v-for="option in field.props?.options ?? []"
            :key="option.value"
          >
            <input
              type="checkbox"
              :value="option.value"
              :disabled="field.props?.disabled"
            />
            {{ option.label }}
          </label>
        </div>
        <input
          v-else-if="field.type === 'date'"
          type="date"
          :disabled="field.props?.disabled"
        />
        <div v-else>
          暂不支持: {{ field.type }}
        </div>
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
.form-field {
  border: 1px solid transparent;
  padding: 16px;
  cursor: pointer;
}

.form-field.selected {
  border-color: #409eff;
}

.drop-zone {
  height: 20px;
  border: 1px dashed #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #999;
}
</style>