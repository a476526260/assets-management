import Vue from 'vue'

export default (function () {
  Vue.filter("status",function (value) {
    switch (Number(value)){
      case 0 :
        return "待填写";
      case 1 :
        return '待审核';
      case 2:
        return "已完成";
      default:
        return ""
    }
  });

  Vue.filter('time',function () {

  });

  Vue.filter('rdsTxt',function (value) {
    if (value===1){
      return '杭州'
    }else if(value===2){
      return '香港'
    }
  })



})()

