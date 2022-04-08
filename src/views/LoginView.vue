<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { localConfig,localApiCode } from "../tools/store";

const router = useRouter()
const route = useRoute()

function checkApiCode() {
     // 加载远程配置
     // fetch()
     // 检查 api-code
     const inputApiCode: string = route.query.code as string
     if (inputApiCode) {
          // 路由解析到 x-api-code 的时候，缓存它，通过 useLocalStorage 提供给其他组件
          localStorage.setItem("x-api-code", inputApiCode)
     } else {
          // 如果没有解析到 x-api-code, 在判断是否有本地缓存
          if (!localApiCode.value) {
               // 若无，重定向到登录
               location.assign(localConfig.value!.loginUri)
          }
     }
     console.log("登录成功 重定向到书架")
     router.push("/books")
}

onMounted(() => checkApiCode())

</script>

<template>
<p>正在处理...</p>
</template>