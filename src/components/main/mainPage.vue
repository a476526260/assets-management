<template>
  <transition name="fade">
    <div class="appMain">
      <div class="main-header">
        <div class="title-txt">IT部资产管理系统</div>
        <div class="about-user">
          <span class="modify">密码修改</span>
          <span class="sign-out" @click="signOut">退出登录</span>
        </div>
      </div>
      <div class="main-container" ref="container">
        <el-container style=" height: 100%;">
          <el-aside class="aside" width="340px">
            <el-menu :default-active="$route.path" router ref="elMenu" @open="handleOpen" class="el-menu-vertical-demo"
                     background-color="#253340" text-color="#edf2fc" active-text-color="#f0aa14">
              <el-submenu index="1">
                <template slot="title">
                  <i class="title-icon iconfont icon-shouye"></i><span>首页</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="/dailyTask">
                    <i class="item-icon iconfont icon-renwumingcheng"></i><span>日常任务</span>
                  </el-menu-item>
                  <el-menu-item index="/order">
                    <i class="item-icon iconfont icon-jilu"></i><span>工单系统</span>
                  </el-menu-item>
                  <el-menu-item index="/require">
                    <i class="item-icon iconfont icon-xuqiudengji"></i><span>项目需求管理</span>
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>

              <el-submenu index="2">
                <template slot="title">
                  <i class="title-icon iconfont icon-dv_diannao"></i><span>管理中心</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="/member">
                    <i class="item-icon iconfont icon-renyuanguanli1"></i><span>人员管理</span>
                  </el-menu-item>
                  <el-menu-item index="/asset">
                    <i class="item-icon iconfont icon-asset"></i><span>资产管理</span>
                  </el-menu-item>
                  <el-menu-item index="/aliCloud">
                    <i class="item-icon iconfont icon-wangluoxitong"></i><span>阿里云资产</span>
                  </el-menu-item>
                  <el-menu-item index="/OB">
                    <i class="item-icon iconfont icon-yunweiguanli"></i><span>OB管理</span>
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>

              <el-submenu index="3">
                <template slot="title">
                  <i class="title-icon iconfont icon-shezhi"></i><span>系统管理</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="/modify">
                    <i class="item-icon iconfont icon-xiugaimima"></i><span>修改密码</span>
                  </el-menu-item>
                  <el-menu-item index="/modelData">
                    <i class="item-icon iconfont icon-shuju"></i><span>模型数据管理</span>
                  </el-menu-item>
                  <el-menu-item index="/property">
                    <i class="item-icon iconfont icon-shezhi1"></i><span>属性管理</span>
                  </el-menu-item>
                  <el-menu-item index="/department">
                    <i class="item-icon iconfont icon-renyuanguanli"></i><span>部门管理</span>
                  </el-menu-item>
                  <el-menu-item index="/administrators">
                    <i class="item-icon iconfont icon-guanliyuanshouye"></i><span>管理员管理</span>
                  </el-menu-item>
                  <el-menu-item index="/dictionary">
                    <i class="item-icon iconfont icon-zidian"></i><span>字典</span>
                  </el-menu-item>
                  <el-menu-item index="/API">
                    <i class="item-icon iconfont icon-jiekouguanli"></i><span>接口</span>
                  </el-menu-item>
                  <el-menu-item index="/log">
                    <i class="item-icon iconfont icon-rizhi"></i><span>操作日志</span>
                  </el-menu-item>
                  <el-menu-item index="" @click="signOut">
                    <i class="item-icon iconfont icon-tuichu"></i><span>退出</span>
                  </el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </el-menu>
          </el-aside>
          <el-main class="main">
            <keep-alive>
              <router-view name="default"></router-view>
            </keep-alive>
          </el-main>
        </el-container>
      </div>
    </div>
  </transition>
</template>

<script>
  import dailyTask from '../dailyTask/dailyTask';

  export default {
    name: "mainPage",
    data() {
      return {
        navIndex: ["1", "2", "3"]
      }
    },
    mounted() {
      this.$refs.container.style.height = window.innerHeight - 80 + "px";
    },
    methods: {
      signOut: function () {
        //this.$router.push("/")
        this.$emit("signOut", event.target)
      },
      handleOpen(key, keyPath) {
        var _this = this;
        this.navIndex.forEach(function (v, i) {
          _this.$refs.elMenu.close(v);
        });
        this.$refs.elMenu.open(key);
      }
    },
    components:{

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
    .el-menu-item-group__title{
      padding: 0!important;
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
        padding-right: 35px;
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
      .el-main{
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
