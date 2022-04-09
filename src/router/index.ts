import { createRouter, createWebHashHistory } from 'vue-router'

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
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/books',
      name: 'books',
      component: () => import('../views/BooksView.vue')
    },
    {
      path: '/reader',
      name: 'reader',
      component: () => import('../views/ReaderView.vue')
    },

    
   
  ]
})

export default router
