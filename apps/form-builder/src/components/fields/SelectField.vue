<script setup lang="ts">
import type { FormField } from '@/types/form'

defineProps<{
  field: FormField
}>()

const model = defineModel<unknown>()
const emit = defineEmits<{
  change: []
}>()
</script>

<template>
  <select
    v-model="model"
    :disabled="field.props?.disabled"
    @change="emit('change')"
  >
    <option
      v-for="option in field.props?.options ?? []"
      :key="option.value"
      :value="option.value"
    >
      {{ option.label }}
    </option>
  </select>
</template>