

import { localConfig, FullscreenLoading } from "./store";

import { Get } from "./";


const parseJson = (resp: Response, callback: Function) => {
    if (resp.status === 200) {
        resp.json().then((data) => {
            callback(data);
            FullscreenLoading.value = false;
        });
    } else {
        callback(null);
        FullscreenLoading.value = false;
        alert("抱歉，你请求的内容还未准备好，请稍后再试。 \n错误代码：" + resp.status);
    }
};


function getBooks(offset: number = 0, limit: number = 10, keyword: string = "") {
    let query = {}
    if (keyword != "") {
        query = { action: 'find', keyword, limit, offset }
    } else {
        query = { limit, offset, keyword }
    }
    return Get(localConfig.value.baseUri + localConfig.value.api.books, query)
}

function getBookChapters(id: string): Promise<Response> {
    return Get(localConfig.value.baseUri + localConfig.value.api.chapters, { id })
}


function getBookChapter(id: string, index: number): Promise<Response> {
    return Get(localConfig.value.baseUri + localConfig.value.api.chapter, { id, index })
}


function getAllHistory(): Promise<Response> {
    return Get(localConfig.value.baseUri + localConfig.value.api.history, { action: 'get.all' })
}


function getOneHistory(id: string): Promise<Response> {
    return Get(localConfig.value.baseUri + localConfig.value.api.history, { action: 'get.one', book_id: id })
}


function saveOneHistory(id: string, index: number, name: string): Promise<Response> {
    return Get(localConfig.value.baseUri + localConfig.value.api.history, {
        action: 'insert',
        book_id: id,
        book_name: name,
        book_index: index
    })
}

function removeOneHistory(id: string): Promise<Response> {
    return Get(localConfig.value.baseUri + localConfig.value.api.history, {
        action: 'remove',
        book_id: id,
    })
}

export { getBooks, getBookChapters, getBookChapter, parseJson, getAllHistory, getOneHistory, saveOneHistory, removeOneHistory }