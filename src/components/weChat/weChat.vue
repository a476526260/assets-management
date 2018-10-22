<template>
  <container>
    <div class="department-title">
      <div class="title-text">企业微信用户</div>
      <div class="add-department">
        <el-button type="warning" plain @click="getOtherList" size="mini">获取待同步用户</el-button>
        <el-button type="warning" plain @click="pushToStore" size="mini" v-if="showButton">同步数据库</el-button>
      </div>
    </div>

    <div class="department-wrapper">
      <el-table
        v-loading="loading"
        :data="tableData"
        height="100%"
        style="width: 100%"
        tooltip-effect="light"
        size="mini"
        :header-cell-style="setHeaderStyle">
        <el-table-column prop="id" label="ID" align="center" width="100px">
        </el-table-column>
        <el-table-column prop="name" label="姓名" align="center">
        </el-table-column>
        <el-table-column prop="mobile" label="电话" align="center">
        </el-table-column>
        <el-table-column prop="gender" label="性别" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.gender==='1'?'男':'女'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮件" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="userid" label="微信ID" align="center" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="department" label="部门" align="center">
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center">
          <template slot-scope="scope">
            <el-tag type="warning">{{scope.row.status}}</el-tag>
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
        :page-size="pageNum"
        layout="prev, pager, next, total, jumper"
        :total="total">
      </el-pagination>
    </div>
  </container>
</template>

<script>
  import * as ajax from "../../assets/script/ajaxApi"
  import container from '@/components/container/container'
  import tipMixin from "../../assets/script/mixin"
  export default {
    name: "weChat",
    mixins:[tipMixin],
    data() {
      return {
        loading: false,
        currentPage: 1,
        pageNum: 15,
        total: 0,
        tableData: [],
        showButton: false
      }
    },
    mounted() {
      this.$nextTick(function () {
        this.getUserList(this.currentPage)
      })
    },
    methods: {
      getUserList(page) {
        this.loading = true;
        ajax.fetch_get(this.host + '/api/wxusers', {
          page: page,
          listRows: this.pageNum,
        }).then(res => {
          if (res.data.code === 200) {
            this.loading = false;
            this.tableData = res.data.data;
            this.total = res.data.ext.total;
          }
        }).catch(res => {

        })
      },
      getOtherList() {
        ajax.fetch_get(this.host + '/api/syswxusers').then(res => {
          if (res.data.code === 200) {
            this.successTip('已获取到'+res.data.data.total+'条数据');
            if(res.data.data.total>0){
              this.showButton=true;
            }
          }else{
            this.errorTip(res.data.info);
          }
        }).catch(res => {
          throw res;
        })
      },
      pushToStore(){
        ajax.fetch_post(this.host + '/api/syswxusers').then(res => {
          if (res.data.code === 200) {
            this.successTip(res.data.info);
            this.getUserList(this.currentPage);
            if(res.data.data.total===0){
              this.showButton=false;
            }
          }else{
            this.errorTip(res.data.info);
          }
        }).catch(res => {
          throw res
        })
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getUserList(this.currentPage);
      }
    },
    components:{
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
      cursor: pointer;
    }
  }
  .page {
    margin-top: 20px;
    text-align: center;
  }
</style>
