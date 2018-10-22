<template>
  <container>
    <div class="department-title">
      <div class="title-text">属性列表</div>
      <div class="add-department">
        <el-button type="warning" plain @click="addProp" size="mini">添加属性</el-button>
      </div>
    </div>
    <div class="department-wrapper">
      <el-table
        v-loading="loading"
        :data="tableData"
        height="100%"
        style="width: 100%"
        :header-cell-style="setHeaderStyle">
        <el-table-column prop="attr_id" label="属性ID" align="center">
        </el-table-column>
        <el-table-column prop="attr_name" label="属性名" align="center">
        </el-table-column>
        <el-table-column prop="attr_values" label="属性组" align="center">
        </el-table-column>
        <el-table-column prop="attr_type" label="属性类型" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <span @click="modify(scope.row.attr_id)">修改</span> |
            <span @click="delData(scope.row.attr_id)">删除</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--添加&修改-->
    <el-dialog title="" :visible.sync="isDialogShow" center width="30%">
      <div class="dialog-title" slot="title">{{modifyType}}属性</div>
      <div class="add-property-form">
        <el-form label-position="right" label-width="120px" :model="attrData">
          <el-form-item label="attrName：">
            <el-input v-model="attrData.attrName"></el-input>
          </el-form-item>
          <el-form-item label="catId：">
            <el-select v-model="attrData.catId" :name="typeID" placeholder="请选择" @change="catIdChange">
              <el-option v-for="(item,index) in catIdOption" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="attrType：">
            <el-radio v-model="attrData.attrType" label="1">备选项</el-radio>
            <el-radio v-model="attrData.attrType" label="2">备选项</el-radio>
          </el-form-item>
          <el-form-item label="attrInputType：">
            <el-radio v-model="attrData.attrInputType" label="1">备选项</el-radio>
            <el-radio v-model="attrData.attrInputType" label="2">备选项</el-radio>
          </el-form-item>
          <el-form-item label="attrValues：">
            <el-select v-model="attrData.attrValues" placeholder="请选择">
              <el-option label="选择一" value="选择一"></el-option>
              <el-option label="选择二" value="选择二"></el-option>
              <el-option label="选择三" value="选择三"></el-option>
            </el-select>
          </el-form-item>
          <div class="submit-button">
            <el-button class='add-button' type="warning" plain @click="submitData">{{modifyType}}</el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>
  </container>
</template>

<script>
  import * as ajax from "../../assets/script/ajaxApi"
  import container from '@/components/container/container'
  import tipMixin from "../../assets/script/mixin"

  export default {
    name: "attrList",
    mixins: [tipMixin],
    data() {
      return {
        loading: false,
        typeID: '',
        tableData: [],
        isDialogShow: false,
        modifyType: '',
        modifyID:0,
        attrData: {
          attrName: '',
          catId: 20,
          attrType: '',
          attrInputType: '',
          attrValues: '',
        },
        catIdOption:[]
      }
    },
    mounted() {
      this.$nextTick(function () {
        this.getProplist();
      })
    },
    watch: {
      '$route': 'getProplist'
    },
    methods: {
      catIdChange(val){
        console.log(val)
      },
      getProplist() {
        this.typeID=this.$store.state.typeID;
        this.tableData = [];
        this.loading = true;
        ajax.fetch_get(this.host + '/api/assetsAttr', {
          catId: this.typeID,
        }).then(res => {
          if (res.data.code === 200) {
            this.loading = false;
            this.tableData = res.data.data;
          } else {
            this.errorTip(res.data.info);
          }
        }).catch(res => {
          this.errorTip(res.data.info);
        });
      },
      modify(id) {
        for(let prop in this.attrData){
          if(this.attrData.hasOwnProperty(prop)){
            this.attrData[prop]='';
          }
        }
        this.catIdOption=[];
        this.isDialogShow = true;
        this.modifyID=id;
        this.modifyType = '修改';
        this.getAttrTypeList()
      },
      addProp() {
        for(let prop in this.attrData){
          if(this.attrData.hasOwnProperty(prop)){
            this.attrData[prop]='';
          }
        }
        this.isDialogShow = true;
        this.modifyType = '添加';
        this.getAttrTypeList();
      },
      delData(id) {
        this.modifyID=id;
        this.$confirm('确定删除本条信息吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ajax.fetch_del(this.host + "/api/assetsAttr/" + id).then(res => {
            if (res.data.code === 200) {
              this.successTip("信息删除成功！");
              this.getProplist();
            } else {
              //登录超时返回登录页面
              this.errorTip(res.data.info);
            }
          }).catch(res => {
            console.log(res);
          })
        }).catch(() => {
          this.errorTip("已取消删除");
        });
      },
      submitData() {
        if(this.modifyType==='添加'){
          ajax.fetch_post(this.host + '/api/assetsAttr',this.attrData).then(res => {
            if(res.data.code === 200){
              this.successTip('属性添加成功！');
              this.getProplist();
              this.isDialogShow = false;
            }else{
              this.errorTip(res.data.info);
            }
          }).catch(res => {
            this.errorTip(res.data.info);
          });
        }else if(this.modifyType==='修改'){
          ajax.fetch_put(this.host + '/api/assetsAttr/'+this.modifyID,this.attrData).then(res => {
            if(res.data.code === 200){
              this.successTip('属性修改成功！');
              this.getProplist();
              this.isDialogShow = false;
            }else{
              this.errorTip(res.data.info);
            }
          }).catch(res => {
            this.errorTip(res.data.info);
          });
        }
      },
      getAttrTypeList(){
        this.catIdOption=[];
        ajax.fetch_get(this.host + '/api/assetstype').then(res=>{
          if(res.data.code===200){
            res.data.data.forEach((v)=> {
              this.catIdOption.push({
                label:v.name,
                value:v.id
              })
            });
            this.attrData.catId=this.$store.state.typeID;
          }else{
            this.errorTip(res.data.info)
          }
        }).catch(err=>{
          console.log(err)
        })
      }
    },
    components: {
      container,
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
    height: 80%;
    min-height: 80%;
    background: #ffffff;
    box-shadow: 0 0 10px #dddddd;
    border-radius: 5px;
    span {
      display: inline-block;
      font-size: 14px;
      color: #ff6633;
      cursor: pointer;
    }
  }
  .page {
    margin-top: 20px;
    text-align: center;
  }
  .submit-button{
    text-align: center;
  }
</style>
