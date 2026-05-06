<script setup lang="ts">
import { useAuthStore } from '../../stores/auth'
import { useRouter, RouterLink, RouterView } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = async () => {
  try {
    await authStore.logout()
  } catch (e) {
    // still redirect even if logout API fails
  } finally {
    router.push('/login')
  }
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <header class="border-b">
      <nav class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <RouterLink to="/" class="flex items-center gap-2">
            <h1 class="text-2xl font-bold">Todo App</h1>
          </RouterLink>
          <div class="flex items-center gap-4">
            <template v-if="authStore.isAuthenticated">
              <span class="text-sm text-gray-500">
                {{ authStore.user?.email || authStore.user?.name || 'User' }}
              </span>
              <button
                @click="handleLogout"
                class="px-3 py-1 border rounded text-sm hover:bg-gray-100 cursor-pointer"
              >
                Logout
              </button>
            </template>
            <template v-else>
              <RouterLink to="/login" class="text-sm hover:underline">Login</RouterLink>
              <RouterLink
                to="/register"
                class="px-3 py-1 bg-black text-white rounded text-sm hover:bg-gray-800"
              >
                Sign Up
              </RouterLink>
            </template>
          </div>
        </div>
      </nav>
    </header>
    <main class="container mx-auto px-4 py-8">
      <RouterView />
    </main>
  </div>
</template>
