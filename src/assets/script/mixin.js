let mixin={
  methods:{
    successTip(msg) {
      this.$message({
        showClose: true,
        message: msg,
        type: 'success'
      });
    },
    errorTip(msg) {
      this.$message({
        showClose: true,
        message: msg,
        type: 'error'
      });
    }
  }
};

export default mixin;
