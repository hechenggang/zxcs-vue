<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { RouterLink } from "vue-router";
import { getBooks, parseJson, getAllHistory } from "../tools/request";
import type { Books } from "../tools/store";
import { onMounted } from "vue";
import { FullscreenLoading, History, Title } from "../tools/store";

import BookList from "../components/BookList.vue";

Title.value = '书架 - 简单全本'
const books = ref<Books>([]);
const tempBooks = ref<Books>([]);
const currentBooksOffset = ref(0);
const currentBooksKeyword = ref("");
const showBooksSearchBox = ref(false);
const showHistory = ref(false);

function swichShowHistory() {
  showHistory.value = !showHistory.value;
  if (showHistory.value) {
    tempBooks.value = books.value;
    books.value = retypedHistory.value;
  } else {
    books.value = tempBooks.value;
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
const retypedHistory = computed(()=> {
  let tempHistorys = Array();
  Object.keys(History.value).forEach((id) => {
    tempHistorys.push({
      book_author: null,
      book_brief: '当前进度 ' + History.value[id][0],
      book_id: id,
      book_name: History.value[id][1],
    });
  });
  return tempHistorys;
})

const requestBooks = () => {
  FullscreenLoading.value = true;
  getBooks(
    Number(currentBooksOffset.value),
    10,
    currentBooksKeyword.value
  ).then((resp) => {
    parseJson(resp, (jsonData: any) => {
      console.log('getBooks success',jsonData);
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
      console.log('getAllHistory success ',jsonData);
      History.value = jsonData.history;
      FullscreenLoading.value = false;
    });
  });
};

watch(currentBooksOffset, () => {
  requestBooks();
})

onMounted(() => {
  requestBooks();
  requestAllHistory();
})

</script>

<template>
  <div class="buttons">
    <button v-if="!showBooksSearchBox && !showHistory" @click="swichShowSearchBox()">
      搜索
    </button>
    <button v-if="showBooksSearchBox && !showHistory" @click="swichShowSearchBox()">
      关闭搜索
    </button>
  
    <button v-if="!showHistory" @click="swichShowHistory()">收藏夹</button>
    <button v-if="showHistory" @click="swichShowHistory()">关闭收藏夹</button>

    <button v-if="currentBooksOffset > 0 && !showHistory" @click="changeOffset(-1)">
      上一页
    </button>
  </div>

  <div v-if="showBooksSearchBox" class="buttons search">
    <input
      class="search-input"
      type="text"
      v-model="currentBooksKeyword"
      autofocus
    />
    <button @click="requestBooks()">搜索</button>
  </div>

  <BookList :books="books" />
  <div class="buttons">
    <button  v-if="!showHistory"  @click="changeOffset(1)">下一页</button>
  </div>
</template>

<style>
.search-input {
  cursor: pointer;
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-link);
  width: auto;
}
</style>