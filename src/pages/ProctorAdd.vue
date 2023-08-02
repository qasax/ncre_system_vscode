<template>
  <el-page-header @back="goBack"
                  style="border-bottom: 1px solid #ccc;height: 30px;padding-top: 10px">
    <template #content>
      <span class=" text-large font-600 mr-3"> 监考员信息编辑 </span>
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
      <el-form-item label="姓名"
                    prop="teacherName">
        <el-input v-model="ruleForm.teacherName"
                  type="text"
                  autocomplete="off" />
      </el-form-item>
      <el-form-item label="用户名(可选)"
                    prop="username">
        <el-select v-model="ruleForm.username"
                   placeholder="请选择"
                   no-data-text="无可用账户">
          <el-option v-for="(option, index) in options"
                     :key="index"
                     :label="option.username"
                     :value="option.username"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="性别"
                    prop="gender">
        <el-select v-model="ruleForm.gender"
                   placeholder="请选择">
          <el-option label="男"
                     value="男"></el-option>
          <el-option label="女"
                     value="女"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="年龄"
                    prop="age">
        <el-input v-model.number="ruleForm.age" />
      </el-form-item>
      <el-form-item label="手机号"
                    prop="phoneNumber">
        <el-input v-model="ruleForm.phoneNumber"
                  type="text"
                  autocomplete="off" />
      </el-form-item>
      <el-form-item label="邮箱"
                    prop="email">
        <el-input v-model="ruleForm.email"
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
import router from '@/vueRouter/main'
import { onMounted, reactive, ref } from 'vue'
import axios from 'axios'
import { ElMessageBox, ElMessage } from 'element-plus'
axios.defaults.withCredentials = true;
export default {
  setup () {
    //页头返回功能
    const goBack = function () {
      router.push('/main/proctormsg')
    }
    //表单数据
    const ruleFormRef = ref(null)
    let ruleForm = reactive({
      teacherName: '',
      username: '',
      gender: '',
      age: '',
      phoneNumber: '',
      email: '',
    })
    let options = ref([])
    //生命周期
    onMounted(() => {
      axios.get("http://localhost:8080/user/findProctors").then((response) => {
        console.log("查询用户表无对应监考员信息的账号")
        console.log(response.data)
        options.value = response.data
      })
    })
    //表单验证规则
    const checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入年龄'))
      }
      setTimeout(() => {
        if (!Number.isInteger(parseInt(value))) {
          callback(new Error('请输入整数'))
        } else {
          if (value < 18) {
            callback(new Error('年龄必须不小于 18岁'))
          } else {
            callback()
          }
        }
      }, 1000)
    }

    const checkPhoneNumber = (rule, value, callback) => {
      const reg = /^[1][3,4,5,7,8][0-9]{9}$/
      if (!reg.test(value)) {
        callback(new Error('请输入一个合法的手机号'))
      } else {
        callback()
      }
    }

    const checkEmail = (rule, value, callback) => {
      const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+$/
      if (!reg.test(value)) {
        callback(new Error('请输入正确的邮箱账户'))
      } else {
        callback()
      }
    }



    const rules = reactive(
      {
        teacherName: [{ required: true, message: '请输入你的姓名', trigger: 'blur' }],
        username: [{ required: true, message: '请选择对应用户', trigger: 'chanage' },],
        gender: [{ required: true, message: '请选择你的性别', trigger: 'chanage' },],
        age: [
          { required: true, message: '请输入年龄', trigger: 'blur' },
          { validator: checkAge, trigger: 'blur' }
        ],
        phoneNumber: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkPhoneNumber, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入电子邮箱账号', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ]
      }
    )

    const submitForm = (formEl) => {
      if (!formEl) return
      formEl.validate((valid) => {
        if (valid) {
          console.log('提交!')
          ElMessageBox.confirm(
            '是否确定进行提交?',
            '警告',
            {
              confirmButtonText: '是',
              cancelButtonText: '否',
              type: 'warning',
            }
          )
            .then(() => {
              console.log(ruleForm)
              axios.post('http://localhost:8080/addOne', ruleForm)
                .then((response) => {
                  console.log(response.data)
                  ElMessage({
                    type: 'success',
                    message: '提交成功',
                  })
                  setTimeout(() => {
                    router.push('/main/proctormsg')
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
      resetForm,
      options
    }
  }
}
</script>

<style></style>