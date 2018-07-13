<template>
  <div class="OB">
    <departmentCaption>部门列表</departmentCaption>
    <div class="container">
      <div class="search-condition">
        <el-form :inline="true" :model="search" class="demo-form-inline">
          <el-form-item>
            <div class="lable">OB管理</div>
            <el-select v-model="search.type" placeholder="条件">
              <el-option v-for="(item,index) in typeOptions" :key="index" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              placeholder="请输入要搜索的关键词"
              prefix-icon="el-icon-search"
              v-model="search.keywords">
            </el-input>
          </el-form-item>
          <div class="form-buttons">
            <el-button type="warning" plain @click="searchFunc">搜索</el-button>
            <el-button type="warning" plain @click="resetFunc">重置</el-button>
            <el-button type="warning" plain @click="addOB">添加OB</el-button>
          </div>
        </el-form>
      </div>

      <div class="data-table">
        <el-table
          ref="multipleTable"
          :data="tableData"
          height="100%"
          tooltip-effect="light"
          style="width: 100%"
          :header-cell-style="setHeaderStyle">
          <el-table-column prop="area" label="地区" align="center" width="150px"></el-table-column>
          <el-table-column prop="IPaddress" label="OB IP地址" align="center"></el-table-column>
          <el-table-column prop="user" label="人员｜工号" align="center">
            <template slot-scope="scope">
              <div class="userInfor">
                <span>{{scope.row.user.userName}}</span>|<span>{{scope.row.user.userID}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="remark" label="备注" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <div class="operation">
                <span class="delete">删除</span>|<span class="modify">修改</span>|<span class="reset">重置密码</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--分页-->
      <div class="page">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="100"
          layout="prev, pager, next, jumper"
          :total="1000">
        </el-pagination>
      </div>

      <!--添加/修改OB-->
      <el-dialog title="" :visible.sync="dialogAddOBVisible" width="35%" custom-class="dialog" center>
        <div slot="title" class="addOBTitle">添加／修改OB</div>
        <div class="dialog-form">
          <el-form :model="addOBData">
            <el-form-item label="地区：" :label-width="formLabelWidth">
              <el-select v-model="addOBData.area" placeholder="地区">
                <el-option v-for="(item,index) in typeOptions" :key="index" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="IP地址：" :label-width="formLabelWidth">
              <el-input type="input" v-model="addOBData.IPaddress"></el-input>
            </el-form-item>
            <el-form-item label="员工工号：" :label-width="formLabelWidth">
              <el-input type="input" v-model="addOBData.staffID"></el-input>
            </el-form-item>
            <el-form-item label="备注：" :label-width="formLabelWidth">
              <el-input type="textarea" v-model="addOBData.remark"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="warning" @click="submitFunc">提 交</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import departmentCaption from "@/components/caption/dcaption"

  export default {
    name: "OB",
    data() {
      return {
        currentPage: 2,         //当前分页
        search: {               //搜索条件
          type: "",
          keyword: ''
        },
        typeOptions: ['花园坊A3', '花园坊A4', '花园坊A5', '成都', '北京', '重庆', '其它'],
        tableData: [            //表单数据
          {
            area: '花园坊A3',
            IPaddress: '11.22.33.44:5566',
            user: {
              userName: "顺哥",
              userID: 3589,
            },
            remark: "我是最帅最帅的"
          },
          {
            area: '花园坊A4',
            IPaddress: '11.22.33.44:5566',
            user: {
              userName: "婷姐",
              userID: 3590,
            },
            remark: "我是最美最美的"
          },
          {
            area: '花园坊A3',
            IPaddress: '11.22.33.44:5566',
            user: {
              userName: "丽姐儿",
              userID: 3591,
            },
            remark: "我要减肥减肥"
          },
          {
            area: '重庆',
            IPaddress: '11.22.33.44:5566',
            user: {
              userName: "小唐",
              userID: 3599,
            },
            remark: "呵呵哒！我爱打王者荣耀，但是我很菜很菜很菜！求大神带飞..."
          }
        ],
        dialogAddOBVisible: false,    //添加OB对话框是否显示
        formLabelWidth: '120px',     //label宽度
        addOBData: {                 //添加OB数据
          area: '',
          IPaddress: '',
          staffID: '',
          remark: ""
        }
      }
    },
    methods: {
      setHeaderStyle: function () {
        /**设置表头样式*/
        return {"fontSize": "16px", "background": "#f9f9f9"}
      },
      searchFunc: function () {
        /**搜索*/
        console.log('开始搜索');
      },
      resetFunc: function () {
        /**重置搜索条件*/
        for (var prop in this.search) {
          this.search[prop] = '';
        }
      },
      addOB: function () {
        this.dialogAddOBVisible=true;
      },
      submitFunc:function(){
        if(this.addOBData.area==''){
          this.showErrorTip('请选择地区');
          return false;
        }else if(this.addOBData.IPaddress==''){
          this.showErrorTip('请输入IP地址');
          return false;
        }else if(this.addOBData.staffID==''){
          this.showErrorTip('请输入员工工号');
          return false;
        }else if(!/^\d+$/.test(this.addOBData.staffID)){
          this.showErrorTip('工号必须为数字');
          return false;
        }else{
          this.showSuccessTip('OB添加成功！');
        }
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
      showErrorTip: function (message) {
        this.$message({
          showClose: true,
          message: message,
          type: 'error'
        });
      },
      showSuccessTip: function (message) {
        this.$message({
          showClose: true,
          message: message,
          type: 'success'
        });
      }
    },
    components: {
      departmentCaption
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/scss/layout";

  .OB {
    @include fullScreen;
    .container {
      padding-left: 90px;
      padding-right: 50px;
      height: 100%;
      .search-condition {
        padding: 15px 0;
      }
      .data-table {
        height: 80%;
        min-height: 80%;
        background: #ffffff;
        box-shadow: 0 0 10px #dddddd;
        border-radius: 5px;
      }
      .el-form-item {
        margin-bottom: 0;
      }
      .demo-form-inline {
        display: flex;
        align-items: center;
        .el-form-item {
          .lable {
            float: left;
            margin-right: 10px;
            font-size: 16px;
            font-weight: bold;
            color: #333333;
          }
          .el-select {
            width: 120px;
          }
        }
        .form-buttons {
          width: 40%;
        }
      }
      .data-table {
        background: #ffffff;
        box-shadow: 0 0 10px #dddddd;
        border-radius: 5px;
        .userInfor {
          color: #333333;
          span {
            padding: 0 3px;
          }
        }
        .operation {
          font-size: 14px;
          line-height: 20px;
          color: #ff6633;
          span {
            padding: 0 3px;
            cursor: pointer;
          }
        }
      }
      .page {
        margin-top: 20px;
        text-align: center;
      }
      .dialog {
        .addOBTitle {
          padding: 20px 0;
          font-size: 20px;
          color: #333333;
          text-align: center;
        }
        .el-dialog__header {
          padding: 0 !important;
        }
        .dialog-footer {
          width: 200px;
          margin: 0 auto;
          button {
            width: 100%;
            font-size: 16px;
          }
        }
        .el-form-item {
          margin-bottom: 20px;
          &:last-child{
            margin-bottom: 0;
          }
        }
        .el-select {
          display: block;
          width: 100%;
        }
        .dialog-form {
          width: 420px;
          margin: 0 auto;
        }
      }
    }
  }
</style>
