<template>
  <router-view></router-view>
</template>

<script>
import { onMounted } from 'vue'
import router from './vueRouter/main'
import axios from 'axios'
import { useStore } from 'vuex'
export default {
  name: 'App',
  components: {

  },
  setup() {
    onMounted(() => {
      const store = useStore()
      axios.defaults.withCredentials = true;
      axios.get('http://localhost:8080/sessionState').then(response => {
        console.log(response.data)
        if (response.data === false) {
          router.push('/login')
          store.commit('changeIsLogin', false)
        } else {
          router.push('/main')
          store.commit('changeIsLogin', true)
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
