<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { taskService, type Task } from '../services/taskService'
import BaseButton from '../components/ui/BaseButton.vue'
import BaseSpinner from '../components/ui/BaseSpinner.vue'
import { format } from 'date-fns'

const route = useRoute()
const router = useRouter()
const id = route.params.id as string

const {
  data: task,
  isLoading,
  error,
} = useQuery<Task>({
  queryKey: ['task', id],
  queryFn: () => taskService.getTask(id),
})

const statusBadge: Record<string, string> = {
  DONE: 'bg-green-100 text-green-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  TODO: 'bg-yellow-100 text-yellow-700',
}

const statusText: Record<string, string> = {
  DONE: 'Completed',
  IN_PROGRESS: 'In Progress',
  TODO: 'To Do',
}
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <div class="mb-6">
      <BaseButton variant="ghost" @click="router.push('/')">← Back to Tasks</BaseButton>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center min-h-[400px]">
      <BaseSpinner size="lg" />
    </div>

    <div v-else-if="error" class="border rounded-lg p-8 text-center">
      <p class="text-red-600 mb-4">Error loading task</p>
      <BaseButton @click="router.push('/')">Back to Tasks</BaseButton>
    </div>

    <div v-else-if="task" class="border rounded-lg p-6 space-y-4">
      <div class="flex items-center gap-3">
        <span
          class="px-3 py-1 rounded-full text-sm font-medium"
          :class="statusBadge[task.status] || statusBadge['TODO']"
        >
          {{ statusText[task.status] || 'To Do' }}
        </span>
      </div>
      <h1 class="text-3xl font-bold">{{ task.name }}</h1>
      <p v-if="task.description" class="text-gray-600">{{ task.description }}</p>
      <div v-if="task.createdAt" class="text-sm text-gray-500">
        Created: {{ format(new Date(task.createdAt), 'PPP') }}
      </div>
      <div v-if="task.updatedAt" class="text-sm text-gray-500">
        Updated: {{ format(new Date(task.updatedAt), 'PPpp') }}
      </div>
      <div class="text-xs text-gray-400 pt-4 border-t">Task ID: {{ task.id }}</div>
    </div>
  </div>
</template>
