<script setup lang="ts">
import { computed, ref, watch, onBeforeMount, provide } from "vue";
import {
  getBookChapters,
  getBookChapter,
  saveOneHistory,
  removeOneHistory,
  getOneHistory,
} from "../api";
import { useRoute } from "vue-router";
import type { typeChapters } from "../types";
import ComponentChapters from "../components/Chapters.vue";
import ComponentPageCotroler from "../components/PageCotroler.vue";
import ComponentChapterText from "../components/ChapterText.vue";
import IconStar from "../components/icon/star.vue";
import IconContent from "../components/icon/content.vue";
import componentSpinner from "../components/Spinner.vue";
import ComponentButtonWithLoading from "@/components/ButtonWithLoading.vue";


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
const currentBookChapters = ref<typeChapters>([]);
const currentBookChapterArray = ref<Array<string>>([]);
const currentBookChapterIndex = ref<number>(-1);
const bookChaptersVisible = ref(false);
const controlVisible = ref(false);
const isBookCollected = ref(false);
const isCaching = ref(false);
const remainingChapters = ref(0);

document.title = `${bookName.value} - 简单全本`;

const setChapterIndex = async (index: number) => {
  if (index != currentBookChapterIndex.value) {
    console.log("setChapterIndex", index);
    currentBookChapterIndex.value = index;
    try {
      await requestBookChapter()
    } catch (error) {
      console.log(error)
    }
  }
  bookChaptersVisible.value = false;
  controlVisible.value = false;
};

const requestBookHistory = async () => {
  const resp = await getOneHistory(bookId.value);
  if (resp.data[0] === 200) {
    setChapterIndex(resp.data[1][2]);
    isBookCollected.value = true;
  } else {
    setChapterIndex(0);
  }
};

const requestBookChapters = async () => {
  const resp = await getBookChapters(bookId.value);
  currentBookChapters.value = resp.data;
  requestBookHistory();
};

const getTextCache = (bookId: string, textStartIndex: number, textEndIndex: number) => {
  const textCache = sessionStorage.getItem(`${bookId}-${textStartIndex}-${textEndIndex}`)
  return textCache ? JSON.parse(textCache) : null;
};

const setTextCache = (bookId: string, textStartIndex: number, textEndIndex: number, textArray: string[]) => {
  sessionStorage.setItem(`${bookId}-${textStartIndex}-${textEndIndex}`, JSON.stringify(textArray));
};

const requestBookChapter = async () => {
  const [chapterName, textStartIndex, textEndIndex] = currentBookChapters.value[currentBookChapterIndex.value];
  let cache = getTextCache(bookId.value, textStartIndex, textEndIndex);
  if (!cache) {
    const resp = await getBookChapter(bookId.value, textStartIndex, textEndIndex);
    if (!resp) return;
    setTextCache(bookId.value, textStartIndex, textEndIndex, resp.data);
    cache = resp.data;
  }
  currentBookChapterArray.value = cache;
  window.scrollTo(0, 0);
  if (isBookCollected.value) {
    saveOneHistory(bookId.value, currentBookChapterIndex.value, bookName.value);
  }
};

const collectBook = async () => {
  try {
    isBookCollected.value = true;
    await saveOneHistory(bookId.value, currentBookChapterIndex.value, bookName.value);
  } catch (error) {
    isBookCollected.value = false;
  }
};

const discollectBook = async () => {
  try {
    isBookCollected.value = false;
    await removeOneHistory(bookId.value);
  } catch (error) {
    isBookCollected.value = true;
  }
  isBookCollected.value = false;
};


const addChapterIndex = async (num: number) => {
  const next = currentBookChapterIndex.value + num;
  if (next >= 0 && next < currentBookChapters.value.length) {
    await setChapterIndex(next);
  }
};

const switchBookChaptersVisible = () => {
  bookChaptersVisible.value = !bookChaptersVisible.value;
  controlVisible.value = !controlVisible.value
};

const switchControlVisible = () => {
  controlVisible.value = !controlVisible.value;
};


const startCache = () => {
  return new Promise(async (resolve, reject) => {
    try {
      isCaching.value = true;
      const cacheSize = 20;
      const startIndex = currentBookChapterIndex.value;
      const endIndex = Math.min(startIndex + cacheSize, currentBookChapters.value.length);
      remainingChapters.value = endIndex - startIndex;
      for (let i = startIndex; i < endIndex; i++) {
        const [chapterName, textStartIndex, textEndIndex] = currentBookChapters.value[i];
        let cache = getTextCache(bookId.value, textStartIndex, textEndIndex);
        console.log("getTextCache", i);
        if (!cache) {
          try {
            const resp = await getBookChapter(bookId.value, textStartIndex, textEndIndex);
            setTextCache(bookId.value, textStartIndex, textEndIndex, resp.data);
          } catch (error) {
            console.log(error);
            remainingChapters.value--;
            continue;
          }
        }
        remainingChapters.value--;
      }
      isCaching.value = false;
      console.log(`Cached chapters from ${startIndex} to ${endIndex - 1}`);
      resolve(true);
    } catch (error) {
      reject(false)
    }
  });
};


const doStarBook = () => {
  return new Promise(async (resolve, reject) => {
    try {
      isBookCollected.value ? await discollectBook() : await collectBook();
      resolve(true)
    } catch (error) {
      reject(false)
    }
  });
};

onBeforeMount(() => {
  requestBookChapters();
});

// watch(currentBookChapterIndex, requestBookChapter);

provide('startCache', startCache);
provide('isCaching', isCaching);
provide('remainingChapters', remainingChapters);


</script>

<template>
  <div class="reader">

    <ComponentChapters v-if="bookChaptersVisible" :chapters="currentBookChapters" :index="currentBookChapterIndex"
      :bid="bookId" :setChapterIndex="setChapterIndex" @switchBookChaptersVisible="switchBookChaptersVisible" />

    <div class="text-box" v-show="!bookChaptersVisible">
      <div class="bar top-bar shadow buttons" v-show="controlVisible">
        <span class="button" @click="switchBookChaptersVisible">
          <IconContent />
        </span>
        <ComponentButtonWithLoading class="button" :size="20" :thicknesses="3" :action="doStarBook">
          <IconStar :class="{ 'icon-fill': isBookCollected }" />
        </ComponentButtonWithLoading>
      </div>
    </div>

    <div class="center" v-show="currentBookChapterArray.length == 0">
      <componentSpinner v-auto-animate />
    </div>

    <ComponentChapterText ref="text" v-show="!bookChaptersVisible && currentBookChapterArray.length > 0"
      :chapter="currentBookChapterArray" @switchControlVisible="switchControlVisible" v-auto-animate />

    <div class="center" v-show="currentBookChapterArray.length == 0">
      <componentSpinner />
    </div>

    <ComponentPageCotroler class="bar bottom-bar shadow" v-show="controlVisible" :action="addChapterIndex"
      :leftArrayVisible="currentBookChapterIndex !== 0"
      :rightArrayVisible="currentBookChapterIndex < currentBookChapters.length - 1" />
  </div>
</template>