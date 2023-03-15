<script setup lang="ts">
import { currentRequestCount } from "./api";
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
    <Loading :count="currentRequestCount" :delay="200" msg="稍后再试" />
  </Transition>
  
</template>


<style>
:root {
  --color-bg: #fffdf2;
  --color-bg2: #fff9ee;
  --color-border: #ffeac3;
  --color-link: #5698c3;
  --color-text: #393733;
  --color-sub-text: #706b66;
}



.buttons {
  display: flex;
  align-items: center;

  width: 100%;
  justify-content: space-between;
  padding: 0 1rem;
  opacity: 0.95;

  background-color: var(--color-bg2);
  border: 1px solid var(--color-border);
}

.button {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: var(--color-link);
  background-color: transparent;
  cursor: pointer;
}
.button * {
  color: var(--color-link);
}

.false-button {
  font-size: 1rem;
  padding: 0.5rem 1.5rem;
  color: var(--color-link);
  background-color: transparent;

}

.bar {
  position: fixed;
  width: calc(100% - 2rem);
  margin: 1rem;
  background-color: var(--color-bg);
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

.flex {
  display: flex;
}


.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
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
