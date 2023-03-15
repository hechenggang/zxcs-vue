<script setup lang="ts">
import { ref, defineEmits, computed, defineProps, onMounted } from "vue";
import IconArrayLeft from "../components/icon/array-left.vue";
import IconArrayRight from "../components/icon/array-right.vue";

const props = defineProps({
  text: {
    type: String,
    default: '',
  },
  leftArrayVisible: {
    type: Boolean,
    default: true,
  },
  rightArrayVisible: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits<{
  (e: "setPageIndex", num: number): void;
}>();
</script>

<template>
    <div class="buttons">
      <!-- page - -->
      <span
        class="button"
        v-if="leftArrayVisible"
        @click="emit('setPageIndex', -1)"
      >
        <IconArrayLeft />
      </span>
      <!-- a button for keep position without function -->
      <span
        class="false-button"
        v-if="!rightArrayVisible || !leftArrayVisible"
      ></span>
      <p class="text">{{ text }}</p>
      <!-- page + -->
      <span
        class="button"
        v-if="rightArrayVisible"
        @click="emit('setPageIndex', 1)"
      >
        <IconArrayRight />
      </span>
    </div>
</template>

<style scoped>

.text {
  font-size: 0.8rem;
  line-height: 1rem;
  font-weight: lighter;
  color: var(--color-sub-text);
}
</style>
