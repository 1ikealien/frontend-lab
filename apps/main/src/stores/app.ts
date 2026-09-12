import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    userName: 'likealien'
  }),
  getters: {
    displayName: (state) => {
      return `你好，${state.userName}`
    }
  },
  actions: {
    setUserName(name: string) {
      this.userName = name
    }
  }
})