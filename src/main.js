// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import '../static/css/reset.css'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/scss/icon.css'
import vueResource from 'vue-resource'

Vue.config.productionTip = false
Vue.prototype.host = 'http://x.gaodun.cn'    //域名
Vue.prototype.port = '81'                    //端口

Vue.use(ElementUI);
Vue.use(vueResource);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
