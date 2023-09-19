<template>
  <div style="height: 100%" class="formPage" ref="orderInfo" v-loading="loading">
    <div class="header_box disp_flex ju_bet ali_cen">
      <div>
        <div class="title">{{ title }}</div>
      </div>
      <div class="back_box">
        <el-button v-hold-click type="" @click="back">返回</el-button>
      </div>
    </div>
    <div class="form_box scrllbar">
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
              <el-form-item label="巡检计划名称：" label-width="110px" v-if="orderInfo.orderTypeName=='巡检'">
                {{ orderInfo.pollingName || "-" }}
              </el-form-item>
              <el-form-item label="工单来源：" >
                {{ orderInfo.workSource || "-" }}
              </el-form-item>
              <el-form-item label="站址名称：">
                {{orderInfo.siteName || "-"}}
              </el-form-item>
              <el-form-item label="紧急程度：" >
                {{ orderInfo.orderUrgencyName || "-" }}
              </el-form-item>
              <el-form-item label="预估费用：" v-if="orderInfo.orderTypeName!=='巡检'">{{ orderInfo.predictMoney|| "-" }}</el-form-item> 
            </div>
            <div class="flex_box">
              <el-form-item label="派单时间：">{{ orderInfo.deliveryOrderTime || "-" }}</el-form-item>
              <el-form-item label="接单时间：" v-if=" orderInfo.takeOrderTime">{{ orderInfo.takeOrderTime || "-"}}</el-form-item> 
              <el-form-item label="预估费用：" v-if="orderInfo.orderTypeName=='巡检'">{{ orderInfo.predictMoney|| "-" }}</el-form-item> 
              <el-form-item label="实施周期：">{{ orderInfo.orderExecuteStartTime +'~'+orderInfo.orderExecuteEndTime || "-"}}</el-form-item> 
            </div>
          </el-form>
        </div>
      </div>
      <div class="section" style="min-height: 200px;">
        <div class="sh1" style="background: #f2f2f2"></div>
        <div class="card_item">
          <div class="card_item_title">{{orderInfo.orderTypeName}}内容</div>
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
      <div class="section" v-if="hiddenInfoList&&orderInfo.orderTypeName!=='巡检'">
        <div class="sh1" style="background: #f2f2f2" ></div>
        <div class="card_item">
          <div class="card_item_title">隐患信息</div>
          <el-form>
            <div v-for="item,index in hiddenInfoList" :key="index" style="border-bottom: 1px solid #ddd;padding-bottom: 20px">
              <div style="padding:20px 0;font-size: 15px;">隐患信息{{ index+1 }}</div>
              <div class="flex_box">
                  <el-form-item label="隐患来源：">{{ item.source || "-" }}</el-form-item>
                  <el-form-item label="隐患等级：">{{ item.level || "-" }}</el-form-item>
                  <el-form-item label="隐患设备：">{{ item.device || "-" }}</el-form-item>
                  <el-form-item label="隐患描述：">{{ item.describe || "-" }}</el-form-item>
              </div>
              <div class="flex_box" >
                  <el-form-item label="发现时间：">{{ item.createTime || "-" }}</el-form-item>
                  <el-form-item label="发现人员：">{{ item.createUser || "-" }}</el-form-item>
                  <el-form-item label="发现人电话：">{{ item.phone || "-" }}</el-form-item>
                  <el-form-item label="现场照片："><img :src="item.img" alt="" style="width: 200px;"></el-form-item>
              </div>
            </div>
          </el-form>
        </div>
      </div>
      <div class="section" v-if="activeOrderStatus >= 3&&JSON.stringify(umsMemberPo) !== '{}'&&activeOrderStatus <= 9">
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
      <div class="section" v-if="activeOrderStatus >= 3&&activeOrderStatus <= 9">
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
      <div class="section">
        <div class="sh1" style="background: #f2f2f2"></div>
        <div class="card_item">
          <div class="card_item_title">站址基础信息</div>
          <el-form>
            <div class="flex_box">
              <el-form-item label="站址编码：">{{ siteToOrderPo.stationCode || "-" }}</el-form-item>
              <el-form-item label="站址名称：">{{ siteToOrderPo.name || "-" }}</el-form-item>
              <el-form-item label="站址类型：">{{ siteToOrderPo.siteTypeName || "-" }}</el-form-item>
              <el-form-item label="FSU状态：">{{ siteToOrderPo.fsuStatus || "-" }}</el-form-item>
            </div>
            <div class="flex_box">
              <el-form-item label="所属省市区：">{{ siteToOrderPo.areaName || "-" }}</el-form-item>
              <el-form-item label="详细地址：">{{ siteToOrderPo.address || "-" }}</el-form-item>
              <el-form-item label="经度：">{{ siteToOrderPo.lng || "-" }}</el-form-item>
              <el-form-item label="纬度：">{{ siteToOrderPo.lat || "-" }}</el-form-item>
            </div>
            <div class="flex_box">
              <el-form-item label="历史维修："><span>点击查看</span></el-form-item>
            </div>
          </el-form>
        </div>
      </div>
      <div class="section">
        <div class="sh1" style="background: #f2f2f2"></div>
        <div class="card_item">
          <div class="card_item_title">站址运营商信息</div>
          <el-form  v-if="siteToOrderPo.operatorVOList">
            <div class="flex_box2" v-for="item,index in siteToOrderPo.operatorVOList" :key="index">
              <el-form-item label="运营商类型：">{{ item.operator || "-" }}</el-form-item>
              <el-form-item label="站址维护服务等级：">{{ item.preserveLevelName || "-" }}</el-form-item>
              <el-form-item label="是否购买发电服务：">{{ item.powerGenerationServiceName || "-" }}</el-form-item>
              <el-form-item label="运营商制式：">{{ item.deviceStandardName || "-" }}</el-form-item>
              <el-form-item label="起租时间：">{{ item.rentStartTime|| "-" }}</el-form-item>
            </div>
          </el-form>
        </div>
      </div>
    </div>
    <nav class="fixNav">
      <a class="nav1" v-for="(item, index) in navList" :key="index" @click="jump(index)" :class="index==active?'current':''">{{item.name}}</a>
    </nav>
    <el-dialog
        title="详情"
        :visible.sync="dialogVisible"
        width="80%"
        top="8vh"
        customClass="import-dialog"
        center>
        <div class="typeBox" v-for="items,indexs in dialogDetail.list" :key="indexs">
          <div class="itemVOTitle"><span>巡检项目名称：</span><span >{{  dialogDetail.itemName}}</span> </div>
          <div  class="itemVODetail"><span>{{ items.requireTypeName }}：</span><span>{{ items.requireInfo }}</span></div>
          <div v-if="items.checkItemVoList.complianceOrNotList" class="typeItemBox">
              <div class="typeItemTitle">{{ items.checkItemVoList.complianceOrNotList[0][0].typeName }} <el-switch class="switch" disabled v-model="items.complianceSwitch" :active-value="0" :inactive-value="1"></el-switch></div>
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
              <div class="typeItemTitle">{{ items.checkItemVoList.isDangersList[0][0].typeName }} <el-switch class="switch" disabled v-model="items.isDangersSwitch" :active-value="0" :inactive-value="1"></el-switch></div>
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
            <div class="typeItemTitle">{{ items.checkItemVoList.valueRecordList[0][0].typeName }}</div>
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
              <div class="typeItemTitle">{{ items.checkItemVoList.photoList[0][0].typeName }}</div>
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
import basic from "@/mixins/basic";
import {workOrder} from "@/api/order";
import imagesBox from "@/components/custom/imagesBox";
import mapCustom from "./components/map.vue";
import locusMap from "./components/locusMap.vue";
import {deepClone} from "@/utils";
import {BASE_UPLOAD} from "@/config";
import $ from 'jquery';
export default {
  components: {
    mapCustom,
    imagesBox,
    locusMap
  },
  data() {
    return {
      baseUpload: BASE_UPLOAD,
      title: "工单详情",
      id: "",
      orderInfo: {},
      siteVo: {},
      umsMemberPo: {},
      hiddenInfoList:[],
      activeOrderStatus: null,
      points: 3.5,

      userLists: [],
      userLoading: "",
      feedbackList: [],
      orderTypeList:[],
      siteToOrderPo:{},
      stations:[],
      lineArr:[],
      mapLoading:false,
      navList: [],
      scroll: '',
      active:0,
      orderDetailsVOList:[],
      dialogVisible:false,
      tabsActive:0,
      loading: false,
      dialogDetail:{},
      viewUrl: BASE_UPLOAD,
      state:false

    };
  },
  mixins: [basic],
  created() {
    const {id,state} = this.$route.query;
    this.id = id;
    this.state = state;
    if (id) {
      this.loader_info();
    }
  },
  mounted() {
    let that = this;

    that.$nextTick(() => {
      that.$refs.orderInfo.scrollTop = 0;
    });
    window.addEventListener('scroll', that.dataScroll,true);
  },
  methods: {
    getItemVoList(data){
      this.dialogDetail=data;
      this.dialogVisible=true;
    },
    dataScroll() {
      this.scroll = document.documentElement.scrollTop || document.body.scrollTop||document.querySelector('.app-main').scrollTop;
    },
    getRouterValue(key) {
      return this.$route.query?.[key]
    },
    back() {
      if(this.state){
          this.$router.push({
              path:"/order/orderList",
              query:{defaultCurrent:this.getRouterValue('defaultCurrent'),defaultSize:this.getRouterValue('defaultSize'),form:this.getRouterValue('form')}
          })
      }else{
          this.$router.push({
                path:"/order/orderError",
                query:{defaultCurrent:this.getRouterValue('defaultCurrent'),defaultSize:this.getRouterValue('defaultSize'),form:this.getRouterValue('form')}
          })
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
    loader_info: function () {
      let that = this;
      that.loading=true;
      workOrder({method: "get", name: "detail"}, {id: that.id})
          .then((res) => {
            let {umsMemberPo,siteToOrderPo,hiddenInfoList,orderDetailsVOList} = res.data;
            this.orderInfo = deepClone(res.data)
            that.activeOrderStatus = this.orderInfo.workOrderStatus;
            that.siteToOrderPo = siteToOrderPo || {};
            that.umsMemberPo = umsMemberPo || {};
            that.hiddenInfoList = hiddenInfoList || [];
            that.orderDetailsVOList = orderDetailsVOList || [];
            that.itemVoList=orderDetailsVOList?orderDetailsVOList[0].itemVoList:[];
            if(that.activeOrderStatus>=3&&that.activeOrderStatus<=9){
              if(this.orderInfo.orderTypeName!=='巡检'){
                this.navList= [{
                    name:'工单信息',
                    index:1
                  },{
                    name:this.orderInfo.orderTypeName+'内容',
                    index:2
                  },{
                    name:'隐患信息',
                    index:3
                  },{
                    name:'接单人员信息',
                    index:4
                  },{
                    name:'接单人员实时轨迹',
                    index:5
                  },{
                    name:'站址基础信息',
                    index:6
                  },{
                    name:'站址运营商信息',
                    index:7
                }]
              }else{
                this.navList= [{
                    name:'工单信息',
                    index:1
                  },{
                    name:this.orderInfo.orderTypeName+'内容',
                    index:2
                  },{
                    name:'隐患信息',
                    index:3
                  },{
                    name:'接单人员信息',
                    index:4
                  },{
                    name:'接单人员实时轨迹',
                    index:5
                  },{
                    name:'站址基础信息',
                    index:6
                  },{
                    name:'站址运营商信息',
                    index:7
                }]
              }
            }else{
              if(this.orderInfo.orderTypeName!=='巡检'){
                this.navList= [{
                    name:'工单信息',
                    index:1
                  },{
                    name:this.orderInfo.orderTypeName+'内容',
                    index:2
                  },{
                    name:'隐患信息',
                    index:3
                  },{
                    name:'站址基础信息',
                    index:4
                  },{
                    name:'站址运营商信息',
                    index:5
                }]
              }else{
                this.navList= [{
                    name:'工单信息',
                    index:1
                  },{
                    name:this.orderInfo.orderTypeName+'内容',
                    index:2
                  },{
                    name:'站址基础信息',
                    index:3
                  },{
                    name:'站址运营商信息',
                    index:4
                }]
              }
            }
            that.loading=false;
            let lineArr=[];
            that.orderInfo.userPlaceOrderList.forEach(function(item){
              lineArr.push([item.lng,item.lat])
            })
            that.lineArr=lineArr;
            that.mapLoading=true;
          })
          .catch((error) => {
          });
    },
    tabsClick(data,index){
      this.itemVoList=data.itemVoList;
      this.tabsActive=index;
    }
  },
  watch: {
   scroll: function () {
    this.loadSroll()
   }
  },

};
</script>
<style lang="scss" scoped>
.app-container {
  font-size: 0;
  position: relative;

  ::v-deep {
    .el-table {
      &::before {
        content: none;
      }
    }
  }
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

.card_right_box {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .card_right_box_txt {
    font-size: 14px;
    margin-right: 10px;
  }
}

.rate_box {
  margin-top: 10px;
}

.score {
  margin-top: 6px;
  height: 22px;
  display: flex;
  align-items: center;

  &.noColor {
    svg {
      color: #c6d1de;
    }

    span {
      color: #c6d1de;
    }
  }

  svg {
    width: 20px;
    height: 20px;
    margin-right: 0.3rem;
    color: #e6a23c;
  }

  span {
    font-size: 17px;
    color: #e6a23c;
  }
}

.empty_order {
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  color: #949599
}

.box {
  border-radius: 6px;
  background-color: #fff;
  padding: 20px;

  &_title {
    font-size: 16px;
    color: #000000d8;
    font-weight: 500;
    margin-bottom: 20px;
  }

  &:first-child {
    margin-bottom: 20px;
  }

  .detail {
    display: inline-block;
    margin-bottom: 10px;
  }

  .info {
    display: flex;
    justify-content: space-around;
    background-color: #f1f1f1;
    border-radius: 6px;
    min-height: 60px;
    padding: 20px 10px;

    div {
      display: flex;
      flex-direction: column;
      flex: 1;

      span {
        text-align: center;
        font-size: 22px;
        font-weight: 500;


        &:first-child {
          font-size: 14px;
          font-weight: normal;
          margin-bottom: 16px;
        }
      }
    }
  }

  .hr {
    line-height: 1px;
    border-top: 1px dashed #939292;
    margin-bottom: 8px;
  }

  .tabs {
    ::v-deep{
      .el-tabs,.el-tabs__content,.el-tab-pane{
        height: 100%;
      }
      .el-tabs__content{
        height: calc(100% - 40px);
      }
    }
    .tab-list {
      overflow-y: auto;
      height:100%;

      &-cell {
        .head {
          display: flex;
          width: 100%;
          height: 100%;
          justify-content: space-between;
          align-items: center;

          .left {
            display: flex;
            flex-direction: column;
            justify-content: center;

            span:first-child {
              font-size: 14px;
            }

            span:last-child {
              margin-top: 12px;
              font-size: 13px;
              color: #5a5e66;
            }
          }

          .right {
            height: 26px;
            min-width: 50px;
            border-radius: 20px;
            margin-right: .5rem;
            border: 2px solid #67C23A;
            color: #67C23A;
            padding: 6px;

            display: flex;
            align-items: center;
            justify-content: center;
          }

          .error {
            border: 2px solid #F56C6C;
            color: #F56C6C;
          }
        }
      }
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

</style>
