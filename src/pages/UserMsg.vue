<template>
  <el-page-header @back="goBack"
                  style="border-bottom: 1px solid #ccc;height: 30px;padding-top: 10px">
    <template #content>
      <span class=" text-large font-600 mr-3"> 用户账号信息 </span>
    </template>
  </el-page-header>
  <div style="display: flex;align-items:center;">
    <el-select v-model="state.optionValue"
               class="m-2"
               size="large"
               placeholder="请选择查询依据">
      <el-option v-for="item in serchOptions"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value" />
    </el-select>
    <div style="width: 800px;margin-right:10px">
      <el-input v-model="state.searchValue"
                class="w-50 m-2"
                size="large"
                placeholder="请输入" />
    </div>
    <el-button type="primary"
               @click="toSearch">查询</el-button>
    <el-button type="primary"
               @click="toReset">重置</el-button>
  </div>
  <div style="margin-top: 20px;margin-bottom: 20px;margin-left: 20px;">
    <el-button @Click="addUserMsg()">添加 </el-button>
    <el-button @Click="deleteSelectAll">批量删除</el-button>
    <el-button @click="toggleSelection()">清除选中</el-button>
    <el-button @click="window.location.href='http://localhost:8080/file/userDown'">表格导出</el-button>
    <el-upload ref="upload"
               class="upload-demo"
               action="http://localhost:8080/file/userUpload"
               :limit="1"
               :on-exceed="handleExceed"
               :with-credentials="true"
               :auto-upload="false"
               accept=".xlsx"
               style="display: inline-block;margin-left: 15px;">
      <template #trigger>
        <el-button type="primary">选择导入表格</el-button>
      </template>
      <el-button class="ml-3"
                 type="success"
                 @click="submitUpload"
                 style="margin-left: 15px;">
        表格上传
      </el-button>
    </el-upload>
  </div>
  <el-table ref="multipleTableRef"
            :data="tableData"
            style="width: 100%"
            @selection-change="handleSelectionChange"
            @sort-change="handleSortChange"
            v-loading="loading"
            element-loading-text="Loading..."
            :element-loading-spinner="svg"
            element-loading-svg-view-box="-10, -10, 50, 50"
            element-loading-background="rgba(122, 122, 122, 0.8)"
            :default-sort="{prop: 'userID', order: 'ascending'}">
    <el-table-column type="selection" />
    <el-table-column label="序号"
                     property="userID"
                     sortable="custom"></el-table-column>
    <el-table-column property="username"
                     label="用户名" />
    <el-table-column property="password"
                     label="密码" />
    <el-table-column property="userType"
                     label="用户类型" />
    <el-table-column label="操作"
                     width="510">
      <template #default="{ row }">
        <el-button link
                   type="primary"
                   size="small">详细</el-button>
        <el-button link
                   type="primary"
                   size="small"
                   @click="handleClickEdit(row)">编辑</el-button>
        <el-button link
                   type="primary"
                   size="small"
                   @click="handleClickDelete(row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <div class="demo-pagination-block"
       style="margin-top: 10px;margin-left: 250px; margin-bottom: 20px;">
    <el-pagination v-model:current-page="state.currentPage"
                   v-model:page-size="state.pageSize"
                   :page-sizes="[10, 20, 30, 40]"
                   :small="state.small"
                   :disabled="state.disabled"
                   :background="state.background"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="state.total"
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange" />
  </div>
</template>

<script>
import { onMounted, ref, reactive } from 'vue'
import { ElTable, ElMessageBox, ElMessage } from 'element-plus'
import axios from 'axios'
import router from '@/vueRouter/main';
import { useStore } from 'vuex';
import { genFileId } from 'element-plus'
axios.defaults.withCredentials = true;
export default {
  setup () {
    const store = useStore()
    const multipleTableRef = ref()
    const multipleSelection = ref([])
    const tableData = ref([])
    //分页依据相关数据
    const state = reactive({
      currentPage: 1,
      pageSize: 10,
      small: false,
      background: true,
      disabled: false,
      total: 0,
      sortProp: '',
      sortOrder: 'ascending',
      optionValue: '',
      searchValue: '',
      isSearch: false,
    })
    const serchOptions = [
      {
        value: '用户序号',
        label: '用户序号',
      },
      {
        value: '用户名',
        label: '用户名',
      },
    ]
    const loading = ref(true)
    const svg = `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `
    //页头功能
    const goBack = () => {
      router.push('/main')
    }
    //搜索按钮功能
    const toSearch = () => {
      state.isSearch = true
      getTableData()
    }
    const toReset = () => {
      state.isSearch = false
      state.searchValue = ''
      state.optionValue = ''
      state.currentPage = 1
      state.pageSize = 10
      state.sortOrder = 'ascending'
      state.sortProp = ''
      getTableData()
    }
    //表格单行操作

    const handleClickDelete = (val) => {
      console.log(val)
      ElMessageBox.confirm(
        '是否确定进行删除?',
        '警告',
        {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning',
        }
      )
        .then(() => {
          axios.get('http://localhost:8080/user/deleteOne', {
            params: {
              userID: val.userID,
            }
          }).then((response) => {
            console.log(response.data)
            ElMessage({
              type: 'success',
              message: '删除成功',
            })
            getTableData()
          }).catch((error) => {
            ElMessage({
              type: 'error',
              message: error.response.data,
            })

          })
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '取消删除',
          })
        })

    }
    const handleClickEdit = (val) => {
      console.log(val)
      store.commit('changeEntity', val)
      router.push('/main/useredit')
    }

    //表格上部按钮
    const upload = ref(null);

    const handleExceed = (files) => {
      upload.value.clearFiles();
      const file = files[0];
      file.uid = genFileId();
      upload.value.handleStart(file);
    };

    const submitUpload = () => {
      ElMessageBox.confirm(
        '是否确定进行上传?',
        '警告',
        {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning',
        }
      )
        .then(() => {
          upload.value.submit();
          ElMessage({
            type: 'success',
            message: '上传成功',
          })
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '取消上传',
          })
        })

    };
    const addUserMsg = () => {
      router.push('/main/useradd')
    }
    const deleteSelectAll = () => {
      console.log(multipleSelection.value)
      const selectList = multipleSelection.value
      ElMessageBox.confirm(
        '是否确定进行删除?',
        '警告',
        {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning',
        }
      )
        .then(() => {
          Promise.all(selectList.map((select) => {
            console.log(select.userID);
            return axios.get('http://localhost:8080/user/deleteOne', {
              params: {
                userID: select.userID,
              }
            }).catch(error => {
              console.log('请求失败了', error.response.data)
              ElMessage({
                type: 'error',
                message: error.response.data,
              })
            });
          })).then(() => {
            console.log('All requests completed');
            ElMessage({
              type: 'success',
              message: '批量删除成功',
            })
            getTableData()
            // do other stuff here
          }).catch((error) => {
            console.log('Some requests failed:', error);
            ElMessage({
              type: 'error',
              message: error.response.data,
            })
          });
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '取消删除',
          })
        })

    }
    const toggleSelection = (rows) => {
      if (rows) {
        rows.forEach((row) => {
          multipleTableRef.value.toggleRowSelection(row, undefined)
        })
      } else {
        multipleTableRef.value.clearSelection()
      }
    }
    //el表格固定api
    const handleSelectionChange = (val) => {
      multipleSelection.value = val
    }
    const handleSortChange = (val) => {
      console.log(val)
      state.sortProp = val.prop
      state.sortOrder = val.order
      getTableData()
    }
    const handleSizeChange = (val) => {
      console.log(`${val} items per page`)
      state.pageSize = val;
      getTableData()
    }

    const handleCurrentChange = (val) => {
      console.log(`current page: ${val}`)
      state.currentPage = val;
      getTableData()
    }
    //向数据库请求数据的基础方法
    const getTableData = function () {
      loading.value = true
      axios.get("http://localhost:8080/user/allUser", {
        params: {
          pageNum: state.currentPage,
          pageSize: state.pageSize,
          sortProp: state.sortProp,
          sortOrder: state.sortOrder === "ascending" ? "asc" : "desc",
          isSearch: state.isSearch,
          optionValue: state.optionValue,
          searchValue: state.searchValue
        }
      }).then(response => {
        response.data
        tableData.value = response.data.list
        state.total = response.data.total
        setTimeout(() => {
          loading.value = false
          if (state.isSearch == true) {
            ElMessage({
              message: '查询成功!',
              type: 'success',
            })
            //state.isSearch = false
          }
        }, 300)
      }).catch(error => {
        console.log('请求失败了', error.response.data)
        ElMessage({
          type: 'error',
          message: error.response.data,
        })
      })
    }
    onMounted(() => {
      getTableData();
    })

    return {
      multipleTableRef,
      multipleSelection,
      toggleSelection,
      handleSelectionChange,
      tableData,
      state,
      handleSizeChange,
      handleCurrentChange,
      getTableData,
      handleSortChange,
      serchOptions,
      toSearch,
      handleClickDelete,
      loading,
      svg,
      deleteSelectAll,
      goBack,
      handleClickEdit,
      addUserMsg,
      toReset,
      window,
      handleExceed, submitUpload, upload,
    }
  },
  components: {
    ElTable,
  },
}
</script>

<style></style>