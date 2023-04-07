import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import WriteView from '../views/WriteView.vue';
import ReadView from '../views/ReadView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/playground/vue-work',
      name: 'home',
      component: HomeView
    },
    {
      path: '/playground/vue-work/read',
      name: 'readContent',
      component: ReadView,
      props : true
    },
    {
      path: '/playground/vue-work/write',
      name: 'newWrite',
      component: WriteView,
      props : true
    },
    {
      path: '/playground/vue-work/write/:id',
      name: 'write',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      ///component: () => import('../views/AboutView.vue')
      component: WriteView,
      props : true
    }
  ]
})

export default router
