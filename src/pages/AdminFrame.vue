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
                    <span>管理系统</span>
                  </template>
                  <el-menu-item-group title="监考员管理">
                    <el-menu-item index="/main/proctormsg">管理员信息管理</el-menu-item>
                  </el-menu-item-group>
                  <el-menu-item-group title="考生管理">
                    <el-menu-item index="1-3">考生信息管理</el-menu-item>
                  </el-menu-item-group>
                  <el-menu-item-group title="考场管理">
                    <el-menu-item index="1-3">考场信息管理</el-menu-item>
                  </el-menu-item-group>
                </el-sub-menu>
                <el-menu-item index="2">
                  <span>管理员个人信息</span>
                </el-menu-item>
                <el-menu-item index="3" disabled>
                  <span>Navigator Three</span>
                </el-menu-item>
                <el-menu-item index="4">
                  <span>Navigator Four</span>
                </el-menu-item>
              </el-menu>
            </el-col>
          </el-row></el-aside>
        <el-main style="padding: 0px;"><router-view></router-view></el-main>
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