<template>
  <el-page-header @back="goBack"
                  style="border-bottom: 1px solid #ccc; height: 30px; padding-top: 10px">
    <template #content>
      <span class="text-large font-600 mr-3">考试-考场分配 </span>
    </template>
  </el-page-header>
  <div style="width: 30%; margin: auto">
    <el-form style="margin-top: 50px"
             ref="ruleFormRef"
             :model="ruleForm"
             status-icon
             :rules="rules"
             label-width="120px"
             class="demo-ruleForm">
      <el-form-item label="考试科目"
                    prop="examID">
        <el-select v-model="ruleForm.examID"
                   placeholder="请选择">
          <el-option v-for="(exam, index) in exams"
                     :key="index"
                     :label="exam.examName"
                     :value="exam.examID">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="考场名称"
                    prop="examRoomID">
        <el-select v-model="ruleForm.examRoomID"
                   placeholder="请选择"
                   no-data-text="无可用考场">
          <el-option v-for="(examRoom, index) in examRooms"
                     :key="index"
                     :label="examRoom.examRoomName"
                     :value="examRoom.examRoomID">
          </el-option>
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
import router from "@/vueRouter/main";
import { onMounted, reactive, ref, watch } from "vue";
import axios from "axios";
import { ElMessageBox, ElMessage } from "element-plus";
axios.defaults.withCredentials = true;
export default {
  setup () {
    //页头返回功能
    const goBack = function () {
      router.push("/main/examroomexammsg");
    };
    //接受请求参数
    let exams = ref([]);
    let examRooms = ref([]);
    //生命周期
    onMounted(() => {
      axios
        .get("http://localhost:8080/exam/aLLExam", {
          params: {
            pageNum: 1,
            pageSize: 1000,
            sortProp: "",
            sortOrder: "asc",
            isSearch: false,
            optionValue: "",
            searchValue: "",
          },
        })
        .then((response) => {
          console.log("获取数据库中全部考试信息");
          console.log(response.data);
          exams.value = response.data.list;
        });
    });

    //表单数据
    const ruleFormRef = ref(null);
    let ruleForm = reactive({
      examID: "",
      examRoomID: "",
    });
    //监视器
    watch(ruleForm, (newValue, oldValue) => {
      console.log(newValue);
      console.log(oldValue);
      axios
        .get("http://localhost:8080/examroom/selectIt", {
          params: {
            examId: ruleForm.examID,
          },
        })
        .then((response) => {
          console.log("对应考场数据");
          console.log(response.data);
          examRooms.value = response.data;
        });
    });
    //表单验证规则
    const rules = reactive({
      examID: [{ required: true, message: "请选择考试", trigger: "change" }],
      examRoomID: [
        { required: true, message: "请选择考场", trigger: "change" },
      ],
    });

    const submitForm = (formEl) => {
      if (!formEl) return;
      formEl.validate((valid) => {
        if (valid) {
          console.log("提交!");
          ElMessageBox.confirm("是否确定进行提交?", "警告", {
            confirmButtonText: "是",
            cancelButtonText: "否",
            type: "warning",
          })
            .then(() => {
              console.log(ruleForm);
              axios
                .post("http://localhost:8080/examRoomExam/addOne", ruleForm)
                .then((response) => {
                  console.log(response.data);
                  ElMessage({
                    type: "success",
                    message: "提交成功",
                  });
                  setTimeout(() => {
                    router.push("/main/examroomexammsg");
                  }, 1000);
                })
                .catch((error) => {
                  console.log("请求失败了", error.message);
                  ElMessage({
                    type: "error",
                    message: error.response.data,
                  });
                });
            })
            .catch(() => {
              ElMessage({
                type: "info",
                message: "取消提交",
              });
            });
        } else {
          console.log("未提交!");
          return false;
        }
      });
    };

    const resetForm = (formEl) => {
      if (!formEl) return;
      formEl.resetFields();
    };

    return {
      goBack,
      ruleFormRef,
      ruleForm,
      rules,
      submitForm,
      resetForm,
      exams,
      examRooms,
    };
  },
};
</script>
  
  <style></style>