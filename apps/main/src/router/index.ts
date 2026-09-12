import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/views/Home.vue'
import Projects from '@/views/Projects.vue'
import Resume from '@/views/Resume.vue'
import TechLab from '@/views/TechLab.vue'
import NotFound from '@/views/NotFound.vue'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: Home
  },
  {
    path: '/projects',
    component: Projects
  },
  {
    path: '/resume',
    component: Resume
  },
  {
    path: '/techLab',
    component: TechLab
  },
  {
    path: '/:pathMatch(.*)*',
    component: NotFound
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router