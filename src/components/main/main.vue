<template>
  <transition name="fade">
    <div class="appMain">
      <div class="main-header">
        <div class="title-txt">管理系统</div>
        <div class="about-user">
          <span class="modify" @click="showmodifyPassword">密码修改</span>
          <span class="sign-out" @click="showDialog">退出登录</span>
        </div>
      </div>
      <div class="main-container" ref="container">
        <el-container style=" height: 100%;">
          <el-aside class="aside" width="14%">
            <el-menu :default-active="$route.path" router ref="elMenu" @open="handleOpen" class="el-menu-vertical-demo"
                     background-color="#253340" text-color="#edf2fc" active-text-color="#f0aa14">
              <el-submenu v-for="(subMenu,index) in menu" :key="index" :index="subMenu.id" v-if="subMenu.list.length>0">
                <template slot="title">
                  <i class="title-icon iconfont" :class="subMenu.icon"></i><span>{{subMenu.name}}</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item v-for="(item,number) in subMenu.list" :key="number" :index="item.href">
                    <i class="item-icon iconfont" :class="item.icon"></i><span>{{item.name}}</span>
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>

              <el-menu-item v-else :index="subMenu.href">
                <i class="title-icon iconfont icon-shuju" :class="subMenu.icon"></i>
                <span slot="title">{{subMenu.name}}</span>
              </el-menu-item>
            </el-menu>
          </el-aside>
          <el-main class="main">
            <keep-alive>
              <router-view :user="user" name="default"></router-view>
            </keep-alive>
          </el-main>
        </el-container>
      </div>

      <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
        <span>确定要退出吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="signOut">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog :title="userName+' 密码修改'" :visible.sync="modifyPasswordVisible" width="550px">

        <div class="modify-box">
          <el-form :inline="true" label-position="right" label-width="60px" :model="modifyData">
            <el-form-item label="旧密码:">
              <el-input v-model="modifyData.oldPassword"></el-input>
            </el-form-item>
            <el-form-item label="新密码:">
              <el-input v-model="modifyData.newPassword"></el-input>
            </el-form-item>
            <el-form-item label="重复:">
              <el-input v-model="modifyData.newPassword2"></el-input>
            </el-form-item>
            <div class="tipText">提示:1.密码为6-16 位; 2.必须包含数字和字母</div>
            <div class="button">
              <el-button type="warning" @click="modifyPassword">提交</el-button>
            </div>
          </el-form>
        </div>
      </el-dialog>
    </div>
  </transition>
</template>

<script>
  import * as ajax from '../../assets/script/ajaxApi'
  import tipMixin from "../../assets/script/mixin"
  export default {
    name: "main",
    mixins:[tipMixin],
    data() {
      return {
        menu: [],
        dialogVisible: false,          //退出登录框是否显示
        navIndex: [],    //左侧导航索引
        modifyPasswordVisible: false,  //修改密码是否显示
        userName: localStorage.getItem("userName") || '',  //用户名
        modifyData: {                                      //密码相关
          oldPassword: "",
          newPassword: "",
          newPassword2: ""
        },
        password: ''
      }
    },
    props: {
      user: {
        type: String
      }
    },
    mounted() {
      this.$nextTick(function () {
        this.$refs.container.style.height = window.innerHeight - 40 + "px";
        window.addEventListener('resize',()=>{
          this.$refs.container.style.height = window.innerHeight - 40 + "px";
        });
        ajax.fetch_get('api/menu').then(res=> {
          if (res.data.code === 200) {
            this.menu = res.data.data;
            this.menu.forEach(item=> {
              this.navIndex.push(item.id);
            })
          }else{
            this.errorTip(res.data.info);
          }
        }).catch(res=> {
          //console.log(res);
        });
      });
    },
    methods: {
      modifyPassword: function () {
        let _this = this;
        if (this.modifyData.oldPassword === '') {
          this.errorTip("旧密码不能为空！");
          return false;
        } else if ((!(this.modifyData.newPassword.length > 5 && this.modifyData.newPassword.length < 17)) || (!(/[a-zA-Z]+(?=\d+)|\d+(?=[a-zA-Z]+)/).test(this.modifyData.newPassword))) {
          this.errorTip("密码格式不正确！");
          return false;
        } else if (this.modifyData.newPassword !== this.modifyData.newPassword2) {
          this.errorTip("新密码两次输入不一致！");
          return false;
        } else {
          ajax.fetch_post('public/changePassWord',{
            oldPassWord:this.modifyData.oldPassword,
            newPassWord:this.modifyData.newPassword,
            reNewPassWord:this.modifyData.newPassword2,
          }).then(res=> {
            if (res.data.code === '200') {
              this.$message({
                showClose: true,
                message: '密码修改成功！',
                type: 'success'
              });
              setTimeout(function () {
                _this.$router.push('/');
                localStorage.clear();
              },200)
            }else{
              this.errorTip(res.data.info);
            }
          }).catch(res=>{
            console.log(res);
          });
        }
      },
      showDialog: function () {
        /**显示退出登录提示*/
        this.dialogVisible = true;
      },
      signOut: function () {
        /**退出登录*/
        ajax.fetch_get('public/login').then(res=> {
          if (res.data.code === 200) {
            this.dialogVisible = false;
            this.$router.push("/");
            localStorage.clear();
          }
        }).catch(res=> {
          console.log(res);
        });
      },
      showmodifyPassword: function () {
        /**修改密码*/
        this.modifyPasswordVisible = true;
      },
      handleOpen(key) {
        /**打开当前导航，关闭其他导航*/
        let _this = this;
        this.navIndex.forEach(function (v, i) {
          _this.$refs.elMenu.close(v);
        });
        this.$refs.elMenu.open(key);
      }
    },
    components: {}
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/scss/layout";

  .appMain {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #f5f5f5;
    transition: all 0.5s;
    .el-menu-item {
      i {
        color: #ededec
      }
    }
    .el-menu-item.is-active {
      i {
        color: inherit;
      }
    }
    .el-menu-item-group {
      .el-menu-item:first-child {
        margin-top: -20px;
      }
    }
    .main-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      background: #ffffff;
      overflow: hidden;
      .title-txt {
        padding-left: 40px;
        font-size: 20px;
        line-height: 40px;
        color: #333333;
      }

      .about-user {
        padding-right: 50px;
        overflow: hidden;
        span {
          position: relative;
          float: left;
          height: 30px;
          margin-left: 34px;
          padding-left: 35px;
          font-size: 12px;
          line-height: 30px;
          cursor: pointer;
          &.modify {
            color: #999999;
          }
          &.sign-out {
            color: #f0aa14;
          }
          &:before {
            content: '';
            display: block;
            width: 30px;
            height: 30px;
            position: absolute;
            left: 0;
            top: 0;
            background: url("../../assets/images/icon-sprite.png") no-repeat;
          }
          &.modify:before {
            background-position: -90px 0;
          }
          &.sign-out:before {
            background-position: -120px 0;
          }
        }
      }
    }
    .main-container {
      .aside {
        background: #33414e;
        .title-icon.iconfont {
          font-size: 24px;
          color: #ededec;
          + span {
            margin-left: 10px;
            font-size: 16px;
            color: #ededec;
          }
        }
        .item-icon.iconfont {
          font-size: 16px;
          + span {
            margin-left: 8px;
            font-size: 14px;
          }
        }
      }
      .el-main {
        width: 85%;
        display: block;
        padding: 0 20px;
      }
    }
    &.fade-enter, &.fade-leave-to {
      opacity: 0;
    }
    &.fade-enter-active, &.fade-leave-active {
      transition: all 0.5s;
    }
    .modify-box {
      position: relative;
      width: 90%;
      height: 88%;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 5px;
      .el-form {
        .el-form-item {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 0;
        }
        .el-input {
          width: 320px;
        }
      }
      .tipText {
        text-align: center;
        font-size: 12px;
        color: #ff6633;
        line-height: 18px;
      }
      .button {
        width: 200px;
        margin: 18px auto 0;
        button {
          width: 100%;
        }
      }
    }
  }
</style>
