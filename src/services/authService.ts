import { api } from './api'

export interface User {
  id: string
  name: string
  email: string
}

interface UserData {
  name: string
  email: string
  password: string
}

interface Credentials {
  email: string
  password: string
}

interface AuthResponse {
  token: string
  user: User
}

export const authService = {
  register: async (userData: UserData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', userData)
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
    }
    return response.data
  },

  login: async (credentials: Credentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials)
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
    }
    return response.data
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout')
    } finally {
      localStorage.removeItem('token')
    }
  },

  getMe: async (): Promise<User> => {
    const response = await api.get('/auth/me')
    return response.data
  },
}
