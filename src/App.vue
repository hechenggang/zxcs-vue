<script setup lang="ts">
import { REQUESTING_COUNT } from "./shared";
import Loading from "./components/Loading.vue";

// 加载完成后删除 logo
const logoEl = document.querySelector("#logo");
if (logoEl) {
  setTimeout(() => logoEl.remove(), 500);
}
</script>


<template>
  <RouterView />
  <Transition>
    <Loading :count="REQUESTING_COUNT" :delay="200" msg="Sorry. Try later please." />
  </Transition>
</template>


<style>
.buttons {
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding: 0 1rem;
  opacity: 0.95;
}

.button {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: var(--color-link);
  background-color: transparent;
}

.button * {
  color: var(--color-link);
}

.false-button {
  font-size: 1rem;
  padding: 0.5rem 0.75rem;
  color: var(--color-link);
  background-color: transparent;

}

.bar {
  position: fixed;
  width: calc(100% - 2rem);
  margin: 1rem;
  background-color: transparent;
}

.top-bar {
  top: 0;
  left: 0;
}

.bottom-bar {
  bottom: 0;
  left: 0;
}

.fixed-full {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  flex-direction: column;
}

.shadow {
  box-shadow: 0px 2px 10px rgb(0 0 0 / 10%);
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
  stroke: var(--color-link);
}

.icon-fill {
  fill: var(--color-link);
}



.icon-smaill {
  width: 1rem;
  height: 1rem;
}

.small-text {
  font-size: 0.85rem;
  font-weight: lighter;
  color: var(--color-sub-text);
}

.v-enter-active {
  transition: all 0.2s ease-in;
}

.v-leave-active {
  transition: all 0.2s ease-out;
}

.v-enter-from,
.v-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
