<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { RouterLink, RouterView, useRouter } from "vue-router";
import { Get } from "./tools";
import type { remoteConfig } from "./tools/store";
import { FullscreenLoading } from "./tools/store";
import Loading from "./components/Loading.vue";

const router = useRouter()

async function loadRemoteConfig() {
  // 加载远程配置
  console.log("加载远程配置")
  try {
    const resp = await Get("https://worker.imhcg.cn/zxcsRemoteConfig")
    if (resp.status !== 200) {
      alert("加载远程配置失败，错误代码为" + resp.status)
    } else {
      const data: remoteConfig = await resp.json()
      console.log(data)
      // // 存一份到本地，通过 useLocalStorage 提供给其他组件
      localStorage.setItem("remoteConfig", JSON.stringify(data))
    }
  } catch (error) {
    alert("加载远程配置失败，请联系管理员")
    console.log(error)
  }

  // 重定向到 登录页面
  router.push("/login")
}

onBeforeMount(() => loadRemoteConfig())

</script>


<template>
  <RouterView />
  <Loading v-if="FullscreenLoading" />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  list-style: none;
  text-decoration: none;
  border: none;
  outline: none;
  box-sizing: border-box;
}
</style>
