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
  props: ["stations"],
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
    this.getGeoJson(100000);
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
            nameProperty: "北京市",
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
              data: this.stations,
              //这里可以设置点的大小
              symbol: "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFQAAABUCAYAAAAcaxDBAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAVKADAAQAAAABAAAAVAAAAAC3aM1AAAAS8klEQVR4Ae1dCbAcRRn+ezaGEAgJBEhACAlHnhAwAUJAEAiJEqIICMhRXngXlopHLC+0LAWVEpUoSlkKIiCXiFERCDEHQRCCHOFOAAkxhIAEAoEAMTvt9/27M9vdM/t2dt4+84D3V/Wbnp6e7p5v//77P3rmGekDZK0djWGMQ+qqp7E4Dkca4iRkZa2TViO/FGlJPd1vjFmG/EYlszF6B4Dbo9+pSFPqaVSHxrEc7cyrp7kAeGWH2u17zQDEIUinIM1FipF6m9gH+2Kf5PTXB+FhupAuQHoJaWMR++YYKFJ6lXptymPw4zHyryMdjxQVfQq7/mWRNavEvggR+d9XRNYj8Uh60yCRgUg4ms0hYoeNFDNw09q1Yn9jVLsK6XsQB4uL3dJerY4DCiBHYAhnI32g1VBsdYPI04+KfeJBsU8uFfvcEyLrnm91m3998FAxW75ZzHZjxbx5d5FtdxFTGeDXyT+7BMUzAOxT+ZfLlXYMUABZwRBORToDaWiz4RBE+/hisUtvFrviPpEN65tVLVc+YKCYHfYUM/YgMTuNbwUuf73Tkc4DsNVyHfp3dQRQgDkGzV6ONMlvvnFmX3ha4sWzxT5yq8irLzUu9GZuk83E7HqAROOnidli2+56WoSLJwHUx7qrVORajwEFmMeio/ORhuV1aJ9bKfGd19SAtBRhG4FMVAN2nyMhHqix5dIalH4MoF6de7VgYWlA61P8R+jntLy+LLgwvu33Yh+4EZdtXpWNUGbE7DFZov2PFwPubUIzUf6lsiKgFKAAE0utXIZ0TN6g4odukvjWK0VeoWHTB2nQEIkOOEGitxzcbHCzcOFkgFpXL5pVy5a3DSjA5ILzZ6RDwuaUK+f9CovO3eGlPnludpog0ZRPNOPWhRj0UQC1LbWjLUDrYC5ARxNChOxTj0h1zi9EXnw2vNS3zzffSirv/LSYEbvmjZOcMbkdUAsDWp/ms9FBhjPjh/8h8fxfi8Qd0TzyHqx3y6KKRId9XKLd3pbXDzl1WtHpXwhQgEkdkxbGMWGP8T2zJb6F4vS1T9GBJ0v01ml5DzILhccD1JYcU9Qk5GqeAbO66OrXDZhEkYzBZ8ohPjsxaEktORTcST3zD2FLryfODJ+tG049Dlyai3jSRreAAswxqHgn0rDkBh5VZs79pVvU2fyQrdU+l2EjsAJvXnOIQDmnk8S+uk7k+afFrnlShLZ/L1E09VN5MnUNutsHoDa1qJoCWpebt6ABz5zU1fxP3+/wAoRhjNxVIqgxZtf9xQBQywWOycIowKIhBnWcczpAqKbZx+4Q+y+kJx4Qqf63c/Ciz8rRX8tb/WmmHthMnnYH6Gdw48/cEfIBqr//ZudUIzoysAhE46fXXHO2CmfGm9wuW+YVeIIOa8wuhbZxO2bkOjJSB4gq1fu+m6enfhaAnpvXQy6g4E664Bir8bxG1evO6YzSTtt690MlmnScyIBNxAxoD8S8B2GZVQ41Yu+5XuK7/gpfKnyrPSQq/5Xpnw9bobLfBVAzrr9mgF6MGzx/ppqTC84PG27/fOudpDLtsyL0YxbkRvWbYsobTv0CZDdg6scbJMZ47b/+WeCO7qtEkz+WZ6ZeAkA/GN6ZARTcOR6V7nYr6lS/7Ks9ts3NLpNg6n0S8hAcGuVrbBb+UQNRYF96Dl77ZyFeVtcSBwQvPeWrbLaVmM2GSVLXHaubt3Es9q6/QAz80S1uPw/bv3LyD/Km/gSAuthtMA/QK1DhBLdSdeGF8BotcIvazBtM72PFTHh3LpDKgQDYPgXv/aOLxC67CwHjZ7rvY4ttxIzeRyIsYrLNGMz3OJeD1aH973sl/tt5PXJm00tVOeSUcExXAtAT3UIPUHBnFy5iuWzEgOjPrF7xDRSVd8FFh34UHvQDM95zXVAwle2K+6FUX15eDRo+Sqg7mu0wfDyRoYrlkMrW1SukOutMFQXOpTayRionnhn6U+ng3QOgcr1R8nsW+QpKvTI6h3sCpnnr4WK6csDkAgIurEIFi/8KI6QnOuXq5RL/5Sy0c7YIRUWgPqmsHr6DRJM/qg9d7o9VR3lwL7EiZimlHAruHILSVUiDk6sMW1QpO0t62s2Oe0k0/QuZaa7TEIG5eM7PGxHNpFP3CNklm20Jebml6qKW6tBLTJCtzWjgYImO+Bz0RwbrfO2BM4J+Wgv/QykC56ss9cMp69DWSHCpOn/d8CB0mAaY7JAxoLJgypBtJOJqToXcIT4UH4je/Fwatp1aKKrgDx0BvR6ihtFRihwo85zO9uW1WL1vl5jxKURLPVq/Trk1Ouj9IrtP9sQMtYTogBMlfuZxsSsf8m4rdALGIiaVg73FnQxI7C5kG+nTYuBzcT6FhSRyUfWi00oH1AimGeVHHTkV7dJbJL7xN7VO3L/gwmgSQhNj3wYAoeC30E11IaP8hR82vvkykWeWua1pnuaj2Xmix6n6AyHuX72CWwZKrAsInVQ+NNP7odDQPHDoVHaq8hKdMHJ1GAsSUq972ejktjuLGb2316mC+fRjEi/8bdJFelTl+eSzYHZOUg5sBSZvpOlJjqNjuHLct8Ts/Z60vSQTzz9f5NknlDmSMjy4CDWE3Q5Iito70txFGDygw+oYpgsQ0U25lZXJSWWpchBsAjUHnRagX8bXz0S5H/mkKhVNg8yjGRrIPOfuplkFFWIgmni0RIfDWnaVfyj3VS54KjIaTfDH4NT36jYut8xxT0FAxK7BoThJpzor6qLBTQglyOwwDnrhTp5OyPbi267KiA/T9faafpqj5NPa4fSkd4mqm139b8jOF3REVOhDUo7Fxobo4A/7lxAopH0frvwyCDH7roP9ugXPuEFDRY5fXzFMFiUPUG6PKbujgxsLXFKZRVXmwRvdYhFM1ejQj3jAs0IyUHvfHImXgBNCdYqr/s77SbTvUXCowA/gcLXmu7BjZDUWnfu4JNTI3o88HDAW1pVOeRZHEBmY9vbBBbVK7fzlD0qMqPc2SDGM8MCjUTaqUY6HgkpTjmBvj9nXB4mqCrnTm+pQkmEfZzQA6o/gxOqlM2ph6BBMDoo/zr03SPWSL2LzBKwquvQcqq3kJ4lsukWjlGNYBK0CIiAhAmtG7qbOmaSsnWMORqOIZYRGMEd94satUgSfpu6QC262j8OUdIhWky4MjkWji9YqRE5nnVHTNZ36uVnK5PkIWS++LuVqt160HwMNDbKP3YkfkI/rEH5ks+OeTkHxbBOMxrEHj2/ZpO6CK952WjOCbY2nS89VBq4EtwcyL+KWGCwMCalYeOVFiWf/FFzUuF+V+r2PVOMgggvNTHgXOG9ocpseyf26e89ZeKglGG5i4PbHhOjtX7mkptcmZQCY/oAy1ASjrgyguj+z3S2FyYjAoa5MowfdPnp7crV2ZHgDyrtH4JT4lks9/6VBSLdy0g8gK7F6c7HhpoSJx8BSgXo1ZqJ3e/z3i/K5D/e5RMeL69VXDWHbMW6V4nlgpFj5dyigY70yKL1lyQwd6d8KLrTQA12izplZpeEI9oCHHhsdhh0dXHQcBV9VK2y4jd6JXZNwiKT0wn/EwqOknJ4UGuiokOcu2WdX6GLklgndgWUpi9VYcuhwtz3dOewWFM5DyG8K29sh9fqse84pASPBnHT1PzVFl0G+OVQp4MQI6zC25HMfpnO40w4LWuiH5Y8kjqbgDKNlNger4QTURyHZft2yuaACuCkk5ZhQfHDKe8o3bHv3l+YDAojwwd229f6twaGsWyf7PGaW2y7LBw9LLteOcK54XJxcLQloulU9aQdYZgHlnvYyFD4M2+BC4S4yLBu0Of82iBYVQ8MJEfBwNU6uOUet405XtOH9UKwb/sgci6M6pc0FDpy0vFUmi1UOoGU5lBYNQg4uqfwLf32631ziw7ggF9xsppzm1DXQOxOjIG0+9EXkmLc65rBe2kCLTBYrBbTFXUUvg9PW52z1DqcdYkSeMk4nBwJ3KWGQMTz4Xp30Yi2jchd1vCnHNjzjAXXDHw+BwQyVBTPTUK2AU36td83V3bwLBU7WveBVUlBg7rlk4V0Xh5M5dc2ovTz5F998qYqKPHmnZbR8gg1qEUxeXWDqnZFb7arAQBm8ZfaHevl5d3jt5bNYrc0CyveASpINPel4cHrOXVLXV6XiFimYDIKlBJOzes3ZGmV1OVXzcC7rNccsNdu/BbrKjuntmoEoUevIKdWxBDJdI6tOnbayWaxyAM2iXrgPesFdHZMcE+2yv38//YkwMV15S2OAzmWGiVMCd2mk1Z3GyNsH5yNQ43Ae+zjklPS2NEPd9skl6SkzEcLYHhfDgivluU9azWKlgK5OrvOob6i5BW3kNfwbLkLbjPYXHbSn4Q96EF3CfZV3z2hbJ+QmBBmCeL3jAqRfIF70B8hUyPWEuPBxLC6hTx2zW9ZGPger1Zzyzs+NM7zuV5rgt8zsK4IsM7vBGeLSqofFLodl49rftO3pSR9/hFuz+zzfniPXOT+icj71zcBdqA4Zpz9tGIq+cBdfWcpitZSAevNC353MWw0LdmofuQ1AwQ1XJ6pO0X7v9R0VuBbfeIE6nF0ZScXcANSipKZuIBO50ldnI5rqigpMzWjiez0zVr1btO3LErcSZd8zXZIBlO3z3cmyxD1QGYsFztyIniKXYEFVr/lhbTVPV3146PGDFCV9tZFyFaBy9Sd3xty3+swyr4kIYRY6lD3Cjxc/tNArauekCUYKKBQ6n/giamnC6msfvjXDpWbCdIiTwMsEZ0X16u9g+i+WGAtVPOc83UVSuG8o9tU/nqFyUHefXH+Ohpe9+9En+3adLMqdGKNQRJWkJhjdPwCe62X4dZej3dR9o2/1/nNWya646FwlFUQwPYK+WTlyhlSv/CYMAMfUBKgavPMqt3HCXSM3nJt/A0O+R34ZUy5YAXGuUYT8uwqVKkZ+zeXEklOeNK92qP/FK9Ku48G7VuQE+qi9Z47PpbT1YR5G00/DAybdFmmsZB30Qac0+3RtfA3+3XND97tPWnVJpwwx8kkxTJ7MA1QjiHhFuicU3/En3ensr+TwpNPXidcCe5t00wTUJC8ywAUMP3Z8x5971L2+Pu5EHOqNeYDORaGjtIGJGPfpCcEmV4uGXntnxaWKY8ZN7UnLhe41e73DV6eok254tbYQZp0ahdpMKvFd/ICIHTGsbXTA3Kd0ns+ChOhZF8igHtHa/0j1up/4CjYb7MBW7ZbjCuJYqk5de07rfaetGgYm/LBBQPPrGKY7R3j9YreSTvsgxu5eL5xHBFW3ZlO1gS+SKk58028L3162Yrzwwlp/3DDBPrktxzVZSzbMfQeuGKk3k2LnKmew1QQacWMHHr+EUH0AjOtM2TLj4LaeKoA12GlsqSMiBtTbxL311d99WV2DFrvtGM/vMXGhAyYBUWUhdkrJosQdFXTjcTt4SvysRLgTJL3Ybgaba7kF8f8BZjo0borgq+adABONKnf6e0PZ1RV17LTbFFA9EzkLx7ier1VADB1NuUVv0DzeE1AsvMcnVsQsJQ9QIE27/qr0KjKMHJo9DnWL3pB5+mszUVRgVccsxcSVoUnh95DxFMVo//dJFa//9donL+C8MDvsITIw0CoY2QwJoY7MrrnE99lbn+TgJzXwnZIcIlYe5c5lmKJctbDJs0Ede/Gr0WQtx9f/jvs2wBysjpLwsnBbTd2yUn2WL3WFRCsMC2d87Y975jAO262ft/PilzflnfZmIO8FW/jBE9VNnUqdyKoniLodg3XcKRImx0zV+FN4nee0WmAwRG/3eKATw9NnzvnYC7EhRhnKBRRy4SnUPD2sHeGDJwKO6ihtAs4MnRclOsCYa1xe4t6mt+BZ9ZmzFU6vY5S5kgtovdZ5OC5y7+C3jvjBk4y/063UZj5WPZczFnZ2SaIfVH2hdHp0iiBG9OMuWWuRmBCbXMqVoUlNyNIxyHPj0bCkjMeOf4Bg69EIoO1X3tStIti24oGazukOtAf5qNMfIEjGAlCPRT61BJLy/k9kJEj4x+6mvNaErLgamZn+bZj1+HCA2eeosPg1f85navJlnJl1LLp9xm6nfHInuBR6Sf9nhgBoS0FfCFACC1AH4TAb6RCeu9T/IawGGoUB5S0AdSgOC5DgLPWp/1NtNTzaApS31EFlDCHDqf0fEyzpRqpP/8sA6jEEOaT+z12GiBQ4B6hcqH6EdFpedeXWPvlBVnyNB86ePvVBVhdAAEs9FfEFX/lP6vR/MjhBoo0jQB2D6pcjTWp2W/9HrZsh06S8LgJOxeUzkKgN5JLuLEZYgnGm3v3sOr5zgshtTkDNHRe9RnQC9a3PrrsjBLAjcH42Uktfmm6C6P/HAC58zfMAdjyufh2Jru6WJm7S0mv9X1ckz9FrRwD7hvrnKr0GZNgwgH1D/Pufti2lEKgy5wB3e9w3FWlKPeVE48q0LMtx17x62ij/oGqjABpCBYBHo2wcUlc9jcWRr4QMcRKyff9fqP0P6LJxsyhusDAAAAAASUVORK5CYII=",
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
    'stations': {
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
