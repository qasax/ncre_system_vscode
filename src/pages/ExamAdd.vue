<template>
  <el-page-header @back="goBack" style="border-bottom: 1px solid #ccc;height: 30px;padding-top: 10px">
    <template #content>
      <span class=" text-large font-600 mr-3"> 考试信息编辑 </span>
    </template>
  </el-page-header>
  <div style="width: 30%;margin: auto;">
    <el-form style="margin-top: 50px;" ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="120px"
      class="demo-ruleForm">
      <el-form-item label="考试名称" prop="examName">
        <el-input v-model="ruleForm.examName" type="text" autocomplete="off" />
      </el-form-item>
      <el-form-item label="考试日期" prop="examDate">
        <el-input v-model="ruleForm.examDate" type="text" autocomplete="off" />
      </el-form-item>

      <el-form-item label="考试时间" prop="examTime">
        <el-input v-model.number="ruleForm.examTime" />
      </el-form-item>
      <el-form-item label="考试地点" prop="examLocation">
        <el-input v-model="ruleForm.examLocation" type="text" autocomplete="off" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)">提交</el-button>
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
  setup() {
    //页头返回功能
    const goBack = function () {
      router.push('/main/exammsg')
    }
    //表单数据
    const ruleFormRef = ref(null)
    let ruleForm = reactive({
      examName: '',
      examDate: '',
      examTime: '',
      examLocation: ''
    })

    //表单验证规则
    const rules = reactive(
      {
        examName: [{ required: true, message: '请输入考试名称', trigger: 'blur' }],
        examDate: [{ required: true, message: '请输入考试日期', trigger: 'blur' }],
        examTime: [{ required: true, message: '请输入考试时间', trigger: 'chanage' },],
        examLocation: [{ required: true, message: '请输入考试地点', trigger: 'blur' },],
      }
    )

    const submitForm = (formEl) => {
      if (!formEl) return
      formEl.validate((valid) => {
        if (valid) {
          console.log('提交!')
          ElMessageBox.confirm(
            '是否确定进行添加?',
            '警告',
            {
              confirmButtonText: '是',
              cancelButtonText: '否',
              type: 'warning',
            }
          )
            .then(() => {
              console.log(ruleForm)
              axios.post('http://localhost:8080/exam/addOne', ruleForm)
                .then((response) => {
                  console.log(response.data)
                  ElMessage({
                    type: 'success',
                    message: '提交成功',
                  })
                  setTimeout(() => {
                    router.push('/main/exammsg')
                  }, 1000);
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