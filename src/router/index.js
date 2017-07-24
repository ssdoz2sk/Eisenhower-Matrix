import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Hello',
      props: true,
      component: Hello
    },
    {
      path: '/p/:id',
      name: 'Hello',
      props: true,
      component: Hello
    },
    {
      path: '*',
      component: Hello
    }
  ]
})
