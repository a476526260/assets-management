import Vue from 'vue'
import Router from 'vue-router';
import login from "../components/login/login"
import main from "../components/main/main"
import dailyTask from '../components/dailyTask/dailyTask'
import order from '../components/order/order'
import require from '../components/require/require'
import member from '../components/member/member'
import asset from '../components/asset/asset'
import aliCloud from '../components/aliCloud/aliCloud'
import OB from '../components/OB/OB'
import modelData from '../components/modelData/modelData'
import property from '../components/property/property'
import administrators from '../components/administrators/administrators'
import department from '../components/department/department'
import dictionary from '../components/dictionary/dictionary'
import API from '../components/API/API'
import group from '../components/group/group'
import log from '../components/log/log'
import cdn from '../components/cdn/cdn'
import groupUser from '../components/user/user'
import newStaff from '../components/newStaff/newStaff'
import broadband from '../components/broadband/broadband'
import allType from '../components/allType/allType'
import attrList from '../components/attrList/attrList'
import weChat from '../components/weChat/weChat'
import ding from '../components/dingding/ding'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login,
      meta: {
        requireAuth: false
      }
    },
    {
      path: '/login',
      name: 'login',
      component: login,
      meta: {
        requireAuth: false
      }
    },
    {
      path: '/main',
      name: 'main',
      component: main,
      meta: {
        requireAuth: true
      },
      children: [
        {
          path: 'dailyTask',
          name: 'dailyTask',
          component: dailyTask,
          meta: {
            requireAuth: true
          }
        },
        {
          path: 'order',
          name: 'order',
          component: order,
          meta: {
            requireAuth: true
          }
        },
        {
          path: 'require',
          name: 'require',
          component: require,
          meta: {
            requireAuth: true
          }
        },
        {
          path: 'member',
          name: 'member',
          component: member,
          meta: {
            requireAuth: true
          }
        },
        {
          path: 'asset',
          name: 'asset',
          component: asset,
          meta: {
            requireAuth: true
          },
        },
        {
          path: 'group',
          name: 'group',
          component: group,
          meta: {
            requireAuth: true
          },
        },
        {
          path: 'aliCloud',
          name: 'aliCloud',
          component: aliCloud,
          meta: {
            requireAuth: true
          }
        },
        {
          path: 'OB',
          name: 'OB',
          component: OB,
          meta: {
            requireAuth: true
          }
        },
        {
          path: 'modelData',
          name: 'modelData',
          component: modelData,
          meta: {
            requireAuth: true
          }
        },
        {
          path: 'property',
          name: 'property',
          component: property,
          meta: {
            requireAuth: true
          }
        },
        {
          path: 'administrators',
          name: 'administrators',
          component: administrators,
          meta: {
            requireAuth: true
          }
        },
        {
          path: 'department',
          name: 'department',
          component: department,
          meta: {
            requireAuth: true
          }
        },
        {
          path: 'dictionary',
          name: 'dictionary',
          component: dictionary,
          meta: {
            requireAuth: true
          }
        },
        {
          path: 'API',
          name: 'API',
          component: API,
          meta: {
            requireAuth: true
          }
        },
        {
          path: 'log',
          name: 'log',
          component: log,
          meta: {
            requireAuth: true
          }
        },
        {
          path: 'cdn',
          name: 'cdn',
          component: cdn,
          meta: {
            requireAuth: true
          }
        },
        {
          path: 'groupUser',
          name: 'groupUser',
          component: groupUser,
          meta: {
            requireAuth: true
          }
        },
        {
          path: 'newStaff',
          name: 'newStaff',
          component: newStaff,
          meta: {
            requireAuth: true
          }
        },
        {
          path: 'broadband',
          name: 'broadband',
          component: broadband,
          meta: {
            requireAuth: true
          }
        },
        {
          path: 'allType',
          name: 'allType',
          component: allType,
          meta: {
            requireAuth: true
          }
        },
        {
          path: 'attrList',
          name: 'attrList',
          component: attrList,
          meta: {
            requireAuth: true
          }
        },
        {
          path: 'weChat',
          name: 'weChat',
          component: weChat,
          meta: {
            requireAuth: true
          }
        },
        {
          path: 'ding',
          name: 'ding',
          component: ding,
          meta: {
            requireAuth: true
          }
        }
      ]
    }

  ]
})
