<template>
  <div class="container">
    <slot>无slot显示此处内容</slot>
  </div>
</template>

<script>
  export default {
    name: "container"
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/scss/layout";
  .container{
    @include fullScreen;
  }

</style>
