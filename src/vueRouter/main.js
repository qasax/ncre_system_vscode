import { createRouter, createWebHistory } from 'vue-router'
import LoginFrame from '../pages/LoginFrame.vue'
import AdminFrame from '../pages/AdminFrame.vue'
import ProctorMsg from '../pages/ProctorMsg.vue'
import ProctorAdd from '../pages/ProctorAdd'
import ProctorEdit from '../pages/ProctorEdit.vue'
import ExamMsg from '../pages/ExamMsg.vue'
import ExamEdit from '../pages/ExamEdit'
import ExamAdd from '../pages/ExamAdd'
import StudentMsg from '../pages/StudentMsg.vue'
import StudentAdd from '../pages/StudentAdd'
import StudentEdit from '../pages/StudentEdit'
import ExamRoomMsg from '../pages/ExamRoomMsg.vue'
import ExamRoomAdd from '../pages/ExamRoomAdd'
import ExamRoomEdit from '../pages/ExamRoomEdit'
import UserMsg from '../pages/UserMsg'
import UserAdd from '../pages/UserAdd'
import UserEdit from '../pages/UserEdit'
import { useStore } from 'vuex'
import axios from 'axios'
axios.defaults.withCredentials = true

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: LoginFrame },
    {
      path: '/main',
      component: AdminFrame,
      children: [
        { path: 'proctormsg', component: ProctorMsg },
        { path: 'proctoradd', component: ProctorAdd },
        { path: 'proctoredit', component: ProctorEdit },
        { path: 'exammsg', component: ExamMsg },
        { path: 'examadd', component: ExamAdd },
        { path: 'ExamEdit', component: ExamEdit },
        { path: 'studentmsg', component: StudentMsg },
        { path: 'studentadd', component: StudentAdd },
        { path: 'studentedit', component: StudentEdit },
        { path: 'examroomMsg', component: ExamRoomMsg },
        { path: 'examroomadd', component: ExamRoomAdd },
        { path: 'examroomedit', component: ExamRoomEdit },
        { path: 'usermsg', component: UserMsg },
        { path: 'useradd', component: UserAdd },
        { path: 'useredit', component: UserEdit },
      ],
    },
  ],
})
router.beforeEach(() => {
  const store = useStore()
  axios
    .get('http://localhost:8080/sessionState')
    .then((response) => {
      console.log(response.data)
      if (response.data === false) {
        router.push('/login')
        store.commit('changeIsLogin', false)
      } else {
        store.commit('changeIsLogin', true)
      }
      // 处理登录成功逻辑
    })
    .catch((error) => {
      // 处理登录失败逻辑
      console.log(error.data)
    })
})
export default router
