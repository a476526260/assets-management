<template>
  <container>
    <div class="user-title">
      <div class="title-text">用户组</div>
      <div class="add-user">
        <el-button type="warning" plain @click="" size="mini">添加</el-button>
      </div>
    </div>
    <div class="user-wrapper">
      <el-table
        :data="tableData"
        height="100%"
        style="width: 100%"
        :header-cell-style="setHeaderStyle">
        <el-table-column prop="ID" label="ID" align="center">
        </el-table-column>
        <el-table-column prop="name" label="部门名称" align="center">
        </el-table-column>
        <el-table-column prop="relation" label="部门别名" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <span class="modify" @click="">修改</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="100"
        layout="prev, pager, next, total, jumper"
        :total="1000">
      </el-pagination>
    </div>
  </container>
</template>

<script>
  export default {
    name: "user",
    data(){
      return {
        currentPage:1,
        tableData:[
        ]
      }
    },
    methods:{
      handleSizeChange:function (val) {

      },
      handleCurrentChange:function (val) {

      }
    }
  }
</script>

<style lang="scss" scoped>
  .user-title {
    padding: 20px 0;
    overflow: hidden;
    .title-text {
      float: left;
      line-height: 30px;
      font-size: 16px;
      color: #333333;
      span {
        margin-left: 20px;
        font-size: 12px;
        color: #ff6633;
      }
    }
    .add-user {
      float: right;
      margin-right: 20px;
    }
  }
  .user-wrapper {
    height: 80%;
    min-height: 80%;
    background: #ffffff;
    box-shadow: 0 0 10px #dddddd;
    border-radius: 5px;
    .modify {
      display: inline-block;
      padding: 5px 10px;
      font-size: 14px;
      color: #ff6633;
      cursor: pointer;
    }
  }
  .page {
    margin-top: 20px;
    text-align: center;
  }
</style>
