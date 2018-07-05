<template>
  <transition name="fade">
    <div class="dialog" v-if="isShow">
      <div class="mask" @click="hide"></div>
      <div class="dialog-box">
        <div class="dialog-close" @click="hide">X</div>
        <div class="dialog-header">提示</div>
        <div class="dialog-body">{{message}}</div>
        <div class="dialog-footer"></div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: "elDialog",
    data() {
      return {
        isShow:false    //是否显示弹出框
      }
    },
    props: {
      message: {
        type: String    //消息提示文字
      }
    },
    methods: {
      hide:function () {
        this.isShow=false
      },
      show:function () {
        this.isShow=true
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/scss/layout";

  .dialog {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 99999;
    overflow: hidden;
    .mask {
      width: 100%;
      height: 100%;
      background: black;
      opacity: 0.5;
    }
    .dialog-box {
      @include layout-center(fixed);
      width: 30%;
      padding: 20px;
      box-sizing: border-box;
      font-size: 16px;
      color: #000;
      background: #ffffff;
      .dialog-close {
        position: absolute;
        right: 5px;
        top: 5px;
        padding: 10px;
        font-family: sans-serif;
        font-size: 20px;
        line-height: 20px;
        color: #000;
        cursor: pointer;
      }
      .dialog-header {
        padding-bottom: 10px;
        line-height: 24px;
        font-size: 18px;
        color: #303133;
      }
      .dialog-body {
        padding: 20px 0;
        color: #606266;
        font-size: 14px;
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
