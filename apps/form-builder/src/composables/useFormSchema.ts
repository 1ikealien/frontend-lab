import { computed, ref, toRaw } from 'vue'
import type { FormSchema } from '@/types/form'

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
  }
}