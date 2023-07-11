// store/index.js
import { createStore } from 'vuex'

// 创建 Vuex store 实例
const store = createStore({
  state: {
    // 在这里定义你的状态
    product: {},
  },
  mutations: {
    // 在这里定义你的 mutations
    changeProduct(state, value) {
      state.product = value
    },
  },
  actions: {
    // 在这里定义你的 actions
    changeProduct(context, value) {
      context.commit('changeProduct', value)
    },
  },
  getters: {
    // 在这里定义你的 getters
    getProduct(state) {
      return state.product
    },
  },
})

export default store
