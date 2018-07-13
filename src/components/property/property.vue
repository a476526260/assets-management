<template>
  <div class="property">
    <departmentCaption>部门列表</departmentCaption>
    <div class="container">
      <div class="property-title">
        <div class="title-text">属性管理<span>* 属性创建好后,禁止任何形式的删除,属性值可以删除.</span></div>
        <div class="add-property">
          <el-button type="warning" plain @click="addProperty" size="mini">添加属性</el-button>
        </div>
      </div>

      <div class="property-wrapper">
        <el-table
          :data="tableData"
          height="100%"
          style="width: 100%"
          :header-cell-style="setHeaderStyle">
          <el-table-column prop="ID" label="ID" align="center">
          </el-table-column>
          <el-table-column prop="name" label="名称" align="center">
          </el-table-column>
          <el-table-column prop="relation" label="别名" align="center">
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <span class="modify" @click="modifyProp(scope)">修改</span>
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
    <!--修改属性-->
    <el-dialog title="属性列表修改" :visible.sync="dialogModifyPropertyVisible" center width="45%"
               @close="closeModifyPropertyFunc">
      <div class="dialog-title" slot="title">【{{modifyProperty.propertyName}}】属性列表</div>
      <div class="modify-property-form">
        <div class="add-property">
          <div class="add-property-title">增加属性:</div>
          <div class="add-property-form">
            <el-form :inline="true" :model="addPropertyOption" class="demo-form-inline">
              <el-form-item label="属性">
                <el-input v-model="addPropertyOption.prop"></el-input>
              </el-form-item>
              <el-form-item label="上级">
                <el-select v-model="addPropertyOption.level" placeholder="上级">
                  <el-option label="1" value="1"></el-option>
                  <el-option label="2" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="属性值">
                <el-input v-model="addPropertyOption.propVal"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="warning" plain @click="addPropertyThis">添加</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="modify-property">
          <el-table
            :data="modifyProperty.data"
            max-height="330"
            style="width: 100%"
            border>
            <el-table-column prop="ID" label="ID" align="center">
            </el-table-column>
            <el-table-column prop="property" label="属性" align="center">
            </el-table-column>
            <el-table-column prop="propertyVal" label="属性值" align="center">
            </el-table-column>
            <el-table-column prop="level" label="层级" align="center">
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <div class="operation">
                  <span class="edit" @click="modifyPropThis(scope)">修改</span> | <span class="delete" @click="delThis(scope)">删除</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="page">
          <el-pagination
            background
            small
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="modifyDataPage"
            :page-size="100"
            layout="prev, pager, next, jumper"
            :total="1000">
          </el-pagination>
        </div>
      </div>
    </el-dialog>

    <!--修改属性选项-->
    <el-dialog title="修改属性选项值" :visible.sync="dialogModifyOptionsVisible" center width="30%">
      <div class="dialog-title" slot="title">修改属性选项</div>
      <div class="modify-prop-option">
        <el-form label-position="right" label-width="70px" :model="modifyOptionData">
          <el-form-item label="属性：">
            <el-input v-model="modifyOptionData.prop"></el-input>
          </el-form-item>
          <el-form-item label="属性值：">
            <el-input v-model="modifyOptionData.propVal"></el-input>
          </el-form-item>
          <el-form-item label="层级：">
            <el-input v-model="modifyOptionData.level"></el-input>
          </el-form-item>
          <div class="submit">
            <el-button class='modify-button' type="warning" plain @click="modifyOptionFunc">修改</el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>

    <!--添加属性-->
    <el-dialog title="增加属性" :visible.sync="dialogAddPropertyVisible" center width="40%">
      <div class="dialog-title" slot="title">增加属性</div>
      <div class="add-property-form">
        <el-form label-position="left" label-width="60px" :model="addPropertyData">
          <el-form-item label="名称：">
            <el-input v-model="addPropertyData.name"></el-input>
          </el-form-item>
          <el-form-item label="别名：">
            <el-input v-model="addPropertyData.relation"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class='add-button' type="warning" plain @click="addPropertyFunc">增加</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import departmentCaption from "@/components/caption/dcaption"

  export default {
    name: "property",
    data() {
      return {
        currentPage: 2,                              //当前分页
        tableData: [
          {
            ID: '1',
            name: '在职状态',
            relation: 'entryStatus',
            properties: [
              {
                ID: 123,
                property: '在职',
                propertyVal: 22,
                level: 1
              },
              {
                ID: 124,
                property: '离职',
                propertyVal: 23,
                level: 1
              },
              {
                ID: 125,
                property: '待入职',
                propertyVal: 24,
                level: 1
              },
            ]
          },
          {
            ID: '2',
            name: '办公区域',
            relation: 'officeArea',
            properties: [
              {
                ID: 221,
                property: '花园坊A3',
                propertyVal: 30,
                level: 1
              },
              {
                ID: 222,
                property: '花园坊A4',
                propertyVal: 31,
                level: 1
              },
              {
                ID: 223,
                property: '花园坊A5',
                propertyVal: 32,
                level: 1
              },
              {
                ID: 224,
                property: '北京',
                propertyVal: 33,
                level: 1
              }
            ]
          },
          {
            ID: '3',
            name: '部门管理',
            relation: 'department',
            properties: [
              {
                ID: 440,
                property: 'IT部',
                propertyVal: 50,
                level: 1
              },
              {
                ID: 441,
                property: '人事部',
                propertyVal: 51,
                level: 1
              },
              {
                ID: 442,
                property: '行政部',
                propertyVal: 52,
                level: 1
              },
              {
                ID: 443,
                property: '网络营销部',
                propertyVal: 53,
                level: 1
              },
              {
                ID: 444,
                property: '数据中心',
                propertyVal: 54,
                level: 1
              },
              {
                ID: 445,
                property: '高顿网校',
                propertyVal: 55,
                level: 1
              }
            ]
          },
          {
            ID: '4',
            name: '管理员等级',
            relation: 'adminLevel',
            properties: [
              {
                ID: 111,
                property: '全部',
                propertyVal: 61,
                level: 1
              },
              {
                ID: 112,
                property: '部分',
                propertyVal: 62,
                level: 1
              }
            ]
          }
        ],
        modifyDataPage: 5,                           //修改属性窗口分页
        dialogModifyPropertyVisible: false,          //修改属性窗口是否显示
        modifyProperty: {                            //修改属性相关数据
          propertyName: '',                          //修改属性对象标题
          data: []
        },
        addPropertyOption: {                          //添加属性选项值相关数据
          prop: '',                                   //属性
          propVal: '',                                //属性值
          level: '',                                  //上级
        },
        dialogAddPropertyVisible: false,              //增加属性对话框是否显示
        addPropertyData: {
          name: '',                                   //属性名
          relation: ''                                //属性别名
        },
        dialogModifyOptionsVisible: false,            //修改属性选项
        modifyOptionIndex: '',                         //被修改属性的索引
        modifyOptionData: {
          prop: '',
          propVal: '',
          level: ''
        }
      }
    },
    methods: {
      addProperty: function () {
        /**显示增加属性弹窗*/
        this.dialogAddPropertyVisible = true;
      },
      addPropertyFunc: function () {
        /**增加属性*/
        if (this.addPropertyData.name == '') {
          this.showErrorTip('请填写属性名称！');
          return false;
        } else if (this.addPropertyData.relation == '') {
          this.showErrorTip('请填写属性别名！');
          return false;
        }
        var len = this.tableData.length;
        this.tableData.push({
          ID: len + 1,
          name: this.addPropertyData.name,
          relation: this.addPropertyData.relation,
          properties: []
        });
        this.dialogAddPropertyVisible = false;
        this.clearObjVal(this.addPropertyData);
      },
      modifyProp: function (data) {
        /**修改属性*/
        this.dialogModifyPropertyVisible = true;
        this.modifyProperty.propertyName = data.row.name;
        this.modifyProperty.data = this.tableData[data.$index].properties;
        console.log(this.modifyProperty.data)
      },
      addPropertyThis: function () {
        /**添加属性选项*/
        this.modifyProperty.data.push({
          ID: this.modifyProperty.data.length == 0 ? 1 : this.modifyProperty.data[this.modifyProperty.data.length - 1]['ID'] + 1,    //被添加选项ID+1
          property: this.addPropertyOption.prop,
          propertyVal: this.addPropertyOption.propVal,
          level: this.addPropertyOption.level
        })
      },
      clearObjVal: function (obj) {
        for (var prop in obj) {
          obj[prop] = '';
        }
      },
      modifyPropThis: function (data) {
        /**显示修改属性选项弹出框*/
        this.dialogModifyOptionsVisible = true;
        this.modifyOptionIndex = data.$index;
        this.modifyOptionData.prop = this.modifyProperty.data[this.modifyOptionIndex].property;
        this.modifyOptionData.propVal = this.modifyProperty.data[this.modifyOptionIndex].propertyVal;
        this.modifyOptionData.level = this.modifyProperty.data[this.modifyOptionIndex].level;
      },
      modifyOptionFunc: function () {
        /**修改属性选项*/
        if (this.modifyOptionData.prop == '') {
          this.showErrorTip('请填写属性名');
          return false;
        } else if (this.modifyOptionData.propVal == '') {
          this.showErrorTip('请填写属性值');
          return false;
        } else if (this.modifyOptionData.level == '') {
          this.showErrorTip('请填写上级');
          return false;
        }
        this.showSuccessTip('修改成功');
        this.modifyProperty.data[this.modifyOptionIndex].property = this.modifyOptionData.prop;
        this.modifyProperty.data[this.modifyOptionIndex].propertyVal = this.modifyOptionData.propVal;
        this.modifyProperty.data[this.modifyOptionIndex].level = this.modifyOptionData.level;
        this.dialogModifyOptionsVisible = false;
        this.clearObjVal(this.modifyOptionData);
      },
      delThis: function (data) {
        /**删除属性选项*/
        let _this = this;
        this.$confirm('删除该属性选项, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          _this.modifyProperty.data.splice(data.$index, 1)
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
      closeModifyPropertyFunc: function () {
        /**关闭修改属性选项弹窗清空添加选项数据*/
        this.clearObjVal(this.addPropertyOption)
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
    },
    components: {
      departmentCaption
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/scss/layout";

  .property {
    @include fullScreen;
    .container {
      padding-left: 90px;
      padding-right: 50px;
      height: 100%;
      .property-title {
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
        .add-property {
          float: right;
          margin-right: 20px;
        }
      }
      .property-wrapper {
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
    .dialog-title {
      font-size: 20px;
    }
    .modify-property-form {
      .add-property {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .add-property-title {
          width: 80px;
          font-size: 14px;
          color: #000000;
          font-weight: bold;
        }
        .add-property-form {
          flex: 1;
          .el-form {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .el-form-item {
              display: flex;
              margin-bottom: 0;
            }
          }
        }
      }
      .modify-property {
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
    }
    .add-property-form {
      width: 60%;
      margin: 0 auto;
      .add-button {
        display: block;
        width: 150px;
        margin: 0 auto;
      }
    }
    .modify-prop-option {
      width: 60%;
      margin: 0 auto;
      .modify-button {
        display: block;
        width: 120px;
        margin: 0 auto;
      }
    }
  }
</style>
