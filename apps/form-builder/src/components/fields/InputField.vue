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
    :placeholder="field.props?.placeholder"
    :disabled="field.props?.disabled"
    @input="emit('change')"
  />
</template>