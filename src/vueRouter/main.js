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
import ExamRoomExamMsg from '../pages/ExamRoomExamMsg.vue'
import ExamRoomExamAdd from '../pages/ExamRoomExamAdd'
import ExamRoomExamEdit from '../pages/ExamRoomExamEdit'
import EreProctorsMsg from '../pages/EreProctorsMsg'
import EreProctorsEdit from '../pages/EreProctorsEdit'
import AutoAssignStudent from '../pages/AutoAssignStudent'
import AdminMsg from '../pages/AdminMsg.vue'
import AdminEdit from '../pages/AdminEdit.vue'
import PasswordEdit from '../pages/PasswordEdit.vue'
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
        { path: 'examroomexammsg', component: ExamRoomExamMsg },
        { path: 'examroomexamadd', component: ExamRoomExamAdd },
        { path: 'examroomexamedit', component: ExamRoomExamEdit },
        { path: 'ereproctorsmsg', component: EreProctorsMsg },
        { path: 'ereproctorsedit', component: EreProctorsEdit },
        { path: 'autoassignstudent', component: AutoAssignStudent },
        { path: 'adminMsg', component: AdminMsg },
        { path: 'adminEdit', component: AdminEdit },
        { path: 'passwordEdit', component: PasswordEdit },
      ],
    },
  ],
})
router.beforeEach((to, from, next) => {
  const store = useStore()
  console.log(to)
  console.log(from)
  axios
    .get('http://localhost:8080/sessionState')
    .then((response) => {
      console.log(response.data)
      if (response.data === false) {
        store.commit('changeIsLogin', false)
        if (to.fullPath === '/login') {
          next()
        } else {
          next('/login')
        }
      } else {
        store.commit('changeIsLogin', true)
        if (to.fullPath === '/login') {
          next('/main')
        } else {
          next()
        }
      }
      // 处理登录成功逻辑
    })
    .catch((error) => {
      // 处理登录失败逻辑
      console.log(error.data)
    })
})
export default router
