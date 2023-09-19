<template>
  <div class="orderApprovalListDetails">
    <div slot="header" class="header_box disp_flex ju_bet ali_cen">
        <span class="title"  style="margin-right: 24px">回单审核</span>
        <div >
          <el-button type="primary" @click="toApproval(orderInfo,11)" v-if="orderInfo.workOrderStatus==7">通过审核</el-button>
          <el-button type="danger" @click="toApproval(orderInfo,9)" v-if="orderInfo.workOrderStatus==11">支付</el-button>
          <el-button type="danger" @click="toApproval(orderInfo,23)" v-if="orderInfo.workOrderStatus==7">驳回</el-button>
          <el-button type="info" plain @click="toBack">关闭</el-button>
        </div>
    </div>
     <div class="form_box" v-loading="loading">
        <div class="section">
          <div class="card_item">
            <div class="card_item_title disp_flex ali_cen ju_bet">
              <div>工单信息</div>
            </div>
            <el-form ref="form" label-position="left" label-width="82px">
              <div class="flex_box">
                <el-form-item label="工单编号：">{{ orderInfo.serialNumber || "-" }}</el-form-item>
                <el-form-item label="工单状态：">{{ orderInfo.workOrderStatusName || "-" }}</el-form-item>
                <el-form-item label="工单类型：">{{ orderInfo.orderTypeName || "-" }}</el-form-item>
                <el-form-item label="业务类型：">{{ orderInfo.resourceTypeName || "-" }}</el-form-item>
              </div>
              <div class="flex_box">
                <el-form-item label="所属区域：">
                  {{ orderInfo.provinceName+orderInfo.cityName+orderInfo.areaName || "-" }}
                </el-form-item>
                <el-form-item label="站址名称：">
                  {{orderInfo.siteName || "-"}}
                </el-form-item>
                <el-form-item label="详细地址：">
                  {{orderInfo.address || "-"}}
                </el-form-item>
                <el-form-item label="预估费用：">{{ orderInfo.predictMoney|| "-" }}</el-form-item> 
              </div>
              <div class="flex_box">
                <el-form-item label="派单时间：">{{ orderInfo.deliveryOrderTime || "-" }}</el-form-item>
                <el-form-item label="回单时间：" >{{ orderInfo.receiptTime || "-"}}</el-form-item> 
              </div>
            </el-form>
          </div>
        </div>
        <div class="section" style="min-height: 200px;">
          <div class="sh1" style="background: #f2f2f2"></div>
          <div class="card_item">
            <div class="card_item_title">回单内容</div>
            <div class="orderType disp_flex" >
              <div class="orderTypeLeft" >
                  <div v-for="item,index in orderDetailsVOList" :key="index" class="orderTypeLeftItems" @click="tabsClick(item,index)" :class="index==tabsActive?'tabsCurrent':''">
                      <div class="itemsLeft">
                        {{ item.moduleName}}
                        <div class="num">
                          {{ item.count }}
                        </div>
                      </div>
                  </div>
              </div>
              <div class="orderTypeRight">
                  <div class="itemVoList2" v-for="item,index in itemVoList" :key="index" @click="getItemVoList(item)">
                      <el-tag  v-if="item.abnormal==0">正常</el-tag>
                      <el-tag type="danger" v-if="item.abnormal==1">异常</el-tag>
                      <span>{{ item.itemName }}</span>
                  </div>
              </div>
            </div>
          </div>
        </div>
        <div class="section">
          <div class="sh1" style="background: #f2f2f2" ></div>
          <div class="card_item" >
            <div class="card_item_title">接单人员信息</div>
            <el-form  label-width="82px" label-position="left">
              <div class="flex_box" v-if="umsMemberPo">
                <el-form-item label="姓名：">{{ umsMemberPo.nickName || "-" }}</el-form-item>
                <el-form-item label="角色：">{{ umsMemberPo.role || "-" }}</el-form-item>
                <el-form-item label="技能：">{{ umsMemberPo.skill || "-" }}</el-form-item>
              </div>
            </el-form>
          </div>
        </div>
        <div class="section" >
          <div class="sh1" style="background: #f2f2f2" ></div>
          <div class="card_item">
            <div class="card_item_title  ali_cen ju_bet">
              <div>轨迹回放</div>
            </div>
            <div style="margin-top: 20px;" >
              <locusMap :lineArr="lineArr" v-if="mapLoading" ></locusMap>
            </div>
          </div>
        </div>
     </div>
    <nav class="fixNav">
      <a class="nav1" v-for="(item, index) in navList" :key="index" @click="jump(index)" :class="index==active?'current':''">{{item.name}}</a>
    </nav>
    <el-dialog
        title="驳回"
        :visible.sync="centerDialogVisible"
        width="30%"
        center>
        <el-form inline
                  :model="form2"
                  ref="form2"
                  label-width="100px"
                  :rules="rules">
          <el-form-item label="备注"  prop="rejectionNote">
            <el-input placeholder="请输入备注" v-model="form2.rejectionNote" type="textarea" class="textarea" maxlength="200"/>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="centerDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="rightBtn('form2')">确 定</el-button>
        </span>
    </el-dialog>
    <el-dialog
        title="详情"
        :visible.sync="dialogVisible"
        width="70%"
        top="8vh"
        customClass="import-dialog"
        center>
        <div class="typeBox" v-for="items,indexs in dialogDetail.list" :key="indexs">
          <div class="itemVOTitle"><span>巡检项目名称：</span><span >{{  dialogDetail.itemName}}</span> </div>
          <div  class="itemVODetail"><span>{{ items.requireTypeName }}：</span><span>{{ items.requireInfo }}</span></div>
          <div v-if="items.checkItemVoList.complianceOrNotList" class="typeItemBox">
              <div class="typeItemTitle">{{ items.checkItemVoList.complianceOrNotList[0][0].typeName }} <el-switch class="switch" disabled v-model="items.complianceSwitch" :active-value="0" :inactive-value="1"></el-switch><span class="red">转为维修</span> <span class="green">标记消除</span></div>
              <div v-for="item1,index1 in items.checkItemVoList.complianceOrNotList" :key="index1" class="typeOneBox">
                <div v-for="item2,index2 in item1" :key="index2" >
                      <div v-if="item2.value=='1'" style="display: flex;" class="typeSecondBox">
                        <span>{{item2.typeSecondName}}：</span>
                        <div style="flex: 1;">
                          <el-input type="textarea" disabled :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="item2.orderDetails.description">

                          </el-input>
                        </div>
                      </div>
                      <div v-if="item2.value=='2'&&item2.orderDetails.pictureList" style="display: flex;"  class="typeSecondBox">
                        <span>{{item2.typeSecondName}}：</span>
                        <div style="flex: 1;" class="images-content">
                            <el-image v-for="item3 in item2.orderDetails.pictureList" fit="cover" class="images" :src="viewUrl+item3">

                            </el-image>
                        </div>
                      </div>
                </div>
              </div>
          </div>
          <div v-if="items.checkItemVoList.isDangersList" class="typeItemBox" >
              <div class="typeItemTitle">{{ items.checkItemVoList.isDangersList[0][0].typeName }} <el-switch class="switch" disabled v-model="items.isDangersSwitch" :active-value="0" :inactive-value="1"></el-switch><span class="red">转为维修</span> <span class="green">标记消除</span></div>
                <div v-for="item1,index1 in items.checkItemVoList.isDangersList" :key="index1" class="typeOneBox">
                  <div v-for="item2,index2 in item1" :key="index2" >
                        <div v-if="item2.value=='1'" style="display: flex;" class="typeSecondBox">
                          <span>{{item2.typeSecondName}}：</span>
                          <div style="flex: 1;">
                            <el-input type="text" disabled  placeholder="请输入内容" v-model="item2.orderDetails.pollingDevice">
                            </el-input>
                          </div>
                        </div>
                        <div v-if="item2.value=='2'" style="display: flex;" class="typeSecondBox">
                          <span>{{item2.typeSecondName}}：</span>
                          <div style="flex: 1;">
                            <el-input type="textarea" disabled :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="item2.orderDetails.description">
                            </el-input>
                          </div>
                        </div>
                        <div v-if="item2.value=='3'" style="display: flex;" class="typeSecondBox">
                          <span>{{item2.typeSecondName}}：</span>
                          <div style="flex: 1;">
                            {{ item2.orderDetails.level }}
                          </div>
                        </div>
                        <div v-if="item2.value=='4'&&item2.orderDetails.pictureList" style="display: flex;"  class="typeSecondBox">
                          <span>{{item2.typeSecondName}}：</span>
                          <div style="flex: 1;" class="images-content">
                               <el-image v-for="item3 in item2.orderDetails.pictureList" fit="cover" class="images" :src="viewUrl+item3">
                              </el-image>
                          </div>
                        </div>
                  </div>
                </div>
          </div>
          <div v-if="items.checkItemVoList.valueRecordList" class="typeItemBox">
            <div class="typeItemTitle">{{ items.checkItemVoList.valueRecordList[0][0].typeName }}<span class="red">转为维修</span> <span class="green">标记消除</span></div>
            <div v-for="item1,index1 in items.checkItemVoList.valueRecordList" :key="index1" class="typeOneBox">
              <div v-for="item2,index2 in item1" :key="index2" >
                    <div v-if="item2.value=='1'" style="display: flex;" class="typeSecondBox">
                      <span>{{item2.typeSecondName}}：</span>
                      <div style="flex: 1;">
                        <el-input type="text" disabled  placeholder="请输入内容" v-model="item2.orderDetails.valueRecord">
                        </el-input>
                      </div>
                    </div>
                    <div v-if="item2.value=='2'&&item2.orderDetails.pictureList" style="display: flex;"  class="typeSecondBox">
                      <span>{{item2.typeSecondName}}：</span>
                      <div style="flex: 1;" class="images-content">
                          <el-image v-for="item3 in item2.orderDetails.pictureList" fit="cover" class="images" :src="viewUrl+item3">
                          </el-image>
                      </div>
                    </div>
              </div>
            </div>
          </div>
          <div v-if="items.checkItemVoList.photoList" class="typeItemBox">
              <div class="typeItemTitle">{{ items.checkItemVoList.photoList[0][0].typeName }}<span class="red">转为维修</span> <span class="green">标记消除</span></div>
              <div v-for="item1,index1 in items.checkItemVoList.photoList" :key="index1" class="typeOneBox">
                <div v-for="item2,index2 in item1" :key="index2" >
                      <div v-if="item2.value=='1'&&item2.orderDetails.pictureList" style="display: flex;"  class="typeSecondBox">
                        <span>{{item2.typeSecondName}}：</span>
                        <div style="flex: 1;" class="images-content">
                            <el-image v-for="item3 in item2.orderDetails.pictureList" fit="cover" class="images" :src="viewUrl+item3">
                            </el-image>
                        </div>
                      </div>
                </div>
              </div>
          </div>
        </div>
        <div v-if="!dialogDetail.list" class="noData">
              暂无数据
        </div>
    </el-dialog>
  </div>
</template>

<script>
import {getReceiptDetails,updateConfirmOrder} from "../api";
import locusMap from "../components/locusMap.vue";
import $ from 'jquery';
import {  BASE_UPLOAD } from "@/config";
export default {
  name: "orderApprovalListDetails",
  components: {
    locusMap
  },
  data() {
    return {
      orderInfo:{},
      editState:false,
      moduleList:[],
      loading:false,
      centerDialogVisible:false,
      dialogVisible:false,
      form2:{},
      rules: {
          rejectionNote: [
            { required: true, message: '请输入备注', trigger: 'blur' },
          ],
      },
      umsMemberPo: {},
      lineArr:[],
      mapLoading:false,
      navList: [{
          name:'工单信息',
          index:1
        },{
          name:'回单内容',
          index:2
        },{
          name:'接单人员信息',
          index:3
        },{
          name:'轨迹回放',
          index:4
        }],
      scroll: '',
      orderDetailsVOList:[],
      itemVoList:[],
      tabsActive:0,
      active:0,
      viewUrl: BASE_UPLOAD,
      dialogDetail:{}
    }
  },
  watch: {
   scroll: function () {
    this.loadSroll()
   }
  },
  created() {
    let id=this.getRouterValue('id');
    this.getDetails(id);
  },
  mounted() {
    let that = this;
    window.addEventListener('scroll', that.dataScroll,true);
  },
  methods: {
    getItemVoList(data){
      this.dialogDetail=data;
      this.dialogVisible=true;
    },
    loadSroll: function () {
      var self = this;
      var $navs = $(".nav1");
      var sections = document.getElementsByClassName('section');
      for (var i = sections.length - 1; i >= 0; i--) {
      if (self.scroll >= sections[i].offsetTop - 150) {
        $navs.eq(i).addClass("current").siblings().removeClass("current")
        break;
      }
      }
    },
    jump(index) {
      let jump = document.getElementsByClassName('section');
      // 获取需要滚动的距离
      let total = jump[index].offsetTop;
      // Chrome
      document.body.scrollTop = total;
      // Firefox
      document.documentElement.scrollTop = total;
      // Safari
      window.pageYOffset = total;
      $('.app-main').animate({
        'scrollTop': total-50
      }, 400);
      setTimeout(() => {
        $(".nav1").removeClass("current");
        this.active=index;
      }, 500);
    },
    dataScroll() {
      this.scroll = document.documentElement.scrollTop || document.body.scrollTop||document.querySelector('.app-main').scrollTop;
    },
    getRouterValue(key) {
      return this.$route.query?.[key]
    },
    toBack() {
      this.$router.push({
            path:"/order/ordeReceipt"
      })
    },
    getDetails(id){
      let that = this;
      getReceiptDetails(id).then(res=>{
        if(res.code==0){
            this.orderInfo=res.data;
            let {umsMemberPo,orderDetailsVOList} = res.data;
            that.umsMemberPo = umsMemberPo || {};
            that.orderDetailsVOList = orderDetailsVOList || [];
            that.itemVoList=orderDetailsVOList.length>0?orderDetailsVOList[0].itemVoList:[];
            let lineArr=[];
            that.orderInfo.userPlaceOrderList.forEach(function(item){
              lineArr.push([item.lng,item.lat])
            })
            that.lineArr=lineArr;
            that.mapLoading=true;
        }
      })
    },
    tabsClick(data,index){
      this.itemVoList=data.itemVoList;
      this.tabsActive=index
    },
    rightBtn(formName){
      this.$refs[formName].validate((valid) => {
          if(valid){
            updateConfirmOrder(this.form2).then(res=>{
              if(res.code==0){
                this.toBack();
                this.centerDialogVisible=false;
              }
            })
          }
      });
    },
    toApproval(row,state){
      this.$confirm(state==9?'请确认是否支付?':(state==11?'请确认是否通过该回单?':'请确认是否驳回该工单？'), '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass:'del-model',
        type: 'warning'
      }).then(() => {
          if(state==11){
            let json={
              id:row.id,
              status:state
            };
            updateConfirmOrder(json).then(res=>{
              if(res.code==0){
                this.$refs.table?.resetInit();
              }
            })
          }else if(state==9){
            let json={
              id:row.id,
              payStatus:1
            };
            updateConfirmOrder(json).then(res=>{
              if(res.code==0){
                this.$refs.table?.resetInit();
              }
            })
          }else{
              this.form2={
                id:row.id,
                status:state
              }
              this.centerDialogVisible=true;
          }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });          
      });
      
    },
  }
}
</script>

<style scoped lang="scss">
@import "./index.scss";
.orderApprovalListDetails {
  .h3 {
    font-size: 18px;
    font-weight: bold;
  }
  .header_box {
    background: #ffffff;
    margin: -20px;
    padding: 20px;

    .title {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 10px;
    }
  }
}
.fixNav{
  background: #FAFAFA;
  box-shadow: 0px 2px 15px 0px rgba(0,0,0,0.05);
  border-radius: 4px;
  border: 1px solid rgba(151,151,151,0.15);
  position:fixed;
  right:30px;
  top:130px;
  z-index: 999;
  .nav1 {
    display: block;
    margin: 0 20px;
    width: 140px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    border-bottom: 1px solid rgba(0,0,0,0.1);
  }
  .nav1:last-of-type{
    border-bottom:none;
  }
}

 .current {
    color: #5674E5;
 }
 .orderTypeLeft{
  border: 1px solid rgba(0,0,0,0.1);
  .orderTypeLeftItems{
    // max-width: 236px;
    height: 54px;
    border-radius: 3px 0px 0px 0px;
    font-size: 14px;
    color: rgba(0,0,0,0.65);
    cursor: pointer;
    position: relative;
    .itemsLeft{
      width: auto;
      height: 100%;
      margin:0 20px;
      border-bottom: 1px solid rgba(0,0,0,0.1);
      display:flex; 
      align-items:center;
      justify-content: center;
      padding: 0 10px;
      position: relative;
      .num{
        width: 14px;
        height: 14px;
        background: #FF2100;
        margin-top: -20px;
        color: #FAFAFA;
        text-align: center;
        line-height: 14px;
        border-radius: 50%;
      }
    }
  }
  .orderTypeLeftItems:last-of-type .itemsLeft{
    border-bottom: none;
  }
  .tabsCurrent{
    color: #5674E5;
    background: linear-gradient(90deg, rgba(90, 119, 226, 0.1) 0%, rgba(112, 140, 245, 0.1) 100%);
  }
 }
 .orderTypeRight{
  flex: 1;
  margin-left:20px ;
  .itemVoList2{
    padding: 20px 0;
    display: flex;
    justify-content: normal;
    align-items: center;
    border-bottom: 1px solid #ddd;
    cursor: pointer;
    span:nth-of-type(2){
      margin-left: 20px;
    }
  }
 }
 .typeBox{
    .itemVODetail{
      margin: 10px 0;
      margin-left: 10px;
    }
    .itemVOTitle{
      margin-left: 10px;
      font-size: 16px;
      font-weight: bold;
    }
    .typeItemBox{
      margin-bottom: 20px;
      border: 1px solid #ddd;
      border-radius: 10px;
      padding: 20px;
      .typeItemTitle{
        .switch{
          margin-left:20px;
        }
        .red{
          color: #E55656;
          margin-left:20px;
        }
        .green{
          color: #5674E5;
          margin-left:20px;
        }
      }
      .typeOneBox{
        border-bottom: 1px solid #ddd;
        .typeSecondBox{
          margin: 10px 0;
          padding-bottom: 10px;
        }
      }
      .typeOneBox:last-of-type{
        border-bottom: none;
      }
      .images-content{
        .images{
          width: 150px;
          height: 150px;
          margin-left: 10px;
        }
      }
      ::v-deep{
        textarea{
          resize: none;
        }
      }
    }
 }
 ::v-deep .el-dialog.import-dialog{
    height: auto;
    max-height: 100vh;
  }
  //弹出层里内容的高度
  ::v-deep .el-dialog__body{
    max-height: 80vh!important;
    overflow-y: auto;
  }
 .noData{
  height: 300px;
  text-align: center;
  line-height: 300px;
 }
::v-deep .textarea textarea{
  resize: none!important;
  width: 300px;
}

.form_box {
  background-color: #ffffff;
  margin-top: 40px;
  border-radius: 4px;
  min-width: 990px;

  .card_item {
    padding: 20px;

    .flex_box {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      .el-form-item{
        width: 25%;
      }
    }
    .flex_box2{
      display: flex;
      align-items: center;
      justify-content: flex-start;
      .el-form-item{
        width: 20%;
      }
    }

    .card_item_header_title ::v-deep {
      .el-form-item__label {
        font-size: 20px;
        font-weight: 500;
        color: #333333;
      }

      .el-form-item__content {
        color: #000000a5;
        font-size: 20px;
      }
    }

    .card_item_title ::v-deep {
      font-size: 16px;
      font-weight: 500;
      margin-top: 10px;
      margin-bottom: 10px;
      color: #333333;

      .el-form-item__label {
        font-size: 16px;
        font-weight: 500;
        margin-top: 20px;
        margin-bottom: 10px;
        color: #333333;
      }
    }

    ::v-deep {
      .el-form-item__label {
        color: #000000d8;
        font-weight: 400;
      }

      .el-form-item__content {
        color: #000000a5;
      }
    }
  }

  .order_status_box {
    width: 100%;
    display: flex;

    justify-content: space-between;

    .order_status_box_item {
      min-width: 100px;
      margin-top: 10px;
      flex: 2;

      .status_box_status {
        border-radius: 20px;
        background: #f0f2f5;
        color: #949599;
        font-weight: 500;
        line-height: 40px;
        text-align: center;
        position: relative;
      }

      .status_box_time {
        font-size: 12px;
        color: #333333;
        margin-top: 10px;
        width: 100%;
        text-align: center;
      }
    }

    .status_box_status_empty {
      flex: 1;
      margin: 30px 10px 0;
      border: 1px dotted #2879ff;
      height: 1px;
      position: relative;

      &:before {
        content: "";
        position: absolute;
        left: -2px;
        top: -3px;
        width: 6px;
        height: 6px;
        border-radius: 10px;
        background: #2879ff;
      }

      &:after {
        content: "";
        position: absolute;
        right: -2px;
        top: -3px;
        width: 6px;
        height: 6px;
        border-radius: 10px;
        background: #2879ff;
      }

      /* &:last-of-type {
        display: none;
      } */
    }

    .status_box_time:first-child {
      color: red;
    }

    .status_box_status_empty:last-child {
      /* border: 1px solid red; */
    }

    .order_status_box_item.active {
      .status_box_status {
        color: #ffffff;
        background: #2879ff;
      }
    }
  }
}
</style>
