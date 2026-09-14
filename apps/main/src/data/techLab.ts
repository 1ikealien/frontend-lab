export const techLabData = [
  {
    name: 'File Upload',
    description: '基于浏览器 File API 的大文件上传实验',
    techStack: [
      'File API',
      'Blob',
      'Promise',
      'Web Worker',
    ],
    demo: '/lab/upload',
    features: [
      '文件切片',
      '上传进度管理',
      '断点续传',
    ],
  },
  {
    name: 'Form Builder',
    description: '基于 Vue3 的可视化动态表单生成器实验',
    techStack: [
      'Vue3',
      'TypeScript',
      'Drag & Drop',
      'JSON Schema',
    ],
    demo: '/lab/form',
    features: [
      '拖拽生成表单',
      '动态组件渲染',
      '表单配置导出',
    ],
  },
  {
    name: 'Web Worker Demo',
    description: '探索浏览器多线程能力的性能优化实验',
    techStack: [
      'Web Worker',
      'JavaScript',
      'PostMessage',
      'Performance API',
    ],
    demo: '/lab/worker',
    features: [
      '耗时任务拆分',
      '主线程通信',
      '页面性能优化',
    ],
  },
]