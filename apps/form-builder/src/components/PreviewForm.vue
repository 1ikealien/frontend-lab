<script setup lang="ts">
import { reactive } from 'vue'
import type { FormField, FormSchema } from '@/types/form'

const props = defineProps<{
  schema: FormSchema
}>()

const formData = reactive<Record<string, unknown>>({})

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
  console.log('submit:', formData)
}

function validateField(field: FormField) {
  errors[field.field] = ''

  if (!field.rules) {
    return true
  }

  for (const rule of field.rules) {
    if (rule.required) {
      const value = formData[field.field]

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

function initalizeFormData() {
  for (const field of props.schema.fields) {
    if (field.type === 'checkbox') {
      formData[field.field] = []
    } else {
      formData[field.field] = ''
    }
  }
}

initalizeFormData()
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

      <input
        v-if="field.type === 'input'"
        v-model="formData[field.field]"
        :placeholder="field.props?.placeholder"
        :disabled="field.props?.disabled"
        @input="clearFieldError(field.field)"
      />

      <select
        v-else-if="field.type === 'select'"
        :disabled="field.props?.disabled"
        v-model="formData[field.field]"
        @change="clearFieldError(field.field)"
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
            v-model="formData[field.field]"
            type="radio"
            :name="field.id"
            :value="option.value"
            :disabled="field.props?.disabled"
            @change="clearFieldError(field.field)"
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
            v-model="formData[field.field]"
            type="checkbox"
            :value="option.value"
            :disabled="field.props?.disabled"
            @change="clearFieldError(field.field)"
          />
          {{ option.label }}
        </label>
      </div>

      <input
        v-else-if="field.type === 'date'"
        v-model="formData[field.field]"
        type="date"
        :disabled="field.props?.disabled"
        @change="clearFieldError(field.field)"
      />

      <div v-else>
        暂不支持：{{ field.type }}
      </div>

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