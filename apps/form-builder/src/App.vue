<script setup lang="ts">
import { ref } from 'vue'
import { useFormSchema } from '@/composables/useFormSchema'
import MaterialPanel from '@/components/MaterialPanel.vue'
import FormCanvas from '@/components/FormCanvas.vue'
import PropertyPanel from '@/components/PropertyPanel.vue'
import type { FormSchema } from '@/types/form'
import PreviewForm from '@/components/PreviewForm.vue'

const {
  schema,
  selectedFieldId,
  selectedField,
  canMoveUp,
  canMoveDown,
  undo,
  redo,
  addField,
  moveFieldUp,
  moveFieldDown,
  moveField,
  moveFieldToEnd,
  deleteField,
} = useFormSchema()

const formData = ref<Record<string, unknown>>({})

const previewMode = ref(false)

const fileInput = ref<HTMLInputElement | null>(null)

function handleSelectField(fieldId: string) {
  selectedFieldId.value = fieldId
}

function handleDrop(draggingFieldId: string, targetFieldId: string, position: 'before' | 'after') {
  moveField(draggingFieldId, targetFieldId, position)
}

function handleDropBetween(draggingFieldId: string, targetFieldId: string, position: 'before' | 'after') {
  moveField(draggingFieldId, targetFieldId, position)
}

function handleEndDrop(draggingFieldId: string) {
  moveFieldToEnd(draggingFieldId)
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
      @add="addField"
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
      @delete="deleteField"
    />

    <PreviewForm
      v-if="previewMode"
      :schema="schema"
      :form-data="formData"
    />
  </div>
</template>