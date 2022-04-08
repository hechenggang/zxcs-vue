import { ref } from 'vue'
import { useLocalStorage, useMouse } from '@vueuse/core'


import { onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { localConfig, localApiCode } from "./store";
import { Get } from "./";

function getBooks(offset: number = 0, limit: number = 10, keyword: string = "") {
    return Get(localConfig.value.baseUri + localConfig.value.api.books, { limit, offset, keyword })
}

function getBookChapters(id:number):Promise<Response> {
    return Get(localConfig.value.baseUri + localConfig.value.api.chapters, { id })
}


function getBookChapter(id:number,index:number):Promise<Response> {
    return Get(localConfig.value.baseUri + localConfig.value.api.chapter, { id,index })
}
export { getBooks, getBookChapters,getBookChapter }