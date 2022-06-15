<script setup lang="ts">
import { computed, ref, watch, watchEffect } from "vue";
import { RouterLink } from "vue-router";

import { getBooks, parseJson, getAllHistory } from "../tools/request";
import type { Books } from "../tools/store";
import { onMounted } from "vue";
import { FullscreenLoading, getHistory, setHistory } from "../tools/store";

import ComponentPageCotroler from "../components/PageCotroler.vue";
import BookList from "../components/BookList.vue";
import IconClose from "../components/icon/close.vue";
import IconCollect from "../components/icon/collect.vue";
import IconSearch from "../components/icon/search.vue";
import IconArrayLeft from "../components/icon/array-left.vue";
import IconArrayRight from "../components/icon/array-right.vue";

document.title = "书架 - 简单全本";
const books = ref<Books>([]);
const tempBooks = ref<Books>([]);
const currentBooksOffset = ref(0);
const currentBooksKeyword = ref("");
const booksSearchBoxVisible = ref(false);
const bookHistoryVisible = ref(false);

function swichbookHistoryVisible() {
  FullscreenLoading.value = true;
  booksSearchBoxVisible.value = false;
  bookHistoryVisible.value = !bookHistoryVisible.value;
  if (bookHistoryVisible.value) {
    tempBooks.value = books.value;
    books.value = getRetypedHistory.value;
    FullscreenLoading.value = false;
  } else {
    books.value = tempBooks.value;
    FullscreenLoading.value = false;
  }
}

function swichShowSearchBox() {
  booksSearchBoxVisible.value = !booksSearchBoxVisible.value;
}

const setPageIndex = (num:number)=>{
  if (currentBooksOffset.value + num*10 < 0) {
    return;
  }
  currentBooksOffset.value += num*10;
}

// for reuse booklist component, here try rebuild history data to match what booklist need
const getRetypedHistory = computed(() => {
  let tempHistorys = Array();
  const history = getHistory();
  Object.keys(history).forEach((book_id) => {
    tempHistorys.push({
      book_author: null,
      book_brief: "当前进度 " + (Number(history[book_id][0]) + 1),
      book_id: book_id,
      book_name: history[book_id][1],
    });
  });
  return tempHistorys;
});

watchEffect(() => {
  FullscreenLoading.value = true;
  getBooks(
    Number(currentBooksOffset.value),
    10,
    currentBooksKeyword.value
  ).then((resp) => {
    parseJson(resp, (jsonData: any) => {
      if (!jsonData) {
        return;
      }
      console.log("getBooks success", jsonData);
      if (jsonData.result.length) {
        books.value = jsonData.result;
      } else {
        alert("没有更多结果了");
        currentBooksKeyword.value = "";
      }
      FullscreenLoading.value = false;
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
  });
});

const requestAllHistory = () => {
  FullscreenLoading.value = true;
  getAllHistory().then((resp) => {
    parseJson(resp, (jsonData: any) => {
      if (!jsonData) {
        return;
      }
      console.log("getAllHistory success ", jsonData);
      setHistory(jsonData.history);
      FullscreenLoading.value = false;
    });
  });
};

onMounted(() => {
  requestAllHistory();
});
</script>

<template>
  <div class="top-bar shadow">
    <div class="buttons" v-if="!bookHistoryVisible && !booksSearchBoxVisible">
      <span class="button" @click="swichShowSearchBox()">
        <!-- 搜索图标 -->
        <IconSearch />
      </span>
      <span class="button" @click="swichbookHistoryVisible()">
        <!-- 收藏夹图标 -->
        <IconCollect />
      </span>
    </div>

    <div class="buttons" v-if="bookHistoryVisible">
      <span class="flex-center lighter">{{ books.length }} 本书</span>
      <span class="button" @click="swichbookHistoryVisible()">
        <!-- 关闭收藏夹图标 -->
        <IconClose />
      </span>
    </div>

    <div class="buttons" v-if="booksSearchBoxVisible">
      <input
        class="search-input lighter"
        type="text"
        placeholder="在这里输入书名或作者"
        v-model="currentBooksKeyword"
        v-focus
      />
      <span class="button" @click="swichShowSearchBox()">
        <!-- 关闭搜索图标 -->
        <IconClose />
      </span>
    </div>
  </div>

  <BookList v-if="books.length > 0" :books="books" />

  <ComponentPageCotroler
    @setPageIndex="setPageIndex"
    :leftArrayVisible="currentBooksOffset != 0"
  />
</template>

<style>
.search-input {
  flex: 1;
  width: 100%;
  margin-right: 0.25rem;
  padding: 0.25rem;
  color: var(--color-link);
  padding-right: 0.75rem;
}
.no-padding {
  padding: 0;
}
</style>