<template>
  <div id="app">
    <router-view :user="userName" v-on:success="loginSuccess"></router-view>
  </div>
</template>

<script>
  import login from './components/login/login'
  import main from './components/main/main'
  export default {
    name: 'App',
    data(){
      return {
        userName:"",
      }
    },
    created(){
      //console.log(this.$store.state.show)
    },
    methods:{
      loginSuccess:function (e) {
        this.userName=e.userName;
        //将用户名保存到本地
        localStorage.setItem("userName",e.userName);
      }
    },
    components:{
      login,
      main
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
