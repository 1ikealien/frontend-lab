<script setup lang="ts">
import { computed, ref } from 'vue'
import MaterialPanel from '@/components/MaterialPanel.vue'
import FormCanvas from '@/components/FormCanvas.vue'
import PropertyPanel from '@/components/PropertyPanel.vue'
import type { FormField, FormSchema, FieldType } from '@/types/form'

const schema = ref<FormSchema>({
  fields: [],
})

const selectedFieldId = ref<string | null>(null)

const selectedField = computed(() => {
  return schema.value.fields.find(
    field => field.id === selectedFieldId.value
  )
})

function handleSelectField(fieldId: string) {
  selectedFieldId.value = fieldId

  console.log('selected field:', fieldId)
}
function handleAddField(type: FieldType) {
  const field: FormField = {
    id: crypto.randomUUID(),
    type,
    field: `field_${schema.value.fields.length + 1}`,
    label: '未命名字段',
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
</script>

<template>
  <div class="form-builder">
    <MaterialPanel @add="handleAddField" />
    <FormCanvas
      :schema="schema"
      @select="handleSelectField"
    />
    <PropertyPanel :field="selectedField" />
  </div>
</template>