<template>
  <el-page-header @back="goBack"
                  style="border-bottom: 1px solid #ccc;height: 30px;padding-top: 10px">
    <template #content>
      <span class=" text-large font-600 mr-3"> 考试信息编辑 </span>
    </template>
  </el-page-header>
  <div style="width: 30%;margin: auto;">
    <el-form style="margin-top: 50px;"
             ref="ruleFormRef"
             :model="ruleForm"
             status-icon
             :rules="rules"
             label-width="120px"
             class="demo-ruleForm">
      <el-form-item label="用户名"
                    prop="username">
        <el-input v-model="ruleForm.username"
                  type="text"
                  autocomplete="off" />
      </el-form-item>
      <el-form-item label="密码"
                    prop="password">
        <el-input v-model="ruleForm.password"
                  type="text"
                  autocomplete="off" />
      </el-form-item>

      <el-form-item label="用户类型"
                    prop="userType">
        <el-select v-model="ruleForm.userType">
          <el-option label="管理员"
                     value="admin"></el-option>
          <el-option label="监考员"
                     value="proctor"></el-option>
          <el-option label="考生"
                     value="student"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   @click="submitForm(ruleFormRef)">提交</el-button>
        <el-button @click="resetForm(ruleFormRef)">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import router from '@/vueRouter/main'
import { reactive, ref } from 'vue'
import axios from 'axios'
import { ElMessageBox, ElMessage } from 'element-plus'
axios.defaults.withCredentials = true;
export default {
  setup () {
    //页头返回功能
    const goBack = function () {
      router.push('/main/usermsg')
    }
    //表单数据
    const ruleFormRef = ref(null)
    let ruleForm = reactive({
      username: '',
      password: '',
      userType: ''
    })

    //表单验证规则
    const rules = reactive(
      {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        userType: [{ required: true, message: '请选择用户类型', trigger: 'chanage' },],
      }
    )

    const submitForm = (formEl) => {
      if (!formEl) return
      formEl.validate((valid) => {
        if (valid) {
          console.log('提交!')
          ElMessageBox.confirm(
            '是否确定进行修改?',
            '警告',
            {
              confirmButtonText: '是',
              cancelButtonText: '否',
              type: 'warning',
            }
          )
            .then(() => {
              console.log(ruleForm)
              axios.post('http://localhost:8080/user/addOne', ruleForm)
                .then((response) => {
                  console.log(response.data)
                  ElMessage({
                    type: 'success',
                    message: '提交成功',
                  })
                  setTimeout(() => {
                    router.push('/main/usermsg')
                  }, 1000);
                })
                .catch(error => {
                  console.log('请求失败了', error.message)
                  ElMessage({
                    type: 'error',
                    message: error.response.data,
                  })
                })
            })
            .catch(() => {
              ElMessage({
                type: 'info',
                message: '取消提交',
              })
            })
        } else {
          console.log('未提交!')
          return false
        }
      })
    }

    const resetForm = (formEl) => {
      if (!formEl) return
      formEl.resetFields()
    }

    return {
      goBack,
      ruleFormRef,
      ruleForm,
      rules,
      submitForm,
      resetForm
    }
  }
}
</script>

<style></style>