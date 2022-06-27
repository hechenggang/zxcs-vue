import { ref } from "vue";
import type { History } from './types'

const REQUESTING_COUNT = ref(0);

const CONFIG = {
  "baseUri": "https://zxcs.imhcg.cn/api",
  "loginUri": "https://account.imhcg.cn/to/8bb1dab52c404b50154e5880e28c2db8",
  "api": {
      "books":"/books",
      "cover":"/static/cover@webp/",
      "chapter":"/chapter",
      "chapters":"/chapters",
      "history":"/history"
  }
};

const getApiCode = ()=>localStorage.getItem("x-api-code")
const setApiCode = (code:string)=>localStorage.setItem("x-api-code",code)
const getHistory = ()=>JSON.parse(localStorage.getItem("history") as string) as History
const setHistory = (history:History)=>localStorage.setItem("history",JSON.stringify(history))


export { getApiCode,setApiCode,getHistory,setHistory  }

export { REQUESTING_COUNT, CONFIG };
