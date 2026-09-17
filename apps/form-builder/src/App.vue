<script setup lang="ts">
import { computed, ref } from 'vue'
import MaterialPanel from '@/components/MaterialPanel.vue'
import FormCanvas from '@/components/FormCanvas.vue'
import PropertyPanel from '@/components/PropertyPanel.vue'
import type { FormField, FormSchema, FieldType } from '@/types/form'
import PreviewForm from '@/components/PreviewForm.vue'

const schema = ref<FormSchema>({
  fields: [],
})

const selectedFieldId = ref<string | null>(null)

const previewMode = ref(false)

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

  const fields = schema.value.fields

  const current = fields[index]
  const next = fields[index + 1]

  fields[index] = next
  fields[index + 1] = current
}

function handleAddField(type: FieldType) {
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

  const [draggingField] = fields.splice(draggingIndex, 1)

  fields.push(draggingField)
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
    />

    <PreviewForm
      v-if="previewMode"
      :schema="schema"
    />
  </div>
</template>