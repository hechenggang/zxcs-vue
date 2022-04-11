<script setup lang="ts">
import { computed, ref, watch } from "vue";
import {
  getBookChapters,
  getBookChapter,
  parseJson,
  saveOneHistory,
  removeOneHistory,
  getOneHistory,
} from "../tools/request";
import { onBeforeMount } from "vue";
import { useRoute } from "vue-router";
import type { Chapters } from "../tools/store";
import { FullscreenLoading, Title, History } from "../tools/store";

import ComponentChapters from "../components/Chapters.vue";
import ComponentChapterText from "../components/ChapterText.vue";

const route = useRoute();
const bookId = ref<string>(route.query.id as string);
const bookName = ref<string>(route.query.name as string);
const currentBookChapters = ref<Chapters>([]);
const currentBookChapterArray = ref<Array<string>>([]);
const showBookChapters = ref(false);
Title.value = bookName.value + " - 简单全本";

const isBookCollected = ref(false);

const recomputIsBookCollected = () => {
  isBookCollected.value = History.value.hasOwnProperty(bookId.value);
};

recomputIsBookCollected();

// first try to find index at localstorage, as collected book
// if not, set index to 0, as new book
const currentBookChapterIndex = isBookCollected.value
  ? ref(History.value[bookId.value][0])
  : ref(0);

const requestBookChapters = () => {
  FullscreenLoading.value = true;
  getBookChapters(bookId.value).then((resp) => {
    parseJson(resp, (jsonData: any) => {
      if (!jsonData) {
        return;
      }
      console.log("getBookChapters", jsonData);
      currentBookChapters.value = jsonData.chapters;
      FullscreenLoading.value = false;
    });
  });
};

// it is better to load chapter content by index change instead of direct pass a index
const requestBookChapter = () => {
  FullscreenLoading.value = true;
  getBookChapter(bookId.value, currentBookChapterIndex.value).then((resp) => {
    parseJson(resp, (jsonData: any) => {
      if (!jsonData) {
        return;
      }
      console.log("getBookChapter", jsonData);
      currentBookChapterArray.value = jsonData.chapter;
      FullscreenLoading.value = false;
      document.documentElement.scrollTop = 0;
      // afterget a chapter,
      // update chapter status to history api when the book is collected
      if (History.value.hasOwnProperty(bookId.value)) {
        saveOneHistory(
          bookId.value,
          currentBookChapterIndex.value,
          bookName.value
        );
      }
    });
  });
};

// read remote index
const requestBookHistory = () => {
  FullscreenLoading.value = true;
  getOneHistory(bookId.value).then((resp) => {
    parseJson(resp, (jsonData: any) => {
      if (!jsonData) {
        return;
      }
      console.log("getOneHistory", jsonData);
      //   [200,["4","bookName"]]
      let tempIndex = jsonData[1][0];
      if (tempIndex != currentBookChapterIndex.value) {
        let ok = confirm(
          `要使用云端进度吗？\n云端进度：${tempIndex}\n本地进度：${currentBookChapterIndex.value} `
        );
        if (ok) {
          setChapterIndex(tempIndex);
        }
      }
    });
  });
};

const likeABook = () => {
  History.value[bookId.value] = [currentBookChapterIndex.value, bookName.value];
  recomputIsBookCollected();
  saveOneHistory(bookId.value, currentBookChapterIndex.value, bookName.value);
};

const disLikeABook = () => {
  delete History.value[bookId.value];
  recomputIsBookCollected();
  removeOneHistory(bookId.value);
};

function addChapterIndex(num: number) {
  const next = currentBookChapterIndex.value + num;
  if (next >= currentBookChapters.value.length) {
    return;
  }
  if (next < 0) {
    return;
  }
  currentBookChapterIndex.value = next;
}

function setChapterIndex(index: number) {
  currentBookChapterIndex.value = index;
  showBookChapters.value = false;
}

function closeShowBookChapters() {
  showBookChapters.value = false;
}

// watch chapter index, load new chapter content when index changed
watch(currentBookChapterIndex, () => {
  requestBookChapter();
});

// request data before page mounted
onBeforeMount(() => {
  requestBookChapters();
  requestBookChapter();
  if (History.value.hasOwnProperty(bookId.value)) {
    requestBookHistory();
  }
});
</script>

<template>
  <div class="text-box" v-if="!showBookChapters">
    <div class="buttons">
      <span class="button" @click="showBookChapters = true">目录</span>
      <span class="button" v-if="!isBookCollected" @click="likeABook()"
        >收藏</span
      >
      <span class="button" v-if="isBookCollected" @click="disLikeABook()"
        >取消收藏</span
      >
      <span
        class="button"
        v-if="currentBookChapterIndex > 0"
        @click="addChapterIndex(-1)"
      >
        上一章
      </span>
    </div>
    <ComponentChapterText ref="text" :chapter="currentBookChapterArray" />
    <div class="buttons end">
      <span class="false-button"></span>
      <span class="button" @click="addChapterIndex(1)">下一章</span>
    </div>
  </div>
  <ComponentChapters
    v-if="showBookChapters"
    :chapters="currentBookChapters"
    :index="currentBookChapterIndex"
    @setChapterIndex="setChapterIndex"
    @closeShowBookChapters="closeShowBookChapters"
  />
</template>

