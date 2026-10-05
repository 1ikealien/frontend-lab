<script setup lang="ts">
import { ref } from 'vue'
import { useFormSchema } from '@/composables/useFormSchema'
import MaterialPanel from '@/components/MaterialPanel.vue'
import FormCanvas from '@/components/FormCanvas.vue'
import PropertyPanel from '@/components/PropertyPanel.vue'
import type { FieldType, FormSchema } from '@/types/form'
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
  addFieldAt,
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

function handleDropMaterial(type: FieldType, targetFieldId: string, position: 'before' | 'after') {
  const targetIndex = schema.value.fields.findIndex(
    field => field.id === targetFieldId
  )

  if (targetIndex === -1) {
    return
  }

  const insertIndex = position === 'before' ? targetIndex : targetIndex + 1

  addFieldAt(type, insertIndex)
}

function handleDropMaterialEnd(type: FieldType) {
  addFieldAt(type, schema.value.fields.length)
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
  <div class="toolbar">
    <div class="toolbar-left">
      <div class="page-title">
        <span class="title-icon">F</span>

        <div>
          <h1>表单设计器</h1>
          <p>可视化构建表单并生成 Schema</p>
        </div>
      </div>
    </div>

    <div class="toolbar-right">
      <el-button-group>
        <el-button
          :type="!previewMode ? 'primary' : 'default'"
          @click="previewMode = false"
        >
          编辑模式
        </el-button>

        <el-button
          :type="previewMode ? 'primary' : 'default'"
          @click="previewMode = true"
        >
          预览模式
        </el-button>
      </el-button-group>

      <el-divider direction="vertical" />

      <el-button @click="triggerImport">
        导入 JSON
      </el-button>

      <el-button
        type="primary"
        plain
        @click="exportSchema"
      >
        导出 JSON
      </el-button>

      <el-divider direction="vertical" />

      <el-button @click="undo">
        撤销
      </el-button>

      <el-button @click="redo">
        重做
      </el-button>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept=".json,application/json"
      hidden
      @change="handleFileChange"
    />
  </div>
  <div class="form-builder">
    <div
      v-if="!previewMode"
      class="material-panel-wrapper"
    >
      <MaterialPanel @add="addField" />
    </div>

    <div
      v-if="!previewMode"
      class="canvas-wrapper"
    >
      <FormCanvas
        :schema="schema"
        :selected-field-id="selectedFieldId"
        @select="handleSelectField"
        @drop="handleDrop"
        @drop-between="handleDropBetween"
        @drop-end="handleEndDrop"
        @drop-material="handleDropMaterial"
        @drop-material-end="handleDropMaterialEnd"
      />
    </div>

    <div
      v-if="!previewMode"
      class="property-panel-wrapper"
    >
      <PropertyPanel
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
    </div>

    <div
      v-if="previewMode"
      class="preview-wrapper"
    >
      <PreviewForm
        :schema="schema"
        :form-data="formData"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.toolbar {
  height: 72px;
  padding: 0 24px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  background: #fff;
  border-bottom: 1px solid #ebeef5;

  box-sizing: border-box;
}

.toolbar-left {
  min-width: 0;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  width: 36px;
  height: 36px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 8px;

  background: #409eff;
  color: #fff;

  font-size: 18px;
  font-weight: 600;
}

.page-title h1 {
  margin: 0;

  font-size: 18px;
  line-height: 24px;
  font-weight: 600;
  color: #303133;
}

.page-title p {
  margin: 2px 0 0;

  font-size: 12px;
  line-height: 18px;
  color: #909399;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.form-builder {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr) 320px;

  height: calc(100vh - 72px);

  background: #f5f7fa;
}

.material-panel-wrapper {
  min-width: 0;
  min-height: 0;

  overflow: auto;

  background: #fff;
  border-right: 1px solid #ebeef5;
}

.canvas-wrapper {
  min-width: 0;
  min-height: 0;

  overflow: auto;
}

.property-panel-wrapper {
  min-width: 0;
  min-height: 0;

  overflow: auto;

  background: #fff;
  border-left: 1px solid #ebeef5;
}

.preview-wrapper {
  grid-column: 1 / -1;

  min-width: 0;
  min-height: 0;

  overflow: auto;
}
</style>