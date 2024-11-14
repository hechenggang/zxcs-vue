<template>
  <button @click="handleClick" :disabled="isLoading">
    <Transition name="slide-fade">
      <componentSpinner v-if="isLoading" :size="props.size" :thicknesses="props.thicknesses" />
      <slot v-else></slot>
    </Transition>
  </button>
</template>

<style scoped>
button {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 定义名为 smooth 的过渡效果 */
button {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 定义名为 smooth 的过渡效果 */
.slide-fade-enter-active {
  transition: all 0.5s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(7px);
  opacity: 0;
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
  isLoading.value = true;
  try {
    await props.action();
  } finally {
    isLoading.value = false;
  }
};
</script>