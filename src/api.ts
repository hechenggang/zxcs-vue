import { ref } from 'vue'
import axios, { type AxiosPromise } from 'axios'

const apiUri = {
  "base": "https://api-zxcs.imhcg.cn/api",
  "login": "https://account.imhcg.cn/to/8bb1dab52c404b50154e5880e28c2db8",

  "books": "/books",
  "cover": "/cover/",
  "chapter": "/book/text",
  "chapters": "/book/index",
  "history": "/history"

};

const getApiCode = () => localStorage.getItem("x-api-code")
const setApiCode = (code: string) => localStorage.setItem("x-api-code", code)

// 当前并行请求数，用于支撑 Loading 组件
const currentRequestCount = ref(0);

// 准备一个请求实例
const http = axios.create({
  baseURL: apiUri.base,
  timeout: 15000
})


// 定义一个拦截器，读取 localstorage 内的 api code，载入请求 header 中
http.interceptors.request.use((config) => {
  currentRequestCount.value += 1
  const code = getApiCode()
  if (code) {
    config.headers.set('x-api-code', code);
  }
  return config
}, (error) => {
  // 请求阶段的错误拦截
  currentRequestCount.value -= 1
  // alert('请求失败，请检查网络连接或稍后再试。')
  return Promise.reject(error)
})


// 错误拦截
http.interceptors.response.use((res) => {
  currentRequestCount.value -= 1
  return res
}, (err) => {
  currentRequestCount.value -= 1
  console.log(err)
  // window.location.assign('/')
  return Promise.reject(err)
})


const getAllBooks = (offset: number = 0, limit: number = 10,): AxiosPromise => {
  return http.get(apiUri.books, { params: { limit, offset } })
}

const findBooks = (keyword: string, offset: number = 0, limit: number = 10): AxiosPromise => {
  return http.get(apiUri.books, { params: { limit, offset, keyword, action: 'find' } })
}

const getRandomBooks = (): AxiosPromise => {
  return http.get(apiUri.books, { params: { action: 'random' } })
}

const getBookChapters = (id: string): AxiosPromise => {
  return http.get(apiUri.chapters, { params: { id } })
}

const getBookChapter = (id: string, start: number, end: number): AxiosPromise => {
  return http.get(apiUri.chapter, { params: { id, start, end } })
}

const getAllHistory = (): AxiosPromise => {
  return http.get(apiUri.history, { params: { action: 'get.all' } })
}

const getOneHistory = (id: string): AxiosPromise => {
  return http.get(apiUri.history, { params: { action: 'get.one', id } })
}

const saveOneHistory = (id: string, index: number, name: string): AxiosPromise => {
  return http.get(apiUri.history, {
    params: {
      action: 'insert',
      id: id,
      name: name,
      index: index
    }
  })
}

const removeOneHistory = (id: string): AxiosPromise => {
  return http.get(apiUri.history, { params: { action: 'remove', id } })
}

export {
  apiUri, getApiCode, setApiCode, getAllBooks, findBooks, getBookChapters, getBookChapter, getAllHistory, getOneHistory, saveOneHistory, removeOneHistory, getRandomBooks, currentRequestCount
}

