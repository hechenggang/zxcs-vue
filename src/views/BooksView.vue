<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { RouterLink } from "vue-router";

import { getBooks, parseJson, getAllHistory } from "../tools/request";
import type { Books } from "../tools/store";
import { onMounted } from "vue";
import { FullscreenLoading, History, Title } from "../tools/store";

import BookList from "../components/BookList.vue";

Title.value = "书架 - 简单全本";
const books = ref<Books>([]);
const tempBooks = ref<Books>([]);
const currentBooksOffset = ref(0);
const currentBooksKeyword = ref("");
const showBooksSearchBox = ref(false);
const showHistory = ref(false);

function swichShowHistory() {
  FullscreenLoading.value = true;
  showBooksSearchBox.value = false;
  showHistory.value = !showHistory.value;
  if (showHistory.value) {
    tempBooks.value = books.value;
    books.value = retypedHistory.value;
    FullscreenLoading.value = false;
  } else {
    books.value = tempBooks.value;
    FullscreenLoading.value = false;
  }
}

function swichShowSearchBox() {
  showBooksSearchBox.value = !showBooksSearchBox.value;
}

function changeOffset(num: number) {
  const next = currentBooksOffset.value + num;
  if (next < 0) {
    return;
  }
  currentBooksOffset.value = next;
}

// for reuse booklist component, here try rebuild history data to match what booklist need
const retypedHistory = computed(() => {
  let tempHistorys = Array();
  Object.keys(History.value).forEach((id) => {
    tempHistorys.push({
      book_author: null,
      book_brief: "当前进度 " + Number(History.value[id][0])+1,
      book_id: id,
      book_name: History.value[id][1],
    });
  });
  return tempHistorys;
});

const requestBooks = () => {
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
      books.value = jsonData.result;
      FullscreenLoading.value = false;
      document.documentElement.scrollTop = 0;
    });
  });
};

const requestAllHistory = () => {
  FullscreenLoading.value = true;
  getAllHistory().then((resp) => {
    parseJson(resp, (jsonData: any) => {
      if (!jsonData) {
        return;
      }
      console.log("getAllHistory success ", jsonData);
      History.value = jsonData.history;
      FullscreenLoading.value = false;
    });
  });
};

watch(currentBooksOffset, () => {
  requestBooks();
});

onMounted(() => {
  requestBooks();
  requestAllHistory();
});
</script>

<template>
  <div class="buttons top-bar shadow">
    <span
      class="button"
      v-if="!showBooksSearchBox && !showHistory"
      @click="swichShowSearchBox()"
    >
      搜索
    </span>
    <span
      class="button"
      v-if="showBooksSearchBox && !showHistory"
      @click="swichShowSearchBox()"
    >
      关闭搜索
    </span>

    <span class="button" v-if="!showHistory" @click="swichShowHistory()"
      >收藏夹</span
    >

    <div class="buttons top-bar shadow" v-if="showHistory">
      <span class="flex-center book-brief">共 {{books.length}} 本书</span>
      <span class="button" @click="swichShowHistory()">关闭收藏夹</span>
    </div>

    
  </div>

  <Transition>
    <div v-if="showBooksSearchBox" class="buttons search top-bar">
      <input
        class="search-input button"
        type="text"
        placeholder="在这里输入书名或作者"
        v-model="currentBooksKeyword"
        v-focus
      />

      <span class="button" @click="requestBooks()">搜索</span>
    </div>
  </Transition>
  <Transition>
    <BookList v-if="books.length > 0" :books="books" />
  </Transition>

  <div class="buttons end">
    <span
      class="button"
      v-if="currentBooksOffset > 0 && !showHistory"
      @click="changeOffset(-10)"
    >
      上一页
    </span>
    
    <span class="false-button" v-if="currentBooksOffset == 0 && !showHistory"></span>
    <span class="button" v-if="!showHistory" @click="changeOffset(10)"
      >下一页</span
    >
  </div>
</template>

<style>
.search {
  display: flex;
  width: 100%;
  top: 3rem;
  padding: 0.25rem 1rem;
}
.search-input {
  flex: 1;
  font-size: 0.9rem;
  margin-right: .25rem;
}
.no-padding {
  padding: 0;
}
</style>