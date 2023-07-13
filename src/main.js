import { createApp } from 'vue'
import App from './App.vue'
import router from './vueRouter/main' // 导入路由配置文件
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
//element-plus 报错 ResizeObserver loop limit exceeded 解决
const debounce = (fn, delay) => {
  let timer = null
  return function () {
    let context = this
    let args = arguments
    clearTimeout(timer)
    timer = setTimeout(function () {
      fn.apply(context, args)
    }, delay)
  }
}

const _ResizeObserver = window.ResizeObserver
window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
  constructor(callback) {
    callback = debounce(callback, 16)
    super(callback)
  }
}
//app挂载
const app = createApp(App).use(store).use(router).use(ElementPlus) // 使用路由.app.mount('#app')
Object.entries(ElementPlusIconsVue).forEach(([name, component]) => {
  app.component(name, component)
})
app.mount('#app')
