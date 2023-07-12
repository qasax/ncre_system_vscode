import { createApp } from 'vue'
import App from './App.vue'
import router from './vueRouter/main' // 导入路由配置文件
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const app = createApp(App).use(store).use(router).use(ElementPlus) // 使用路由.app.mount('#app')
Object.entries(ElementPlusIconsVue).forEach(([name, component]) => {
  app.component(name, component)
})
app.mount('#app')
