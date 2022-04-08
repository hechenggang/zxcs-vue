
import { useRouter } from 'vue-router'
import { onBeforeMount } from "vue";
import { localApiCode } from './store';



async function Post(url:string,body:BodyInit="",headers:HeadersInit={}) {
    return fetch(url, {
        method: "POST",
        headers: headers,
        body: body,
        mode: "cors",
      })
}

function Get(url:string,params:Record<string,string|number>={},headers:HeadersInit={}) {
    const urlWithQuery = new URL(url);
    for (let k in params) { urlWithQuery.searchParams.append(k, String(params[k])); }
    const mixedHeaders = Object.assign(headers,{"x-api-code":localApiCode.value})
    return fetch(urlWithQuery.toString(), {
        method: "GET",
        headers: mixedHeaders,
        mode: "cors",
      })
}

export {Get,Post}