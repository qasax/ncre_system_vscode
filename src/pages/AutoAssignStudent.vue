<template>
  <el-page-header @back="goBack"
                  style="border-bottom: 1px solid #ccc; height: 30px; padding-top: 10px">
    <template #content>
      <span class="text-large font-600 mr-3"> 考生报名管理 </span>
    </template>
  </el-page-header>
  <div style="text-align:center;margin-top:100px"> <el-button @click="setSignUpStatus(true)"
               :disabled="SignUpStatus||SignUpOverStatus||AssignOverStatus">开始报名</el-button>
    <el-button @click="setSignUpStatus(false)"
               :disabled="!SignUpStatus||AssignOverStatus">结束报名</el-button>
    <el-button @click="autoAssignStudent"
               :disabled="AssignStudentStatus||!SignUpOverStatus||AssignOverStatus">自动分配考生</el-button>
    <el-button @click="autoAssignProctor"
               :disabled="!AssignStudentStatus||!SignUpOverStatus||AssignOverStatus">自动分配监考员</el-button>
    <div v-if="SignUpStatus==false&&AssignOverStatus&&AssignStudentStatus&&AssignProctorStatus&&AssignOverStatus">
      <h1>报名工作以及分配工作已经完成</h1>
    </div>
  </div>

</template>

<script>
import axios from 'axios';
axios.defaults.withCredentials = true;
import router from '@/vueRouter/main';
import { onMounted, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
export default {
  setup () {
    let SignUpStatus = ref();//是否处于报名状态
    let SignUpOverStatus = ref()//是否报名已结束
    let AssignStudentStatus = ref()//是否已经分配考生
    let AssignProctorStatus = ref()//是否已经分配监考员
    let AssignOverStatus = ref()//是否分配工作完成

    //生命周期
    onMounted(() => {
      getSignUpStatus()
      getAssignStudentStatus()
      getAssignProctorStatus()
      getAssignOverStatus()
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
            setAssignStudentStatus(true)//让分配学生按钮不可点击,并且标识分配工作已完成
            ElMessage({
              type: 'success',
              message: response.data,
            })
          })
            .catch(error => {
              console.log('请求失败了', error.response.data)
              ElMessage({
                type: 'error',
                message: error.response.data,
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
            setAssignProctorStatus(true)//让分配监考员按钮不可点击，并且标识分配监考员已完成
            setAssignOverStatus(true)//标识分配工作已完成
            ElMessage({
              type: 'success',
              message: response.data,
            })
          })
            .catch(error => {
              console.log('请求失败了', error.response.data)
              ElMessage({
                type: 'error',
                message: error.response.data,
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
          ElMessage({
            type: 'success',
            message: response.data,
          })
          if (val == false) {
            setSignUpOverStatus(true)//标识报名已结束
          }
        }).catch((error) => {
          ElMessage({
            type: 'error',
            message: error.response.data
          })
        })
      }).catch(() => {
        ElMessage({
          type: 'info',
          message: '取消操作',
        })
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
    const getAssignOverStatus = () => {
      axios.get('http://localhost:8080/autoAssignController/getAssignOverStatus').then((response) => {
        AssignOverStatus.value = response.data
      })
    }
    const setAssignOverStatus = (val) => {
      axios.get('http://localhost:8080/autoAssignController/setAssignOverStatus', {
        params: {
          status: val
        }
      }).then(() => {
        getAssignOverStatus()
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
      AssignOverStatus,
      getAssignOverStatus,
      setAssignOverStatus,
      SignUpOverStatus,
      getSignUpOverStatus,
      setSignUpOverStatus
    }
  }
}
</script>

<style>
</style>