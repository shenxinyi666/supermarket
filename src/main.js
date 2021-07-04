import Vue from 'vue'
import App from './App.vue'
import router from "./router";
import store from './store'

import FastClick from 'fastclick'

import toast from 'components/common/toast'

Vue.config.productionTip = false

//git相关指令(常用)
//git clone https://github.com/shenxinyi666/supermarket.git
//git status
//>git add .
//git commit -m '初始化项目'
//git push

//git remote add origin https://github.com/shenxinyi666/supermarket.git
//git push -u origin master

//添加事件总线对象
Vue.prototype.$bus = new Vue()
//安装toast插件
Vue.use(toast)

//解决移动端的300ms延迟
//步骤：安装：npm install fastclick --save
//导入import FastClick from 'fastclick'
//调用attach函数
FastClick.attach(document.body)

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
