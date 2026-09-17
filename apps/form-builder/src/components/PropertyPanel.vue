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
}>()

function addOption() {
  if (!props.field?.props?.options) {
    return
  }

  props.field.props.options.push({
    label: `选项 ${props.field.props.options.length + 1}`,
    value: `option${props.field.props.options.length + 1}`,
  })
}

function removeOption(index: number) {
  props.field?.props?.options?.splice(index, 1)
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

      <div>
        <label>
          <input
            type="checkbox"
            v-model="field.props!.disabled"
          />
          禁用
        </label>
      </div>
      <div>
        <label>标题</label>
        <input
          :value="field.label"
          @input="field.label = ($event.target as HTMLInputElement).value"
        />
      </div>

      <div>
        <label>字段名</label>
        <input
          :value="field.field"
          @input="field.field = ($event.target as HTMLInputElement).value"
        />
      </div>

      <div v-if="field.type === 'input'">
        <label>占位文本</label>
        <input
          :value="field.props?.placeholder"
          @input="field.props!.placeholder = ($event.target as HTMLInputElement).value"
        />
      </div>

      <div v-if="field.type === 'select' || field.type === 'radio' || field.type === 'checkbox'">
        <label>选项</label>

        <div
          v-for="(option, index) in field.props?.options ?? []"
          :key="option.value"
        >
          <input
            :value="option.label"
            @input="option.label = ($event.target as HTMLInputElement).value"
          />
          <input
            :value="option.value"
            @input="option.value = ($event.target as HTMLInputElement).value"
          />
          <button @click="removeOption(index)">删除</button>
        </div>
        <button @click="addOption">添加选项</button>
      </div>
    </div>
  </div>
</template>