import { createApp } from 'vue'
import App from './App.vue'
import router from './vueRouter/main' // 导入路由配置文件
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

createApp(App).use(store).use(router).use(ElementPlus).mount('#app') // 使用路由.app.mount('#app')
