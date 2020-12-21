import Vue from 'vue'
import Router from 'vue-router'
import home from '@/views/home'
import login from '@/views/login'

import order from '@/views/order'
import orderReturn from '@/views/return'
import member from '@/views/member'
import report from '@/views/report'
import notice from '@/views/notice'
import queue from '@/views/queue'
import takeout from '@/views/takeout'

import table from '@/views/table'
import tableList from '@/views/table/list'
import tableOrder from '@/views/table/order'
import tableGoods from '@/views/table/goods'
import tablePay from '@/views/table/pay'
import returnDetail from '@/views/return/detail'


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
