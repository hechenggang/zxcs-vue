<script setup lang="ts">
import { FullscreenLoading } from "./tools/store";
import Loading from "./components/Loading.vue";
</script>


<template>
    <RouterView />
  <Transition>
    <Loading v-if="FullscreenLoading" />
  </Transition>
</template>

<style>
:root {
  --color-bg: #fffdf2;
  --color-link: #5698c3;
  --color-text: #393733;
  --color-sub-text: #706b66;
}
html {
  font-size: 18px;
}
* {
  margin: 0;
  padding: 0;
  list-style: none;
  text-decoration: none;
  border: none;
  outline: none;
  box-sizing: border-box;
  color: var(--color-text);
  background-color: var(--color-bg);
  cursor: default;
  font-family: "LXGW WenKai Screen R", sans-serif;
}

.buttons {
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding: 1rem;
}

.button {
  display: flex;
  align-items: center;
  font-size: 1rem;
  padding: 0.25rem 0.75rem;
  color: var(--color-link);
  border: 0.5px solid var(--color-link);
}

.button * {
  color: var(--color-link);
}

.false-button {
  font-size: 1rem;
  padding: 0.5rem 0.75rem;
  color: var(--color-link);
}

.end {
  margin-bottom: 2rem;
}

.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
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
