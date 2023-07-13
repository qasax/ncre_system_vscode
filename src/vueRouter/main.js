import { createRouter, createWebHistory } from 'vue-router'
import LoginFrame from '../pages/LoginFrame.vue'
import AdminFrame from '../pages/AdminFrame.vue'
import ProctorMsg from '../pages/ProctorMsg.vue'
import ProctorEdit from '../pages/ProctorEdit.vue'
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: LoginFrame },
    {
      path: '/main',
      component: AdminFrame,
      children: [
        {
          path: 'proctormsg',
          component: ProctorMsg,
          children: [],
        },
        { path: 'proctoredit', component: ProctorEdit },
      ],
    },
  ],
})

export default router
