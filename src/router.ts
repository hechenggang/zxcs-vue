
import { createRouter, createWebHashHistory } from 'vue-router'

import LoginView from './views/LoginView.vue'
import BooksView from './views/BooksView.vue'
import ReaderView from './views/ReaderView.vue'
import HistoryView from './views/HistoryView.vue'

const router = createRouter({
  history: createWebHashHistory("/"),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },

    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/books',
      name: 'books',
      component: BooksView
    },
    {
      path: '/history',
      name: 'history',
      component: HistoryView
    },
    {
      path: '/reader',
      name: 'reader',
      component: ReaderView
    },
    // 通配符路由，捕获所有未匹配的路由并重定向到 '/'
    {
      path: '/*',
      redirect: '/',
    },
  ]
})

export default router
