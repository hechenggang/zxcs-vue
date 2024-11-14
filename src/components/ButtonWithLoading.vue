<template>
  <button @click="handleClick" :disabled="isLoading">
    <componentSpinner v-if="isLoading" :size="props.size" :thicknesses="props.thicknesses" />
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
import componentSpinner from "@/components/Spinner.vue";

const props = defineProps({
  action: {
    type: Function,
    required: true,
  },
  size: {
    type: Number,
    default: 30,
  },
  thicknesses: {
    type: Number,
    default: 3.5,
  },
});

const isLoading = ref(false);

const handleClick = async () => {
  console.log("handleClick",props)
  isLoading.value = true;
  try {
    await props.action();
  } finally {
    isLoading.value = false;
  }
};
</script>