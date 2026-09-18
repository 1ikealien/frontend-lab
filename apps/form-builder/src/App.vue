<script setup lang="ts">
import { computed, ref, toRaw } from 'vue'
import MaterialPanel from '@/components/MaterialPanel.vue'
import FormCanvas from '@/components/FormCanvas.vue'
import PropertyPanel from '@/components/PropertyPanel.vue'
import type { FormField, FormSchema, FieldType } from '@/types/form'
import PreviewForm from '@/components/PreviewForm.vue'

const schema = ref<FormSchema>({
  fields: [],
})

const undoStack = ref<FormSchema[]>([])
const redoStack = ref<FormSchema[]>([])

const formData = ref<Record<string, unknown>>({})

const selectedFieldId = ref<string | null>(null)

const previewMode = ref(false)

const fileInput = ref<HTMLInputElement | null>(null)

const selectedField = computed(() => {
  return schema.value.fields.find(
    field => field.id === selectedFieldId.value
  )
})

const selectedFieldIndex = computed(() => {
  return schema.value.fields.findIndex(
    field => field.id === selectedFieldId.value
  )
})

const canMoveUp = computed(() => {
  return selectedFieldIndex.value > 0
})

const canMoveDown = computed(() => {
  return (
    selectedFieldIndex.value >= 0 && selectedFieldIndex.value < schema.value.fields.length - 1
  )
})

function recordHistory() {
  const snapshot = structuredClone(toRaw(schema.value))

  undoStack.value.push(snapshot)

  redoStack.value = []

  console.log('undoStack:', undoStack.value)
}

recordHistory()

function undo() {
  if (undoStack.value.length === 0) {
    return
  }

  const current = structuredClone(toRaw(schema.value))

  redoStack.value.push(current)

  const previous = undoStack.value.pop()

  if (!previous) {
    return
  }

  schema.value = structuredClone(toRaw(previous))
}

function redo() {
  if (redoStack.value.length === 0) {
    return
  }

  const current = structuredClone(toRaw(schema.value))

  undoStack.value.push(current)

  const next = redoStack.value.pop()

  if (!next) {
    return
  }

  schema.value = structuredClone(toRaw(next))
}

function handleSelectField(fieldId: string) {
  selectedFieldId.value = fieldId
}

function moveFieldUp() {
  const index = schema.value.fields.findIndex(
    field => field.id === selectedFieldId.value
  )

  if (index <= 0) {
    return
  }

  recordHistory()

  const fields = schema.value.fields

  const current = fields[index]
  const previous = fields[index - 1]

  fields[index] = previous
  fields[index - 1] = current
}

function moveFieldDown() {
  const index = schema.value.fields.findIndex(
    field => field.id === selectedFieldId.value
  )

  if (index === -1 || index >= schema.value.fields.length - 1) {
    return
  }

  recordHistory()

  const fields = schema.value.fields

  const current = fields[index]
  const next = fields[index + 1]

  fields[index] = next
  fields[index + 1] = current
}

function handleAddField(type: FieldType) {
  recordHistory()
  const field: FormField = {
    id: crypto.randomUUID(),
    type,
    field: `field_${schema.value.fields.length + 1}`,
    label: '未命名字段',
    props: {},
  }

  if (type === 'input') {
    field.props = {
      placeholder: '请输入',
    }
  }

  if (type === 'select' || type === 'radio' || type === 'checkbox') {
    field.props = {
      options: [
        {
          label: '选项 1',
          value: 'option1',
        },
        {
          label: '选项 2',
          value: 'option2',
        },
      ],
    }
  }

  schema.value.fields.push(field)

  console.log(schema.value)
}

function moveField(draggingFieldId: string, targetFieldId: string, position: 'before' | 'after') {
  if (draggingFieldId === targetFieldId) {
    return
  }

  recordHistory()

  const fields = schema.value.fields

  const draggingIndex = fields.findIndex(
    field => field.id === draggingFieldId
  )

  const targetIndex = fields.findIndex(
    field => field.id === targetFieldId
  )

  if (draggingIndex === -1 || targetIndex === -1) {
    return
  }

  const [draggingField] = fields.splice(draggingIndex, 1)

  const newTargetIndex = fields.findIndex(
    field => field.id === targetFieldId
  )

  const insertIndex = position === 'before' ? newTargetIndex : newTargetIndex + 1

  fields.splice(insertIndex, 0, draggingField)
}

function handleDrop(draggingFieldId: string, targetFieldId: string, position: 'before' | 'after') {
  moveField(draggingFieldId, targetFieldId, position)
}

function handleDropBetween(draggingFieldId: string, targetFieldId: string, position: 'before' | 'after') {
  moveField(draggingFieldId, targetFieldId, position)
}

function handleEndDrop(draggingFieldId: string) {
  const fields = schema.value.fields

  const draggingIndex = fields.findIndex(
    field => field.id === draggingFieldId
  )

  if (draggingIndex === -1) {
    return
  }

  recordHistory()

  const [draggingField] = fields.splice(draggingIndex, 1)

  fields.push(draggingField)
}

function exportSchema() {
  const json = JSON.stringify(
    schema.value,
    null,
    2
  )

  const blob = new Blob(
    [json],
    {
      type: 'application/json',
    }
  )

  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = 'form-schema.json'

  link.click()

  URL.revokeObjectURL(url)
}

function triggerImport() {
  fileInput.value?.click()
}

async function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]

  if (!file) {
    return
  }

  try {
    const text = await file.text()

    const data = JSON.parse(text)

    if (!isValidSchema(data)) {
      console.error('无效的表单 Schema')
      return
    }

    schema.value = data

    selectedFieldId.value = null
  } catch (error) {
    console.error('导入 JSON 失败', error)
  }
}

function isValidSchema(data: unknown): data is FormSchema {
  if (!data || typeof data !== 'object') {
    return false
  }

  const schema = data as FormSchema

  if (!Array.isArray(schema.fields)) {
    return false
  }

  return true
}

function deleteSelectedField() {
  const index = schema.value.fields.findIndex(
    field => field.id === selectedFieldId.value
  )

  if (index === -1) {
    return
  }

  recordHistory()

  schema.value.fields.splice(index, 1)

  selectedFieldId.value = null
}
</script>

<template>
  <div class="mode-switch">
    <button @click="previewMode = false">
      编辑模式
    </button>

    <button @click="previewMode = true">
      预览模式
    </button>

    <button @click="exportSchema">
      导出 JSON
    </button>

    <button @click="triggerImport">
      导入 JSON
    </button>

    <button @click="undo">
      撤销
    </button>

    <button @click="redo">
      重做
    </button>

    <input
      ref="fileInput"
      type="file"
      accept=".json,application/json"
      hidden
      @change="handleFileChange"
    />
  </div>
  <div class="form-builder">
    <MaterialPanel
      v-if="!previewMode"
      @add="handleAddField"
    />
    <FormCanvas
      v-if="!previewMode"
      :schema="schema"
      :selected-field-id="selectedFieldId"
      @select="handleSelectField"
      @drop="handleDrop"
      @drop-between="handleDropBetween"
      @drop-end="handleEndDrop"
    />
    <PropertyPanel
      v-if="!previewMode"
      :field="selectedField"
      :can-move-up="canMoveUp"
      :can-move-down="canMoveDown"
      @move-up="moveFieldUp"
      @move-down="moveFieldDown"
      @delete="deleteSelectedField"
    />

    <PreviewForm
      v-if="previewMode"
      :schema="schema"
      :form-data="formData"
    />
  </div>
</template>