<template>
  <container>
    <h1 class="title">新人入职</h1>
    <object
      classid="clsid:F1317711-6BDE-4658-ABAA-39E31D3704D3"
      codebase="SDRdCard.cab#version=2,0,1,0"
      width="1"
      height="1"
      align="center"
      hspace="0"
      vspace="0"
      id="idcard"
      name="rdcard"
      ref="id_card"
      v-if="!issupportWS()"
    >
    </object>
    <div class="tip">
      <p><span>提示:</span>1.打开身份证阅读器</p>
      <p><span>&nbsp;</span>2.将身份证放在阅读器上</p>
      <p><span>&nbsp;</span>3.读取出身份证信息后,确定信息无误,点击提交(enter),提交数据</p>
      <p><span>&nbsp;</span>4.扫描生成的二维码,即可下一步填写剩余信息</p>
    </div>
    <div class="machine_control">
      <span @click="open_machine" v-show="!issupportWS()">打开机具</span>
      <span @click="close_machine" v-show="!issupportWS()">关闭机具</span>
      <span @click="read_card">开始读卡</span>
      <span @click="handle_read_card" v-show="!issupportWS()">手动读卡</span>
      <span @click="waiting_read_card" v-show="!issupportWS()">等待读卡</span>
      <span @click="stop_read_card" v-show="!issupportWS()">停止读卡</span>
    </div>
    <div class="baseinfortable">
      <table width="100%" border="1px solid #999" cellpadding="0" cellspacing="0">
        <tr>
          <td class="ceil-title">工号</td>
          <td class="jobID"><input type="text" id="jobID" v-model="baseInfo.jobID"></td>
          <td class="ceil-title">姓名</td>
          <td class="staffName"><input type="text" v-model="baseInfo.staffName"></td>
          <td class="ceil-title">性别</td>
          <td class="staffSex"><input type="text" v-model="baseInfo.staffSex"></td>
          <td class="ceil-title">籍贯</td>
          <td class="staffPlace"><input type="text" v-model="baseInfo.staffPlace"></td>
        </tr>
        <tr>
          <td class="ceil-title">身份证号</td>
          <td class="staffID"><input type="text" v-model="baseInfo.staffID"></td>
          <td class="ceil-title">出生年月</td>
          <td class="staffBoth"><input type="text" v-model="baseInfo.staffBoth"></td>
          <td class="ceil-title">有效期限</td>
          <td class="staffValid"><input type="text" v-model="baseInfo.staffValid"></td>
          <td class="ceil-title">民族</td>
          <td class="staffNation"><input type="text" v-model="baseInfo.staffNation"></td>
        </tr>
        <tr>
          <td class="ceil-title">户口所在地</td>
          <td class="staffAddress" colspan="7"><input type="text" v-model="baseInfo.staffAddress"></td>
        </tr>
      </table>
    </div>
    <div class="submit">
      <el-button type="warning" plain @click="submitStaffInfo">提交(enter)</el-button>
    </div>
    <div class="search">
      <span class="search-title">员工搜索:</span>
      <span class="search-input"><el-input v-model="searchData" placeholder="工号,姓名,身份证号"></el-input></span>
      <span class="search-button"><el-button type="warning"
                                             @click="searchFun(searchData,currentPage)">搜索</el-button></span>
    </div>
    <div class="staff-infor-table">
      <el-table
        :data="staffTable"
        v-loading="loading"
        height="100%"
        style="width: 100%"
        border
        size="mini"
        :header-cell-style="setHeaderStyle">
        <el-table-column prop="userid" label="工号" align="center" width="100">
        </el-table-column>
        <el-table-column prop="name" label="姓名" align="center" width="100">
        </el-table-column>
        <el-table-column prop="sex" label="性别" align="center" width="100">
        </el-table-column>
        <el-table-column prop="native_place" label="籍贯" align="center" width="100">
        </el-table-column>
        <el-table-column prop="nation" label="民族" align="center" width="100">
        </el-table-column>
        <el-table-column prop="birthday" label="出生年月" align="center">
        </el-table-column>
        <el-table-column prop="id_card" label="身份证号" align="center">
        </el-table-column>
        <!--<el-table-column label="二维码" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" placement="left-start">
              <div slot="content">
                <img :src="scope.row.QR_code" width="100" height="100">
              </div>
              <img :src="scope.row.QR_code" width="24" height="24">
            </el-tooltip>
          </template>
        </el-table-column>-->
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <div class="operation">
              <span :type="Number(scope.row.status.code)===0?'warning':''" class="edit"
                    :class="{'editable':Number(scope.row.status.code)===1||Number(scope.row.status.code)===2}"
                    @click="showdialog_examine(scope.row.status.code,scope.row.id)">{{scope.row.status.info}}</span>
              | <span type="warning" class="delete editable" @click="supplement(scope.row.id)">补充信息</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--分页-->
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
    <!--员工人事档案资料卡-->
    <el-dialog :visible.sync="dialogExamineVisible" center width="880px" top="3%" custom-class="dialog-examine">
      <div slot="title" class="dialog-title" v-if="modifyStatusText !== '已完成'">
        员工人事档案资料卡<span> （{{modifyStatusText}}）</span></div>
      <div class="dialog-tip-warpper" :class="{complete:modifyStatusText === '已完成'}">
        <div class="tip-text" v-if="modifyStatusText !== '已完成'">
          <p>* 1:如果确定资料无误,请点击"资料无误,审核通过"按钮</p>
          <p>2:勾选需要员重填的字段,点击按钮"退回重填",然后通知员工重填</p>
        </div>
        <div class="examine-buttons">
          <el-button type="warning" size="mini" plain @click="checkFail" v-if="modifyStatusText==='待审核'">退回重填
          </el-button>
          <el-button type="warning" size="mini" plain @click="checkPass" v-if="modifyStatusText==='待审核'">资料无误，审核通过
          </el-button>
          <el-button type="warning" size="mini" plain @click="print" v-if="modifyStatusText==='已完成'">打印</el-button>
        </div>
      </div>
      <div id="printOut" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
           element-loading-background="rgba(0, 0, 0, 0.4)" :class="{complete:modifyStatusText === '已完成'}">
        <div slot="title" class="print-dialog-title" v-if="modifyStatusText === '已完成'">员工人事档案资料卡</div>
        <div class="dialog-table-infor">
          <div class="" style="overflow: hidden; background: #eeeeee;">
            <ul class="modify_data grid-col grid-col-10">
              <template v-for="(value,key) in staffBaseInformationCheck">
                <li v-if="key=='staffNation'" class="grid-col grid-col-3">
                  <div class="m-title">{{baseInfoKey[key]}}</div>
                  <div class="examine-flex">
                    <span class="entry" v-if="modifyStatusText==='待审核'"><input type="text" readonly
                                                                               :value="value"></span>
                    <span class="entry" v-else>{{value}}</span>
                  </div>
                </li>
                <li v-else-if="key=='staffAddress'" class="grid-col grid-col-9">
                  <div class="m-title">{{baseInfoKey[key]}}</div>
                  <div class="examine-flex">
                    <span class="entry" v-if="modifyStatusText==='待审核'"><input type="text" readonly
                                                                               :value="value"></span>
                    <span class="entry" v-else>{{value}}</span>
                  </div>
                </li>


                <li v-else-if="key!=='header'" class="grid-col grid-col-6">
                  <div class="m-title">{{baseInfoKey[key]}}</div>
                  <div class="examine-flex">
                    <span class="entry" v-if="modifyStatusText==='待审核'"><input type="text" readonly
                                                                               :value="value"></span>
                    <span class="entry" v-else>{{value}}</span>
                  </div>
                </li>
              </template>
            </ul>
            <div class="photo grid-col grid-col-2">
              <img v-if="staffBaseInformationCheck.header" :src="staffBaseInformationCheck.header" alt="头像">
            </div>
          </div>

          <div class="space" style="height: 24px;"></div>
          <template v-for="item in staffInformationCheck">
            <ul class="modify_data">
              <template v-for="(part,index) in item">
                <li class="grid-col" :class="'grid-col-'+(part.col)" v-if="part.type!==2">
                  <div class="m-title">{{part.title}}</div>
                  <div class="examine-flex" v-if="modifyStatusText==='待审核'">
                    <span class="entry"><input type="text" :value="part.value"></span>
                    <input type="checkbox" class="checkbox" v-model="examineArr" :value="part.id">
                  </div>
                  <div class="examine-flex" v-else>
                    <span class="entry">{{part.value}}</span>
                  </div>
                </li>
              </template>
            </ul>
            <div class="space" style="height: 24px;"></div>
          </template>
          <div class="confirm-text">
            <p>本人保证已经与原来工作单位正式脱离了劳动关系，也没有与其他任何单位保持劳动关系，否则，本人愿意承担由此而产生的任何法律责任。</p>
            <p>无重大病史，无传染病史和慢性病史，如有必须说明时间、状况和治疗效果。</p>
          </div>
          <div class="confirm-text">
            <h6>填表说明</h6>
            <p>1.被录用的员工应如实填写本登记表的所有内容，不得有任何隐瞒或虚假，否则公司一旦发现本表格有任何隐瞒，或虚假成分的，公司将认定被录用人不符合本公司录用条件或严重违纪而被无条件解除劳动合同。</p>
            <p>2.需交材料：毕业证、身份证、职称证、与原单位解除劳动关系证明（原件）、体检表、户口本、劳动手册（上海户口）。</p>
          </div>
          <ul class="modify_data">
            <li class="grid-col grid-col-6">
              <div class="m-title">填表人签名：</div>
              <div class="examine-flex"></div>
            </li>
            <li class="grid-col grid-col-6">
              <div class="m-title">日期：</div>
              <div class="examine-flex"></div>
            </li>
          </ul>
        </div>
      </div>
    </el-dialog>
    <!--员工人事档案补充资料-->
    <el-dialog :visible.sync="dialogSupplementVisible" center width="55%" top="3%" custom-class="dialog-supplement">
      <div slot="title" class="dialog-title">员工人事档案补充资料</div>
      <div class="dialog-tip-warpper">
        <div class="tip-text">
          <p>1:临时保存后,分公司hr仍然可以查看和编辑,</p>
          <p>2:提交后,仅仅总公司hr可以查看和编辑,</p>
        </div>
        <div class="supplement-buttons">
          <el-button type="warning" size="mini" @click="backWrite" plain>退回</el-button>
          <el-button type="warning" size="mini" @click="saveTemporary" plain>临时保存</el-button>
          <el-button type="warning" size="mini" @click="saveForever" plain>提交</el-button>
        </div>
      </div>
      <div class="contract">
        <ul class="contract-list" v-for="(listItem,index) in supplementData" :key="index">
          <template v-for="(item,i) in listItem">
            <li v-if="item.type===4" class="grid-col" :class="'grid-col-'+(item.col)" :key="i">
              <span class="grid-title">{{item.title}}</span>
              <span class="grid-input">
                <span class="entry">
                  <el-date-picker v-model="supplementIpt['_'+item.id]" type="date"
                                  :editable="false" :clearable="false" size="mini"
                                  value-format="yyyy-MM-dd"> placeholder="选择日期">
                  </el-date-picker>
                </span>
                <input type="checkbox" class="checkbox" v-model="examineArr_2" :value="item.id">
             </span>
            </li>
            <li v-else-if="item.type===1" class="grid-col" :class="'grid-col-'+(item.col)">
              <span class="grid-title">{{item.title}}</span>
              <span class="grid-input">
                <span class="entry">
                  <el-select v-model="supplementIpt['_'+item.id]" :placeholder="'请选择'+item.title" size="mini">
                    <el-option v-for="(subitem,i) in item.store" :key="i" :label="subitem"
                               :value="subitem"></el-option>
                  </el-select>
                </span>
                <input type="checkbox" class="checkbox" v-model="examineArr_2" :value="item.id">
              </span>
            </li>
            <li v-else class="grid-col" :class="'grid-col-'+(item.col)" :key="i">
              <span class="grid-title">{{item.title}}</span>
              <span class="grid-input">
                <span class="entry"><input type="text" v-model="supplementIpt['_'+item.id]"></span>
                <input type="checkbox" class="checkbox" v-model="examineArr_2" :value="item.id">
             </span>
            </li>
          </template>
        </ul>
      </div>
    </el-dialog>
    <div class="QR-code">
      <img src="./1537250834.png" alt="">
    </div>
  </container>
</template>

<script>
  import * as ajax from '../../assets/script/ajaxApi'
  import place from '../../assets/script/jiguan'
  import container from '@/components/container/container'
  import tipMixin from "../../assets/script/mixin"
  export default {
    name: "newStaff",
    mixins:[tipMixin],
    data() {
      return {
        value: '',
        searchData: '',
        examineArr: [],
        examineArr_2: [],
        baseInfo: {
          jobID: '',
          staffName: '',
          staffSex: '',
          staffPlace: '',
          staffID: '',
          staffBoth: '',
          staffValid: '',
          staffNation: '',
          staffAddress: '',
        },
        baseInfoKey: {
          jobID: '工号',
          staffName: '姓名',
          staffSex: '性别',
          staffPlace: '籍贯',
          staffID: '身份证号',
          staffBoth: '出生年月',
          staffValid: '有效期限',
          staffNation: '民族',
          staffAddress: '户口所在地',
        },
        staffTable: [],
        staffBaseInformationCheck: {},
        staffInformationCheck: [],
        machine_control: true,
        dialogExamineVisible: false,
        dialogSupplementVisible: false,
        pageNum: 6,
        currentPage: 1,
        total: 0,
        modifyStaffID: 0,
        loading: false,
        modifyStatusText: '',
        supplementData: [],
        supplementIpt: {},
      }
    },
    watch: {
      "baseInfo.staffID": function (newV) {
        if (newV !== undefined) {
          this.baseInfo.staffPlace = place[newV.toString().substr(0, 4)]
        }
      },
      "searchData": function (nv) {
        if (nv === '') {
          this.getStaffInfo(1);
        } else {
          setTimeout(()=> {
            this.currentPage = 1;
            this.searchFun(nv, this.currentPage)
          }, 300)
        }
      }
    },
    mounted() {
      let _this = this;
      this.getStaffInfo(this.currentPage);
      this.$nextTick(function () {
        if (this.issupportWS()) {
          this.read_card2();
        } else {
          this.$nextTick(function () {
            this.$refs.id_card.attachEvent('Readed', function () {
              _this.getInfoList();
              document.getElementById('jobID').focus();
            });
          });
        }
      });
      /*enter提交数据*/
      document.addEventListener('keyup', function (e) {
        if (e.keyCode === 13) {
          _this.submitStaffInfo();
        }
      }, false);
      window.onbeforeunload = function () {
        _this.stop_read_card();
        _this.close_machine();
      };

    },
    beforeDestroy() {
      if (!this.issupportWS()) {
        this.stop_read_card();
        this.close_machine();
      }
    },
    beforeRouteLeave: function (to, from, next) {
      if (from.name === 'newStaff') {
        if (!this.issupportWS()) {
          this.stop_read_card();
          this.close_machine();
        }
        next();
      }
    },
    methods: {
      showdialog_examine(i, id) {
        if (Number(i) === 2) {
          this.dialogExamineVisible = true;
          this.modifyStaffID = id;
          this.modifyStatusText = '已完成';
          ajax.fetch_get(this.host + '/api/extend/' + id).then(res => {
            if (res.data.code === 200) {
              this.loading = false;
              this.staffInformationCheck = res.data.data;
              this.staffBaseInformationCheck = res.data.ext.userInfo;
            } else {
              //登录超时返回登录页面
              this.errorTip(res.data.info);
            }
          }).catch(res => {
            console.log(res)
          })
        } else {
          this.loading = true;
          this.modifyStatusText = '待审核';
          this.examineArr = [];
          this.staffBaseInformationCheck = {};
          this.dialogExamineVisible = true;
          this.modifyStaffID = id;
          ajax.fetch_get(this.host + '/api/extend/' + id).then(res => {
            if (res.data.code === 200) {
              this.loading = false;
              this.staffInformationCheck = res.data.data;
              this.staffBaseInformationCheck = res.data.ext.userInfo;
            } else {
              this.errorTip(res.data.info);
            }
          }).catch(res => {
            console.log(res)
          })
        }
      },
      submitStaffInfo: function () {
        let _this = this;
        for (let prop in this.baseInfo) {
          if (prop === 'jobID')
            continue;
          if (this.baseInfo[prop] === '') {
            this.errorTip(this.baseInfoKey[prop] + '不能为空！');
            return false;
          }
        }
        ajax.fetch_post(this.host + '/api/newstaff', {
          job_id: this.baseInfo.jobID,
          staff_name: this.baseInfo.staffName,
          staff_sex: this.baseInfo.staffSex,
          staff_place: this.baseInfo.staffPlace,
          staff_id: this.baseInfo.staffID,
          staff_both: this.baseInfo.staffBoth,
          staff_valid: this.baseInfo.staffValid,
          staff_nation: this.baseInfo.staffNation,
          staff_address: this.baseInfo.staffAddress,
        }).then(res => {
          if (res.data.code === 200) {
            this.successTip('信息保存成功');
            for (let prop in _this.baseInfo) {
              this.baseInfo[prop] = '';
              this.getStaffInfo(1);
              this.currentPage = 1;
            }
            this.read_card2();
          } else {
            this.errorTip(res.data.info);
          }

        }).catch(res => {
          this.errorTip(res.data.info);
        })
      },
      getStaffInfo: function (page) {
        this.loading = true;
        ajax.fetch_get(this.host + "/api/newstaff", {
          page: page,
          listRows: this.pageNum,
        }).then(res => {
          if (res.status === 200) {
            this.loading = false;
            this.total = res.data.ext.total;
            this.staffTable = res.data.data;
          } else {
            this.errorTip(res.data.info);
          }
        }).catch(res => {
          console.log(res)
        })
      },
      supplement(id) {
        /*补充信息*/
        this.dialogSupplementVisible = true;
        this.modifyStaffID = id;
        this.supplementData = [];
        this.supplementIpt = {};
        ajax.fetch_get(this.host + "/api/extend/" + this.modifyStaffID, {
          exid: 1
        }).then(res => {
          if (res.data.code === 200) {
            this.supplementData = res.data.data;
            this.supplementData.forEach((val)=> {
              val.forEach((v) =>{
                //this.supplementIpt['_' + v.id] = v.value;
                this.$set(this.supplementIpt,'_' + v.id,v.value)
              })
            });
            console.log(this.supplementIpt)
          } else {
            //登录超时返回登录页面
            this.errorTip(res.data.info);
          }
        }).catch(res => {
          console.log(res)
        })
      },
      saveTemporary() {
        /*临时保存*/
        let _temp = [];
        for (let prop in this.supplementIpt) {
          _temp.push({
            'id': prop.slice(1),
            'val': this.supplementIpt[prop]
          })
        }
        ajax.fetch_put(this.host + '/api/extend/' + this.modifyStaffID, {
          val: _temp,
          exid: 1
        }).then(res => {
          console.log(res);
          if (res.data.code === 200) {
            this.successTip('信息暂存成功！');
            this.dialogSupplementVisible = false;
          } else {
            /*登录超时返回登录页面*/
            this.errorTip(res.data.info);
          }
        }).catch(res => {
          console.log(res)
        })
      },
      saveForever: function () {
        /*永久保存*/
        let _temp = [];
        for (let prop in this.supplementIpt) {
          _temp.push({
            'id': prop.slice(1),
            'val': this.supplementIpt[prop]
          })
        }
        ajax.fetch_put(this.host + '/api/extend/' + this.modifyStaffID, {
          status: 2,
          exid: 1
        }).then(res => {
          if (res.data.code === 200) {
            this.successTip('信息提交成功！');
            this.dialogSupplementVisible = false;
          } else {
            /*登录超时返回登录页面*/
            this.errorTip(res.data.info);
          }
        }).catch(res => {
          console.log(res)
        })
      },
      backWrite() {
        /*完善资料退回*/
        ajax.fetch_put(this.host+'/api/extend/'+this.modifyStaffID,{
          vid:this.examineArr_2
        }).then(res=>{
          if(res.data.code===200){
            this.successTip('退回信息提交成功！');
            this.dialogSupplementVisible = false;
          }else{
            this.errorTip(res.data.info)
          }
        })
      },
      print() {
        this.$htmlToPaper('printOut');
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        //分页变化
        this.currentPage = val;
        if (this.searchData === '') {
          this.getStaffInfo(val);
        } else {
          this.searchFun(this.searchData, this.currentPage)
        }
      },
      issupportWS() {
        return window.WebSocket;
      },
      getInfoList() {
        this.baseInfo.staffName = rdcard.NameS;
        this.baseInfo.staffSex = rdcard.SexL;
        this.baseInfo.staffID = rdcard.CardNo;
        this.baseInfo.staffBoth = rdcard.BornL;
        this.baseInfo.staffValid = rdcard.ActivityL;
        this.baseInfo.staffNation = rdcard.NationL;
        this.baseInfo.staffAddress = rdcard.Address;
      },
      open_machine() {
        let pp = rdcard.openport();
        if (pp === 0) {
          this.successTip('机具打开成功!')
        }
        else {
          this.errorTip('机具打开失败!')
        }
      },
      close_machine() {
        let pp = rdcard.closeport();
        if (pp === 0) {
          this.successTip('机具关闭成功!')
        }
        else {
          this.errorTip('机具关闭失败!')
        }
      },
      read_card() {
        if (this.issupportWS()) {
          this.read_card2()
        } else {
          let pp = rdcard.ReadCard2();
          if (pp === 0) {
            this.successTip('开始读卡!')
          }
          else {
            this.errorTip('读卡失败!')
          }
        }
      },
      read_card2() {
        /*开始读卡 谷歌等浏览器*/
        let _this = this;
        let timer = null;
        timer = setInterval(function () {
          let websocket = new WebSocket("ws://127.0.0.1:9000/");
          websocket.onopen = function (evt) {
            console.log(evt)
            websocket.send("<ReadIdCard>");
          };
          websocket.onmessage = function (evt) {
            /*身份信息字符串处理*/
            let infoArr = evt.data.substr(1, evt.data.length - 2).split(",");
            _this.baseInfo.staffName = infoArr[2];
            _this.baseInfo.staffSex = infoArr[3];
            _this.baseInfo.staffNation = infoArr[4];
            _this.baseInfo.staffBoth = infoArr[6];
            _this.baseInfo.staffAddress = infoArr[7];
            _this.baseInfo.staffID = infoArr[8];
            _this.baseInfo.staffValid = infoArr[11];
            if (evt.data.indexOf('读卡失败') < 0) {
              websocket.close();
              clearInterval(timer);
            }
          };
          websocket.onclose = function (evt) {
            console.log("连接已关闭")
          };
          websocket.onerror = function (evt) {
            _this.errorTip("读卡失败");
            websocket.close();
            clearInterval(timer);
          };
        }, 1000);
      },
      handle_read_card() {
        let pp = rdcard.readcard();
        if (pp === 0) {
          this.successTip('手动读卡!')
        }
        else {
          this.errorTip("读卡失败");
        }
      },
      waiting_read_card() {
        let pp = rdcard.ReadCard3();
        if (pp === 0) {
          this.successTip('等待读卡...!')
        }
        else {
          this.errorTip("等待读卡失败...");
        }
      },
      stop_read_card() {
        let pp = rdcard.endread();
        if (pp === 0) {
          this.successTip('停止读卡成功...!')
        }
        else {
          this.errorTip("停止读卡失败...");
        }
      },
      checkFail() {
        /*退回重填*/
        if (this.examineArr.length < 1) {
          this.errorTip("请勾选返回充填项");
          return false;
        }
        ajax.fetch_put(this.host + '/api/newstaff/' + this.modifyStaffID, {
          status: 3,
          idArr: this.examineArr,
        }).then(res => {
          if (res.data.code === 200) {
            this.successTip("信息提交成功");
            this.dialogExamineVisible = false;
            this.getStaffInfo(this.currentPage);
          } else {
            this.errorTip(res.data.info)
          }
        }).catch(res => {
          //this.errorTip(res);
        });
      },
      checkPass() {
        this.examineArr = [];
        this.dialogExamineVisible = false;
        ajax.fetch_put(this.host + '/api/newstaff/' + this.modifyStaffID, {
          status: 2,
        }).then(res => {
          if (res.data.code === 200) {
            this.successTip("信息审核通过！");
            this.dialogExamineVisible = false;
            this.getStaffInfo(this.currentPage);
          } else {
            this.errorTip(res.data.info)
          }
        }).catch(res => {
          this.errorTip(res);
        });
      },
      searchFun(val, page) {
        /*员工搜索*/
        if (this.searchData === '') {
          this.errorTip('请输入搜索条件');
          return false;
        }
        ajax.fetch_get(this.host + '/api/newstaff', {
          q: val,
          page: page,
          listRows: this.pageNum,
        }).then(res => {
          if (res.status === 200) {
            this.total = res.data.ext.total;
            this.staffTable = res.data.data;
          } else {
            //登录超时返回登录页面
            this.errorTip(res.data.info);
          }
        }).catch(res => {
          this.errorTip(res.data.info);
        })
      },
      setHeaderStyle() {
        /**设置表头样式*/
        return {"fontSize": "16px", "background": "#f9f9f9"}
      }
    },
    components:{
      container,
    }
  }
</script>


<style lang="scss" scoped>
  @import "../../assets/scss/gird";
  .title {
    margin-top: 20px;
    text-align: center;
    font-size: 16px;
    line-height: 22px;
    font-weight: 700;
    color: #333;
  }
  .tip {
    p {
      font-size: 14px;
      line-height: 26px;
      color: #999999;
      overflow: hidden;
      span {
        float: left;
        width: 40px;
      }

    }
  }
  .machine_control {
    margin-top: 14px;
    span {
      display: inline-block;
      padding: 4px 8px;
      color: #e6a23c;
      background: #fdf6ec;
      border: 1px solid #f5dab1;
      text-align: center;
      box-sizing: border-box;
      outline: 0;
      margin: 0;
      transition: .1s;
      font-size: 14px;
      border-radius: 4px;
      cursor: pointer;
    }
  }
  .baseinfortable {
    margin: 20px auto 0;
    table {
      border-left: 1px solid #999999;
      border-top: 1px solid #999999;
      tr {
        td {
          width: 12.5%;
          height: 36px;
          line-height: 36px;
          border-bottom: 1px solid #999999;
          border-right: 1px solid #999999;
          font-size: 14px;
          color: #333333;
          font-weight: normal;
          &.ceil-title {
            padding-right: 10px;
            text-align: right;
            font-weight: bold;
          }
          input {
            width: 100%;
            height: 100%;
            background: none;
            text-indent: 1em;
            font-size: 14px;
            color: #333333;
          }
        }
      }
    }
  }
  .submit {
    margin-top: 20px;
    text-align: center;
  }
  .search {
    display: flex;
    justify-content: flex-start;
    padding-top: 30px;
    margin-top: 20px;
    border-top: 1px dashed #999999;
    overflow: hidden;
    .search-title {
      font-size: 16px;
      color: #333333;
      margin-right: 10px;
      line-height: 40px;
      display: inline-block;
    }
    .search-input {
      width: 300px;
      margin-right: 10px;
      display: inline-block;
    }
    .search-button {
      width: auto;
      display: inline-block;
    }
  }
  .staff-infor-table {
    margin-top: 20px;
    height: 316px;
    background: #ffffff;
    .operation {
      text-align: center;
      color: #333333;
      span {
        width: 60px;
        margin: 0 2px;
        display: inline-block;
        color: #e6a23c;
        background: #fdf6ec;
        border: 1px solid #f5dab1;
        font-size: 12px;
        border-radius: 4px;
        text-align: center;
        box-sizing: border-box;
        outline: 0;
        cursor: pointer;
        &.editable {
          background-color: rgba(64, 158, 255, .1);
          border: 1px solid rgba(64, 158, 255, .2);
          color: #409eff;
        }
      }
    }
  }
  .use_ie_tip {
    margin-top: 100px;
    font-size: 16px;
    text-align: center;
    color: red;
  }
  .dialog-examine {
    top: 50%;
    height: 600px;
    transform: translate3d(0, -50%, 0);
    .dialog-title {
      margin-bottom: -20px;
      font-size: 18px;
      color: #333333;
      span {
        font-size: 14px;
        color: red;
      }
    }
    .print-dialog-title {
      text-align: center;
      font-size: 18px;
      color: #333;
    }
    #printOut {
      &.complete {
        margin-top: -20px;
      }
    }
    .dialog-tip-warpper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      &.complete {
        position: absolute;
        right: 50px;
        top: 30px;
      }
      .tip-text {
        max-width: 500px;
        p {
          text-align: left;
          font-size: 14px;
          color: #999999;
          line-height: 20px;
          &:first-child {
            text-indent: -0.8em;
          }
        }
      }
    }
    .dialog-table-infor {
      margin-top: 20px;
      .photo {
        height: 97px;
        box-sizing: border-box;
        border: 1px solid #666666;
        border-left: none;
        text-align: center;
        background: #ffffff;
        img {
          height: 99%;
        }
      }
      .modify_data {
        border-top: 1px solid #666666;
        border-left: 1px solid #666666;
        overflow: hidden;
        box-sizing: border-box;
        .grid-col {
          display: flex;
          height: 24px;
          box-sizing: border-box;
          border-bottom: 1px solid #666666;
          border-right: 1px solid #666666;
          .m-title {
            width: 110px;
            height: 24px;
            padding-right: 5px;
            text-align: right;
            font-size: 14px;
            color: #333333;
            line-height: 24px;
            border-right: 1px solid #666666;
          }
          .examine-flex {
            position: relative;
            flex: 1;
            height: 24px;
            align-items: center;
            .entry {
              display: block;
              width: 100%;
              box-sizing: border-box;
              padding-right: 16px;
              line-height: 24px;
              font-size: 14px;
              text-indent: 1rem;
              input {
                display: block;
                width: 100%;
                height: 24px;
                line-height: 24px;
                text-indent: 0.8em;
                font-size: 14px;
                outline: none;
                background: none;
              }
            }
            .checkbox {
              position: absolute;
              width: 12px;
              height: 12px;
              right: 4px;
              top: 50%;
              transform: translate3d(0, -50%, 0);
            }
          }
        }
      }
      .confirm-text {
        padding: 5px;
        border: 1px solid #666;
        border-bottom: none;
        h6 {
          margin-bottom: 4px;
          color: #333333;
          font-size: 14px;
          font-weight: bold;
        }
        p {
          color: #666666;
          font-size: 14px;
          line-height: 18px;
        }
      }
    }
  }
  .dialog-supplement {
    .dialog-title {
      margin-bottom: -20px;
      font-size: 18px;
      color: #333333;
      span {
        font-size: 14px;
        color: red;
      }
    }
    .dialog-tip-warpper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .tip-text {
        max-width: 500px;
        p {
          font-size: 14px;
          color: #999999;
          line-height: 20px;
        }
      }
    }
    .contract {
      margin-top: 20px;
      .contract-list {
        margin-bottom: 20px;
        border-top: 1px solid #333333;
        border-left: 1px solid #333333;
        &:after{
          content: '';
          display: block;
          clear: both;
        }
        .grid-col {
          display: flex;
          height: 29px;
          vertical-align: middle;
          box-sizing: border-box;
          border-right: 1px solid #333333;
          border-bottom: 1px solid #333333;
          .grid-title {
            width: 120px;
            padding: 0 5px;
            background: #eeeeee;
            text-align: right;
            font-size: 14px;
            line-height: 29px;
            color: #333333;
            border-right: 1px solid #333333;
          }
          .grid-input {
            flex: 1;
            position: relative;
            .entry{
              display: flex;
              width: 100%;
              height: 100%;
              position: relative;
            }
            .vdp-datepicker{
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              text-indent: 0.5em;
            }
            input {
              display: block;
              width: 100%;
              height: 28px;
              line-height: 28px;
              background: none;
              outline: none;
              text-indent: 15px;
              font-size: 14px;
              color: #606266;
            }
            .el-input {
              width: 100%;
              height: 100%;
              position: absolute;
              left: 0;
              top: 0;
            }
            .el-select{
              width: 100%;
            }
            .checkbox {
              position: absolute;
              width: 12px;
              height: 12px;
              right: 4px;
              top: 50%;
              transform: translate3d(0, -50%, 0);
            }
          }
        }
      }
    }
  }
  .page {
    margin-top: 20px;
    text-align: center;
  }
  .QR-code {
    position: absolute;
    width: 100px;
    height: 100px;
    right: 10px;
    top: 40px;
    img {
      width: 100%;
      height: 100%;
    }
  }
</style>
