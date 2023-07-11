// store/index.js
import { createStore } from 'vuex'

// 创建 Vuex store 实例
const store = createStore({
  state: {
    // 在这里定义你的状态
    isLogin: false,
  },
  mutations: {
    // 在这里定义你的 mutations
    changeIsLogin(state, value) {
      state.isLogin = value
    },
  },
  actions: {
    // 在这里定义你的 actions
    changeIsLogin(context, value) {
      context.commit('changeIsLogin', value)
    },
  },
  getters: {
    // 在这里定义你的 getters
    getIsLogin(state) {
      return state.isLogin
    },
  },
})

export default store
