<template>
  <div class="task">
    <departmentCaption>部门列表</departmentCaption>
    <div class="container">
      <div class="task-progress">
        <h2 class="task-title">员工当前位置及任务进度</h2>
        <div class="task-table">
          <el-table :data="tableData" style="width: 100%" :header-cell-style="setStyle" :header-cell-class-name="setClassName" size="mini">
            <el-table-column prop="location" label="位置" align="center"></el-table-column>
            <el-table-column prop="name" label="员工信息" align="center"></el-table-column>
            <el-table-column prop="order" label="工单排序" align="center"></el-table-column>
            <el-table-column prop="status" label="状态" align="center">
              <template slot-scope="scope">
                <el-tag :type="scope.row.status === '处理中' ? '' : 'danger'" disable-transitions>
                  {{scope.row.status}}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="assets-card-list">
          <div class="assets-cart-item" v-for="(card,index) in cards" :key='index'>
            <el-card class="box-card">
              <div slot="header" class="card-header">
                <span>{{card.title}}</span>
              </div>
              <div class="card-inf">
                <p>已入库:<span>{{card.storeIn}}</span></p>
                <p>可出库:<span>{{card.mayOut}}</span></p>
                <p>维修中:<span>{{card.repair}}</span></p>
                <p>已报废:<span>{{card.scrap}}</span></p>
                <p>已出库:<span>{{card.storeOut}}</span></p>
              </div>
            </el-card>
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
  </div>
</template>

<script>
  import departmentCaption from "@/components/caption/dcaption"
  export default {
    name: "dailyTask",
    data() {
      return {
        currentPage: 1,   //当前页码
        tableData: [
          {
            location: '花园坊A3 G401',
            name: '员工一',
            order: 'GD822221',
            status: '处理中'
          },
          {
            location: '花园坊A3 G401',
            name: '员工二',
            order: 'GD822222',
            status: '未处理'
          },
          {
            location: '花园坊A3 G401',
            name: '员工三',
            order: 'GD822223',
            status: '处理中'
          },
          {
            location: '花园坊A3 G401',
            name: '员工四',
            order: 'GD822224',
            status: '处理中'
          },
          {
            location: '花园坊A3 G401',
            name: '员工五',
            order: 'GD822225',
            status: '处理中'
          },
          {
            location: '花园坊A3 G401',
            name: '员工六',
            order: 'GD822226',
            status: '处理中'
          }
        ], //表单数据
        cards: [
          {
            title: "[ 电脑 ] 资产概况",
            storeIn: 2222,
            mayOut: 3333,
            repair: 4444,
            scrap: 5555,
            storeOut: 666
          },
          {
            title: "[ 座机 ] 资产概况",
            storeIn: 2222,
            mayOut: 3333,
            repair: 4444,
            scrap: 5555,
            storeOut: 666
          },
          {
            title: "[ 手机 ] 资产概况",
            storeIn: 2222,
            mayOut: 3333,
            repair: 4444,
            scrap: 5555,
            storeOut: 666
          },
          {
            title: "[ 电脑 ] 资产概况",
            storeIn: 2222,
            mayOut: 3333,
            repair: 4444,
            scrap: 5555,
            storeOut: 666
          },
          {
            title: "[ 电脑 ] 资产概况",
            storeIn: 2222,
            mayOut: 3333,
            repair: 4444,
            scrap: 5555,
            storeOut: 666
          },
          {
            title: "[ 电脑 ] 资产概况",
            storeIn: 2222,
            mayOut: 3333,
            repair: 4444,
            scrap: 5555,
            storeOut: 666
          },
        ]      //卡片数据
      }
    },
    methods: {
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
      setStyle:function(row, rowIndex, columnIndex){
        /**设置表头格式*/
        return { fontWeight:"bold","fontSize":"16px","textAlign":"center"}
      },
      setClassName:function () {
        /**设置表头类名*/
        return "headerCell"
      }
    },
    props: {

    },
    components:{
      departmentCaption
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/scss/layout";

  .task {
    @include fullScreen;
    .container {
      padding-left: 90px;
      padding-right: 50px;
      .task-progress {
        .task-title {
          padding: 20px 0;
          font-size: 16px;
          color: #333333;
          line-height: 22px;
        }
        .task-table {
          padding: 0 20px;
          background: #ffffff;
        }
        .assets-card-list{
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          .assets-cart-item{
            width: 30%;
            margin-top: 30px;
            .card-header{
              font-size: 16px;
              text-align: center;
            }
            .card-inf{
              p{
                font-size: 14px;
                line-height: 24px;
                color: #999999;
                overflow: hidden;
                span{
                  float: right;
                  color: #333333;
                }
              }
            }
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
  }
</style>
