import { api } from './api'

export interface Task {
  id: string
  title: string
  name: string
  description: string
  completed: boolean
  status: string
  createdAt: string
  updatedAt?: string
  priority?: string
  start?: string
  end?: string
  duration?: number
}

interface TaskPayload {
  name?: string
  description?: string
  status?: string
}

export const taskService = {
  getTasks: async (page: number, limit: number, search: string, status: string) => {
    try {
      const params = new URLSearchParams()
      params.append('page', page.toString())
      params.append('limit', limit.toString())
      if (search) params.append('search', search)
      if (status) params.append('status', status)
      const response = await api.get('/tasks?' + params.toString())
      return response.data
    } catch (error: any) {
      console.error('Get tasks error:', error)
      throw error
    }
  },

  getTask: async (id: string) => {
    try {
      const response = await api.get('/tasks/' + id)
      return response.data
    } catch (error: any) {
      console.error('Get task error:', error)
      throw error
    }
  },

  createTask: async (task: Partial<Task>) => {
    try {
      const payload = {
        name: task.title,
        description: task.description,
        status: task.completed ? 'DONE' : 'TODO',
      }
      const response = await api.post('/tasks', payload)
      return response.data
    } catch (error: any) {
      console.error('Create task error:', error)
      throw error
    }
  },

  updateTask: async (id: string, task: Partial<Task>) => {
    try {
      const payload: TaskPayload = {}
      if (task.name) payload.name = task.name
      if (task.title) payload.name = task.title
      if (task.description !== undefined) payload.description = task.description
      if (task.status) payload.status = task.status
      const response = await api.patch('/tasks/' + id, payload)
      return response.data
    } catch (error: any) {
      console.error('Update task error:', error)
      throw error
    }
  },

  deleteTask: async (id: string) => {
    try {
      const response = await api.delete('/tasks/' + id)
      return response.data
    } catch (error: any) {
      console.error('Delete task error:', error)
      throw error
    }
  },
}
