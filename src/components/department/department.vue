<template>
  <div class="department">
    <departmentCaption>部门列表</departmentCaption>
    <div class="container">
      <div class="department-title">
        <div class="title-text">部门管理</div>
        <div class="add-department">
          <el-button type="warning" plain @click="addDepartment" size="mini">添加部门</el-button>
        </div>
      </div>

      <div class="department-wrapper">
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
              <span class="modify" @click="modifyDepart(scope)">修改</span>
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
          layout="prev, pager, next, jumper"
          :total="1000">
        </el-pagination>
      </div>
    </div>

    <!--添加-->
    <el-dialog title="添加部门" :visible.sync="dialogAdddepartmentVisible" center width="40%">
      <div class="dialog-title" slot="title">添加部门</div>
      <div class="add-department-form">
        <el-form label-position="left" label-width="60px" :model="addDepartmentData">
          <el-form-item label="名称：">
            <el-input v-model="addDepartmentData.name"></el-input>
          </el-form-item>
          <el-form-item label="别名：">
            <el-input v-model="addDepartmentData.relation"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class='add-button' type="warning" plain @click="adddepartmentFunc">增加</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import departmentCaption from "@/components/caption/dcaption"

  export default {
    name: "department",
    data() {
      return {
        currentPage: 2,                        //当前分页
        tableData: [
          {
            ID: '1',
            name: 'IT部',
            relation: 'it',
          },
          {
            ID: '2',
            name: '网络营销部',
            relation: 'netMarket'
          },
          {
            ID: '3',
            name: '人事部',
            relation: 'personnel'
          },
          {
            ID: '4',
            name: '客服部',
            relation: 'customer'
          }
        ],                      //表单数据
        dialogAdddepartmentVisible: true,       //添加部门对话框是否显示
        addDepartmentData: {
          name: '',
          relation: ''
        }

      }
    },
    methods: {
      addDepartment() {
        console.log('添加部门')
      },
      modifyDepart() {
        console.log()
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
      setHeaderStyle() {
        /**设置表头样式*/
        return {"fontSize": "16px", "background": "#f9f9f9"}
      },
      showErrorTip(message) {
        this.$message({
          showClose: true,
          message: message,
          type: 'error'
        });
      },
      showSuccessTip(message) {
        this.$message({
          showClose: true,
          message: message,
          type: 'success'
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

  .department {
    @include fullScreen;
    .container {
      padding-left: 90px;
      padding-right: 50px;
      height: 100%;
      .department-title {
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
        .add-department {
          float: right;
          margin-right: 20px;
        }
      }
      .department-wrapper {
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
    }
  }
</style>
