<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { FormField, FormSchema } from '@/types/form'
import FieldRenderer from '@/components/FieldRenderer.vue'

const props = defineProps<{
  schema: FormSchema
  formData: Record<string, unknown>
}>()

const errors = reactive<Record<string, string>>({})

function clearFieldError(fieldName: string) {
  errors[fieldName] = ''
}

function handleSubmit() {
  let valid = true
  for (const field of props.schema.fields) {
    const fieldvalid = validateField(field)

    if (!fieldvalid) {
      valid = false
    }
  }
  if (!valid) {
    return
  }
  console.log('submit:', props.formData)
}

function validateField(field: FormField) {
  errors[field.field] = ''

  if (!field.rules) {
    return true
  }

  for (const rule of field.rules) {
    if (rule.required) {
      const value = props.formData[field.field]

      if (
        value === undefined ||
        value === null ||
        value === '' ||
        (Array.isArray(value) && value.length === 0)
      ) {
        errors[field.field] = rule.message || '该字段不能为空'
        return false
      }
    }
  }

  return true
}

function getInitialValue(field: FormField) {
  if (field.type === 'checkbox') {
    return []
  }

  return ''
}

function initializeFormData() {
  for (const field of props.schema.fields) {
    if (!(field.field in props.formData)) {
      props.formData[field.field] = getInitialValue(field)
    }
  }

  const fieldNames = new Set(
    props.schema.fields.map(field => field.field)
  )

  for (const key of Object.keys(props.formData)) {
    if (!fieldNames.has(key)) {
      delete props.formData[key]
    }
  }
}

initializeFormData()

watch(
  () => props.schema.fields,
  () => {
    initializeFormData()
  },
  {
    deep: true,
  }
)
</script>

<template>
  <div class="preview-form">
    <h3>表单预览</h3>

    <div
      v-for="field in props.schema.fields"
      :key="field.id"
      class="preview-field"
    >
      <label>{{ field.label }}</label>

      <FieldRenderer
        v-model="formData[field.field]"
        :field="field"
        @change="clearFieldError(field.field)"
      />

      <div
        v-if="errors[field.field]"
        class="field-error"
      >
        {{ errors[field.field] }}
      </div>
    </div>
    <button @click="handleSubmit">提交</button>
  </div>
</template>

<style scoped>
.preview-form {
  padding: 24px;
}

.preview-field {
  margin-bottom: 20px;
}

.preview-field>label {
  display: block;
  margin-bottom: 8px;
}

.field-error {
  margin-top: 6px;
  font-size: 12px;
  color: #f56c6c;
}
</style>