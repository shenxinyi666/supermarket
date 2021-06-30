import Vue from 'vue'
import App from './App.vue'
import router from "./router";

Vue.config.productionTip = false

//git相关指令(常用)
//git clone https://github.com/shenxinyi666/supermarket.git
//git status
//>git add .
//git commit -m '初始化项目'
//git push

//git remote add origin https://github.com/shenxinyi666/supermarket.git
//git push -u origin master

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
