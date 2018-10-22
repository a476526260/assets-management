<template>
  <container>
    <div class="search-condition">
      <search :search="search" @searchFunc="searchData">
        <h1 class="search-title" slot="title">OB管理</h1>
      </search>
      <div class="button-groups">
        <el-button type="warning" plain @click="addOB">添加OB</el-button>
      </div>
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
        <el-table-column prop="ip" label="OB IP地址" align="center"></el-table-column>
        <el-table-column prop="gonghao" label="工号" align="center">
          <template slot-scope="scope">
            <div class="userInfor">
              <span>{{scope.row.gonghao}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="remark" label="备注" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div class="operation">
              <span class="modify" @click="modify(scope.row.id)">修改</span>|<span class="delete"
                                                                                 @click="del(scope.row.id)">删除</span>
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
        :page-size="pageNum"
        layout="prev, pager, next, total, jumper"
        :total="total">
      </el-pagination>
    </div>
    <!--添加/修改OB-->
    <el-dialog title="" :visible.sync="dialogAddOBVisible" width="35%" custom-class="dialog" center>
      <div slot="title" class="addOBTitle">{{operationText}}OB</div>
      <div class="dialog-form">
        <el-form :model="operationData">
          <el-form-item label="地区：" :label-width="formLabelWidth">
            <el-select v-model="operationData.area" placeholder="地区">
              <el-option v-for="(item,index) in typeOptions" :key="index" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="IP地址：" :label-width="formLabelWidth">
            <el-input type="input" v-model="operationData.ip"></el-input>
          </el-form-item>
          <el-form-item label="员工工号：" :label-width="formLabelWidth">
            <el-input type="input" v-model="operationData.gonghao"></el-input>
          </el-form-item>
          <el-form-item label="备注：" :label-width="formLabelWidth">
            <el-input type="textarea" v-model="operationData.remark"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="warning" @click="submitFunc">提 交</el-button>
      </div>
    </el-dialog>
  </container>
</template>

<script>
  import * as ajax from "../../assets/script/ajaxApi"
  import search from '@/components/search/search'
  import container from '@/components/container/container'
  import tipMixin from "../../assets/script/mixin"
  export default {
    name: "OB",
    mixins:[tipMixin],
    data() {
      return {
        currentPage: 1,         //当前分页
        pageNum: 14,
        total: 0,
        operationText: '',
        operationDataID: 0,
        search: [
          {
            key: '',
            options: ['花园坊A3', '花园坊A4', '花园坊A5', '成都', '北京', '重庆', '其它'],
            placeholder: '精确搜索条件',
            type: 'select'
          },
          {
            key: '',
            placeholder: '请输入要搜索的关键词',
            type: 'input'
          },
        ],
        typeOptions: ['花园坊A3', '花园坊A4', '花园坊A5', '成都', '北京', '重庆', '其它'],
        tableData: [],
        dialogAddOBVisible: false,    //添加OB对话框是否显示
        formLabelWidth: '120px',     //label宽度
        operationData: {                 //添加OB数据
          area: '',
          ip: '',
          gonghao: '',
          remark: ""
        }
      }
    },
    mounted() {
      this.$nextTick(function () {
        this.getOBList(this.currentPage);
      })
    },
    methods: {
      searchData: function (data) {
        /**搜索*/
        ajax.fetch_post(this.host + '/api/ob', {
          area: data[0],
          q: data[1],
        }).then(res => {
          console.log(res);
        }).catch(res => {
          console.log(res);
        })
      },
      resetFunc: function () {
        /**重置搜索条件*/
        for (let prop in this.search) {
          this.search[prop] = '';
        }
      },
      getOBList(page) {
        ajax.fetch_get(this.host + '/api/ob', {
          page: page,
          listRows: this.pageNum,
        }).then(res => {
          if (res.data.status.code === 200) {
            this.tableData = res.data.data;
            this.total = res.data.ext.total;
          } else {
            this.errorTip(res.data.status.info)
          }
        })
      },
      addOB: function () {
        this.dialogAddOBVisible = true;
        this.operationText = '添加';
        for (let prop in this.operationData) {
          this.operationData[prop] = '';
        }
      },
      modify(id) {
        this.dialogAddOBVisible = true;
        this.operationText = '修改';
        this.operationDataID = id;
        ajax.fetch_get(this.host + '/api/ob/' + id).then(res => {
          if (res.data.status.code === 200) {
            for (let prop in res.data.data) {
              this.operationData[prop] = res.data.data[prop];
            }
          } else {
            this.errorTip(res.data.status.info)
          }
        }).catch(res => {
          this.errorTip(res.data.status.info)
        })
      },
      del(id) {
        this.$confirm('确定删除本条OB信息吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ajax.fetch_del(this.host + "/api/ob/" + id).then(res => {
            if (res.data.status.code === 200) {
              this.successTip("OB信息删除成功！");
              let page = ((this.total - 1) % this.pageNum === 0 && this.currentPage === (this.total - 1) / this.pageNum + 1) ? this.currentPage - 1 : this.currentPage;
              this.getOBList(page);
            } else {
              //登录超时返回登录页面
              this.errorTip(res.data.status.info);
            }
          }).catch(res => {
            console.log(res);
          })
        }).catch(() => {
          this.errorTip("已取消删除");
        });
      },
      submitFunc: function () {
        if (this.operationData.area === '') {
          this.errorTip('请选择地区');
          return false;
        } else if (this.operationData.ip === '') {
          this.errorTip('请输入IP地址');
          return false;
        } else if (this.operationData.gonghao === '') {
          this.errorTip('请输入员工工号');
          return false;
        } else if (!/^\d+$/.test(this.operationData.gonghao)) {
          this.errorTip('工号必须为数字');
          return false;
        }
        if (this.operationText === '添加') {
          /* 添加OB*/
          ajax.fetch_post(this.host + '/api/ob', this.operationData).then(res => {
            if (res.data.status.code === 200) {
              this.successTip('OB添加成功');
              this.getOBList(1);
              this.dialogAddOBVisible = false;
            } else {
              this.errorTip(res.data.status.info);
            }
          }).catch(res => {
            this.errorTip(res.data.status.info);
          })
        } else if (this.operationText === '修改') {
          ajax.fetch_put(this.host + '/api/ob/' + this.operationDataID, this.operationData).then(res => {
            if (res.data.status.code === 200) {
              this.successTip('OB信息修改成功！');
              this.getOBList(this.currentPage);
              this.dialogAddOBVisible = false;
            } else {
              this.errorTip(res.data.status.info);
            }
          }).catch(res => {
            this.errorTip(res.data.status.info);
          })
        }
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getOBList(this.currentPage);
      },
      setHeaderStyle: function () {
        /**设置表头样式*/
        return {"fontSize": "16px", "background": "#f9f9f9"}
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
    display: flex;
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
      font-size: 20px;
      color: #333333;
      text-align: center;
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
      &:last-child {
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
</style>
