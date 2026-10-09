<template>
  <span class="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
    <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </svg>
    <span>{{ percentual }}% da meta</span>
  </span>
</template>

<script setup lang="ts">
defineProps<{ percentual: number }>()
</script>
