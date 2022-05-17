<script setup lang="ts">
import { computed, ref, watch,watchEffect } from "vue";
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
const booksSearchBoxVisible = ref(false);
const bookHistoryVisible = ref(false);

function swichbookHistoryVisible() {
  FullscreenLoading.value = true;
  booksSearchBoxVisible.value = false;
  bookHistoryVisible.value = !bookHistoryVisible.value;
  if (bookHistoryVisible.value) {
    tempBooks.value = books.value;
    books.value = retypedHistory.value;
    FullscreenLoading.value = false;
  } else {
    books.value = tempBooks.value;
    FullscreenLoading.value = false;
  }
}

function swichShowSearchBox() {
  booksSearchBoxVisible.value = !booksSearchBoxVisible.value;
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
      book_brief: "当前进度 " + (Number(History.value[id][0]) + 1),
      book_id: id,
      book_name: History.value[id][1],
    });
  });
  return tempHistorys;
});

// const requestBooks = () => {
//   FullscreenLoading.value = true;
//   getBooks(
//     Number(currentBooksOffset.value),
//     10,
//     currentBooksKeyword.value
//   ).then((resp) => {
//     parseJson(resp, (jsonData: any) => {
//       if (!jsonData) {
//         return;
//       }
//       console.log("getBooks success", jsonData);
//       if (jsonData.result.length) {
//         books.value = jsonData.result;
//       } else {
//         alert("没有更多结果了");
//         currentBooksKeyword.value = "";
//       }
//       FullscreenLoading.value = false;
//       document.documentElement.scrollTop = 0;
//     });
//   });
// };

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
    });
  });
})

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

// watch(currentBooksOffset, () => {
//   requestBooks();
// });

onMounted(() => {
  // requestBooks();
  requestAllHistory();
});
</script>

<template>
  <div class="top-bar shadow">
    <div class="buttons"  v-if="!bookHistoryVisible && !booksSearchBoxVisible">
       <span class="button" @click="swichShowSearchBox()" >
          <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M450.540923 835.421849C238.095329 835.421849 65.258028 662.585911 65.258028 450.14713 65.258028 237.711074 238.095329 64.873772 450.540923 64.873772 662.986518 64.873772 835.830632 237.711074 835.830632 450.14713 835.830632 662.584548 662.986518 835.421849 450.540923 835.421849L450.540923 835.421849ZM450.540923 159.705847C290.384053 159.705847 160.09419 289.998435 160.09419 450.14713 160.09419 610.297187 290.384053 740.591138 450.540923 740.591138 610.696431 740.591138 740.99447 610.297187 740.99447 450.14713 740.99447 289.998435 610.696431 159.705847 450.540923 159.705847L450.540923 159.705847Z" p-id="2184"></path><path d="M900.538167 958.477626C885.598531 958.477626 870.668434 952.777836 859.268854 941.387795L657.978933 740.112862C635.189312 717.323242 635.189312 680.372035 657.978933 657.576963 680.77673 634.794156 717.722486 634.794156 740.518919 657.576963L941.807478 858.851896C964.598462 881.641517 964.598462 918.592724 941.807478 941.386432 930.407899 952.777836 915.477801 958.477626 900.538167 958.477626"></path></svg>
          <!-- <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M952 896l-204.992-204.992q86.016-106.016 86.016-243.008 0-159.008-112.512-271.488T448.512 64t-272 112.512T64 448.512t112.512 272T448 833.024q136.992 0 242.016-84.992l204.992 204q12 12 28.512 12t28-11.488 11.488-28-11.008-28.512z m-381.984-160Q512 760.992 448 760.992q-63.008 0-120.992-24.992-56-23.008-100-66.016Q184 625.984 160 569.984q-24-58.016-24-122.016 0-63.008 24-120.992 24-56 67.008-99.008 44-44 100-68 58.016-24 120.992-24 64 0 122.016 24 56 24 99.488 67.488T736 326.944q24.992 58.016 24.992 122.016 0 63.008-24.992 120.992-23.008 56-66.016 100-44 43.008-100 66.016z"></path></svg> -->
        </span>
        <span class="button"  @click="swichbookHistoryVisible()">
          <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" ><path d="M512 0 113.4592 238.42816l401.117184 240.068608L913.2032 239.98464 512 0 512 0zM74.79296 784.75264 474.646528 1024 474.646528 543.90784 74.79296 304.61952 74.79296 784.75264 74.79296 784.75264zM549.193728 546.977792 549.193728 1024 949.20704 784.75264 949.20704 307.77344 549.193728 546.977792 549.193728 546.977792zM549.193728 546.977792"></path></svg>
        </span>
    </div>

    <div class="buttons" v-if="bookHistoryVisible">
      <span class="flex-center lighter">{{ books.length }} 本书</span>
      <span class="button" @click="swichbookHistoryVisible()">
        <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" ><path d="M568 515.008l254.016-255.008q12-11.008 12-27.488t-11.488-28-28-11.488-27.488 12l-255.008 254.016-255.008-254.016q-11.008-12-27.488-12t-28 11.488-11.488 28 12 27.488l254.016 255.008-254.016 255.008q-12 11.008-12 27.488t11.488 28 28 11.488 27.488-12l255.008-255.008 255.008 255.008q11.008 12 27.488 12t28-11.488 11.488-28-12-27.488z"></path></svg>
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
        <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" ><path d="M568 515.008l254.016-255.008q12-11.008 12-27.488t-11.488-28-28-11.488-27.488 12l-255.008 254.016-255.008-254.016q-11.008-12-27.488-12t-28 11.488-11.488 28 12 27.488l254.016 255.008-254.016 255.008q-12 11.008-12 27.488t11.488 28 28 11.488 27.488-12l255.008-255.008 255.008 255.008q11.008 12 27.488 12t28-11.488 11.488-28-12-27.488z"></path></svg>
      </span>
    </div>
  </div>

  <div v-if="booksSearchBoxVisible" class="top-bar shadow">
    
  </div>

  <BookList v-if="books.length > 0" :books="books" />

  <div class="buttons shadow bar" v-if="!bookHistoryVisible">
    <span
      class="button"
      v-if="currentBooksOffset > 0"
      @click="changeOffset(-10)"
    >
      <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M855.008 468H280.992l216-208q14.016-12.992 14.016-31.008t-12.512-31.488-30.496-13.504-32 12L141.984 480q-14.016 12.992-14.016 31.488t14.016 31.488l296 284.992q12.992 12 30.016 12 19.008 0 32-14.016 12.992-12.992 12.512-31.008t-13.504-31.008l-216-208H856q16.992 0 30.016-12t14.016-28.992q0.992-19.008-12.512-32.992t-32.512-14.016z"></path></svg>
    </span>

    <span
      class="false-button"
      v-if="currentBooksOffset == 0"
    ></span>
    <span class="button"  @click="changeOffset(10)" >
      <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M172.992 468h574.016l-216-208q-14.016-12.992-14.016-31.008t12.512-31.488 30.496-13.504 32 12L886.016 480q14.016 12.992 14.016 31.488t-14.016 31.488l-296 284.992q-12.992 12-30.016 12-19.008 0-32-14.016-12.992-12.992-12.512-31.008t13.504-31.008l216-208H172q-16.992 0-30.016-12t-14.016-28.992q-0.992-19.008 12.512-32.992t32.512-14.016z"></path></svg>
    </span>
  </div>
</template>

<style>
.search-input {
  flex: 1;
  width: 100%;
  margin-right: 0.25rem;
  padding: 0.25rem;
  color: var(--color-link);
}
.no-padding {
  padding: 0;
}
</style>