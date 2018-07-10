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
            <el-button type="warning" plain @click="addMember('add',modifyData)">添加人员</el-button>
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
          <el-table-column prop="staffID" label="ID" align="center" width="100px"></el-table-column>
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
                <span class="modify" @click="addMember('modify',scope)">修改</span>|<span class="lookUp"
                                                                                        @click="addMember('lookUp',scope)">查看</span>
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
      <div class="dialog-title" slot="title">
        <span v-if="memberDialogStatus==1">添加</span>
        <span v-if="memberDialogStatus==2">修改</span>
        <span v-if="memberDialogStatus==3">查看</span>员工信息
        <span v-if="memberDialogStatus!=1"> {{modifyData.name.text}}(工号：{{modifyData.staffID.text}})</span>
      </div>
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
                <el-select v-model="modifyData.sex.text" :disabled="!modifyData.sex.isEditable" placeholder="请选择性别"
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
                  <input v-model="modifyData.ID.text" :class="{'editable':modifyData.ID.isEditable}"
                         :readonly="!modifyData.staffID.isEditable" type="text">
                </div>
              </div>
              <div class="inline-block-1">
                <span class="label">&nbsp;状态：</span>
                <el-select v-model="modifyData.status" :disabled="memberDialogStatus==3" placeholder="请选择状态" size="mini"
                           @change="showTurnStoreFunc">
                  <el-option v-for="(item,index) in searchOption.status" :key="index" :label="item"
                             :value="item"></el-option>
                </el-select>
              </div>
            </div>
            <div class="infor-line">
              <div class="inline-block-1">
                <span class="label">&nbsp;电话：</span>
                <div class="ipt">
                  <input v-model="modifyData.mobile.text" :readonly="!modifyData.mobile.isEditable"
                         :class="{'editable':modifyData.mobile.isEditable}"
                         type="text">
                </div>
              </div>
              <div class="inline-block-1">
                <span class="label">&nbsp;部门：</span>
                <el-select v-model="modifyData.department" :disabled="memberDialogStatus==3" placeholder="请选择部门"
                           size="mini" @change="findLeaders">
                  <el-option v-for="(item,index) in searchOption.department" :key="index" :label="item"
                             :value="item"></el-option>
                </el-select>
              </div>
              <div class="inline-block-1">
                <span class="label">&nbsp;上级：</span>
                <el-select v-model="modifyData.leader" :disabled="memberDialogStatus==3" placeholder="请选择上级"
                           size="mini">
                  <el-option v-for="(item,index) in modifyData.leaderOptions" :key="index" :label="item"
                             :value="item"></el-option>
                </el-select>
              </div>
            </div>
            <div class="infor-line">
              <div class="inline-block-2">
                <span class="label">&nbsp;区域：</span>
                <el-select v-model="modifyData.area" :disabled="memberDialogStatus==3" placeholder="请选择区域" size="mini">
                  <el-option v-for="(item,index) in areaOptions" :key="index" :label="item"
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
            <el-upload
              class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="modifyData.imageUrl" :src="modifyData.imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
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
            <button class="addDevice" v-if="memberDialogStatus!=3" @click="addDevice">增加设备</button>
          </div>
          <div class="asset-list-data">
            <el-table :data="modifyData.assetList" border tooltip-effect="light" :header-cell-style="setThisStyle"
                      :cell-style="setCellStyle" style="width: 100%" size="mini">
              <el-table-column prop="name" label="资产名称"></el-table-column>
              <el-table-column prop="prop" label="属性" show-overflow-tooltip></el-table-column>
              <el-table-column prop="" label="操作">
                <template slot-scope="scope">
                  <span class="deleteThis" @click="deleteThisDevice(scope)">删除</span>
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
        <div class="tip-word" v-if="memberDialogStatus!=3">
          <div class="tip">提示：</div>
          <div class="tip-list">
            <p>1.删除资产后,当前资产自动重新"入库",进入"可出库"的状态</p>
            <p>2.增加资产后,当前资产会进入"已出库"状态</p>
            <p>3.删除设备时,不需要提交,点击删除时,立即删除</p>
          </div>
        </div>
        <div class="button" v-if="memberDialogStatus!=3">
          <button @click="">提交修改</button>
        </div>
      </div>
    </el-dialog>
    <!--批量导入资产信息-->
    <el-dialog title="批量导入人员" :visible.sync="dialogImportVisible" center width="45%">
      <div class="dialog-title" slot="title">批量导入人员</div>
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

    <!--添加设备-->
    <el-dialog title="设备搜索" :visible.sync="dialogAddDeviceVisible" center width="40%">
      <div class="dialog-title" slot="title">设备搜索</div>
      <div class="addDevice-box">
        <div class="device-search">
          <div class="device-type">
            <el-select v-model="device.type" placeholder="设备类型">
              <el-option v-for="(item,index) in device.deviceTypeOptions" :key="index" :label="item"
                         :value="item"></el-option>
            </el-select>
          </div>
          <div class="search-keyword">
            <el-input
              placeholder="请输入要搜索的关键词"
              prefix-icon="el-icon-search"
              v-model="device.keywords">
            </el-input>
          </div>
          <div class="form-buttons">
            <el-button type="warning" plain @click="searchDevice">搜索</el-button>
          </div>
        </div>
        <div class="search-asset-result">
          <el-table :data="deviceSearch.assetList" border tooltip-effect="light" :header-cell-style="setThisStyle"
                    :cell-style="setCellStyle" style="width: 100%" size="mini">
            <el-table-column prop="name" label="资产名称"></el-table-column>
            <el-table-column prop="prop" label="属性" show-overflow-tooltip></el-table-column>
            <el-table-column prop="" label="操作">
              <template slot-scope="scope">
                <span class="AddThis" @click="addThisDevice(scope)">添加</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  import departmentCaption from "@/components/caption/dcaption"

  export default {
    name: "member",
    data() {
      return {
        currentPage: 2,                  //当前页码
        search: {                        //搜索条件数据
          department: '',
          status: '',
          condition: '',
          keywords: ''
        },
        searchOption: {                  //搜索下拉配置
          department: ['IT部', '网络营销部', '市场部', '人事部', '行政部'],
          status: ['在职', '离职', '待入职', '待岗'],
          condition: ['姓名', '部门', '工号', '手机/电话', '邮箱', '企业QQ', '企业微信']
        },
        memberDialogStatus: 1,           //1--添加员工信息，2-修改员工信息，3-查看员工信息
        tableData: [                    //表单数据
          {
            staffID: '38962',
            name: '凌凌漆',
            department: 'IT部',
            leader: '大大',
            mobile: '13000000001',
            email: '007.zhou@gaodun.cn',
            QQ: '1356987452',
            status: '在职',
            sex: "男",
            ID: "342501199006116897",
            area: '花园坊A3',
            OB: 'OBBBB',
            assetList: [
              {
                'name': '电脑',
                'prop': 'cpu:4核8G,硬盘:500G ....'
              },
              {
                'name': '手机',
                'prop': 'xxxxxxx'
              }
            ]
          },
          {
            staffID: '3859',
            name: '零零发',
            department: '网络营销部',
            leader: '小小',
            mobile: '13000000002',
            email: 'doris.xiao@gaodun.cn',
            QQ: '1356987452',
            status: '离职',
            sex: "男",
            ID: "342501199006116897",
            area: '花园坊A3',
            OB: 'OBBBB',
            assetList: [
              {
                'name': '电脑',
                'prop': 'cpu:4核8G,硬盘:500G ....'
              },
              {
                'name': '手机',
                'prop': 'xxxxxxx'
              }
            ]
          },
          {
            staffID: '38962',
            name: '默默',
            department: '行政部',
            leader: '辣椒',
            mobile: '13000000003',
            email: 'momo@gaodun.cn',
            QQ: '1356987452',
            status: '在职',
            sex: "男",
            ID: "342501199006136897",
            area: '花园坊A3',
            OB: 'OBBBB',
            assetList: [
              {
                'name': '电脑',
                'prop': 'cpu:4核8G,硬盘:500G ....'
              }
            ]
          },
          {
            staffID: '38962',
            name: '小丽',
            department: '人事部',
            leader: '未知',
            mobile: '13000000000',
            email: 'xiaolili@gaodun.cn',
            QQ: '1356987452',
            status: '离职',
            sex: "女",
            ID: "342501199006516897",
            area: '花园坊A3',
            OB: 'OBBBB',
            assetList: [
              {
                'name': '手机',
                'prop': '华为 mate20'
              }
            ]
          }
        ],
        dialogModifyInforVisible: false, //添加修改员工是否显示
        areaOptions: ['花园坊A3', '花园坊A4', '花园坊A5', '成都', '北京', '重庆', '其它'],
        modifyData: {                    //员工信息修改数据
          turnStore: false,              //是否显示转库操作
          name: {
            isEditable: true,            //姓名是否可编辑 添加-true, 修改-false
            text: ''
          },
          staffID: {
            isEditable: true,            //工号是否可编辑 添加-true, 修改-false
            text: ''
          },
          sex: {
            isEditable: true,
            text: ''
          },
          imageUrl: '',
          ID: {
            isEditable: true,
            text: ''
          },
          status: '',
          mobile: {
            isEditable: true,
            text: ''
          },
          department: '',
          leader: '',
          leaderOptions: [],
          area: '',
          remark: '',
          QQ: {
            isEditable: true,
            text: ''
          },
          email: {
            isEditable: true,
            text: ''
          },
          OB: {
            isEditable: true,
            text: ''
          },
          assetList: []
        },
        dialogImportVisible: false,      //批量导入人员
        fileList: [],                    //导入文件列表
        fileName: '',                    //导入文件名
        dialogAddDeviceVisible: false,   //添加设备是否显示
        device: {                        //添加设备相关数据
          type: '',
          deviceTypeOptions: ['电脑', '手机', '电话', '椅子', '笔记本'],
          keywords: '',
        },
        deviceSearch: {
          assetList: [
            {
              'name': '电脑',
              'prop': 'cpu:4核8G,硬盘:500G ....'
            },
            {
              'name': 'IPhoneX',
              'prop': '128G'
            }
          ]
        }
      }
    },
    computed: {
      birthDay: function () {
        /**根据身份证号计算生日*/
        let date = this.modifyData.ID.text.substr(6, 8);
        return date.substr(0, 4) + ' - ' + date.substr(4, 2) + ' - ' + date.substr(6, 2)
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
        this.dialogImportVisible = true;
      },
      addMember: function (type, mutiData) {
        this.dialogModifyInforVisible = true;
        if (type == 'add') {
          /**添加人员*/
          //清空所有数据，所有选项为可编辑状态
          this.memberDialogStatus = 1;
          for (var prop in mutiData) {
            console.log();
            if (typeof mutiData[prop] == 'string') {
              //值为字符串直接清空
              mutiData[prop] = '';
            } else if (mutiData[prop] instanceof Array) {
              mutiData[prop] = [];
            } else {
              //值为对象类型,值清空并设为可编辑状态
              for (var pro in mutiData[prop]) {
                mutiData[prop].isEditable = true;
                mutiData[prop].text = '';
              }
            }
          }
        } else if (type == 'modify') {
          /**修改人员*/
          this.memberDialogStatus = 2;
          var row = mutiData.$index;
          //姓名不可更改
          this.modifyData.name.isEditable = false;
          this.modifyData.name.text = this.tableData[row].name;

          //工号不可更改
          this.modifyData.staffID.isEditable = false;
          this.modifyData.staffID.text = this.tableData[row].staffID;

          //性别不可更改
          this.modifyData.sex.isEditable = false;
          this.modifyData.sex.text = this.tableData[row].sex;

          //身份证号不可更改
          this.modifyData.ID.isEditable = false;
          this.modifyData.ID.text = this.tableData[row].ID;

          //状态
          this.modifyData.status = this.tableData[row].status;
          if (this.modifyData.status == '离职') {
            this.modifyData.turnStore = true;
          } else {
            this.modifyData.turnStore = false;
          }

          //电话
          this.modifyData.mobile.text = this.tableData[row].mobile;

          //部门
          this.modifyData.department = this.tableData[row].department;

          //上级
          this.modifyData.leader = this.tableData[row].leader;

          //区域
          this.modifyData.area = this.tableData[row].area;

          //企业QQ
          this.modifyData.QQ.text = this.tableData[row].QQ;

          //邮箱
          this.modifyData.email.text = this.tableData[row].email;

          //OB
          this.modifyData.OB.text = this.tableData[row].OB;

          //资产信息
          this.modifyData.assetList = this.tableData[row].assetList;
        } else if (type == 'lookUp') {
          //查看员工信息
          this.memberDialogStatus = 3;

          var row = mutiData.$index;
          //姓名不可更改
          this.modifyData.name.isEditable = false;
          this.modifyData.name.text = this.tableData[row].name;

          //工号不可更改
          this.modifyData.staffID.isEditable = false;
          this.modifyData.staffID.text = this.tableData[row].staffID;

          //性别不可更改
          this.modifyData.sex.isEditable = false;
          this.modifyData.sex.text = this.tableData[row].sex;

          //身份证号不可更改
          this.modifyData.ID.isEditable = false;
          this.modifyData.ID.text = this.tableData[row].ID;

          //状态
          this.modifyData.status = this.tableData[row].status;
          if (this.modifyData.status == '离职') {
            this.modifyData.turnStore = true;
          } else {
            this.modifyData.turnStore = false;
          }

          //电话
          this.modifyData.mobile.isEditable = false;
          this.modifyData.mobile.text = this.tableData[row].mobile;

          //部门
          this.modifyData.department = this.tableData[row].department;

          //上级
          this.modifyData.leader = this.tableData[row].leader;

          //区域
          this.modifyData.area = this.tableData[row].area;

          //企业QQ
          this.modifyData.QQ.isEditable = false;
          this.modifyData.QQ.text = this.tableData[row].QQ;

          //邮箱
          this.modifyData.email.isEditable = false;
          this.modifyData.email.text = this.tableData[row].email;

          //OB
          this.modifyData.OB.isEditable = false;
          this.modifyData.OB.text = this.tableData[row].OB;

          //资产信息
          this.modifyData.assetList = this.tableData[row].assetList;
        }
      },
      showTurnStoreFunc(val) {
        console.log(val);
        if (this.modifyData.status == '离职') {
          this.modifyData.turnStore = true;
        } else {
          this.modifyData.turnStore = false;
        }
      },
      handleAvatarSuccess(res, file) {
        //记录用户头像地址
        this.modifyData.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        //用户头像上传格式大小验证
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.showErrorTip('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.showErrorTip('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      importQQ: function () {


      },
      showErrorTip: function (message) {
        this.$message({
          showClose: true,
          message: message,
          type: 'error'
        });
      },
      showSuccessTip: function (message) {
        this.$message({
          showClose: true,
          message: message,
          type: 'success'
        });
      },
      searchDevice: function () {
        console.log("搜索设备")
      },
      addDevice: function () {
        //添加设备对话框显示
        this.dialogAddDeviceVisible = true;
      },
      addThisDevice: function (data) {
        /**添加设备*/
        console.log(data);
      },
      deleteThisDevice: function (data) {
        /**删除设备*/
        console.log(data);
      },
      findLeaders: function (val) {
        var _this = this;
        axios.get("/api/getLeaders").then(function (result) {
          console.log(result.data.data);
          _this.modifyData.leaderOptions = result.data.data.IT;
        }).catch(function () {
          console.log(data)
        })
      },
      fileChange: function (file) {
        if (file.name.indexOf("xls") < 0) {
          this.$refs.upload.clearFiles();
        }
      },
      beforeUpload: function (file) {
        if (file.name.indexOf("xls") < 0) {
          this.showErrorTip('文件类型错误！');
          this.$refs.upload.abort();
          return false;
        } else {
          this.fileName = file.name
        }
      },
      uploadSuccess: function () {
        this.showSuccessTip('文件上传成功');
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

<style lang="scss">
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
            text-indent: 1em;
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
        .avatar-uploader {
          width: 100%;
          box-sizing: border-box;
          border: 1px dashed #d9d9d9;
          border-radius: 6px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          > div {
            width: 100% !important;
          }
          &:hover {
            border-color: #409EFF;
          }
        }
        .avatar-uploader-icon {
          display: block;
          width: 100%;
          height: 100%;
          font-size: 28px;
          color: #8c939d;
          line-height: 178px;
          text-align: center;
        }
        .avatar {
          width: 100%;
          height: 100%;
          display: block;
        }
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
          text-indent: 1em;
          &.editable {
            border: 1px solid #ddd;
            text-indent: 1em;
          }
        }
      }
    }
    .asset-list {
      margin-top: 20px;
      .asset-list-title {
        line-height: 30px;
        font-size: 14px;
        color: #999999;
        .addDevice {
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
    .import-file-box {
      text-align: center;
      .upload-file {
        display: flex;
        justify-content: center;
        .fileName {
          width: 200px;
          margin-right: 30px;
          input {
            width: 100%;
            height: 32px;
            text-indent: 1em;
            border: 1px solid #ddd;
          }
        }
      }
      .uploadTip {
        margin-top: 20px;
        color: red;
        font-size: 12px;
      }
    }
    .addDevice-box {
      .device-search {
        display: flex;
        .device-type {
          width: 20%;
          margin-right: 3%;
        }
        .search-keyword {
          width: 35%;
          margin-right: 3%;
        }
      }
      .search-asset-result {
        margin-top: 20px;
        .AddThis {
          display: inline-block;
          padding: 5px 10px;
          cursor: pointer;
        }
      }
    }
  }
</style>
