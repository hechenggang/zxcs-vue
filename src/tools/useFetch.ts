import { ref } from 'vue'

export function useFetch(url:string,config?:any):{data:Response,error:Response} {
  const data = ref<Response>()
  const error = ref<Response>()

  fetch(url,config)
    // .then((res) => res.json())
    .then((res) => (data.value = res))
    .catch((err) => (error.value = err))

  return { data, error }
}