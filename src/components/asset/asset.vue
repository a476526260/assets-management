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
            <el-button type="warning" plain @click="">搜索</el-button>
            <el-button type="warning" plain @click="">重置</el-button>
            <el-button type="warning" plain @click="">批量导入资产</el-button>
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
                <span class="detail">详细</span>|<span class="store">出入库</span>
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
          <el-button type="warning" plain size="mini" @click="">批量出库</el-button>
        </div>
        <div class="operation-item">
          <el-button type="warning" plain size="mini" @click="">批量入库</el-button>
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
    </div>

  </div>
</template>

<script>
  import departmentCaption from "@/components/caption/dcaption"

  export default {
    name: "asset",
    data() {
      return {
        checkAll:false,
        currentPage:2,
        search: {
          type: '',
          status: '',
          area: '',
          keywords: ''
        },
        tableData: [
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
        multipleSelection: []
      }
    },
    mounted(){
      var _this=this;
      this.$nextTick(function () {


      })
    },
    methods: {
      handleCheckAllChange() {
        if(!this.checkAll){
          this.tableData.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row,false);
          });
        }else{
          this.tableData.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row,true);
          });
        }
      },
      handleSelectionChange(val) {
        if(val.length===this.tableData.length){
          this.checkAll=true
        }else{
          this.checkAll=false
        }
        this.multipleSelection = val;
      },
      setHeaderStyle: function () {
        return { "fontSize": "16px", "background": "#f9f9f9"}
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
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
      .operation{
        color: #ff6633!important;
        span{
          padding: 5px;
          color: #ff6633;
          cursor: pointer;
        }
      }
      .form-operation{
        display: flex;
        margin-top: 20px;
        align-items: center;
        .operation-item{
          margin-left: 30px;
        }
      }
      .page{
        margin-top: 20px;
        text-align: center;
        .el-pagination{
          .btn-prev{
            background: none!important;
          }
        }
      }
    }
  }
</style>
