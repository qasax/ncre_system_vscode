<template>
  <el-page-header @back="goBack"
                  style="border-bottom: 1px solid #ccc; height: 30px; padding-top: 10px">
    <template #content>
      <span class="text-large font-600 mr-3"> 监考员-考场编辑 </span>
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
      <el-form-item label="监考员1"
                    prop="proctors[0].proctorID">
        <el-select v-model="ruleForm.proctors[0].proctorID"
                   no-data-text="无可用监考员">
          <el-option v-for="(proctor, index) in proctors"
                     :key="index"
                     :label="proctor.teacherName"
                     :value="proctor.proctorID"></el-option>
          <el-option :label="teacherName1"
                     :value="proctorID1"
                     v-if="proctorID1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="监考员2"
                    prop="proctors[1].proctorID">
        <el-select v-model="ruleForm.proctors[1].proctorID"
                   no-data-text="无可用监考员">
          <el-option v-for="(proctor, index) in proctors"
                     :key="index"
                     :label="proctor.teacherName"
                     :value="proctor.proctorID"></el-option>
          <el-option :label="teacherName2"
                     :value="proctorID2"
                     v-if="proctorID2"></el-option>
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
      router.push("/main/ereproctorsmsg");
    };
    //生命周期
    let proctors = ref([]);
    onMounted(() => {
      axios
        .get("http://localhost:8080/selectIt", {
          params: {
            examId: ruleForm.examID,
          },
        })
        .then((response) => {
          console.log("对应考场数据");
          console.log(response.data);
          proctors.value = response.data;
        });
    });
    //表单数据
    const ruleFormRef = ref(null);
    let ruleForm = reactive({});
    ruleForm = store.getters.getEntity;
    const proctorID1 = ref(0);
    const teacherName1 = ref();
    const proctorID2 = ref(0);
    const teacherName2 = ref();
    if (store.getters.getEntity.proctors.length == 2) {
      proctorID1.value = store.getters.getEntity.proctors[0].proctorID;
      teacherName1.value = store.getters.getEntity.proctors[0].teacherName;
      proctorID2.value = store.getters.getEntity.proctors[1].proctorID;
      teacherName2.value = store.getters.getEntity.proctors[1].teacherName;
    } else if (store.getters.getEntity.proctors.length == 1) {
      proctorID1.value = store.getters.getEntity.proctors[0].proctorID;
      teacherName1.value = store.getters.getEntity.proctors[0].teacherName;
      ruleForm.proctors.push({ proctorID: "", teacherName: "" });
    } else {
      ruleForm.proctors.push({ proctorID: "", teacherName: "" });
      ruleForm.proctors.push({ proctorID: "", teacherName: "" });
    }

    console.log(ruleForm);

    //表单验证规则
    const rules = reactive({
      "proctors[0].proctorID": [
        { required: true, message: "请选择监考员", trigger: "change" },
      ],
      "proctors[1].proctorID": [
        {
          required: true,
          message: "请选择监考员",
          trigger: "change",
        },
        {
          validator: (rule, value, callback) => {
            if (value !== ruleForm.proctors[0].proctorID) {
              console.log("通过");
              callback();
            } else {
              callback(new Error("第二位监考员不能与第一位相同"));
            }
          },
          trigger: "change",
        },
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
                .get("http://localhost:8080/ereProctors/update", {
                  params: {
                    ereID: ruleForm.ereID,
                    before1: proctorID1.value,
                    before2: proctorID2.value,
                    after1: ruleForm.proctors[0].proctorID,
                    after2: ruleForm.proctors[1].proctorID,
                  },
                })
                .then((response) => {
                  console.log(response.data);
                  ElMessage({
                    type: "success",
                    message: "修改成功",
                  });
                  setTimeout(() => {
                    router.push("/main/ereproctorsmsg");
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
      proctors,
      store,
      proctorID1,
      teacherName1,
      proctorID2,
      teacherName2,
    };
  },
};
</script>
  
  <style></style>