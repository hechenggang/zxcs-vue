import { ref } from "vue";
import type { History } from './types'

const REQUESTING_COUNT = ref(0);

const CONFIG = {
  "baseUri": "https://api.zxcs.imhcg.cn/api",
  "loginUri": "https://account.imhcg.cn/to/8bb1dab52c404b50154e5880e28c2db8",
  "api": {
      "books":"/books",
      "cover":"/cover/",
      "chapter":"/book/text",
      "chapters":"/book/index",
      "history":"/history"
  }
};

const getApiCode = ()=>localStorage.getItem("x-api-code")
const setApiCode = (code:string)=>localStorage.setItem("x-api-code",code)



export { REQUESTING_COUNT, CONFIG,getApiCode,setApiCode };
