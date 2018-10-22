<template>
  <container>
    <!-- <div class="demand-submit">
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
           <label>姓名:</label>
           <div class="form-ctrl">
             <el-input v-model="input4" class="input" placeholder="请输入姓名" clearable></el-input>
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
     </div>-->
    <div class="search-condition">
      <search :search="search" @searchFunc="searchData">
        <h1 class="search-title" slot="title">工单系统</h1>
      </search>
    </div>
    <div class="order-list">
      <el-table :data="tableData" style="width: 100%" :header-cell-style="setStyle" tooltip-effect="light" size="mini"
                height="100%" max-height="100%">
        <el-table-column prop="title" label="标题" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="content" label="故障描述" align="left" show-overflow-tooltip></el-table-column>
        <el-table-column prop="username" label="报修人" align="center"></el-table-column>
        <el-table-column prop="department" label="报修地点" align="center"></el-table-column>
        <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status.code === '0' ? 'danger' : ''" disable-transitions>
              {{scope.row.status.info}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="update_time" label="状态生成时间" align="center"></el-table-column>
        <el-table-column prop="action" label="操作" align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status.code=='0'" @click.prevent="showDialog(scope)" size="medium"
                       type="warning" plain round>
              分配
            </el-button>
            <el-button v-else @click.prevent="showDialog(scope.row.order)" size="medium" type="warning" plain round>
              查看
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
        :page-size="pageNum"
        layout="prev, pager, next, total, jumper"
        :total="totalNum">
      </el-pagination>
    </div>
    <el-dialog title="" :visible.sync="dialogFormVisible" width="35%" custom-class="dialog" center>
      <div slot="title" class="orderNumber">工单编号：{{form.orderID}}</div>
      <div class="dialog-form">
        <el-form :model="form">
          <el-form-item label="分配给：" :label-width="formLabelWidth">
            <el-select v-model="form.target" placeholder="分配给">
              <el-option v-for="item in allot" :key="item.userid" :label="item.name" :value="item.userid"></el-option>
            </el-select>
          </el-form-item>
          <!--<el-form-item label="工单类型：" :label-width="formLabelWidth">
            <el-select v-model="form.orderType" placeholder="请选择工单类型">
              <el-option v-for="item in orderType" :key="item.value" :label="item.value"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>-->
          <el-form-item label="备注：" :label-width="formLabelWidth">
            <el-input type="textarea" v-model="form.orderContent"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="warning" @click="submitData">提 交</el-button>
      </div>
    </el-dialog>
  </container>
</template>

<script>
  import {mapState} from 'vuex'
  import {mapActions} from 'vuex'
  import * as ajax from '../../assets/script/ajaxApi'
  import search from '@/components/search/search'
  import container from '@/components/container/container'
  import tipMixin from "../../assets/script/mixin"
  export default {
    name: "order",
    mixins:[tipMixin],
    data() {
      return {
        token: '',
        currentPage: 1, //当前页码
        pageNum: '',    //每页条数
        totalNum: 0,    //总条数
        input: '',      //请输入设备编号
        input2: '',     //请输入对接人员工号
        input3: '',     //工单标题
        input4: '',     //姓名
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
        allot: [],       //分配对象选择项
        tableData: [],   //表单数据
        clickIndex: 0,
        statusInfo: ['未处理', '已分配', '处理中', '处理完成'],
        form: {             //分配弹出框数据
          orderID: 0,
          target: '',
          orderType: '',
          orderContent: ""
        },
        formLabelWidth: "120px",    //表单宽度
        dialogFormVisible: false,    //分配弹出框是否显示
        search: [
          {
            key: '',
            placeholder: '请输入要搜索的关键词',
            type: 'input'
          },
        ]
      }
    },
    mounted() {
      let _this = this;
      this.$nextTick(function () {
        this._computerH();
        this.getDataFunc(this.currentPage);
        window.addEventListener('resize', function () {
          setTimeout(function () {
            _this._computerH();
            _this.getDataFunc(_this.currentPage);
          },1500);
        });
        setInterval(function () {
          _this._computerH();
          _this.getDataFunc(_this.currentPage);
        }, 1000 * 60);
        /**网管选项*/
        this.getGroupUser().then(res => {
          if (res.data.code === 200) {
            this.allot = res.data.data;
          }else{
            this.errorTip(res.data.info)
          }
        }).catch(res => {
          console.log(res);
        });
      })
    },
    methods: {
      searchData: function (e) {
        /**搜索*/

      },
      submit: function () {
        /**工单提交*/
        let _this = this;
        if (this.input3 === '') {
          this.input3 = this.textarea.substr(0, 50);
        }
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
        this.getDataFunc(e)
      },
      searchFunc: function () {
      },
      resetFunc: function () {
      },
      showDialog: function (scope) {
        /**显示弹出框*/
        this.clickIndex = scope.$index;
        this.dialogFormVisible = true;
        this.form.orderID = scope.row.id;
      },
      submitData: function () {
        /**分配数据提交*/
        if (this.form.target === '') {
          this.errorTip('请选择分配对象！');
          return false;
        }
        ajax.fetch_put(this.host + '/api/work/'+this.form.orderID, {
          userid: this.form.target,
          remark: this.form.orderContent,
        }).then(res=>{
          if (res.data.code === 200) {
            for (let prop in this.form) {
              this.form[prop] = '';
            }
            this.successTip('工单分配成功！');
            this.dialogFormVisible = false;
            this.getDataFunc(this.currentPage);
          } else {
            this.errorTip(res.data.info);
          }
        }).catch(res=> {
          console.log(res);
        });
      },
      getDataFunc(page) {
        ajax.fetch_get(this.host + '/api/work', {
          page: page,
          listRows: this.pageNum
        }).then(res=> {
          if (res.data.code === 200) {
            this.totalNum = res.data.ext.total;
            this.tableData = res.data.data
          } else {
            this.errorTip(res.data.info);
          }
        }).catch(res=> {
          console.log(res);
        });
      },
      setStyle: function (row, rowIndex, columnIndex) {
        /**设置表头格式*/
        return {fontWeight: "bold", "fontSize": "16px", "textAlign": "center"}
      },
      _computerH: function () {
        if(document.querySelector('.order-list')){
          document.querySelector('.order-list').style.height = window.innerHeight - document.querySelector('.page').offsetHeight - document.querySelector('.search-condition').offsetHeight - 100 + 'px';
          let _hei = parseInt(document.querySelector('.order-list').style.height);
          this.pageNum = parseInt((_hei - 38) / 50);
        }
      },
      ...mapActions([
        'getGroupUser'
      ])
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
    display: flex;
    align-items: center;
  }
  .order-title {
    margin-right: 20px;
    padding: 20px 0;
    font-size: 16px;
    color: #333333;
    line-height: 22px;
  }
  .search {
    flex: 1;
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
    height: 75%;
    margin-top: 20px;
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
</style>
