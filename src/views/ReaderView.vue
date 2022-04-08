<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { getBookChapters, getBookChapter } from "../tools/request";
import { onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import type { Chapters } from "../tools/store";
import ComponentChapters from "../components/Chapters.vue";
import ComponentChapterText from "../components/ChapterText.vue";
import { FullscreenLoading } from "../tools/store";


const route = useRoute()
const bookId = ref(route.query.id)
const bookName = ref(route.query.name)
const currentBookChapters = ref<Chapters>([])
const currentBookChapterArray = ref<Array<string>>([])
const showBookChapters = ref(false)
const currentBookChapterIndex = ref(0)


const parseJson = (resp: Response, callback: Function) => {
    if (resp.status === 200) {
        resp.json().then(
            (data) => {
                callback(data)
            }
        )
    } else {
        alert("错误代码 " + resp.status)
    }
}

const requestBookChapters = () => {
    FullscreenLoading.value = true
    getBookChapters(Number(bookId.value)).then((resp) => {
        parseJson(resp, (jsonData: any) => {
            console.log(jsonData)
            currentBookChapters.value = jsonData.chapters
            FullscreenLoading.value = false

        })
    })
}


const requestBookChapter = (index: number) => {
    console.log("加载章节" + index)
    FullscreenLoading.value = true

    getBookChapter(Number(bookId.value), index).then((resp) => {
        parseJson(resp, (jsonData: any) => {
            console.log(jsonData)
            currentBookChapterArray.value = jsonData.chapter
            showBookChapters.value = false
            currentBookChapterIndex.value = index
            FullscreenLoading.value = false
            document.documentElement.scrollTop = 0;
        })
    })
}

function changeIndex(num: number) {
    const next = currentBookChapterIndex.value + num
    if (next >= currentBookChapters.value.length) {
        return
    }
    if (next < 0) {
        return
    }
    currentBookChapterIndex.value = next

}


watch(currentBookChapterIndex, (index) => { requestBookChapter(index) })

onMounted(() => {
    requestBookChapters()
    requestBookChapter(currentBookChapterIndex.value)
})

</script>

<template>
    <div class="buttons">
        <button @click="showBookChapters = true">显示目录</button>
        <button @click="changeIndex(-1)">上一章</button>
    </div>
    <ComponentChapterText ref="text" :chapter="currentBookChapterArray" />
    <ComponentChapters
        v-if="showBookChapters"
        :chapters="currentBookChapters"
        :index="currentBookChapterIndex"
        @loadChapter="requestBookChapter"
    />
    <div class="buttons">
        <button @click="changeIndex(1)">下一章</button>
    </div>
</template>


<style scoped>
button {
    margin-left: 0.25rem;
    padding: 0.5rem;
}
.buttons {
    display: flex;
    justify-content: right;
    padding: 1rem;
}
</style>