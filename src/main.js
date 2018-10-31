// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui'
import { Message } from 'element-ui'
import store from './store/index'
import filter from "./assets/script/filter"
import '../static/css/reset.css'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/scss/icon.css'
import 'babel-polyfill'
Vue.use(ElementUI);

Vue.prototype.HOST='/api'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  data: {
    token: '',
  },
  router,
  store,
  filters: filter,
  components: {App},
  template: '<App/>',
  mounted() {
    this.$nextTick(function () {
      if (localStorage.getItem('token')) {
        //本地有token,判断是否过期
        this.$ajax.get('public/token', {
          params: {
            token: localStorage.getItem('token')
          }
        }).then(res => {
          if (res.data.code === 40002) {
            this.$router.replace('/')
          }
        });
      } else {
        //本地无token,直接退回登录页
        this.$router.replace('/')
      }
      this.$router.beforeEach((to, from, next) => {
        this.token = localStorage.getItem('token');
        if (to.matched.some(record => record.meta.requireAuth)) {
          //这里判断用户是否登录，验证本地存储是否有token
          if (!this.token) { // 判断当前的token是否存在
            this.$router.replace('/')
            return false;
          }
          next();
        } else {
          next() // 确保一定要调用 next()
        }
      });
    })
  }
});


/**
 * axios 全局默认配置
 */


/**版本*/
axios.defaults.headers.common['v'] = "v1.";

Vue.config.productionTip = false;

if (process.env.NODE_ENV === 'development') {
  /**开发环境*/
  axios.defaults.baseURL = 'http://test.o.gaodun.com/';
}
else if (process.env.NODE_ENV === 'debug') {
  /**测试环境*/
  axios.defaults.baseURL = 'http://test.o.gaodun.com/';
}
else if (process.env.NODE_ENV === 'production') {
  /**生产环境*/
  axios.defaults.baseURL = 'http://test.o.gaodun.com/';
  //axios.defaults.baseURL = 'https://x.gaodun.cn/';
}


/**请求超时时间*/
axios.defaults.timeout = 10000;
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
/** 请求拦截器*/
axios.interceptors.request.use(config => {
  const token = store.state.token || localStorage.getItem('token');
  token && (config.headers.token = token);
  return config;
}, error => {
  return Promise.error(error);
});



// 响应拦截器
axios.interceptors.response.use(response => {
    if (response.data.code === 200) {
      return Promise.resolve(response);
    }else{
      Message.success({
        message:response.data.info,
        type:'error'
      });
      router.replace({path:'/'});
      return Promise.reject(response);
    }
  }, error => {
    // 服务器状态码不是200的情况
    router.replace({
      path: '/',
    });
    return Promise.reject(error.response);
  }
);
