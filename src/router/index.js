import Vue from 'vue'
import Router from 'vue-router';
import login from "../components/login/login"
import main from "../components/main/main"
import group from '../components/group/group'
import weChat from '../components/weChat/weChat'
/**部门*/
import department from '../components/department/department'
/**积分管理*/
import integralRule from '../components/integral/rule'







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
          path: 'group',
          name: 'group',
          component: group,
          meta: {
            requireAuth: true
          },
        },
        {
          path: 'department',
          name: 'department',
          component: department,
          meta: {
            requireAuth: true
          },
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
          path: 'integralRule',
          name: 'integralRule',
          component: integralRule,
          meta: {
            requireAuth: true
          }
        }
      ]
    }

  ]
})
