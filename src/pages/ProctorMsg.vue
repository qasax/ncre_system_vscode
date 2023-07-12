<template>
  <el-page-header style="border-bottom: 1px solid #ccc;height: 30px;padding-top: 10px">
    <template #content>
      <span class=" text-large font-600 mr-3"> 监考员信息 </span>
    </template>
  </el-page-header>
  <div style="display: flex;align-items:center;">
    <el-select v-model="state.optionValue" class="m-2" size="large">
      <el-option v-for="item in serchOptions" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
    <el-input v-model="state.searchValue" class="w-50 m-2" size="large" placeholder="请输入" />
    <el-button type="primary" @click="toSearch">查询</el-button>
  </div>
  <el-table ref="multipleTableRef" :data="tableData" style="width: 100%" @selection-change="handleSelectionChange"
    @sort-change="handleSortChange">
    <el-table-column type="selection" width="55" />
    <el-table-column label="序号" property="id" width="120" sortable="custom"></el-table-column>
    <el-table-column property="teacherName" label="姓名" width="120" />
    <el-table-column property="account" label="账号" show-overflow-tooltip />
    <el-table-column property="password" label="密码" width="120" />
    <el-table-column property="age" label="性别" width="120" />
    <el-table-column property="gender" label="年龄" width="120" />
    <el-table-column property="phoneNumber" label="手机号" width="120" />
    <el-table-column property="email" label="邮箱" width="120" />
    <el-table-column fixed="right" label="操作" width="220">
      <template #default="{ row }">
        <el-button link type="primary" size="small">详细</el-button>
        <el-button link type="primary" size="small">编辑</el-button>
        <el-button link type="primary" size="small" @click="handleClickDelete(row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div style="margin-top: 20px">
    <el-button @click="toggleSelection()">Clear selection</el-button>
  </div>
  <div class="demo-pagination-block" style="margin-top: 10px; ">
    <el-pagination v-model:current-page="state.currentPage" v-model:page-size="state.pageSize"
      :page-sizes="[10, 20, 30, 40]" :small="state.small" :disabled="state.disabled" :background="state.background"
      layout="total, sizes, prev, pager, next, jumper" :total="state.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
  </div>
</template>

<script>
import { onMounted, ref, reactive } from 'vue'
import { ElTable } from 'element-plus'
import axios from 'axios'
axios.defaults.withCredentials = true;
export default {
  setup() {
    let multipleTableRef = ref()
    let multipleSelection = ref([])
    let tableData = ref([])
    let state = reactive({
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
        value: '姓名',
        label: '姓名',
      },
    ]
    const toSearch = () => {
      state.isSearch = true
      getTableData()
    }
    const handleClickDelete = (val) => {
      console.log(val)
      axios.get("http://localhost:8080/deleteOne", {
        params: {
          id: val.id,
        }
      }).then(() => {
        getTableData()
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
    const getTableData = function () {
      axios.get("http://localhost:8080/aLLProctors", {
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
      handleClickDelete
    }
  },
  components: {
    ElTable,
  },
}
</script>

<style></style>