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

const isOldGuy = localStorage.getItem('isOldGuy')
if (!isOldGuy) {
  alert('欢迎你，新朋友。\n如果你需要唤起或者关闭控制菜单，都只需要点击文字区域就可以。\n祝你阅读愉快。')
  localStorage.setItem('isOldGuy',"1")
}
const route = useRoute();
const bookId = ref<string>(route.query.id as string);
const bookName = ref<string>(route.query.name as string);
const currentBookChapters = ref<Chapters>([]);
const currentBookChapterArray = ref<Array<string>>([]);
const bookChaptersVisible = ref(false);
const controlVisible = ref(false);
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


function setChapterIndex(index: number) {
  currentBookChapterIndex.value = index;
  bookChaptersVisible.value = false;
  controlVisible.value = false;
}


function addChapterIndex(num: number) {
  const next = currentBookChapterIndex.value + num;
  if (next >= currentBookChapters.value.length) {
    return;
  }
  if (next < 0) {
    return;
  }
  setChapterIndex(next)
}

function switchBookChaptersVisible() {
  bookChaptersVisible.value = !bookChaptersVisible.value;
}

function switchControlVisible() {
  controlVisible.value = !controlVisible.value;
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
  <div class="text-box" v-if="!bookChaptersVisible">
    <div class="buttons top-bar shadow" v-if="controlVisible">
      <span class="button" @click="bookChaptersVisible = true">
        <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M918.507 443.947H104.64c-37.547 0-68.16 30.72-68.16 68.16 0 37.546 30.72 68.16 68.16 68.16h813.867c37.546 0 68.16-30.72 68.16-68.16s-30.72-68.16-68.16-68.16z m-0.32 306.88H104.32c-37.547 0-68.16 30.72-68.16 68.16 0 37.546 30.72 68.16 68.16 68.16h813.867c37.546 0 68.16-30.72 68.16-68.16 0-37.547-30.614-68.16-68.16-68.16z m1.066-610.667H105.387c-37.547 0-68.16 30.72-68.16 68.16 0 37.547 30.72 68.16 68.16 68.16h813.866c37.547 0 68.16-30.72 68.16-68.16 0-37.547-30.72-68.16-68.16-68.16z"></path></svg>
      </span>
      <span class="button" v-if="!isBookCollected" @click="likeABook()">
        <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M512 136q8.992 0 12.992 8.992l104.992 222.016q3.008 7.008 11.008 8.992l235.008 35.008q8.992 2.016 12 10.496t-4 14.496l-171.008 176q-4.992 4.992-4 12l40.992 247.008q0.992 7.008-3.488 12t-11.488 4.992q-4 0-7.008-2.016l-208.992-115.008q-3.008-2.016-7.008-2.016t-7.008 2.016L296 885.984q-3.008 2.016-7.008 2.016-7.008 0-11.488-4.992t-3.488-12L315.008 624q0.992-7.008-4-12l-171.008-176q-7.008-6.016-4-14.496t12-9.504l235.008-36q8-0.992 11.008-8.992l104.992-222.016q4-8.992 12.992-8.992zM512 64q-24 0-44.992 12.992-22.016 12.992-32.992 36.992l-92 195.008-204.992 31.008q-24 4-42.496 19.488t-26.496 39.008-2.496 47.008 22.496 41.504l151.008 154.016-36 218.016q-6.016 40 20 70.496t66.016 30.496q22.016 0 42.016-11.008l180.992-100 180.992 100q20 11.008 42.016 11.008 40 0 66.016-30.496t20-70.496l-36-218.016 151.008-154.016q16.992-18.016 22.496-41.504t-2.496-47.008-26.496-39.008-42.496-19.488l-204.992-31.008-92-195.008q-11.008-24-32.992-36.992Q536.128 64 512.128 64z"></path></svg>
      </span>
      <span class="button" v-if="isBookCollected" @click="disLikeABook()">
        <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M956 398.496q-8-23.488-26.496-39.008t-42.496-19.488l-204.992-31.008-92-195.008q-11.008-24-32.992-36.992Q536.032 64 512.032 64t-44.992 12.992q-22.016 12.992-32.992 36.992l-92 195.008-204.992 31.008q-24 4-42.496 19.488t-26.496 39.008-2.496 47.008 22.496 41.504l151.008 154.016-36 218.016q-6.016 40 20 70.496t66.016 30.496q22.016 0 42.016-11.008l180.992-100 180.992 100q20 11.008 42.016 11.008 40 0 66.016-30.496t20-70.496l-36-218.016 151.008-154.016q16.992-18.016 22.496-41.504t-2.496-47.008z"></path></svg>
      </span>
    </div>
    <ComponentChapterText
      ref="text"
      :chapter="currentBookChapterArray"
      @switchControlVisible="switchControlVisible"
    />
    <div class="buttons bottom-bar shadow" v-if="controlVisible">
      <span
        class="button"
        v-if="currentBookChapterIndex > 0"
        @click="addChapterIndex(-1)"
      >
        <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M855.008 468H280.992l216-208q14.016-12.992 14.016-31.008t-12.512-31.488-30.496-13.504-32 12L141.984 480q-14.016 12.992-14.016 31.488t14.016 31.488l296 284.992q12.992 12 30.016 12 19.008 0 32-14.016 12.992-12.992 12.512-31.008t-13.504-31.008l-216-208H856q16.992 0 30.016-12t14.016-28.992q0.992-19.008-12.512-32.992t-32.512-14.016z"></path></svg>
      </span>
      <span class="false-button" v-if="currentBookChapterIndex == 0"></span>
      <span class="button" @click="addChapterIndex(1)">
        <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M172.992 468h574.016l-216-208q-14.016-12.992-14.016-31.008t12.512-31.488 30.496-13.504 32 12L886.016 480q14.016 12.992 14.016 31.488t-14.016 31.488l-296 284.992q-12.992 12-30.016 12-19.008 0-32-14.016-12.992-12.992-12.512-31.008t13.504-31.008l216-208H172q-16.992 0-30.016-12t-14.016-28.992q-0.992-19.008 12.512-32.992t32.512-14.016z"></path></svg>
      </span>
    </div>
  </div>
  <ComponentChapters
    v-if="bookChaptersVisible"
    :chapters="currentBookChapters"
    :index="currentBookChapterIndex"
    @setChapterIndex="setChapterIndex"
    @switchBookChaptersVisible="switchBookChaptersVisible"
  />
</template>

