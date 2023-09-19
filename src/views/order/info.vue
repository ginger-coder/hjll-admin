<template>
  <div style="height: 100%" class="formPage" ref="orderInfo">
    <div class="header_box disp_flex ju_bet ali_cen">
      <div>
        <div class="title">{{ title }}</div>
      </div>
      <div class="back_box">
        <el-button v-hold-click type="" @click="back">返回</el-button>
      </div>
    </div>
    <div class="form_box scrllbar">
      <div class="card_item">
        <el-form ref="form" label-position="left" label-width="82px">
          <el-form-item class="card_item_header_title" label-width="114px" label="工单编号：">
            <div class="disp_flex ju_bet ali_cen">
              <div>{{ workOrder.serialNumber || "-" }}</div>
              <!-- 未派单 -->
              <div class="card_right_box" v-if="activeOrderStatus === '0'">
                <div class="card_right_box_txt">未派单</div>
<!--                <el-button type="" v-hold-click @click="cancelOrder" plain>取消工单</el-button>-->
                <el-button type="primary" v-hold-click @click="do_confirm('send')">派单</el-button>
              </div>
              <!-- 已派单 -->
              <div class="card_right_box" v-if="activeOrderStatus === '1'">
                <div class="card_right_box_txt">已派单</div>
                <el-button v-hold-click @click="cancelOrder" type="primary" plain>取消工单</el-button>
                <!-- 异常状态 -->
                <template v-if="workOrder.exceptionStatus!='1'">
                  <template v-if="workOrder.exceptionStatus == '6' ">
                    <div class="card_right_box_txt">超时未接单</div>
                  </template>
                  <template v-if="workOrder.exceptionStatus == '2' ">
                    <div class="card_right_box_txt">超时未确认</div>
                  </template>
                  <el-button v-hold-click @click="cancelOrder" type="primary" plain>取消工单</el-button>
                  <el-dropdown @command="doCommand($event)">
                    <el-button @click.stop="" type="danger">立即处理</el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="force" v-if="workOrder.exceptionStatus == '6' ">强制派单</el-dropdown-item>
                      <el-dropdown-item command="dhcd" v-if="workOrder.exceptionStatus == '2' ">电话催单</el-dropdown-item>
                      <el-dropdown-item command="again" v-if="workOrder.exceptionStatus == '2' ">重新派单</el-dropdown-item>
                      <el-dropdown-item command="yjcl">应急处理</el-dropdown-item>
                      <el-dropdown-item command="lxkf">联系客服</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </div>
              <!-- 已接单 -->
              <div class="card_right_box" v-if="activeOrderStatus === '3'">
                <div class="card_right_box_txt">已接单</div>
                <el-button v-hold-click @click="cancelOrder" type="primary" plain>取消工单</el-button>
              </div>
              <!-- 已接单 -->
              <div class="card_right_box" v-if="activeOrderStatus === '3'">
                <div class="card_right_box_txt">已接单</div>
                <el-button v-hold-click @click="cancelOrder" type="primary" plain>取消工单</el-button>
              </div>
              <!-- 已回单 -->
              <div class="card_right_box" v-if="activeOrderStatus === '7'">
                <div class="card_right_box_txt">已回单</div>
                <el-button v-hold-click @click="confirmOrder" type="" plain style="margin: 6px;">确认</el-button>
                <!-- <el-button v-hold-click @click="confirmPayOrder" type="primary" plain>确认并支付</el-button> -->
                <div v-if="workOrder.workOrderTypeId==2">
                  <el-button v-hold-click @click="confirmPayOrder" type="primary" plain>确认并转故障</el-button>
                  <el-button v-hold-click @click="confirmPayOrder" type="primary" plain>确认并转维修</el-button>
                </div>
                <div v-else-if="workOrder.workOrderTypeId==3">
                  <el-button v-hold-click @click="confirmPayOrder" type="primary" plain>确认并转维修</el-button>
                </div>
              </div>
              <!-- 已确认 -->
              <div class="card_right_box" v-if="activeOrderStatus === '11'">
                <div class="card_right_box_txt">已确认</div>
                <el-button v-hold-click @click="payOrder" type="primary" plain>立即支付</el-button>
              </div>
              <!-- 已完成 -->
              <div class="card_right_box" v-if="activeOrderStatus === '9'">
                <div class="card_right_box_txt">已完成</div>
                <el-button v-hold-click @click="pjOrder" type="primary" plain>立即评价</el-button>
              </div>
            </div>
          </el-form-item>
          <div class="flex_box">
            <el-form-item label="工单类型：">{{ workOrder.workOrderTypeName || "-" }}</el-form-item>
            <el-form-item label="巡检类型：">{{ workOrder.workOrderTypeDetailsName || "-" }}</el-form-item>
          </div>
          <div class="flex_box">
            <el-form-item label="紧急程度：">{{
                filterDictLabel(orderUrgency, workOrder.orderUrgency) || "-"
              }}
            </el-form-item>
            <el-form-item label="工单执行周期：" label-width="110px">{{ timeFilter(workOrder.orderExecuteStartTime) }} ~
              {{ timeFilter(workOrder.orderExecuteEndTime) }}
            </el-form-item>
          </div>
          <div class="flex_box">
            <el-form-item label="创建方式：">{{ filterDictLabel(createWay, workOrder.createWay) || "-" }}</el-form-item>
            <el-form-item label="创建时间：">{{ timeFilter(workOrder.createTime) }}</el-form-item>
          </div>
          <el-form-item class="card_item_title" label="站址信息"></el-form-item>
          <div class="flex_box">
            <el-form-item label="所属省份：">{{ siteVo.provinceName || "-" }}</el-form-item>
            <el-form-item label="所属城市：">{{ siteVo.cityName || "-" }}</el-form-item>
            <el-form-item label="所属区县：">{{ siteVo.districtName || "-" }}</el-form-item>
            <el-form-item label="所属站点：">{{ siteVo.siteName || "-" }}</el-form-item>
          </div>
          <el-form-item label="站点详细地址：" label-width="114px">{{ siteVo.address || "-" }}</el-form-item>
        </el-form>
      </div>
      <div class="sh1" style="background: #f2f2f2"></div>
      <div class="card_item">
        <div class="card_item_title disp_flex ali_cen ju_bet">
          <div>工单状态</div>
          <div class="card_right_box">
            <el-button v-hold-click v-if="activeOrderStatus >= 3 " @click="openFeedbackDrawer()" plain>查看定时反馈
            </el-button>
            <el-button v-hold-click v-if="activeOrderStatus >= 7  " @click="openReceiptDrawer()" type="primary" plain>
              查看回单结果
            </el-button>
          </div>
        </div>
        <div class="order_status_box">
          <div v-for="(item, index) in orderStatus" class="flex">
            <div class="disp_flex ju_bet">
              <div class="order_status_box_item"
                   :class="Object.keys(workOrderStatus1).length!=0 && workOrderStatus1[item.key] !== null ? 'active' : ''">
                <div class="status_box_status flex">{{ item.label }}</div>
                <div class="status_box_time">{{ timeFilter(workOrderStatus1[item.time]) }}</div>
              </div>
              <div class="status_box_status_empty" v-if="index != orderStatus.length - 1"></div>
              <div v-else class="flex"></div>
            </div>
          </div>
        </div>
        <mapCustom v-if="activeOrderStatus === '3'"></mapCustom>
      </div>
      <div class="sh1" style="background: #f2f2f2"></div>
      <div class="card_item">
        <div class="card_item_title  ali_cen ju_bet">
          <div>轨迹回放</div>
        </div>
        <div style="margin-top: 20px;">
          <locusMap :lineArr="lineArr" v-if="mapLoading" ></locusMap>
        </div>
      </div>
      <div class="sh1" style="background: #f2f2f2"></div>
      <div class="card_item">
        <div class="card_item_title">订单信息</div>
        <el-form>
          <div class="flex_box">
            <el-form-item label="订单金额：" label-width="82px">
              <span v-if="workOrder.workPrice!=null">工单费用：</span>
              {{ workOrder.workPrice }}<span style="margin-left:4px" v-if="workOrder.workPrice != null">¥</span>
              <span v-if="workOrder.workPrice!=null" style="margin-left:20px">+ 附加费：</span>
              {{ workOrder.addMoney }}<span style="margin-left:4px" v-if="workOrder.addMoney != null">¥</span>
              <!-- <span v-if="workOrder.workPrice != null">¥</span>  -->
            </el-form-item>
            <el-form-item label="支付状态：" label-width="82px">{{
                filterDictLabel(orderPayStatus, workOrder.payStatus)
              }}
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="sh1" style="background: #f2f2f2"></div>
      <div class="card_item">
        <div class="card_item_title">接单人员信息</div>
        <!-- 未派单 -->
        <div class="empty_order" v-if="activeOrderStatus == 0"> 暂无人接单</div>
        <!-- 已派单 -->
        <!-- <template v-else>
          <el-rate v-model="points" :colors="colors" disabled show-score> </el-rate>
        </template> -->
        <el-form v-else label-width="82px" label-position="left">
          <div class="flex_box" v-if="umsMember">
            <el-form-item label="姓名：">{{ umsMember.nickName || "-" }}</el-form-item>
            <el-form-item label="角色：">{{ umsMember.workRoleId || "-" }}</el-form-item>
            <el-form-item label="技能：">{{ umsMember.workSkillId || "-" }}</el-form-item>
            <el-form-item label="评分：">
              <div class="score" v-if="umsMember.score" :class="umsMember.score == 0 ? 'noColor' : ''">
                <svg-icon icon-class="star" width="80px"></svg-icon>
                {{ umsMember.score }}
              </div>
              <!-- <el-rate class="rate_box" v-model="umsMember.score" disabled show-score text-color="#ff9900"> </el-rate> -->
            </el-form-item>
          </div>
          <el-form-item label="接单时间：">{{ timeFilter(workOrderStatus1.haveOrderTime) || '-' }}</el-form-item>
        </el-form>
      </div>
    </div>
    <el-drawer title="定时反馈" :visible.sync="feedbackDrawer" size="50%" :direction="'rtl'"
               custom-class="feedbackDrawerBox">
      <template v-for="item in feedbackList">
        <div class="drawer_box disp_flex ali_cen">
          <div class="drawer_box_left flex">
            <div class="disp_flex ali_cen drawer_box_left_header">
              <div class="drawer_box_left_avater"></div>
              <div class="drawer_box_left_name">{{ item.userName }}</div>
              <div class="drawer_box_left_time">{{ item.createTime_ }}</div>
            </div>
            <div class="drawer_box_left_summary">{{ item.content }}</div>
          </div>
          <div class="drawer_box_right disp_flex flex_column ali_cen">
            {{ tableStatusLabel(stateData, item.orderStatus) }}
            <!-- <div><el-tag type="success" size="mini">处理中</el-tag></div>
            <div style="color: #949599; margin-top: 4px">提交时订单状态</div> -->
          </div>
        </div>
      </template>
    </el-drawer>
    <el-drawer title="回单结果" :visible.sync="receiptDrawer" size="70%" :direction="'rtl'"
               custom-class="feedbackDrawerBox1">
      <div class="box" style="height:220px">
        <div class="box_title">基本信息</div>
        <span
            class="detail">{{ siteVo.provinceName }}{{ siteVo.cityName }}{{ siteVo.districtName }} - {{
            siteVo.siteName
          }} - {{ workOrder.workOrderTypeDetailsName }} - {{
            timeFilter(workOrder.createTime, '{y}-{m}-{d}')
          }}</span>
        <div class="info">
          <div v-for="(item,index) in receipt.info" :key="'info'+index">
            <span> {{ item.label }}</span>
            <span> {{ receipt.infoData[item.key] || 0 }}</span>
          </div>
        </div>
      </div>

      <div class="box" style="height:calc(100% - 240px)">
        <div class="box_title">回单信息</div>
        <div class="tabs" style="height:calc(100% - 40px)">
          <el-tabs v-model="receipt.tab" @tab-click="handleTabClick">
            <el-tab-pane v-for="(module,idx) in receipt.modules"
                         :key="'module' + idx"
                         :label="(module || {name:''}).name"
                         :name="(module || {id:''}).id.toString()">
            <div class="tab-list" >
                <div class="tab-list-cell" v-for="(cell,i) in receipt.list" :key="'tab-list-cell' + i">
                  <el-collapse v-model="receipt.activeCollapse">
                    <el-collapse-item name="1">
                      <template #title>
                        <div class="head">
                          <div class="left">
                            <span>{{ cell.moduleName }}</span>
                            <span>{{ cell.required }}</span>
                          </div>
                          <div v-if='workOrder.workOrderTypeId === 3'>
                            <div :class="['right',cell.maintainSuggestion === '1'?'normal':'error']">
                              <span>{{ cell.maintainSuggestion === '1'?'已处理':'转维修' }}</span>
                            </div>
                          </div>
                          <div v-else>
                            <div :class="['right',cell.result === '正常'?'normal':'error']">
                              <span>{{ cell.result }}</span>
                            </div>
                          </div>
                        </div>
                      </template>
                      <el-form>
                        <div v-if='workOrder.workOrderTypeId === 3'>
                          <el-form-item label="故障描述：">{{ cell.faultDesc || "-" }}</el-form-item>
                        </div>
                        <div v-else>
                          <el-form-item label="巡检对象类型：">{{ cell.pollingTypeName || "-" }}</el-form-item>
                          <el-form-item label="巡检设备：">{{ cell.item || "-" }}</el-form-item>
                          <el-form-item label="反馈结果：">{{ cell.result || "-" }}</el-form-item>
                          <el-form-item label="备注：">{{ cell.remark || '-' }}</el-form-item>
                        </div>
                        <!-- <el-form-item label="维修建议：">{{ cell.maintainSuggestion || '-' }}</el-form-item> -->
                        <el-form-item label="现场照片：">
                          <el-carousel indicator-position="outside" :autoplay="false" trigger="click" arrow="always">
                            <el-carousel-item v-for="item in cell.photo" :key="item">
                              <el-image :src="baseUpload + item"
                                        fit="contain"/>
                            </el-carousel-item>
                          </el-carousel>
                        </el-form-item>
                        <div v-if='workOrder.workOrderTypeId === 3'>
                          <el-form-item label="故障现场视频：">
                            <div style="text-align: center;">
                              <video :src="baseUpload +cell.faultVideo"  controls autoplay class="video" >
                              </video>
                            </div>
                          </el-form-item>
                        </div>

                      </el-form>
                    </el-collapse-item>
                  </el-collapse>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import basic from "@/mixins/basic";
import {workOrder,workOrderType,gztSiteDetail,getWorkOrderDetail} from "@/api/order";
import areaSelect from "@/components/custom/areaSelect";
import imagesBox from "@/components/custom/imagesBox";
import mapCustom from "./components/map.vue";
import locusMap from "./components/locusMap.vue";
import {parseTime, deepClone} from "@/utils";
import {orderTypes, orderStatus, orderPayStatus, createWay, orderUrgency, getLabel} from "@/utils/dict";
import {BASE_UPLOAD} from "@/config";

export default {
  components: {
    areaSelect,
    mapCustom,
    imagesBox,
    locusMap
  },
  data() {
    return {
      baseUpload: BASE_UPLOAD,
      title: "工单详情",
      id: "",

      stateData: orderStatus,

      orderInfo: {},
      siteVo: {},
      umsMember: {},
      workOrder: {},
      workOrderStatus1: {},

      orderTypes: orderTypes,
      orderStatus: [
        {label: "已派单", value: "1", time: "sendOrderTime", key: 'sendOrder'},
        {label: "已接单", value: "3", time: "haveOrderTime", key: 'haveOrder'},
        {label: "已出发", value: "4", time: "departTime", key: 'depart'},
        {label: "已到达", value: "5", time: "arriveTime", key: 'arrive'},
        {label: "处理中", value: "6", time: "disposeTime", key: 'dispose'},
        {label: "已回单", value: "7", time: "receiptTime", key: 'receipt'},
        {label: "已确认", value: "11", time: "backAffirmTime", key: 'backAffirm'},
        {label: "已完成", value: "9", time: "finishTime", key: 'finish'},
      ],
      orderPayStatus: orderPayStatus,
      createWay: createWay,
      orderUrgency: orderUrgency,

      activeOrderStatus: null,
      points: 3.5,

      userLists: [],
      userLoading: "",

      feedbackDrawer: false,
      feedbackList: [],

      receiptDrawer: false,
      receiptListError: [],
      receiptList: [],
      receipt: {
        tab: '',
        info: [{
          label: "模块数量",
          key: 'moduleCount',
        }, {
          label: "巡检对象类型",
          key: 'xjTypeCount',
        }, {
          label: "巡检设备",
          key: 'xjsbTypeCount',
        }, {
          label: "巡检项目数量",
          key: 'xjxmuTypeCount',
        }, {
          label: "正常数",
          key: 'zcCount',
        }, {
          label: "异常数",
          key: 'ycCount',
        }, {
          label: "总数",
          key: 'count',
        }],
        infoData: {},
        modules: [],
        list: [],

        activeCollapse:['1'],
      },
      orderTypeList:[],
      tSiteInfo:{},
      stations:[],
      lineArr:[],
      mapLoading:false
    };
  },
  mixins: [basic],
  created() {
    const {id} = this.$route.query;
    this.id = id;
    if (id) {
      this.loader_info();
    }
  },
  mounted() {
    let that = this;

    that.$nextTick(() => {
      that.$refs.orderInfo.scrollTop = 0;
    });
    that.initer();
  },
  methods: {
    tableStatusLabel(list, value) {
      return getLabel(list, value);
    },
    initer: function () {
      let that = this;
      that.loader_orderType();
    },
    back() {
      this.$router.go(-1);
    },
    loader_info: function () {
      let that = this;
      console.log(that.id);
      workOrder({method: "get", name: "detail"}, {id: that.id})
          .then((res) => {
            let {workOrder, workOrderStatus1, siteVo, umsMember, umsMemberInfo} = res.data;
            this.orderInfo = deepClone(res.data)
            that.activeOrderStatus = workOrder.workOrderStatus;
            that.$set(that, 'workOrderStatus1', workOrderStatus1 || {})
            that.workOrder = that.filter_worder(workOrder) || {};
            that.siteVo = siteVo || {};
            that.umsMemberInfo = umsMemberInfo;
            that.umsMember = umsMember || {};
            let lineArr=[];
            that.orderInfo.userPlaceList.forEach(function(item){
              lineArr.push([item.lng,item.lat])
            })
            that.lineArr=lineArr;
            that.mapLoading=true;
            that.loader_gztSiteDetail(that.orderInfo.siteVo.siteId)
          })
          .catch((error) => {
          });
    },
    filter_worder: function (orderInfo) {
      let that = this;
      return orderInfo;
    },
    timeFilter(time, fmt = "{y}-{m}-{d} {h}:{i}:{s}") {
      return parseTime(new Date(time).getTime(), fmt) || "-";
    },
    doCommand: function (val) {
      let that = this;
      let _text = "";
      let _next = () => {
        this.$alert(`${_text}`, "提示", {
          confirmButtonText: "关闭",
          type: "warning",
          callback: (action) => {
          },
        });
      }
      switch (val) {
        case "dhcd":
          _text = "请联系18234123536";
          _next && _next()
          break;
        case "yjcl":
          _text = "请联系18234123536";
          _next && _next()
          break;
        case "lxkf":
          _text = "请联系客服18234123536";
          _next && _next()
        case "force":
          that.do_force()
        case "again":
          that.do_again()
          return;
      }
      this.$alert(`${_text}`, "提示", {
        confirmButtonText: "关闭",
        type: "warning",
        callback: (action) => {
        },
      });
    },
    do_force: function () {
      var that = this
      let _post = that.orderInfo.workOrder
      _post.id = that.id
      _post.deliveryOrder = 2
      _post.exceptionStatus = 1
      _post.isSendOrder = 1
      workOrder({method: "post", name: "update"}, {}, _post).then((res) => {
        this.$message({
          message: '强制派单成功',
          type: 'success'
        })
        that.back()
      });
    },
    do_again: function () {
      var that = this
      let _post = that.orderInfo.workOrder
      _post.id = that.id
      _post.exceptionStatus = 1
      _post.deliveryOrder = 1
      _post.isSendOrder = 1
      workOrder({method: "post", name: "update"}, {}, _post).then((res) => {
        this.$message({
          message: '重新派单成功',
          type: 'success'
        })
        that.back()
      });
    },
    do_confirm: function (type) {
      var that = this,
          _text = '',
          _post = deepClone(that.workOrder)
      switch (type) {
        case 'send':
          _text = '派单'
          _post.isSendOrder = 1;
          _post.workOrderStatus = 1;
          _post.deliveryOrderWay = 1;
          break;
      }
      this.$confirm(`确定${_text}吗`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        workOrder({method: "post", name: "update"}, {}, _post).then((res) => {
          this.$message({
            message: `${_text}成功`,
            type: 'success'
          })
          that.loader_info()
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 站点
    // loader_orderType: function () {
    // 	let that = this;
    // 	workOrder({ method: "get", name: "areaList" })
    // 		.then((res) => {
    // 			console.log("站点", res);
    // 		})
    // 		.catch((error) => {});
    // },
    // // 巡检类型
    // loader_orderType: function () {
    // 	let that = this;
    // 	workOrder({ method: "get", name: "areaList" })
    // 		.then((res) => {
    // 			console.log("站点", res);
    // 		})
    // 		.catch((error) => {});
    // },

    cancelOrder: function () {
      var that = this
      let _post = that.orderInfo.workOrder
      _post.id = that.id
      _post.workOrderStatus = 12
      workOrder({method: "post", name: "update"}, {}, _post).then((res) => {
        this.$message({
          message: '工单取消成功',
          type: 'success'
        })
        that.back()
      });
    },
    // 仅确认
    confirmOrder: function () {
      var that = this
      let _post = that.orderInfo.workOrder
      _post.id = that.id
      _post.workOrderStatus = 11
      workOrder({method: "post", name: "update"}, {}, _post).then((res) => {
        this.$message({
          message: '工单确认成功',
          type: 'success'
        })
        that.back()
      });
    },
    // 确认并支付
    confirmPayOrder: function () {
      var that = this
      let _post = that.orderInfo.workOrder
      _post.id = that.id
      _post.workOrderStatus = 11
      _post.payStatus = 1
      workOrder({method: "post", name: "update"}, {}, _post).then((res) => {
        this.$message({
          message: '工单确认并支付成功',
          type: 'success'
        })
        that.back()
      });
    },
    // 工单类型
    loader_orderType: function () {
      let that = this;
      workOrderType({ method: "get", name: "list" })
          .then((res) => {
            let _list = [];
            res.data.records.map((item) => {
              _list.push({
                label: item.name,
                value: item.id,
              });
            });
            that.orderTypeList = _list;
          })
          .catch((error) => {});
    },
    // 站点详情
		loader_gztSiteDetail: function (id) {
			let that = this;
			gztSiteDetail({ method: "get"},{id: id})
				.then((res) => {
					that.tSiteInfo = res.data;
				})
				.catch((error) => {});
		},
    // 转化故障工单
    confirmHitch:function(){
      let workOrderTypeId=this.orderTypeList.filter(item=>item.label === '故障')[0].value;
      workOrder({method: "get", name: "pollingModule"}, {workOrderId: this.workOrder.id}).then((res) => {
        this.receipt.modules = res.data
        this.receipt.tab = res.data.length > 0 ? `${res.data[0].id}` : '';
        workOrder({method: "get", name: "receiptResult"}, {
          workOrderId: this.workOrder.id,
          moduleId: this.receipt.tab
        }).then((res) => {
          this.receipt.list = res.data;
          let array=[];
          this.receipt.list.forEach(function(item){
            array.push(item.deviceId);
          })
          this.$router.push(`/order/orderCreate?workOrderTypeId=`+workOrderTypeId+'&operatorId='+this.tSiteInfo.companyId+'&province='+this.tSiteInfo.province+'&city='+this.tSiteInfo.city+'&area='+this.tSiteInfo.county+'&siteId='+this.orderInfo.siteVo.siteId+'&deviceInfoId='+array.toString())
        });
      });
    },
    // 转化维修工单
    confirmRepair:function(){
      let workOrderTypeId=this.orderTypeList.filter(item=>item.label === '维修')[0].value;
      this.$router.push(`/order/orderCreate?workOrderTypeId=`+workOrderTypeId+'&operatorId='+this.tSiteInfo.companyId+'&province='+this.tSiteInfo.province+'&city='+this.tSiteInfo.city+'&area='+this.tSiteInfo.county+'&siteId='+this.orderInfo.siteVo.siteId);
    },
    // 支付
    payOrder: function () {
      var that = this
      let _post = that.orderInfo.workOrder
      _post.id = that.id
      _post.payStatus = 1
      workOrder({method: "post", name: "update"}, {}, _post).then((res) => {
        this.$message({
          message: '工单支付成功',
          type: 'success'
        })
        that.back()
      });
    },
    // 评价
    pjOrder: function () {
      var that = this
      // let _post = that.orderInfo.workOrder
      // _post.id = that.id
      // _post.payStatus  = 1
      // workOrder({ method: "post", name: "update" }, {}, _post).then((res) => {
      // 	this.$message({
      // 		message: '工单支付成功',
      // 		type: 'success'
      // 	})
      // 	that.back()
      // });
    },
    // 查看定时反馈
    openFeedbackDrawer: function () {
      var that = this
      that.feedbackDrawer = true
      workOrder({method: "get", name: "timeFeedBack"}, {workOrderId: that.workOrder.id}).then((res) => {
        let _data = res.data || []
        _data.map(row => {
          row.createdAt = row.createTime || row.tim;
          row.createTime_ = parseTime(new Date(row.createdAt).getTime(), "{y}-{m}-{d} {h}:{i}:{s}") || "-";
        })
        that.feedbackList = _data
      });
    },
    // 回单
    openReceiptDrawer: function () {
      var that = this
      that.receiptDrawer = true
      // workOrder({method: "get", name: "receiptResult"}, {workOrderId: that.workOrder.id, optionInfo: 1}).then((res) => {
      //   that.receiptListError = res.data
      // });
      // workOrder({method: "get", name: "receiptResult"}, {workOrderId: that.workOrder.id}).then((res) => {
      //   that.receiptList = res.data
      // });
      workOrder({method: "get", name: "pollingModule"}, {workOrderId: that.workOrder.id}).then((res) => {
        that.receipt.modules = res.data
        that.receipt.tab = res.data.length > 0 ? `${res.data[0].id}` : '';
        workOrder({method: "get", name: "receiptResult"}, {
          workOrderId: that.workOrder.id,
          moduleId: that.receipt.tab
        }).then((res) => {
          that.receipt.list = res.data
        });
      });
      workOrder({method: "get", name: "receiptCount"}, {workOrderId: that.workOrder.id}).then((res) => {
        that.receipt.infoData = res.data
      });
    },
    //点击tab
    handleTabClick(e) {
      const module = this.receipt.modules[e.index];
      if (this.receipt.tab !== `${module}.id`) {
        workOrder({method: "get", name: "receiptResult"}, {
          workOrderId: this.workOrder.id,
          moduleId: this.receipt.tab
        }).then((res) => {
          this.receipt.list = res.data
        });
      }
    }
  },
};
</script>
<style lang="scss">
.feedbackDrawerBox {
  .el-drawer__body {
    padding: 20px;
    background-color: #eeeeee;
  }
}

.feedbackDrawerBox1 {
  .el-drawer__body {
    padding: 20px;
    background-color: #eeeeee;
    overflow-y: hidden;
  }

  .el-drawer__header {
    margin-bottom: 22px;
  }

  .el-image {
    width: 100%;
    height: 100%;
  }

  .el-collapse-item__header {
    min-height: 80px;
    line-height: normal;
  }

  .el-form-item{
    margin: 0;
  }
}
</style>
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

  .back_box {
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

      .el-form-item:not(:first-of-type) {
        margin-left: 40px;
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
      margin-top: 20px;
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

.drawer_box {
  .drawer_box_left {
    padding: 20px;
    background: #f5f5f5;
    margin-bottom: 10px;

    .drawer_box_left_header {
      margin-bottom: 10px;

      .drawer_box_left_avater {
        width: 20px;
        height: 20px;
        background: #2879ff;
        border-radius: 20px;
      }

      .drawer_box_left_name {
        margin: 0 10px;
        font-weight: 500;
        font-size: 14px;
      }

      .drawer_box_left_time {
        color: rgba(148, 149, 153, 0.4470588235294118);
      }
    }

    .drawer_box_left_summary {
      color: #696969;
      margin-left: 30px;
    }
  }

  .drawer_box_right {
    padding: 20px;
    min-width: 140px;
  }
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
</style>
