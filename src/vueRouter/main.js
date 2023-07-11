import { createRouter, createWebHistory } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessageBox } from 'element-plus'
import LoginFrame from '../pages/LoginFrame.vue'
import AdminFrame from '../pages/AdminFrame.vue'
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: LoginFrame },
    { path: '/main', component: AdminFrame },
  ],
})
router.beforeEach((to, from, next) => {
  console.log('beforeEach', to, from)
  const store = useStore()
  if (to.path === '/add') {
    //判断当前路由是否需要进行权限控制
    if (store.getters.getByClick === true) {
      next()
    } else {
      ElMessageBox.alert('无法访问', '警告', {
        // if you want to disable its autofocus
        // autofocus: false,
        confirmButtonText: 'OK',
      })
    }
  } else if (to.path === '/update') {
    if (store.getters.getByClick === true) {
      next()
    } else {
      ElMessageBox.alert('无法访问', '警告', {
        // if you want to disable its autofocus
        // autofocus: false,
        confirmButtonText: 'OK',
      })
    }
  } else if (to.path === '/changePassword') {
    if (store.getters.getByClick === true) {
      next()
    } else {
      ElMessageBox.alert('无法访问', '警告', {
        // if you want to disable its autofocus
        // autofocus: false,
        confirmButtonText: 'OK',
      })
    }
  } else {
    next()
  }
})

export default router
