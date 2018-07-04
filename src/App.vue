<template>
  <div id="app">
    <router-view :user="userName" v-on:success="loginSuccess"></router-view>
  </div>
</template>

<script>
  import Vue from 'vue'
  import login from './components/login/login'
  import mainPage from './components/main/mainPage'
  export default {
    name: 'App',
    data(){
      return {
        userName:"",
      }
    },
    created(){},
    methods:{
      loginSuccess:function (e) {
        this.userName=e.userName;
        //将用户名保存到本地
        localStorage.setItem("userName",e.userName);
      }
    },
    components:{
      login,
      mainPage
    }

  }
</script>

<style lang="scss" scoped>
  #app {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>
0000
