import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Note from '@/components/Note'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/p/:id',
      name: 'Note',
      props: true,
      component: Note
    },
    {
      path: '*',
      component: Hello
    }
  ]
})
