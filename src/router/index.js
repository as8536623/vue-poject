import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/users/Users.vue'
import Roles from '../components/power/Roles.vue'
import Rights from '../components/power/Rights.vue'
import Goods from '../components/shop/Goods.vue'
import Params from '../components/shop/Params.vue'
import Categories from '../components/shop/Categories.vue'
import Orders from '../components/order/Orders.vue'
import Reports from '../components/data/Reports.vue'

Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    redirect:'/login'
  },{
    path:'/login',
    component:Login
  },{
    path:'/home',
    component:Home,
    redirect:'/welcome',
    children:[{
      path:'/welcome',
      component:Welcome
    },{
      path:'/users',
      component:Users
    },{
      path:'/roles',
      component:Roles
    },{
      path:'/rights',
      component:Rights
    },{
      path:'/goods',
      component:Goods
    },{
      path:'/params',
      component:Params
    },{
      path:'/categories',
      component:Categories
    },{
      path:'/orders',
      component:Orders
    },{
      path:'/reports',
      component:Reports
    }
    ]
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to,form,next)=>{
  if(to.path=='/login') return next();
  const token=window.sessionStorage.getItem('token');
  if(!token) return next('/login');
  next();
})

export default router
