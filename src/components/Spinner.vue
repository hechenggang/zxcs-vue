<template>
  <div class="loading-container">
    <div class="loading-spinner"></div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.loading-container {
  position: relative;
  width: 20px;
  height: 20px;
}

.loading-spinner {
  width: 100%;
  height: 100%;
  border: 2px solid #e0e0e0;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  animation: spin 2s linear infinite;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
  color: #333;
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