<template>
  <div style="height: 100%;">

    <div ref="vue_map_InfoWindow" class="vue_map_InfoWindow" v-show="show">
      <!--      <el-breadcrumb>-->
      <!--        <el-breadcrumb-item v-show="info.siteName" class="location">{{ info.siteName }}</el-breadcrumb-item>-->
      <!--        <el-breadcrumb-item v-show="info.securityLevel">{{ info.securityLevel }}</el-breadcrumb-item>-->
      <!--      </el-breadcrumb>-->
      <ul class="list">
        <li v-show="info.operationCode">
          <span class="span-1">站址编码:</span>
          <span class="span-2"> {{ info.operationCode }}</span>
        </li>
        <li v-show="info.companyAndLevel">
          <span class="span-1">所属公司:</span>
          <span class="span-2"> {{ Desensitization(info.companyAndLevel) }}</span>
        </li>
        <li v-show="info.position">
          <span class="span-1">经纬度:</span>
          <span class="span-2">  {{ Desensitization(info.position) }}</span>
        </li>
        <li v-show="info.towerInfo">
          <span class="span-1">房型:</span>
          <span class="span-2"> {{ Desensitization(info.towerInfo) }}</span>
        </li>
        <li v-show="info.machineRoomInfo">
          <span class="span-1">塔形:</span>
          <span class="span-2"> {{ Desensitization(info.machineRoomInfo) }}</span>
        </li>
      </ul>
      <!--      <el-button class="seeListBtn" v-show="showInfoWindow" @click="showHistoricalWorkOrder">历史工单</el-button>-->
      <div class="disp_flex ju_bet ali_cen">
        <el-button class="seeListBtn" v-show="showInfoWindow" @click="showHistoricalWorkOrder">历史工单</el-button>
        <el-button class="seeListBtn" v-show="info.workType && info.workType === '3' && info.companyId"
                   @click="ImmediateOrder">立即派单
        </el-button>
      </div>
    </div>
    <div class="echarts" style="height: 100%;" ref="aMap"/>
  </div>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader';
import {mapGetters} from "vuex";

export default {
  name: "vueAMap",
  props: {
    keyword: {
      type: String,
      default: ''
    },
    marker: {
      type: Array,
      default: () => ([])
    },
    businessMarker: {
      type: Array,
      default: () => ([])
    },
    showInfoWindow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      map: null,
      polygons: [],
      show: false,
      info: {},
      cluster: undefined,
      markerLayer: undefined,
    }
  },
  created() {
    this.initMap();
  },
  computed: {
    ...mapGetters(["roles"]),
  },
  methods: {
    async initMap() {
      await this.$nextTick()
      if (this.map) {
        this.map.clearMap();
        this.map?.clearEvents?.();
      }
      const AMap = await AMapLoader.load({
        "key": process.env.VUE_APP_MAP_KEY,              // 申请好的Web端开发者Key，首次调用 load 时必填
        // "version": "2.0",   // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        // AMapUI: {
        //   version: '1.4.5',
        //   plugins: ['geo/DistrictExplorer']
        // },
        "plugins": ['AMap.DistrictSearch', 'AMap.MarkerCluster', 'AMap.LabelsLayer'],           // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      })

      this.map = new AMap.Map(this.$refs.aMap, {
        resizeEnable: true,
        zoomEnable: true,
        viewMode: '3D',
        zooms: [3, 20],
        showIndoorMap: false
      });

      this.map.on('click', () => {
        this.infoWindow?.close?.();
      })

      this.map.plugin(['AMap.DistrictSearch'], () => {
        this.district = new AMap.DistrictSearch({
          // subdistrict: 0, //获取边界不需要返回下级行政区
          extensions: 'all', //返回行政区边界坐标组等具体信息
          level: 'district', //查询行政级别为 市
          zooms: [3, 20],
        })
      })
      //行政区查询
      // if (!this.keyword) return false;
      this.district.search(this.keyword || '山西省', (status, result) => {
        if (this.polygons != null) {
          this.map.remove(this.polygons) //清除上次结果
          this.polygons = []
        }
        const bounds = result.districtList[0].boundaries;
        const pathArray = [];
        if (bounds) {
          // 覆盖其他区域
          // pathArray.push([
          //   new AMap.LngLat(-360, 90, true),
          //   new AMap.LngLat(-360, -90, true),
          //   new AMap.LngLat(360, -90, true),
          //   new AMap.LngLat(360, 90, true)
          // ])
          // pathArray.push.apply(pathArray, bounds)
          // const cover = new AMap.Polygon({
          //   pathL: pathArray,
          //   strokeColor: '#00eeff',
          //   strokeWeight: 1,
          //   fillColor: '#fff',
          //   fillOpacity: 1,
          //   zIndex: 2
          // });
          // cover.setPath(pathArray);
          // this.map.add(cover); // 添加覆盖区

          // 显示对应的行政区域
          for (let i = 0, l = bounds.length; i < l; i++) {
            //生成行政区划polygon

            const polygon = new AMap.Polygon({

              strokeWeight: 1,
              path: bounds[i],
              fillOpacity: 0.1,
              // fillColor: 'transparent',
              // strokeColor: 'transparent',
            })
            this.polygons.push(polygon)
          }
        }
        this.map.add(this.polygons);
        let newBounds = this.map.setFitView(this.polygons, false, [150, 60, 100, 60]) //视口自适应
        // setTimeout(() => {
        //   this.map.setLimitBounds(newBounds)
        // }, 1000)
      });

      // AMap.plugin('AMap.DistrictSearch', function () {
      //   const districtSearch = new AMap.DistrictSearch({
      //     // 关键字对应的行政区级别，country表示国家
      //     level: 'province',
      //     //  显示下级行政区级数，1表示返回下一级行政区
      //     subdistrict: 1
      //   })
      //
      //   // 搜索所有省/直辖市信息
      //   districtSearch.search('山西省', function (status, result) {
      //     // 查询成功时，result即为对应的行政区信息
      //     console.log(status, result, 'result');
      //   })
      // })
      // AMapUI.load(['geo/DistrictExplorer'], (DistrictExplorer) => {
      //   let districtExplorer = (window.districtExplorer = new DistrictExplorer({
      //     eventSupport: true, //打开事件支持
      //     map: this.AMap,
      //   }));
      //   districtExplorer.loadAreaNode(100000, function (error, areaNode) {
      //     let Json = areaNode.getSubFeatures();
      //     console.log(Json);
      //   })
      // })
    },
    showInfoWindowFun(props, position) {
      this.infoWindow = new AMap.InfoWindow({
        isCustom: true,
        content: this.$refs.vue_map_InfoWindow,
        offset: new AMap.Pixel(-20, -56)
      });
      this.info = {
        ...props,
        position: position.toString()
      }
      this.map.setCenter(position)
      // this.map.setFitView();
      this.show = true;
      this.infoWindow.open(this.map, position);
    },
    clearMap() {
      if (!this.map) return false;
      // this.map.clearMap();
      this.map.clearInfoWindow();
      this.cluster && this.map.remove(this.cluster)
      this.markerLayer && this.map.remove(this.markerLayer)
    },
    setMaker(val) {
      let time = setTimeout(() => {
        clearTimeout(time);
        if (this.map) {
          this.clearMap();

          this.map.plugin(["AMap.MarkerCluster"], () => {
            if (this.cluster) {
              this.cluster.setMap(null);
              this.cluster = undefined
            }
            this.cluster = new AMap.MarkerCluster(
                this.map, // 地图
                this.marker?.map(el => {
                  return {
                    ...el,
                    weight: 1,
                    lnglat: el.position,
                  }
                }) || [], // marker
                {
                  // 单个 maker 的 render
                  renderMarker: context => {
                    const marker = context.marker
                    const item = context?.data?.[0];
                    marker.isCluster = item.isCluster;
                    const icon = item.icon || item?.props?.icon
                    icon && marker.setIcon(icon);
                    if (!item.isCluster) {
                      marker.setzIndex(1000)
                    }
                    const title = item.title || item?.props?.title
                    title && marker.setTitle(title);
                    marker.on('click', (e) => {
                      const position = item?.position || item?.props?.value;
                      this.showInfoWindowFun((item.props || item), position)
                    })
                    this.$emit('renderMarkerClick', context)
                  }
                }
            );
          });

          const {businessMarker = []} = this;
          const length = businessMarker?.length;
          if (businessMarker?.length) {
            // 普通 marker --- 业务需求 需要单独显示某个 business marker
            // 如果是单个，直接打开信息窗口
            if (length === 1) {
              const {position, ...el} = businessMarker[0]
              let makers = new AMap.Marker({
                ...el,
                position: new AMap.LngLat(position[0], position[1]),
                anchor: 'bottom-center'
              })
              makers.on('click', () => {
                this.showInfoWindowFun(el?.props || {position, ...el}, position)
              })
              this.markerLayer = [makers]
              this.map.add(this.markerLayer);
              this.showInfoWindowFun(el?.props || {position, ...el}, position)

            } else {
              this.markerLayer = businessMarker?.map(el => {
                const [lng, lat] = el.position;
                let m = new AMap.Marker({
                  ...el,
                  position: new AMap.LngLat(lng, lat),
                  anchor: 'bottom-center'
                });
                m.on('click', () => {
                  this.showInfoWindowFun(el?.props || el, el.position)
                })
                return m
              })
              this.map.add(this.markerLayer)
            }
          }

          // 加载点聚合插件

          // const labelsLayer = new AMap.LabelsLayer({
          //   zooms: [6, 20],
          //   zIndex: 1000,
          //   // 该层内标注是否避让
          //   collision: true,
          //   // 设置 allowCollision：true，可以让标注避让用户的标注
          //   allowCollision: true,
          // });
          // labelsLayer.add(makers)
          // this.map.plugin(["AMap.LabelsLayer"], () => {
          //   const cluster = new AMap.LabelsLayer(
          //       this.map,
          //       p,
          //       {
          //
          //         renderClusterMarker: (props) => {
          //           console.log(props, 'props');
          //         }
          //       }
          //   );
          //   // this.map.add(cluster)
          // });
          // this.map.setFitView(makers)
        }
      }, 300)
    },
    showHistoricalWorkOrder() {
      this.$emit('historical-work-order', this.info)
    },
    ImmediateOrder() {
      const {
        companyId: operatorId,
        workType,
        siteId,
        province,
        city,
        county: area,
        cityName,
        districtName,
        provinceName,
      } = this.info;

      this.$router.push(`/order/orderCreate?operatorId=${operatorId}&siteId=${siteId}&workOrderTypeId=${workType}&workOrderTypeDetailsId=${workType}&province=${province}&city=${city}&area=${area}`)
    },
    setZoom(val) {
      this.$nextTick(() => {
        const map = this.map;
        console.log(map, val);
        if (!map) return false;
        const [min, max] = val;
        if (!min || !max) return false;
        map.setZoom(val);
      })
    },
    setCenter(val) {
      this.$nextTick(() => {
        const map = this.map;
        if (!map) return false;
        console.log(map, val);
        const [lng, lat] = val;
        if (!lng || !lat) return false;
        map.setCenter(val);
      })
    },
    setZoomAndCenter(zoom = [5, 20], center = [], immediately = false, duration) {
      this.$nextTick(() => {
        const map = this.map;
        if (!map) return false;
        const [lng, lat] = center;
        if (!lng || !lat) return false;
        map.setZoomAndCenter(zoom, center, immediately, duration);
      })
    },
    Desensitization(str) {
      if (!str) return undefined;
    
      const ADMIN = this?.roles?.includes('ADMIN');
      if (ADMIN) return str;
      return str.substring(0, str.length).replace(/[\s\S]/ig, '*');
    }
  },

  watch: {
    'keyword': function (val) {
      this.initMap()
    },
    "marker": {
      handler(val) {
        this.setMaker(val);
      }
    },
    "map": {
      handler(val) {
        if (!val && this.marker && this.marker.length) return false;
        this.setMaker(this.marker);
      },
      immediate: true
    }
  }
}
</script>

<style scoped lang="scss">
.vue_map_InfoWindow {
  display: inline-block;
  margin-left: 100px;
  padding: 12px 16px;
  /*height: 165px;*/
  background: #FFFFFF;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
  min-width: 300px;

  .el-breadcrumb {
    padding: 5px 0;
  }

  .el-breadcrumb__item {
    font-size: 14px;
    //font-family: PingFangSC-Regular, PingFang SC, serif;
    font-weight: 400;


  }

  ::v-deep .location .el-breadcrumb__inner {
    color: #5674E5;
  }

  .list {
    padding-left: 0;
    list-style: none;
    margin: 0;

    li {
      position: relative;
      padding: 2px 0;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.45);
      line-height: 24px;
      display: flex;

      .span-1 {
        flex: 0 0 80px;
        position: relative;
        padding-left: 15px;
      }

      .span-1:after {
        content: '';
        position: absolute;
        width: 6px;
        height: 6px;
        border: 1px solid #5674E5;
        border-radius: 50%;
        top: 10px;
        //top: 50%;
        left: 0;
        //transform: translateY(-50%);

      }

      .span-2 {
        flex: 1
      }
    }

    //li::after {
    //  content: '';
    //  position: absolute;
    //  width: 6px;
    //  height: 6px;
    //  border: 1px solid #5674E5;
    //  border-radius: 50%;
    //  top: 50%;
    //  left: 0;
    //  transform: translateY(-50%);
    //}
  }

  .seeListBtn {
    width: 100%;
    //margin-top: 10px;
    background: rgba(86, 116, 229, 0.1);
    border-radius: 4px;

    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;

    color: #5674E5;
    line-height: 17px;

  }
}
</style>

