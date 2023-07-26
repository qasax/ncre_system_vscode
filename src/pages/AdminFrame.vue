<template>
  <div class="common-layout">
    <el-container>
      <el-header style="border-bottom: 1px solid #ccc;">
        <ul style="list-style: none;padding: 0;margin: 0;">
          <li style="float: left;margin-top: 16px;">
            <el-icon size="25">
              <Monitor />
            </el-icon>
          </li>
          <li style="float: left;margin-top: 20px;"><el-text>计算机等级考试报名后台系统</el-text></li>
          <li @click="userClick"
              style="float: right;margin-top: 20px;cursor: pointer">
            <el-text class="mx-1">{{store.state.user.username}}
            </el-text>
          </li>
          <li @click="userClick"
              style="cursor: pointer; float:right;margin-top: 10px;">
            <el-avatar :size="40"
                       style="display: inline-block"
                       src="http://localhost:8080/file/getImage" />
          </li>
        </ul>

      </el-header>

      <el-container>
        <el-aside width="250px"> <el-row class="tac">
            <el-col :span="12">
              <el-menu default-active="/main/proctormsg"
                       class="el-menu-vertical-demo"
                       @open="handleOpen"
                       @close="handleClose"
                       :router="true"
                       style="width: 250px;">
                <el-sub-menu index="1">
                  <template #title>
                    <span>基本信息管理</span>
                  </template>
                  <el-menu-item-group title="监考员信息管理">
                    <el-menu-item index="/main/proctormsg">监考员信息管理</el-menu-item>
                  </el-menu-item-group>
                  <el-menu-item-group title="考生信息管理">
                    <el-menu-item index="/main/studentmsg">考生信息管理</el-menu-item>
                  </el-menu-item-group>
                  <el-menu-item-group title="考场信息管理">
                    <el-menu-item index="/main/examroomMsg">考场信息管理</el-menu-item>
                  </el-menu-item-group>
                  <el-menu-item-group title="考试信息管理">
                    <el-menu-item index="/main/exammsg">考试信息管理</el-menu-item>
                  </el-menu-item-group>
                  <el-menu-item-group title="用户账号信息管理">
                    <el-menu-item index="/main/usermsg">用户账号管理</el-menu-item>
                  </el-menu-item-group>
                </el-sub-menu>

                <el-sub-menu index="2">
                  <template #title>
                    <span>考试管理</span>
                  </template>
                  <el-menu-item-group title="报名管理">
                    <el-menu-item index="/main/autoassignstudent">报名管理</el-menu-item>
                  </el-menu-item-group>
                  <el-menu-item-group title="考试综合信息管理">
                    <el-menu-item index="/main/examroomexammsg">考试-考场分配</el-menu-item>
                    <el-menu-item index="/main/ereproctorsmsg">监考员-考场分配</el-menu-item>
                  </el-menu-item-group>
                </el-sub-menu>
                <el-menu-item index="/main/adminMsg">管理员个人信息</el-menu-item>
              </el-menu>
            </el-col>
          </el-row></el-aside>
        <el-main style="padding: 0px; text-align: left;"><router-view></router-view></el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { defineComponent, onMounted } from 'vue'
import { ElRow, ElCol, ElMenu, ElSubMenu, ElMenuItemGroup, ElMenuItem } from 'element-plus'
import 'element-plus/dist/index.css'
import { useStore } from 'vuex'
import router from '@/vueRouter/main'
export default defineComponent({
  components: {
    ElRow,
    ElCol,
    ElMenu,
    ElSubMenu,
    ElMenuItemGroup,
    ElMenuItem,
  },
  setup () {
    let store = useStore()
    onMounted(() => {
      store.commit('changeUser')
    })
    const handleOpen = (key, keyPath) => {
      console.log(key, keyPath)
    }
    const handleClose = (key, keyPath) => {
      console.log(key, keyPath)
    }
    //用户个人信息点击
    const userClick = () => {
      router.push('/main/adminMsg')
    }

    return {
      handleOpen,
      handleClose,
      store,
      userClick
    }
  },
})
</script>

<style></style>