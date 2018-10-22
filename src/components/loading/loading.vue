<template>
    <div class="loading">
      <div class="sk-circle-bounce">
        <div class="sk-child sk-circle-1"></div>
        <div class="sk-child sk-circle-2"></div>
        <div class="sk-child sk-circle-3"></div>
        <div class="sk-child sk-circle-4"></div>
        <div class="sk-child sk-circle-5"></div>
        <div class="sk-child sk-circle-6"></div>
        <div class="sk-child sk-circle-7"></div>
        <div class="sk-child sk-circle-8"></div>
        <div class="sk-child sk-circle-9"></div>
        <div class="sk-child sk-circle-10"></div>
        <div class="sk-child sk-circle-11"></div>
        <div class="sk-child sk-circle-12"></div>
      </div>
    </div>
</template>

<script>
  export default {
    name: "loading"
  }
</script>

<style lang="scss" scoped>
  .loading{
    position: fixed;
    width: 4em;
    height: 4em;
    left: 50%;
    top: 50%;
    transform: translate3d(-50%,-50%,0);
    z-index: 99999;
    .sk-circle-bounce {
      width: 100%;
      height: 100%;
      position: relative;
      margin: auto;
      .sk-child{
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        &:before{
          content: '';
          display: block;
          margin: 0 auto;
          width: 15%;
          height: 15%;
          background-color: #337ab7;
          border-radius: 100%;
          -webkit-animation: sk-circle-bounce-delay 1.2s infinite ease-in-out both;
          animation: sk-circle-bounce-delay 1.2s infinite ease-in-out both;
        }
      }
      .sk-circle-2{
        -webkit-transform: rotate(30deg);
        transform: rotate(30deg);
        &:before {
          -webkit-animation-delay: -1.1s;
          animation-delay: -1.1s;
        }
      }
      .sk-circle-3 {
        -webkit-transform: rotate(60deg);
        transform: rotate(60deg);
        &:before {
          -webkit-animation-delay: -1s;
          animation-delay: -1s;
        }
      }
      .sk-circle-4 {
        -webkit-transform: rotate(90deg);
        transform: rotate(90deg);
        &:before {
          -webkit-animation-delay: -0.9s;
          animation-delay: -0.9s;
        }
      }
      .sk-circle-5 {
        -webkit-transform: rotate(120deg);
        transform: rotate(120deg);
        &:before {
          -webkit-animation-delay: -0.8s;
          animation-delay: -0.8s;
        }
      }
      .sk-circle-6 {
        -webkit-transform: rotate(150deg);
        transform: rotate(150deg);
        &:before {
          -webkit-animation-delay: -0.7s;
          animation-delay: -0.7s;
        }
      }
      .sk-circle-7 {
        -webkit-transform: rotate(180deg);
        transform: rotate(180deg);
        &:before {
          -webkit-animation-delay: -0.6s;
          animation-delay: -0.6s;
        }
      }
      .sk-circle-8 {
        -webkit-transform: rotate(210deg);
        transform: rotate(210deg);
        &:before {
          -webkit-animation-delay: -0.5s;
          animation-delay: -0.5s;
        }
      }
      .sk-circle-9 {
        -webkit-transform: rotate(240deg);
        transform: rotate(240deg);
        &:before {
          -webkit-animation-delay: -0.4s;
          animation-delay: -0.4s;
        }
      }
      .sk-circle-10 {
        -webkit-transform: rotate(270deg);
        transform: rotate(270deg);
        &:before {
          -webkit-animation-delay: -0.3s;
          animation-delay: -0.3s;
        }
      }
      .sk-circle-11 {
        -webkit-transform: rotate(300deg);
        transform: rotate(300deg);
        &:before {
          -webkit-animation-delay: -0.2s;
          animation-delay: -0.2s;
        }
      }
      .sk-circle-12 {
        -webkit-transform: rotate(330deg);
        transform: rotate(330deg);
        &:before {
          -webkit-animation-delay: -0.1s;
          animation-delay: -0.1s;
        }
      }
    }
  }
  @-webkit-keyframes sk-circle-bounce-delay {
    0%, 80%, 100% {
      -webkit-transform: scale(0);
      transform: scale(0);
    }
    40% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }

  @keyframes sk-circle-bounce-delay {
    0%, 80%, 100% {
      -webkit-transform: scale(0);
      transform: scale(0);
    }
    40% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }
</style>
