<template>
  <div class="caption">
    <div class="title">部门列表</div>
  </div>
</template>

<script>
  export default {
    name: "dcaption"
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/scss/layout";
  .title {
    width: 16px;
    @include layout-vertical-center(absolute);
    padding-right: 30px;
    left: 1.5%;
    font-size: 16px;
    line-height: 18px;
    color: #333333;
    &:after {
      content: '';
      display: block;
      width: 30px;
      height: 30px;
      @include layout-vertical-center(absolute);
      right: 0;
      background: url("../../assets/images/icon-sprite.png") no-repeat;
      background-position: -150px 0;
    }
  }
</style>
