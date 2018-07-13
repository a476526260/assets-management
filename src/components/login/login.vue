<template>
  <transition name="fade">
    <div class="page-login">
      <div class="login-warpper">
        <div class="logo"><img src="./logo.png"></div>
        <div class="login-form">
          <h2 class="title">IT部资产管理系统</h2>
          <div class="form-area">
            <div class="form-input">
              <label class="icon" for="user"></label>
              <input v-model="userInfo.userName" type="text" id="user" placeholder="请使用邮箱、手机、工号">
            </div>
            <div class="form-input">
              <label class="icon" for="password"></label>
              <input v-model="userInfo.password" type="password" id="password" placeholder="密码长度为6-16位，字母+数字">
            </div>
            <div class="form-input">
              <label class="icon" for="verification"></label>
              <input v-model="userInfo.verification" type="text" id="verification" placeholder="请输入验证码">
              <span class="verification-code" @click="changeImg($event)" ref="verification"><img :src="verificationSrc"></span>
            </div>
            <div class="form-buttons">
              <button class="logonin" @click="sign">登录</button>
              <button class="reset" @click="reset">重置</button>
            </div>
          </div>
        </div>
        <div class="slogan">
          <div class="QrCode">
            <span class="image"><img src="./QRcode.jpg"></span>
            <span class="text">手机版下载地址</span>
          </div>
          <div class="slogan-ch">选择，成就未来</div>
          <div class="slogan-en">CHOICE, ACHIEVEMENTS OF THE FUTURE</div>
        </div>
      </div>
      <elDialog :message="msg" ref="elDialog"></elDialog>
    </div>
  </transition>
</template>

<script>
  import axios from 'axios';
  import elDialog from '../dialog/dialog';

  export default {
    name: "login",
    data() {
      return {
        verification: "",      //验证码
        verificationSrc: "",   //验证码图片路径
        dialogShow: false,      //提示框是否显示
        msg: "",                //提示文字
        userInfo: {             //用户信息
          userName: '',
          password: '',
          verification: ''
        }
      }
    },
    mounted() {
      this.verificationSrc = this.host + ':' + this.port + '/public/verify';
      let _this = this;
      /** 获取图片验证码*/

      this.$nextTick(function () {
        /*axios.get('/api/login').then(function (response) {
          if (response.data.errNo == 0) {
            _this.verification = response.data.data.verification;
            _this.verificationSrc = response.data.data.verificationSrc;
            _this.$refs.verification.children[0].src = _this.verificationSrc;
          }
        }).catch(function (response) {
          console.log(_this);
        });*/
      })
    },
    methods: {
      /**点击更换验证码*/
      changeImg: function (event) {
        event.target.src = 'http://x.gaodun.cn:81/public/verify';
      },
      /**登陆*/
      sign: function () {
        let _this = this;
        _this.$router.push({"path":"/mainPage/dailyTask"});
        /*if (this.userInfo.userName === '') {
          _this.showDialog("用户名不能为空");
          return false;
        } else if ((!(this.userInfo.password.length > 5 && this.userInfo.password.length < 17)) || (!(/[a-zA-Z]+(?=\d+)|\d+(?=[a-zA-Z]+)/).test(this.userInfo.password))) {
          _this.showDialog("密码必须为6-16位数字和字母");
          return false;
        }
         else if (this.userInfo.verification != this.verification) {
                  _this.showDialog("验证码不正确");
                  document.getElementById("verification").focus();
                  return false;
                }*/

        /* _this.$http.jsonp(_this.host+':'+_this.port+'/public/login'+'/verification/'+_this.userInfo.verification).then(function (response) {
           console.log(response)
           if (response.data.status == 0) {
             _this.$router.push({"path":"/mainPage/dailyTask"});

             _this.reset();
           }else{
             _this.showDialog(response.data.msg);
             return false;
           }
         })*/


       /* axios.post(_this.host + ':' + _this.port + '/public/login', {
          username: _this.userInfo.userName,
          password: _this.userInfo.password,
          verification: _this.userInfo.verification
        }, {
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            'Access-Control-Allow-Origin': 'x.gaodun.cn:81',
            'Access-Control-Allow-Credentials':true
          },
          withCredentials: true
        }).then(function (response) {
          if (response.data.status == 0) {
            _this.$router.push({"path": "/mainPage/dailyTask"});
            _this.reset();
          } else {
            _this.showDialog(response.data.msg);
            return false;
          }
        }).catch(function (response) {
          console.log('fafadsa');
        });*/

        axios.post(_this.host + ':' + _this.port +'/public/login', {
          username: _this.userInfo.userName,
          password: _this.userInfo.password,
          //verification: _this.userInfo.verification
        }).then(function (response) {
          console.log(response)
          if (response.data.status == 0) {
            //_this.$router.push({"path": "/mainPage/dailyTask"});
            _this.reset();
          } else {
            _this.showDialog(response.data.msg);
            return false;
          }
        }).catch(function (response) {
          console.log('fafadsa');
        });

      },
      /**重置*/
      reset: function () {
        this.userInfo.userName = '';
        this.userInfo.password = '';
        this.userInfo.verification = '';
      },
      showDialog: function (message) {
        this.msg = message;
        this.$refs.elDialog.show()
      }
    },
    components: {
      elDialog
    }
  }
</script>

<style lang="scss" scoped>
  .page-login {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: url("bj.jpg") center no-repeat;
    background-size: 100% 100%;
    opacity: 1;
    transition: all 0.5s;
    .login-warpper {
      position: absolute;
      width: 95.83333%;
      height: 92.6%;
      left: 50%;
      top: 50%;
      border-radius: 20px;
      transform: translate3d(-50%, -50%, 0);
      overflow: hidden;
    }
    .logo {
      position: absolute;
      width: 10.3125%;
      height: auto;
      left: 2.17%;
      top: 3%;
      img {
        width: 100%;
      }
    }
    .login-form {
      position: absolute;
      width: 27.1%;
      height: 100%;
      right: 0;
      top: 0;
      background: #ffffff;
      .title {
        position: absolute;
        width: 100%;
        top: 17.2%;
        text-align: center;
        font-size: 36px;
        height: 40px;
        letter-spacing: 2px;
        color: #333333;
      }
      .form-area {
        position: absolute;
        width: 64%;
        left: 18%;
        top: 33%;
        .form-input {
          position: relative;
          display: flex;
          margin-top: 30px;
          padding: 8px 0;
          border-bottom: 1px solid #dddddd;
          label.icon {
            display: block;
            width: 30px;
            height: 30px;
            background-image: url("../../assets/images/icon-sprite.png");
            background-repeat: no-repeat;
          }
          @for $i from 1 through 3 {
            &:nth-child(#{$i}) {
              label.icon {
                background-position: -30px*$i+30px 0;
              }
            }
          }
          input {
            flex: 1;
            display: block;
            height: 30px;
            line-height: 30px;
            margin-left: 6px;
            text-indent: 10px;
            outline: none;
            &::-webkit-input-placeholder {
              font-size: 16px;
              color: #999999;
            }
          }
          span.verification-code {
            position: absolute;
            width: 100px;
            height: 42px;
            right: 0;
            top: 50%;
            transform: translate3d(0, -50%, 0);
            img {
              display: block;
              width: 100%;
              height: 42px;
            }
          }
        }
        .form-buttons {
          display: flex;
          justify-content: space-between;
          margin-top: 35px;
          button {
            width: 40%;
            height: 50px;
            box-sizing: border-box;
            border-radius: 8px;
            border: none;
            font-size: 20px;
            outline: none;
            appearance: none;
            cursor: pointer;
            &.logonin {
              background: #f0aa14;
              color: #ffffff;
            }
            &.reset {
              background: #ffffff;
              border: 1px solid #f0aa14;
              color: #f0aa14;
            }
          }
        }
      }

    }
    .slogan {
      position: absolute;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      right: 29.27%;
      bottom: 5%;
      .QrCode {
        width: 126px;
        overflow: hidden;
        span {
          display: block;
        }
        .image {
          width: 126px;
          height: 126px;
        }
        .text {
          font-size: 18px;
          line-height: 34px;
          color: #ffffff;
        }
      }
      .slogan-ch {
        margin-top: 24px;
        font-size: 30px;
        line-height: 36px;
        color: #ffffff;
        font-weight: lighter;
      }
      .slogan-en {
        margin-top: 18px;
        font-size: 36px;
        line-height: 36px;
        color: #ffffff;
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
