<!-- sctterMap.vue 地图下钻并且带有散点图 -->
<template>
  <div class="wrapper">
    <div class="echarts" ref="chartMap"></div>
    <p class="back" @click.stop="backTop">返回</p>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  name: "amap",
  props: ["stationsuser"],
  data() {
    return {
      myCharts: null,
      map: {},
      parentJson: [],
      geoJsonData: {},
      mapData: [],
      parentCode: [100000],
    };
  },
  mounted() {
    // this.getGeoJson(100000);
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
    //获取geoJson数据
    getGeoJson(adcode) {
      this.map = new window.AMap.Map("map", {
        resizeEnable: true,
        center: [116.30946, 39.937629],
        zoom: 3,
      });
      let that = this;
      window.AMapUI.loadUI(["geo/DistrictExplorer"], (DistrictExplorer) => {
        //高德地图的行政区划查询
        var districtExplorer = (window.districtExplorer = new DistrictExplorer({
          eventSupport: true, //打开事件支持
          map: this.map,
        }));
        districtExplorer.loadAreaNode(adcode, function (error, areaNode) {
          if (error) {
            console.error(error);
            return;
          }
          let Json = areaNode.getSubFeatures();
          if (Json.length > 0 && Json[0].properties.level == "district") {
            that.parentJson = Json;
          } else if (Json.length == 0) {
            Json = that.parentJson.filter((item) => {
              if (item.properties.adcode == adcode) {
                return item;
              }
            });
          }
          that.geoJsonData = {
            features: Json,
          };
          that.getMapData();
        });
      });
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
      //去渲染echarts
      this.initEcharts();
    },
    initEcharts() {
            if (this.myChart) {
        this.myChart.clear();
      }
      this.myChart = echarts.init(this.$refs.chartMap)
      window.addEventListener('resize', () => {
        this.myChart.resize()
      })

      this.myChart = echarts.init(this.$refs.chartMap);
      window.addEventListener("resize", () => {
        this.myChart.resize();
      });
      echarts.registerMap("Map", this.geoJsonData);
      this.myChart.setOption(
        {
          backgroundColor: "#fff",
          tooltip: {
            trigger: "item",
            formatter: (p) => {
              let val = p.value;
              if (window.isNaN(val)) {
                val = 0;
              }
              let txtCon = p.name;
              return txtCon;
            },
          },
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
            roam: false,
            // nameProperty: "北京市",
            itemStyle: {
              normal: {
                show: true,
                areaColor: "#e4e4e4",
                borderColor: "#fff",
                borderWidth: "1",
                shadowColor: "#1773c3",
              },
              //emphasis 是图形在高亮状态下的样式，比如在鼠标悬浮或者图例联动高亮时。
              emphasis: {
                show: false,
                areaColor: "rgba(24, 144, 255, 0.30)",
                // opacity:.3,
                borderColor: "#1890ff",
                // shadowColor: '#1773c3',
                // shadowBlur: 20
              },
            },
            label: {
              normal: {
                show: true, //显示省份标签
                color: "#333",
              },
              emphasis: {
                //对应的鼠标悬浮效果
                show: false,
                color: "#ddb926",
              },
            },
            zoom: 1.25,
          },
          series: [
            {
              name: "城市",
              type: "scatter",
              coordinateSystem: "geo",
              data: this.stationsuser,
              //这里可以设置点的大小
              symbol:'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFQAAABUCAYAAAAcaxDBAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAVKADAAQAAAABAAAAVAAAAAC3aM1AAAAPpklEQVR4Ae1dCbAVxRW9PU8FgS8IyldQBBe+O0jUKG4IUbMSFdRYMdEqNYmWKVOlZqEgVUksK1ZhGSpRS40xJiaoEdySlEtYXIJbIrhFJS6EoCUoCkERkDedc3qW3zPT7715y/z/gX+r+k9PT/ftnvN6uu+9fbu/kh5AWuuRaMZBCB1hGI3rEIQ2KyAq66ywGvGlCK+F4WWl1DLEu5VUd9QOAIeh3kkIE8MwokXtWA4+88MwDwC/0yK+PY8NQGxDOA9hHoKPUDSxDtbFOtnTtw7Cy3Qg/AbhY4TuItbNNnBIKZQK++TR+DFo+TSEqQhe3rfQn2wUefd90avXimxA3IRNQfG+O4j07WOCGjJQZLddRO2I+/zkI+vdCFdhOHg+f7H8OVsOKIBsR/UzEc6p1Qy9ebPIGytEv/KW6KX/Ef32KpG1H9Uqlnw+cICo4UNFjd5L1AGjRPbZQ9R22yXzuO9uR/LlAHal+3FjqS0DFECW0ISLEK5EQPdxE0HUzy8V/fclol96Q2TTp+6MjabusL2og/cRdcxYUWNG1wIXn4FMR7gBwJYbrdIu1xJAASa6htyBcKTN3I7rVR+I/9Ai0U+9KPLxJ/aj4uL9dxR11CHinTJe1NDB1ep5Bg+/BlDfqpYpz7OmAQWYp6OiWxAGuSrU77wn/p8fC4D0OYR1A3leAOyXjxc1bNdKDViDB+cD1LmVMuRJbxjQ8BO/BpVc6qpIoxf6f3pE9KP/FNHalaXr05QSNeFw8aZ+ThR6bwWahfTLGh0CGgIUYPZFpbMRTnU1yn/8OfHvehh6zXrX4+5Pa+sn3pmniHfcYZXaci8enA1QN1TKUCm9bkABJiec+xGOTzM1vfLmuaKXUBvs+aTGdoh34emVeutjeIPJAJUTV26qC9AQzIXgPjZdg379v1K+/i6RD+qqP82m6+8HD5TSxWeK2ndPV91LkDihHlBzAxp+5g+hgkzP9J98QfxfYywvd9Ok44KinrSSJ94Fp4t39KGuUuypp+T9/HMBCjApY1LDyIyZFIX82Q+6GrLFpXlnf96IWI6Gc0ydClBryqp5VULO5hkwy3PnbTVgEkR2DL6Tg/juxKAm1eyh6J2UM+ekOW1NPTP9blV66hT00qpyalVAAeYoVPYcwiC7UjNm3sgRoECCIUQduLfI0CGiBg0wFek10PNXrRb9rzdhNAkNJgU1wfv2VNeYugbVjQOoFTWqilaEcNykOpkAk7O5mYAKehEZNVy8KRC8aeigZuVDKdguGJnUZtx76APQfPSrb4k/B5/nmysKaQnfUe26c3r2JxZ3AJvxlcbTij0UhS5B4V/araWcWZ5xfTGiEcxy3gWniRp3gNGsFGbeaqQpUUDz0YtfEf/mewIzX7UCjTyjSPWzi11y6ncB6K9cLJ2AAkya4CidJ6xG5V/8oRihHYaL0hXn4ltoE7V9xY/G1X7Rn8IEuGadlGfeJrLyA2eeZhIp/Je+9/U0CwrbHQA1Y/qr1A1mokACTKqThWhAUANL084XGbyTE0y9uSx646YgIJ4m8wOgbOlH4NHWP/246Xu+s//44jQfYkOMMpTpoeidY5BriZ3TfOo/nNV63RyfbGnGhSJ77pYAE20IlAQYm/WzL4le9aFpjhqKMe2Ig/FTDxDBkIAeEjfT9NQVK6X805tab4zhj/7zS12f/li04fm4EYi4vq9pdgbGaTUqwtChjsFvN2J3GIGpNwTEHglEUOffRD/8ZAIcwCxy58OiTjpKvDNOEk3rUViWPVXv2W4My/qJxQGzVv2FkYcYlM6bnOZIrM6yExOfPHpGBx5yDSgm2jONCS5OaVGE6t6ZJ8eAkKvmrA6Lfnn6daKhgTnNfui9BLo84zoRjJ+mTNgkLn2QJ3tvq4kYEIsUTQ0xi5PTNf8ATxJpNA47Xyxm0VhEdYwUSdsk0eP8W2HIend1babI4//2PjPTJzL37yuGdyKxBTf4IQ0WSVbEipjFFIMHpNuQmui+XLYwSxZx9tZF1GH7J34o9jSuMemnsUSSk/TTGF9fej3RSzFaBKJXTh71ZCMWxCRFZ4XYmeQYUNxNQehnZ6Z6aYRrO7FVcQjwidVJyJX6CSpl9ZHmDGxZucyYOmpYfUzy5saPbjBJ5idmxM6QDeg3okRezeokF9QKIgWZ0yYzqXAZuU7SmNnTsmuad50sq2Y3vZTL30mKsTOAosvyJz3RzqOXLC12ddKa2eN6KaTXSw7ZVPKty9dbU5Af2iKXwVN0YohhPAFNQoZOoQ43elFCFE2Vb8FtyqFBl8uihiTMBrkqUbsMEqOG2rnXrrPvWh6nT0GKiB0xjAGdaGcwnzudEAokvRJWI4pJEcEIQjWvXqIzgz3Om8ktj5RQb0VWfjN5Zj97g2E0hiYApXtMyz06rAYxqhe/mpxMIJirifCT2H2XVM4qt8irJn02OYZycit6kZDeLsQoSQGg+PZHIn2E/Yy+RkWTGYdoirMJsl7pojOMec5OdsZhwit9B3mpptoEno4xzs7RkrgDoxHEkj2UnsMJouNW4bR+g+hHng6sRWFlZraGZ4fR73cbUrkJeFaaDhsA8tozPPV5Pe+ZYifTsFUVMDqIunxm4DJecJVfp2VP/AceldLx40TT0IEeR6Jsqvdol9KVlxj10+fQQGGaHbF9sHhQCBR8ldgzE2CGaqt/30KyKZwqYNSRAdT4Z6Zm4MJaR4P1rD9K6fvnJaqIgTr5aCl94ViAHQwN8HvGuAtpwCVy4ZE/a3aX9E7TWFrC4Mua8k/tYLfANGkRnF27lF5bZpZUKPpgDEpUTWAjMPmA8RjsMCfLsKx/yz1mWSTBoOibLFajCWhisDKew0U3JMVfw1GifPWtIhxX6xDuTV70EpbVixJmyVQNxdw6sBrCTz6pA9IFuzsIE2H5imvF+9Jx8NM4OhgzrbE1apKRXam7wzKlH3kqsADhh+gWymLV1nMAJSIAxhiz//K4qEP2haAPi9TwXWGhD39zaED6bdhnIWfqF/9t8ncLkFGl+QDdFGXvvis/fZrmEHo0ZX0DTA/tnjZTTILHG3Vxs9rZZ4em2sGFPK5+6vfXiMB3wFZHm2JcZ2F+8rQkdE5M3LpSJO0xVLzJE8To4LQKUSfmYhtDE6QoITCEPKkt+fcvFFlRv0kwdzOyWK1zANonN7+6MtKR4dyvGF93GoRjWbJUwA9InnCYKB1xkFlx8G97oBhHCO6ZSlIMaGdyNlPns0Zj0HBKl31TZGesvbMnugTzRnlXKBf/YIcfKCXsXSpf87vWO0JksVpHOXS13SazQ81OaDYOy3xpxrcwqAzMCOVkbQRz6uCw4DQVyCOlGJC/UQRQt2lDapWAz5shB1ar+cnT/DwhZoztfi0jaDqly9Ez8UuqUufaO/mbXXQbASKt31wMzM6YdTVDcTyDc5fQptoHm78sqz3r1mgD21L+yY1m+bku5pUyZ7FaSkDpwxST0U3pmdECfZ4OCdIOd0TrEw8cGTAJ37NA9F+fCCaSuPbGI7HSiiFFffFY8U6baJhFdfOq2Ra0ydTbeFVBSWCU0uOZ/ho/+QSgTOXeyaapX1/xvjoh8ZlzmUM+2SDlH18vGsK7mZWbrijFgLo9eLMO1mXqDLPw82ebBG1rlipgZAB9Oc2cG1GbJYXJIC0K8dPzb5orkvXAaLa6bHnU4d80JzPUsE2mbdkSdaVUwOhlD7PuMnBabnMzzq52QgNxdeTBIugREdGQQS82ozJGiQVf9Yuvo054DdoGF1qw2LYmyYHRcmLJT540P7iEfyFmCHb1NkNqb2yztoV1GDr8+bCmdzH5859N+DqxTWxbU0RsiFGSDIZOQDlDcot0w0S1Mn0wAMFd9k7DLBsuaOpMaWFsW7hC0Ahfs33ckiJCHglA5yExniiZQY0fG+Zr4DIA26rt3kkWFIsccmID3OsrwjpTViHTNrSxUeJe/BQRO2IYrMujAnadBUyISI0dnfWOix7WuqbBZP7uADNqp6tuVxuj/NWu3INPX4AkLQgxDAANn/3ezmM+e2ze76UkAjzQwFYawqcxdp3TcLC56zpk6Bex4EkI5QX/KNQUpg7ZT7wpk4xE4EN+rHcpQ40fE1j5KUVgF5x+AYbnogjjLjFJ0Xrcz4nSokmJYx7NeHdGD3jlsRL8RQojaC4ed1jsBbdwKBPcwKr2H5m/uo6RQRkqIuBheFVbz8/P2ZnT9M7sURt3htiZMjGgIYercfVtbh6OlaAwXASZnXJcFo74Y22dPTYveVgmiQzJhgc88dQBe+ctXl8+tNFgkSxFrIhZTAlA0SiqoXfHTxHhGR3qhM/YSa2LU/C3ZQuuv1vKQM2KKA9GP0aUGYaRIohHazjOK7k7xCyuMgFomHpV/DSMcMeFYGvJNks8UgPnlDgoi1U6ExDnAvftdjoPPDG7K+zEbSjO80kch77cHmKVQMLVQ5nhcoS1dk7vuHEN+W/aPLbEuDmXJHvYC7EhRhlyAgrkVyLn9HRuHngi2FBak7gMbDvTsgD8mDL0ESSOkjXhoYxmWk7SPHVHW3Mox+D/fZwtnarb+EjlcY7Au5p3znKcHmKUeeIENMx1A64Jawa7PQ88qbmxissRcI0x+zQxixNc/8FFmcqNYyzBx8qnMTzDGYxuOXlJP4nRqYwymN3NCsD6jU5nW+7cMJ7NbAvz0t3dtkC5KoQxxxzukt5LFWBCbJxkdY/sc6zRjEIq97oMsp/mOoAAsy+3Hqrh7Tgs8M3KAvdO/SFFYAbdHrZSbpF570O7qtpxLHt4xx4WAPUolBBXDwUXdeh+RqTSb6/EuXv4IVzqqFVbowcQVAWU/AFq7xEZnUDXPCKj2idv2GCsgIldZnXyDGLmgL7JJ6STt/h7hXdyqJd8r1khFlXfsWYPZWn00hIuFPhP5b1NW9NhLlUOb7kX75zrmKFcgBJAgMqVrYcQoIsmqfcgrE48cgPKIgCVMtNChLEICeo9qi2Aoy5AWSQEFXuwsz219zBBSBMBrvX9DT//2SiVGVPJacs47vJkHHc5rtKLc8zsmuMuoxYAVE5U1yBcGqXZV9Nbe+KBrLCc0djj0M2j5lOi6doDWaOaeQWwlFNvQRjE+zT1HhmcRiTHPUAdhWx3IBxZKXvvodaVkKmQHg4BF+HxlQiUBpxk9Hbsxac+Xeix61gG58qtY0HNbtda3NAI1LOOXbdbCGDbcT8T4Rw73RU3Bo3efwzggiabBmDHIHUawlSEmipuxGFL/9cV0XsUdgWw29Q/VykMyDRjALtN/PufhgT7NFj13gPcYSgD7waZGIYR9fKokH850ueHoVv+QVW3AJoGAwCPRBoPQoCDvAmjceXeqTYrINrz/4Xa/wH9vv8uiEaXSQAAAABJRU5ErkJggg==',
              symbolSize: function (val) {
                return val[2] / 2;
              },
              label: {
                normal: {
                  formatter: "{b}",
                  position: "right",
                  show: false, //是否显示值
                },
                emphasis: {
                  show: false,
                },
              },
              itemStyle: {
                normal: {
                  color: "#1890ff",
                  opacity: 0.3,
                  // color:rgba()
                },
              },
            },
            // {
            //   name: '前5',
            //   type: 'effectScatter',
            //   coordinateSystem: 'geo',
            //   data: this.mapData.slice(0, 5),
            //   symbolSize: function(val) {
            //     return val[2] / 2;
            //   },
            //   showEffectOn: 'render', //前5名显示动画效果
            //   rippleEffect: {
            //     brushType: 'stroke'
            //   },
            //   hoverAnimation: true,
            //   label: {
            //     normal: {
            //       formatter: p => {
            //         return p.value[2]
            //       },
            //       position: 'center',
            //       show: false
            //     }
            //   },
            //   itemStyle: {
            //     normal: {
            //       color: '#f4e925',
            //       shadowBlur: 10,
            //       shadowColor: '#333'
            //     }
            //   },
            //   zlevel: 1
            // }
          ],
        },
        true
      );
      let that = this;
      this.myChart.off("click");
      this.myChart.on("click", (params) => {
        //地图点击事件
        console.log(params);
        if (params.componentType == "series") {
          let cityCode = params.data.citycode;
          that.parentCode.push(cityCode);
          that.getGeoJson(cityCode);
        } else {
          let name = params.name;
          this.mapData.forEach((item) => {
            if (item.name == name) {
              if (that.parentCode.indexOf(item.citycode) != -1) return;
              that.parentCode.push(item.citycode);
              that.getGeoJson(item.citycode);
            }
          });
        }
      });
    },
    //返回上一级
    backTop() {
      if (this.parentCode.length === 1) return;
      // //删除最后一位
      this.parentCode.pop();
      this.getGeoJson(this.parentCode[this.parentCode.length - 1]);
    },
    // 父组件触发的事件
    cc(area) {
      console.log(area);
    },
  },
    watch: {
    'stationsuser': {
      handler(val, old) {
        this.getGeoJson(100000)
      },
      immediate: true
    }
  }

};
</script>

<style lang="scss" scoped>
.wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
}
.echarts {
  width: 100%;
  height: 100%;
  position: relative;
}

.back {
  position: absolute;
  left: 2%;
  top: 2%;
  color: #1890ff;
  z-index: 99999;
  cursor: pointer;
}
</style>
