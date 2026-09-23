<script setup lang="ts">
import type { FormField } from '@/types/form'

const props = defineProps<{
  field?: FormField
  canMoveUp: boolean
  canMoveDown: boolean
}>()

const emit = defineEmits<{
  'move-up': []
  'move-down': []
  delete: []
  'update-label': [label: string]
  'end-edit': []
  'update-disabled': [disabled: boolean]
  'update-placeholder': [placeholder: string]
  'end-placeholder-edit': []
  'update-required': [required: boolean]
  'update-validation-message': [message: string]
  'end-validation-message-edit': []
  'update-field-name': [fieldName: string]
  'end-field-name-edit': []
  'update-option-label': [index: number, label: string]
  'end-option-label-edit': [index: number]
  'update-option-value': [index: number, value: string]
  'end-option-value-edit': [index: number]
  'add-option': []
  'remove-option': [index: number]
}>()

function addOption() {
  emit('add-option')
}

function removeOption(index: number) {
  emit('remove-option', index)
}
</script>

<template>
  <div class="property-panel">
    <h3>属性</h3>
    <div v-if="!field">
      请选择一个表单组件
    </div>

    <div v-else>
      <p>类型: {{ field.type }}</p>

      <div>
        <label>
          <input
            type="checkbox"
            :checked="field.rules?.some(rule => rule.required) ?? false"
            @change="
              emit(
                'update-required',
                ($event.target as HTMLInputElement).checked
              )
              "
          />
          必填
        </label>
      </div>

      <div v-if="field.rules?.some(rule => rule.required)">
        <label>校验提示</label>
        <input
          :value="field.rules?.find(rule => rule.required)?.message ?? ''"
          @input="emit(
            'update-validation-message',
            ($event.target as HTMLInputElement).value
          )"
          @blur="emit('end-validation-message-edit')"
        />
      </div>

      <button
        :disabled="!props.canMoveUp"
        @click="emit('move-up')"
      >
        上移
      </button>
      <button
        :disabled="!props.canMoveDown"
        @click="emit('move-down')"
      >
        下移
      </button>

      <button @click="emit('delete')">
        删除
      </button>

      <div>
        <label>
          <input
            type="checkbox"
            :checked="field.props?.disabled ?? false"
            @change="emit(
              'update-disabled',
              ($event.target as HTMLInputElement).checked
            )"
          />
          禁用
        </label>
      </div>
      <div>
        <label>标题</label>
        <input
          :value="field.label"
          @input="emit(
            'update-label',
            ($event.target as HTMLInputElement).value
          )"
          @blur="emit('end-edit')"
        />
      </div>

      <div>
        <label>字段名</label>
        <input
          :value="field.field"
          @input="emit(
            'update-field-name',
            ($event.target as HTMLInputElement).value
          )"
          @blur="emit('end-field-name-edit')"
        />
      </div>

      <div v-if="field.type === 'input'">
        <label>占位文本</label>
        <input
          :value="field.props?.placeholder"
          @input="emit(
            'update-placeholder',
            ($event.target as HTMLInputElement).value
          )"
          @blur="emit('end-placeholder-edit')"
        />
      </div>

      <div v-if="field.type === 'select' || field.type === 'radio' || field.type === 'checkbox'">
        <label>选项</label>

        <div
          v-for="(option, index) in field.props?.options ?? []"
          :key="index"
        >
          <input
            :value="option.label"
            @input="emit(
              'update-option-label',
              index,
              ($event.target as HTMLInputElement).value
            )"
            @blur="emit('end-option-label-edit', index)"
          />
          <input
            :value="option.value"
            @input="emit(
              'update-option-value',
              index,
              ($event.target as HTMLInputElement).value
            )"
            @blur="emit('end-option-value-edit', index)"
          />
          <button @click="removeOption(index)">删除</button>
        </div>
        <button @click="addOption">添加选项</button>
      </div>
    </div>
  </div>
</template>