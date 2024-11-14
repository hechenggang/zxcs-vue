<script setup lang="ts">
import { ref, defineEmits, computed, defineProps, onMounted, watch, inject, watchEffect } from "vue";
import type { Ref } from "vue";

import type { typeChapter, typeChapters } from "../types";
import ComponentPageCotroler from "../components/PageCotroler.vue";
import IconClose from "./icon/close.vue";
import IconDownload from "./icon/download.vue";
import ComponentSpinner from "../components/Spinner.vue";
import ComponentButtonWithLoading from "@/components/ButtonWithLoading.vue";


// 定义组件的props
const props = defineProps<{
  chapters: typeChapters;
  index: number;
  bid: string;
}>();

// 定义组件的emits
const emit = defineEmits<{
  (e: "setChapterIndex", index: number): void;
  (e: "switchBookChaptersVisible"): void;
}>();

// 构建页面导航列表
const chapterNavPages = computed(() =>
  Array.from(
    Array(Math.ceil(props.chapters.length / chapterSliceStep.value)).keys()
  )
);

const chapterSliceStep = ref(50);
const chapterCurrentNavPage = ref(0);

// 初始化当前导航页面
chapterCurrentNavPage.value = Math.floor(props.index / chapterSliceStep.value);

// 计算属性：章节切片起始位置
const chapterSliceStart = computed(() => chapterCurrentNavPage.value * chapterSliceStep.value);

// 计算属性：章节切片结束位置
const chapterSliceEnd = computed(() => chapterSliceStart.value + chapterSliceStep.value);

// 改变页面索引
const changePageIndex = (num: number) => (chapterCurrentNavPage.value += num);

// 计算属性：章节切片数组
const chapterSliceArrayList = ref(props.chapters.slice(chapterSliceStart.value, chapterSliceEnd.value))

// 获取页面缓存状态
const getTextCacheStatus = (chapter: typeChapter) => {
  const [name, textStartIndex, textEndIndex] = chapter;
  const textCache = sessionStorage.getItem(`${props.bid}-${textStartIndex}-${textEndIndex}`);
  return textCache ? true : false;
};

// 监听导航页面变化，滚动到顶部
watch(chapterCurrentNavPage, () => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
});

// 组件挂载时，滚动到当前章节位置
onMounted(() => {
  const scrollPosition = ((window.screen.height * (props.index % chapterSliceStep.value)) / chapterSliceStep.value) * 2.5;
  document.documentElement.scrollTop = scrollPosition;
  document.body.scrollTop = scrollPosition;
});

// 注入 startCache 函数
const startCache = inject<() => Promise<void>>('startCache');
const isCaching = inject<Ref<boolean>>('isCaching');
const remainingChapters = inject<Ref<number>>('remainingChapters');

// 监听 remainingChapters 变化，重新计算 chapterSliceArrayList
watch([remainingChapters,chapterSliceStart,chapterSliceEnd],() => {
  if (remainingChapters) {
    chapterSliceArrayList.value = props.chapters.slice(chapterSliceStart.value, chapterSliceEnd.value);
  }
})

</script>

<template>
  <div class="chapters-container">
    <div class="buttons bar top-bar shadow">
      <span class="button" @click="emit('switchBookChaptersVisible')">
        <IconClose />
      </span>
      <div class="flex-right-groups">

        <ComponentButtonWithLoading :size="20" :thicknesses="2" :action="startCache">
          <IconDownload />
        </ComponentButtonWithLoading>

        <select class="button pages-selecter" v-model="chapterCurrentNavPage">
          <option v-for="page in chapterNavPages" :key="page" :value="page">
            第 {{ page + 1 }} 页
          </option>
        </select>
      </div>
    </div>

    <ul class="chapters" v-auto-animate>
      <li v-for="(chapter, index) in chapterSliceArrayList"
        :class="{ 'chapter': '1', 'active-chapter': (props.index === index + chapterSliceStart), 'cached-chapter': getTextCacheStatus(chapter) }"
        @click="emit('setChapterIndex', index + chapterSliceStart)" :key="chapter[0]">
        {{ chapter[0] }}
      </li>
    </ul>

    <ComponentPageCotroler @setPageIndex="changePageIndex" :leftArrayVisible="chapterCurrentNavPage != 0"
      :rightArrayVisible="chapterCurrentNavPage < chapterNavPages.length - 1" />
  </div>
</template>

<style scoped>
.chapters-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 3.5rem 1rem;
  background-color: var(--color-bg);
}

.chapters {
  width: 100%;
  overflow: auto;
  margin: 1rem 0;

}

.chapter {
  padding: 0.5rem 0;
  font-size: 1rem;
  line-height: 1.5rem;
  cursor: pointer;
  color: var(--color-link);
  border-bottom: 1px solid #ededed;
}

.chapter * {
  color: var(--color-link);
}

.active-chapter {
  border-left: 0.25rem solid var(--color-link2);
  padding-left: 0.5rem;
}

.cached-chapter {
  border-right: 0.25rem solid var(--color-success);
}

.button {
  display: flex;
  align-items: center;
}

.remaining {
  font-size: 0.8rem;
  margin-left: 0.5rem;
}

.flex-right-groups {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
  margin-left: 1rem;
}

.pages-selecter {
  font-size: 0.8rem;
}
</style>