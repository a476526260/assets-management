<template>
  <container>
    <div class="model-title">
      <div class="title-text">模型数据管理<span>* 模型之间可相互关联,模型及字段一旦创建,禁止通过任何方式删除</span></div>
      <div class="add-model">
        <el-button type="warning" plain @click="addModel" size="mini">添加模型</el-button>
      </div>
    </div>
    <div class="model-wrapper">
      <el-table
        :data="tableData"
        height="100%"
        tooltip-effect="light"
        style="width: 100%"
        :header-cell-style="setHeaderStyle">
        <el-table-column prop="ID" label="ID" align="center" width="120">
        </el-table-column>
        <el-table-column prop="relation" label="别名" align="center">
        </el-table-column>
        <el-table-column prop="model" label="关联模型" align="center">
        </el-table-column>
        <el-table-column prop="modelName" label="模型名称" align="center">
        </el-table-column>
        <el-table-column prop="field" label="字段" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <span v-for="(item,index) in scope.row.field"><span v-if="index!=0">、</span>{{item.fieldC}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <span class="modify" @click="modify(scope.row)">修改</span>
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
    <!--添加模型-->
    <el-dialog ref="addModel" title="添加模型" :visible.sync="dialogAddModelVisible" center width="35%">
      <div class="dialog-title" slot="title">添加模型</div>
      <div class="add-model-form">
        <el-form :inline="true" :model="addModelData" class="demo-form-inline" label-width="82px">
          <div class="el-form-block">
            <el-form-item label="　　名称:">
              <el-input v-model="addModelData.name" placeholder="名称"></el-input>
            </el-form-item>
            <el-form-item label="别名(表名):">
              <el-input v-model="addModelData.tableName" placeholder="别名"></el-input>
            </el-form-item>
          </div>
          <div class="el-form-block">
            <el-form-item label="关联模型:">
              <el-select v-model="addModelData.relation" placeholder="关联模型">
                <el-option label="模型一" value="模型一"></el-option>
                <el-option label="模型二" value="模型二"></el-option>
                <el-option label="模型三" value="模型三"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label=" 列表模板:">
              <el-input v-model="addModelData.listTemplate" placeholder="列表模板"></el-input>
            </el-form-item>
          </div>
          <div class="el-form-block">
            <el-form-item label="详细模板:">
              <el-input v-model="addModelData.detailTemplate" placeholder="详细模板"></el-input>
            </el-form-item>
          </div>
          <div class="button-submit">
            <el-button type="warning" @click="addNewModel">提交</el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>
    <!--模型属性列表对话框-->
    <el-dialog title="模型属性列表" :visible.sync="dialogModelVisible" center width="45%">
      <div class="dialog-title" slot="title">模型【{{modifyData.modelTitle}}】属性列表</div>
      <div class="dialog-subtitle">模型【{{modifyData.modelTitle}}】属性列表</div>
      <div class="modify-targets">
        <el-table
          :data="modifyData.mutiData"
          height="100%"
          style="width: 100%"
          border
          :header-cell-style="setHeaderStyle">
          <el-table-column prop="ID" label="ID" align="center" width="120">
          </el-table-column>
          <el-table-column prop="filed" label="字段" align="center">
          </el-table-column>
          <el-table-column prop="name" label="名称" align="center">
          </el-table-column>
          <el-table-column prop="type" label="数据类型" align="center">
          </el-table-column>
          <el-table-column prop="defaults" label="默认值" align="center">
          </el-table-column>
          <el-table-column prop="relation" label="关联属性" align="center">
          </el-table-column>
          <el-table-column label="操作" align="center" width="140">
            <template slot-scope="scope">
              <div class="operation">
                <span class="edit" @click="edit(scope)">编辑</span> | <span class="delete" @click="del(scope)">删除</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="modifyPage"
          :page-size="100"
          small
          layout="prev, pager, next, total, jumper"
          :total="1000">
        </el-pagination>
      </div>
    </el-dialog>
    <!--添加/修改字段-->
    <el-dialog title="添加/修改字段" :visible.sync="dialogModifyFiledVisible" center width="30%">
      <div class="dialog-title" slot="title">添加/修改字段</div>
      <div class="modify-filed-form">
        <el-form label-width="70px" :model="filedData">
          <el-form-item label="字段：">
            <el-input v-model="filedData.field" placeholder="请输入字段"></el-input>
          </el-form-item>
          <el-form-item label="名称：">
            <el-input v-model="filedData.fieldName" placeholder="请输入字段名称"></el-input>
          </el-form-item>
          <el-form-item label="类型：">
            <el-select v-model="filedData.dataType" clearable placeholder="选择数据类型">
              <el-option label="varchar(255)" value="varchar(255)"></el-option>
              <el-option label="int(11)" value="int(11)"></el-option>
              <el-option label="longtext(0)" value="longtext(0)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="属性：">
            <el-select v-model="filedData.relationProp" clearable placeholder="选择关联属性">
              <el-option label="varchar(255)" value="varchar(255)"></el-option>
              <el-option label="int(11)" value="int(11)"></el-option>
              <el-option label="longtext(0)" value="longtext(0)"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="默认值：">
            <el-input v-model="filedData.defaultVal" v-if="!filedData.relationProp"></el-input>
            <el-select v-model="filedData.defaultVal" clearable v-else placeholder="关联属性的值">
              <el-option label="CURRENT_TIMESTAMP" value="CURRENT_TIMESTAMP"></el-option>
            </el-select>
          </el-form-item>
          <div class="submit-botton">
            <el-button type="warning" plain>提交</el-button>
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
    name: "modelData",
    mixins:[tipMixin],
    data() {
      return {
        currentPage: 1,               //当前页
        modifyPage: 2,                //修改数据弹窗分页
        tableData: [                  //模型数据
          {
            ID: '1',
            relation: 'equipment',
            model: 'equipment',
            modelName: '设备基础表',
            field: [                  //字段
              {
                ID: '112',
                fieldE: 'bh',
                fieldC: "编号",
                type: 'string(200)',
                defaults: 'null',
                relation: ''
              },
              {
                ID: '113',
                fieldE: 'pm',
                fieldC: "品名",
                type: 'string(200)',
                defaults: 'null',
                relation: ''
              },
              {
                ID: '114',
                fieldE: 'dw',
                fieldC: "单位",
                type: 'string(200)',
                defaults: 'null',
                relation: ''
              },
              {
                ID: '132',
                fieldE: 'uid',
                fieldC: "用户名",
                type: 'string(100)',
                defaults: '某某',
                relation: ''
              },
            ]
          },
          {
            ID: '2',
            relation: 'equipment',
            model: 'equipment',
            modelName: '电脑',
            field: [                  //字段
              {
                ID: '115',
                fieldE: 'bh',
                fieldC: "编号",
                type: 'string(200)',
                defaults: 'null',
                relation: ''
              },
              {
                ID: '116',
                fieldE: 'pm',
                fieldC: "品名",
                type: 'string(200)',
                defaults: 'null',
                relation: ''
              },
              {
                ID: '117',
                fieldE: 'dw',
                fieldC: "单位",
                type: 'string(200)',
                defaults: 'null',
                relation: ''
              },
            ]
          },
          {
            ID: '3',
            relation: 'equipment',
            model: 'equipment',
            modelName: '手机',
            field: [                  //字段
              {
                ID: '118',
                fieldE: 'bh',
                fieldC: "编号",
                type: 'string(200)',
                defaults: 'null',
                relation: ''
              },
              {
                ID: '119',
                fieldE: 'pm',
                fieldC: "品名",
                type: 'string(200)',
                defaults: 'null',
                relation: ''
              },
              {
                ID: '120',
                fieldE: 'dw',
                fieldC: "单位",
                type: 'string(200)',
                defaults: 'null',
                relation: ''
              },
            ]
          },
          {
            ID: '4',
            relation: 'equipment',
            model: 'equipment',
            modelName: '设备基础表',
            field: [                  //字段
              {
                ID: '121',
                fieldE: 'bh',
                fieldC: "编号",
                type: 'string(200)',
                defaults: 'null',
                relation: ''
              },
              {
                ID: '122',
                fieldE: 'pm',
                fieldC: "品名",
                type: 'string(200)',
                defaults: 'null',
                relation: ''
              },
              {
                ID: '123',
                fieldE: 'dw',
                fieldC: "单位",
                type: 'string(200)',
                defaults: 'null',
                relation: ''
              },
            ]
          },
          {
            ID: '5',
            relation: 'equipment',
            model: 'equipment',
            modelName: '设备基础表',
            field: [                  //字段
              {
                ID: '124',
                fieldE: 'bh',
                fieldC: "编号",
                type: 'string(200)',
                defaults: 'null',
                relation: ''
              },
              {
                ID: '125',
                fieldE: 'pm',
                fieldC: "品名",
                type: 'string(200)',
                defaults: 'null',
                relation: ''
              },
              {
                ID: '126',
                fieldE: 'dw',
                fieldC: "单位",
                type: 'string(200)',
                defaults: 'null',
                relation: ''
              },
            ]
          },
        ],
        dialogModelVisible: false,           //修改模型对话框是否可视
        modifyData: {                        //模型修改数据
          modelTitle: "",
          mutiData: []
        },
        dialogAddModelVisible: false,    //添加模型对话框是否可视
        addModelData: {
          name: '',
          tableName: '',
          relation: '',
          listTemplate: '',
          detailTemplate: ''
        },
        dialogModifyFiledVisible:false,
        filedData:{
          field:'',
          fieldName:'',
          dataType:'',
          relationProp:'',
          defaultVal:''
        }
      }
    },
    methods: {
      addModel: function () {
        this.dialogAddModelVisible = true;
      },
      modify: function (data) {
        let _this = this;
        this.modifyData.mutiData = [];       //清空前次数据
        this.dialogModelVisible = true;
        this.modifyData.modelTitle=data.modelName;
        data.field.forEach(function (val, index) {
          _this.modifyData.mutiData.push({
            ID: val.ID,
            filed: val.fieldE,
            name: val.fieldC,
            type: val.type,
            defaults: val.defaults,
            relation: val.relation
          })
        })
      },
      edit: function (data) {
        this.dialogModifyFiledVisible=true;
      },
      del: function (data) {
        let _this=this;
        this.$confirm('删除该条字段, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.modifyData.mutiData.splice(data.$index,1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      addNewModel: function () {
        /**添加新模型*/
        if (this.addModelData.name === '') {
          this.errorTip('请填写模型名称');
          return false;
        } else if (this.addModelData.tableName === '') {
          this.errorTip('请填写模型别名');
          return false;
        } else if (this.addModelData.relation === '') {
          this.errorTip('请选择关联模型');
          return false;
        } else if (this.addModelData.listTemplate === '') {
          this.errorTip('请填写列表模型');
          return false;
        } else if (this.addModelData.detailTemplate === '') {
          this.errorTip('请填写详细模板');
          return false;
        }
        this.successTip('已成功添加模板');
        this.dialogAddModelVisible = false;
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
      },
    },
    components:{
      container,
    }
  }
</script>

<style lang="scss" scoped>
  .model-title {
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
    .add-model {
      float: right;
      margin-right: 20px;
    }
  }
  .model-wrapper {
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
  .dialog-title {
    font-size: 20px;
  }
  .dialog-subtitle {
    line-height: 20px;
    font-size: 14px;
    color: #666666;
  }
  .modify-targets {
    margin-top: 20px;
    .operation {
      color: #ff6633;
      span {
        display: inline-block;
        padding: 4px;
        font-size: 14px;
        color: #ff6633;
        cursor: pointer;
      }
    }
  }
  .page {
    margin-top: 20px;
    text-align: center;
  }
  .add-model-form {
    .el-form-block {
      display: flex;
      justify-content: space-between;
      font-size: 0;
      overflow: hidden;
      .el-form-item {
        display: flex;
        width: 45%;
      }
    }
    .button-submit {
      width: 200px;
      margin: 20px auto 0;
      button {
        width: 100%;
      }
    }
  }
  .modify-filed-form{
    width: 320px;
    padding: 0 30px;
    margin: 0 auto;
    .submit-botton{
      text-align: center;
      button{
        width: 150px;
      }
    }
  }
</style>
