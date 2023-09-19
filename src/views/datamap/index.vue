<template>
  <div class="main">
    <!--    <h3 class="title titletop">基站实时监控 <span class="area">当前区域</span>-->
    <!--      <areaSelect ref="areaSelect" @change="changeArea($event, 'form')"-->
    <!--                  :value="[form.province, form.city, form.area]"></areaSelect>-->
    <!--    </h3>-->
    <!--    <p class="ss">实时数据</p>-->
    <div class="main-flex">
      <div class="chartAndMap mychild flex">
        <div class="disp_flex ali_cen search-wrap">

          <el-button @click="back" type="text " class="bg-white back">
            <img src="@/assets/map/mapBackIncon.png" alt="返回"/>
          </el-button>
          <div class="bg-white disp_flex ali_cen">
            <search @select="handleSelect" ref="search"/>
            <el-button type="text" @click="restValue" class="refresh" icon="el-icon-refresh-right"/>
          </div>
          <!--<el-button type="text" class="search" icon="el-icon-search"/>-->
        </div>
        <div class="map">
          <amap
              :markers="markers"
              :businessMarker="vueAMapConfig.businessMarker"
              :areaStation="areaStation"
              hidden-back
              ref="mychild"
              class=""
              showInfoWindow
              :LastLevel.sync="showAMap"
              @historical-work-order="showHistoricalWorkOrder"
              @code-change="codeChange"/>
          <!--          <vueAMap @historical-work-order="showHistoricalWorkOrder"-->
          <!--                   showInfoWindow-->
          <!--                   :keyword="vueAMapConfig.keyword"-->
          <!--                   :marker="markers"-->
          <!--                   :center="vueAMapConfig.center"-->
          <!--                   v-show="showAMap"/>-->
        </div>
      </div>
      <div class="right-box">
        <el-card shadow="hover" class="flex" :body-style="{padding: '0 20px'}">
          <div class="dotted-line p20">
            <h2 class='h2'>{{ count }}</h2>
            <p>该区域内站址总数</p>

          </div>
          <div class="dotted-line p20 disp_flex ali_cen ju_bet flex">
            <div>
              <!--                  <h2 class='h2'>{{ elestation }}</h2>-->
              <h2 class='h2'>{{ setNum(count, .009) }}</h2>
              <p>断电站址数</p>
            </div>
            <el-progress type="circle" :stroke-width="12"
                         strokeLinecap=""
                         :width="80" :color="['#35BECB', '#5EE7F3']"
                         :percentage="0.9"
                         class="schedule  "/>
          </div>
          <div class="dotted-line p20 disp_flex ali_cen ju_bet flex">
            <div>
              <h2 class='h2'>{{ setNum(count, .023) }}</h2>
              <p>故障站址数</p>
            </div>
            <!--                             :percentage="parseInt(((badststion/count)*100))>100?100:parseInt(((badststion/count)*100) || 0)"-->
            <el-progress type="circle" :stroke-width="12"
                         strokeLinecap=""
                         :width="80" :color="['#FD484B', '#FE6F6F']"
                         :percentage="2.3"
                         class="schedule  "/>
          </div>
          <div class="p20 disp_flex ali_cen ju_bet flex">
            <div>
              <h2 class='h2'>{{ setNum(count, 0.056) }}</h2>
              <p>发电站址数</p>
            </div>
            <el-progress type="circle" :width="80" :stroke-width="14" :color="['#3CA8E2', '#7DD2FF']"
                         :percentage="5.6" strokeLinecap=""
                         class="schedule  "/>
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
    <!--      <div style="padding:26px 0">-->
    <!--        <el-progress type="circle" :percentage="parseInt(((normalStation/count)*100) || 0)" -->
    <!--                     class="schedule" :format="format">-->
    <!--        </el-progress>-->
    <!--        <el-progress type="circle" :percentage="parseInt(((elestation/count)*100) || 0)" -->
    <!--                     class="schedule"  :format="format1">-->
    <!--        </el-progress>-->
    <!--        <el-progress type="circle"-->
    <!--                     :percentage="parseInt(((badststion/count)*100))>100?100:parseInt(((badststion/count)*100) || 0)"-->
    <!--                      class="schedule" color="skyblue" :format="format2">-->
    <!--        </el-progress>-->
    <!--      </div>-->
    <!--    </div>-->
    <el-drawer
        size="55%"
        destroy-on-close
        @open="open"
        :visible.sync="dialogVisible">
      <span slot="title" class="_el-drawer_title">历史工单</span>
      <div class="el-drawer_box">
        <el-form inline :model="payload">
          <el-form-item label="工单编号">
            <el-input placeholder="请输入工单编号" v-model="payload.serialNumber" @keyup.enter.native="refresh"/>
          </el-form-item>
          <el-form-item label="工单类型">
            <el-select placeholder="请选择工单类型" v-model="payload.workOrderType" @change="refresh">
              <el-option v-for="({value, label}) in orderTypeList" :key="value" :value="value" :label="label"/>
            </el-select>
          </el-form-item>
          <el-form-item label="工单状态">
            <el-select placeholder="请选择工单状态" v-model="payload.workOrderStatus" @change="refresh">
              <el-option v-for="({value, label}) in orderStatus" :key="value" :value="value" :label="label"/>
            </el-select>
          </el-form-item>
          <!--          <el-form-item>-->
          <!--            <el-button>查询</el-button>-->
          <!--            <el-button>重置</el-button>-->
          <!--          </el-form-item>-->
        </el-form>
        <div class="el-drawer_mTable">
          <mTable ref="mTable" :request="workOrderPage" :payload="payload" :defaultSize="10"
                  :columns="columns" class="mtabs">
            <el-table-column slot="workOrderStatus" label="状态" width="150">
              <template v-slot="{row}">
                          <span>
                             <el-badge :value="0" class="item" is-dot
                                       :type="getClass(orderStatus, row.workOrderStatus)"/>
                             <span style="vertical-align: text-bottom"> {{
                                 label(orderStatus, row.workOrderStatus)
                               }}</span>
                          </span>

              </template>
            </el-table-column>
            <el-table-column slot="action" label="详情" width="50">
              <template v-slot="{row}">
                <el-link @click="$router.push(`/order/orderInfo?id=${row.id}`)" underline type="primary">详情</el-link>
              </template>
            </el-table-column>
          </mTable>
        </div>

      </div>
    </el-drawer>
  </div>
</template>

<script>
import "element-ui/lib/theme-chalk/display.css";
import amap from "./components/amap.vue";
import search from "./components/search.vue";
import {stamonitor, workOrderPage} from '@/api/resourcemanager'
import areaSelect from "@/components/custom/areaSelect";
import AMapLoader from '@amap/amap-jsapi-loader';
import config from '@/config'
import vueAMap from '@c/vueAMap'

import mTable from "@c/business/table";
import {getClass, getLabel, orderStatus} from "@/utils/dict";
import {workOrderType} from "@/api/order";

export default {
  components: {
    amap,
    areaSelect,
    vueAMap,
    mTable,
    search
  },
  data() {
    return {
      orderStatus,
      dialogVisible: false,
      payload: {},
      columns: [
        {
          prop: "serialNumber",
          label: "编号",
          width: 130
        },
        {
          prop: "workOrderTypeName",
          label: "工单类型",
          width: 80
        },
        {
          prop: "pollingPeriod",
          label: "巡检周期",
          width: 80
        },
        {
          label: '状态',
          slot: 'workOrderStatus',
        },
        {
          prop: "nickName",
          label: "接单人姓名",
          width: 100
        },
        {
          prop: "haveOrderTime",
          label: "创建时间",
        },

        {
          slot: "action",
          label: "操作",
        },
      ],
      vueAMapConfig: {
        keyword: '',
        center: [],
        businessMarker: [],
        alone: [
          {
            lat: undefined,
            lng: undefined,
          }
        ], // 单个marker不聚合
      },
      showAMap: false,
      form: {
        province: '14',
        city: '1403',
        area: '140302'
      },
      station: [],
      stations: [],
      count: 0,
      badststion: 0,
      elestation: 0,
      normalStation: 0,
      areaStation: {},
      currentAreaCode: {},
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
      titles: [
        {
          type: 'danger', name: '故障： ', img: [
            {
              url: `${config.IMAGE_BASE_URL}/gf-danger.png`,
              name: '官方站'
            },
            {
              url: `${config.IMAGE_BASE_URL}/zj-danger.png`,
              name: '自建站'
            }
          ]
        },
        {
          type: 'success',
          name: '发电： ',
          img: [
            {
              url: `${config.IMAGE_BASE_URL}/gf-success.png`,
              name: '官方站'
            },
            {
              url: `${config.IMAGE_BASE_URL}/zj-success.png`,
              name: '自建站'
            }
          ]
        },
        {
          type: 'warn',
          name: '巡检：',
          img: [
            {
              url: `${config.IMAGE_BASE_URL}/gf-warn.png`,
              name: '官方站'
            },
            {
              url: `${config.IMAGE_BASE_URL}/zj-warn.png`,
              name: '自建站'
            }
          ]
        },
        {
          type: 'info',
          name: '正常： ',
          img: [
            {
              url: `${config.IMAGE_BASE_URL}/gf-info.png`,
              name: '官方站'
            },
            {
              url: `${config.IMAGE_BASE_URL}/zj-info.png`,
              name: '自建站'
            }
          ]
        },
      ],
      workTypeMaps: {
        '1': 'success',
        '2': 'warn',
        '3': 'danger',
        // null: 'info',
      },
      markers: [],
      orderTypeList: []
    }
  },
  mounted() {
    this.stamonitor()
    // window.location.reload(); //监测到路由发生跳转时刷新一次页面

  },
  methods: {
    workOrderPage,
    getClass,
    setNum(a, b) {
      return parseInt(a * b) || 0
    },
    label(list, value) {
      return getLabel(list, value)
    },
    open() {
      if (!this.orderTypeList?.length) {
        this.workOrderTypeFun();
      }
    },
    back() {
      this.$refs.mychild?.backTop?.();
    },
    restValue() {
      this.$refs.search.value = undefined
    },
    handleSelect(item) {
      const area = item?.county;

      if (!area) return false;
      const {districtName, lng, lat} = item;
      const mychild = this.$refs.mychild;
      this.vueAMapConfig.alone = [{lng, lat}]

      this.codeChange({area})
          .then(() => {
            this.$nextTick(() => {
              // mychild.$refs.vueAMap?.setZoomAndCenter?.([14, 20], [113.305447,40.14185])
              this.$refs.mychild.LastLevel = true;
              this.$refs.mychild.keyword = districtName
            })
          })

      // this.showAMap = true;
      // this.vueAMapConfig.keyword = districtName
      // this.vueAMapConfig.center = [112.532, 37.298]

    },
    showHistoricalWorkOrder(info) {
      const siteInfoId = info?.siteInfoId || info?.siteId;

      if (!siteInfoId) {
        this.$message.error('基站数据异常')
        return false;
      }
      this.payload.siteInfoId = siteInfoId;
      this.dialogVisible = true;
    },
    refresh() {
      this.$refs.mTable.resetInit()
    },
    workOrderTypeFun() {
      workOrderType({method: "get", name: "list"})
          .then((res) => {
            this.orderTypeList = res?.data?.records?.map((item) => {
              return {
                label: item.name,
                value: item.id.toString(),
              }
            });
          })
          .catch((error) => {
          });
    },

    format(percentage) {
      let tex = '正常'
      return percentage + '%\n' + tex
    },
    format1(percentage) {
      let tex = '断电'
      return percentage + '%\n' + tex
    },
    format2(percentage) {
      let tex = '故障'
      return percentage + '%\n' + tex
    },
    async stamonitor() {
      const res = await stamonitor(this.currentAreaCode);
      const {areaStation, stationCount, electricityStation, badStation, normalStation, siteInfoList} = res?.data || {};

      this.count = stationCount;
      this.elestation = electricityStation;
      this.badststion = badStation;
      this.normalStation = normalStation;
      this.station = siteInfoList;
      this.areaStation = areaStation || {};

      if (siteInfoList?.length) {
        this.stations = siteInfoList?.map(item => {
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
      // this.$nextTick(() => {
      //   this.myChart = echarts.init(this.$refs.pie);
      //   this.myChart.setOption({
      //
      //     series: [
      //       {
      //         name: '1',
      //         type: 'pie',
      //         radius: ['50%', '70%'],
      //         data: [{value: 100}]
      //       }
      //     ]
      //   })
      // })

    },
    changeArea(val, type) {
      let that = this;

      let {province, city, area} = val;
      that.form.province = province;
      that.form.city = city;
      that.form.area = area;

      this.$refs.mychild.cc(val)
      this.codeChange({area});
    },
    async codeChange(code) {
      console.log(code, 'code');
      this.currentAreaCode = code;
      this.vueAMapConfig.keyword = code?.paramsName;
      await this.stamonitor();
    },
    setStations(val) {
      if (!val || !val?.length) {
        this.markers = [];
        return false;
      }
      const {workTypeMaps, legend} = this;
      /**
       * types lng: string|number
       * types lat: string|number
       * interface markers = {
       *   workType: string,
       *   siteType: string,
       *   source: string,
       *   siteName: string,
       *   lng: string,
       *   lat: string,
       *   [propsName?]: any
       * }

       * position: [lng, lat]
       * */
          // isCluster
      const alone = this.vueAMapConfig?.alone?.map(el => (el.lng + el.lat)) || [];
      this.vueAMapConfig.businessMarker = [];
      this.markers = val?.map(elm => {
        const {workType, siteType, source, siteName, lng, lat} = elm;

        if (lng && lat) {

          const imgName = workTypeMaps[workType] || 'info';
          const name = legend.find(el => el.siteType === siteType)?.name
          const title = `${siteName} ${name ? `-${name}` : ''}`
          const item = {
            title,
            position: [elm.lng, elm.lat],
            // isCluster,
            // zIndex: !isCluster ? 10 : 4,
            icon: `${config.IMAGE_BASE_URL}/${source === '1' ? 'zj' : 'gf'}-${imgName}.png`,
            props: elm
          }
          // 业务需求,模糊搜索之后在点聚合之外展示一个marker 根据lng,lat去对比
          // 如果存在就不参与聚合了
          const isCluster = alone.includes(lng + lat);
          if (isCluster) {
            this.vueAMapConfig.businessMarker.push(item)
            return undefined
          }
          return item;
        }
        return undefined
      }).filter(el => el);
    }
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";

.mtabs {
  height: 600px;
}
</style>
