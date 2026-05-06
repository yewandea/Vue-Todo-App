import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authService, type User } from '../services/authService'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref<boolean>(true)
  const isAuthenticated = ref<boolean>(false)

  const checkAuth = async () => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const userData = await authService.getMe()
        user.value = userData
        isAuthenticated.value = true
      } catch (error: any) {
        localStorage.removeItem('token')
        isAuthenticated.value = false
      }
    }
    loading.value = false
  }

  const login = async (credentials: { email: string; password: string }) => {
    const data = await authService.login(credentials)
    user.value = data.user
    isAuthenticated.value = true
    return data
  }

  const register = async (userData: { name: string; email: string; password: string }) => {
    const data = await authService.register(userData)
    user.value = data.user
    isAuthenticated.value = true
    return data
  }

  const logout = async () => {
    await authService.logout()
    user.value = null
    isAuthenticated.value = false
  }

  return { user, loading, isAuthenticated, checkAuth, login, register, logout }
})
