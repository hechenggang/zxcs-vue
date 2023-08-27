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
// import { getHistory, setHistory } from "../shared";

import ComponentChapters from "../components/Chapters.vue";
import ComponentPageCotroler from "../components/PageCotroler.vue";
import ComponentChapterText from "../components/ChapterText.vue";
import ComponentTTSControl from "../components/TTSControl.vue";
import IconArrayLeft from "../components/icon/array-left.vue";
import IconArrayRight from "../components/icon/array-right.vue";
import IconStar from "../components/icon/star.vue";
import IconContent from "../components/icon/content.vue";
import IconHeadphones from "../components/icon/headphones.vue";
import IconHeadphonesOff from "../components/icon/headphones-off.vue";

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
const currentBookChapterIndex = ref();
const bookChaptersVisible = ref(false);
const controlVisible = ref(false);
const isBookCollected = ref(false);
const isReadingMode = ref(false);

document.title = bookName.value + " - 简单全本";




const requestBookChapters = () => {
  console.log('getBookChapters')
  getBookChapters(bookId.value).then((resp) => {
    currentBookChapters.value = resp.data
    requestBookHistory()
  })
};



const requestBookChapter = () => {
  console.log("getBookChapter");
  getBookChapter(
    bookId.value, 
    currentBookChapters.value[currentBookChapterIndex.value][1],
    currentBookChapters.value[currentBookChapterIndex.value][2],
    ).then((resp) => {
    currentBookChapterArray.value = resp.data
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    // after get a chapter,
    // update chapter status to history api when the book is collected
    if (isBookCollected.value) {
      saveOneHistory(
        bookId.value,
        currentBookChapterIndex.value,
        bookName.value
      );
    }

  })


};

function setChapterIndex(index: number) {
  currentBookChapterIndex.value = index;
  bookChaptersVisible.value = false;
  controlVisible.value = false;
  requestBookChapter()
}

// read remote index
const requestBookHistory = () => {
  console.log("getOneHistory");
  getOneHistory(bookId.value).then((resp) => {
    //   [book_id,book_name,index,time]]
    if (resp.data[0] == 200) {
      setChapterIndex(resp.data[1][2]);
      isBookCollected.value = true
    } else {
      setChapterIndex(0)

    }
  })
};

const collectBook = () => {
  isBookCollected.value = true
  saveOneHistory(bookId.value, currentBookChapterIndex.value, bookName.value);
};

const discollectBook = () => {
  isBookCollected.value = false
  removeOneHistory(bookId.value);
};

const changeBookCollectStatus = () => {
  if (isBookCollected.value) {
    discollectBook();
  } else {
    collectBook();
  }
};



function addChapterIndex(num: number) {
  const next = Number(currentBookChapterIndex.value) + Number(num);
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


// request data before page mounted
onBeforeMount(() => {
  requestBookChapters();
  
});

// watch(currentBookChapterIndex, () => {
//   requestBookChapter()
// })

</script>

<template>
  <div class="reader" v-auto-animate>

    <ComponentChapters v-if="bookChaptersVisible" :chapters="currentBookChapters" :index="currentBookChapterIndex"
      @setChapterIndex="setChapterIndex" @switchBookChaptersVisible="switchBookChaptersVisible" />
  
  
    <div class="text-box" v-if="!bookChaptersVisible">
      <div class="bar top-bar shadow buttons" v-if="controlVisible">
        <span class="button" @click="bookChaptersVisible = true">
          <!-- 目录图标 -->
          <IconContent />
        </span>
        <div class="flex">
          <span class="button" @click="changeBookCollectStatus()">
            <!-- 收藏图标 -->
            <IconStar class="icon-smaill" :class="isBookCollected ? 'icon-fill' : ''" />
          </span>
        </div>
      </div>
  
      <ComponentChapterText ref="text" :chapter="currentBookChapterArray" @switchControlVisible="switchControlVisible" v-auto-animate/>
  
      <ComponentPageCotroler class="bar bottom-bar shadow" v-if="controlVisible" @setPageIndex="addChapterIndex"
        :leftArrayVisible="currentBookChapterIndex != 0" :rightArrayVisible="
          currentBookChapterIndex < currentBookChapters.length - 1
        " />
    </div>
  </div>
</template>

