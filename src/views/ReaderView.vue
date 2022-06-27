<script setup lang="ts">
import { computed, ref, watch,onBeforeMount } from "vue";
import {
  getBookChapters,
  getBookChapter,
  parseJson,
  saveOneHistory,
  removeOneHistory,
  getOneHistory,
} from "../request";
import { useRoute } from "vue-router";
import type { Chapters } from "../types";
import { getHistory, setHistory } from "../shared";

import ComponentChapters from "../components/Chapters.vue";
import ComponentPageCotroler from "../components/PageCotroler.vue";
import ComponentChapterText from "../components/ChapterText.vue";
import IconArrayLeft from "../components/icon/array-left.vue";
import IconArrayRight from "../components/icon/array-right.vue";
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
const bookChaptersVisible = ref(false);
const controlVisible = ref(false);
const isBookCollected = ref(false);

document.title = bookName.value + " - 简单全本";

// load book status from local history
const getBookCollectStatusFromHistory = () => {
  isBookCollected.value = getHistory().hasOwnProperty(bookId.value);
};
getBookCollectStatusFromHistory();

// first try to find index at localstorage, as collected book
// if not, set index to 0, as new book
const currentBookChapterIndex = isBookCollected.value
  ? ref(getHistory()[bookId.value][0])
  : ref(0);

const requestBookChapters = () => {
  getBookChapters((jsonData: any) => {
      if (!jsonData) {
        return;
      }
      console.log("getBookChapters", jsonData);
      currentBookChapters.value = jsonData.chapters;
    },bookId.value)
};

// it is better to load chapter content by index change instead of direct pass a index
const requestBookChapter = () => {
  getBookChapter((jsonData: any) => {
      if (!jsonData) {
        return;
      }
      console.log("getBookChapter", jsonData);
      currentBookChapterArray.value = jsonData.chapter;
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      // afterget a chapter,
      // update chapter status to history api when the book is collected
      if (getHistory().hasOwnProperty(bookId.value)) {
        saveOneHistory(
          ()=>{},
          bookId.value,
          currentBookChapterIndex.value,
          bookName.value
        );
      }
    },bookId.value, currentBookChapterIndex.value)
};

// read remote index
const requestBookHistory = () => {
  getOneHistory((jsonData: any) => {
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
    },bookId.value)
};

const collectBook = () => {
  const history = getHistory();
  history[bookId.value] = [currentBookChapterIndex.value, bookName.value];
  setHistory(history);
  getBookCollectStatusFromHistory();
  saveOneHistory(()=>{},bookId.value, currentBookChapterIndex.value, bookName.value);
};

const discollectBook = () => {
  const history = getHistory();
  delete history[bookId.value];
  setHistory(history);
  getBookCollectStatusFromHistory();
  removeOneHistory(()=>{},bookId.value);
};

const changeBookCollectStatus = () => {
  if (isBookCollected.value) {
    discollectBook();
  } else {
    collectBook();
  }
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
  setChapterIndex(next);
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
  if (getHistory().hasOwnProperty(bookId.value)) {
    requestBookHistory();
  }
});
</script>

<template>
  <ComponentChapters
    v-if="bookChaptersVisible"
    :chapters="currentBookChapters"
    :index="currentBookChapterIndex"
    @setChapterIndex="setChapterIndex"
    @switchBookChaptersVisible="switchBookChaptersVisible"
  />
  <div class="text-box" v-if="!bookChaptersVisible">
    <div class="bar top-bar shadow">
      <div class="buttons" v-if="controlVisible">
        <span class="button" @click="bookChaptersVisible = true">
          <!-- 目录图标 -->
          <IconContent />
        </span>
        <span class="button" @click="changeBookCollectStatus()">
          <!-- 收藏图标 -->
          <IconStar
            class="icon-smaill"
            :class="isBookCollected ? 'icon-fill' : ''"
          />
        </span>
      </div>
    </div>

    <ComponentChapterText
      ref="text"
      :chapter="currentBookChapterArray"
      @switchControlVisible="switchControlVisible"
    />

    <ComponentPageCotroler
      v-if="controlVisible"
      @setPageIndex="addChapterIndex"
      :leftArrayVisible="currentBookChapterIndex != 0"
      :rightArrayVisible="
        currentBookChapterIndex < currentBookChapters.length - 1
      "
    />
  </div>
</template>

