import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueLazyLoad from 'vue3-lazyload'
// import Image404 from "@/assets/404.png";
import Image404 from "@/components/icon/cover.svg";


import { autoAnimatePlugin } from '@formkit/auto-animate/vue'

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

app.use(autoAnimatePlugin)

app.mount('#app')
