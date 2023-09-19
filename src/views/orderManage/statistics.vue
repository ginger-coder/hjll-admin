<template>
  <div>
    <div class="toprow">
      <div class="leftbox">
        <areaSelectLocal
          ref="areaSelect"
          @change="changeArea"
          :ismultiple="true"
          :isCollapse="true"
        ></areaSelectLocal>
      </div>
      <div class="rightbox">
        <div class="rightonebox">
          <span
            v-for="(item, i) in tadelist"
            :key="i"
            @click="Checkboxtab(i)"
            :style="{ color: status == i ? '#ffffff' : '' }"
            >{{ item }}</span
          >
        </div>
        <div
          class="bgccolor"
          :style="{ transform: `translateX(${90 * status}px)` }"
        ></div>
        <div class="righttwobox">
          <el-date-picker
            v-model="datatime"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            @change="changedatares"
          >
          </el-date-picker>
        </div>
      </div>
    </div>
    <!-- <div class="onerow">
      <div class="titbox">概览</div>
      <div class="itembigbox">
        <div class="itembox">
          <div class="leftbox">
            <img src="../../assets/oneico.jpg" alt="" />
          </div>
          <div class="rightbox">
            <div class="top">已派单</div>
            <div class="bot">{{ everydata.dispatchedOrder }}</div>
          </div>
        </div>
        <div class="itembox TWO">
          <div class="leftbox">
            <img src="../../assets/twoico.png" alt="" />
          </div>
          <div class="rightbox">
            <div class="top">处理中</div>
            <div class="bot">{{ everydata.receivedOrder }}</div>
          </div>
        </div>
        <div class="itembox THE">
          <div class="leftbox">
            <img src="../../assets/threeico.png" alt="" />
          </div>
          <div class="rightbox">
            <div class="top">已回单</div>
            <div class="bot">{{ everydata.receiptOrder }}</div>
          </div>
        </div>
        <div class="itembox FOU">
          <div class="leftbox">
            <img src="../../assets/fourico.png" alt="" />
          </div>
          <div class="rightbox">
            <div class="top">回单待审核</div>
            <div class="bot">{{ everydata.notSettlementOrder }}</div>
          </div>
        </div>
        <div class="itembox FIV">
          <div class="leftbox">
            <img src="../../assets/fiveico.png" alt="" />
          </div>
          <div class="rightbox">
            <div class="top">回单审核时效</div>
            <div class="bot">{{ everydata.finishOrder }}</div>
          </div>
        </div>
      </div>
    </div> -->
    <div class="onerow">
      <div class="titbox">概览</div>
      <el-row :gutter="25" class="itembigbox">
        <el-col :span="6">
          <div class="itembox">
            <div class="leftbox">
              <img src="../../assets/oneico.jpg" alt="" />
            </div>
            <div class="rightbox">
              <div class="top">已派单</div>
              <div class="bot">{{ everydata.dispatchedOrder }}</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="itembox TWO">
            <div class="leftbox">
              <img src="../../assets/twoico.png" alt="" />
            </div>
            <div class="rightbox">
              <div class="top">已接单</div>
              <div class="bot">{{ everydata.receivedOrder }}</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="itembox THE">
            <div class="leftbox">
              <img src="../../assets/threeico.png" alt="" />
            </div>
            <div class="rightbox">
              <div class="top">已回单</div>
              <div class="bot">{{ everydata.receiptOrder }}</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="itembox FOU">
            <div class="leftbox">
              <img src="../../assets/fourico.png" alt="" />
            </div>
            <div class="rightbox">
              <div class="top">待结算</div>
              <div class="bot">{{ everydata.notSettlementOrder }}</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="itembox FIV">
            <div class="leftbox">
              <img src="../../assets/fiveico.png" alt="" />
            </div>
            <div class="rightbox">
              <div class="top">已完成</div>
              <div class="bot">{{ everydata.finishOrder }}</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="tworow">
      <div class="titbox">
        <span
          v-for="(item, index) in orderlist"
          :key="index"
          @click="checkoutorders(index)"
          :style="{ fontWeight: orderstatus == index ? '800' : '400' }"
          >{{ item }}</span
        >
      </div>
      <div class="contentbox">
        <div class="conleftbox">
          <div id="main" style="width: 100%; height: 282px"></div>
        </div>
        <div class="conrightbox">
          <div class="righttit">数据及占比</div>
          <div id="maintwo" style="width: 100%; height: 282px"></div>
        </div>
      </div>
    </div>
    <!-- <div class="threerow">
      <div class="leftbox">
        <div class="tit">相关数据</div>
        <div class="itembox">
          <div class="itml">
            <div class="itmlt">巡检计划完成率</div>
            <div class="itmlb">35.00%</div>
          </div>
          <div class="itmr">
            <el-progress
              type="circle"
              :percentage="25"
              :width="50"
              :height="50"
              stroke-width="10"
              color="#8543E0"
            ></el-progress>
          </div>
        </div>
      </div>
      <div class="rightbox">
        <div class="tit">隐患内容</div>
      </div>
    </div> -->
  </div>
</template>

<script>
import { Checkbox } from "element-ui";
import { adminOrderReport } from "../../api/ywfirstpage";
import areaSelectLocal from "@/components/areaSelectLocal.vue";
export default {
  components: {
    areaSelectLocal,
  },
  data() {
    return {
      orderform: {
        areCodeList: [],
        sign: 1,
        startTime: null,
        endTime: null,
      },
      datatime: "",
      tadelist: ["今日", "最近七天", "最近30天"],
      orderlist: ["工单量", "交易额"],
      status: 0,
      orderstatus: 0,
      everydata: {},
      // 饼图数据
      pieordernum: [],
      // 柱状图底部日期
      bardata: [],
      // 柱状图数据
      polling: [],
      xibardata: [],
      wxbardata: [],
      linedata: [],
    };
  },
  mounted() {
    this.twohistogram();
    this.peioptions();
    this.geteverydata();
  },
  methods: {
    async geteverydata() {
      const res = await adminOrderReport(this.orderform);
      this.everydata = res.data;
      this.checkoutorders(0);
    },
    Checkboxtab(e) {
      this.status = e;
      this.orderform.sign = e + 1;
      (this.orderform.startTime = null),
        (this.orderform.endTime = null),
        (this.datatime = null);
      this.geteverydata();
    },
    checkoutorders(e) {
      console.log(e);
      this.orderstatus = e;
      // 饼图数据
      let peiorder = Array.from(this.everydata.dealMoneyTypeRatioList);

      // 柱图数据
      let barorer = Array.from(this.everydata.reportStatisticsMapVOList);

      // 柱状图日期
      this.bardata = barorer.map((el) => {
        return el.date;
      });

      if (e == 0) {
        // 饼图
        let pieorder = peiorder
          .filter((item) => {
            return item.orders != 0;
          })
          .map((el) => {
            return { value: el.orders, name: el.workOrderTypeName };
          });
        this.pieordernum = pieorder;

        let xjData = [];
        let wxData = [];
        // 柱状图数据处理
        barorer.forEach((item) => {
          let order_xj = 0;
          let order_wx = 0;
          if (item.orderMapList.length) {
            const order_xj_item = item.orderMapList.find(
              (el) => el.name == "巡检"
            );
            const order_wx_item = item.orderMapList.find(
              (el) => el.name == "维修"
            );
            order_xj = order_xj_item ? order_xj_item.value : 0;
            order_wx = order_wx_item ? order_wx_item.value : 0;
          }
          xjData.push(order_xj);
          wxData.push(order_wx);
        });
        console.log("xjData", xjData);
        console.log("order_wx", wxData);
        this.xibardata = xjData;
        this.wxbardata = wxData;
        //  折线图数据
        var resultArray = [];
        for (var i = 0; i < xjData.length; i++) {
          var sum = Number(xjData[i]) + Number(wxData[i]);
          resultArray.push(sum);
        }
        this.linedata = resultArray;
      } else {
        let pieorder = peiorder
          .filter((item) => {
            return item.money != 0;
          })
          .map((el) => {
            return { value: el.money, name: el.workOrderTypeName };
          });
        this.pieordernum = pieorder;

        // 柱状图数据处理
        // 柱图数据
        let barorer = Array.from(this.everydata.reportStatisticsMapVOList);

        let xjData = [];
        let wxData = [];
        // 柱状图数据处理
        barorer.forEach((item) => {
          let order_xj = 0;
          let order_wx = 0;
          if (item.orderMapList.length) {
            const order_xj_item = item.moneyMapList.find(
              (el) => el.name == "巡检"
            );
            const order_wx_item = item.moneyMapList.find(
              (el) => el.name == "维修"
            );
            order_xj = order_xj_item ? order_xj_item.value : 0;
            order_wx = order_wx_item ? order_wx_item.value : 0;
          }
          xjData.push(order_xj);
          wxData.push(order_wx);
        });
        this.xibardata = xjData;
        this.wxbardata = wxData;
        //  折线图数据
        var resultArray = [];
        for (var i = 0; i < xjData.length; i++) {
          var sum = Number(xjData[i]) + Number(wxData[i]);
          resultArray.push(sum);
        }
        this.linedata = resultArray;
      }
      this.twohistogram();
      this.peioptions();
    },
    changeArea(e) {
      this.orderform.areCodeList = e.map((el) => {
        return el[2];
      });
      this.geteverydata();
    },
    changedatares() {
      console.log(this.datatime);
      this.orderform.startTime = this.datatime[0];
      this.orderform.endTime = this.datatime[1];
      this.orderform.sign = "";
      this.geteverydata();
    },
    // 双柱状图
    twohistogram() {
      const chartBox = this.$echarts.init(document.getElementById("main"));
      const option = {
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["总数", "巡检", "维修"],
        },
        xAxis: [
          {
            type: "category",
            data: this.bardata,
            axisLine: {
              lineStyle: {
                color: "#D9D9D9", // 设置 y 轴线颜色
                width: 1, // 设置 y 轴线宽度
                type: "solid", // 设置 y 轴线类型（solid、dashed、dotted）
              },
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "工单量趋势",
            axisLabel: {
              formatter: "{value}", // 格式化标签文本
            },
            axisLine: {
              show: false, // 显示 y 轴线
              lineStyle: {
                color: "rgba(0,0,0,0.65)", // 设置 y 轴线颜色
                width: 2, // 设置 y 轴线宽度
                type: "solid", // 设置 y 轴线类型（solid、dashed、dotted）
              },
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              lineStyle: {
                type: "dashed", // 设置Y轴刻度线为虚线
                color: "#E8E8E8", // 设置虚线的颜色为绿色
              },
            },
          },
        ],
        grid: {
          left: "24px",
          right: "8%",
          top: "48px",
          bottom: "0",
          containLabel: true,
        },
        dataZoom: [
          {
            type: "inside", // 使用滑块型的数据区域缩放
            xAxisIndex: [0], // 指定要控制的 X 轴索引，这里是第一个（如果有多个 X 轴，可以指定多个）
            start: 0, // 缩放范围的起始位置，0 表示最左边
            end: 100, // 缩放范围的结束位置，100 表示最右边
          },
          {
            type: "inside", // 使用内置型的数据区域缩放
            xAxisIndex: [0], // 同样指定要控制的 X 轴索引
            start: 0,
            end: 100,
          },
        ],
        series: [
          {
            name: "总数",
            type: "line",
            yAxisIndex: 0, // 使用第一个 y 轴
            symbol: "none",
            smooth: true,
            lineStyle: {
              width: 2, // 设置线条宽度
              shadowBlur: 10, // 设置阴影模糊度
              shadowColor: "#FFD551 ", // 设置阴影颜色
              shadowOffsetX: -4, // 设置阴影水平偏移量
              shadowOffsetY: 5, // 设置阴影垂直偏移量
            },
            itemStyle: {
              normal: {
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: "#FFAA28", // 渐变起始色
                    },
                    {
                      offset: 1,
                      color: "#FFD551", // 渐变结束色
                    },
                  ],
                },
              },
            },

            data: this.linedata,
          },
          {
            name: "巡检",
            type: "bar",
            data: this.xibardata,
            barWidth: 14,
            showBackground: true,
            itemStyle: {
              normal: {
                barBorderRadius: [8, 8, 0, 0],
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: "#8CA4FD", // 渐变起始色
                    },
                    {
                      offset: 1,
                      color: "#4F6CD8", // 渐变结束色
                    },
                  ],
                },
              },
            },
          },
          {
            name: "维修",
            type: "bar",
            showBackground: true,
            data: this.wxbardata,
            itemStyle: {
              normal: {
                barBorderRadius: [8, 8, 0, 0],
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: "#3CA8E2", // 渐变起始色
                    },
                    {
                      offset: 1,
                      color: "#7DD2FF", // 渐变结束色
                    },
                  ],
                },
              },
            },
            barWidth: 14,
          },
        ],
      };
      chartBox.setOption(option);
      // 根据页面大小自动响应图表大小
      window.addEventListener("resize", function () {
        chartBox.resize();
      });
    },
    // 饼图
    peioptions() {
      const chartBox = this.$echarts.init(document.getElementById("maintwo"));
      const option = {
        legend: {
          bottom: "0",
          left: "center",
        },
        color: ["#68C4F5", "#40C9D5", "#4256E2"],
        series: [
          {
            name: "数据占比",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            itemStyle: {
              // borderRadius: -20,
              borderColor: "#fff",
              borderWidth: 4,
            },
            label: {
              show: false,
              position: "center",
              formatter: function (params) {
                // 使用params.data获取数据项的信息，包括value和name
                return params.data.name + "\n" + params.data.value;
              },
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 14,
                fontWeight: "bold",
              },
            },
            label: {
              show: true,
              formatter: "{b} ({d}%)", // 显示名称和百分比
              position: "outside", // 将标签显示在外部
            },
            labelLine: {
              show: false,
            },
            data: this.pieordernum,
          },
          {
            name: "中心圆",
            radius: ["40%", "51%"],
            center: ["50%", "50%"],
            type: "pie",
            color: "#E8EDFF", //内圆颜色
            itemStyle: {
              normal: {
                // 设置阴影
                shadowBlur: 30,
                shadowColor: "rgba(147, 147, 147,0.3)",
                shadowOffsetX: 10,
                shadowOffsetY: 7,
              },
            },
            label: {
              normal: {
                show: false,
              },
              emphasis: {
                show: false,
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
              emphasis: {
                show: false,
              },
            },
            animation: false,
            tooltip: {
              show: false,
            },
            data: [
              {
                value: 1,
              },
            ],
          },
          {
            name: "外边框",
            type: "pie",
            color: "#E8EDFF", //内圆颜色
            clockWise: false, //顺时加载
            hoverAnimation: false, //鼠标移入变大
            center: ["50%", "50%"],
            radius: ["80%", "65%"],
            itemStyle: {
              normal: {
                // 设置阴影
                shadowBlur: 30,
                shadowColor: "rgba(147, 147, 147,0.3)",
                shadowOffsetX: 10,
                shadowOffsetY: 7,
              },
            },
            label: {
              normal: {
                show: false,
              },
            },
            data: [
              {
                value: 9,
                name: "",
                itemStyle: {
                  normal: {
                    //可以设置样式
                    // borderWidth: 2,
                    // borderColor: '#2ec7c9'
                  },
                },
              },
            ],
          },
        ],
      };
      chartBox.setOption(option);
      // 根据页面大小自动响应图表大小
      window.addEventListener("resize", function () {
        chartBox.resize();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.toprow {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  .rightbox {
    display: flex;
    .rightonebox {
      height: 36px;
      background: rgba(255, 255, 255, 0.65);
      border-radius: 16px;
      margin-right: -76px;
      display: flex;
      span {
        display: inline-block;
        width: 91px;
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.65);
        padding: 5px 16px;
        display: flex;
        align-items: center;
        z-index: 1;
        justify-content: center;
      }
    }
    .bgccolor {
      width: 91px;
      height: 36px;
      background: #3b4fdf;
      z-index: 0;
      border-radius: 18px;
      position: relative;
      left: -194px;
      transition: all 0.2s;
    }
  }
}
.onerow {
  padding: 20px 24px 24px;
  height: 218px;
  background: #ffffff;
  border-radius: 24px;
  margin-bottom: 16px;
  .titbox {
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
  }
  .itembigbox {
    display: flex;
    justify-content: space-between;
    .itembox:last-child {
      margin-right: 0;
    }
    .itembox {
      width: 100%;
      // margin-right: 31px;
      height: 138px;
      background: rgba(59, 79, 223, 0.06);
      border-radius: 40px 35px 30px 30px;
      background: url("../../assets/onebgc.png") no-repeat center;
      background-size: cover;
      display: flex;
      justify-content: space-between;
      .leftbox {
        width: 100px;
        height: 100px;
        // margin-top: 20px;
        // margin-left: 24px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .rightbox {
        // margin-right: 61px;
        margin-right: 20%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .top {
          display: flex;
          font-size: 16px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #1f2375;
          margin-bottom: 8px;
          white-space: nowrap;
        }
        .bot {
          font-size: 28px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #24136e;
        }
      }
    }
  }
}
.tworow {
  height: 370px;
  background: #ffffff;
  border-radius: 24px;
  margin-bottom: 16px;
  padding: 24px;
  .titbox {
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 24px;
    span {
      margin-right: 40px;
    }
  }
  .contentbox {
    display: flex;
    .conleftbox {
      flex: 3;
      border-right: 1px solid rgba(0, 0, 0, 0.05);
    }
    .conrightbox {
      flex: 1;
      .righttit {
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.75);
        margin-left: 23px;
      }
    }
  }
}
.threerow {
  width: 100%;
  display: flex;
  .leftbox {
    flex: 1;
    height: 362px;
    background: #ffffff;
    border-radius: 24px;
    margin-right: 16px;
    padding: 20px 24px 24px;
    .tit {
      font-size: 16px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.85);
    }
    .itembox {
      height: 80px;
      background: #ffffff;
      box-shadow: 0px 2px 4px 0px rgba(59, 79, 223, 0.1);
      border-radius: 6px;
      border: 1px solid rgba(59, 79, 223, 0.06);
      padding: 12px 32px 16px 16px;
      margin-top: 16px;
      display: flex;
      justify-content: space-between;
      .itml {
        .itmlt {
          font-size: 14px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.65);
        }
        .itmlb {
          font-size: 23px;
          font-family: HelveticaNeue-Medium, HelveticaNeue;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.85);
          margin-top: 6px;
        }
      }
      .itmr {
        width: 48px;
        height: 48px;
      }
    }
  }
  .rightbox {
    flex: 3;
    height: 362px;
    background: #ffffff;
    border-radius: 24px;
    .tit {
      font-size: 16px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.85);
    }
  }
}
.TWO {
  background: url("../../assets/twobgc.png") no-repeat center !important;
  background-size: cover !important;
}
.THE {
  background: url("../../assets/threebgc.png") no-repeat center !important;
  background-size: cover !important;
}
.FOU {
  background: url("../../assets/fourbgc.png") no-repeat center !important;
  background-size: cover !important;
}
.FIV {
  background: url("../../assets/fivebgc.png") no-repeat center !important;
  background-size: cover !important;
}
.el-range-editor--medium.el-input__inner {
  border-radius: 50px;
}
</style>