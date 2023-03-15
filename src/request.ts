import { CONFIG, REQUESTING_COUNT } from "./shared";
import type {   } from "./types";

function Get(
  url: string,
  dataHandler: Function,
  dataHandlerCallback: Function,
  params: Record<string, string | number> = {},
  headers: HeadersInit = {}
) {
  REQUESTING_COUNT.value += 1;
  const urlWithQuery = new URL(url);
  for (let k in params) {
    urlWithQuery.searchParams.append(k, String(params[k]));
  }
  fetch(urlWithQuery.toString(), {
    method: "GET",
    headers: Object.assign(headers, {
      "x-api-code": localStorage.getItem("x-api-code"),
    }),
  })
    .then((resp) => {
      dataHandler(resp, dataHandlerCallback);
      REQUESTING_COUNT.value -= 1;
    })
    .catch((reson) => {
      console.log("request error -> ", reson);
      REQUESTING_COUNT.value = -1;
    });
}

const parseJson = (resp: Response, callback: Function) => {
  switch (resp.status) {
    case 200:
      resp.json().then((data) => {
        callback(data);
      });
      break;
    case 404:
      alert("该内容正在准备，请稍后再试。 \n错误代码：" + resp.status);
      location.assign("/#/");
      break;
    case 400:
      location.assign("/#/");
      break;
    case 429:
      alert("抱歉，您请求的频率过快，请稍后再试。 \n错误代码：" + resp.status);
      location.assign("https://cdn.imhcg.cn/wait-a-moment.html?from="+location.href);
      break;
    default:
      alert("抱歉，服务器遇到了错误，请稍后再试。 \n错误代码：" + resp.status);
      location.assign("/#/");
      break;
  }
};

function getBooks(callback:Function,offset: number = 0, limit: number = 10, keyword: string = "") {
  let query = {}
  if (keyword != "") {
      query = { action: 'find', keyword, limit, offset }
  } else {
      query = { limit, offset, keyword }
  }
  return Get(CONFIG.baseUri + CONFIG.api.books,parseJson,callback ,query)
}

function getRandomBooks(callback:Function,offset: number = 0, limit: number = 10) {
  return Get(CONFIG.baseUri + CONFIG.api.books,parseJson,callback ,{ action: 'random', limit, offset })
}

function getBookChapters(callback:Function,id: string) {
  return Get(CONFIG.baseUri + CONFIG.api.chapters, parseJson, callback , { id })
}


function getBookChapter(callback:Function,id: string, index: number) {
  return Get(CONFIG.baseUri + CONFIG.api.chapter,parseJson,callback ,{ id, index })
}


function getAllHistory(callback:Function,) {
  return Get(CONFIG.baseUri + CONFIG.api.history,parseJson,callback , { action: 'get.all' })
}


function getOneHistory(callback:Function,id: string) {
  return Get(CONFIG.baseUri + CONFIG.api.history,parseJson,callback , { action: 'get.one', book_id: id })
}


function saveOneHistory(callback:Function,id: string, index: number, name: string) {
  return Get(CONFIG.baseUri + CONFIG.api.history,parseJson,callback , {
      action: 'insert',
      book_id: id,
      book_name: name,
      book_index: index
  })
}

function removeOneHistory(callback:Function,id: string) {
  return Get(CONFIG.baseUri + CONFIG.api.history,parseJson,callback , {
      action: 'remove',
      book_id: id,
  })
}

export { getBooks, getBookChapters, getBookChapter, parseJson, getAllHistory, getOneHistory, saveOneHistory, removeOneHistory, getRandomBooks }