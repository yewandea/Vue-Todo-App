<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import BaseInput from '../components/ui/BaseInput.vue'
import BaseButton from '../components/ui/BaseButton.vue'

const router = useRouter()
const authStore = useAuthStore()

const email = ref<string>('')
const password = ref<string>('')
const error = ref<string>('')
const isLoading = ref<boolean>(false)

const handleSubmit = async () => {
  error.value = ''
  isLoading.value = true
  try {
    await authStore.login({ email: email.value, password: password.value })
    router.push('/')
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Login failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="w-full max-w-md border rounded-lg p-8">
      <h2 class="text-2xl font-bold text-center mb-6">Login to Your Account</h2>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div v-if="error" class="p-3 rounded bg-red-50 text-red-600 text-sm">
          {{ error }}
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Email</label>
          <BaseInput
            v-model="email"
            type="email"
            placeholder="you@example.com"
            :required="true"
            autocomplete="email"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Password</label>
          <BaseInput
            v-model="password"
            type="password"
            placeholder="••••••••"
            :required="true"
            autocomplete="current-password"
          />
        </div>
        <BaseButton type="submit" :disabled="isLoading" class="w-full">
          {{ isLoading ? 'Logging in...' : 'Login' }}
        </BaseButton>
        <p class="text-center text-sm text-gray-500">
          Don't have an account?
          <RouterLink to="/register" class="text-black hover:underline">Sign up</RouterLink>
        </p>
      </form>
    </div>
  </div>
</template>
