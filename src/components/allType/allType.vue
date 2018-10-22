<template>
  <container>
    <div class="department-title">
      <div class="title-text">类型管理</div>
      <div class="add-department">
        <el-button type="warning" plain @click="modify('add')" size="mini">添加类型</el-button>
      </div>
    </div>

    <div class="department-wrapper">
      <el-table
        v-loading="loading"
        :data="tableData"
        height="100%"
        style="width: 100%"
        :header-cell-style="setHeaderStyle">
        <el-table-column prop="name" label="类型名" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <span @click="modify('edit',scope.row.id)">修改</span> |
            <span @click="propOperation(scope.row.id)">属性</span> |
            <span @click="delData(scope.row.id)">删除</span>
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
        :page-size="pageSize"
        layout="prev, pager, next, total, jumper"
        :total="total">
      </el-pagination>
    </div>
    <!--添加修改-->
    <el-dialog title="" :visible.sync="isDialogShow" center width="700px">
      <div class="dialog-title" slot="title">{{modifyType}}类型信息</div>
      <div class="modify-department-form">
        <el-form label-position="right" label-width="80px" :model="modifyData">
          <el-form-item label="类型名">
            <el-input v-model="modifyData.name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class='add-button' type="warning" plain @click="sureModify">{{modifyType}}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

    <el-dialog title="" :visible.sync="isPropArrrShow" center width="700px">
      <div class="dialog-title" slot="title">属性操作</div>
    </el-dialog>
  </container>
</template>

<script>
  import * as ajax from "../../assets/script/ajaxApi"
  import container from '@/components/container/container'
  import tipMixin from "../../assets/script/mixin"
  export default {
    name: "broadband",
    mixins:[tipMixin],
    data() {
      return {
        loading: false,
        areaValueOptions: [
          {
            value: '花园坊A3',
            label: '花园坊A3'
          },
          {
            value: '花园坊A4',
            label: '花园坊A4'
          },
          {
            value: '花园坊A5',
            label: '花园坊A5'
          },
          {
            value: '成都',
            label: '成都'
          },
          {
            value: '北京',
            label: '北京'
          },
          {
            value: '重庆',
            label: '重庆'
          },
          {
            value: '其它',
            label: '其它'
          }
        ],
        modifyData: {
          name: '',
        },
        tableData: [],
        currentPage: 1,
        total: 0,
        isDialogShow: false,
        pageSize: 10,
        modifyID: 0,
        showTipWord: false
      }
    },
    mounted() {
      this.$nextTick(function () {
        this.getInfoList(this.currentPage);
      })
    },
    methods: {
      modify() {
        this.isDialogShow = true;
        for (let prop in this.modifyData) {
          this.modifyData[prop] = '';
        }
        if (arguments.length === 2) {
          this.modifyType = "修改";
          this.modifyID = arguments[1];
          ajax.fetch_get(this.host + "/api/assetstype/" + this.modifyID).then(res => {
            if (res.data.code === 200) {
              this.modifyData.name = res.data.data.name;
            } else {
              //登录超时返回登录页面
              this.errorTip(res.data.info);
            }
          }).catch(res => {
            console.log(res);
          })
        } else if (arguments.length === 1) {
          this.modifyType = "添加";
          this.showTipWord = true;
        }
      },
      delData(id) {
        this.$confirm('确定删除本条信息吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ajax.fetch_del(this.host + "/api/assetstype/" + id).then(res => {
            if (res.data.code === 200) {
              this.successTip("类型删除成功");
              let page = ((this.total - 1) % this.pageSize === 0 && this.currentPage === (this.total - 1) / this.pageSize + 1) ? this.currentPage - 1 : this.currentPage;
              this.getInfoList(page);
            } else {
              //登录超时返回登录页面
              this.errorTip(res.data.info);
            }
          }).catch(res => {
            console.log(res)
          })
        }).catch(() => {
          this.errorTip("已取消删除");
        });
      },
      sureModify() {
        if (this.modifyType === '添加') {
          if (this.modifyData.name === '') {
            this.errorTip('类型名不能为空');
            return false;
          }
          ajax.fetch_post(this.host + "/api/assetstype", this.modifyData).then(res => {
            if (res.data.code === 200) {
              this.successTip('类型添加添加成功');
              this.getInfoList(1);
              this.isDialogShow = false;
            } else {
              //登录超时返回登录页面
              this.errorTip(res.data.info);
            }
          }).catch(res => {
            this.errorTip(res.data.info);
          })
        } else if (this.modifyType === '修改') {
          ajax.fetch_put(this.host + "/api/assetstype/" + this.modifyID, this.modifyData).then(res => {
            if (res.data.code === 200) {
              this.successTip('类型修改成功！');
              this.getInfoList(this.currentPage);
              this.isDialogShow = false;
            } else {
              //登录超时返回登录页面
              this.errorTip(res.data.info);
            }
          }).catch(function (res) {
            this.errorTip(res.data.info);
          })
        }
      },
      getInfoList(page) {
        this.loading = true;
        ajax.fetch_get(this.host + "/api/assetstype", {
          page: page,
          listRows: this.pageSize,
        }).then(res => {
          if (res.data.code === 200) {
            this.loading = false;
            this.tableData = res.data.data;
            this.total = res.data.ext.total;
          } else {
            //登录超时返回登录页面
            this.errorTip(res.data.info);
          }
        }).catch(res => {
          this.errorTip(res.data.info)
        })
      },
      propOperation(id) {
        this.$router.push({
          name: 'attrList',
        });
        this.$store.state.typeID=id;
      },
      handleSizeChange(val) {
        console.log(`${val} 页`)
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getInfoList(val);
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

<style lang="scss" scoped>
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
    span {
      display: inline-block;
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
  .add-department-form {
    width: 60%;
    margin: 0 auto;
    .add-button {
      display: block;
      width: 150px;
      margin: 0 auto;
    }
  }
  .modify-department-form {
    width: 60%;
    margin: 0 auto;
    .tip {
      padding-left: 65px;
      margin-bottom: 20px;
      font-size: 14px;
      color: red;
    }
    .add-button {
      display: block;
      width: 150px;
      margin: 0 auto;
    }
  }
</style>
