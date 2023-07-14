// store/index.js
import { createStore } from 'vuex'

// 创建 Vuex store 实例
const store = createStore({
  state: {
    // 在这里定义你的状态
    entity: {},
    isLogin: false,
  },
  mutations: {
    // 在这里定义你的 mutations
    changeEntity(state, value) {
      state.entity = value
    },
    changeIsLogin(state, value) {
      state.isLogin = value
    },
  },
  actions: {
    // 在这里定义你的 actions
    changeEntity(context, value) {
      context.commit('changeEntity', value)
    },
    changeIsLogin(context, value) {
      context.commit('changeIsLogin', value)
    },
  },
  getters: {
    // 在这里定义你的 getters
    getEntity(state) {
      return state.entity
    },
    getIsLogin(state) {
      return state.isLogin
    },
  },
})

export default store
