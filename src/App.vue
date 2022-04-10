<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { RouterLink, RouterView, useRouter } from "vue-router";
import { Get } from "./tools";
import type { remoteConfig } from "./tools/store";
import { FullscreenLoading, localApiCode } from "./tools/store";
import Loading from "./components/Loading.vue";



const router = useRouter();

const checkApiCode = (localConfig: remoteConfig) => {
  if (!localApiCode.value) {
    location.assign(localConfig.loginUri);
  }
};

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
      checkApiCode(data);
    }
  } catch (error) {
    console.log(error);
    alert("加载远程配置失败，请联系管理员");
  }
}

// we should notice that, the code in app.vue will run on each page flush,because it is root node
// so we just load remote config and check code exist
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
  --color-bg: #fffdf2;
  --color-link: #5698c3;
  --color-text: #393733;
  --color-sub-text: #4d4a46;
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
  width: 100%;
  justify-content: space-between;
  padding: 1rem;
}

.button {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 1rem;
  margin-left: 0.25rem;
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
