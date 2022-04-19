import { ref } from 'vue'
import { useLocalStorage, useMouse, useTitle } from '@vueuse/core'

type remoteConfig = {
    "baseUri": string,
    "loginUri": string,
    "api": {
        "books": string,
        "cover": string,
        "chapter": string,
        "chapters": string,
        "history": string
    }
}

type Book = {
    book_author: string,
    book_brief: string,
    book_id: number,
    book_name: string
}

type Books = Array<Book>

type Chapter = [number, string]
type Chapters = Array<Chapter>

const localConfig = useLocalStorage("remoteConfig", {
    "baseUri": "https://zxcs.imhcg.cn/api",
    "loginUri": "https://account.imhcg.cn/to/c5129aaf0c34ae93d82a60f8888d9945",
    "api": {
        "books":"/books",
        "cover":"/static/cover@webp/",
        "chapter":"/chapter",
        "chapters":"/chapters",
        "history":"/history"
    }
})
const localApiCode = useLocalStorage("x-api-code", "")
const History = useLocalStorage<Record<string,[number,string]>>("history", {})
const FullscreenLoading = ref(false)
const Title = useTitle("简单全本")

export { localConfig, localApiCode, FullscreenLoading, Title, History }
export type { remoteConfig, Book, Books, Chapter, Chapters }