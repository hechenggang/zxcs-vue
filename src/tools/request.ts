

import { Config, FullscreenLoading } from "./store";

import { Get } from "./";


const parseJson = (resp: Response, callback: Function) => {
    FullscreenLoading.value = false;
    switch (resp.status) {
        case 200:
            resp.json().then((data) => {
                callback(data);
            });
            break;
        case 404:
            alert("该内容正在准备，请稍后再试。 \n错误代码：" + resp.status);
            location.assign('/#/')
            break;
        case 400:
            location.assign('/#/')
            break;
        case 429:
            alert("抱歉，您请求的频率过快，请稍后再试。 \n错误代码：" + resp.status);
            location.assign('/#/')
            break;
        default:
            alert("抱歉，服务器遇到了错误，请稍后再试。 \n错误代码：" + resp.status);
            location.assign('/#/')
            break;
    }
};


function getBooks(offset: number = 0, limit: number = 10, keyword: string = "") {
    let query = {}
    if (keyword != "") {
        query = { action: 'find', keyword, limit, offset }
    } else {
        query = { limit, offset, keyword }
    }
    return Get(Config.baseUri + Config.api.books, query)
}

function getBookChapters(id: string): Promise<Response> {
    return Get(Config.baseUri + Config.api.chapters, { id })
}


function getBookChapter(id: string, index: number): Promise<Response> {
    return Get(Config.baseUri + Config.api.chapter, { id, index })
}


function getAllHistory(): Promise<Response> {
    return Get(Config.baseUri + Config.api.history, { action: 'get.all' })
}


function getOneHistory(id: string): Promise<Response> {
    return Get(Config.baseUri + Config.api.history, { action: 'get.one', book_id: id })
}


function saveOneHistory(id: string, index: number, name: string): Promise<Response> {
    return Get(Config.baseUri + Config.api.history, {
        action: 'insert',
        book_id: id,
        book_name: name,
        book_index: index
    })
}

function removeOneHistory(id: string): Promise<Response> {
    return Get(Config.baseUri + Config.api.history, {
        action: 'remove',
        book_id: id,
    })
}

export { getBooks, getBookChapters, getBookChapter, parseJson, getAllHistory, getOneHistory, saveOneHistory, removeOneHistory }