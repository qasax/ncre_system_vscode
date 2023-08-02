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
      <el-form-item label="考试名称"
                    prop="examName">
        <el-input v-model="ruleForm.examName"
                  type="text"
                  autocomplete="off" />
      </el-form-item>
      <el-form-item label="考试日期"
                    prop="examDate">
        <div class="block">
          <el-date-picker v-model="ruleForm.examDate"
                          type="date"
                          placeholder="Pick a day"
                          value-format="YYYY-MM-DD" />
        </div>
      </el-form-item>

      <el-form-item label="考试时间"
                    prop="examTime">
        <el-time-picker v-model="startTime"
                        placeholder="开始时间"
                        value-format="HH:mm"
                        format="HH:mm" />
        <el-time-picker v-model="endTime"
                        placeholder="结束时间"
                        value-format="HH:mm"
                        format="HH:mm" />
      </el-form-item>
      <el-form-item label="考试地点"
                    prop="examLocation">
        <el-input v-model="ruleForm.examLocation"
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
import { reactive, ref, watch } from 'vue'
import { useStore } from 'vuex'
import axios from 'axios'
import { ElMessageBox, ElMessage } from 'element-plus'
axios.defaults.withCredentials = true;
export default {
  setup () {
    const store = useStore()
    //页头返回功能
    const goBack = function () {
      router.push('/main/exammsg')
    }
    //表单数据
    const ruleFormRef = ref(null)
    let ruleForm = reactive({
    })
    ruleForm = store.getters.getEntity
    console.log(ruleForm)
    //分割时间段---假设time的初始值为"16:09:40--19:09:40" 
    const startTime = ref()
    const endTime = ref()
    const examTimeArr = ruleForm.examTime.split("--");
    if (examTimeArr) {
      startTime.value = examTimeArr[0].trim();
      endTime.value = examTimeArr[1].trim();// 此时startTime的值为"16:09:40"，endTime的值为"19:09:40"
    }

    //监视属性 计算考试时间
    const getExamTime = watch(endTime, () => {
      ruleForm.examTime = startTime.value + "--" + endTime.value
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
              axios.post('http://localhost:8080/exam/update', ruleForm)
                .then((response) => {
                  console.log(response.data)
                  ElMessage({
                    type: 'success',
                    message: '修改成功',
                  })
                  setTimeout(() => {
                    router.push('/main/exammsg')
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
      goBack,
      ruleFormRef,
      ruleForm,
      rules,
      submitForm,
      resetForm,
      startTime,
      endTime,
      getExamTime
    }
  }
}
</script>

<style></style>