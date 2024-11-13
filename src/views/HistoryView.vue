<script setup lang="ts">

// 加载书籍信息并显示

import { ref, watchEffect, onMounted } from "vue";
import { RouterLink } from "vue-router";

import { getAllHistory } from "../api";
import type { typeBooks } from "../types";

import BookList from "../components/BookList.vue";
import IconCollect from "../components/icon/collect.vue";
import IconHome from "../components/icon/home.vue";
import componentSpinner from "../components/Spinner.vue";

document.title = "收藏 - 简单全本";

const books = ref<typeBooks>();

watchEffect(() => {
  console.log("getAllHistory start");
  getAllHistory().then((resp) => {
    let temp: typeBooks = []
    const response = resp.data as [string, string, number, number][]
    response.forEach(element => {
      temp.push([element[0], element[1], '已读 ' + element[2], ''])
    });
    books.value = temp
  }).catch((err) => {
    console.log("getAllHistory got error, ", err)
  })
})



</script>

<template>
  <div class="main">

    <BookList v-if="books && books.length > 0" :books="books" />
    <div class="center" v-if="!books">
      <componentSpinner v-auto-animate />
    </div>

    <div class="bottom-bar shadow">
      <RouterLink class="bottom-bar-button" to="books">
        <IconHome />
      </RouterLink>
      <RouterLink class="bottom-bar-button" to="history">
        <IconCollect />
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.main {
  padding: 1.25rem;
  padding-bottom: 5rem;
  background-color: var(--color-bg);
}



.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3rem;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-wrap: nowrap;
  background-color: var(--color-bg);

}

.bottom-bar-button {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: var(--color-link);
  background-color: transparent;
}

.router-link-active {
  border-bottom: 2px solid var(--color-link);
}
</style>