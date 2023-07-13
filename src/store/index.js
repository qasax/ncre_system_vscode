// store/index.js
import { createStore } from 'vuex'

// 创建 Vuex store 实例
const store = createStore({
  state: {
    // 在这里定义你的状态
    proctor: {},
    isLogin: false,
  },
  mutations: {
    // 在这里定义你的 mutations
    changeProctor(state, value) {
      state.proctor = value
    },
    changeIsLogin(state, value) {
      state.isLogin = value
    },
  },
  actions: {
    // 在这里定义你的 actions
    changeProctor(context, value) {
      context.commit('changeProctor', value)
    },
    changeIsLogin(context, value) {
      context.commit('changeIsLogin', value)
    },
  },
  getters: {
    // 在这里定义你的 getters
    getProctor(state) {
      return state.proctor
    },
    getIsLogin(state) {
      return state.isLogin
    },
  },
})

export default store
