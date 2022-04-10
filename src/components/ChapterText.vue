<script setup lang="ts">
import { ref, defineEmits, computed, defineProps, } from "vue";
import type { Ref } from 'vue'
const props = defineProps<{
    chapter: Array<string>
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
    background-color: var(--color-bg);
}

.chapter-text p {
    text-indent: 2rem;
    line-height: 2rem;
    font-size: 1.25rem;
    word-wrap: break-word;
}
</style>