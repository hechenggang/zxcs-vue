<script setup lang="ts">
import { computed, ref, watch, onBeforeMount } from "vue";
import {
  getBookChapters,
  getBookChapter,
  saveOneHistory,
  removeOneHistory,
  getOneHistory,
} from "../api";
import { useRoute } from "vue-router";
import type { Chapters } from "../types";
import ComponentChapters from "../components/Chapters.vue";
import ComponentPageCotroler from "../components/PageCotroler.vue";
import ComponentChapterText from "../components/ChapterText.vue";
import IconStar from "../components/icon/star.vue";
import IconContent from "../components/icon/content.vue";

// 首次指引
const isOldGuy = localStorage.getItem("isOldGuy");
if (!isOldGuy) {
  alert(
    "欢迎你，新朋友。\n如果你需要唤起或者关闭控制菜单，都只需要点击文字区域就可以。\n祝你阅读愉快。"
  );
  localStorage.setItem("isOldGuy", "1");
}

const route = useRoute();

const bookId = ref<string>(route.query.id as string);
const bookName = ref<string>(route.query.name as string);
const currentBookChapters = ref<Chapters>([]);
const currentBookChapterArray = ref<Array<string>>([]);
const currentBookChapterIndex = ref<number>(null);
const bookChaptersVisible = ref(false);
const controlVisible = ref(false);
const isBookCollected = ref(false);

document.title = `${bookName.value} - 简单全本`;



const setChapterIndex = (index: number) => {
  currentBookChapterIndex.value = index;
  bookChaptersVisible.value = false;
  controlVisible.value = false;
};



const requestBookHistory = async () => {
  console.log("getOneHistory");
  const resp = await getOneHistory(bookId.value);
  if (resp.data[0] === 200) {
    setChapterIndex(resp.data[1][2]);
    isBookCollected.value = true;
  } else {
    setChapterIndex(0);
  }
};

const requestBookChapters = async () => {
  console.log('getBookChapters');
  const resp = await getBookChapters(bookId.value);
  currentBookChapters.value = resp.data;
  requestBookHistory();
};

const getTextCache = (bookId, textStartIndex, textEndIndex) => {
  const textCache = sessionStorage.getItem(`${bookId}-${textStartIndex}-${textEndIndex}`)
  if (textCache) {
    return JSON.parse(textCache)
  } else {
    return null
  } 
};


const setTextCache = (bookId, textStartIndex, textEndIndex, textArray) => {
  sessionStorage.setItem(`${bookId}-${textStartIndex}-${textEndIndex}`,JSON.stringify(textArray))
}

const requestBookChapter = async () => {
  const [ chapterName, textStartIndex, textEndIndex] = currentBookChapters.value[currentBookChapterIndex.value];
  let cache = getTextCache(bookId.value, textStartIndex, textEndIndex)
  if (!cache) {
    console.log("getBookChapter");
    const resp = await getBookChapter(bookId.value, textStartIndex, textEndIndex);
    if (!resp){
      return
    }
    setTextCache(bookId.value, textStartIndex, textEndIndex, resp.data)
    cache = resp.data
  } 
  currentBookChapterArray.value = cache;
  window.scrollTo(0, 0);
  if (isBookCollected.value) {
    saveOneHistory(bookId.value, currentBookChapterIndex.value, bookName.value);
  }
};



const collectBook = () => {
  isBookCollected.value = true;
  saveOneHistory(bookId.value, currentBookChapterIndex.value, bookName.value);
};

const discollectBook = () => {
  isBookCollected.value = false;
  removeOneHistory(bookId.value);
};

const changeBookCollectStatus = () => {
  isBookCollected.value ? discollectBook() : collectBook();
};

const addChapterIndex = (num: number) => {
  const next = currentBookChapterIndex.value + num;
  if (next >= 0 && next < currentBookChapters.value.length) {
    setChapterIndex(next);
  }
};

const switchBookChaptersVisible = () => {
  bookChaptersVisible.value = !bookChaptersVisible.value;
};

const switchControlVisible = () => {
  controlVisible.value = !controlVisible.value;
};

const startCache = async () => {
  const cacheSize = 10;
  const startIndex = currentBookChapterIndex.value;
  const endIndex = Math.min(startIndex + cacheSize, currentBookChapters.value.length);

  for (let i = startIndex; i < endIndex; i++) {
    const [ chapterName, textStartIndex, textEndIndex] = currentBookChapters.value[i];
    let cache = getTextCache(bookId.value, textStartIndex, textEndIndex)
    if (!cache) {
      const resp = await getBookChapter(bookId.value, textStartIndex, textEndIndex);
      if (!resp){
        return
      }
      setTextCache(bookId.value, textStartIndex, textEndIndex, resp.data)
    }
  }

  console.log(`Cached chapters from ${startIndex} to ${endIndex - 1}`);
};

onBeforeMount(() => {
  requestBookChapters();
});

watch(currentBookChapterIndex, requestBookChapter);
</script>

<template>
  <div class="reader" v-auto-animate>
    <ComponentChapters
      v-if="bookChaptersVisible"
      :chapters="currentBookChapters"
      :index="currentBookChapterIndex"
      :bid="bookId"
      @setChapterIndex="setChapterIndex"
      @switchBookChaptersVisible="switchBookChaptersVisible"
    />

    <div class="text-box" v-if="!bookChaptersVisible">
      <div class="bar top-bar shadow buttons" v-if="controlVisible">
        <span class="button" @click="switchBookChaptersVisible">
          <IconContent />
        </span>
        <div class="flex">
          <span class="button" @click="changeBookCollectStatus">
            <IconStar class="icon-smaill" :class="{ 'icon-fill': isBookCollected }" />
          </span>
        </div>
      </div>

      <ComponentChapterText
        ref="text"
        :chapter="currentBookChapterArray"
        @switchControlVisible="switchControlVisible"
        v-auto-animate
      />

      <ComponentPageCotroler
        class="bar bottom-bar shadow"
        v-if="controlVisible"
        @setPageIndex="addChapterIndex"
        :leftArrayVisible="currentBookChapterIndex !== 0"
        :rightArrayVisible="currentBookChapterIndex < currentBookChapters.length - 1"
      />
    </div>
  </div>
</template>