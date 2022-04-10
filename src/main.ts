import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueLazyLoad from 'vue3-lazyload'
import Image404 from "@/assets/404.png";

const app = createApp(App)

// make v-focus useable any component
app.directive('focus', {
  mounted(el:HTMLElement){
    el.focus()
  }
})

app.use(VueLazyLoad,{
    loading: Image404,
    error: Image404
  })
app.use(router)

app.mount('#app')
