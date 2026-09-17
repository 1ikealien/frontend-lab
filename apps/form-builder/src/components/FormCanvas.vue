<script setup lang="ts">
import type { FormSchema } from '@/types/form'

const props = defineProps<{
  schema: FormSchema
}>()

const emit = defineEmits<{
  select: [fieldId: string]
}>()
</script>
<template>
  <main class="form-canvas">
    <h3>表单画布</h3>
    <div v-if="props.schema.fields.length === 0">
      暂无表单组件
    </div>

    <div
      v-for="field in props.schema.fields"
      :key="field.id"
      class="form-field"
      @click="emit('select', field.id)"
    >
      <label>{{ field.label }}</label>
      <input
        v-if="field.type === 'input'"
        :placeholder="field.props?.placeholder"
        :disabled="field.props?.disabled"
      >
      <select
        v-else-if="field.type === 'select'"
        :disabled="field.props?.disabled"
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
            type="radio"
            :name="field.id"
            :value="option.value"
            :disabled="field.props?.disabled"
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
            type="checkbox"
            :value="option.value"
            :disabled="field.props?.disabled"
          />
          {{ option.label }}
        </label>
      </div>
      <input
        v-else-if="field.type === 'date'"
        type="date"
        :disabled="field.props?.disabled"
      />
      <div v-else>
        暂不支持: {{ field.type }}
      </div>
    </div>
  </main>
</template>