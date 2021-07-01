import Vue from 'vue'
import VueRouter from 'vue-router'
import App from '../App.vue'

const Home = () => import('../views/home/Home')
const Category = () => import('../views/category/Category')
const ShopCart = () => import('../views/shopCart/ShopCart')
const Profile = () => import('../views/profile/Profile')
const Detail = () => import('../views/detail/Detail')


//1.安装插件
Vue.use(VueRouter)

//2.创建router
const routes = [
  {
    path: '',
    redirect: '/home'
  },
  {
    path: "/home",
    component: Home
  },
  {
    path: "/category",
    component: Category
  },
  {
    path: "/shopCart",
    component: ShopCart
  },
  {
    path: "/profile",
    component: Profile
  },
  {
    path: "/detail/:iid",
    component: Detail
  }
]
const router = new VueRouter({
  routes,
  mode:'history'
})

//3.导入router
export default router
