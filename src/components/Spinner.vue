<template>
  <div class="loading-container" :style="{ width: props.size + 'px', height: props.size + 'px' }">
    <div class="loading-spinner"></div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
  size: {
    type: Number,
    default: 30,
  },
});
</script>

<style scoped>
.loading-container {
  position: relative;
}

.loading-spinner {
  width: 100%;
  height: 100%;
  border: 3px solid var(--color-link2);
  border-top: 3px solid var(--color-link);
  border-radius: 50%;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>