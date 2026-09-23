import { computed, ref, toRaw } from 'vue'
import type { FieldType, FormField, FormSchema } from '@/types/form'

export function useFormSchema() {
  const schema = ref<FormSchema>({
    fields: [],
  })

  const undoStack = ref<FormSchema[]>([])
  const redoStack = ref<FormSchema[]>([])

  const selectedFieldId = ref<string | null>(null)

  const editingSnapshots = new Map<string, FormSchema>()

  const selectedField = computed(() => {
    return schema.value.fields.find(
      field => field.id === selectedFieldId.value
    )
  })

  const selectedFieldIndex = computed(() => {
    return schema.value.fields.findIndex(
      field => field.id === selectedFieldId.value
    )
  })

  const canMoveUp = computed(() => {
    return selectedFieldIndex.value > 0
  })

  const canMoveDown = computed(() => {
    return (
      selectedFieldIndex.value >= 0 && selectedFieldIndex.value < schema.value.fields.length - 1
    )
  })

  function recordHistory() {
    const snapshot = structuredClone(toRaw(schema.value))

    undoStack.value.push(snapshot)

    redoStack.value = []

    console.log('undoStack:', undoStack.value)
  }

  function undo() {
    if (undoStack.value.length === 0) {
      return
    }

    editingSnapshots.clear()

    const current = structuredClone(toRaw(schema.value))

    redoStack.value.push(current)

    const previous = undoStack.value.pop()

    if (!previous) {
      return
    }

    schema.value = structuredClone(toRaw(previous))
  }

  function redo() {
    if (redoStack.value.length === 0) {
      return
    }

    editingSnapshots.clear()

    const current = structuredClone(toRaw(schema.value))

    undoStack.value.push(current)

    const next = redoStack.value.pop()

    if (!next) {
      return
    }

    schema.value = structuredClone(toRaw(next))
  }

  function addField(type: FieldType) {
    recordHistory()

    const field: FormField = {
      id: crypto.randomUUID(),
      type,
      field: `field_${schema.value.fields.length + 1}`,
      label: '未命名字段',
      props: {},
    }

    if (type === 'input') {
      field.props = {
        placeholder: '请输入',
      }
    }

    if (
      type === 'select' ||
      type === 'radio' ||
      type === 'checkbox'
    ) {
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
  }

  function moveFieldUp() {
    const index = schema.value.fields.findIndex(
      field => field.id === selectedFieldId.value
    )

    if (index <= 0) {
      return
    }

    recordHistory()

    const fields = schema.value.fields

    const current = fields[index]
    const previous = fields[index - 1]

    fields[index] = previous
    fields[index - 1] = current
  }

  function moveFieldDown() {
    const index = schema.value.fields.findIndex(
      field => field.id === selectedFieldId.value
    )

    if (index === -1 || index >= schema.value.fields.length - 1) {
      return
    }

    recordHistory()

    const fields = schema.value.fields

    const current = fields[index]
    const next = fields[index + 1]

    fields[index] = next
    fields[index + 1] = current
  }

  function moveField(draggingFieldId: string, targetFieldId: string, position: 'before' | 'after') {
    if (draggingFieldId === targetFieldId) {
      return
    }

    const fields = schema.value.fields

    const draggingIndex = fields.findIndex(
      field => field.id === draggingFieldId
    )

    const targetIndex = fields.findIndex(
      field => field.id === targetFieldId
    )

    if (draggingIndex === -1 || targetIndex === -1) {
      return
    }

    recordHistory()

    const [draggingField] = fields.splice(draggingIndex, 1)

    const newTargetIndex = fields.findIndex(
      field => field.id === targetFieldId
    )

    const insertIndex = position === 'before' ? newTargetIndex : newTargetIndex + 1

    fields.splice(insertIndex, 0, draggingField)
  }

  function moveFieldToEnd(draggingFieldId: string) {
    const fields = schema.value.fields

    const draggingIndex = fields.findIndex(
      field => field.id === draggingFieldId
    )

    if (draggingIndex === -1) {
      return
    }

    if (draggingIndex === fields.length - 1) {
      return
    }

    recordHistory()

    const [draggingField] = fields.splice(draggingIndex, 1)

    fields.push(draggingField)
  }

  function deleteField() {
    const index = schema.value.fields.findIndex(
      field => field.id === selectedFieldId.value
    )

    if (index === -1) {
      return
    }

    recordHistory()

    schema.value.fields.splice(index, 1)

    selectedFieldId.value = null
  }

  function  updateFieldLabel(fieldId: string, label: string) {
    updateField(fieldId, field => {
      field.label = label
    })
  }

  function updateFieldDisabled(fieldId: string, disabled: boolean)
  {
    updateField(
      fieldId,
      field => {
        if (!field.props) {
          field.props = {}
        }

        field.props.disabled = disabled
      }
    )
  }

  function updateFieldPlaceholder(fieldId: string, placeholder: string) {
    updateField(
      fieldId,
      field => {
        if (!field.props) {
          field.props = {}
        }

        field.props.placeholder = placeholder
      },
      `${fieldId}:placeholder`
    )
  }

  function updateFieldRequired(fieldId: string, required: boolean) {
    const field = schema.value.fields.find(
      field => field.id === fieldId
    )

    if (!field) {
      return
    }

    recordHistory()

    if (required) {
      field.rules = [
        {
          required: true,
          message: '该字段不能为空',
        },
      ]
      return
    }
    field.rules = undefined
  }

  function updateFieldValidationMessage(fieldId: string, message: string) {
    updateField(
      fieldId,
      field => {
        const rule = field.rules?.find(
          rule => rule.required
        )

        if (!rule) {
          return
        }

        rule.message = message
      },
      `${fieldId}:validation-message`
    )
  }

  function updateFieldName(fieldId: string, fieldName: string) {
    updateField(
      fieldId,
      field => {
        field.field = fieldName
      },
      `${fieldId}:field-name`
    )
  }

  function updateOptionLabel(
    fieldId: string,
    optionIndex: number,
    label: string
  ) {
    updateField(
      fieldId,
      field => {
        const option = field.props?.options?.[optionIndex]
        if (!option) {
          return
        }
        option.label = label
      },
      `${fieldId}:option-label:${optionIndex}`
    )
  }

  function updateOptionValue(fieldId: string, optionIndex: number, value: string) {
    updateField(
      fieldId,
      field => {
        const option = field.props?.options?.[optionIndex]

        if (!option) {
          return
        }

        option.value = value
      },
      `${fieldId}:option-value:${optionIndex}`
    )
  }

  function updateField(
    fieldId: string,
    updater: (field: FormField) => void,
    editKey = fieldId
  ) {
    const field = schema.value.fields.find(
      field => field.id === fieldId
    )

    if (!field) {
      return
    }

    const before = structuredClone(
      toRaw(schema.value)
    )

    updater(field)

    const after = structuredClone(
      toRaw(schema.value)
    )

    if (
      JSON.stringify(before) === JSON.stringify(after)
    ) {
      return
    }

    if (!editingSnapshots.has(editKey)) {
      undoStack.value.push(before)
      redoStack.value = []
      editingSnapshots.set(editKey, before)
    }
  }

  function endFieldEdit(fieldId: string, editKey = fieldId) {
    const startSnapshot = editingSnapshots.get(editKey)

    if (!startSnapshot) {
      return
    }

    const currentSnapshot = structuredClone(
      toRaw(schema.value)
    )

    const isUnchanged = JSON.stringify(startSnapshot) === JSON.stringify(currentSnapshot)

    if(isUnchanged) {
      undoStack.value.pop()
    }
    editingSnapshots.delete(editKey)
  }

  function addOption(fieldId: string) {
    const field = schema.value.fields.find(
      field => field.id === fieldId
    )

    if (!field?.props?.options) {
      return
    }

    recordHistory()

    const options = field.props.options

    options.push({
      label: `选项 ${options.length + 1}`,
      value: `option${options.length + 1}`
    })
  }

  function removeOption(fieldId: string, optionIndex: number) {
    const field = schema.value.fields.find(
      field => field.id === fieldId
    )

    if (!field?.props?.options) {
      return
    }

    if (!field.props.options[optionIndex]) {
      return
    }

    recordHistory()

    field.props.options.splice(optionIndex, 1)
  }

  return {
    schema,
    undoStack,
    redoStack,
    selectedFieldId,
    selectedField,
    selectedFieldIndex,
    canMoveUp,
    canMoveDown,
    recordHistory,
    undo,
    redo,
    addField,
    moveFieldUp,
    moveFieldDown,
    moveField,
    moveFieldToEnd,
    deleteField,
    updateFieldLabel,
    updateField,
    endFieldEdit,
    updateFieldDisabled,
    updateFieldPlaceholder,
    updateFieldRequired,
    updateFieldValidationMessage,
    updateFieldName,
    updateOptionLabel,
    updateOptionValue,
    addOption,
    removeOption,
  }
}