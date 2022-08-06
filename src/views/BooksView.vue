<script setup lang="ts">
import { computed, ref, watch, watchEffect, onMounted } from "vue";
import { RouterLink } from "vue-router";

import { getBooks, parseJson, getAllHistory } from "../request";
import type { Books } from "../types";
import { getHistory, setHistory } from "../shared";

import ComponentPageCotroler from "../components/PageCotroler.vue";
import BookList from "../components/BookList.vue";
import IconClose from "../components/icon/close.vue";
import IconCollect from "../components/icon/collect.vue";
import IconSearch from "../components/icon/search.vue";
import IconHome from "../components/icon/home.vue";
import IconArrayLeft from "../components/icon/array-left.vue";
import IconArrayRight from "../components/icon/array-right.vue";

document.title = "书架 - 简单全本";
const books = ref<Books>([]);
const tempBooks = ref<Books>([]);
const currentBooksOffset = ref(0);
const currentBooksLimit = ref(10);
const currentBooksKeyword = ref("");
const booksSearchBoxVisible = ref(false);
const bookHistoryVisible = ref(false);

const setPageIndex = (num: number) => {
  currentBooksOffset.value = currentBooksOffset.value + num * currentBooksLimit.value;
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}
const visionStatus = ref(1);

watch(visionStatus, () => {
  switch (visionStatus.value) {
    case 1:
      // 显示书籍
      if (tempBooks.value) {
        books.value = tempBooks.value;
      }
      break;
    case 2:
      // 显示历史记录
      tempBooks.value = books.value;
      books.value = retypeHistory();
    default:
      break;
  }
})

// for reuse booklist component, here try rebuild history data to match what booklist need
const retypeHistory = () => {
  let tempHistorys = Array();
  const history = getHistory();
  Object.keys(history).forEach((book_id) => {
    tempHistorys.push({
      book_author:"进度 " + (Number(history[book_id][0]) + 1),
      book_id: book_id,
      book_name: history[book_id][1],
    });
  });
  return tempHistorys;
};

const loadBooks = () => {
  getBooks(
    (jsonData: any) => {
      console.log("getBooks success", jsonData);
      if (jsonData.result.length) {
        books.value = jsonData.result;
      } else {
        alert("没有更多结果了");
        currentBooksKeyword.value = "";
      }
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    },
    Number(currentBooksOffset.value),
    currentBooksLimit.value,
    currentBooksKeyword.value
  )
}

const loadAllHistory = () => {
  getAllHistory((jsonData: any) => {
    console.log("getAllHistory success ", jsonData);
    setHistory(jsonData.history);
  })
};

const searchBooks = () => {
  currentBooksOffset.value = 0;
  loadBooks()
};


watch(currentBooksOffset, loadBooks);


onMounted(() => {
  loadBooks()
  loadAllHistory();
});


</script>

<template>
  <div class="main">
    <input v-if="visionStatus == 1" class="main-search-input" type="text" placeholder="搜索作者或书名"
      v-model="currentBooksKeyword" @change="searchBooks" />
    <BookList v-if="books.length > 0" :books="books" />
    <ComponentPageCotroler v-if="books.length == currentBooksLimit && visionStatus == 1" @setPageIndex="setPageIndex"
      :text="(currentBooksOffset / 10 + 1).toString()" :leftArrayVisible="currentBooksOffset != 0" />
  </div>

  <div class="main-bottom-bar shadow">
    <span class="main-bottom-bar-button" :class="visionStatus == 1 ? 'active-bottom-bar' : ''" @click="visionStatus = 1">
      <IconHome />
    </span>
    <span class="main-bottom-bar-button" :class="visionStatus == 2 ? 'active-bottom-bar' : ''" @click="visionStatus = 2">
      <IconCollect />
    </span>
  </div>
</template>

<style>
.main {
  padding: 1rem;
  padding-bottom: 5rem;
  background-color: var(--color-bg);
}

.main-search-input {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.75rem;
  color: var(--color-link);
  background-color: transparent;
  border: 1px solid #ededed;
  text-align: center;
  border-radius: 1rem;


}

.main-bottom-bar {
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

.main-bottom-bar-button {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: var(--color-link);
  background-color: transparent;
}

.active-bottom-bar {
  border-bottom: 2px solid var(--color-link);
}
</style>