<template>
  <container>
    <div class="department-title">
      <div class="title-text">部门列表展示</div>
    </div>

    <div class="department-wrapper">
      <div class="filter">
        <el-input
          placeholder="输入关键字进行过滤" v-model="filterText">
        </el-input>
      </div>
      <el-tree ref="tree" :data="tableData" node-key="id" :default-expanded-keys="[1]" highlight-current accordion :props="prop" :filter-node-method="filterNode"></el-tree>
    </div>
  </container>
</template>

<script>
  import * as ajax from "../../assets/script/ajaxApi"
  import container from '@/components/container/container'
  import tipMixin from "../../assets/script/mixin"
  export default {
    name: "department",
    mixins:[tipMixin],
    data() {
      return {
        filterText:'',
        tableData: [],
        prop:{
          label:'name',
          children:'children',
        }
      }
    },
    mounted(){
      this.$nextTick(function () {
        this.gerDepartmentList()
      })
    },
    watch:{
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    methods: {
      gerDepartmentList(){
        ajax.fetch_get(this.host+'/api/department').then(res=>{
          if(res.data.code===200){
            this.tableData=res.data.data
          }
        })
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
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
    position: absolute;
    left: 0;
    right: 0;
    top: 70px;
    bottom: 50px;
    box-shadow: 0 0 10px #dddddd;
    border-radius: 5px;
    overflow: auto;
    .filter{
      margin-bottom: 20px;
    }
  }
</style>
