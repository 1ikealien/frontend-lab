import { computed, ref, toRaw } from 'vue'
import type { FieldType, FormField, FormSchema } from '@/types/form'

export function useFormSchema() {
  const schema = ref<FormSchema>({
    fields: [],
  })

  const undoStack = ref<FormSchema[]>([])
  const redoStack = ref<FormSchema[]>([])

  const selectedFieldId = ref<string | null>(null)

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
  }
}