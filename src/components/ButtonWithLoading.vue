<template>
  <button @click="handleClick" :disabled="isLoading">
    <componentSpinner :size="props.size" v-if="isLoading" />
    <slot v-else></slot>
  </button>
</template>

<style scoped>
button {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<script lang="ts" setup>
import { ref } from 'vue';
import componentSpinner from "@/components/Spinner.vue"

const props = defineProps({
  action: {
    type: Function,
    required:true,
  },
  size: {
    type: Number,
    default: 30,
  },
  
});

// const props = defineProps<{
//   chapters: typeChapters;
//   index: number;
//   bid: string;
// }>();

const isLoading = ref(false);

const handleClick = async () => {
  isLoading.value = true;
  try {
    await props.action();
  } finally {
    isLoading.value = false;
  }
};
</script>