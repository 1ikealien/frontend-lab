export type FieldType =
  | 'input'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'date'

export interface FieldOption {
  label: string
  value: string
}

export interface FormField {
  id: string
  type: FieldType
  field: string
  label: string
  props?: FieldProps
  rules?: FieldRule[]
}

export interface FieldProps {
  placeholder?: string
  disabled?: boolean
  options?: FieldOption[]
}

export interface FieldRule {
  required?: boolean
  message?: string
}

export interface FormSchema {
  fields: FormField[]
}

// const schema: FormSchema = {
//   fields: [
//     {
//       id: "uuid-1",
//       type: "input",
//       field: "username",
//       label: "用户名",
//       props: { placeholder: "请输入用户名" },
//       rules: [{ required: true, message: "用户名不能为空" }]
//     },
//     {
//       id: "uuid-2",
//       type: "radio",
//       field: "gender",
//       label: "性别",
//       props: {
//         options: [
//           { label: "男", value: "male" },
//           { label: "女", value: "female" }
//         ]
//       },
//       rules: [{ required: true, message: "请选择性别" }]
//     }
//   ]
// }
