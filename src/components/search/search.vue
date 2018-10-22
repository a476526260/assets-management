<template>
  <div class="search">
    <slot name="title"></slot>
    <el-form :inline="true" :model="search" class="demo-form-inline">
      <template v-for="(item,index) in search">
        <el-form-item v-if="item.type=='select'">
          <el-select v-model="item.key" :placeholder="item.placeholder">
            <el-option v-for="(subitem,i) in item.options" :key="i" :label="subitem"
                       :value="subitem"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-else-if="item.type=='input'">
          <el-input :placeholder="item.placeholder" prefix-icon="el-icon-search" v-model="item.key">
          </el-input>
        </el-form-item>
      </template>
    </el-form>
    <div class="form-buttons">
      <el-button type="warning" plain @click="_searchFunc">搜索</el-button>
      <el-button type="warning" plain @click="_resetFunc">重置</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "search",
    props:{
      search:{
        type:Array,
      }
    },
    data(){
      return{
        values:[],
      }
    },
    methods: {
      _searchFunc:function(){
        let _this=this;
        this.values=[];
        this.search.forEach(function (item) {
          _this.values.push(item.key)
        });
        this.$emit('searchFunc',_this.values)
      },
      _resetFunc:function() {
        this.search.forEach(function (item) {
          item.key=''
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .search {
    display: flex;
    flex: 1;
    align-items: center;
    .search-title{
      margin-right: 10px;
      font-size: 16px;
      font-weight: bold;
      color: #333333;
    }
    .demo-form-inline {
      display: flex;
      align-items: center;
      .el-form-item {
        margin-right: 10px;
        margin-bottom: 0;
      }
    }
    .form-buttons {
      flex: 1;
      font-size: 0;
      button {
        padding: 12px 15px !important;
        margin-left: 0;
        margin-right: 10px;
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
</style>
