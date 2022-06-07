<script setup lang="ts">
import { ref, defineEmits, computed, defineProps, onMounted } from "vue";
import type { Chapters } from "../tools/store";
import IconClose from "./icon/close.vue";

const props = defineProps<{
  chapters: Chapters;
  index: number;
}>();

const emit = defineEmits<{
  (e: "setChapterIndex", index: number): void;
  (e: "switchBookChaptersVisible"): void;
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

onMounted(() => {
  // on chapters mounted , scroll to where active chapter place
  // but it should * 1.75 to make top or bottom both can be display in view
  document.documentElement.scrollTop =
    ((window.screen.height * (props.index % chapterSliceStep.value)) /
      chapterSliceStep.value)*2;
  document.body.scrollTop =
    ((window.screen.height * (props.index % chapterSliceStep.value)) /
      chapterSliceStep.value)*2;
});
</script>

<template>
  <div class="chapters-container">
    <div class="buttons shadow top-bar">
      <span class="button" @click="emit('switchBookChaptersVisible')">
        <IconClose/>

      </span>
      <select class="button" v-model="chapterCurrentNavPage">
        <option v-for="page in chapterNavPages" :key="page" :value="page">
          第 {{ page + 1 }} 页
        </option>
      </select>
    </div>

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
  </div>
</template>

<style >
.chapters-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}



.chapters {
  padding: 5rem 1rem;
  width: 100%;
  overflow: auto;
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
  /* border: 1px solid var(--color-link); */
  border-left: 0.25rem solid var(--color-link);
  padding-left: 0.5rem;
}


</style>