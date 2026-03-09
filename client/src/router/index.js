import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/nosotros',
      name: 'nosotros',
      component: () => import('../views/NosotrosView.vue'),
    },
    {
      path: '/producto/:id',
      name: 'product',
      component: () => import('../views/ProductView.vue'),
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('../views/CheckoutView.vue'),
    },
  ],
})

export default router
