<script setup lang="ts">
import { defineEmits, defineProps } from "vue";

// 定义组件的props
const props = defineProps<{
  chapter: Array<string>;
}>();

// 定义组件的emits
const emit = defineEmits<{
  (e: "switchControlVisible"): void;
}>();
</script>

<template>
  <div
    class="chapter-text"
    @click="emit('switchControlVisible')"
  >
    <p v-for="(paragraph, index) in chapter" :key="index">
      {{ paragraph.trim() }}
    </p>
  </div>
</template>

<style scoped>
.chapter-text {
  padding: 5rem 1rem;
  overflow: auto;
  min-height: 100vh;
  background-color: var(--color-bg);
  cursor: default;
}

.chapter-text p {
  margin-bottom: 0.125rem;
  text-indent: 2rem;
  line-height: 2rem;
  font-size: 1.25rem;
  word-wrap: break-word;
}
</style>