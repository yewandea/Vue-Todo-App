<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { taskService, type Task } from '../services/taskService'
import BaseButton from '../components/ui/BaseButton.vue'
import BaseInput from '../components/ui/BaseInput.vue'
import BaseSpinner from '../components/ui/BaseSpinner.vue'
import BaseModal from '../components/ui/BaseModal.vue'

const router = useRouter()
const queryClient = useQueryClient()

const page = ref<number>(1)
const search = ref<string>('')
const filter = ref<string>('')
const isCreateModalOpen = ref<boolean>(false)
const isEditModalOpen = ref<boolean>(false)
const isDeleteModalOpen = ref<boolean>(false)
const selectedTask = ref<Task | null>(null)
const newTaskTitle = ref<string>('')
const newTaskDescription = ref<string>('')
const editTaskTitle = ref<string>('')
const editTaskDescription = ref<string>('')
const editTaskStatus = ref<string>('')

const { data, isLoading, error } = useQuery({
  queryKey: ['tasks', page, search, filter],
  queryFn: () => taskService.getTasks(page.value, 10, search.value, filter.value),
})

const createMutation = useMutation({
  mutationFn: taskService.createTask,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] })
    isCreateModalOpen.value = false
    newTaskTitle.value = ''
    newTaskDescription.value = ''
  },
  onError: (error: any) => {
    alert('Failed to create task: ' + (error.response?.data?.message || error.message))
  },
})

const updateMutation = useMutation({
  mutationFn: ({ id, task }: { id: string; task: Partial<Task> }) =>
    taskService.updateTask(id, task),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] })
    isEditModalOpen.value = false
    selectedTask.value = null
  },
  onError: (error: any) => {
    alert('Failed to update task: ' + (error.response?.data?.message || error.message))
  },
})

const deleteMutation = useMutation({
  mutationFn: taskService.deleteTask,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] })
    isDeleteModalOpen.value = false
    selectedTask.value = null
  },
  onError: (error: any) => {
    alert('Failed to delete task: ' + (error.response?.data?.message || error.message))
  },
})

const handleCreateTask = () => {
  createMutation.mutate({
    title: newTaskTitle.value,
    description: newTaskDescription.value,
    completed: false,
  })
}

const handleEditTask = () => {
  if (!selectedTask.value) return
  updateMutation.mutate({
    id: selectedTask.value.id,
    task: {
      name: editTaskTitle.value,
      description: editTaskDescription.value,
      status: editTaskStatus.value,
    },
  })
}

const handleToggleComplete = (task: Task) => {
  const newStatus = task.status === 'DONE' ? 'TODO' : 'DONE'
  updateMutation.mutate({
    id: task.id,
    task: { name: task.name, description: task.description, status: newStatus },
  })
}

const openEditModal = (task: Task) => {
  selectedTask.value = task
  editTaskTitle.value = task.name
  editTaskDescription.value = task.description || ''
  editTaskStatus.value = task.status
  isEditModalOpen.value = true
}

const openDeleteModal = (task: Task) => {
  selectedTask.value = task
  isDeleteModalOpen.value = true
}

const tasks = () => data.value?.data || []
const totalPages = () => data.value?.meta?.totalPages || 1
const currentPage = () => data.value?.meta?.page || page.value
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2">My Tasks</h1>
      <p class="text-gray-500">Manage your todos efficiently</p>
    </div>

    <div class="mb-6 flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <BaseInput v-model="search" type="text" placeholder="Search tasks..." />
      </div>
      <div class="flex gap-2 flex-wrap">
        <BaseButton
          :variant="filter === '' ? 'default' : 'outline'"
          @click="
            () => {
              filter = ''
              page = 1
            }
          "
          >All</BaseButton
        >
        <BaseButton
          :variant="filter === 'DONE' ? 'default' : 'outline'"
          @click="
            () => {
              filter = 'DONE'
              page = 1
            }
          "
          >Completed</BaseButton
        >
        <BaseButton
          :variant="filter === 'TODO' ? 'default' : 'outline'"
          @click="
            () => {
              filter = 'TODO'
              page = 1
            }
          "
          >To Do</BaseButton
        >
        <BaseButton
          :variant="filter === 'IN_PROGRESS' ? 'default' : 'outline'"
          @click="
            () => {
              filter = 'IN_PROGRESS'
              page = 1
            }
          "
          >In Progress</BaseButton
        >
      </div>
      <BaseButton @click="isCreateModalOpen = true">+ New Task</BaseButton>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center min-h-[400px]">
      <BaseSpinner size="lg" />
    </div>

    <div v-else-if="error" class="border rounded-lg p-8 text-center">
      <p class="text-red-600">Unable to load tasks. Please try again.</p>
      <BaseButton @click="() => window.location.reload()" class="mt-4">Retry</BaseButton>
    </div>

    <div v-else class="space-y-4 mb-6">
      <div v-if="tasks().length === 0" class="border rounded-lg p-8 text-center">
        <p class="text-gray-500">No tasks found. Create one to get started!</p>
      </div>
      <div
        v-for="task in tasks()"
        :key="task.id"
        class="border rounded-lg p-6 hover:shadow-md transition-shadow"
      >
        <div class="flex items-start gap-4">
          <button
            @click="handleToggleComplete(task)"
            class="mt-1 w-6 h-6 rounded border-2 flex items-center justify-center"
            :class="task.status === 'DONE' ? 'bg-black border-black' : 'border-gray-400'"
          >
            <span v-if="task.status === 'DONE'" class="text-white text-xs">✓</span>
          </button>
          <div class="flex-1">
            <button
              @click="router.push('/tasks/' + task.id)"
              class="text-lg font-semibold hover:underline text-left"
              :class="task.status === 'DONE' ? 'line-through text-gray-400' : ''"
            >
              {{ task.name }}
            </button>
            <p v-if="task.description" class="text-sm text-gray-500 mt-1">
              {{ task.description }}
            </p>
          </div>
          <div class="flex gap-2">
            <BaseButton variant="ghost" @click="openEditModal(task)">✏️</BaseButton>
            <BaseButton variant="ghost" @click="openDeleteModal(task)">🗑️</BaseButton>
          </div>
        </div>
      </div>
    </div>

    <div v-if="totalPages() > 1" class="flex items-center justify-center gap-4 py-4">
      <BaseButton
        variant="outline"
        :disabled="currentPage() === 1"
        @click="page = Math.max(1, page - 1)"
        >← Previous</BaseButton
      >
      <span class="text-sm">Page {{ currentPage() }} of {{ totalPages() }}</span>
      <BaseButton
        variant="outline"
        :disabled="currentPage() === totalPages()"
        @click="page = Math.min(totalPages(), page + 1)"
        >Next →</BaseButton
      >
    </div>

    <!-- Create Modal -->
    <BaseModal
      :is-open="isCreateModalOpen"
      title="Create New Task"
      @close="isCreateModalOpen = false"
    >
      <form @submit.prevent="handleCreateTask" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2">Title</label>
          <BaseInput v-model="newTaskTitle" placeholder="Enter task title" :required="true" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Description (optional)</label>
          <textarea
            v-model="newTaskDescription"
            placeholder="Enter task description"
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <div class="flex gap-2 justify-end">
          <BaseButton variant="outline" type="button" @click="isCreateModalOpen = false"
            >Cancel</BaseButton
          >
          <BaseButton type="submit" :disabled="createMutation.isPending.value">
            {{ createMutation.isPending.value ? 'Creating...' : 'Create Task' }}
          </BaseButton>
        </div>
      </form>
    </BaseModal>

    <!-- Edit Modal -->
    <BaseModal :is-open="isEditModalOpen" title="Edit Task" @close="isEditModalOpen = false">
      <form @submit.prevent="handleEditTask" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2">Title</label>
          <BaseInput v-model="editTaskTitle" placeholder="Enter task title" :required="true" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Description (optional)</label>
          <textarea
            v-model="editTaskDescription"
            placeholder="Enter task description"
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Status</label>
          <select
            v-model="editTaskStatus"
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Completed</option>
          </select>
        </div>
        <div class="flex gap-2 justify-end">
          <BaseButton variant="outline" type="button" @click="isEditModalOpen = false"
            >Cancel</BaseButton
          >
          <BaseButton type="submit" :disabled="updateMutation.isPending.value">
            {{ updateMutation.isPending.value ? 'Saving...' : 'Save Changes' }}
          </BaseButton>
        </div>
      </form>
    </BaseModal>

    <!-- Delete Modal -->
    <BaseModal :is-open="isDeleteModalOpen" title="Delete Task" @close="isDeleteModalOpen = false">
      <div class="space-y-4">
        <p class="text-gray-500">
          Are you sure you want to delete "{{ selectedTask?.name }}"? This cannot be undone.
        </p>
        <div class="flex gap-2 justify-end">
          <BaseButton variant="outline" @click="isDeleteModalOpen = false">Cancel</BaseButton>
          <BaseButton
            variant="destructive"
            :disabled="deleteMutation.isPending.value"
            @click="selectedTask && deleteMutation.mutate(selectedTask.id)"
          >
            {{ deleteMutation.isPending.value ? 'Deleting...' : 'Delete' }}
          </BaseButton>
        </div>
      </div>
    </BaseModal>
  </div>
</template>
