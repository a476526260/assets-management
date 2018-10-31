<template>
  <div class="breadcrumb">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <template v-for="(item,index) in nav">
        <el-breadcrumb-item v-if="item.url!==''" :to="{ path: item.url }" :key="index">{{item.title}}
        </el-breadcrumb-item>
        <el-breadcrumb-item v-else>{{item.title}}</el-breadcrumb-item>
      </template>
    </el-breadcrumb>
  </div>
</template>

<script>
  export default {
    name: "breadcrumb",
    props: {
      nav: {
        type: Array,
        default: []
      }
    }
  }
</script>

<style lang="scss" scoped>
  .breadcrumb {
    padding: 20px 0;
  }
</style>
