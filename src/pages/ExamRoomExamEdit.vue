<template>
  <el-page-header @back="goBack"
                  style="border-bottom: 1px solid #ccc; height: 30px; padding-top: 10px">
    <template #content>
      <span class="text-large font-600 mr-3"> 考试-考场编辑 </span>
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
      <el-form-item label="序号">
        <el-input v-model="ruleForm.ereID"
                  :readonly="true"></el-input>
      </el-form-item>
      <el-form-item label="考试科目">
        <el-input v-model="ruleForm.examName"
                  :readonly="true"></el-input>
      </el-form-item>
      <el-form-item label="可选考场名称"
                    prop="examRoomID">
        <el-select v-model="ruleForm.examRoomID">
          <el-option v-for="(examRoom, index) in examRooms"
                     :key="index"
                     :label="examRoom.examRoomName"
                     :value="examRoom.examRoomID"></el-option>
          <el-option :label="examRoomName"
                     :value="examRoomID"></el-option>
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
import { onMounted, reactive, ref } from "vue";
import { useStore } from "vuex";
import axios from "axios";
import { ElMessageBox, ElMessage } from "element-plus";
axios.defaults.withCredentials = true;
export default {
  setup () {
    const store = useStore();
    //页头返回功能
    const goBack = function () {
      router.push("/main/examroomexammsg");
    };
    //生命周期
    let examRooms = ref([]);
    onMounted(() => {
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
    //表单数据
    const ruleFormRef = ref(null);
    let ruleForm = reactive({});
    ruleForm = store.getters.getEntity;
    const examRoomID = ref(store.getters.getEntity.examRoomID);
    const examRoomName = ref(store.getters.getEntity.examRoomName);
    console.log(ruleForm);

    //表单验证规则
    const rules = reactive({
      examRoomID: [
        { required: true, message: "请选择考场", trigger: "change" },
      ],
    });

    const submitForm = (formEl) => {
      if (!formEl) return;
      formEl.validate((valid) => {
        if (valid) {
          console.log("提交!");
          ElMessageBox.confirm("是否确定进行修改?", "警告", {
            confirmButtonText: "是",
            cancelButtonText: "否",
            type: "warning",
          })
            .then(() => {
              console.log(ruleForm);
              axios
                .post("http://localhost:8080/examRoomExam/update", ruleForm)
                .then((response) => {
                  console.log(response.data);
                  ElMessage({
                    type: "success",
                    message: "修改成功",
                  });
                  setTimeout(() => {
                    router.push("/main/examroomexammsg");
                  }, 1000);
                })
                .catch((error) => {
                  console.log("请求失败了", error.message);
                  ElMessage({
                    type: "error",
                    message: error.message,
                  });
                });
            })
            .catch(() => {
              ElMessage({
                type: "info",
                message: "取消修改",
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
      examRooms,
      store,
      examRoomID,
      examRoomName,
    };
  },
};
</script>
  
  <style></style>