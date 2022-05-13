<script setup lang="ts">
import { FullscreenLoading } from "./tools/store";
import Loading from "./components/Loading.vue";

const logoEl = document.querySelector(".logo");
if (logoEl) {
  setTimeout(() => {
    logoEl.remove();
  }, 500);
}
</script>


<template>
  <RouterView />
  <Transition>
    <Loading v-if="FullscreenLoading" />
  </Transition>
</template>

<style>
.v-enter-active {
  transition: all 0.25s ease-in-out;
}

.v-leave-active {
  transition: all 0.25s ease-in-out;
}

.v-enter-from,
.v-leave-to {
  transform: translateX(1rem);
  opacity: 0;
}
</style>
