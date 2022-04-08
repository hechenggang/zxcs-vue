<script setup lang="ts">
import { ref, defineEmits, computed, defineProps, } from "vue";
import type { Ref } from 'vue'
const props = defineProps<{
    chapter: Array<string>
}>()

const emit = defineEmits<{
    (e: 'chapterControl', mouse: number): void
}>()


const renderHtmlText = (chapterArray: Array<string>) => {
    let chapterHtml = ""
    for (let i = 0; i < chapterArray.length; i++) {
        chapterHtml +=
            "<p>" +
            chapterArray[i].replace(/^\s+|\s+$/g, "") +
            "</p>";
    }
    return chapterHtml
}
// const chapterArray = ref(props.chapter)
const chapterHtml = computed(() => renderHtmlText(props.chapter))


</script>

<template>
    <div class="chapter-text" v-html="chapterHtml"></div>
</template>

<style >
.chapter-text {
    padding: 1rem;
    overflow: auto;
    min-height: 100vh;
    background-color: #fffef8;
}

.chapter-text p {
    text-indent: 2rem;
    line-height: 2.5rem;
    word-wrap: break-word;
    font-size: 1.25rem;
}
</style>