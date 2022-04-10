<script setup lang="ts">
import { ref, defineEmits, computed, defineProps } from "vue";
import type { Chapters } from "../tools/store";

const props = defineProps<{
  chapters: Chapters;
  index: number;
}>();

const emit = defineEmits<{
  (e: "setChapterIndex", index: number): void;
}>();

const chapterNavPages = computed(() =>
  Array.from(
    Array(Math.ceil(props.chapters.length / chapterSliceStep.value)).keys()
  )
);
const chapterCurrentNavPage = ref(0);
const chapterSliceStep = ref(50);
const chapterSliceStart = computed(
  () => chapterCurrentNavPage.value * chapterSliceStep.value
);
const chapterSliceEnd = computed(
  () => chapterSliceStart.value + chapterSliceStep.value
);
const chapterSliceArrayList = computed(() =>
  props.chapters.slice(chapterSliceStart.value, chapterSliceEnd.value)
);

chapterCurrentNavPage.value = Math.floor(props.index / 50);
</script>

<template>
  <div class="chapters-container">
    <ul class="chapters">
      <li
        v-for="chapter in chapterSliceArrayList"
        :class="
          props.index === chapter[0] ? 'chapter active-chapter' : 'chapter'
        "
        @click="emit('setChapterIndex', chapter[0])"
        :key="chapter[0]"
      >
        {{ chapter[1] }}
      </li>
    </ul>
    <select class="chapters-page-select shadow" v-model="chapterCurrentNavPage">
      <option v-for="page in chapterNavPages" :key="page" :value="page">
        第 {{ page + 1 }} 页
      </option>
    </select>
  </div>
</template>

<style >
.chapters-container {
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.chapters-page-select {
  padding: 0.5rem;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 6%;
  cursor: pointer;
  color: var(--color-link);
}

.chapters {
  padding: 1rem;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 94%;
  overflow: auto;
}

.chapter {
  padding: 0.5rem 0;
  font-size: 1rem;
  line-height: 1.5rem;
  cursor: pointer;
  color: var(--color-link);
}

.chapter * {
  color: var(--color-link);
}

.active-chapter {
  border-left: 0.25rem solid var(--color-link);
  padding-left: 0.5rem;
}

.shadow {
  box-shadow: 0 0px 5px rgba(0, 0, 0, 0.2);
}
</style>