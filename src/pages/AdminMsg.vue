<template>
  <el-page-header @back="goBack"
                  style="border-bottom: 1px solid #ccc; height: 30px; padding-top: 10px">
    <template #content>
      <span class="text-large font-600 mr-3"> 个人资料 </span>
    </template>
  </el-page-header>
  <div>
    <el-card shadow="hover"
             style="width: 1000px;margin:auto;margin-top: 100px;">
      <div class="block"
           style="cursor: pointer;">
        <div style="float: left;">
          <el-tooltip :content="tooltipContent"
                      placement="top">
            <el-avatar :size="50"
                       src="http://localhost:8080/file/getImage"
                       @Click="dialogVisible=true" />
          </el-tooltip>
        </div>
      </div>
      <div style="float: left;">
        <h2 style="margin-top: 16px;">{{store.state.user.username}}</h2>
      </div>
      <el-button style="float: right;"
                 @click="router.push('/main/adminEdit')">编辑资料</el-button>
      <div style="margin-top: 75px;">
        <h3>个人资料</h3>
        <el-collapse accordion>
          <el-collapse-item title="点击展开"
                            @click.once="selectAdminByUsername()">
            <el-descriptions class="margin-top"
                             :column="3"
                             border
                             style="width: 80%">
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon>
                      <user />
                    </el-icon>
                    姓名
                  </div>
                </template>
                {{ userData.name }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon v-if="userData.gender==='女'">
                      <Female />
                    </el-icon>
                    <el-icon v-if="userData.gender==='男'">
                      <Male />
                    </el-icon>
                    性别
                  </div>
                </template>
                {{ userData.gender }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon>
                      <UserFilled />
                    </el-icon>
                    年龄
                  </div>
                </template>
                {{ userData.age }}
              </el-descriptions-item>

              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon>
                      <iphone />
                    </el-icon>
                    手机号码
                  </div>
                </template>
                {{ userData.phoneNumber }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template #label>
                  <div class="cell-item">
                    <el-icon>
                      <Message />
                    </el-icon>
                    邮箱
                  </div>
                </template>
                {{ userData.email }}
              </el-descriptions-item>
            </el-descriptions>
          </el-collapse-item>
        </el-collapse>
      </div>

    </el-card>
  </div>
  <el-dialog v-model="dialogVisible"
             title="更换头像">
    <el-upload class="upload-demo"
               drag
               action="http://localhost:8080/file/upload"
               headers="{'Content-Type':'multipart/form-data;'}"
               :with-credentials="true"
               @success="onSuccess()">
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        将文件拖到此处或者 <em>点击上传</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          jpg/png 文件不大于500kb
        </div>
      </template>
    </el-upload>
  </el-dialog>
</template>

<script>
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useStore } from 'vuex'
import axios from 'axios';
import router from '@/vueRouter/main'
axios.defaults.withCredentials = true;
export default {
  setup () {
    //头像悬浮文本
    let tooltipContent = ref('点击更换头像')
    //页头
    const goBack = () => {
      router.push('/main')
    }
    const store = useStore()
    //生命周期
    onMounted(() => {
    })
    //上传成功后关闭dialog
    let dialogVisible = ref(false)
    const onSuccess = (uploadFile) => {
      console.log(uploadFile)
      dialogVisible.value = false
      ElMessage({
        type: 'success',
        message: '上传成功'
      })
      location.reload()
      console.log("运行成功上传回调")
    }
    //查询监考员信息
    let userData = ref({
      name: '',
      age: '',
      gender: '',
      phoneNumber: '',
      email: ''
    })
    let selectAdminByUsername = () => {
      axios.get('http://localhost:8080/admin/selectAdminByUsername', {
        params: {
          username: store.state.user.username
        }
      }).then((response) => {
        userData.value = response.data
      }).catch(error => {
        console.log('请求失败了', error.response.data)
        ElMessage({
          type: 'error',
          message: error.response.data,
        })
      })
    }
    return {
      dialogVisible,
      onSuccess,
      store,
      selectAdminByUsername,
      userData,
      router,
      goBack,
      tooltipContent
    }

  }
}
</script>

<style>
</style>