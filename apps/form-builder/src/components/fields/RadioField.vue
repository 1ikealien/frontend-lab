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
  <div>
    <label
      v-for="(option, optionIndex) in field.props?.options ?? []"
      :key="optionIndex"
    >
      <input
        v-model="model"
        type="radio"
        :name="field.id"
        :value="option.value"
        :disabled="field.props?.disabled"
        @change="emit('change')"
      />
      {{ option.label }}
    </label>
  </div>
</template>