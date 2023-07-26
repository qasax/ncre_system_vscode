// store/index.js----
import { createStore } from 'vuex'
import axios from 'axios'
axios.defaults.withCredentials = true;
// 创建 Vuex store 实例
const store = createStore({
  state: {
    // 在这里定义你的状态
    entity: {},
    isLogin: false,
    user: ''//获取登录用户信息
  },
  mutations: {
    // 在这里定义你的 mutations
    changeEntity (state, value) {
      state.entity = value
    },
    changeIsLogin (state, value) {
      state.isLogin = value
    },
    changeUser (state) {
      axios.get('http://localhost:8080/getUserName').then((response) => {
        if (response.data.username) {
          state.user = response.data
        }
      })
    }
  },
  actions: {
    // 在这里定义你的 actions
    changeEntity (context, value) {
      context.commit('changeEntity', value)
    },
    changeIsLogin (context, value) {
      context.commit('changeIsLogin', value)
    },
    changeUser (context) {
      context.commit('changeUser')
    }
  },
  getters: {
    // 在这里定义你的 getters
    getEntity (state) {
      return state.entity
    },
    getIsLogin (state) {
      return state.isLogin
    },
    getUser (state) {
      return state.user
    }
  },
})

export default store
