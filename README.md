# Frontend Lab

> 个人前端技术实验室 —— 基于 Vue 3 + TypeScript + Vite + Qiankun + pnpm Monorepo 构建的前端工程实践项目。

Frontend Lab 将前端学习过程中遇到的实际问题转化为可运行的实验项目，重点实践 **前端工程化、微前端、浏览器能力以及复杂交互场景**。

当前包含一个主应用和两个核心子应用：

- **Main**：主应用与微前端容器
- **File Upload**：大文件上传实验
- **Form Builder**：可视化表单设计器

---

## 项目架构

```text
frontend-lab/
├── apps/
│   ├── main/                 # 主应用
│   ├── file-upload/          # 大文件上传子应用
│   └── form-builder/         # 表单设计器子应用
│
├── pnpm-workspace.yaml
├── package.json
└── README.md
```

整体采用 **pnpm Monorepo + Qiankun 微前端**：

```text
                         ┌─────────────────────┐
                         │      Main :3000     │
                         │       主应用         │
                         └──────────┬──────────┘
                                    │
                                  Qiankun
                         ┌──────────┴──────────┐
                         │                     │
                ┌────────▼────────┐   ┌────────▼────────┐
                │ File Upload     │   │ Form Builder    │
                │     :3001       │   │      :3002      │
                └─────────────────┘   └─────────────────┘
```

两个子应用均支持：

- 独立运行
- 作为 Qiankun 子应用运行

---

## 技术栈

| 技术                | 用途              |
| ------------------- | ----------------- |
| Vue 3               | 前端框架          |
| TypeScript          | 类型系统          |
| Vite                | 开发与构建        |
| Vue Router          | 路由管理          |
| Pinia               | 状态管理          |
| Qiankun             | 微前端            |
| vite-plugin-qiankun | 子应用适配        |
| Element Plus        | UI 组件库         |
| pnpm                | 包管理与 Monorepo |
| Sass                | 样式开发          |

---

# Main

主应用负责页面组织、导航、状态管理以及微前端子应用加载。

主要页面：

```text
/home
/projects
/resume
/tech-Lab

/lab/upload
/lab/form
```

其中 `/lab/upload` 和 `/lab/form` 分别对应两个 Qiankun 子应用。

主应用使用：

- Vue Router
- Pinia
- Element Plus
- Qiankun

---

# 核心实验一：大文件上传

## File Upload

大文件上传是项目的第一个核心实验，围绕真实文件上传场景实践：

- 文件分片
- SHA-256 Hash
- 秒传
- 断点续传
- 并发控制
- 失败重试
- IndexedDB
- Web Worker
- 上传进度

---

## 文件分片

使用 `Blob.slice()` 将文件拆分为固定大小的 Chunk。

```text
File
 │
 ├── Chunk 0
 ├── Chunk 1
 ├── Chunk 2
 ├── ...
 └── Chunk N
```

每个 Chunk 保存对应索引，用于后续上传、重试以及断点恢复。

---

## Hash 与秒传

使用 Web Crypto API 计算文件 SHA-256 Hash，并将 Hash 作为文件标识之一。

Hash 计算放在 Web Worker 中执行：

```text
File
  ↓
Web Worker
  ↓
SHA-256
  ↓
File Hash
```

上传前根据 Hash 查询文件状态：

```text
计算 Hash
   ↓
查询文件状态
   ├── 已存在 → 秒传
   └── 不存在 → 分片上传
```

避免重复上传已经存在的文件。

---

## 断点续传

上传过程中记录已经完成的 Chunk。

当上传任务中断后：

```text
重新选择文件
      ↓
获取文件 Hash
      ↓
获取已上传 Chunk
      ↓
过滤已完成分片
      ↓
继续上传剩余 Chunk
```

因此无需重新上传已经完成的分片。

---

## 并发控制与失败重试

通过任务队列控制 Chunk 上传，并发数设置为 **3**。

```text
Chunk 0 ──┐
Chunk 1 ──┼── 并发上传
Chunk 2 ──┘

Chunk 3
Chunk 4
Chunk 5
...
```

单个 Chunk 上传失败后进行重试，最多重试 **3 次**。

这种方式可以避免同时创建大量请求，同时降低单个分片失败对整个上传任务的影响。

---

## IndexedDB

使用 IndexedDB 保存上传任务相关状态，用于支持：

- 上传任务持久化
- 已完成分片记录
- 页面刷新后的状态恢复

将内存状态与浏览器持久化能力结合，用于实践断点续传场景。

---

# 核心实验二：可视化表单设计器

## Form Builder

Form Builder 是项目的第二个核心实验，用于实践：

- Schema 驱动
- 动态组件
- Drag & Drop
- 属性编辑
- 表单校验
- Undo / Redo
- JSON 导入 / 导出
- 表单预览

支持字段：

```text
Input
Select
Radio
Checkbox
Date
```

---

## Schema 驱动

表单使用统一 Schema 描述：

```ts
interface FormField {
  id: string;
  type: FieldType;
  field: string;
  label: string;
  props?: FieldProps;
  rules?: FieldRule[];
}

interface FormSchema {
  fields: FormField[];
}
```

Schema 同时作为：

- 表单画布的数据来源
- 属性编辑的数据模型
- 预览的数据来源
- JSON 导入 / 导出的数据结构

使不同模块围绕同一份数据模型工作。

---

## 可视化编辑

采用三栏结构：

```text
┌──────────────┬────────────────────┬──────────────────┐
│  组件物料区   │      表单画布       │     属性编辑区    │
├──────────────┼────────────────────┼──────────────────┤
│ Input        │                    │ Label            │
│ Select       │     Field 1        │ Field            │
│ Radio        │     Field 2        │ Placeholder      │
│ Checkbox     │     Field 3        │ Options          │
│ Date         │                    │ Rules            │
└──────────────┴────────────────────┴──────────────────┘
```

支持：

- 点击添加字段
- 拖拽添加字段
- 拖拽调整字段顺序
- 选择字段
- 编辑字段属性
- 编辑选项
- 配置校验规则
- 表单预览

---

## 动态字段渲染

根据 `FormField.type` 动态选择对应字段组件：

```text
FormField.type
      ↓
FieldRenderer
      ├── InputField
      ├── SelectField
      ├── RadioField
      ├── CheckboxField
      └── DateField
```

将不同字段类型的渲染逻辑拆分为独立组件，降低组件之间的耦合。

---

## Undo / Redo

表单编辑过程中通过 Schema Snapshot 保存历史状态。

```text
修改 Schema
     ↓
保存 Snapshot
     ↓
┌────┴────┐
Undo     Redo
```

使用 `undoStack` 和 `redoStack` 管理编辑历史。

---

## JSON 导入 / 导出

当前表单 Schema 可以导出为 JSON，也可以从 JSON 恢复表单。

```text
Form Builder
     ↓
FormSchema
     ↓
   JSON
```

```text
   JSON
     ↓
FormSchema
     ↓
Form Builder
```

方便表单配置的保存、恢复和调试。

---

# Qiankun 微前端

项目使用 Qiankun 将 File Upload 和 Form Builder 接入 Main。

主应用负责注册和启动子应用：

```ts
registerMicroApps(microApps);

start({
  prefetch: false,
  singular: true,
});
```

整体结构：

```text
Main
 ├── File Upload
 └── Form Builder
```

两个子应用同时支持独立运行，因此可以：

- 单独开发和调试
- 独立构建
- 集成到 Main 中运行

---

# Monorepo

项目使用 pnpm Workspace 管理多个应用：

```text
frontend-lab
└── apps/
    ├── main
    ├── file-upload
    └── form-builder
```

根目录统一执行：

```bash
pnpm dev
```

启动工作区中的开发服务。

---

# 核心技术实践

| 方向       | 实践内容                                      |
| ---------- | --------------------------------------------- |
| Vue 3      | Composition API、组件化                       |
| TypeScript | Schema、字段、属性类型约束                    |
| Qiankun    | 主应用与子应用集成                            |
| Monorepo   | pnpm Workspace、多应用管理                    |
| 大文件上传 | 分片、Hash、秒传、断点续传                    |
| 浏览器能力 | File、Blob、Web Worker、IndexedDB、Web Crypto |
| 动态表单   | Schema、动态组件、属性编辑                    |
| 状态管理   | Pinia、Undo / Redo                            |
| UI         | Element Plus、Sass                            |
| 工程协作   | Git Feature Branch、Pull Request              |

---

# 本地运行

## 环境

```text
Node.js 20+
pnpm 9+
```

## 安装

```bash
git clone https://github.com/1ikealien/frontend-lab.git

cd frontend-lab

pnpm install
```

## 启动

```bash
pnpm dev
```

主要服务：

```text
Main          → 3000
File Upload   → 3001
Form Builder  → 3002
```

进入 Main 后可以访问：

```text
/lab/upload
/lab/form
```

---

## 子应用独立运行

### File Upload

```bash
cd apps/file-upload
pnpm dev
```

### Form Builder

```bash
cd apps/form-builder
pnpm dev
```

---

## 构建

各应用均提供：

```bash
pnpm build
```

用于执行 TypeScript 检查和 Vite 生产构建。

---

# Author

Frontend Developer / Web Frontend

GitHub：

`1ikealien`

---

> Frontend Lab —— 把学过的知识真正写出来，把遇到的问题真正解决掉。
