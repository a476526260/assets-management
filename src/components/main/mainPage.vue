<template>
  <transition name="fade">
    <div class="appMain">
      <div class="main-header">
        <div class="title-txt">IT部资产管理系统</div>
        <div class="about-user">
          <span class="modify" @click="modifyPassword">密码修改</span>
          <span class="sign-out" @click="showDialog">退出登录</span>
        </div>
      </div>
      <div class="main-container" ref="container">
        <el-container style=" height: 100%;">
          <el-aside class="aside" width="14%">
            <el-menu :default-active="$route.path" router ref="elMenu" @open="handleOpen" class="el-menu-vertical-demo"
                     background-color="#253340" text-color="#edf2fc" active-text-color="#f0aa14">
              <el-submenu index="1">
                <template slot="title">
                  <i class="title-icon iconfont icon-shouye"></i><span>首页</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="/mainPage/dailyTask">
                    <i class="item-icon iconfont icon-renwumingcheng"></i><span>日常任务</span>
                  </el-menu-item>
                  <el-menu-item index="/mainPage/order">
                    <i class="item-icon iconfont icon-jilu"></i><span>工单系统</span>
                  </el-menu-item>
                  <el-menu-item index="/mainPage/require">
                    <i class="item-icon iconfont icon-xuqiudengji"></i><span>项目需求管理</span>
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>

              <el-submenu index="2">
                <template slot="title">
                  <i class="title-icon iconfont icon-dv_diannao"></i><span>管理中心</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="/mainPage/member">
                    <i class="item-icon iconfont icon-renyuanguanli1"></i><span>人员管理</span>
                  </el-menu-item>
                  <el-menu-item index="/mainPage/asset">
                    <i class="item-icon iconfont icon-asset"></i><span>资产管理</span>
                  </el-menu-item>
                  <el-menu-item index="/mainPage/aliCloud">
                    <i class="item-icon iconfont icon-wangluoxitong"></i><span>阿里云资产</span>
                  </el-menu-item>
                  <el-menu-item index="/mainPage/OB">
                    <i class="item-icon iconfont icon-yunweiguanli"></i><span>OB管理</span>
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>

              <el-submenu index="3">
                <template slot="title">
                  <i class="title-icon iconfont icon-shezhi"></i><span>系统管理</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="/mainPage/modify">
                    <i class="item-icon iconfont icon-xiugaimima"></i><span>修改密码</span>
                  </el-menu-item>
                  <el-menu-item index="/mainPage/modelData">
                    <i class="item-icon iconfont icon-shuju"></i><span>模型数据管理</span>
                  </el-menu-item>
                  <el-menu-item index="/mainPage/property">
                    <i class="item-icon iconfont icon-shezhi1"></i><span>属性管理</span>
                  </el-menu-item>
                  <el-menu-item index="/mainPage/department">
                    <i class="item-icon iconfont icon-renyuanguanli"></i><span>部门管理</span>
                  </el-menu-item>
                  <el-menu-item index="/mainPage/administrators">
                    <i class="item-icon iconfont icon-guanliyuanshouye"></i><span>管理员管理</span>
                  </el-menu-item>
                  <el-menu-item index="/mainPage/dictionary">
                    <i class="item-icon iconfont icon-zidian"></i><span>字典</span>
                  </el-menu-item>
                  <el-menu-item index="/mainPage/API">
                    <i class="item-icon iconfont icon-jiekouguanli"></i><span>接口</span>
                  </el-menu-item>
                  <el-menu-item index="/mainPage/log">
                    <i class="item-icon iconfont icon-rizhi"></i><span>操作日志</span>
                  </el-menu-item>
                  <el-menu-item index="" @click="showDialog">
                    <i class="item-icon iconfont icon-tuichu"></i><span>退出</span>
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>
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
    </div>
  </transition>
</template>

<script>


  export default {
    name: "mainPage",
    data() {
      return {
        dialogVisible:false,         //退出登录框是否显示
        navIndex: ["1", "2", "3"]    //左侧导航索引
      }
    },
    props:{
      user:{
        type:String
      }
    },
    mounted() {
      this.$refs.container.style.height = window.innerHeight - 80 + "px";
    },
    methods: {
      showDialog:function(){
        /**显示退出登录提示*/
        this.dialogVisible=true;
      },
      signOut: function () {
        /**退出登录*/
        this.dialogVisible=false;
        this.$router.push("/");
        localStorage.setItem("userName","");
      },
      modifyPassword:function(){
        /**修改密码*/
        var _this = this;
        this.navIndex.forEach(function (v, i) {
          _this.$refs.elMenu.close(v);
        });
        this.$refs.elMenu.open(3);
        this.$router.push("/mainPage/modify");
      },
      handleOpen(key) {
        /**打开当前导航，关闭其他导航*/
        var _this = this;
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
      .el-menu-item:first-child{
        margin-top: -20px;
      }
    }
    .main-header {
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
      .about-user {
        margin: 25px 0;
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
        padding: 0;
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
