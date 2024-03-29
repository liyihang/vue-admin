import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/login.vue'
import Home from './components/home/home.vue'
import Welcome from './components/home/welcome.vue'
import UserList from './components/users/userList.vue'
import Rights from './components/rights/Rights.vue'
import Roles from './components/roles/Roles.vue'
import Cate from './components/goods/cate.vue'
import Params from './components/params/Params.vue'
import OrderList from './components/orderList/OrderList.vue'
import GoodsList from './components/goods/goodsList.vue'
import GoodsAdd from './components/goods/addGoods.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        {
          path: '/welcome',
          component: Welcome
        },
        {
          path: '/users',
          component: UserList
        },
        {
          path: '/rights',
          component: Rights
        },
        {
          path: '/roles',
          component: Roles
        },
        {
          path: '/categories',
          component: Cate
        },
        {
          path: '/params',
          component: Params
        },
        {
          path: '/orders',
          component: OrderList
        }, 
        {
          path: '/goods/list',
          component: GoodsList
        },
        {
          path:'/goods',
          redirect:'/goods/list'
        },
        {
          path:'/goods/add',
          component:GoodsAdd
        }
      ]
    }
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    // }
  ]
})
router.beforeEach((to, from, next) => {
  // to and from are both route objects. must call `next`.
  if (to.path === '/login') {
    return next()
  }
  const token = window.sessionStorage.getItem('token')
  if (!token) {
    return next('/login')
  }
  next()
})
export default router
