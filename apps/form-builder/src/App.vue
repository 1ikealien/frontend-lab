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
  updateFieldLabel,
  updateFieldDisabled,
  updateFieldPlaceholder,
  updateFieldRequired,
  endFieldEdit,
  updateFieldValidationMessage,
  updateFieldName,
  updateOptionLabel,
  updateOptionValue,
  addOption,
  removeOption,
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

function handleUpdateLabel(label: string) {
  if (!selectedFieldId.value) {
    return
  }

  updateFieldLabel(
    selectedFieldId.value,
    label
  )
}

function handleUpdateDisabled(disabled: boolean) {
  if (!selectedFieldId.value) {
    return
  }

  updateFieldDisabled(
    selectedFieldId.value,
    disabled
  )
}

function handleUpdatePlaceholder(placeholder: string) {
  if (!selectedFieldId.value) {
    return
  }

  updateFieldPlaceholder(
    selectedFieldId.value,
    placeholder
  )
}

function handleUpdateRequired(required: boolean) {
  if (!selectedFieldId.value) {
    return
  }

  updateFieldRequired(
    selectedFieldId.value,
    required
  )
}

function handleUpdateValidationMessage(message: string) {
  if (!selectedFieldId.value) {
    return
  }

  updateFieldValidationMessage(
    selectedFieldId.value,
    message
  )
}

function handleEndValidationMessageEdit() {
  if (!selectedFieldId.value) {
    return
  }

  endFieldEdit(
    selectedFieldId.value,
    `${selectedFieldId.value}:validation-message`
  )
}

function handleEndPlaceholderEdit() {
  if (!selectedFieldId.value) {
    return
  }

  endFieldEdit(
    selectedFieldId.value,
    `${selectedFieldId.value}:placeholder`
  )
}

function handleUpdateFieldName(fieldName: string) {
  if (!selectedFieldId.value) {
    return
  }

  updateFieldName(
    selectedFieldId.value,
    fieldName
  )
}

function handleEndFieldNameEdit() {
  if (!selectedFieldId.value) {
    return
  }

  endFieldEdit(
    selectedFieldId.value,
    `${selectedFieldId.value}:field-name`
  )
}

function handleEndFieldEdit() {
  if (!selectedFieldId.value) {
    return
  }

  endFieldEdit(selectedFieldId.value)
}

function handleUpdateOptionLabel(index: number, label: string) {
  if (!selectedFieldId.value) {
    return
  }

  updateOptionLabel(
    selectedFieldId.value,
    index,
    label
  )
}

function handleEndOptionLabelEdit(index: number) {
  if (!selectedFieldId.value) {
    return
  }

  endFieldEdit(
    selectedFieldId.value,
    `${selectedFieldId.value}:option-label:${index}`
  )
}

function handleUpdateOptionValue(index: number, value: string) {
  if (!selectedFieldId.value) {
    return
  }

  updateOptionValue(
    selectedFieldId.value,
    index,
    value
  )
}

function handleEndOptionValueEdit(index: number) {
  if (!selectedFieldId.value) {
    return
  }

  endFieldEdit(
    selectedFieldId.value,
    `${selectedFieldId.value}:option-value:${index}`
  )
}

function handleAddOption() {
  if (!selectedFieldId.value) {
    return
  }

  addOption(selectedFieldId.value)
}

function handleRemoveOption(index: number) {
  if (!selectedFieldId.value) {
    return
  }

  removeOption(
    selectedFieldId.value,
    index
  )
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
      @update-label="handleUpdateLabel"
      @end-edit="handleEndFieldEdit"
      @update-disabled="handleUpdateDisabled"
      @update-placeholder="handleUpdatePlaceholder"
      @update-placeholder-edit="handleEndPlaceholderEdit"
      @update-required="handleUpdateRequired"
      @update-validation-message="handleUpdateValidationMessage"
      @end-validation-message-edit="handleEndValidationMessageEdit"
      @update-field-name="handleUpdateFieldName"
      @end-field-name-edit="handleEndFieldNameEdit"
      @update-option-label="handleUpdateOptionLabel"
      @end-option-label-edit="handleEndOptionLabelEdit"
      @update-option-value="handleUpdateOptionValue"
      @end-option-value-edit="handleEndOptionValueEdit"
      @add-option="handleAddOption"
      @remove-option="handleRemoveOption"
    />

    <PreviewForm
      v-if="previewMode"
      :schema="schema"
      :form-data="formData"
    />
  </div>
</template>