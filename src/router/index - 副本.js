import Vue from 'vue'
import Router from 'vue-router'

const home = () => import('@/views/home')
//import home from '@/views/home'

const login = () => import('@/views/login')
//import login from '@/views/login'

const order = () => import('@/views/order')
//import order from '@/views/order'

const orderReturn = () => import('@/views/orderReturn')
//import orderReturn from '@/views/return'

const member = () => import('@/views/member')
//import member from '@/views/member'

const report = () => import('@/views/report')
//import report from '@/views/report'

const notice = () => import('@/views/notice')
//import notice from '@/views/notice'

const queue = () => import('@/views/queue')
//import queue from '@/views/queue'

const takeout = () => import('@/views/takeout')
//import takeout from '@/views/takeout'

const table = () => import('@/views/table')
//import table from '@/views/table'

const tableList = () => import('@/views/tableList')
//import tableList from '@/views/table/list'

const tableOrder = () => import('@/views/tableOrder')
//import tableOrder from '@/views/table/order'

const tableGoods = () => import('@/views/tableGoods')
//import tableGoods from '@/views/table/goods'

const tablePay = () => import('@/views/tablePay')
//import tablePay from '@/views/table/pay'

const returnDetail = () => import('@/views/returnDetail')
//import returnDetail from '@/views/return/detail'


Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
export default new Router({
  routes: [
    {
      path:'/login',
      name:'login',
      component:login
    },
    {
      path: '/',
      name: 'home',
      component: home,
      redirect: { path: 'table' },
      children: [
        {
          path: 'table',
          name: 'table',
          component: table,
          redirect: { path: '/table/tableList' },
          children:[
            {
              path:'tableList/:id?',
              name:'tableList',
              component:tableList
            },
            {
              path:'tableOrder/:id',
              name:'tableOrder',
              component:tableOrder
            },
            {
              path:'tableGoods/:id',
              name:'tableGoods',
              component:tableGoods
            },
            {
              path:'tablePay/:id',
              name:'tablePay',
              component:tablePay
            }
          ]
        },
        {
          path: 'order',
          name: 'order',
          component: order
        },
        {
          path: 'takeout',
          name: 'takeout',
          component: takeout
        },
        {
          path: 'orderReturn',
          name: 'orderReturn',
          component: orderReturn
        },
        {
          path: 'member',
          name: 'member',
          component: member
        },
        {
          path: 'report',
          name: 'report',
          component: report
        },
        {
          path: 'notice',
          name: 'notice',
          component: notice
        },
        {
          path: 'queue',
          name: 'queue',
          component: queue
        },
        {
          path: 'returnDetail/:id',
          name: 'returnDetail',
          component: returnDetail
        }
      ]
    },
  ],
  linkActiveClass: "active"
})
