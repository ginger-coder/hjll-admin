<!-- sctterMap.vue 地图下钻并且带有散点图 -->
<template>
  <div class="wrapper" v-loading="loading">
    <div class="echarts-wrap">
<!--      <div class="title-wrap" v-if="LastLevel">-->
<!--        <div class="disp_flex ali_cen" v-for="el in titles" :key="el.type">-->
<!--          <span class="legend-title">{{ el.name }}</span>-->
<!--          <p v-for="(img, index) in el.img" :key='index'>-->
<!--            <span class="legend-item_name" v-if="img.name">{{ img.name }}</span>-->
<!--            <img :src="img.url" :alt="el.name">-->
<!--          </p>-->
<!--        </div>-->
<!--      </div>-->
      <vueAMap
          :showInfoWindow="showInfoWindow"
          :businessMarker="businessMarker"
          :keyword="keyword"
          v-if="LastLevel"
          ref="vueAMap"
          @historical-work-order="showHistoricalWorkOrder"
          :marker="markers"/>
      <div class="echarts" ref="chartMap" v-show="!LastLevel"/>
      <!--      <div class="echarts" ref="chartMap"/>-->
    </div>
    <div class="back" @click.stop="backTop" v-if="!hiddenBack && parentCode.length">返回</div>
    <div class="names" v-if="parentCode.length">
      <el-breadcrumb>
        <!--        <el-breadcrumb-item>全国</el-breadcrumb-item>-->
        <el-breadcrumb-item v-for="(el, index) in levels" :key="el.current.province"
                            @click.native="handleBack(el, index)">{{ el.current.name }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import vueAMap from '@/components/vueAMap'
import AMapLoader from "@amap/amap-jsapi-loader";

const defaultTooltip = {
  trigger: "item",
  formatter: (p) => {
    const {name, seriesName, value} = p;
    return `${name}${seriesName}: ${value[2] || 0}`;
  },
}
export default {
  name: "amap",
  props: {
    markers: {
      type: Array,
      default: () => ([])
    },
    businessMarker: {
      type: Array,
      default: () => ([])
    },
    areaStation: {
      type: Object,
      default: () => ({})
    },
    titles: {
      type: Array,
      default: () => ([])
    },
    showInfoWindow: {
      type: Boolean,
      default: false
    },
    hiddenBack: {
      type: Boolean,
      default: false
    }
  },
  components: {
    vueAMap
  },
  data() {
    return {
      LastLevel: false,
      marker: [],
      keyword: undefined,
      loading: false,
      tooltip: defaultTooltip,
      options: {

        title: {
          show: true,
          x: "center",
          y: "top",
          text: "",
          textStyle: {
            color: "rgb(97, 142, 205)",
            fontSize: 16,
          },
        },
        geo: {
          show: true,
          type: "map",
          map: "Map", //使用
          roam: true,
          scaleLimit: {
            min: .8,
            max: 2
          },
          top: '15%',
          selectedMode: 'single',
          itemStyle: {
            normal: {
              show: true,
              areaColor: "#F1F3FA",
              borderColor: "#8E939B",
              borderWidth: .5,
              // shadowColor: "#1773c3",
            },
            //emphasis 是图形在高亮状态下的样式，比如在鼠标悬浮或者图例联动高亮时。
            emphasis: {
              show: false,
              borderWidth: .5,
              areaColor: "#DDE4F7",
              borderColor: "#3163EA",
            },
          },
          label: {
            normal: {
              show: true, //显示省份标签
              color: "#5A5A5A",
              overflow: 'breakAll',
              formatter: (p) => {
                const name = p?.name?.replace(/壮族自治区|回族自治区|自治区|特别行政区|自治县|自治州|省|市|区/, '') || '';
                return ['香港', '澳门'].includes(name) ? '' : `{b|${name}}` // .split('').join('<br/>')
              },
              rich: {
                b: {
                  width: 12,
                  fontSize: 12,
                  // backgroundColor: 'red'
                }
              }
            },
            emphasis: {
              //对应的鼠标悬浮效果
              show: false,
              color: "#3163EA",
              rotate: 90,
              fontSize: 12,
            },
          },
          zoom: 1.1,
        },

      },
      myCharts: null,
      map: {},
      parentJson: [],
      geoJsonData: {},
      mapData: [],

      init: false,
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
      series: [],
      parentCode: [''],
      levels: [{
        current: {name: '全国', province: undefined}
      }],

      level: '' // 下钻的层级
    };
  },
  created() {
    this.$nextTick(() => {
      this.getGeoJson();
    })
  },
  // destroyed: function(){
  //           /*
  //           在调用destroyed的时候, 表示当前组件已经被销毁了
  //           注意点: 只要组件不被销毁, 那么destroyed就不会调用
  //                   不要在这个生命周期方法中再去操作组件中数据和方法
  //           * */
  //           console.log("destroyed");
  //          this.map.destroy()

  //       },
  methods: {
    showHistoricalWorkOrder(info) {
      this.$emit('historical-work-order', info)
    },
    //获取geoJson数据
    getGeoJson(code) {
      let adcode = code || this.parentCode?.slice(-1)?.[0] || 100000;


      AMapLoader.load({
        "key": process.env.VUE_APP_MAP_KEY,
        "version": "2.0",   // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        AMapUI: {
          plugins: ['geo/DistrictExplorer']
        }
      }).then(AMap => {
        // this.map = new AMap.Map("map");
        let that = this;
        window.AMapUI.loadUI(["geo/DistrictExplorer"], (DistrictExplorer) => {
          //高德地图的行政区划查询
          let districtExplorer = (window.districtExplorer = new DistrictExplorer({
            eventSupport: true, //打开事件支持
            // map: this.map,
          }));
          districtExplorer.clearFeaturePolygons();

          districtExplorer.loadAreaNode(adcode, function (error, areaNode) {
            if (error) {
              console.error(error);
              return;
            }
            that.loading = true;
            let Json = areaNode.getSubFeatures();
            let level = Json?.[0]?.properties?.level;
            let length = Json?.length;
            if (length && level === "district") {
              that.parentJson = Json;
              level = 'area'
            } else if (!length) {
              that.LastLevel = true;
              that.keyword = String(adcode);
              Json = that.parentJson.filter(item => {
                if (item.properties.adcode === adcode) {
                  return item;
                }
              });
            }
            that.geoJsonData = {
              features: Json,
            };
            that.getMapData();
            //去渲染echarts
            that.initEcharts();
            that.loading = false;
            that.level = level;

            // if (adcode === 100000) {
            //   level = ''
            // }
            // if (that.init) {
            //   switch (level) {
            //     case 'province': {
            //       adcode = String(adcode).substring(0, 2);
            //       break;
            //     }
            //     case 'city': {
            //       adcode = String(adcode).substring(0, 4);
            //       break;
            //     }
            //   }
            //   that.$emit('code-change', {[level]: adcode})
            // }


          });
        });
      })

    },
    //获取数据
    getMapData() {
      this.mapData = this.geoJsonData.features.map((item) => {
        return {
          name: item.properties.name,
          value: [
            item.properties.center[0],
            item.properties.center[1],
            parseInt(Math.random() * 60),
          ],
          level: item.properties.level,
          citycode: item.properties.adcode,
        };
      });

    },
    initEcharts() {
      if (!this.myChart) {
        this.myChart = echarts.init(this.$refs.chartMap);
      } else {
        this.myChart.clear();
      }
      const {geoJsonData, areaStation, options, tooltip, series = []} = this;
      echarts.registerMap("Map", geoJsonData);
      window.addEventListener('resize', () => {
        if (!this.LastLevel) {
          this.myChart.resize()
        }

      })
      this.myChart.setOption({
        ...options,
        tooltip,
        series: []
      })
      let that = this;
      this.myChart.off("click");
      this.myChart.on("click", (params) => {
        //地图点击事件
        let paramsName = params.name;

        let code = undefined
        this.mapData.forEach((item) => {
          if (item.name === paramsName) {
            const citycode = item?.citycode;
            if (that.parentCode.indexOf(citycode) !== -1) return;
            that.parentCode.push(citycode);
            that.getGeoJson(citycode);
            let code = undefined;
            switch (that.level) {
              case 'province': {
                code = String(citycode).substring(0, 2);
                break;
              }
              case 'city': {
                code = String(citycode).substring(0, 4);
                break;
              }
              default:
                code = item.citycode
            }
            const prev = that.levels.slice(-1);

            that.levels.push({
              prev: prev?.[0]?.current || {},
              current: {[that.level]: code, name: paramsName}
            })
            // console.log(this.levels, 'levels');
            // that.names.push(paramsName)
            that.$emit('code-change', {[that.level]: code, paramsName})
          }
        });
        // if (params.componentType == "series") {
        //   let cityCode = params.data.citycode;
        //   that.parentCode.push(cityCode);
        //   that.getGeoJson(cityCode);
        //   that.$emit('code-change', cityCode)
        // } else {
        //   let name = params.name;
        //   this.mapData.forEach((item) => {
        //     if (item.name === name) {
        //       if (that.parentCode.indexOf(item.citycode) !== -1) return;
        //       that.parentCode.push(item.citycode);
        //       that.getGeoJson(item.citycode);
        //       that.$emit('code-change', item.citycode)
        //     }
        //   });
        // }
      });
    },
    handleBack(el, index) {
      const length = this.levels.length - 1;
      if (!length) return false;
      this.levels = this.levels.slice(0, index + 2); // 截取时要多1位， backTop 有处理再加一位
      this.backTop();
    },
    //返回上一级
    backTop() {
      // 删除最后一位
      const {parentCode, levels} = this;

      if (this.LastLevel) {
        this.LastLevel = false;
        this.keyword = '';
        // parentCode.pop()
        // levels.pop()
      }
      if (parentCode.length === 1) return false;
      this.setOption();
      let code = parentCode.pop() || undefined;
      let level = levels.pop() || undefined;
      this.getGeoJson(parentCode[parentCode.length - 1]);
      this.$emit('code-change', level.prev || {})
    },
    // 父组件触发的事件
    cc(area) {
      this.keyword = area.area;
      this.LastLevel = true;
    },
    setOption(series = [], status = false) {
      const myChart = this.myChart;
      if (this.LastLevel) return false;
      if (myChart) {
        myChart?.clear();
        myChart.setOption({
          ...this.options,
          series: [
            ...series
          ]
        }, status)
      }
    },
    setAreaStation(val) {
      const data = this.geoJsonData.features?.map(el => {
        const {name, center, ...rest} = el?.properties || {};
        const [lat, lng] = center || [];
        let value = val?.[name] || 0;
        if (value) {
          return {
            name,
            value: [lat, lng, value || 0]
          }
        }
        return undefined;

      }).filter(el => el) || [];
      this.series[0] = {
        type: 'scatter',
        coordinateSystem: "geo",
        data,
        symbolSize: 30,

        label: {
          show: true,
          formatter: '{@[2]}'
        }
      }
      // this.tooltip = defaultTooltip;

      this.setOption(this.series)
    },
    // 暂停
    setStations(val) {
      const workTypeMaps = {
        '1': 'success',
        '2': 'warn',
        '3': 'danger',
        // null: 'info',
      }

      this.marker = val?.map(elm => {
        const imgName = workTypeMaps[elm?.workType] || 'info';
        return {
          position: [elm.lng, elm.lat],
          icon: `https://haina.baybus.cn/app/share/share-web-app/pic/gf-${imgName}.png`,
        };
      })

      // this.series = this.legend.map(el => {
      //   const {siteType, name} = el;
      //   return {
      //     ...el,
      //     type: 'scatter',
      //     coordinateSystem: "geo",
      //     dataIndex: 1,
      //     data: val?.filter(elm => {
      //       if (elm?.siteType === siteType) {
      //         const imgName = workTypeMaps[elm?.workType] || 'info';
      //
      //         elm['symbolSize'] = [36, 44];
      //         elm['symbol'] = `image://https://haina.baybus.cn/app/share/share-web-app/pic/gf-${imgName}.png`;
      //         elm['label'] = {
      //           show: false
      //         }
      //         return elm;
      //       }
      //     }) || [],
      //   }
      // })
      // this.tooltip = {
      //   formatter: (p) => {
      //     console.log(p);
      //   }
      // };
      // this.setOption(this.series, false)
    }
  },
  watch: {
    // 'stations': {
    //   handler(val) {
    //     this.setStations(val)
    //   },
    //   immediate: true
    // },
    'areaStation': {
      handler(val) {
        if (this.LastLevel) return false;
        if (val) {
          this.setAreaStation(val)
        }
      },
      immediate: true
    },
    'geoJsonData': {
      handler(val) {
        if (this.LastLevel) return false;
        // this.setStations(this.stations)
        this.setAreaStation(this.areaStation)
      },
      immediate: true
    },
    'LastLevel'(val) {
      this.$emit('update:LastLevel', val);
    }
  },
  destroyed() {

  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.echarts-wrap {
  position: relative;
  padding: 15px;
  width: 100%;
  height: 100%;
  background-color: #fff;


}

.echarts {
  width: 100%;
  height: 100%;
  position: relative;
}

.back {
  position: absolute;
  left: 25px;
  top: 25px;
  color: #1890ff;
  z-index: 8;
  cursor: pointer;
  background-color: #fff;
  font-size: 16px;
  padding: 6px;
}

.names {
  position: absolute;
  right: 25px;
  bottom: 35px;
  background-color: #fff;
  font-size: 16px;
  padding: 6px;

  box-shadow: 1px 2px 1px 0 rgba(0, 0, 0, 0.1);
  border-radius: 2px;

  ::v-deep {
    .el-breadcrumb__inner, .el-breadcrumb__separator {
      color: #5674E5;
      font-size: 14px;
    }
  }
}
</style>
