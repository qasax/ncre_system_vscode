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
    <el-table ref="multipleTableRef" :data="tableData" style="width: 100%" 
      @sort-change="handleSortChange" v-loading="loading" element-loading-text="Loading..." :element-loading-spinner="svg"
      element-loading-svg-view-box="-10, -10, 50, 50" element-loading-background="rgba(122, 122, 122, 0.8)" :default-sort="{prop: 'ereID', order: 'ascending'}">
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
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button link type="primary" size="small">查看该场次考场的全部考生</el-button>
          <el-button link type="primary" size="small" @click="handleClickEdit(row)">修改场次负责监考员</el-button>
          <el-button link type="primary" size="small" @click="handleClickDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  
    <div class="demo-pagination-block" style="margin-top: 10px;margin-left: 250px; margin-bottom: 20px;">
      <el-pagination v-model:current-page="state.currentPage" v-model:page-size="state.pageSize"
        :page-sizes="[10, 20, 30, 40]" :small="state.small" :disabled="state.disabled" :background="state.background"
        layout="total, sizes, prev, pager, next, jumper" :total="state.total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>
  </template>
  
  <script>
  import { onMounted, ref, reactive } from 'vue'
  import { ElTable, ElMessage } from 'element-plus'
  import axios from 'axios'
  import router from '@/vueRouter/main';
  import { useStore } from 'vuex';
  axios.defaults.withCredentials = true;
  export default {
    setup() {
      const store = useStore()
      const multipleTableRef = ref()
      const tableData = ref([])
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
      //表格单行操作
      const handleClickEdit = (val) => {
        console.log(val)
        store.commit('changeEntity', val)
        router.push('/main/ereproctorsedit')
      }
  
      //el表格固定api
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
      onMounted(() => {
        getTableData();
      })
  
      return {
        multipleTableRef,
        tableData,
        state,
        handleSizeChange,
        handleCurrentChange,
        getTableData,
        handleSortChange,
        serchOptions,
        toSearch,
        loading,
        svg,
        goBack,
        handleClickEdit,
        toReset
      }
    },
    components: {
      ElTable,
    },
  }
  </script>
  
  <style></style>