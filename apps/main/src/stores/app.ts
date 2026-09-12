type Theme = 'light' | 'dark'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    userName: 'likealien',
    theme: 'light' as Theme
  }),
  getters: {
    displayName: (state) => {
      return `你好，${state.userName}`
    }
  },
  actions: {
    setUserName(name: string) {
      this.userName = name
    },
    setTheme(theme: Theme) {
      this.theme = theme
    },
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
    }
  }
})
