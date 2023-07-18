<template>
  <div class="common-layout">
    <el-container>
      <el-header style="border-bottom: 1px solid #ccc; height: 40px;text-align: left;margin-top: 10px;">
        <el-icon size="25">
          <Monitor />
        </el-icon>
      </el-header>
      <el-container>
        <el-aside width="250px"> <el-row class="tac">
            <el-col :span="12">
              <el-menu default-active="/main/proctormsg" class="el-menu-vertical-demo" @open="handleOpen"
                @close="handleClose" :router="true" style="width: 250px;">
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
                    <el-menu-item index="/main/">报名管理</el-menu-item>
                  </el-menu-item-group>
                  <el-menu-item-group title="考试综合信息管理">
                    <el-menu-item index="/main/examroomexammsg">考试-考场分配</el-menu-item>
                    <el-menu-item index="/main/">监考员-考场分配</el-menu-item>

                  </el-menu-item-group>
                  
                </el-sub-menu>
                <el-menu-item index="/main/usermsg">
                  <span>用户账号管理</span>
                </el-menu-item>
                <el-menu-item index="4">
                  <span>Navigator Four</span>
                </el-menu-item>
              </el-menu>
            </el-col>
          </el-row></el-aside>
        <el-main style="padding: 0px; text-align: left;"><router-view></router-view></el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { ElRow, ElCol, ElMenu, ElSubMenu, ElMenuItemGroup, ElMenuItem } from 'element-plus'
import 'element-plus/dist/index.css'
export default defineComponent({
  components: {
    ElRow,
    ElCol,
    ElMenu,
    ElSubMenu,
    ElMenuItemGroup,
    ElMenuItem,
  },
  setup() {

    const handleOpen = (key, keyPath) => {
      console.log(key, keyPath)
    }
    const handleClose = (key, keyPath) => {
      console.log(key, keyPath)
    }

    return {
      handleOpen,
      handleClose,
    }
  },
})
</script>

<style></style>