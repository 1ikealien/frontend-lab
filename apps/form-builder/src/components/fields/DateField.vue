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
  <input
    v-model="model"
    type="date"
    :disabled="field.props?.disabled"
    @change="emit('change')"
  >
</template>