<script setup lang="ts">

// 加载完成后删除 logo
const logoEl = document.querySelector("#logo");
if (logoEl) {
 setTimeout(() => logoEl.remove(), 500);
}

</script>


<template>
  <RouterView />
</template>


<style>

.buttons {
  display: flex;
  align-items: center;

  width: 100%;
  justify-content: space-between;
  padding: 0 1rem;
  opacity: 0.95;

  background-color: var(--color-bg2);
  /* border: 1px solid var(--color-border); */
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
  z-index: 3;
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

</style>
