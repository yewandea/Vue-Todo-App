<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import BaseInput from '../components/ui/BaseInput.vue'
import BaseButton from '../components/ui/BaseButton.vue'

const router = useRouter()
const authStore = useAuthStore()

const name = ref<string>('')
const email = ref<string>('')
const password = ref<string>('')
const confirmPassword = ref<string>('')
const error = ref<string>('')
const isLoading = ref<boolean>(false)

const handleSubmit = async () => {
  error.value = ''
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }
  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters'
    return
  }
  isLoading.value = true
  try {
    await authStore.register({ name: name.value, email: email.value, password: password.value })
    router.push('/')
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Registration failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="w-full max-w-md border rounded-lg p-8">
      <h2 class="text-2xl font-bold text-center mb-6">Create an Account</h2>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div v-if="error" class="p-3 rounded bg-red-50 text-red-600 text-sm">
          {{ error }}
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Name</label>
          <BaseInput v-model="name" type="text" placeholder="John Doe" :required="true" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Email</label>
          <BaseInput v-model="email" type="email" placeholder="you@example.com" :required="true" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Password</label>
          <BaseInput v-model="password" type="password" placeholder="••••••••" :required="true" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Confirm Password</label>
          <BaseInput
            v-model="confirmPassword"
            type="password"
            placeholder="••••••••"
            :required="true"
          />
        </div>
        <BaseButton type="submit" :disabled="isLoading" class="w-full">
          {{ isLoading ? 'Creating account...' : 'Sign Up' }}
        </BaseButton>
        <p class="text-center text-sm text-gray-500">
          Already have an account?
          <RouterLink to="/login" class="text-black hover:underline">Login</RouterLink>
        </p>
      </form>
    </div>
  </div>
</template>
