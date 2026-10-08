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
  <aside class="property-panel">
    <div class="panel-header">
      <h3>属性</h3>
      <p v-if="field">
        编辑当前表单组件
      </p>
      <p v-else>
        请选择一个表单组件
      </p>
    </div>

    <div
      v-if="!field"
      class="empty-state"
    >
      <div class="empty-icon">
        ⚙
      </div>

      <div class="empty-title">
        未选择组件
      </div>

      <div class="empty-description">
        点击画布中的组件查看属性
      </div>
    </div>

    <div
      v-else
      class="property-content"
    >
      <!-- 组件信息 -->
      <section class="property-section">
        <div class="section-title">
          组件信息
        </div>

        <div class="field-type">
          <span class="field-type-label">
            类型
          </span>

          <span class="field-type-value">
            {{ field.type }}
          </span>
        </div>
      </section>

      <!-- 基础属性 -->
      <section class="property-section">
        <div class="section-title">
          基础属性
        </div>

        <div class="property-item">
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

        <div class="property-item">
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

        <label class="switch-item">
          <span>禁用</span>

          <input
            type="checkbox"
            :checked="field.props?.disabled ?? false"
            @change="emit(
              'update-disabled',
              ($event.target as HTMLInputElement).checked
            )"
          />
        </label>
      </section>

      <!-- 输入属性 -->
      <section
        v-if="field.type === 'input'"
        class="property-section"
      >
        <div class="section-title">
          输入属性
        </div>

        <div class="property-item">
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
      </section>

      <!-- 校验规则 -->
      <section class="property-section">
        <div class="section-title">
          校验规则
        </div>

        <label class="switch-item">
          <span>必填</span>

          <input
            type="checkbox"
            :checked="field.rules?.some(rule => rule.required) ?? false"
            @change="emit(
              'update-required',
              ($event.target as HTMLInputElement).checked
            )"
          />
        </label>

        <div
          v-if="field.rules?.some(rule => rule.required)"
          class="property-item"
        >
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
      </section>

      <!-- 选项 -->
      <section
        v-if="
          field.type === 'select' ||
          field.type === 'radio' ||
          field.type === 'checkbox'
        "
        class="property-section"
      >
        <div class="section-header">
          <div class="section-title">
            选项
          </div>

          <span class="option-count">
            {{ field.props?.options?.length ?? 0 }}
          </span>
        </div>

        <div class="option-list">
          <div
            v-for="(option, index) in field.props?.options ?? []"
            :key="index"
            class="option-item"
          >
            <div class="option-index">
              {{ index + 1 }}
            </div>

            <div class="option-fields">
              <input
                :value="option.label"
                placeholder="显示文本"
                @input="emit(
                  'update-option-label',
                  index,
                  ($event.target as HTMLInputElement).value
                )"
                @blur="emit('end-option-label-edit', index)"
              />

              <input
                :value="option.value"
                placeholder="实际值"
                @input="emit(
                  'update-option-value',
                  index,
                  ($event.target as HTMLInputElement).value
                )"
                @blur="emit('end-option-value-edit', index)"
              />
            </div>

            <button
              type="button"
              class="option-delete"
              @click="removeOption(index)"
            >
              ×
            </button>
          </div>
        </div>

        <button
          type="button"
          class="add-option-button"
          @click="addOption"
        >
          ＋ 添加选项
        </button>
      </section>

      <!-- 操作 -->
      <section class="property-section action-section">
        <div class="section-title">
          操作
        </div>

        <div class="action-buttons">
          <button
            type="button"
            :disabled="!props.canMoveUp"
            @click="emit('move-up')"
          >
            ↑ 上移
          </button>

          <button
            type="button"
            :disabled="!props.canMoveDown"
            @click="emit('move-down')"
          >
            ↓ 下移
          </button>
        </div>

        <button
          type="button"
          class="delete-button"
          @click="emit('delete')"
        >
          删除组件
        </button>
      </section>
    </div>
  </aside>
</template>

<style scoped lang="scss">
.property-panel {
  height: 100%;
  box-sizing: border-box;
  background: #fff;
  overflow-y: auto;
  color: #303133;
}

.panel-header {
  padding: 20px 20px 16px;
  border-bottom: 1px solid #ebeef5;

  h3 {
    margin: 0;
    font-size: 16px;
    line-height: 24px;
    font-weight: 600;
    color: #303133;
  }

  p {
    margin: 4px 0 0;
    font-size: 12px;
    line-height: 18px;
    color: #909399;
  }
}

.empty-state {
  padding: 72px 24px;
  text-align: center;
}

.empty-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: #f5f7fa;
  color: #c0c4cc;
  font-size: 22px;
}

.empty-title {
  font-size: 14px;
  line-height: 20px;
  color: #606266;
}

.empty-description {
  margin-top: 6px;
  font-size: 12px;
  line-height: 18px;
  color: #c0c4cc;
}

.property-content {
  padding-bottom: 20px;
}

.property-section {
  padding: 18px 20px;
  border-bottom: 1px solid #f0f2f5;
}

.section-title {
  margin-bottom: 14px;
  font-size: 13px;
  line-height: 20px;
  font-weight: 600;
  color: #303133;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .section-title {
    margin-bottom: 14px;
  }
}

.field-type {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 36px;
  padding: 0 10px;
  border-radius: 6px;
  background: #f5f7fa;
}

.field-type-label {
  font-size: 12px;
  color: #909399;
}

.field-type-value {
  padding: 3px 8px;
  border-radius: 4px;
  background: #ecf5ff;
  color: #409eff;
  font-size: 12px;
  font-weight: 500;
}

.property-item {
  margin-bottom: 14px;

  &:last-child {
    margin-bottom: 0;
  }

  >label {
    display: block;
    margin-bottom: 6px;
    font-size: 12px;
    line-height: 18px;
    color: #606266;
  }

  >input {
    width: 100%;
    height: 34px;
    padding: 0 10px;
    box-sizing: border-box;
    border: 1px solid #dcdfe6;
    border-radius: 6px;
    outline: none;
    background: #fff;
    color: #303133;
    font-size: 13px;
    transition:
      border-color 0.2s,
      box-shadow 0.2s;

    &::placeholder {
      color: #c0c4cc;
    }

    &:hover {
      border-color: #c0c4cc;
    }

    &:focus {
      border-color: #409eff;
      box-shadow: 0 0 0 2px rgb(64 158 255 / 10%);
    }
  }
}

.switch-item {
  min-height: 34px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  font-size: 13px;
  color: #606266;

  input {
    width: 34px;
    height: 18px;
    margin: 0;
    appearance: none;
    position: relative;
    border: none;
    border-radius: 9px;
    outline: none;
    background: #dcdfe6;
    cursor: pointer;
    transition: background-color 0.2s;

    &::after {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 1px 3px rgb(0 0 0 / 15%);
      transition: transform 0.2s;
    }

    &:checked {
      background: #409eff;

      &::after {
        transform: translateX(16px);
      }
    }
  }
}

.option-count {
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: #f5f7fa;
  color: #909399;
  font-size: 11px;
}

.option-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  background: #fafafa;
}

.option-index {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  margin-top: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background: #ecf5ff;
  color: #409eff;
  font-size: 11px;
}

.option-fields {
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;

  input {
    width: 100%;
    height: 30px;
    padding: 0 8px;
    box-sizing: border-box;
    border: 1px solid #dcdfe6;
    border-radius: 5px;
    outline: none;
    background: #fff;
    color: #303133;
    font-size: 12px;

    &::placeholder {
      color: #c0c4cc;
    }

    &:focus {
      border-color: #409eff;
    }
  }
}

.option-delete {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  margin-top: 1px;
  padding: 0;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: #c0c4cc;
  font-size: 18px;
  line-height: 24px;
  cursor: pointer;

  &:hover {
    background: #fef0f0;
    color: #f56c6c;
  }
}

.add-option-button {
  width: 100%;
  height: 34px;
  margin-top: 10px;
  border: 1px dashed #c0c4cc;
  border-radius: 6px;
  background: #fff;
  color: #606266;
  font-size: 12px;
  cursor: pointer;
  transition:
    border-color 0.2s,
    color 0.2s,
    background-color 0.2s;

  &:hover {
    border-color: #409eff;
    background: #f5faff;
    color: #409eff;
  }
}

.action-section {
  border-bottom: none;
}

.action-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;

  button {
    height: 34px;
    border: 1px solid #dcdfe6;
    border-radius: 6px;
    background: #fff;
    color: #606266;
    font-size: 12px;
    cursor: pointer;
    transition:
      border-color 0.2s,
      color 0.2s,
      background-color 0.2s;

    &:hover:not(:disabled) {
      border-color: #409eff;
      color: #409eff;
      background: #f5faff;
    }

    &:disabled {
      color: #c0c4cc;
      background: #f5f7fa;
      cursor: not-allowed;
    }
  }
}

.delete-button {
  width: 100%;
  height: 34px;
  margin-top: 10px;
  border: 1px solid #fbc4c4;
  border-radius: 6px;
  background: #fff;
  color: #f56c6c;
  font-size: 12px;
  cursor: pointer;
  transition:
    border-color 0.2s,
    background-color 0.2s,
    color 0.2s;

  &:hover {
    border-color: #f56c6c;
    background: #fef0f0;
    color: #f56c6c;
  }
}
</style>