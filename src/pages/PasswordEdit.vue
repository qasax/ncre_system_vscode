<template>
  <el-page-header @back="goBack"
                  style="border-bottom: 1px solid #ccc;height: 30px;padding-top: 10px">
    <template #content>
      <span class=" text-large font-600 mr-3"> 修改密码 </span>
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
      <el-form-item label="原密码"
                    prop="password">
        <el-input v-model="ruleForm.password"
                  type="text"
                  autocomplete="off" />
      </el-form-item>

      <el-form-item label="新密码"
                    prop="newPassword">
        <el-input v-model="ruleForm.newPassword" />
      </el-form-item>
      <el-form-item label="确认新密码"
                    prop="reNewPassword">
        <el-input v-model="ruleForm.reNewPassword"
                  type="text"
                  autocomplete="off" />
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
import { reactive, ref } from 'vue'
import axios from 'axios'
import router from '@/vueRouter/main';
import { useStore } from 'vuex';
import { ElMessageBox, ElMessage } from 'element-plus'
axios.defaults.withCredentials = true;
export default {
  setup () {
    const store = useStore()
    //页头
    const goback = () => {
      router.push('/main')
    }
    //表单数据
    const ruleFormRef = ref(null)
    let ruleForm = reactive({
      password: '',
      newPassword: '',
      reNewPassword: ''
    })

    //表单验证规则
    //验证两次输入新密码是否相同
    function checkNewPassword (rule, value, callback) {
      if (value !== ruleForm.newPassword) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    //验证原密码是否正确
    function checkPassword (rule, value, callback) {
      if (store.state.user.password !== ruleForm.password) {
        callback(new Error('原密码错误'))
      } else {
        callback()
      }
    }
    const rules = reactive(
      {
        password: [{ required: true, message: '请输入你的原密码', trigger: 'blur' },
        { validator: checkPassword, trigger: 'blur' }],
        newPassword: [{ required: true, message: '请输入你的新密码', trigger: 'blur' },],
        reNewPassword: [
          { required: true, message: '请再次输入你的新密码', trigger: 'blur' },
          { validator: checkNewPassword, trigger: 'blur' }
        ],
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
              axios.post('http://localhost:8080/user/changPassword', {
                password: ruleForm.newPassword,
                username: store.state.user.username
              })
                .then((response) => {
                  console.log(response.data)
                  ElMessage({
                    type: 'success',
                    message: '修改成功',
                  })
                  setTimeout(() => {
                    router.push('/main')
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
                message: '取消修改',
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
      ruleFormRef,
      ruleForm,
      rules,
      submitForm,
      resetForm,
      store,
      goback
    }
  }
}
</script>

<style>
</style>