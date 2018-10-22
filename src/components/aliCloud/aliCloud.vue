<template>
  <container>
    <div class="search-condition">
      <search :search="search" @searchFunc="searchData">
        <h1 class="search-title" slot="title">FTP管理</h1>
      </search>
      <div class="button-groups">
        <el-button type="warning" plain @click="changeRegion">{{region | rdsTxt}}</el-button>
        <el-button type="warning" plain @click="addInfo">添加FTP</el-button>
      </div>
    </div>

    <div class="data-table">
      <el-table
        ref="multipleTable"
        :data="tableData"
        height="100%"
        tooltip-effect="light"
        v-loading="loading"
        style="width: 100%"
        :header-cell-style="setHeaderStyle">
        <el-table-column show-overflow-tooltip prop="host" label="标题/域名" align="center"></el-table-column>
        <el-table-column show-overflow-tooltip prop="host" label="IP" align="center"></el-table-column>
        <el-table-column show-overflow-tooltip prop="name" label="ftp用户名" align="center"></el-table-column>
        <el-table-column show-overflow-tooltip prop="port" label="端口" align="center"></el-table-column>
        <el-table-column show-overflow-tooltip prop="dir" label="目录" align="center"></el-table-column>
        <el-table-column show-overflow-tooltip prop="uid" label="负责人" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div class="operation">
              <span @click="delInfo(scope.row.id)">删除</span><!--|<span @click="changeInfo(scope.row.id)">修改</span>-->|<span
              @click="resetPassword(scope.row.id)">重置密码</span>
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
        :page-size="pageSize"
        layout="prev, pager, next, total, jumper"
        :total="total">
      </el-pagination>
    </div>

    <!--添加/修改-->
    <el-dialog title="" :visible.sync="dialogModifyVisible" width="35%" custom-class="dialog" center>
      <div slot="title" class="dialogTitle">{{modifyType}}FTP信息</div>
      <div class="dialog-form">
        <el-form :model="ModifyData">
          <el-form-item label="地区：" label-width="120px">
            <el-select v-model="ModifyData.rds" placeholder="地区">
              <el-option label="杭州" value="1"></el-option>
              <el-option label="香港" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="UID：" label-width="120px">
            <el-input type="input" v-model="ModifyData.uid"></el-input>
          </el-form-item>
          <el-form-item label="用户名：" label-width="120px">
            <el-input type="input" v-model="ModifyData.name"></el-input>
          </el-form-item>
          <el-form-item label="密码：" label-width="120px">
            <el-input type="input" v-model="ModifyData.password"></el-input>
          </el-form-item>
          <el-form-item label="目录：" label-width="120px">
            <el-input type="input" v-model="ModifyData.dir"></el-input>
          </el-form-item>
          <el-form-item label="外网IP：" label-width="120px">
            <el-input type="input" v-model="ModifyData.host"></el-input>
          </el-form-item>
          <el-form-item label="内网IP：" label-width="120px">
            <el-input type="input" v-model="ModifyData.lanhost"></el-input>
          </el-form-item>
          <el-form-item label="类型编号：" label-width="120px">
            <el-input type="input" v-model="ModifyData.usertype"></el-input>
          </el-form-item>
          <el-form-item label="端口号：" label-width="120px">
            <el-input type="input" v-model="ModifyData.port"></el-input>
          </el-form-item>
          <el-form-item label="ID：" label-width="120px" v-if="modifyType==='修改'">
            <el-input type="input" v-model="ModifyData.id"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="warning" @click="modifyFunc">{{modifyType}}FTP</el-button>
      </div>
    </el-dialog>
  </container>
</template>

<script>
  import * as ajax from "../../assets/script/ajaxApi"
  import search from '@/components/search/search'
  import tipMixin from "../../assets/script/mixin"
  import container from '@/components/container/container'

  export default {
    name: "aliCloud",
    mixins: [tipMixin],
    data() {
      return {
        currentPage: 1,         //当前分页
        pageSize: 14,
        total: 0,
        search: [
          {
            key: '',
            options: ['标题/域名', 'IP', 'ftp用户名', '负责人'],
            placeholder: '请选择搜索方式',
            type: 'select'
          },
          {
            key: '',
            placeholder: '请输入要搜索的关键词',
            type: 'input'
          },
        ],
        tableData: [],
        region: 1,
        ModifyData: {
          rds: '',
          uid: '',
          name: '',
          password: '',
          dir: '',
          host: '',
          lanhost: '',
          usertype: '',
          port: '',
        },
        dialogModifyVisible: false,
        modifyType: '',
        modifyID: '',
        dialogResetVisible: false,
        resetPasswordData: {
          name: '',
          password: '',
        },
        loading:false,
      }
    },
    mounted() {
      this.$nextTick(function () {
        this.getFtpList(this.currentPage);
      })
    },
    methods: {
      searchData: function (e) {
        /**搜索*/
        this.$ajax.post(this.host + '', {
          value1: e[0],
          value2: e[1],
          value3: e[2],
          value4: e[3],
          token: localStorage.getItem('token')
        }).then(function (response) {

        }).catch(function (response) {

        })
      },
      getFtpList(page) {
        /*获取信息*/
        this.loading=true;
        ajax.fetch_get(this.host + '/api/ftp', {
          rds: this.region,
          page: page,
          listRows: this.pageSize,
        }).then(res => {
          if (res.data.status.code === 200) {
            this.loading=false;
            this.tableData = res.data.data;
            this.total = res.data.ext.total;
          } else {
            this.errorTip(res.data.status.info);
          }
        }).catch(res => {
          console.log(res);
        })
      },
      modifyFunc() {
        /*修改信息*/
        if (this.modifyType === '添加') {
          ajax.fetch_post(this.host + '/api/ftp', this.ModifyData).then(res => {
            if (res.data.status.code === 200) {
              if (this.ModifyData.rds === '1') {
                this.region = 1
              } else if (this.ModifyData.rds === '2') {
                this.region = 2
              }
              this.successTip('FTP账号添加成功！');
              this.getFtpList(1);
              this.dialogModifyVisible = false;
            } else {
              this.errorTip(res.data.status.info);
            }
          }).catch(res => {
            console.log(res);
          });
        } else if (this.modifyType === '修改') {
          ajax.fetch_put(this.host + '/api/ftp/' + this.modifyID, this.ModifyData).then(res => {
            if (res.data.status.code === 200) {
              this.successTip('FTP账号信息修改成功！');
              this.getFtpList(this.currentPage);
              this.dialogModifyVisible = false;
            } else {
              this.errorTip(res.data.status.info);
            }
          }).catch(res => {
            console.log(res);
          })
        }
      },
      delInfo(id) {
        this.modifyID = id;
        this.$confirm('确定删除本条ftp信息吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ajax.fetch_del(this.host + "/api/ftp/" + id, {
            id: id,
            rds: this.region,
          }).then(res => {
            console.log(res);
            if (res.data.status.code === 200) {
              this.successTip("ftp删除成功！");
              let page = ((this.total - 1) % this.pageSize === 0 && this.currentPage === (this.total - 1) / this.pageSize + 1) ? this.currentPage - 1 : this.currentPage;
              this.getFtpList(page);
            } else {
              this.errorTip(res.data.status.info);
            }
          }).catch(res => {
            console.log(res);
          })
        }).catch(() => {
          this.errorTip("取消删除");
        });
      },
      addInfo() {
        this.clearObjValue(this.ModifyData);
        this.dialogModifyVisible = true;
        this.modifyType = '添加';
      },
      changeInfo(id) {
        this.dialogModifyVisible = true;
        this.modifyType = '修改';
        this.modifyID = id;
        this.clearObjValue(this.ModifyData);
        ajax.fetch_get(this.host + '/api/ftp/' + id).then(res => {
          console.log(res);
          if (res.data.status.code === 200) {
            this.ModifyData.id = res.data.data.id;
            for (let prop in this.ModifyData) {
              if (prop === 'rds') {
                this.ModifyData[prop] = this.region === 1 ? '杭州' : '香港'
              } else {
                this.ModifyData[prop] = res.data.data[prop];
              }
            }
          } else {
            this.errorTip(res.data.status.info);
          }
        }).catch(error => {
          throw error;
        });
      },
      resetPassword(id) {
        this.modifyID = id;
        ajax.fetch_post(this.host+'/api/ftp/resetPwd',{
          rds:this.region,
          id:this.modifyID,
        }).then(res=>{
          if(res.data.status.code===200){
            this.$notify({
              title:'密码重置成功！',
              message:'新密码为：'+res.data.data.password,
              duration:0,
              type: 'success',
            })
          }else{
            this.errorTip(res.data.status.info);
          }
        }).catch(error=>{
          throw error;
        })
      },
      changeRegion() {
        this.region = this.region === 1 ? 2 : 1;
        this.getFtpList(1);
      },
      clearObjValue(obj) {
        for (let prop in obj) {
          obj[prop] = '';
        }
      },
      setHeaderStyle: function () {
        /**设置表头样式*/
        return {"fontSize": "16px", "background": "#f9f9f9"}
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getFtpList(this.currentPage);
      },

    },
    components: {
      search,
      container,
    }
  }
</script>

<style lang="scss" scoped>
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

  .dialogTitle {
    font-size: 20px;
    color: #333;
    text-align: center;
  }

  .dialog-form {
    width: 80%;
    margin: 0 auto;
    .el-form-item {
      margin-bottom: 10px;
    }
  }
</style>
