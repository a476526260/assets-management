<template>
    <div class="batchImport">
      <el-dialog :title="titleText" center width="45%">
        <div class="dialog-title" slot="title">{{titleText}}</div>
        <div class="import-file-box">
          <div class="upload-file">
            <div class="fileName">
              <input v-model="fileName" readonly type="text">
            </div>
            <div class="upload">
              <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/"
                         accept=".xls" :show-file-list="false" :on-change="fileChange" :before-upload="beforeUpload"
                         :on-success="uploadSuccess"
                         ref="upload">
                <el-button size="small" type="primary">选择文件</el-button>
              </el-upload>
            </div>
          </div>
          <div class="uploadTip">
            提示：导入的文件必须按上面附件的格式,且必须为".xls"格式.
          </div>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  export default {
    name: "batchImport",
    data(){
      return {

      }
    },
    props:{
      titleText:{
        type:String
      }
    },
    methods:{

    }
  }
</script>

<style lang="scss" scoped>
  .batchImport{
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }

</style>
