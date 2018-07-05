<template>
  <div class="modify">
    <department-caption></department-caption>
    <div class="container">
      <h2 class="modify-title">修改密码</h2>
      <div class="modify-box">
        <div class="box-card">
          <div class="card-header">
            <span>{{userName}} 密码修改</span>
          </div>

          <el-form label-position="left" label-width="60px" :model="modifyData">
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
      </div>
    </div>
  </div>
</template>

<script>
  import departmentCaption from "@/components/caption/dcaption"
  import axios from 'axios';

  export default {
    name: "modify",
    data() {
      return {
        userName: localStorage.getItem("userName"),  //用户名
        modifyData: {                                //密码相关
          oldPassword: "",
          newPassword: "",
          newPassword2: ""
        },
        password: ''                                 //保存用户原密码
      }
    },
    props: {
      user: {
        type: String,
      }
    },
    mounted: function () {
      var _this = this;
      this.$nextTick(function () {
        axios.get('/api/modifyPassword').then(function (response) {
          if (response.status == '200') {
            _this.password = response.data.data.password;
          }
        }).catch(function (response) {
          console.log(_this);
        });
      })
    },
    methods: {
      modifyPassword: function () {
        var _this=this;
        if (this.modifyData.oldPassword == '') {
          this.errorTip("旧密码不能为空！");
          return false;
        } else if (this.modifyData.oldPassword !== this.password) {
          this.errorTip("旧密码不正确！");
          return false;
        } else if ((!(this.modifyData.newPassword.length > 5 && this.modifyData.newPassword.length < 17)) || (!(/[a-zA-Z]+(?=\d+)|\d+(?=[a-zA-Z]+)/).test(this.modifyData.newPassword))) {
          this.errorTip("密码格式不正确！");
          return false;
        } else if (this.modifyData.newPassword != this.modifyData.newPassword2) {
          this.errorTip("新密码两次输入不一致！");
          return false;
        }else{
          axios.get('/api/modifyPassword').then(function (response) {
            if (response.status == '200') {
              _this.$message({
                showClose: true,
                message: '密码修改成功！',
                type: 'success'
              });
              _this.modifyData.oldPassword='';
              _this.modifyData.newPassword='';
              _this.modifyData.newPassword2='';
            }
          }).catch(function (response) {
            console.log(_this);
          });
        }
      },
      errorTip: function (val) {
        this.$message({
          showClose: true,
          message: val,
          type: 'error'
        });
      },
    },
    components: {
      departmentCaption
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/scss/layout";

  .modify {
    @include fullScreen;
    .container {
      height: 100%;
      padding-left: 90px;
      padding-right: 50px;
      .modify-title {
        padding: 20px 0;
        font-size: 16px;
        color: #333333;
        line-height: 22px;
      }
      .modify-box {
        position: relative;
        height: 88%;
        background: #ffffff;
        border: 1px solid #e0e0e0;
        border-radius: 5px;
        box-shadow: 0 0 10px #dddddd;
        .box-card {
          padding-bottom: 36px;
          border: 1px solid #e0e0e0;
          border-radius: 5px;
          box-shadow: 0 0 10px #dddddd;
          text-align: center;
          @include layout-center(absolute);
          .card-header {
            height: 60px;
            font-size: 20px;
            color: #333333;
            line-height: 60px;
            background: #f9f9f9;
          }
          .el-form {
            margin-top: 40px;
            padding: 0 115px;
            .el-input {
              width: 360px;
            }
          }
          .tipText {
            text-align: left;
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
    }
  }
</style>
