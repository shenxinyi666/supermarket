module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        //已经配置过@
        //'@':'src'
        'assets': '@/assets',
        'common': '@/common',
        'components': '@/components',
        'network': '@/network',
        'views': '@/views'
      }
    }
  }
}
