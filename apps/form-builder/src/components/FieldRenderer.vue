<script setup lang="ts">
import type { Component } from 'vue'
import type { FieldType, FormField } from '@/types/form'

import InputField from '@/components/fields/InputField.vue'
import CheckboxField from '@/components/fields/CheckboxField.vue'
import DateField from '@/components/fields/DateField.vue'
import RadioField from '@/components/fields/RadioField.vue'
import SelectField from '@/components/fields/SelectField.vue'

defineProps<{
  field: FormField
}>()

const model = defineModel<unknown>()

const emit = defineEmits<{
  change: []
}>()

const componentMap: Record<FieldType, Component> = {
  input: InputField,
  select: SelectField,
  radio: RadioField,
  checkbox: CheckboxField,
  date: DateField
}
</script>

<template>
  <component
    :is="componentMap[field.type]"
    :field="field"
    v-model="model"
    @change="emit('change')"
  />
</template>