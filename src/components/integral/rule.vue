<template>
  <container>
    <breadcrumb :nav="breadcrumb"></breadcrumb>
    <div class="rule-content">
      <div class="table-wrapper">
        <el-table
          :data="tableData"
          border
          height="100%"
          style="width: 100%">
          <el-table-column
            fixed
            prop="title"
            label="分值项"
            align="center">
          </el-table-column>
          <el-table-column
            prop="value"
            label="分值"
            align="center">
          </el-table-column>
          <el-table-column
            label="操作"
            align="center">
            <template slot-scope="scope">
              <el-button @click="handleDel(scope.row)" type="text" size="small">删除</el-button>
              <el-button @click="handleEdtor(scope.row)" type="text" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="tip"><span>i</span>填写积分赠送数值，只可填写整数</div>

      <!--<div class="rule-fill-input">
        <el-form label-position="right" label-width="200px" :model="ruleMarkData">
          <el-form-item label="签到送积分：">
            <el-input v-model="ruleMarkData.signMark"></el-input>
          </el-form-item>
          <el-form-item label="分享一次送积分：">
            <el-input v-model="ruleMarkData.shareMark"></el-input>
          </el-form-item>
          <el-form-item label="分享每被阅读一次送积分：">
            <el-input v-model="ruleMarkData.readedMark"></el-input>
          </el-form-item>
          <el-form-item label="分享每获取一次表单：">
            <el-input v-model="ruleMarkData.getFormMark"></el-input>
          </el-form-item>
        </el-form>
        <div class="saveData"><el-button type="primary" size="mini">保存</el-button></div>
      </div>-->

    </div>
  </container>
</template>

<script>
  import * as ajax from "../../assets/script/ajaxApi";
  import container from '@/components/container/container';
  import breadcrumb from '@/components/common/breadcrumb';
  import tipMixin from "../../assets/script/mixin";

  export default {
    name: "rule",
    data() {
      return {
        breadcrumb: [                     //面包屑导航
          {
            title: '首页',
            url: '/',
          },
          {
            title: '积分管理',
            url: '/main/group',
          },
          {
            title: '积分规则',
            url: '',
          }
        ],
        tableData:[
          {
            title:"签到送积分",
            value:2
          },
          {
            title:"分享一次送积分",
            value:5
          },
          {
            title:"分享每被阅读一次送积分",
            value:8
          },
          {
            title:"分享每获取一次表单",
            value:10
          }
        ]
      }
    },
    mixins:[tipMixin],
    methods: {
      handleDel(data){
        console.log(data)
      },
      handleEdtor(data){
        console.log(data)
      }
    },
    components: {
      container,
      breadcrumb
    }
  }
</script>

<style lang="scss" scoped>
  .rule-content{
    position: absolute;
    left: 4%;
    right: 4%;
    top: 60px;
    bottom: 50px;
    background: #ffffff;
    .tip{
      width: 450px;
      height: 36px;
      position: absolute;
      bottom: 20px;
      left: 50%;
      margin-left: -225px;
      line-height: 36px;
      background: rgba(230, 243, 252, 1);
      border-radius: 4px;
      font-size: 14px;
      color: #666666;
      span{
        display: inline-block;
        width: 14px;
        height: 14px;
        margin: 0 10px;
        border-radius: 50%;
        background: rgba(16, 142, 233, 1);
        text-align: center;
        line-height: 14px;
        font-size: 12px;
        font-family: fantasy;
        color: #ffffff;
        vertical-align: middle;
      }
    }
    .table-wrapper{
      position:absolute;
      width: 100%;
      left: 0;
      right: 0;
      top: 0;
      bottom: 80px;
    }
    /*.rule-fill-input{
      width: 420px;
      margin: 0 auto;
    }*/
  }
</style>
