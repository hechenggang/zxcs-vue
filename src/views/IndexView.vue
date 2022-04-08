<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { RouterLink } from "vue-router";
import { localConfig,localApiCode } from "../tools/store";

</script>

<template>

<RouterLink to="/books">书架</RouterLink>
<RouterLink to="/search">搜索</RouterLink>

<p>
localApiCode: {{ localApiCode }}
localConfig: {{ localConfig }}
</p>



</template>
