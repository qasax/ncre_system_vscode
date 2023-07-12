<template>
  <router-view></router-view>
</template>

<script>
import { onMounted } from 'vue'
import router from './vueRouter/main'
import axios from 'axios'
export default {
  name: 'App',
  components: {

  },
  setup() {
    onMounted(() => {
      axios.defaults.withCredentials = true;
      axios.get('http://localhost:8080/sessionState').then(response => {
        console.log(response.data)
        if (response.data === false) {
          router.push('/login')
        } else {
          router.push('/main')
        }

        // 处理登录成功逻辑
      })
        .catch(error => {
          // 处理登录失败逻辑
          console.log(error.data)
        });



    })
  }

}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
