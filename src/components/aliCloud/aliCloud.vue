<template>
  <div class="cloud">
    <departmentCaption>部门列表</departmentCaption>
    <div class="container">
      <div class="search-condition">
        <el-form :inline="true" :model="search" class="demo-form-inline">
          <el-form-item>
            <div class="lable">员工当前位置及任务进度</div>
            <el-select v-model="search.type" placeholder="地区">
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
          <el-table-column prop="number" label="编号" align="center" width="60px">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.checked"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="title" label="标题/域名" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="IP" label="IP" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="ftpUser" label="ftp用户名" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="ftpPassword" label="ftp密码" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="column" label="目录" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="director" label="负责人" align="center"></el-table-column>
          <el-table-column show-overflow-tooltip prop="email" label="邮箱" align="center"></el-table-column>
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
    </div>
  </div>
</template>

<script>
  import departmentCaption from "@/components/caption/dcaption"

  export default {
    name: "aliCloud",
    data() {
      return {
        currentPage: 2,         //当前分页
        search: {               //搜索条件
          type: "",
          keyword: ''
        },
        typeOptions: ['标题/域名', 'IP', 'ftp用户名', 'ftp密码', '负责人'],
        tableData: [            //表单数据
          {
            checked: false,
            title: "acca.gaodun.cn",
            IP: '196.21.5.205',
            ftpUser: "abel.tang",
            ftpPassword: "1123456",
            column: "./index.html",
            director: 'abel.tang',
            email: 'abel.tang@gaodun.cn'
          },
          {
            checked: true,
            title: "cma.gaodun.cn",
            IP: '196.21.5.205',
            ftpUser: "abel.tang",
            ftpPassword: "1123456",
            column: "./public.html",
            director: 'abel.tang',
            email: 'abel.tang@gaodun.cn'
          },
          {
            checked: false,
            title: "www.gaodun.cn",
            IP: '196.21.5.205',
            ftpUser: "abel.tang",
            ftpPassword: "1123456",
            column: "./index.html",
            director: 'abel.tang',
            email: 'abel.tang@gaodun.cn'
          }
        ]
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
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      }
    },
    components: {
      departmentCaption
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/scss/layout";

  .cloud {
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
    }
  }
</style>
