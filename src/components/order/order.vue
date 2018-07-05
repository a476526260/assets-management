<template>
  <div class="order">
    <departmentCaption></departmentCaption>
    <div class="container">
      <h2 class="order-title">工单系统</h2>
      <div class="demand-submit">
        <div class="block">
          <div class="inline">
            <label>工单编号：</label>
            <span class="order-number">8222222</span>
          </div>
          <div class="inline">
            <label>设备编号:</label>
            <div class="form-ctrl">
              <el-input v-model="input" class="input" placeholder="请输入设备编号" clearable></el-input>
            </div>
          </div>
          <div class="inline">
            <label>问题对接人员:</label>
            <div class="form-ctrl">
              <el-input v-model="input2" class="input" placeholder="请输入对接人员工号" clearable></el-input>
            </div>
          </div>
        </div>

        <div class="block">
          <div class="inline">
            <label>工单类型：</label>
            <div class="form-ctrl">
              <el-select v-model="value" clearable placeholder="请选择工单类型">
                <el-option v-for="item in orderType" :key="item.value" :label="item.value"
                           :value="item.value"></el-option>
              </el-select>
            </div>
          </div>
          <div class="inline">
            <label>　　区域:</label>
            <div class="form-ctrl">
              <el-select v-model="value2" clearable placeholder="请选择区域">
                <el-option v-for="item in orderArea" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </div>
          </div>
          <div class="inline">
            <label>　　　分配给:</label>
            <div class="form-ctrl">
              <el-select v-model="value3" clearable placeholder="请选择分配">
                <el-option v-for="item in allot" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </div>
          </div>
        </div>

        <div class="block">
          <label>工单标题：</label>
          <div class="form-ctrl">
            <el-input v-model="input3" class="input" placeholder="请输入工单标题， 如果标题为空,则自动截取问题的前50个字符." clearable></el-input>
          </div>
        </div>

        <div class="block">
          <label>工单内容：</label>
          <div class="form-ctrl">
            <el-input type="textarea" autosize placeholder="请输入内容" v-model="textarea"></el-input>
          </div>
        </div>

        <div class="button-groups">
          <div class="button">
            <el-button size="medium" type="warning" @click="submit">提 交</el-button>
          </div>
          <div class="button">
            <el-button size="medium" type="info" plain @click="reset">重 置</el-button>
          </div>
        </div>
      </div>

      <div class="order-list">
        <el-table :data="tableData" style="width: 100%" tooltip-effect="light">
          <el-table-column prop="order" label="工单编号" align="center" width="150px"></el-table-column>
          <el-table-column prop="title" label="标题" align="center" width="250px"></el-table-column>
          <el-table-column prop="content" label="内容" align="left" show-overflow-tooltip></el-table-column>
          <el-table-column prop="device" label="设备编号" align="center" width="150px"></el-table-column>
          <el-table-column prop="target" label="对接人" align="center" width="150px"></el-table-column>
          <el-table-column label="状态" align="center" width="120px">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status === '已处理' ? '' : 'danger'" disable-transitions>
                {{scope.row.status}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="time" label="状态生成时间" align="center" width="150px"></el-table-column>
          <el-table-column prop="action" label="操作" align="center" width="150px">
            <template slot-scope="scope">
              <el-button @click.prevent="showDialog(scope.row.order)" size="medium" type="warning" plain round>
                {{scope.row.action}}
              </el-button>
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
    <el-dialog title="" :visible.sync="dialogFormVisible" width="35%" custom-class="dialog" center>
      <div slot="title" class="orderNumber">工单编号：{{form.orderNumber}}</div>
      <div class="dialog-form">
        <el-form :model="form">
          <el-form-item label="分配给：" :label-width="formLabelWidth">
            <el-select v-model="form.target" placeholder="分配给">
              <el-option v-for="item in allot" :key="item.value" :label="item.value" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="工单类型：" :label-width="formLabelWidth">
            <el-select v-model="form.orderType" placeholder="请选择工单类型">
              <el-option v-for="item in orderType" :key="item.value" :label="item.value"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="工单内容：" :label-width="formLabelWidth">
            <el-input type="textarea" v-model="form.orderContent"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="warning" @click="submitData">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios';
  import departmentCaption from "@/components/caption/dcaption"
  export default {
    name: "order",
    data() {
      return {
        currentPage: 1, //当前页码
        input: '',      //请输入设备编号
        input2: '',     //请输入对接人员工号
        input3: '',     //工单标题
        textarea: '',   //内容
        value: '',      //工单类型
        value2: '',     //区域
        value3: '',     //分配给
        orderType: [
          {
            value: "电脑"
          },
          {
            value: "电话"
          },
          {
            value: "ERP"
          },
          {
            value: "OA"
          },
          {
            value: "网站"
          },
          {
            value: "其他"
          }
        ],   //工单类型选择项
        orderArea: [
          {
            value: "花园坊A3 G401"
          },
          {
            value: "花园坊A3 G402"
          },
          {
            value: "花园坊A3 G403"
          },
          {
            value: "花园坊A3 G404"
          },
          {
            value: "花园坊A5 G203"
          }
        ],   //区域选择项
        allot: [
          {
            value: "自动分配"
          },
          {
            value: "待分配"
          },
          {
            value: "网管1"
          },
          {
            value: "网管2"
          },
          {
            value: "网管3"
          }
        ],       //分配对象选择项
        tableData: [
          {
            order: '8222221',
            title: '电脑坏了,无法重启',
            content: '电脑没声音，',
            device: '012',
            target: '帅哥',
            status: '已处理',
            time: '2018.05.05',
            action: '分配'
          },
          {
            order: '8222222',
            title: '电脑坏了,无法重启',
            content: '鼠标坏了，换个鼠标鼠标坏了，换个鼠标鼠标坏了，换个鼠标鼠标坏了，换个鼠标鼠标坏了，换个鼠标',
            device: '012',
            target: 'denny',
            status: '已处理',
            time: '2018.05.05',
            action: '分配'
          },
          {
            order: '8222223',
            title: '电脑坏了,无法重启',
            content: '显示屏太小，更换显示屏',
            device: '012',
            target: 'queen',
            status: '已处理',
            time: '2018.05.05',
            action: '分配'
          },
          {
            order: '8222224',
            title: '电脑坏了,无法重启',
            content: '键盘坏了',
            device: '012',
            target: 'momo',
            status: '已处理',
            time: '2018.05.05',
            action: '分配'
          },
        ],   //表单数据
        form: {             //分配弹出框数据
          orderNumber: 0,
          target: '',
          orderType: '',
          orderContent: ""
        },
        formLabelWidth: "120px",    //表单宽度
        dialogFormVisible: false    //分配弹出框是否显示
      }
    },
    methods: {
      submit: function () {
        /**工单提交*/
        var _this = this;
        if (this.input3 == '') {
          this.input3 = this.textarea.substr(0, 50);
        }
        axios.get('/api/login', {
          'bh': _this.input,
          'gh': _this.input2,
          'bt': _this.input3,
          'nr': _this.textarea,
          'nx': _this.value,
          'qy': _this.value2,
          'fp': _this.value3
        }).then(function (response) {
          if (response.data.errNo == 0) {
            if (_this.input == '') {
              _this.errorTip('设备编号不能为空！');
              return false;
            } else if (_this.input2 == '') {
              _this.errorTip('对接员工工号不能为空！');
              return false;
            } else if (_this.textarea == '') {
              _this.errorTip('工单内容不能为空！');
              return false;
            } else if (_this.value == '') {
              _this.errorTip('请选择工单类型！');
              return false;
            } else if (_this.value2 == '') {
              _this.errorTip('请选择区域！');
              return false;
            } else if (_this.value3 == '') {
              _this.errorTip('请选择分配对象！');
              return false;
            }
            _this.reset();
          }
        }).catch(function (response) {
          console.log(_this);
        });
      },
      reset: function () {
        /**重置表单*/
        this.input = '';
        this.input2 = '';
        this.input3 = '';
        this.textarea = '';
        this.value = '';
        this.value2 = '';
        this.value3 = '';
      },
      handleSizeChange: function (e) {
        console.log(e)
      },
      handleCurrentChange: function (e) {
        console.log(e);
      },
      showDialog: function (orderNumber) {
        /**显示弹出框*/
        this.dialogFormVisible = true;
        this.form.orderNumber = orderNumber;
      },
      submitData: function () {
        /**分配数据提交*/
        var _this = this;
        axios.get('/api/login').then(function (response) {
          if (response.data.errNo == 0) {
            if (_this.form.target == '') {
              _this.errorTip('请选择分配对象！');
              return false;
            } else if (_this.form.orderType == '') {
              _this.errorTip('请选择工单类型！');
              return false;
            } else if (_this.form.orderContent == '') {
              _this.errorTip('请填写工单内容！');
              return false;
            }
            for (var prop in _this.form) {
              _this.form[prop] = '';
            }
            _this.dialogFormVisible = false;
          }
        }).catch(function (response) {
          console.log(_this);
        });
      },
      errorTip:function(val){
        /**提交错误提示*/
        this.$message({
          showClose: true,
          message: val,
          type: 'error'
        });
      },
    },
    components:{
      departmentCaption
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/scss/layout";

  .order {
    @include fullScreen;
    .container {
      padding-left: 90px;
      padding-right: 50px;
      .order-title {
        padding: 20px 0;
        font-size: 16px;
        color: #333333;
        line-height: 22px;
      }
      .demand-submit {
        padding: 30px;
        background: #ffffff;
        border: 1px solid #e0e0e0;
        border-radius: 5px;
        box-shadow: 0 0 10px #ddd;
        .block {
          margin-top: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          & > label {
            display: block;
            font-size: 14px;
            color: #666666;
          }
          & > .form-ctrl {
            flex: 1;
            margin-left: 1em;
          }
          .inline {
            display: flex;
            align-items: center;
            label {
              flex: 1;
              display: block;
              font-size: 14px;
              color: #666666;
            }
            .form-ctrl {
              width: 200px;
              margin-left: 1em;
            }
            .order-number {
              display: block;
              width: 200px;
              margin-left: 1em;
              font-size: 14px;
              color: #333333;
            }
          }
        }
      }
      .button-groups {
        margin-top: 30px;
        text-align: center;
        font-size: 0;
        .button {
          display: inline-block;
          width: 140px;
          margin: 0 50px;
          button {
            width: 100%;
          }
        }
      }
      .order-list {
        margin-top: 30px;
        padding: 0 20px;
        border: 1px solid #e0e0e0;
        border-radius: 5px;
        background: #ffffff;
        box-shadow: 0 0 10px #ddd;
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
    }
    .orderNumber {
      padding: 20px 0;
      font-size: 20px;
      color: #333333;
      text-align: center;
    }
    .el-dialog__header {
      padding: 0 !important;
    }
    .dialog-footer {
      width: 200px;
      margin: 0 auto;
      button {
        width: 100%;
        font-size: 16px;
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
