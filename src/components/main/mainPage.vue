<template>
  <transition name="fade">
    <div class="appMain">
      <div class="main-title">
        <div class="title-txt">IT部资产管理系统</div>
        <div class="about-user">
          <span class="modify">密码修改</span>
          <span class="sign-out" @click="signOut">退出登录</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: "mainPage",
    data(){
      return {

      }
    },
    methods:{
      signOut:function () {
        this.$emit("signOut",event.target)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .appMain {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #f5f5f5;
    transition: all 0.5s;
    .main-title {
      display: flex;
      justify-content: space-between;
      height: 80px;
      background: #ffffff;
      overflow: hidden;
      .title-txt {
        padding-left: 40px;
        font-size: 30px;
        line-height: 80px;
        color: #333333;
      }
      .about-user{
        margin: 25px 0;
        padding-right: 35px;
        overflow: hidden;
        span{
          position: relative;
          float: left;
          height: 30px;
          margin-left: 34px;
          padding-left: 35px;
          font-size: 12px;
          line-height: 30px;
          cursor: pointer;
          &.modify{
            color: #999999;
          }
          &.sign-out{
            color: #f0aa14;
          }
          &:before{
            content: '';
            display: block;
            width: 30px;
            height: 30px;
            position: absolute;
            left: 0;
            top: 0;
            background: url("../../assets/images/icon-sprite.png") no-repeat;
          }
          &.modify:before{
            background-position: -90px 0;
          }
          &.sign-out:before{
            background-position: -120px 0;
          }
        }
      }
    }
    &.fade-enter, &.fade-leave-to {
      opacity: 0;
    }
    &.fade-enter-active, &.fade-leave-active {
      transition: all 0.5s;
    }
  }
</style>
