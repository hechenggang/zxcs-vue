import { ref } from 'vue'


const Config = {
    "baseUri": "https://zxcs.imhcg.cn/api",
    "loginUri": "https://account.imhcg.cn/to/8bb1dab52c404b50154e5880e28c2db8",
    "api": {
        "books":"/books",
        "cover":"/static/cover@webp/",
        "chapter":"/chapter",
        "chapters":"/chapters",
        "history":"/history"
    }
}

type Book = {
    book_author: string,
    book_brief: string,
    book_id: number,
    book_name: string,
}

type Books = Array<Book>
type Chapter = [number, string]
type Chapters = Array<Chapter>
type History = Record<string,[number,string]>

const getApiCode = ()=>localStorage.getItem("x-api-code")
const setApiCode = (code:string)=>localStorage.setItem("x-api-code",code)
const getHistory = ()=>JSON.parse(localStorage.getItem("history") as string) as History
const setHistory = (history:History)=>localStorage.setItem("history",JSON.stringify(history))

const FullscreenLoading = ref(false)

export { Config, getApiCode,setApiCode,getHistory,setHistory, FullscreenLoading  }
export type { History, Book, Books, Chapter, Chapters }