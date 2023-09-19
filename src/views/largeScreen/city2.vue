<template>
  <div style="width: 100%;height: 100%;position: relative">
  <!-- 中国地图 渲染县级 三级页面 接受来自市点击的name，渲染不同市json-->
    <div @click="$router.go(-1)" style="color: #fff; font-size: 14px" class="returnClass">返回</div>
  <div class="tip" v-if="cityId === undefined">
    敬请谅解，乡镇数据正在努力更新中...
  </div>
  <!-- echarts的容器 -->
  <div :id="id" class="cityCharts"></div>
  </div>
</template>
<script>
  import * as echarts from "echarts";
  import axios from "axios";
  import { cityMap } from "@p/city/china-main-city-map";
  export default {
    data() {
      return {
        cityId: null,
        id: "echarts_" + new Date().getTime() + Math.floor(Math.random() * 1000),
        myChart: null,
        option: {
          // 背景颜色
          // backgroundColor: "#0b1c3e",
          title: {
            text: "",
            top: "8%",
            left: "8%",
            textStyle: {
              fontSize: 14,
              fontWeight: 300,
              color: "#fff",
            },
          },
          // 提示浮窗样式
          tooltip: {
            show: true,
            trigger: "item",
            alwaysShowContent: false,
            backgroundColor: "#0C121C",
            borderColor: "rgba(0, 0, 0, 0.16);",
            hideDelay: 100,
            triggerOn: "mousemove",
            enterable: true,
            formatter: "",
            textStyle: {
              color: "#DADADA",
              fontSize: "12",
              width: 20,
              height: 30,
              overflow: "break",
            },
            showDelay: 100,
          },


          // 地图配置
          geo: {
            map: "",
            roam: true, //是否开启平游或缩放
            zoom: 1, //当前视角的缩放比例
            emphasis: {
              label: {
                color: "#fff",
              },
              // 鼠标放上高亮样式
              itemStyle: {
                areaColor: "#389BB7",
                borderWidth: 0,
              },
            },
            label: {
              // 通常状态下的样式
              show: true,
              color: "#fff",
              // 鼠标放上去的样式
            },
            // 地图区域的样式设置
            itemStyle: {
              borderColor: "rgba(147, 235, 248, 1)",
              borderWidth: 1,
              areaColor: {
                type: "radial",
                x: 0.5,
                y: 0.5,
                r: 0.8,
                  colorStops: [
                      {
                          offset: 0,
                          color: "rgba(120, 160, 249, 1)", // 0% 处的颜色
                      },
                      {
                          offset: 1,
                          color: "rgba(86, 147, 247, 1)", // 100% 处的颜色
                      },
                  ],
                globalCoord: false, // 缺省为 false
              },
              shadowColor: "rgba(128, 217, 248, 1)",
              shadowOffsetX: -2,
              shadowOffsetY: 2,
              shadowBlur: 10,
            },
            layoutCenter: ["50%", "50%"],
            layoutSize: "100%",
          },

          series: [
            {
              name: "模拟数据",
              type: "map",
              geoIndex: 0, // 不可缺少，否则无tooltip 指示效果
              data: [{ name: "", value: "" }],
            },
          ],
        },
      };
    },
    created() {

    },
    mounted() {
      let that=this;
      let city = this.$route.query.city;

      // 设置地图标题
      that.option.title.text = city;
      // 设置地图
      that.option.geo.map = city;
      // 第二种方式通过js文件引入json
      that.cityId = cityMap[city];

      // console.log(that.cityId);
      // 初始化echarts
      that.myChart = echarts.init(document.getElementById(that.id));
      if (that.cityId === undefined) return;

      that.getJson();

      that.myChart.on("click", function (params) {
          this.$router.push({
              path: "/city",
              query: { city: params.name,code:params.data.code,regionalLevel:3 },
          });
      });

      // 缩放适应
      window.addEventListener("resize", () => {
        that.myChart.resize();
      });
    },
    methods: {
      async getJson() {
        var that=this;
        let city = this.$route.query.city;
        await axios.get(`/city/${that.cityId}.json`).then((res) => {
          // console.log('\😂👨🏾‍❤️‍👨🏼==>： ',res);
          // 地图注册，第一个参数的名字必须和option.geo.map一致，第二个参数是地图json数据
          echarts.registerMap(city, res.data);
          res.data.features.forEach((item) => {
            // console.log(item);
            // series是数组里面data是一个对象，所以要用series[0].data.push

            that.option.series[0].data.push({
              name: item.properties.name,
              value: Math.floor(Math.random() * 100),
              code:item.id
            });
          });
          that.myChart.setOption(that.option);
        });

      }
    }
  };

</script>
<style>
.cityCharts {
  width: 100%;
  height: 100%;
  margin: 0 auto;
}
.tip {
  text-align: center;
  margin-top: 30px;
  color: #fff;
  font-size: 15px;
}
.returnClass{
  position: absolute;
  left:0;
  top:0;
  width: 80px;
  height: 28px;
  border-radius:10px;
  text-align: center;
  line-height: 28px;
  color: #2593FF;font-size: 16px;
  background: url("~@/assets/images/kuang-top.png") 0 0/100% 100% no-repeat;
  opacity: 0.8;
  cursor: pointer;
  z-index: 99999;
}
.returnClass:hover{
  opacity: 1;
}
</style>
