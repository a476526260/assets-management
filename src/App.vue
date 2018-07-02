<template>
  <div id="app">
    <router-view></router-view>
    <!--<login v-if="isShowLogin" v-on:success="loginSuccess"></login>
    <mainPage v-if="isShowMain" v-on:signOut="signOut"></mainPage>-->
  </div>
</template>

<script>
  import login from './components/login/login'
  import mainPage from './components/main/mainPage'
  export default {
    name: 'App',
    data(){
      return {
        isShowLogin:"",
        isShowMain:""
      }
    },
    created(){
      this.isShowLogin=false;
      this.isShowMain=true;
    },
    methods:{
      loginSuccess:function () {
        this.isShowLogin=false;
        this.isShowMain=true;
      },
      signOut:function () {
        this.isShowLogin=true;
        this.isShowMain=false;
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
