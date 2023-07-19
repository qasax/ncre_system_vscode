<template>
    <el-page-header @back="goBack" style="border-bottom: 1px solid #ccc;height: 30px;padding-top: 10px">
      <template #content>
        <span class=" text-large font-600 mr-3"> 考试-管理员分配 </span>
      </template>
    </el-page-header>
    <div style="display: flex;align-items:center;">
      <el-select v-model="state.optionValue" class="m-2" size="large" placeholder="请选择查询依据">
        <el-option v-for="item in serchOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <div style="width: 800px;margin-right:10px">
        <el-input v-model="state.searchValue" class="w-50 m-2" size="large" placeholder="请输入" />
      </div>
        <el-button type="primary" @click="toSearch">查询</el-button>
        <el-button type="primary" @click="toReset">重置</el-button>
    </div>
    <div style="margin-top: 20px;margin-bottom: 20px;margin-left: 20px;">
      <el-button @Click="deleteSelectAll">批量清空监考员信息</el-button>
      <el-button @click="toggleSelection()">清除选中</el-button>
    </div>
    <el-table ref="multipleTableRef" :data="tableData" style="width: 100%" 
      @sort-change="handleSortChange" v-loading="loading" element-loading-text="Loading..." :element-loading-spinner="svg" @selection-change="handleSelectionChange"
      element-loading-svg-view-box="-10, -10, 50, 50" element-loading-background="rgba(122, 122, 122, 0.8)" :default-sort="{prop: 'ereID', order: 'ascending'}">
      <el-table-column type="selection"  />
      <el-table-column label="序号" property="ereID" sortable="custom" />
      <el-table-column property="examID" label="考试编号" />
      <el-table-column label="考场序号" property="examRoomID" />
      <el-table-column property="examName" label="考试科目" />
      <el-table-column property="examLocation" label="考试地点" />
      <el-table-column property="examRoomName" label="考场名称" />
      <el-table-column property="examDate" label="考试日期" />
      <el-table-column property="examTime" label="考试时间段" />
      <el-table-column property="seatCount" label="座位数" />
      <el-table-column property="proctors[0].teacherName" label="监考员1" />
      <el-table-column property="proctors[1].teacherName" label="监考员2" />
      <el-table-column label="操作" width="450px">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="handleClickScan(row)" >查看该场次考场的全部考生</el-button>
          <el-button link type="primary" size="small" @click="handleClickEdit(row)">修改场次负责监考员</el-button>
          <el-button link type="primary" size="small" @click="handleClickDelete(row)">清空该考场监考员</el-button>
        </template>
      </el-table-column>
    </el-table>
  
    <div class="demo-pagination-block" style="margin-top: 10px;margin-left: 250px; margin-bottom: 20px;">
      <el-pagination v-model:current-page="state.currentPage" v-model:page-size="state.pageSize"
        :page-sizes="[10, 20, 30, 40]" :small="state.small" :disabled="state.disabled" :background="state.background"
        layout="total, sizes, prev, pager, next, jumper" :total="state.total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>
    <el-dialog v-model="dialogTableVisible" title="本考场全部考生">
      <el-table :data="studentTableData"  v-loading="loadingStudent" element-loading-text="Loading..." :element-loading-spinner="svg" @sort-change="handleSortChangeStudent"
      :default-sort="{prop: 'seatID', order: 'ascending'}"  >
   <el-table-column label="学号" property="studentID"></el-table-column>
   <el-table-column property="seatID" label="座位号" sortable="custom"/>
    <el-table-column property="name" label="姓名" />
    <el-table-column property="gender" label="性别" />
    <el-table-column property="age" label="年龄" />
    <el-table-column property="phoneNumber" label="手机号" />
    <el-table-column property="email" label="邮箱" />
      </el-table> 
      <div class="demo-pagination-block" style="margin-top: 10px;margin-left: 200px; margin-bottom: 20px;">
        <el-pagination v-model:current-page="dialogState.currentPage" v-model:page-size="dialogState.pageSize"
          :page-sizes="[10, 20, 30, 40]" :small="dialogState.small" :disabled="dialogState.disabled" :background="dialogState.background"
          layout="total, sizes, prev, pager, next, jumper" :total="dialogState.total" @size-change="handleSizeChangeStudent"
          @current-change="handleCurrentChangeStudent" />
      </div>
    </el-dialog>
  </template>
  
  <script>
  import { onMounted, ref, reactive } from 'vue'
  import { ElTable, ElMessage,ElMessageBox } from 'element-plus'
  import axios from 'axios'
  import router from '@/vueRouter/main';
  import { useStore } from 'vuex';
  axios.defaults.withCredentials = true;
  export default {
    setup() {
      const store = useStore()
      const multipleTableRef = ref()
      const multipleSelection = ref([])
      const tableData = ref([])
      let studentTableData = ref([])
      //弹出对话窗口参数
      let dialogTableVisible=ref(false)
      //分页依据相关数据
      const state = reactive({
        currentPage: 1,
        pageSize: 10,
        small: false,
        background: true,
        disabled: false,
        total: 0,
        sortProp: 'ereID',
        sortOrder: 'ascending',
        optionValue: '',
        searchValue: '',
        isSearch: false,
      })
      //弹出窗口分页相关数据
      let dialogState = reactive({
        currentPage: 1,
        pageSize: 10,
        small: false,
        background: true,
        disabled: false,
        total: 0,
        sortProp: 'seatID',
        sortOrder: 'ascending',
        optionValue: '',
        searchValue: '',
        isSearch: false,
        examID:'',
        examRoomID:'',

      })
      const serchOptions = [
        {
          value: '序号',
          label: '序号',
        },
        {
          value: '考试科目',
          label: '考试科目',
        },
      ]
      const loading = ref(true)
      const loadingStudent=ref(true)
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
      const toReset=()=>{
        state.isSearch=false
        state.searchValue=''
        state.optionValue=''
        state.currentPage=1
        state.pageSize=10
        state.sortOrder='ascending'
        state.sortProp='ereID'
        getTableData()
      }
        //表格上部按钮
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
            console.log(select.ereID);
            return axios.get('http://localhost:8080/ereProctors/deleteOne', {
              params: {
                ereID: select.ereID,
              }
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
              message: error.message,
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
      //表格单行操作
      const handleClickScan=(val)=>{
        console.log(val)
        loadingStudent.value=true
        dialogTableVisible.value=true
        dialogState.examID=val.examID
        dialogState.examRoomID=val.examRoomID
        getTableDataStuent()
      }
      const handleClickEdit = (val) => {
        console.log(val)
        store.commit('changeEntity', val)
        router.push('/main/ereproctorsedit')
      }
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
          axios.get('http://localhost:8080/ereProctors/deleteOne', {
            params: {
              ereID: val.ereID,
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
              message: error.message,
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
      //el pageINfo 分页固定api
      const handleSizeChange = (val) => {
        console.log(`${val} items per page`)
        state.pageSize = val;
        getTableData()
      }
  
      const handleCurrentChange = (val) => {
        console.log(`current page: ${val}`)
        state.currentPage = val;
        handleClickScan()
      }
      //el 表格固定api 学生信息展示
      const handleSortChangeStudent = (val) => {
        console.log(val)
        dialogState.sortProp = val.prop
        dialogState.sortOrder = val.order
        getTableDataStuent()
      }
        //el pageINfo 分页固定api 学生信息显示
      const handleSizeChangeStudent = (val) => {
        console.log(`${val} items per page`)
        dialogState.pageSize = val;
        getTableDataStuent()
      }
  
      const handleCurrentChangeStudent = (val) => {
        console.log(`current page: ${val}`)
        dialogState.currentPage = val;
        getTableDataStuent()
      }
      //向数据库请求数据的基础方法
      const getTableData = function () {
        loading.value = true
        axios.get("http://localhost:8080/ereProctors/allEreProctors", {
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
          state.total = response.data.list.length
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
        })
      }
      const getTableDataStuent=()=>{
        loadingStudent.value = true
        axios.get("http://localhost:8080/student/selectStudentOfExamRoom",{params:{
          pageNum:dialogState.currentPage,
          pageSize:dialogState.pageSize,
          examID:dialogState.examID,
          examRoomID:dialogState.examRoomID,
          sortProp:dialogState.sortProp,
          sortOrder: dialogState.sortOrder === "ascending" ? "asc" : "desc",
        }}).then((response)=>{
          studentTableData.value=response.data.list
          dialogState.total = response.data.list.length
          setTimeout(() => {
            loadingStudent.value = false
          }, 300)
        })
      }
      onMounted(() => {
        getTableData();
      })
  
      return {
        multipleTableRef,
        tableData,
        state,
        handleSizeChange,
        handleCurrentChange,
        handleSizeChangeStudent,
        handleCurrentChangeStudent,
        handleSortChangeStudent,
        getTableData,
        handleSortChange,
        serchOptions,
        toSearch,
        loading,
        loadingStudent,
        svg,
        goBack,
        handleClickEdit,
        toReset,
        handleClickDelete,
        handleSelectionChange,
        deleteSelectAll,
        toggleSelection,
        dialogTableVisible,
        handleClickScan,
        studentTableData,
        dialogState
      }
    },
    components: {
      ElTable,
    },
  }
  </script>
  
  <style></style>