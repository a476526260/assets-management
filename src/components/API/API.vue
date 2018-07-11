<template>
  <div class="api">
    <departmentCaption>部门列表</departmentCaption>
    <div class="container"></div>
  </div>
</template>

<script>
  import departmentCaption from "@/components/caption/dcaption"

  export default {
    name: "API",
    comments:{
      departmentCaption
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/scss/layout";

  .api {
    @include fullScreen;
    .container {
      padding-left: 90px;
      padding-right: 50px;
      height: 100%;
    }
  }
</style>
