<script setup lang="ts">

// 加载书籍信息并显示

import { ref, watch, watchEffect, onMounted } from "vue";
import { RouterLink } from "vue-router";

import { findBooks, getAllBooks, getRandomBooks } from "../api";
import type { typeBooks } from "../types";

import ComponentPageCotroler from "../components/PageCotroler.vue";
import BookList from "../components/BookList.vue";
import IconRandom from "../components/icon/random.vue";
import IconCollect from "../components/icon/collect.vue";
import IconHome from "../components/icon/home.vue";
import componentSpinner from "../components/Spinner.vue";
import IconArrayLeft from "../components/icon/array-left.vue";
import IconArrayRight from "../components/icon/array-right.vue";
import ComponentButtonWithLoading from "@/components/ButtonWithLoading.vue";


document.title = "书架 - 简单全本";
const books = ref<typeBooks>();
const currentBooksOffset = ref(0);
const currentBooksLimit = ref(10);
const currentBooksKeyword = ref("");


const setPageIndex = async (num: number) => {
  console.log("setPageIndex",num)
  const nextOffset = currentBooksOffset.value + num * currentBooksLimit.value;
  await loadBooks(nextOffset,currentBooksLimit.value);
  currentBooksOffset.value = nextOffset;
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

const loadBooks = async (offset:number,limit:number) => {
  await getAllBooks(offset,limit).then((resp) => {
    books.value = resp.data
  }).catch((err) => {
    console.log("getAllBooks got error, ", err)
  })
}


watch(currentBooksKeyword, () => {
  if (currentBooksKeyword.value != '') {
    console.log("findBooks start");
    findBooks(currentBooksKeyword.value).then((resp) => {
      books.value = resp.data
    }).catch((err) => {
      console.log("findBooks got error, ", err)
    })
  }
})


const loadRandomBooks = () => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("loadRandomBooks start")
      const resp = await getRandomBooks()
      books.value = resp.data
      resolve(true)
    } catch (error) {
      reject(false)
    }
  });
};

onMounted(async () => {
  await loadBooks(currentBooksOffset.value,currentBooksLimit.value)
})

</script>

<template>
  <div class="main">
    <div class="top-bar">
      <ComponentButtonWithLoading :size="20" :thicknesses="3" :action="loadRandomBooks">
        <IconRandom class="random-icon" />
      </ComponentButtonWithLoading>
      <input class="search-input" type="text" placeholder="搜索作者或书名" v-model="currentBooksKeyword" />
    </div>


    <BookList v-if="books && books.length > 0" :books="books" v-auto-animate />
    <div class="center" v-if="!books">
      <componentSpinner v-auto-animate />
    </div>

    <ComponentPageCotroler v-if="books && books.length == currentBooksLimit" :action="setPageIndex"
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
  border: 1px solid var(--color-border);
  text-align: center;
  background-color: var(--color-bg2);

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


::placeholder {
  color: var(--color-link);
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