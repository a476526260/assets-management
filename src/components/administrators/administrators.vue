<template>
  <container>
    <div class="administrator-title">
      <div class="title-text">管理员管理</div>
      <div class="button-groups">
        <el-button type="warning" plain @click="modifyAdmin('add','')" size="mini">增加管理员</el-button>
        <el-button type="warning" plain @click="modifyAdmin('add','')" size="mini">管理员等级管理</el-button>
      </div>
    </div>

    <div class="adminstrator-wrapper">
      <el-table
        :data="tableData"
        height="100%"
        style="width: 100%"
        :header-cell-style="setHeaderStyle">
        <el-table-column prop="ID" label="ID" align="center">
        </el-table-column>
        <el-table-column prop="name" label="姓名" align="center">
        </el-table-column>
        <el-table-column prop="loginName" label="登录名" align="center">
        </el-table-column>
        <el-table-column prop="level" label="等级" align="center">
        </el-table-column>
        <el-table-column prop="tel" label="电话" align="center">
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === '正常' ? '' : 'danger'" disable-transitions  v-if="scope.row.status">
              {{scope.row.status}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastLogin" label="最后登录" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <span class="modify" @click="modifyAdmin('modify',scope)">修改</span>
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
        layout="prev, pager, next, total, jumper"
        :total="1000">
      </el-pagination>
    </div>

    <!--增加/修改管理员-->
    <el-dialog title="增加/修改管理员" :visible.sync="dialogAdminVisible" center width="35%">
      <div class="dialog-title" slot="title"><span v-if="modifyType==1">修改</span><span v-else>增加</span>管理员</div>
      <div class="modify-admin-form">
        <el-form :inline="true" :model="modifyData" class="demo-form-inline">
          <div class="el-form-block">
            <el-form-item label="姓名：">
              <el-input v-model="modifyData.name"></el-input>
            </el-form-item>
            <el-form-item label="登录名：">
              <el-input v-model="modifyData.loginName"></el-input>
            </el-form-item>
          </div>
          <div class="el-form-block">
            <el-form-item label="等级：">
              <el-select v-model="modifyData.level" placeholder="等级">
                <el-option label="超级管理员" value="超级管理员"></el-option>
                <el-option label="设备管理" value="设备管理"></el-option>
                <el-option label="人员管理" value="人员管理"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="　状态：">
              <el-select v-model="modifyData.status" placeholder="选择状态">
                <el-option label="正常" value="正常"></el-option>
                <el-option label="禁用" value="禁用"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="el-form-block">
            <el-form-item label="电话：">
              <el-input v-model="modifyData.tel"></el-input>
            </el-form-item>
            <el-form-item label="　备注：">
              <el-input v-model="modifyData.remark"></el-input>
            </el-form-item>
          </div>
          <div class="button-submit">
            <el-button type="warning" plain @click="onsubmitFunc">提交</el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>
  </container>
</template>

<script>
  import container from '@/components/container/container'
  import tipMixin from "../../assets/script/mixin"
  export default {
    name: "administrators",
    mixins:[tipMixin],
    data() {
      return {
        currentPage: 1,            //分页
        tableData: [               //数据
          {
            ID: '1',
            name: '超级管理',
            loginName: 'admin',
            level: '超级管理员',
            tel: '110',
            status: '正常',
            lastLogin: '2018-05-04 16:47:25',
            remark: '我是超级管理员，你能拿我怎么滴！？？'
          },
          {
            ID: '2',
            name: '何清',
            loginName: 'jack.he',
            level: '人员管理',
            tel: '119',
            status: '正常',
            lastLogin: '2018-05-04 16:03:25',
            remark: ''
          },
          {
            ID: '3',
            name: '张三',
            loginName: 'mr.zhang',
            level: '设备管理',
            tel: '114',
            status: '禁用',
            lastLogin: '2018-05-04 16:43:25',
            remark: ''
          },
          {
            ID: '4',
            name: '唐唐',
            loginName: 'abel.tang',
            level: '人员管理',
            tel: '13056263698',
            status: '正常',
            lastLogin: '2018-07-15 16:40:25',
            remark: ''
          }
        ],
        dialogAdminVisible: false,
        modifyType: 1,              //修改-1，添加-2
        modifydataIndex: 1,
        modifyData: {
          name: '',
          loginName: '',
          level: '',
          status: '',
          tel: '',
          remark: ''
        }
      }
    },
    methods: {
      adminLevelFunc: function () {
        console.log("管理员等级管理")
      },
      onsubmitFunc: function () {
        if (this.modifyType === 1) {
          //修改数据
          for (let prop in this.tableData[this.modifydataIndex]) {
            if (prop === 'ID' || prop === 'lastLogin') {
              continue;
            } else {
              this.tableData[this.modifydataIndex][prop] = this.modifyData[prop]
            }
          }
          this.dialogAdminVisible = false;
        } else if (this.modifyType === 2) {
          //添加数据
          this.tableData.push({
            ID: this.tableData.length+1,
            name: this.modifyData.name,
            loginName: this.modifyData.loginName,
            level: this.modifyData.level,
            tel: this.modifyData.tel,
            status: this.modifyData.status,
            lastLogin: Date.now(),
            remark: '我是备注'
          });
          this.dialogAdminVisible = false;
        }
      },
      modifyAdmin: function (type, data) {
        /**修改管理员数据*/
        this.dialogAdminVisible = true;
        if (type === 'modify') {
          this.modifyType = 1;
          this.modifydataIndex = data.$index;
          for (let prop in this.modifyData) {
            this.modifyData[prop] = this.tableData[this.modifydataIndex][prop];
          }
        } else if (type === 'add') {
          this.modifyType = 2;
          //清空数据
          for (let prop in this.modifyData) {
            this.modifyData[prop] = '';
          }
        }
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
      setHeaderStyle: function () {
        /**设置表头样式*/
        return {"fontSize": "16px", "background": "#f9f9f9"}
      }
    },
    components: {
      container
    }
  }
</script>

<style lang="scss">
  .administrator-title {
    padding: 20px 0;
    overflow: hidden;
    .title-text {
      float: left;
      line-height: 30px;
      font-size: 16px;
      color: #333333;
    }
    .button-groups {
      float: right;
      margin-right: 20px;
    }
  }
  .adminstrator-wrapper {
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
  .dialog-title {
    font-size: 20px;
  }
  .modify-admin-form {
    .el-form-block {
      display: flex;
      justify-content: space-between;
      overflow: hidden;
      .el-form-item {
        width: 48%;
        margin: 0 0 20px;
        display: flex;
        .el-form-item__content {
          flex: 1;
        }
        .el-select {
          width: 100%;
        }
      }
    }
    .button-submit {
      text-align: center;
      button {
        width: 120px;
      }
    }
  }
</style>
