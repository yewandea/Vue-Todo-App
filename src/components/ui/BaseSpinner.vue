<script setup lang="ts">
defineProps<{
  size?: 'sm' | 'default' | 'lg'
}>()
</script>

<template>
  <div class="flex items-center justify-center" role="status">
    <div
      class="animate-spin rounded-full border-4 border-gray-200 border-t-black"
      :class="{
        'h-4 w-4': size === 'sm',
        'h-8 w-8': !size || size === 'default',
        'h-12 w-12': size === 'lg',
      }"
    />
  </div>
</template>
