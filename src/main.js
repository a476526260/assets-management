// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios';
import ElementUI from 'element-ui'
import store from './store/index'
import VueHtmlToPaper from 'vue-html-to-paper';
import filter from "./assets/script/filter"
import '../static/css/reset.css'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/scss/icon.css'
import 'babel-polyfill'

/**
 * axios 全局默认配置
 */

if(localStorage.getItem('token')!==''){
  axios.defaults.headers.common['token'] = localStorage.getItem('token')
}

/**
  版本号
 * */
axios.defaults.headers.common['v'] = "v1.";



/*打印机全局配置*/
const options = {
  name: '_blank',
  specs: [
    'fullscreen=yes',
    'titlebar=yes',
    'scrollbars=yes'
  ],
  styles: [
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
    'https://unpkg.com/kidlat-css/css/kidlat.css',
    '../static/css/reset.css',
    './static/css/publish.css'
  ]
}

Vue.use(VueHtmlToPaper, options);

/*配置请求域名*/
Vue.config.productionTip = false;
if (window.location.host === 'x.gaodun.cn') {
  //生产环境
  Vue.prototype.host = 'https://x.gaodun.cn/';
} else {
  //开发环境
  Vue.prototype.host = 'http://api.gaodun.cn';
}

//域名
Vue.prototype.$ajax = axios;
Vue.use(ElementUI);

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
        this.$ajax.get(this.host + '/public/token', {
          params: {
            token: localStorage.getItem('token')
          }
        }).then(res=> {
          if (res.data.code === 40002) {
            this.$router.push('/')
          }
        });
      } else {
        //本地无token,直接退回登录页
        this.$router.push('/')
      }
      this.$router.beforeEach((to, from, next) => {
        this.token = localStorage.getItem('token');
        if (to.matched.some(record => record.meta.requireAuth)) {
          //这里判断用户是否登录，验证本地存储是否有token
          if (!this.token) { // 判断当前的token是否存在
            this.$router.push('/')
          } else {
            next()
          }
        } else {
          next() // 确保一定要调用 next()
        }
      });

      /*window.onresize=function () {
        setTimeout(function () {
          window.location.reload()
        },300)
      }*/

    })
  }
});



