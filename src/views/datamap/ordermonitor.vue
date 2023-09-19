<template>
  <div class="main">
    <!--    <h3 class=" ">-->
    <!--    工单实时监控-->
    <!--      <span class="area">当前区域</span>-->
    <!--      <span class="citystyle"><areaSelect ref="areaSelect"></areaSelect></span><span class="area"-->
    <!--                                                                                     style="margin-left: 12px">时间范围</span>-->
    <!--      <span class="citystyle">今天</span>-->
    <!--    </h3>-->

    <div class="main-flex">
      <div class="chartAndMap mychild">
        <div class="map">
          <amap :markers="markers"
                :LastLevel.sync="showAMap"
                :areaStation="areaStation"
                ref="mychild"
                @code-change="codeChange"/>
        </div>
      </div>
      <div class="right-box">
        <el-card shadow="hover" class="flex" :body-style="{padding: '0 20px'}">
          <div class="dotted-line p20">
            <h2 class="h2">{{ orderCount }}</h2>
            <p>工单总数量</p>
          </div>
          <div class="dotted-line p20 ">
            <h2 class='h2'> {{ waitReceiveOrderCount }}</h2>
            <p>待接单</p>
          </div>
          <div class="dotted-line p20 ">
            <h2 class='h2'> {{ receiveOrderCount }}</h2>
            <p>已接单</p>
          </div>
          <div class="dotted-line p20 ">
            <h2 class='h2'> {{ receiptOrderCount }}</h2>
            <p>已回单</p>
          </div>
          <div class="dotted-line p20 ">
            <h2 class='h2'> {{ affirmOrderCount }}</h2>
            <p>已确认</p>
          </div>

        </el-card>
        <transition name="el-zoom-in-top">
          <el-card shadow="hover" class="mt-space" v-show="showAMap">
            <div class="title-wrap">
              <div class="mb-16" v-for="el in titles" :key="el.type">
                <span class="legend-title">{{ el.name }}</span>
                <div class="disp_flex ali_cen">
                <span class="title-item disp_flex ali_cen " v-for="(img, index) in el.img" :key='index'>
                  <span class="legend-item_name" v-if="img.name">{{ img.name }}</span>
                  <img :src="img.url" :alt="el.name">
                </span>
                </div>
              </div>
            </div>
          </el-card>
        </transition>
      </div>
    </div>


    <!--    <div class="percentage title">-->
    <!--      <h3 class="bottomtype titletop">各类目占比</h3>-->
    <!--      <div style="padding: 26px 0">-->
    <!--        <el-progress type="circle" :percentage="parseInt(((waitReceiveOrderCount/orderCount)*100)) || 0"-->
    <!--                     stroke-linecap="butt" class="schedule" :format="format">-->
    <!--        </el-progress>-->
    <!--        <el-progress type="circle" :percentage="parseInt(((waitAffirmCount/orderCount)*100)) || 0" stroke-linecap="butt"-->
    <!--                     class="schedule" color="cyan" :format="format1">-->
    <!--        </el-progress>-->
    <!--        <el-progress type="circle" :percentage="parseInt(((receiveOrderCount/orderCount)*100)) || 0"-->
    <!--                     stroke-linecap="butt" class="schedule" color="skyblue" :format="format2">-->
    <!--        </el-progress>-->
    <!--        <el-progress type="circle" :percentage="parseInt(((receiptOrderCount/orderCount)*100)) || 0"-->
    <!--                     stroke-linecap="butt" class="schedule" color="red" :format="format3">-->
    <!--        </el-progress>-->
    <!--        <el-progress type="circle" :percentage="parseInt(((affirmOrderCount/orderCount)*100)) || 0"-->
    <!--                     stroke-linecap="butt" class="schedule" color="purple" :format="format4">-->
    <!--        </el-progress>-->
    <!--        <el-progress type="circle" :percentage="parseInt(((finishOrderCount/orderCount)*100)) || 0"-->
    <!--                     stroke-linecap="butt" class="schedule" color="pink" :format="format5">-->
    <!--        </el-progress>-->
    <!--      </div>-->
    <!--    </div>-->
  </div>
</template>

<script>
import amap from "./components/amap.vue";
import {stamonitorOrder} from '@/api/resourcemanager'
import areaSelect from "@/components/custom/areaSelect";
import config from "@/config";

export default {
  data() {
    return {
      showAMap: false,
      orderCount: 0,
      waitReceiveOrderCount: 0,
      waitAffirmCount: 0,
      receiveOrderCount: 0,
      receiptOrderCount: 0,
      affirmOrderCount: 0,
      finishOrderCount: 0,
      markers: [],
      areaStation: {},
      legend: [
        // 1:机房站,2:机柜站,3:隧道室分站,4:拉远站,5:楼宇室分站,6:微站,7:塔站,8:宏站,9:暂无数据,10:室分站,11:宏站远供站,12:拉远远供站
        {name: '机房站', siteType: '1'},
        {name: '机柜站', siteType: '2'},
        {name: '隧道室分站', siteType: '3'},
        {name: '拉远站', siteType: '4'},
        {name: '楼宇室分站', siteType: '5'},
        {name: '微站', siteType: '6'},
        {name: '塔站', siteType: '7'},
        {name: '宏站', siteType: '8'},
        {name: '室分站', siteType: '10'},
        {name: '宏站远供站', siteType: '11'},
        {name: '拉远远供站', siteType: '12'},
      ],
      currentAreaCode: {},
      titles: [
        {type: 'warn', img: [{name: '故障：', url: `${config.IMAGE_BASE_URL}/fd-warn.png`}]},
        {type: 'success', img: [{name: '发电：', url: `${config.IMAGE_BASE_URL}/fd-success.png`}]},
        {type: 'no', img: [{name: '巡检：', url: `${config.IMAGE_BASE_URL}/fd-warn.png`}]},
      ],
    }
  },
  components: {
    amap,
    areaSelect
  },
  created() {
    this.stamonitorOrder()
  },
  methods: {
    format(percentage) {
      let tex = '待接单'
      return percentage + '%\n' + tex
    },
    format1(percentage) {
      let tex = '待确认'
      return percentage + '%\n' + tex
    },
    format2(percentage) {
      let tex = '已接单'
      return percentage + '%\n' + tex
    },
    format3(percentage) {
      let tex = '待回单'
      return percentage + '%\n' + tex
    },
    format4(percentage) {
      let tex = '已确认'
      return percentage + '%\n' + tex
    },
    format5(percentage) {
      let tex = '已完成'
      return percentage + '%\n' + tex
    },
    // 工单数据
    async stamonitorOrder() {
      const res = await stamonitorOrder(this.currentAreaCode)

      const {
        orderCount,
        areaOrder: areaStation = {},
        waitReceiveOrderCount,
        waitAffirmCount,
        receiveOrderCount,
        receiptOrderCount,
        affirmOrderCount,
        finishOrderCount,
        workOrderList
      } = res?.data || {}
      this.orderCount = orderCount
      this.waitReceiveOrderCount = waitReceiveOrderCount
      this.waitAffirmCount = waitAffirmCount
      this.receiveOrderCount = receiveOrderCount
      this.receiptOrderCount = receiptOrderCount
      this.affirmOrderCount = affirmOrderCount
      this.finishOrderCount = finishOrderCount
      this.areaStation = areaStation;
      if (workOrderList?.length) {
        this.stations = workOrderList?.map(item => {
          const {lng, lat} = item;
          if (lng && lat) {
            return {
              ...item,
              value: [item.lng, item.lat, 1]
            }
          }
          return undefined
        }).filter(el => el) || [];
        this.setStations(this.stations)
      } else {
        this.siteInfoList = [];
        this.markers = [];
      }
    },
    changeArea(val, type) {
      let that = this;
      let {area} = val;
      this.$refs.mychild.cc(val)
      this.codeChange({area});
    },
    codeChange(code) {
      this.currentAreaCode = code;
      this.stamonitorOrder();
    },
    setStations(val) {
      if (!val || !val?.length) {
        this.markers = [];
        return false;
      }
      const workTypeMaps = {
        '1': {
          icon: 'success',
          title: '发电'
        },
        '2': {
          icon: 'warn',
          title: '巡检'
        },
        '3': {
          icon: 'danger',
          title: '故障'
        },
        // null: 'info',
      }
      this.markers = val?.map(elm => {
        const {workOrderTypeId, siteType, nickName, lng, lat} = elm;
        if (lat && lng) {
          const {icon, title} = workTypeMaps[workOrderTypeId] || {};
          return {
            title,
            position: [elm.lng, elm.lat],
            icon: `${config.IMAGE_BASE_URL}/fd-${icon}.png`,
          };
        }
        return undefined
      }).filter(el => el);
      console.log(this.markers, 'markers');
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
