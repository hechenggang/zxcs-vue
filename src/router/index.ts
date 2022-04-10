import { createRouter, createWebHashHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import BooksView from '../views/BooksView.vue'
import ReaderView from '../views/ReaderView.vue'
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
      path: '/reader',
      name: 'reader',
      component: ReaderView
    },

  ]
})

export default router
