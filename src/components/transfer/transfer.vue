<template>
  <div class="transfer">
    <div class="transfer-panel">
      <div class="transfer-panel-header">
        <span>待添加</span>
        <span class="checknumber"><i>{{originalCurrent}}/{{originalTotal}}</i></span>
      </div>
      <div class="transfer-panel-body">
        <div class="search-box">
          <el-input
            placeholder="请输入姓名"
            prefix-icon="el-icon-search"
            size="mini"
            v-model="search.original">
          </el-input>
        </div>
        <div class="transfer-panel-list">
          <label class="transfer-panel-item" v-for="(item,index) in originalData" :key="index">
            <el-checkbox v-model="originalItemCheck['_'+item.id]" @change="handleOriginalChange"></el-checkbox>
            <span class="">{{item.name}}</span>
          </label>
        </div>
      </div>
    </div>
    <div class="transfer-buttons">
      <el-button :type="disabled_1?'primary':'info'"
                 :disabled="disabled_1?false:true" @click="add">添加<i
        class="el-icon-arrow-right el-icon--right"></i></el-button>
      <el-button icon="el-icon-arrow-left" :type="disabled_2?'primary':'info'"
                 :disabled="disabled_2?false:true" @click="del">删除
      </el-button>
    </div>
    <div class="transfer-panel">
      <div class="transfer-panel-header">
        <span>已存在</span>
        <span class="checknumber"><i>{{targetCurrent}}/{{targetTotal}}</i></span>
      </div>
      <div class="transfer-panel-body">
        <div class="search-box">
          <el-input
            placeholder="请输入姓名"
            prefix-icon="el-icon-search"
            size="mini"
            v-model="search.target">
          </el-input>
        </div>
        <div class="transfer-panel-list">
          <label class="transfer-panel-item" v-for="(item,index) in targetData" :key="index">
            <el-checkbox v-model="targetItemCheck['_'+item.id]" @change="handleTargetChange"></el-checkbox>
            <span class="">{{item.name}}</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "transfer",
    data() {
      return {
        originalItemCheck: {},
        originalTotal: 0,
        originalCurrent: 0,
        originalCheckBoxArr: [],
        targetItemCheck: {},
        targetTotal: 0,
        targetCurrent: 0,
        targetCheckBoxArr: [],
        disabled_1: false,
        disabled_2: false,
        search:{
          original:'',
          target:'',
        }
      }
    },
    props: {
      originalData: {
        type: Object,
        default: {}
      },
      targetData: {
        type: Object,
        default: {}
      }
    },
    watch: {
      originalData(n, o) {
        this.originalItemCheck = {};
        this.originalCurrent = this.originalCheckBoxArr.length;
        this.originalTotal = this.originalData.length;
        this.originalCurrent = 0;
        this.originalData.forEach((v, i) => {
          this.originalItemCheck['_' + v.id] = false;
        })
      },
      targetData() {
        this.targetItemCheck = {};
        this.targetTotal = this.targetData.length;
        this.targetCurrent = 0;
        this.targetData.forEach((v, i) => {
          this.targetItemCheck['_' + v.id] = false;
        })
      },
      originalCheckBoxArr() {
        if (this.originalCheckBoxArr.length > 0) {
          this.disabled_1 = true;
        } else {
          this.disabled_1 = false;
        }
      },
      targetCheckBoxArr() {
        if (this.targetCheckBoxArr.length > 0) {
          this.disabled_2 = true;
        } else {
          this.disabled_2 = false;
        }
      },
      'search.original':function (_new,_old) {
        this.searchOriginal();
      }
    },
    mounted() {
      this.$nextTick(function () {
        if (this.originalData.length > 0) {
          this.originalTotal = this.originalData.length;
          this.targetTotal = this.targetData.length;
          this.targetCurrent = this.targetCheckBoxArr.length;
        }
      })
    },
    destroyed() {
      this.originalData = {};
      this.targetData = {};
    },
    methods: {
      del() {
        this.$emit('handleDel', this.targetCheckBoxArr);
        this.disabled_2=false;
      },
      add() {
        console.log(this.originalItemCheck);
        this.$emit('handleAdd', this.originalCheckBoxArr);
        this.disabled_1=false;
      },
      searchOriginal(){
        this.$emit('searchOriginal', this.search.original);
      },
      handleOriginalChange(val) {
        this.originalCheckBoxArr = [];
        for (let prop in this.originalItemCheck) {
          if (this.originalItemCheck[prop]) {
            this.originalCheckBoxArr.push(prop)
          }
        }
        this.originalTotal = this.originalData.length;
        this.originalCurrent = this.originalCheckBoxArr.length;
      },
      handleTargetChange(val) {
        this.targetCheckBoxArr = [];
        for (let prop in this.targetItemCheck) {
          if (this.targetItemCheck[prop]) {
            this.targetCheckBoxArr.push(prop)
          }
        }
        this.targetTotal = this.targetData.length;
        this.targetCurrent = this.targetCheckBoxArr.length;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .transfer {
    display: flex;
    justify-content: center;
    align-items: center;
    .transfer-panel {
      width: 200px;
      height: 404px;
      max-height: 100%;
      box-sizing: border-box;
      position: relative;
      vertical-align: middle;
      border: 1px solid #ebeef5;
      border-radius: 4px;
      overflow: hidden;
      background: #fff;
    }
    .transfer-panel-header {
      height: 40px;
      line-height: 40px;
      margin: 0;
      background: #f5f7fa;
      box-sizing: border-box;
      padding-left: 15px;
      border-bottom: 1px solid #ebeef5;
      color: #000;
    }
    .transfer-panel-body {
      height: 364px;
      overflow: auto;
    }
    .checkbox-input {
      position: relative;
      display: block;
      float: left;
      width: 14px;
      height: 14px;
      margin: 13px 0;
      border: 1px solid #dcdfe6;
      box-sizing: border-box;
      border-radius: 3px;
      .checkbox-inner {
        position: relative;
        display: block;
        width: 14px;
        height: 14px;
        border: 1px solid #dcdfe6;
        border-radius: 2px;
        box-sizing: border-box;
        background-color: #fff;
        z-index: 1;
        &.is-checked {
          background-color: #409eff;
          border-color: #409eff;
        }
        &:after {
          content: "";
          position: absolute;
          left: 4px;
          top: 1px;
          width: 3px;
          height: 7px;
          box-sizing: content-box;
          border: 1px solid #fff;
          border-left: 0;
          border-top: 0;
          transform: rotate(45deg) scaleY(0);
          transform-origin: center;
        }
        &.is-checked:after {
          transform: rotate(45deg) scaleY(1);
        }
      }
      .checkbox-original {
        opacity: 0;
        outline: 0;
        position: absolute;
        margin: 0;
        width: 0;
        height: 0;
        z-index: -1;
      }
    }
    .checknumber {
      margin-left: 5px;
      i {
        position: absolute;
        font-style: normal;
        right: 15px;
        color: #909399;
        font-size: 12px;
        font-weight: 400;
      }
    }
    .search-box {
      display: block;
      width: auto;
      margin: 15px;
      box-sizing: border-box;
      text-align: center;
      input {
        width: 100%;
        height: 32px;
        display: inline-block;
        padding-right: 10px;
        padding-left: 30px;
        font-size: 12px;
        box-sizing: border-box;
        border: 1px solid #dcdfe6;
        border-radius: 16px;
        outline: none;
      }
    }
    .transfer-panel-list {
      .transfer-panel-item {
        display: block;
        padding-left: 15px;
        height: 30px;
        line-height: 30px;
        color: #606266;
        cursor: pointer;
        span {
          padding-left: 10px;
        }
      }
    }
    .transfer-buttons {
      vertical-align: middle;
      padding: 0 30px;
      button {
        display: block;
        margin: 10px auto;
        padding: 10px;
        border
        &.is-disabled {
          border: 1px solid #dcdfe6;
          background-color: #f5f7fa;
          color: #c0c4cc;
        }
      }
    }
  }
</style>
