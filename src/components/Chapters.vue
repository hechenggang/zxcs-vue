<script setup lang="ts">
import { ref, defineEmits, computed, defineProps } from "vue";
import type { Chapters } from "../tools/store";

const props = defineProps<{
    chapters: Chapters,
    index: number
}>()

const emit = defineEmits<{
    (e: 'loadChapter', index: number): void
}>()

const chapterNavPages = computed(() => Array.from(Array(Math.ceil(props.chapters.length / chapterSliceStep.value)).keys()))
const chapterCurrentNavPage = ref(0)
const chapterSliceStep = ref(50)
const chapterSliceStart = computed(() => (chapterCurrentNavPage.value * chapterSliceStep.value))
const chapterSliceEnd = computed(() => (chapterSliceStart.value + chapterSliceStep.value))
const chapterSliceArrayList = computed(() => (props.chapters.slice(chapterSliceStart.value, chapterSliceEnd.value)))


chapterCurrentNavPage.value = Math.floor(props.index / 50) 

</script>

<template>
    <div class="chapters-container">
        <ul class="chapters">
            <li
                class="chapter"
                v-for="chapter in chapterSliceArrayList"
                @click="emit('loadChapter', chapter[0])"
                :key="chapter[0]"
            >
                <span>{{ chapter[1] }}</span>
            </li>
        </ul>
        <select v-model="chapterCurrentNavPage">
            <option v-for="page in chapterNavPages" :key="page" :value="page">第 {{ page + 1 }} 页</option>
        </select>
    </div>
</template>

<style  scoped>
select {
    padding: 0.5rem;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 5%;
    background-color: #b0d5df;
}

.chapters-container {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #fffef8;
}

.chapters {
    padding: 1rem;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 95%;
    overflow: auto;
}

.chapter {
    padding: 0.5rem 0;
}
</style>