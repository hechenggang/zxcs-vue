<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getApiCode, setApiCode } from "../shared";
import { CONFIG } from "../shared";

const router = useRouter();
const route = useRoute();

function checkApiCode() {
  // check api-code
  const inputApiCode: string = route.query.code as string;
  if (inputApiCode) {
    // if x-api-code in route query args, cache it, and use by useLocalStorage
    setApiCode(inputApiCode)
    
  } else {
    // if not, redirect to account service
    if (!getApiCode()) {
      location.assign(CONFIG.loginUri);
      return null
    }
  }
  console.log("authed. now redirect to /books");
  router.push("/books");
}

onMounted(() => checkApiCode());
</script>

<template>
  <p>正在处理...</p>
</template>