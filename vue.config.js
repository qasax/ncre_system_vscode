const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    // 项目运行时候的端口号
    port: 8088,
  },
})
