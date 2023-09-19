<template>
  <div class="main">
    <!--    <h3 class="">-->
    <!--      人员实时监控-->
    <!--            <span class="area">当前区域</span>-->
    <!--            <span class="citystyle">  -->
    <!--              <areaSelect ref="areaSelect" @change="changeArea($event, 'form')"></areaSelect>-->
    <!--            </span>-->
    <!--    </h3>-->

    <div class="main-flex">

      <div class="chartAndMap mychild flex">
        <div class="map">
          <amap :markers="markers"
                :LastLevel.sync="showAMap"
                :titles="titles"
                :areaStation="areaStation"
                ref="mychild"
                @code-change="codeChange"/>
        </div>
      </div>
      <div class="right-box">
        <el-card shadow="hover" class="flex" :body-style="{padding: '0 20px'}">
          <div class="dotted-line p20">
            <h2 class='h2'>{{ userCount }}</h2>
            <p>该区域内人员总数</p>
          </div>
          <div class="dotted-line p20 disp_flex ali_cen ju_bet flex">

            <div>
              <h2 class='h2'>{{ activeOrderUserCount }}</h2>
              <p>主动接单人员数</p>
            </div>
            <el-progress type="circle" :stroke-width="12" strokeLinecap=""
                         :width="80" :color="['#35BECB', '#5EE7F3']"
                         :percentage="parseInt(((activeOrderUserCount/userCount)*100) || 0)"
                         class="schedule  hidden-md-and-down"/>
          </div>
          <div class="dotted-line p20 disp_flex ali_cen ju_bet flex">
            <div>
              <h2 class='h2'>{{ noActiveOrderUserCount > 0 ? noActiveOrderUserCount : 0 }}</h2>
              <p>被动接单人员数</p>
            </div>
            <el-progress type="circle" :stroke-width="12" strokeLinecap=""
                         :width="80" :color="['#FD484B', '#FE6F6F']"
                         :percentage="parseInt(((noActiveOrderUserCount/userCount)*100) || 0)"
                         class="schedule  hidden-md-and-down"/>

          </div>
          <div class=" p20 disp_flex ali_cen ju_bet flex">
            <div>
              <h2 class='h2'>
                {{ noOrderActiveOrderUserCount > 0 ? noOrderActiveOrderUserCount : 0 }}
              </h2>
              <p>主动接单人员空闲数</p>
            </div>
            <el-progress type="circle" :stroke-width="12"
                         :width="80" :color="['#3CA8E2', '#7DD2FF']"
                         :percentage="parseInt(((noOrderActiveOrderUserCount/userCount)*100) || 0)"
                         class="schedule  hidden-md-and-down"/>
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
    <!--        <el-progress type="circle" :percentage="parseInt(((activeOrderUserCount/userCount)*100) || 0)"-->
    <!--                     stroke-linecap="butt" class="schedule" :format="format">-->
    <!--        </el-progress>-->
    <!--        <el-progress type="circle" :percentage="parseInt(((noActiveOrderUserCount/userCount)*100)  || 0)"-->
    <!--                     stroke-linecap="butt" class="schedule" color="cyan" :format="format1">-->
    <!--        </el-progress>-->
    <!--        <el-progress type="circle" :percentage="parseInt(((noOrderActiveOrderUserCount/userCount)*100)) ||0"-->
    <!--                     stroke-linecap="butt" class="schedule" color="skyblue" :format="format2">-->
    <!--        </el-progress>-->
    <!--      </div>-->
    <!--    </div>-->
  </div>
</template>

<script>
import {stamonitorUser} from '@/api/resourcemanager'
import amapperson from "./components/amapperson.vue";
import areaSelect from "@/components/custom/areaSelect";
import amap from "./components/amap.vue";
import config from "@/config";


export default {
  components: {
    amapperson,
    amap,
    areaSelect
  },
  mounted() {
    this.stamonitorUser()
  },

  data() {
    return {
      stationuser: [],
      stationsuser: [],
      userCount: 0,
      activeOrderUserCount: 0,
      noActiveOrderUserCount: 0,
      noOrderActiveOrderUserCount: 0,
      areaStation: {},
      currentAreaCode: undefined,
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
        {type: 'danger', img: [{name: '故障：', url: `${config.IMAGE_BASE_URL}/ry-danger.png`}]},
        {type: 'success', img: [{name: '发电：', url: `${config.IMAGE_BASE_URL}/ry-success.png`}]},
        {type: 'warn', img: [{name: '巡检：', url: `${config.IMAGE_BASE_URL}/ry-warn.png`}]},
        {type: 'info', img: [{name: '待接单：', url: `${config.IMAGE_BASE_URL}/ry-info.png`}]},
        {type: 'no', img: [{name: '离线：', url: `${config.IMAGE_BASE_URL}/ry-no.png`}]},
      ],
      markers: [],
      showAMap: false
    }
  },
  methods: {
    format(percentage) {
      let tex = '主动'
      return percentage + '%\n' + tex
    },
    format1(percentage) {
      let tex = '被动'
      return percentage + '%\n' + tex
    },
    format2(percentage) {
      let tex = '空闲'
      return percentage + '%\n' + tex
    },
    // 人员数据
    async stamonitorUser() {
      const res = await stamonitorUser(this.currentAreaCode)
      const {
        areaStation,
        userCount,
        activeOrderUserCount,
        noActiveOrderUserCount,
        noOrderActiveOrderUserCount,
        umsMemberList,
        userAreaCount
      } = res?.data || {};

      this.userCount = userCount
      this.activeOrderUserCount = activeOrderUserCount
      this.noActiveOrderUserCount = noActiveOrderUserCount
      this.noOrderActiveOrderUserCount = noOrderActiveOrderUserCount
      this.areaStation = userAreaCount || {};

      if (umsMemberList?.length) {
        this.stations = umsMemberList?.map(item => {
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
      this.stamonitorUser();
    },
    setStations(val) {
      if (!val || !val?.length) {
        this.markers = [];
        return false;
      }

      const workTypeMaps = {
        '0': 'no',
        '1': 'info',
        '2': 'warn',
        '3': 'danger',
        // null: 'info',
      }
      this.markers = val?.map(elm => {
        const {orderStatus, nickName, lng, lat} = elm;
        const imgName = workTypeMaps[orderStatus] || 'no';
        if (lng && lat) {
          return {
            title: nickName || '',
            position: [elm.lng, elm.lat],
            icon: `${config.IMAGE_BASE_URL}/ry-${imgName}.png`,
          };
        }
        return undefined
      }).filter(el => el)
    }
  },
};
</script>

<style lang="scss" scoped>
@import "./index.scss";


</style>
