module.exports = {
   productionSourceMap: false, // 生产打包时不输出map文件，增加打包速度
   configureWebpack: config => {
      return {
         plugins: [
         ]
      }
   }
}