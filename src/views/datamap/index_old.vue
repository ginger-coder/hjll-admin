<template>
  <div class="main">
    <h3 class="title titletop">基站实时监控 <span class="area">当前区域</span>
    <areaSelect ref="areaSelect" @change="changeArea($event, 'form')" :value="[form.province, form.city, form.area]"></areaSelect>
    </h3>
    <el-row class="title">
      <el-col :span="8" class="count">
        <p>该区域内站址总数</p>
        <h2>{{ count }}</h2>
      </el-col>
      <el-col :span="8" class="count">
        <p>断电站址数</p>
        <h2>{{ elestation }}</h2>
      </el-col>
      <el-col :span="8" class="count">
        <p>故障站址数</p>
        <h2>{{ badststion }}</h2>
      </el-col>
    </el-row>
   <amap :stations="stations" ref="mychild"/>
    <div class="percentage title">
        <h3 class="bottomtype titletop">各类目占比</h3>
        <div style="padding:26px 0">
          <el-progress type="circle" :percentage="parseInt(((normalStation/count)*100) || 0)"  stroke-linecap="butt" class="schedule" :format="format">
        </el-progress>
        <el-progress type="circle" :percentage="parseInt(((elestation/count)*100) || 0)"  stroke-linecap="butt"  class="schedule" color="cyan" :format="format1">
        </el-progress>
        <el-progress type="circle" :percentage="parseInt(((badststion/count)*100))>100?100:parseInt(((badststion/count)*100) || 0)" stroke-linecap="butt" class="schedule" color="skyblue" :format="format2">
        </el-progress>
        </div>
    </div>
  </div>
</template>

<script>
import amap from "./components/amap.vue";
import {stamonitor} from '@/api/resourcemanager'
import areaSelect from "@/components/custom/areaSelect";

export default {
  components: {
    amap,
    areaSelect
  },
  data(){
    return {
      form :{
        province:'14',
        city:'1403',
        area:'140302'
      },
      station:[],
      stations:[],
      count:0,
      badststion:0,
      elestation:0,
      normalStation:0

    }
  },
  mounted(){
    this.stamonitor()
    // window.location.reload(); //监测到路由发生跳转时刷新一次页面

  },
  methods: {
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
    async stamonitor(){
   const data =await stamonitor({
     "area":140727
   })
   console.log(111111);
   console.log(data);
   this.count=data.data.stationCount
   this.elestation=data.data.electricityStation
   this.badststion=data.data.badStation
   this.normalStation=data.data.normalStation
   this.station=data.data.siteInfoList
  //  this.station.
  //  console.log(this.station);
   let countstaton=this.station.map(item=>{
     return {
       value:[item.lng,item.lat,30]
     }
   })
  //  console.log(countstaton);
   this.stations=countstaton
 },
 changeArea(val, type) {
			let that = this;
			console.log(val);
			let { province, city, area } = val;
			that.form.province = province;
			that.form.city = city;
			that.form.area = area;
      this.$refs.mychild.cc(area)
		},
  },
};
</script>

<style lang="scss" scoped>
.main {
  background: #f2f2f2;
  .count {
    height: 100px;
    text-indent: 16px;
  }
//   .bottomtype {
//       border-bottom: 10px solid cyan;
//   }
}
.citystyle {
  font-weight: 400;
}
.area {
  color:#929292;
  font-weight:400;
  margin-right:20px
}
.title {
  background:#fff;
}
.titletop {
  margin-bottom: 0;
  border-bottom:1px solid #ebebeb;
  padding:20px
}
.percentage {
  margin-top:20px;

}
.bottomtype {
  margin-bottom: 12px;
}
.schedule {
  margin: 0 18px;
}
 ::v-deep .el-progress__text {
      white-space: pre;//使百分号与所添加文字换行
 }

</style>
