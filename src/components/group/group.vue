<template>
  <container>
    <div class="department-title">
      <div class="title-text">角色组管理</div>
      <div class="add-department">
        <el-button type="warning" plain @click="add" size="mini">添加角色组</el-button>
      </div>
    </div>
    <div class="department-wrapper">
      <el-table
        :data="tableData"
        height="100%"
        style="width: 100%"
        :header-cell-style="setHeaderStyle">
        <el-table-column prop="id" label="ID" align="center">
        </el-table-column>
        <el-table-column prop="group_name" label="组名" align="center">
        </el-table-column>
        <el-table-column prop="remark" label="备注" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <span @click="modify(scope.row.id)">修改</span> |
            <span @click="del(scope.row.id)">删除</span> |
            <span @click="showGroupUserList(scope.row.id)">用户</span> |
            <span @click="permissionSetting(scope.row.id)">权限分配</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="pageNum"
        layout="prev, pager, next, total, jumper"
        :total="total">
      </el-pagination>
    </div>
    <!--添加-->
    <el-dialog title="" :visible.sync="dialogAddGroupVisible" center width="40%">
      <div class="dialog-title" slot="title">{{modifyTypeText}}角色组</div>
      <div class="add-department-form">
        <el-form label-position="left" label-width="60px" :model="modifyGroupData">
          <el-form-item label="名称：">
            <el-input v-model="modifyGroupData.group_name"></el-input>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input v-model="modifyGroupData.remark"></el-input>
          </el-form-item>
          <el-form-item label="别名：">
            <el-input v-model="modifyGroupData.action_list"></el-input>
          </el-form-item>
          <el-form-item label="可用：" v-if="modifyTypeText==='修改'">
            <el-input type="number" max="1" min="0" v-model="modifyGroupData.enabled"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class='add-button' type="warning" plain @click="submitDialogData">{{modifyTypeText}}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!--显示用户列表-->
    <el-dialog title="" :visible.sync="dialogGroupListVisible" center width="40%">
      <div class="dialog-title" slot="title">用户信息列表</div>
      <transfer ref="transfer" :original-data="userTableData" :target-data="targetData" @handleAdd='handleAddGroupUser' @handleDel="handleDelGroupUser" @searchOriginal="searchOriginal"></transfer>
      <div class="page">
        <el-pagination
          background
          @size-change="handleSizeChange_mini"
          @current-change="handleCurrentChange_mini"
          :current-page.sync="currentPage_mini"
          :page-size="pageNum_mini"
          layout="prev, pager, next, total, jumper"
          :total="total_mini">
        </el-pagination>
      </div>
    </el-dialog>
    <!--权限分配-->
    <el-dialog title="" :visible.sync="dialogPermissionVisible" center width="50%">
      <div class="dialog-title" slot="title">权限分配</div>
      <div class="list-warpper" v-for="(val,key,index) in permissionArr" :key="key">
        <div class="list-title">
          {{val.title+'：'}}
        </div>
        <div class="list-item">
          <el-checkbox-group v-model="checkAuth[key]">
            <el-checkbox v-for="(item,i) in val.list" :key="i" :label="item.id">{{item.title}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div class="permissionSubmit">
        <el-button type="warning" @click="permission">确定分配</el-button>
      </div>
    </el-dialog>
  </container>
</template>

<script>
  import * as ajax from "../../assets/script/ajaxApi";
  import transfer from "@/components/transfer/transfer";
  import container from '@/components/container/container';
  import tipMixin from "../../assets/script/mixin";
  export default {
    name: "group",
    mixins:[tipMixin],
    data() {
      return {
        currentPage: 1,                         //当前分页
        pageNum: 14,                            //每页数据
        total: 0,                               //数据总量
        currentPage_mini: 1,                    //当前分页
        pageNum_mini: 10,                       //每页数据
        total_mini: 0,
        tableData: [],                          //表单数据
        dialogAddGroupVisible: false,           //添加部门对话框是否显示
        dialogGroupListVisible: false,
        modifyDataID: 0,
        modifyTypeText: '',
        modifyGroupData: {
          group_name: '',
          remark: '',
          action_list: '',
          enabled: 0,
        },
        userTableData: [],
        targetData: [],
        originalSearchTxt:'',
        targetSearchTxt:'',
        dialogPermissionVisible:false,              //权限分配
        checked:true,
        permissionArr:{},
        checkAuth:{}
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        this.getGroupList(this.currentPage)
      })
    },
    methods: {
      getGroupList(page) {
        ajax.fetch_get(this.host + '/api/group', {
          page: page,
          listRows: this.pageNum,
        }).then(res => {
          if (res.data.code === 200) {
            this.tableData = res.data.data;
            this.total = res.data.ext.total;
          } else {
            this.errorTip(res.data.info)
          }
        }).catch(res => {
          this.errorTip(res.data.info)
        })
      },
      del(id) {
        this.$confirm('确定删除本条信息吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ajax.fetch_del(this.host + "/api/group/" + id).then(res => {
            if (res.data.code === 200) {
              this.successTip("信息删除成功！");
              let page = ((this.total - 1) % this.pageNum === 0 && this.currentPage === (this.total - 1) / this.pageNum + 1) ? this.currentPage - 1 : this.currentPage;
              this.getGroupList(page);
            } else {
              this.errorTip(res.data.info);
            }
          }).catch(res => {
            console.log(res);
          })
        }).catch(() => {
          this.errorTip("已取消删除");
        });
      },
      modify(id) {
        this.modifyDataID = id;
        this.dialogAddGroupVisible = true;
        this.modifyTypeText = '修改';
        this.clearObjVal(this.modifyGroupData);
        ajax.fetch_get(this.host + '/api/group/' + id).then(res => {
          if (res.data.code === 200) {
            for (let prop in this.modifyGroupData) {
              this.modifyGroupData[prop] = res.data.data[prop];
            }
          } else {
            this.errorTip(res.data.info)
          }
        })
      },
      add() {
        this.dialogAddGroupVisible = true;
        this.modifyTypeText = '添加';
        this.clearObjVal(this.modifyGroupData);
      },
      submitDialogData() {
        if (this.modifyTypeText === '添加') {
          ajax.fetch_post(this.host + '/api/group', this.modifyGroupData).then(res => {
            if (res.data.code === 200) {
              this.getGroupList(1);
              this.dialogAddGroupVisible = false;
              this.successTip('数据添加成功！');
            } else {
              this.errorTip(res.data.info);
            }
          }).catch(res => {
            this.errorTip(res.data.info);
          })
        } else {
          if (this.modifyTypeText === '修改') {
            ajax.fetch_put(this.host + '/api/group/' + this.modifyDataID, this.modifyGroupData).then(res => {
              if (res.data.code === 200) {
                this.getGroupList(this.currentPage);
                this.dialogAddGroupVisible = false;
                this.successTip('数据修改成功！');
              } else {
                this.errorTip(res.data.info);
              }
            }).catch(res => {
              this.errorTip(res.data.info);
            })
          }
        }
      },
      showGroupUserList(id) {
        this.modifyDataID = id;
        this.dialogGroupListVisible = true;
        this.getGroupUserList(this.modifyDataID);
        this.getoriginalDate();
      },
      getGroupUserList(id){
        /*获取组成员数据*/
        ajax.fetch_get(this.host + '/api/groupaccess/' + id).then(res => {
          if (res.data.code === 200) {
            this.targetData=res.data.data;
          } else {
            this.errorTip(res.data.info)
          }
        }).catch(res => {
          this.errorTip(res.data.info)
        });
      },
      getoriginalDate(){
        /*获取源数据*/
        ajax.fetch_get(this.host + '/api/groupaccess', {
          gid:this.modifyDataID,
          page: this.currentPage_mini,
          listRows: this.pageNum_mini,
        }).then(res => {
          if (res.data.code === 200) {
            this.total_mini = res.data.ext.total;
            this.userTableData = res.data.data;
          } else {
            this.errorTip(res.data.info)
          }
        }).catch(res => {
          this.errorTip(res.data.info)
        });
      },
      handleAddGroupUser(val) {
        /*添加*/
        ajax.fetch_post(this.host + "/api/groupaccess", {
          vid: val.map((item) => {
            return item.substring(1)
          }),
          gid: this.modifyDataID,
        }).then(res => {
          if (res.data.code === 200) {
            this.successTip("添加成功！");
            this.getGroupUserList(this.modifyDataID);
            this.getoriginalDate();
            //this.$refs.transfer.targetData=[];
          } else {
            this.errorTip(res.data.info);
          }
        }).catch(res => {
          console.log(res);
        })
      },
      handleDelGroupUser(val){
        ajax.fetch_del(this.host + "/api/groupaccess/"+this.modifyDataID,{
          vid:val.map((item) => {
            return item.substring(1);
          }),
        }).then(res => {
          if (res.data.code === 200) {
            this.successTip("删除成功！");
            this.getGroupUserList(this.modifyDataID);
            this.getoriginalDate();
            //this.$refs.transfer.targetData=[];
          } else {
            this.errorTip(res.data.info);
          }
        }).catch(res => {
          console.log(res);
        })
      },
      searchOriginal(val){
        /*搜索源数据*/
        this.originalSearchTxt=val;
        ajax.fetch_get(this.host + '/api/groupaccess', {
          gid:this.modifyDataID,
          q:val,
          page: this.currentPage_mini,
          listRows: this.pageNum_mini,
        }).then(res => {
          if (res.data.code === 200) {
            this.total_mini = res.data.ext.total;
            this.userTableData = res.data.data;
          } else {
            this.errorTip(res.data.info)
          }
        }).catch(res => {
          this.errorTip(res.data.info)
        });
      },
      permissionSetting(id){
        this.modifyDataID = id;
        this.dialogPermissionVisible=true;
        this.checkAuth={};
        ajax.fetch_get(this.host+'/api/auth',{
          id:id
        }).then(res=>{
          if(res.data.code===200){
            this.permissionArr=res.data.data;
            for(let prop in this.permissionArr){
              if(this.permissionArr.hasOwnProperty(prop)){
                let _tempArr=[];
                let list=this.permissionArr[prop].list||[];
                list.forEach((item)=> {
                  if(item.checked===1){
                    _tempArr.push(item.id)
                  }
                });
                this.$set(this.checkAuth,prop,_tempArr)
              }
            }
          }else{
            this.errorTip(res.data.info);
          }
        }).catch(res=>{
          console.log(res);
        })
      },
      permission(){
        let _tempData=[];
        for(let prop in this.checkAuth){
           _tempData=_tempData.concat(this.checkAuth[prop]);
        }
        ajax.fetch_put(this.host+'/api/auth/'+this.modifyDataID,{
          vid:_tempData
        }).then(res=>{
          if(res.data.code===200){
            this.successTip('权限分配成功！');
            this.dialogPermissionVisible=false;
          }else{
            this.errorTip(res.data.info)
          }
        }).catch(err=>{
          console.log(err)
        });
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getGroupList(this.currentPage);
      },
      handleSizeChange_mini(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange_mini(val) {
        if(this.originalSearchTxt===''){
          this.currentPage = val;
          this.getoriginalDate(this.modifyDataID);
        }else{
          this.currentPage_mini=val;
          this.searchOriginal(this.originalSearchTxt)
        }
      },
      setHeaderStyle() {
        /**设置表头样式*/
        return {"fontSize": "16px", "background": "#f9f9f9"}
      },
      clearObjVal(obj) {
        for (let prop in obj) {
          obj[prop] = '';
        }
      },
    },
    components: {
      transfer,
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
    .el-table {
      span {
        display: inline-block;
        font-size: 14px;
        color: #ff6633;
        cursor: pointer;
      }
    }
  }
  .dialog-title {
    position: relative;
    font-size: 20px;
  }
  .add-department-form {
    width: 60%;
    margin: 0 auto;
    .add-button {
      display: block;
      width: 150px;
      margin: 0 auto;
    }
  }
  .modify-department-form {
    width: 60%;
    margin: 0 auto;
    .add-button {
      display: block;
      width: 150px;
      margin: 0 auto;
    }
  }
  .add-group-user {
    position: absolute;
    top: 0;
    right: 30px;
  }
  .el-transfer {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .list-warpper{
    display: flex;
    align-items: center;
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #eaeaea;
    overflow: hidden;
    .list-title{
      margin-right: 20px;
      width: 90px;
      font-size: 16px;
      font-weight: 700;
      line-height: 24px;
      text-align: right;
    }
    .list-item{
      span{
        display: inline-block;
        padding: 5px 10px;
      }
    }
  }
  .permissionSubmit{
    margin-top: 40px;
    text-align: center;
  }
  .page {
    margin-top: 20px;
    text-align: center;
  }
</style>
