<template>
  <div class="cdn">
    <div class="container">
      <div class="title">CDN缓存刷新</div>
      <div class="switch-nav">
        <span>刷新类型：</span>
        <el-radio v-model="radio" label="File">URL({{urlQty}})</el-radio>
        <el-radio v-model="radio" label="Directory">目录({{dirQty}})</el-radio>
      </div>
      <div class="switch-content">
        <div class="content-item">
          <div class="refresh-catipn">URL：</div>
          <div class="refresh-record">
            <div class="box-card">
              <textarea placeholder="每行一条纪录" v-model="textarea"></textarea>
            </div>
            <div class="operation">
              <el-button type="warning" @click="refresh">刷新</el-button>
              <el-button type="warning" @click="checkon">检测</el-button>
              <span class="tip">*每行一条纪录</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <loading v-if="$store.state.showLoading"></loading>
  </div>
</template>

<script>
  import {mapActions} from 'vuex'
  import {mapState} from 'vuex'
  import loading from '../loading/loading'
  import * as ajax from "../../assets/script/ajaxApi"
  import container from '@/components/container/container'
  import tipMixin from "../../assets/script/mixin"
  export default {
    name: "cdn",
    mixins:[tipMixin],
    data() {
      return {
        radio: 'File',
        textarea: '',
        urlQty: 0,
        dirQty: 0,
      }
    },
    computed: {
      ...mapState({
        'showLoading': state => state.showLoading
      })
    },
    mounted: function () {
      this.$nextTick(function () {
        this._getCdnQty()
      })
    },
    methods: {
      refresh: function () {
        if (this.textarea === '') {
          this.errorTip('请输入URL');
          return false;
        }
        ajax.fetch_post(this.host + '/api/cdn', {
          type: this.radio,
          url: this.textarea,
        }).then(res=> {
          if (res.data.code === 200) {
            this.successTip('URL刷新成功');
            this._getCdnQty();
            this.textarea = '';
          } else {
            throw res.data.info
          }
        }).catch(res=>{

        })
      },
      _getCdnQty: function () {
        this.getCdnQty().then(res => {
          if (res.data.code === 200) {
            this.$store.state.showLoading = false;
            this.urlQty = res.data.data.UrlRemain;
            this.dirQty = res.data.data.DirRemain;
          } else {
            this.$message.error(res.data.info);
            throw res.data.info
          }
        }).catch(error => {
          console.log(error)
        });
      },
      ...mapActions([
        'getCdnQty'
      ])
    },
    components: {
      loading,
      container
    }
  }
</script>

<style lang="scss" scoped>
  .title {
    margin-top: 20px;
    text-align: center;
    font-size: 16px;
    line-height: 22px;
    font-weight: bold;
    color: #333333;
  }
  .switch-nav {
    margin-top: 40px;
    padding: 0 8%;
  }
  .switch-content {
    margin-top: 30px;
    padding: 0 8%;
    .content-item {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      .refresh-catipn {
        width: 50px;
        padding: 20px 0;
      }
      .refresh-record {
        flex: 1;
        height: 500px;
        .box-card {
          padding: 15px;
          height: 440px;
          overflow: auto;
          background: #ffffff;
          box-shadow: 1px 1px 10px #aaaaaa;
          textarea {
            display: block;
            width: 100%;
            height: 100%;
            resize: none;
            box-sizing: border-box;
            border: none;
            font-size: 14px;
            color: #999999;
            line-height: 24px;
            outline: none;
          }
        }
        .record-data-item {
          color: #999999;
          font-size: 14px;
          line-height: 24px;
          padding: 4px 0;
          border-bottom: 1px solid #dddddd;
        }
        .operation {
          margin-top: 20px;
          padding: 0 20px;
          height: 40px;
          overflow: hidden;
          .tip {
            float: right;
            line-height: 40px;
            color: red;
          }
        }
      }
    }
  }
</style>
