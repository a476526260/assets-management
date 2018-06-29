import Vue from 'vue'
import Router from 'vue-router';
import dailyTask from  '../components/dailyTask/dailyTask'
import order from '../components/order/order'
import require from '../components/require/require'
import member from '../components/member/member'
import asset from '../components/asset/asset'
import aliCloud from '../components/aliCloud/aliCloud'
import OB from '../components/OB/OB'
import modify from '../components/modify/modify'
import modelData from '../components/modelData/modelData'
import property from '../components/property/property'
import administrators from '../components/administrators/administrators'
import department from '../components/department/department'
import dictionary from '../components/dictionary/dictionary'
import API from '../components/API/API'
import log from '../components/log/log'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'dailyTask',
      component: dailyTask
    },
    {
      path: '/dailyTask',
      name: 'dailyTask',
      component: dailyTask
    },
    {
      path: '/order',
      name: 'order',
      component: order
    },
    {
      path: '/require',
      name: 'require',
      component: require
    },
    {
      path: '/member',
      name: 'member',
      component: member
    },
    {
      path: '/asset',
      name: 'asset',
      component: asset
    },
    {
      path: '/aliCloud',
      name: 'aliCloud',
      component: aliCloud
    },
    {
      path: '/OB',
      name: 'OB',
      component: OB
    },
    {
      path: '/modify',
      name: 'modify',
      component: modify
    },
    {
      path: '/modelData',
      name: 'modelData',
      component: modelData
    },
    {
      path: '/property',
      name: 'property',
      component: property
    },
    {
      path: '/administrators',
      name: 'administrators',
      component: administrators
    },
    {
      path: '/department',
      name: 'department',
      component: department
    },
    {
      path: '/dictionary',
      name: 'dictionary',
      component: dictionary
    },
    {
      path: '/API',
      name: 'API',
      component: API
    },
    {
      path: '/log',
      name: 'log',
      component: log
    }
  ]
})
