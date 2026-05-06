<script setup lang="ts">
defineProps<{
  variant?: 'default' | 'outline' | 'ghost' | 'destructive'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}>()
</script>

<template>
  <button
    :type="type || 'button'"
    :disabled="disabled"
    class="inline-flex items-center justify-center rounded-md text-sm font-medium px-4 py-2 transition-colors disabled:opacity-50 disabled:pointer-events-none"
    :class="{
      'bg-black text-white hover:bg-gray-800': !variant || variant === 'default',
      'border border-gray-300 bg-white hover:bg-gray-100': variant === 'outline',
      'hover:bg-gray-100': variant === 'ghost',
      'bg-red-600 text-white hover:bg-red-700': variant === 'destructive',
    }"
  >
    <slot />
  </button>
</template>
