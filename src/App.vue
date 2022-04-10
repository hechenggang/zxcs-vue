<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { RouterLink, RouterView, useRouter } from "vue-router";
import { Get } from "./tools";
import type { remoteConfig } from "./tools/store";
import { FullscreenLoading } from "./tools/store";
import Loading from "./components/Loading.vue";

const router = useRouter();

async function loadRemoteConfig() {
  // load remote config
  try {
    const resp = await Get("https://worker.imhcg.cn/zxcsRemoteConfig");
    if (resp.status !== 200) {
      alert("加载远程配置失败，错误代码为" + resp.status);
    } else {
      console.log("loadRemoteConfig success", resp);
      const data: remoteConfig = await resp.json();
      localStorage.setItem("remoteConfig", JSON.stringify(data));
    }
  } catch (error) {
    alert("加载远程配置失败，请联系管理员");
    console.log(error);
  }
}

onBeforeMount(() => loadRemoteConfig());
</script>


<template>
  <RouterView />
  <Transition>
    <Loading v-if="FullscreenLoading" />
  </Transition>
</template>

<style>
:root {
  --color-bg: #fffef8;
  --color-link: #5698c3;
  --color-text: #393733;
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
  font-family: "LXGW WenKai Screen R", sans-serif;
  
}

.buttons {
  display: flex;
  justify-content: right;
  padding: 1rem;
}

.button {
  cursor: pointer;
  margin-left: 0.25rem;
  padding: 0.5rem 0.75rem;
  color: var(--color-link);
  border: 0.5px solid var(--color-link);
  color: var(--color-link);
  border-radius: 0.5rem;
}

.button * {
  color: var(--color-link);
}

.v-enter-active {
  transition: all 0.12s ease-in;
}

.v-leave-active {
  transition: all 0.12s ease-out;
}

.v-enter-from,
.v-leave-to {
  transform: translateX(0.5rem);
  opacity: 0;
}
</style>
