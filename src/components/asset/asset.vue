<template>
  <div class="asset">
    <departmentCaption></departmentCaption>
    <div class="container">
      <div class="search-condition">
        <el-form :inline="true" :model="search" class="demo-form-inline">
          <el-form-item>
            <el-select v-model="search.type" placeholder="请选择资产类型">
              <el-option label="电脑" value="电脑"></el-option>
              <el-option label="电话" value="电话"></el-option>
              <el-option label="手机" value="手机"></el-option>
              <el-option label="BP机" value="BP机"></el-option>
              <el-option label="其他" value="其他"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="search.status" placeholder="状态">
              <el-option label="入库" value="入库"></el-option>
              <el-option label="出库" value="出库"></el-option>
              <el-option label="报废" value="报废"></el-option>
              <el-option label="维修" value="维修"></el-option>
              <el-option label="丢失" value="丢失"></el-option>
              <el-option label="售出" value="售出"></el-option>
              <el-option label="其它" value="其它"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="search.area" placeholder="地区">
              <el-option label="花园坊A3" value="花园坊A3"></el-option>
              <el-option label="花园坊A4" value="花园坊A4"></el-option>
              <el-option label="花园坊A5" value="花园坊A5"></el-option>
              <el-option label="成都" value="成都"></el-option>
              <el-option label="北京" value="北京"></el-option>
              <el-option label="重庆" value="重庆"></el-option>
              <el-option label="其它" value="其它"></el-option>
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
            <el-button type="warning" plain @click="batchImport">批量导入资产</el-button>
          </div>
        </el-form>
      </div>
      <div class="search-result">
        <el-table
          ref="multipleTable"
          :data="tableData"
          size="mini"
          height="100%"
          tooltip-effect="dark"
          style="width: 100%"
          :header-cell-style="setHeaderStyle"
          @select-all="handleSelectionChange"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection" align="center">
          </el-table-column>
          <el-table-column prop="number" label="编号" align="center">
            <template slot-scope="scope">{{ scope.row.number }}</template>
          </el-table-column>
          <el-table-column prop="name" label="品名" align="center">
          </el-table-column>
          <el-table-column prop="address" label="地区" align="center">
          </el-table-column>
          <el-table-column prop="taker" label="领用人" align="center">
          </el-table-column>
          <el-table-column prop="user" label="使用人" align="center">
          </el-table-column>
          <el-table-column prop="status" label="状态" align="center">
            <template slot-scope="scope">
              <el-tag type="warning">{{scope.row.status}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="store" label="入库/出库" align="center">
            <template slot-scope="scope">
              <p>{{scope.row.store.in}}</p>
              <p>{{scope.row.store.out}}</p>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <div class="operation">
                <span class="detail" @click="showDialog(scope.row)">详细</span>|<span class="store">出入库</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="form-operation">
        <div class="operation-item">
          <el-checkbox v-model="checkAll" @change="handleCheckAllChange">{{this.checkAll?"取消":"全选"}}</el-checkbox>
        </div>
        <div class="operation-item">
          <el-button type="warning" plain size="mini" @click="batchOperation('1')">批量出库</el-button>
        </div>
        <div class="operation-item">
          <el-button type="warning" plain size="mini" @click="batchOperation('2')">批量入库</el-button>
        </div>
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
      <!--资产详细-->
      <el-dialog title="资产详细" :visible.sync="dialogDetailVisible" center width="45%">
        <div class="dialog-title" slot="title">资产详细</div>
        <div class="asset-infor-box">
          <div class="infor-line">
            <span><b>编号:</b>{{detail.number}}</span>
            <span><b>品名:</b>{{detail.name}}</span>
            <span><b>型号:</b>{{detail.model}}</span>
          </div>
          <div class="infor-line">
            <span>
              <b>领用人:</b>
              <div class="f-ctrl">
                <input type="text" v-model="detail.taker">
              </div>
            </span>
            <span>
              <b>使用人:</b>
              <div class="f-ctrl">
                <input type="text" v-model="detail.user">
              </div>
            </span>
            <span>
              <b>状态:</b>
              <div class="f-ctrl">
                <el-select v-model="detail.status" clearable placeholder="请选择" size="mini" @change="selectChange">
                  <el-option v-for="(item,index) in detail.statusOption" :key="index" :label="item" :value="item">
                  </el-option>
                </el-select>
              </div>
            </span>
          </div>
          <div class="infor-line">
            <span><b>出/入库时间:</b>{{detail.store}}</span>
          </div>
          <div class="division"></div>
          <div class="infor-line">
            <span><b>CPU:</b>{{detail.CPU}}</span>
            <span><b>内存:</b>{{detail.MEMORY}}</span>
            <span><b>硬盘:</b>{{detail.HD}}</span>
            <span><b>键/鼠:</b>{{detail.KB}}</span>
            <span><b>显示器:</b>{{detail.VDU}}</span>
          </div>
          <div class="remark">
            <label>备注:</label>
            <el-input type="textarea" v-model="detail.remark"></el-input>
          </div>
          <div class="submit">
            <el-button type="warning">提 交</el-button>
          </div>
        </div>
      </el-dialog>
      <!--批量操作-->
      <el-dialog title="批量操作" :visible.sync="dialogBatchVisible" center width="45%">
        <div class="dialog-title" slot="title">批量{{storeType}}操作</div>
        <div class="localTime">当前时间: {{localTime}}</div>
        <div class="batch-operation-box">
          <div class="operation-people">
            <div class="people-item">
              <span class="mini-title">领用人 |</span>
              <span class="infor-enter">
                <b>姓名:</b>
                <i class="ipt">
                  <el-input v-model="batchOperationData.taker.name" size="mini" @change="takerNameChange"></el-input>
                </i>
              </span>
              <span class="infor-enter">
                <b>工号:</b>
                <i class="ipt">
                  <el-input v-model="batchOperationData.taker.staffID" size="mini" @change="takerIDChange"></el-input>
                </i>
              </span>
              <span class="infor-enter">
                <b>区域:</b>
                <i class="ipt">
                  <el-select v-model="batchOperationData.taker.area" clearable placeholder="地区" size="mini"
                             @change="takerAreaChange">
                    <el-option v-for="(item,index) in batchOperationData.areaOptions" :key="index" :label="item"
                               :value="item"></el-option>
                  </el-select>
                </i>
              </span>
            </div>
            <div class="people-item">
              <span class="mini-title">使用人 |</span>
              <span class="infor-enter">
                <b>姓名:</b>
                <i class="ipt">
                  <el-input v-model="batchOperationData.user.name" size="mini"></el-input>
                </i>
              </span>
              <span class="infor-enter">
                <b>工号:</b>
                <i class="ipt">
                  <el-input v-model="batchOperationData.user.staffID" size="mini"></el-input>
                </i>
              </span>
              <span class="infor-enter">
                <b>区域:</b>
                <i class="ipt">
                  <el-select v-model="batchOperationData.user.area" clearable placeholder="地区" size="mini">
                    <el-option v-for="(item,index) in batchOperationData.areaOptions" :key="index" :label="item"
                               :value="item"></el-option>
                  </el-select>
                </i>
              </span>
            </div>
          </div>
          <div class="operation-target">
            <div class="table-item" v-for="(dataItem,index) in batchOperationData.target" :key="index">
              <div class="header">
                <span>编号</span>
                <span>品名</span>
              </div>
              <div class="body">
                <span>{{dataItem.id}}</span>
                <span>{{dataItem.typeName}}</span>
              </div>
            </div>
          </div>
          <div class="operation-page">
            <el-pagination
              background
              size="mini"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage"
              :page-size="5"
              layout="prev, pager, next, jumper"
              :total="30">
            </el-pagination>
          </div>
          <div class="remark">
            <label>备注:</label>
            <el-input type="textarea" v-model="detail.remark"></el-input>
          </div>
          <div class="button">
            <el-button type="warning" @click="sureOperation">确定{{storeType}}</el-button>
          </div>
        </div>
      </el-dialog>
      <!--批量导入资产信息-->
      <el-dialog title="批量导入资产信息" :visible.sync="dialogImportVisible" center width="45%">
        <div class="dialog-title" slot="title">批量导入资产信息</div>
        <div class="import-file-box">
          <div class="upload-file">
            <div class="fileName">
              <input v-model="fileName" readonly type="text">
            </div>
            <div class="upload">
              <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/"
                         accept=".xls" :show-file-list="false" :on-change="fileChange" :before-upload="beforeUpload" :on-success="uploadSuccess"
                         ref="upload">
                <el-button size="small" type="primary">选择文件</el-button>
              </el-upload>
            </div>
          </div>
          <div class="uploadTip">
            提示：导入的文件必须按上面附件的格式,且必须为".xls"格式.
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import departmentCaption from "@/components/caption/dcaption"
  import localTime from '../../assets/script/localTime'       //导入本地实时

  export default {
    name: "asset",
    data() {
      return {
        checkAll: false,            //是否全选
        currentPage: 2,             //当前页码
        search: {         //搜索相关选项
          type: '',
          status: '',
          area: '',
          keywords: ''
        },
        tableData: [      //搜索结果数据
          {
            number: 'GD123456',
            name: '电脑',
            address: '上海花园坊',
            taker: "顺哥",
            user: "顺哥",
            status: "已出库",
            store: {
              in: '2018-03-15/',
              out: '2018-04-02/'
            },
          },
          {
            number: 'GD123456',
            name: '电脑',
            address: '上海花园坊',
            taker: "星爷",
            user: "星爷",
            status: "已出库",
            store: {
              in: '2018-03-15/',
              out: '2018-04-02/'
            },
          },
          {
            number: 'GD123456',
            name: '电脑',
            address: '上海花园坊',
            taker: "小丽",
            user: "小丽",
            status: "已出库",
            store: {
              in: '2018-03-15/',
              out: '2018-04-02/'
            }
          }
        ],
        multipleSelection: [],      //选择的结果项目
        dialogDetailVisible: false, //详细弹出框是否显示
        dialogBatchVisible: false,  //批量操作弹出框是否显示
        dialogImportVisible: false,   //批量导入资产信息弹出框是否显示
        storeType: '',              //出库或入库
        detail: {          //资产详细表单数据
          number: '',
          name: '戴尔台式电脑',
          model: 'xps200456',
          taker: '',
          user: '',
          status: '',
          statusOption: ['入库', '出库', '报废', '维修', '丢失', '售出', '其他'],
          store: '2018-03-15/2018-04-02',
          CPU: 'Intel I7',
          MEMORY: '64G',
          HD: '1T',
          KB: '默认',
          VDU: 'DELL',
          remark: ""
        },
        timer: '',                   //定时器
        localTime: '',               //本地时间
        batchOperationData: {
          taker: {
            name: '',
            staffID: '',
            area: ''
          },
          user: {
            name: '',
            staffID: '',
            area: ''
          },
          target: [
            {
              id: "GD123456",
              typeName: '戴尔品牌电脑'
            },
            {
              id: "GD123455",
              typeName: '华为手机'
            },
            {
              id: "GD123457",
              typeName: '小米手机'
            },
            {
              id: "GD123454",
              typeName: '戴尔品牌电脑'
            },
          ],
          areaOptions: ['花园坊A3', '花园坊A4', '花园坊A5', '成都', '北京', '重庆', '其它']
        },
        fileList: [],
        fileName:''
      }
    },
    mounted() {
      var _this = this;
      this.$nextTick(function () {
        this.timer = setInterval(function () {
          _this.localTime = localTime();
        }, 1000);
      });
    },
    destroyed: function () {
      /**组件销毁清空计时器*/
      var _this = this;
      clearInterval(_this.timer);
    },
    methods: {
      searchFunc: function () {
        /**搜索*/
        console.log('正在搜索...');
      },
      resetFunc: function () {
        /**重置*/
        for (var prop in this.search) {
          this.search[prop] = '';
        }
      },
      batchImport: function () {
        /**批量导入*/
        this.dialogImportVisible = true;
      },
      handleCheckAllChange() {
        /**全选*/
        if (!this.checkAll) {
          this.tableData.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row, false);
          });
        } else {
          this.tableData.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row, true);
          });
        }
      },
      handleSelectionChange(val) {
        /**如果表单项全部选中，全选按钮为选中状态*/
        if (val.length === this.tableData.length) {
          this.checkAll = true
        } else {
          this.checkAll = false
        }
        this.multipleSelection = val;
      },
      takerAreaChange: function () {
        this.batchOperationData.user.area = this.batchOperationData.taker.area
      },
      takerNameChange: function () {
        this.batchOperationData.user.name = this.batchOperationData.taker.name
      },
      takerIDChange: function () {
        this.batchOperationData.user.staffID = this.batchOperationData.taker.staffID
      },
      setHeaderStyle: function () {
        /**设置表头样式*/
        return {"fontSize": "16px", "background": "#f9f9f9"}
      },
      showDialog: function (data) {
        /**显示弹出框*/
        this.detail.number = data.number;
        this.detail.taker = data.taker;
        this.detail.user = data.user;
        this.dialogDetailVisible = true;
      },
      selectChange: function (val) {
        /**状态下拉框值变化回调函数*/
        if (val == '入库') {
          this.detail.taker = '';
          this.detail.user = '';
        }
      },
      batchOperation: function (type) {
        if (type == '1') {
          this.storeType = '出库'
        } else if (type == '2') {
          this.storeType = '入库'
        }
        this.dialogBatchVisible = true;
      },
      sureOperation: function () {
        if (this.storeType = '出库') {
          if (this.batchOperationData.taker.name == '') {
            this.showErrorTip('领用人姓名不能为空');
            return false;
          } else if (this.batchOperationData.taker.staffID == '') {
            this.showErrorTip('领用人工号不能为空');
            return false;
          } else if (this.batchOperationData.taker.area == '') {
            this.showErrorTip('领用人区域不能为空');
            return false;
          }
        } else if (this.storeType = '入库') {

        }
      },
      fileChange: function (file) {
        if (file.name.indexOf("xls") < 0) {
          this.$refs.upload.clearFiles();
        }
      },
      beforeUpload: function (file) {
        if (file.name.indexOf("xls") < 0) {
          this.showErrorTip('文件类型错误！');
          this.$refs.upload.abort();
          return false;
        } else {
          this.fileName=file.name
        }
      },
      uploadSuccess:function(){
        this.showSuccessTip('文件上传成功');
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

  .asset {
    @include fullScreen;
    .container {
      padding-left: 90px;
      padding-right: 50px;
      height: 100%;
      .search-condition {
        padding: 15px 0;
      }
      .search-result {
        height: 70%;
        min-height: 70%;
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
          width: 15%;
        }
        .form-buttons {
          width: 40%;
        }
      }
      .operation {
        color: #ff6633 !important;
        span {
          padding: 5px;
          color: #ff6633;
          cursor: pointer;
        }
      }
      .form-operation {
        display: flex;
        margin-top: 20px;
        align-items: center;
        .operation-item {
          margin-left: 30px;
        }
      }
      .page {
        margin-top: 20px;
        text-align: center;
        .el-pagination {
          .btn-prev {
            background: none !important;
          }
        }
      }
      .dialog-title {
        font-size: 20px;
      }
      .asset-infor-box {
        .infor-line {
          padding: 5px 0;
          display: flex;
          justify-content: space-between;
          span {
            display: flex;
            width: 32%;
            align-items: center;
            b {
              display: block;
              margin-right: 5px;
              font-size: 14px;
              font-weight: normal;
              color: #333333;
            }
            .f-ctrl {
              display: block;
              flex: 1;
              input {
                display: block;
                width: 100%;
                padding: 3px 0;
                border-bottom: 1px solid #ddd;
                outline: none;
                text-indent: 10px;
              }
            }
          }
        }
        .division {
          padding: 10px 0;
          margin-bottom: 10px;
          height: 0;
          border-bottom: 1px solid #dddddd;
        }
        .remark {
          padding: 10px 0;
          label {
            display: block;
            margin-bottom: 10px;
            font-size: 14px;
            font-weight: normal;
            color: #333333;
          }
        }
        .submit {
          width: 200px;
          margin: 20px auto 0;
          button {
            display: block;
            width: 100%;
          }
        }
      }
      .batch-operation-box {
        .operation-people {
          margin-top: 20px;
          .people-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 20px 0;
            .mini-title {
              display: block;
              width: 60px;
              margin-right: 20px;
              font-size: 16px;
              line-height: 24px;
              color: #cf9236;
              &:last-child {
                margin-right: 0;
              }
            }
            .infor-enter {
              display: flex;
              justify-content: space-between;
              align-items: center;
              flex: 1;
              margin-right: 20px;
              &:last-child {
                margin-right: 0 !important;
              }
              b {
                display: block;
                width: 40px;
                font-weight: normal;
                font-size: 14px;
                line-height: 24px;
                color: #333333;
              }
              .ipt {
                display: block;
                flex: 1;
                .el-select {
                  width: 100%;
                }
              }
            }
          }
        }
        .operation-target {
          border-left: 1px solid #333;
          border-top: 1px solid #333;
          overflow: hidden;
          .table-item {
            width: 50%;
            float: left;
            box-sizing: border-box;
            .header {
              overflow: hidden;
              span {
                float: left;
                box-sizing: border-box;
                height: 32px;
                line-height: 32px;
                text-align: center;
                font-size: 16px;
                font-weight: bold;
                color: #333;
                background: #eee;
                border-right: 1px solid #333;
                border-bottom: 1px solid #333;
                &:first-child {
                  width: 40%;
                }
                &:last-child {
                  width: 60%;
                }
              }
            }
            .body {
              overflow: hidden;
              span {
                float: left;
                box-sizing: border-box;
                height: 32px;
                line-height: 32px;
                text-align: center;
                font-size: 14px;
                color: #333;
                border-right: 1px solid #333;
                border-bottom: 1px solid #333;
                &:first-child {
                  width: 40%;
                  background: #eee;
                }
                &:last-child {
                  width: 60%;
                }
              }
            }
          }
        }
        .operation-page {
          margin-top: 20px;
          text-align: center;
        }
        .remark {
          padding: 10px 0;
          label {
            display: block;
            margin-bottom: 10px;
            font-size: 14px;
            font-weight: normal;
            color: #333333;
          }
        }
        .button {
          width: 200px;
          margin: 20px auto 0;
          button {
            display: block;
            width: 100%;
          }
        }
      }
      .import-file-box{
        text-align: center;
        .upload-file{
          display: flex;
          justify-content: center;
          .fileName{
            width: 200px;
            margin-right: 30px;
            input{
              width: 100%;
              height: 32px;
              text-indent: 1em;
              border: 1px solid #ddd;
            }
          }
        }
        .uploadTip{
          margin-top: 20px;
          color: red;
          font-size: 12px;
        }
      }
    }
  }
</style>
