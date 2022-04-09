<script setup lang="ts">
import { ref, watch } from "vue";
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

// first try to find index at localstorage, as collected book
// if not, set index to 0, as new book
const currentBookChapterIndex = History.value.hasOwnProperty(bookId.value)
  ? ref(Number(History.value[bookId.value][0]))
  : ref(0);

const isBookLiked = ref(History.value.hasOwnProperty(bookId.value));

const requestBookChapters = () => {
  FullscreenLoading.value = true;
  getBookChapters(String(bookId.value)).then((resp) => {
    parseJson(resp, (jsonData: any) => {
      console.log("getBookChapters success ", jsonData);
      currentBookChapters.value = jsonData.chapters;
      FullscreenLoading.value = false;
    });
  });
};

// it is better to load chapter content by index change instead of direct pass a index
const requestBookChapter = () => {
  FullscreenLoading.value = true;
  getBookChapter(String(bookId.value), currentBookChapterIndex.value).then(
    (resp) => {
      parseJson(resp, (jsonData: any) => {
        console.log("getBookChapter success ", jsonData);
        currentBookChapterArray.value = jsonData.chapter;
        FullscreenLoading.value = false;
        document.documentElement.scrollTop = 0;
        // after success get a chapter,
        // update chapter status to history api when the book is collected
        if (History.value.hasOwnProperty(String(bookId.value))) {
          saveOneHistory(
            String(bookId.value),
            Number(currentBookChapterIndex.value),
            String(bookName.value)
          );
        }
      });
    }
  );
};

const requestBookHistory = () => {
  FullscreenLoading.value = true;
  getOneHistory(bookId.value).then((resp) => {
    parseJson(resp, (jsonData: any) => {
      console.log("getOneHistory success ", jsonData);
      //   [200,["4","bookName"]]
      let tempIndex = jsonData[1][0];
      if (tempIndex != currentBookChapterIndex.value) {
        let ok = confirm(`要使用云端进度吗？\n云端进度 ${tempIndex} 将覆盖本地进度 ${currentBookChapterIndex.value} `);
        if (ok) {
          setChapterIndex(tempIndex);
        }
      }
    });
  });
};

const likeABook = () => {
  History.value[String(bookId.value)] = [
    String(currentBookChapterIndex.value),
    String(bookName.value),
  ];
  saveOneHistory(
    String(bookId.value),
    Number(currentBookChapterIndex.value),
    String(bookName.value)
  );
  isBookLiked.value = true;
};

const disLikeABook = () => {
  delete History.value[String(bookId.value)];
  removeOneHistory(String(bookId.value));
  isBookLiked.value = false;
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

// watch chapter index, load new chapter content when index changed
watch(currentBookChapterIndex, () => {
  requestBookChapter();
});

// request data before page mounted
onBeforeMount(() => {
  requestBookChapters();
  requestBookChapter();
  if (History.value.hasOwnProperty(String(bookId.value))) {
    requestBookHistory();
  }
});
</script>

<template>
  <div class="buttons">
    <button v-if="!isBookLiked" @click="likeABook()">收藏</button>
    <button v-if="isBookLiked" @click="disLikeABook()">移出收藏</button>
    <button @click="showBookChapters = true">显示目录</button>
    <button v-if="currentBookChapterIndex > 0" @click="addChapterIndex(-1)">
      上一章
    </button>
  </div>
  <ComponentChapterText
    v-if="!showBookChapters"
    ref="text"
    :chapter="currentBookChapterArray"
  />
  <ComponentChapters
    v-if="showBookChapters"
    :chapters="currentBookChapters"
    :index="currentBookChapterIndex"
    @setChapterIndex="setChapterIndex"
  />
  <div class="buttons">
    <button @click="addChapterIndex(1)">下一章</button>
  </div>
</template>

