<script setup lang="ts">

// 加载书籍信息并显示

import { ref, watch, watchEffect, onMounted } from "vue";
import { RouterLink } from "vue-router";

import { findBooks, getAllBooks, getRandomBooks } from "../api";
import type { Books } from "../types";

import ComponentPageCotroler from "../components/PageCotroler.vue";
import BookList from "../components/BookList.vue";
import IconRandom from "../components/icon/random.vue";
import IconCollect from "../components/icon/collect.vue";
import IconHome from "../components/icon/home.vue";
import IconArrayLeft from "../components/icon/array-left.vue";
import IconArrayRight from "../components/icon/array-right.vue";

document.title = "书架 - 简单全本";
const books = ref<Books>();
const currentBooksOffset = ref(0);
const currentBooksLimit = ref(10);
const currentBooksKeyword = ref("");


const setPageIndex = (num: number) => {
  currentBooksOffset.value = currentBooksOffset.value + num * currentBooksLimit.value;
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

watchEffect(() => {
  console.log("getAllBooks start", 'currentBooksOffset:', currentBooksOffset.value, 'currentBooksLimit', currentBooksLimit.value);
  getAllBooks(currentBooksOffset.value, currentBooksLimit.value).then((resp) => {
    books.value = resp.data.result
  })
})

watch(currentBooksKeyword, () => {
  if (currentBooksKeyword.value != '') {
    console.log("findBooks start");
    findBooks(currentBooksKeyword.value).then((resp) => {
      books.value = resp.data.result
    })
  }
})

const loadRandomBooks = () => {
  console.log("loadRandomBooks start");
  getRandomBooks().then((resp) => {
    books.value = resp.data.result
  })
}
</script>

<template>
  <div class="main">
    <div class="top-bar">
      <IconRandom class="random-icon" @click="loadRandomBooks" />

      <input class="search-input" type="text" placeholder="搜索作者或书名" v-model="currentBooksKeyword" />
    </div>
    <BookList v-if="books && books.length > 0" :books="books" />


    <ComponentPageCotroler v-if="books && books.length == currentBooksLimit" @setPageIndex="setPageIndex"
      :text="(currentBooksOffset / 10 + 1).toString()" :leftArrayVisible="currentBooksOffset != 0" />


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

.top-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  color: var(--color-link);
  background: transparent;
  border-bottom: 1px solid var(--color-border);
  text-align: center;

  padding: 0 0.5rem;

}

.search-input {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.75rem;
  color: var(--color-link);
  background: transparent;
  text-align: center;

}

.random-icon {
  cursor: pointer;
  width: 1.5rem;
  height: 1.5rem;

  stroke: var(--color-link);
  color: var(--color-link);

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