<template>
  <container>
    <div class="search-condition">
      <search :search="search" @searchFunc="searchData">
        <h1 class="search-title" slot="title">资产管理</h1>
      </search>
      <div class="button-groups">
        <el-button type="warning" plain @click="batchImport">批量导入资产</el-button>
      </div>
    </div>
    <div class="search-result">
      <el-table
        ref="multipleTable"
        :data="tableData"
        size="mini"
        height="100%"
        tooltip-effect="light"
        style="width: 100%"
        :header-cell-style="setHeaderStyle"
        @select-all="handleSelectionChange"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection" align="center">
        </el-table-column>
        <el-table-column prop="assets_sn" label="编号" align="center">
        </el-table-column>
        <el-table-column prop="assets_name" label="品名" align="center">
        </el-table-column>
        <el-table-column prop="id" label="地区" align="center">
        </el-table-column>
        <el-table-column prop="create_time" label="领用人" align="center">
        </el-table-column>
        <el-table-column prop="delete_time" label="使用人" align="center">
        </el-table-column>
        <el-table-column prop="assets_type" label="状态" align="center">
          <template slot-scope="scope">
            <el-tag type="warning">{{scope.row.assets_type}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="store" label="入库/出库" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.assets_type}}</p>
            <p>{{scope.row.assets_type}}</p>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div class="operation">
              <span class="detail" @click="showDetailDialog(scope.row)">详细</span>|<span class="store">出入库</span>
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
        :page-size="pageSize"
        layout="prev, pager, next, total, jumper"
        :total="total">
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
                  <el-input v-model="batchOperationData.taker.name" size="mini"></el-input>
                </i>
              </span>
            <span class="infor-enter">
                <b>工号:</b>
                <i class="ipt">
                  <el-input v-model="batchOperationData.taker.staffID" size="mini"></el-input>
                </i>
              </span>
            <span class="infor-enter">
                <b>区域:</b>
                <i class="ipt">
                  <el-select v-model="batchOperationData.taker.area" clearable placeholder="地区" size="mini">
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
        <div class="downTemplateFile">
          <div class="templateTypeChoose">
            <div class="title">模板下载：</div>
            <el-select v-model="templateType" clearable placeholder="选择模板类型" size="mini" @change="templateChange">
              <el-option v-for="(item,index) in templateTypeOption" :key="index" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </div>
          <div class="download"><span @click="downLoadTemplate">下载</span></div>
        </div>
        <div class="upload-file">
          <div class="fileName">
            <input v-model="fileName" readonly type="text">
          </div>
          <div class="upload">
            <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/"
                       accept=".xls" :show-file-list="false" :on-change="fileChange" :before-upload="beforeUpload"
                       :on-success="uploadSuccess"
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
  </container>
</template>

<script>
  import search from '@/components/search/search'
  import container from '@/components/container/container'
  import localTime from '../../assets/script/localTime'                        //本地时间
  import tipMixin from "../../assets/script/mixin"
  import * as ajax from "../../assets/script/ajaxApi"
  import axios from 'axios'
  export default {
    name: "asset",
    mixins: [tipMixin],
    data() {
      return {
        currentPage: 1,             //当前页码
        pageSize: 14,
        total: 0,
        checkAll: false,            //是否全选
        search: [
          {
            key: '',
            options: ['电脑', '电话', '手机', '行政部'],
            placeholder: '请选择资产类型',
            type: 'select'
          },
          {
            key: '',
            options: ['入库', '出库', '报废', '维修', '丢失', '售出', '其他'],
            placeholder: '请选择资产状态',
            type: 'select'
          },
          {
            key: '',
            options: ['花园坊A3', '花园坊A4', '花园坊A5', '成都', '北京', '重庆', '其他'],
            placeholder: '请选择地区',
            type: 'select'
          },
          {
            key: '',
            placeholder: '请输入要搜索的关键词',
            type: 'input'
          },
        ],
        tableData: [      //搜索结果数据
        ],
        multipleSelection: [],      //选择的数据
        dialogDetailVisible: false, //详细弹出框是否显示
        dialogBatchVisible: false,  //批量操作弹出框是否显示
        dialogImportVisible: false,   //批量导入资产信息弹出框是否显示
        storeType: '',              //出库或入库
        detail: {                   //资产详细表单数据
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
        fileList: [],                //导入文件列表
        fileName: '',                //导入文件名
        templateType: '',
        templateTypeOption: [],
        templateId: '',
        fileContent:'',
        exportFileName:''           //导出excel模板文件名
      }
    },
    mounted() {
      this.$nextTick(function () {
        this.timer = setInterval(()=> {
          this.localTime = localTime();
        }, 1000);

        /**获取列表数据*/
        this.getAssetsList();
      });
    },
    beforeDestroy: function () {
      /**组件销毁前清空计时器*/
      clearInterval(this.timer);
    },
    watch: {
      'batchOperationData.taker.area': function (val, oldVal) {
        this.batchOperationData.user.area = val;
      },
      'batchOperationData.taker.name': function (val, oldVal) {
        this.batchOperationData.user.name = val;
      },
      'batchOperationData.taker.staffID': function (val, oldVal) {
        this.batchOperationData.user.staffID = val;
      },
    },
    methods: {
      searchData(e) {
        /**搜索*/
      },
      batchImport() {
        /**批量导入*/
        this.dialogImportVisible = true;
        this.getTemplateType();
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
      handleSelectionChange() {
        /**如果表单项全部选中，全选按钮为选中状态*/
        if (val.length === this.tableData.length) {
          this.checkAll = true
        } else {
          this.checkAll = false
        }
        this.multipleSelection = val;
      },

      showDetailDialog(id) {
        /**显示弹出框*/
        this.detail.number = data.number;
        this.detail.taker = data.taker;
        this.detail.user = data.user;
        this.dialogDetailVisible = true;
      },
      selectChange() {
        /**状态下拉框值变化回调函数*/
        if (val === '入库') {
          this.detail.taker = '';
          this.detail.user = '';
        }
      },
      batchOperation(type) {
        if (type === '1') {
          this.storeType = '出库'
        } else if (type === '2') {
          this.storeType = '入库'
        }
        this.dialogBatchVisible = true;
      },
      sureOperation() {
        if (this.storeType = '出库') {
          if (this.batchOperationData.taker.name === '') {
            this.errorTip('领用人姓名不能为空');
            return false;
          } else if (this.batchOperationData.taker.staffID === '') {
            this.errorTip('领用人工号不能为空');
            return false;
          } else if (this.batchOperationData.taker.area === '') {
            this.errorTip('领用人区域不能为空');
            return false;
          }
        } else if (this.storeType = '入库') {

        }
      },
      fileChange(file) {
        if (file.name.indexOf("xls") < 0) {
          this.$refs.upload.clearFiles();
        }
      },
      beforeUpload(file) {
        if (file.name.indexOf("xls") < 0) {
          this.errorTip('文件类型错误！');
          this.$refs.upload.abort();
          return false;
        } else {
          this.fileName = file.name
        }
      },
      getTemplateType() {
        /**获取模板文件类型*/
        this.templateTypeOption = [];
        ajax.fetch_get(this.host + "/api/assetstype").then(res => {
          if (res.data.code === 200) {
            res.data.data.forEach(v => {
              /**模板类型备选项*/
              this.templateTypeOption.push({
                label: v.name,
                value: v.id,
              });
            });
          } else {
            //登录超时返回登录页面
            this.errorTip(res.data.info);
          }
        }).catch(res => {
          this.errorTip(res.data.info)
        })
      },
      templateChange(val) {
        this.templateId = val;
      },
      downLoadTemplate() {
        if (this.templateId === ''||this.templateId===0) {
          this.errorTip('请选择模板类型！');
          return false;
        }
        let instance=axios.create({
          responseType: 'blob',
        });

        instance.post(this.host+'/api/assetst',{
          id:this.templateId
        }).then(res=>{
          this.fileContent=res.data;
          this.templateTypeOption.forEach((v,i)=> {
            if(v.value===this.templateId){
              this.exportFileName=v.label+'模板.xls'
            }
          });
          this.fileDownload(this.fileContent,this.exportFileName);
        }).catch(err=>{
          console.log(err)
        })
      },
      fileDownload (data, fileName) {
        let blob = new Blob([data], {
          type: "application/octet-stream"
        });
        let filename = fileName || "filename.xls";
        if (typeof window.navigator.msSaveBlob !== "undefined") {
          window.navigator.msSaveBlob(blob, filename);
        } else {
          let blobURL = window.URL.createObjectURL(blob);
          let tempLink = document.createElement("a");
          tempLink.style.display = "none";
          tempLink.href = blobURL;
          tempLink.setAttribute("download", filename);
          if (typeof tempLink.download === "undefined") {
            tempLink.setAttribute("target", "_blank");
          }
          document.body.appendChild(tempLink);
          tempLink.click();
          document.body.removeChild(tempLink);
          window.URL.revokeObjectURL(blobURL);
        }
      },
      getAssetsList() {
        ajax.fetch_get(this.host + '/api/assets', {
          page: this.currentPage,
          listRows: this.pageSize,
        }).then(res => {
          if (res.data.code === 200) {
            this.total = res.data.ext.total;
            this.tableData = res.data.data;
          } else {
            this.errorTip(res.data.info)
          }
        }).catch(err => {
          throw err
        })
      },
      uploadSuccess() {
        this.successTip('文件上传成功');
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getAssetsList()
      },
      setHeaderStyle() {
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

  .search-result {
    height: 75%;
    min-height: 75%;
    background: #ffffff;
    box-shadow: 0 0 10px #dddddd;
    border-radius: 5px;
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

  .dialog-title {
    font-size: 20px;
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

  .import-file-box {
    text-align: center;
    .upload-file {
      display: flex;
      justify-content: center;
      .fileName {
        width: 200px;
        margin-right: 30px;
        input {
          width: 100%;
          height: 32px;
          text-indent: 1em;
          border: 1px solid #ddd;
        }
      }
    }
    .downTemplateFile {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 20px;
      .templateTypeChoose {
        width: 202px;
        margin-right: 30px;
        display: flex;
        align-items: center;
        .title {
          width: 130px;
          font-size: 14px;
        }
      }
      .download {
        width: 80px;
        span {
          display: block;
          width: 100%;
          height: 28px;
          line-height: 28px;
          color: #fff;
          background-color: #409eff;
          border-radius: 3px;
          font-size: 12px;
          cursor: pointer;
        }
      }
    }
    .uploadTip {
      margin-top: 20px;
      color: red;
      font-size: 12px;
    }
  }

  /*.downTemplateFile {
    width: 150px;
    position: absolute;
    top: 25px;
    left: 10px;
    .title {
      text-align: center;
      font-size: 18px;
      line-height: 24px;
      color: #333333;
    }
    .templateTypeChoose {
      margin-top: 20px;
    }
    .download {
      margin-top: 20px;
      text-align: center;
      a {
        display: block;
        width: 100%;
        height: 28px;
        line-height: 28px;
        background: #409eff;
        color: #ffffff;
        font-size: 12px;
        text-align: center;
        border-radius: 3px;
      }
    }
  }*/
</style>
