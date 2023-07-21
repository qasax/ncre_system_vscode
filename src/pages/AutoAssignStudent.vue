<template>
  <el-page-header @back="goBack"
                  style="border-bottom: 1px solid #ccc; height: 30px; padding-top: 10px">
    <template #content>
      <span class="text-large font-600 mr-3"> 考生报名管理 </span>
    </template>
  </el-page-header>
  <el-button @click="setSignUpStatus(true)"
             :disabled="SignUpStatus||SignUpOverStatus">开始报名</el-button>
  <el-button @click="setSignUpStatus(false)"
             :disabled="!SignUpStatus">结束报名</el-button>
  <el-button @click="autoAssignStudent"
             :disabled="AssignStudentStatus">自动分配考生</el-button>
  <el-button @click="autoAssignProctor"
             :disabled="AssignProctorStatus">自动分配监考员</el-button>
</template>

<script>
import axios from 'axios';
axios.defaults.withCredentials = true;
import router from '@/vueRouter/main';
import { onMounted, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
export default {
  setup () {
    let SignUpStatus = ref();//从后台获取
    let AssignStudentStatus = ref()//在分配完考生后才能分配监考员
    let AssignProctorStatus = ref()//分配完考生后，分配考生按钮不可点击
    let SignUpOverStatus = ref()
    //生命周期
    onMounted(() => {
      getSignUpStatus()
      getAssignStudentStatus()
      getAssignProctorStatus()
      getSignUpOverStatus()
    })
    //按钮  自动分配控制

    const autoAssignStudent = () => {
      ElMessageBox.confirm(
        '是否确定开始分配学生?',
        '警告',
        {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning',
        }
      )
        .then(() => {
          axios.get('http://localhost:8080/autoAssignController/autoAssignStudent').then((response) => {
            setAssignStudentStatus(true)//让分配学生按钮不可点击
            setAssignProctorStatus(false)//让分配监考员按钮可点击
            ElMessage({
              type: 'success',
              message: response.data,
            })
          })
            .catch(error => {
              console.log('请求失败了', error.message)
              ElMessage({
                type: 'error',
                message: error.message,
              })
            })
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '取消操作',
          })
        })

    }

    const autoAssignProctor = () => {
      ElMessageBox.confirm(
        '是否确定开始分配监考员?',
        '警告',
        {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning',
        }
      )
        .then(() => {
          axios.get('http://localhost:8080/autoAssignController/autoAssignProctor').then((response) => {
            setAssignProctorStatus(true)//让分配监考员按钮不可点击
            ElMessage({
              type: 'success',
              message: response.data,
            })
          })
            .catch(error => {
              console.log('请求失败了', error.message)
              ElMessage({
                type: 'error',
                message: error.message,
              })
            })
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '取消操作',
          })
        })


    }
    //--按钮点击状态控制
    const getSignUpStatus = () => {
      axios.get('http://localhost:8080/autoAssignController/getSignUpStatus').then((response) => {
        SignUpStatus.value = response.data
      })
    }
    const setSignUpStatus = (val) => {
      ElMessageBox.confirm(
        '是否确定' + (val == true ? '开始报名' : '结束报名'),
        '警告',
        {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning',
        }
      ).then(() => {
        axios.get('http://localhost:8080/autoAssignController/setSignUpStatus', {
          params: {
            status: val
          }
        }).then((response) => {
          getSignUpStatus()
          if (val == true) {
            ElMessage({
              type: 'success',
              message: response.data,
            })
          }
          if (val == false) {
            setAssignStudentStatus(false)//如果点击了结束报名按钮，就让分配考生按钮可以点击
            setSignUpOverStatus(true)//标识报名工作已结束
            ElMessage({
              type: 'success',
              message: response.data,
            })
          }
        })
      }).catch(() => {
        ElMessage({
          type: 'info',
          message: '取消操作',
        })
      })

    }
    const getAssignStudentStatus = () => {
      axios.get('http://localhost:8080/autoAssignController/getAssignStudentStatus').then((response) => {
        AssignStudentStatus.value = response.data
      })
    }
    const setAssignStudentStatus = (val) => {
      axios.get('http://localhost:8080/autoAssignController/setAssignStudentStatus', {
        params: {
          status: val
        }
      }).then(() => {
        getAssignStudentStatus()
      })
    }
    const getAssignProctorStatus = () => {
      axios.get('http://localhost:8080/autoAssignController/getAssignProctorStatus').then((response) => {
        AssignProctorStatus.value = response.data
      })
    }
    const setAssignProctorStatus = (val) => {
      axios.get('http://localhost:8080/autoAssignController/setAssignProctorStatus', {
        params: {
          status: val
        }
      }).then(() => {
        getAssignProctorStatus()
      })
    }
    const getSignUpOverStatus = () => {
      axios.get('http://localhost:8080/autoAssignController/getSignUpOverStatus').then((response) => {
        SignUpOverStatus.value = response.data
      })
    }
    const setSignUpOverStatus = (val) => {
      axios.get('http://localhost:8080/autoAssignController/setSignUpOverStatus', {
        params: {
          status: val
        }
      }).then(() => {
        getSignUpOverStatus()
      })
    }
    //页头返回功能
    const goBack = function () {
      router.push("/main");
    };
    return {
      autoAssignStudent,
      goBack,
      autoAssignProctor,
      setSignUpStatus,
      SignUpStatus,
      getSignUpStatus,
      AssignStudentStatus,
      AssignProctorStatus,
      getAssignStudentStatus,
      setAssignStudentStatus,
      setAssignProctorStatus,
      getAssignProctorStatus,
      SignUpOverStatus, getSignUpOverStatus,
      setSignUpOverStatus
    }
  }
}
</script>

<style>
</style>