<template>
  <div class="member">
    <departmentCaption></departmentCaption>
    <div class="container">
      <div class="search-condition">
        <el-form :inline="true" :model="search" class="demo-form-inline">
          <el-form-item>
            <el-select v-model="search.department" placeholder="请选择部门">
              <el-option v-for="(item,index) in searchOption.department" :key="index" :label="item"
                         :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="search.status" placeholder="请选择在职状态">
              <el-option v-for="(item,index) in searchOption.status" :key="index" :label="item"
                         :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="search.condition" placeholder="精确搜索条件">
              <el-option v-for="(item,index) in searchOption.condition" :key="index" :label="item"
                         :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              placeholder="请输入要搜索的关键词"
              prefix-icon="el-icon-search"
              v-model="search.keywords">
            </el-input>
          </el-form-item>
          <div class="form-buttons">
            <el-button type="warning" plain @click="searchFunc">搜索</el-button>
            <el-button type="warning" plain @click="resetFunc">重置</el-button>
            <el-button type="warning" plain @click="addMember">添加人员</el-button>
            <el-button type="warning" plain @click="batchImport">批量导入人员</el-button>
            <el-button type="warning" plain @click="importQQ">导入QQ</el-button>
          </div>
        </el-form>
      </div>

      <div class="member-result-box">
        <el-table
          ref="multipleTable"
          :data="tableData"
          size="mini"
          height="100%"
          tooltip-effect="dark"
          style="width: 100%"
          :header-cell-style="setHeaderStyle">
          <el-table-column prop="ID" label="ID" align="center" width="100px"></el-table-column>
          <el-table-column prop="name" label="姓名" align="center" width="100px"></el-table-column>
          <el-table-column prop="department" label="部门" align="center" width="120px"></el-table-column>
          <el-table-column prop="leader" label="上级" align="center" width="100px"></el-table-column>
          <el-table-column prop="mobile" label="手机" align="center"></el-table-column>
          <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
          <el-table-column prop="QQ" label="企业QQ号" align="center"></el-table-column>
          <el-table-column prop="status" label="状态" align="center" width="100px">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status==='在职'?'danger':'info'">{{scope.row.status}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="120px">
            <template slot-scope="scope">
              <div class="operation">
                <span class="modify">修改</span>|<span class="lookUp">查看</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="" align="center" width="150px">
            <template slot-scope="scope">
              <span class="reset">重置email密码</span>
            </template>
          </el-table-column>
          <el-table-column label="" align="center" width="150px">
            <template slot-scope="scope">
              <span class="reset">重置QQ密码</span>
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
          :page-size="20"
          layout="prev, pager, next, jumper"
          :total="1000">
        </el-pagination>
      </div>
    </div>

    <!--添加修改员工信息-->
    <el-dialog title="资产详细" :visible.sync="dialogModifyInforVisible" center width="55%">
      <div class="dialog-title" slot="title">添加/修改员工信息 XXX(工号：3689)</div>
      <div class="staff-infor-box">
        <div class="basic-infor">
          <div class="staff-text">
            <div class="infor-line">
              <div class="inline-block-1">
                <span class="label">*姓名：</span>
                <div class="ipt">
                  <input v-model="modifyData.name.text" :class="{'editable':modifyData.name.isEditable}"
                         :readonly="!modifyData.name.isEditable" type="text">
                </div>
              </div>
              <div class="inline-block-1">
                <span class="label">*工号：</span>
                <div class="ipt">
                  <input v-model="modifyData.staffID.text" :class="{'editable':modifyData.staffID.isEditable}"
                         :readonly="!modifyData.staffID.isEditable" type="text">
                </div>
              </div>
              <div class="inline-block-1">
                <span class="label">*性别：</span>
                <el-select v-model="modifyData.sex.text" :disabled="modifyData.sex.isEditable" placeholder="请选择性别"
                           size="mini">
                  <el-option label="男" value="男"></el-option>
                  <el-option label="女" value="女"></el-option>
                </el-select>
              </div>
            </div>
            <div class="infor-line">
              <div class="inline-block-2">
                <span class="label" style="width: 64px;">*身份证：</span>
                <div class="ipt">
                  <input v-model="modifyData.ID.text" :class="{'editable':modifyData.ID.isEditable}" type="text">
                </div>
              </div>
              <div class="inline-block-1">
                <span class="label">&nbsp;状态：</span>
                <el-select v-model="modifyData.status" placeholder="请选择状态" size="mini" @change="showTurnStoreFunc">
                  <el-option v-for="(item,index) in searchOption.status" :key="index" :label="item" :value="item"></el-option>
                </el-select>
              </div>
            </div>
            <div class="infor-line">
              <div class="inline-block-1">
                <span class="label">&nbsp;电话：</span>
                <div class="ipt">
                  <input v-model="modifyData.mobile.text" :class="{'editable':modifyData.mobile.isEditable}"
                         type="text">
                </div>
              </div>
              <div class="inline-block-1">
                <span class="label">&nbsp;部门：</span>
                <el-select v-model="modifyData.department" placeholder="请选择部门" size="mini">
                  <el-option v-for="(item,index) in searchOption.department" :key="index" :label="item"
                             :value="item"></el-option>
                </el-select>
              </div>
              <div class="inline-block-1">
                <span class="label">&nbsp;上级：</span>
                <el-select v-model="modifyData.leader" placeholder="请选择上级" size="mini">
                  <el-option v-for="(item,index) in modifyData.leaderOptions" :key="index" :label="item"
                             :value="item"></el-option>
                </el-select>
              </div>
            </div>
            <div class="infor-line">
              <div class="inline-block-2">
                <span class="label">&nbsp;区域：</span>
                <el-select v-model="modifyData.area" placeholder="请选择区域" size="mini">
                  <el-option v-for="(item,index) in modifyData.areaOptions" :key="index" :label="item"
                             :value="item"></el-option>
                </el-select>
              </div>
              <div class="inline-block-1">
                <span class="label">&nbsp;生日：</span>
                <div class="ipt">
                  <input v-model="birthDay" readonly type="text">
                </div>
              </div>
            </div>
          </div>
          <div class="staff-image">
            <img src="">
          </div>
        </div>
        <div class="remark-words">
          <label>&nbsp;备注：</label>
          <el-input type="textarea"></el-input>
        </div>
        <div class="other-infor">
          <div class="infor-line">
            <div class="inline-block-1">
              <span class="label">企业QQ:</span>
              <div class="ipt">
                <input v-model="modifyData.QQ.text" :class="{'editable':modifyData.QQ.isEditable}"
                       :readonly="!modifyData.QQ.isEditable" type="text">
              </div>
            </div>
            <div class="inline-block-1">
              <span class="label">邮箱:</span>
              <div class="ipt">
                <input v-model="modifyData.email.text" :class="{'editable':modifyData.email.isEditable}"
                       :readonly="!modifyData.email.isEditable" type="text">
              </div>
            </div>
            <div class="inline-block-1">
              <span class="label">OB：</span>
              <div class="ipt">
                <input v-model="modifyData.OB.text" :class="{'editable':modifyData.OB.isEditable}"
                       :readonly="!modifyData.OB.isEditable" type="text">
              </div>
            </div>
          </div>
        </div>
        <div class="asset-list">
          <div class="asset-list-title">资产列表：
            <button class="addDevice">增加设备</button>
          </div>
          <div class="asset-list-data">
            <el-table :data="modifyData.assetList" border tooltip-effect="light" :header-cell-style="setThisStyle"
                      :cell-style="setCellStyle" style="width: 100%" size="mini">
              <el-table-column prop="name" label="资产名称"></el-table-column>
              <el-table-column prop="prop" label="属性" show-overflow-tooltip></el-table-column>
              <el-table-column prop="" label="操作">
                <template slot-scope="scope">
                  <span class="deleteThis">删除</span>
                </template>
              </el-table-column>
              <el-table-column prop="" label="" v-if="modifyData.turnStore">
                <template slot-scope="scope">
                  <button class="turnStore">转库</button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="tip-word">
          <div class="tip">提示：</div>
          <div class="tip-list">
            <p>1.删除资产后,当前资产自动重新"入库",进入"可出库"的状态</p>
            <p>2.增加资产后,当前资产会进入"已出库"状态</p>
            <p>3.删除设备时,不需要提交,点击删除时,立即删除</p>
          </div>
        </div>
        <div class="button">
          <button @click="">提交修改</button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import departmentCaption from "@/components/caption/dcaption"

  export default {
    name: "member",
    data() {
      return {
        currentPage: 2,                 //当前页码
        search: {                       //搜索条件数据
          department: '',
          status: '',
          condition: '',
          keywords: ''
        },
        searchOption: {                 //搜索下拉配置
          department: ['IT部', '网络营销部', '市场部', '人事部', '行政部'],
          status: ['在职', '离职', '待入职', '待岗'],
          condition: ['姓名', '部门', '工号', '手机/电话', '邮箱', '企业QQ', '企业微信']
        },
        tableData: [                    //表单数据
          {
            ID: '38962',
            name: '凌凌漆',
            department: 'IT部',
            leader: '大大',
            mobile: '13000000000',
            email: '007.zhou@gaodun.cn',
            QQ: '1356987452',
            status: '在职'
          },
          {
            ID: '3859',
            name: '零零发',
            department: '网络营销部',
            leader: '小小',
            mobile: '13000000000',
            email: 'doris.xiao@gaodun.cn',
            QQ: '1356987452',
            status: '在职'
          },
          {
            ID: '38962',
            name: '默默',
            department: '行政部',
            leader: '辣椒',
            mobile: '13000000000',
            email: 'momo@gaodun.cn',
            QQ: '1356987452',
            status: '在职'
          },
          {
            ID: '38962',
            name: '小丽',
            department: '人事部',
            leader: '未知',
            mobile: '13000000000',
            email: 'xiaolili@gaodun.cn',
            QQ: '1356987452',
            status: '离职'
          }
        ],
        dialogModifyInforVisible: false, //添加修改员工是否显示
        modifyData: {                   //员工信息修改数据
          turnStore: false,               //是否显示转库操作
          name: {
            isEditable: true,           //姓名是否可编辑 添加-true, 修改-false
            text: '大嘴'
          },
          staffID: {
            isEditable: true,           //工号是否可编辑 添加-true, 修改-false
            text: ''
          },
          sex: {
            isEditable: true,
            text: '男'
          },
          ID: {
            isEditable: true,
            text: '342501198608316819'
          },
          status: '',
          mobile: {
            isEditable: true,
            text: ''
          },
          department: '',
          leader: '',
          leaderOptions: ['aaa', 'bbb', 'ccc'],
          area: '',
          areaOptions: ['花园坊A3', '花园坊A4', '花园坊A5', '成都', '北京', '重庆', '其它'],
          birthDay: '',
          remark: '',
          QQ: {
            isEditable: true,
            text: '235111111'
          },
          email: {
            isEditable: true,
            text: 'jack.he@gaodun.cn'
          },
          OB: {
            isEditable: true,
            text: ''
          },
          assetList: [
            {
              name: '电脑',
              prop: 'cpu:4核8G,硬盘:500G ....'
            },
            {
              name: '手机',
              prop: 'xxxxxxx'
            }
          ]
        }
      }
    },
    computed: {
      birthDay: function () {
        let data = this.modifyData.ID.text.substr(6, 8);

        return data.substr(0, 4) + ' - ' + data.substr(4, 2) + ' - ' + data.substr(6, 2)
      }
    },
    methods: {
      searchFunc: function () {
        console.log("searching...")
      },
      resetFunc: function () {
        for (var prop in this.search) {
          this.search[prop] = '';
          this.currentPage = 1;
        }
      },
      batchImport: function () {
        console.log("批量导入")
      },
      addMember: function () {
        this.dialogModifyInforVisible = true;
      },
      showTurnStoreFunc(val) {
        console.log(val);
        if (this.modifyData.status == '离职') {
          this.modifyData.turnStore = true;
        } else {
          this.modifyData.turnStore = false;
        }
      },
      importQQ: function () {
        console.log("导入QQ")
      },
      setHeaderStyle: function () {
        /**设置表头样式*/
        return {"fontSize": "16px", "background": "#f9f9f9"}
      },
      setThisStyle: function () {
        return {"fontSize": "16px", "color": "#333333", "textAlign": "center"}
      },
      setCellStyle: function () {
        return {"fontSize": "14px", "color": "#666666", "textAlign": "center"}
      },
      handleCurrentChange: function () {
        /**分页*/
      },
      handleSizeChange: function () {
        /**分页*/
      }
    },
    components: {
      departmentCaption
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/scss/layout";

  .member {
    @include fullScreen;
    .container {
      padding-left: 90px;
      padding-right: 50px;
      height: 100%;
      .search-condition {
        padding: 15px 0;
        .el-form-item {
          margin-bottom: 0;
        }
        .demo-form-inline {
          display: flex;
          align-items: center;
          .el-form-item {
            width: 13%;
            margin-right: 10px;
          }
          .form-buttons {
            flex: 1;
            font-size: 0;
            button {
              padding: 12px 15px !important;
              margin-left: 0;
              margin-right: 10px;
              &:last-child {
                margin-right: 0;
              }
            }
          }
        }
      }
      .member-result-box {
        height: 80%;
        min-height: 80%;
        background: #ffffff;
        box-shadow: 0 0 10px #dddddd;
        border-radius: 5px;
        .operation {
          font-size: 14px;
          color: #ff6633;
          span {
            padding: 0 3px;
            cursor: pointer;
          }
        }
        .reset {
          padding: 0 5px;
          color: #666666;
          cursor: pointer;
        }
      }
      .page {
        margin-top: 20px;
        text-align: center;
      }
    }
    .dialog-title {
      font-size: 20px;
    }
    .basic-infor {
      display: flex;
      justify-content: space-between;
      align-items: start;
      overflow: hidden;
      .staff-text {
        flex: 1;
        .infor-line {
          margin-bottom: 20px;
          &:last-child {
            margin-bottom: 0;
          }
          overflow: hidden;
          .inline-block-1 {
            display: flex;
            float: left;
            width: 33.33333%;
          }
          .inline-block-2 {
            display: flex;
            align-items: center;
            float: left;
            width: 66.66666%;
          }
          .label {
            width: 50px;
            margin-right: 5px;
            font-size: 14px;
            line-height: 28px;
            color: #999999;
          }
          .ipt {
            display: block;
            max-width: 200px;
            margin-right: 10px;
            flex: 1;
          }
          input {
            width: 100%;
            height: 28px;
            padding: 0;
            color: #999999;
            &.editable {
              border: 1px solid #ddd;
              text-indent: 1em;
            }
          }
          .el-select {
            flex: 1;
            max-width: 200px;
            margin-right: 10px;
          }
        }
      }
      .staff-image {
        margin-left: 40px;
        width: 150px;
        height: 180px;
        border-radius: 5px;
        background: #bbbbbb;
      }
    }
    .remark-words {
      margin-top: 20px;
      display: flex;
      padding-bottom: 20px;
      border-bottom: 1px solid #dddddd;
      label {
        display: block;
        width: 50px;
        margin-right: 5px;
        font-size: 14px;
        line-height: 28px;
        color: #999999;
      }
      .el-textarea {
        flex: 1;
      }
    }
    .other-infor {
      margin-top: 20px;
      .infor-line {
        padding-right: 190px;
        margin-bottom: 20px;
        &:last-child {
          margin-bottom: 0;
        }
        overflow: hidden;
        .inline-block-1 {
          display: flex;
          float: left;
          width: 33.33333%;
        }
        .inline-block-2 {
          display: flex;
          align-items: center;
          float: left;
          width: 66.66666%;
        }
        .label {
          margin-right: 5px;
          font-size: 14px;
          line-height: 28px;
          color: #999999;
        }
        .ipt {
          display: block;
          max-width: 200px;
          margin-right: 10px;
          flex: 1;
        }
        input {
          width: 100%;
          height: 28px;
          padding: 0;
          color: #999999;
          &.editable {
            border: 1px solid #ddd;
            text-indent: 1em;
          }
        }
      }
    }
    .asset-list {
      margin-top: 20px;
      .asset-list-title{
        line-height: 30px;
        font-size: 14px;
        color: #999999;
        .addDevice{
          width: 120px;
          height: 28px;
          line-height: 28px;
          font-size: 14px;
          color: #ff6633;
          border: 1px solid #ff6633;
          background: none;
          border-radius: 5px;
          cursor: pointer;
          outline: none;
        }
      }
      .asset-list-data {
        margin-top: 20px;
        .deleteThis {
          padding: 0 5px;
          font-size: 14px;
          color: #ff6633;
          cursor: pointer;
        }
        .turnStore {
          width: 74px;
          height: 24px;
          line-height: 24px;
          color: #ffffff;
          background: #f0aa14;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          outline: none;
        }
      }
    }
    .tip-word {
      display: flex;
      margin-top: 16px;
      .tip {
        line-height: 20px;
        font-size: 12px;
        color: #ff6633;
      }
      .tip-list {
        p {
          line-height: 20px;
          font-size: 12px;
          color: #ff6633;
        }
      }
    }
    .button {
      width: 200px;
      margin: 16px auto 0;
      button {
        width: 100%;
        height: 40px;
        font-size: 16px;
        color: #ffffff;
        background: #f0aa14;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        outline: none;
      }
    }
  }
</style>
