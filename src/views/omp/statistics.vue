<template>
  <div>
    <div class="onerowbox">
      <div class="itembox">
        <div class="leftbox">
          <div class="tit">全国总人数</div>
          <div class="cot">{{ everydata.allMemberCount }}</div>
        </div>
        <div class="rightbox">
          <svg-icon icon-class="ccone" className="icon"></svg-icon>
        </div>
      </div>
      <div class="itembox">
        <div class="leftbox">
          <div class="tit">已完成</div>
          <div class="cot">{{ everydata.finishAllMemberCount }}</div>
        </div>
        <div class="rightbox">
          <svg-icon icon-class="cctwo" className="icon"></svg-icon>
        </div>
      </div>
      <div class="itembox">
        <div class="leftbox">
          <div class="tit">未实名</div>
          <div class="cot">{{ everydata.notRealMemberCount }}</div>
        </div>
        <div class="rightbox">
          <svg-icon icon-class="ccthree" className="icon"></svg-icon>
        </div>
      </div>
      <div class="itembox">
        <div class="leftbox">
          <div class="tit">未签约</div>
          <div class="cot">{{ everydata.notSignMemberCount }}</div>
        </div>
        <div class="rightbox">
          <svg-icon icon-class="ccfour" className="icon"></svg-icon>
        </div>
      </div>
      <div class="itembox">
        <div class="leftbox">
          <div class="tit">未考试</div>
          <div class="cot">{{ everydata.notExamMemberCount }}</div>
        </div>
        <div class="rightbox">
          <svg-icon icon-class="ccfive" className="icon"></svg-icon>
        </div>
      </div>
    </div>
    <div class="toprow">
      <div class="toptit">区域：</div>
      <areaSelectLocal
        ref="areaSelect"
        @change="changeArea"
        :ismultiple="true"
        :isCollapse="true"
      ></areaSelectLocal>
      <div class="toprigtit">
        当前人数<span> (已完成) : </span> {{ everydata.nowMemberCount }}
      </div>
    </div>
    <div class="twoRowBox">
      <div class="tworowl">
        <div class="titbox">角色分布</div>
        <div
          style="
            width: 100%;
            height: 282px;
            position: relative;
            overflow: hidden;
          "
        >
          <div
            id="main"
            style="width: 100%; height: 282px; position: absolute; left: -100px"
          ></div>
        </div>
      </div>
      <div class="tworowr">
        <div class="titbox">
          <span>区域分布</span>
          <div>
            <el-radio-group
              v-model="anmation.areaNumber"
              fill="#4365AC"
              @input="checkoutinput"
            >
              <el-radio-button label="1">省</el-radio-button>
              <el-radio-button label="2">市</el-radio-button>
              <el-radio-button label="3">区</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <div id="histogram" style="width: 100%; height: 282px"></div>
      </div>
    </div>
    <div class="threeRowBox">
      <div class="titbox">
        <span>运维数据</span>
        <div class="rightbox">
          <div v-for="(item, index) in tadelist" :key="index">
            <span
              @click="checoutdatapage(index + 1)"
              :style="{
                color:
                  peoplepage.sign == index + 1
                    ? '#4365AC'
                    : 'rgba(0, 0, 0, 0.65)',
              }"
              >{{ item }}</span
            >
          </div>
          <el-date-picker
            v-model="value2"
            type="daterange"
            :align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            @change="changedata"
          >
          </el-date-picker>
        </div>
      </div>
      <div style="padding: 14px 24px 0px">
        <el-table
          :data="tableData"
          style="width: 100%"
          :align="center"
          @sort-change="headerclickmony"
        >
          <el-table-column prop="name" label="姓名"></el-table-column>
          <el-table-column prop="roleName" label="角色"></el-table-column>
          <el-table-column prop="allOrderCount" label="全部工单">
          </el-table-column>
          <el-table-column
            prop="workingOrderCount"
            label="进行中工单"
            width="120"
          >
          </el-table-column>
          <el-table-column
            prop="finishOrderCount"
            label="已完成工单"
            width="120"
          >
          </el-table-column>
          <el-table-column
            prop="orderFinishPercentage"
            label="工单完成率"
            width="130"
          >
          <template  slot="header">
            <span>工单完成率</span>
            <el-tooltip placement="right">
            <div slot="content">已完成工单/全部工单*100%</div>
            <i class="el-icon-question icon-color"></i>
          </el-tooltip>
          </template>
          </el-table-column>
          <el-table-column
            prop="maintenanceAvgTime"
            width="160"
            label="维修平均处理时长"
          >
          </el-table-column>
          <!-- <el-table-column prop="address" sortable label="巡检合格率"> </el-table-column> -->
          <el-table-column
            prop="reportingHiddenPercentage"
            width="160"
            label="隐患上报准确率"
          >
          </el-table-column>
          <el-table-column
            prop="moneySum"
            sortable
            label="累计金额(元)"
            width="150"
          >
          <template  slot="header">
            <span>累计金额</span>
            <el-tooltip placement="right">
            <div slot="content">已完成工单的实际交易金额</div>
            <i class="el-icon-question icon-color"></i>
          </el-tooltip>
          </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="display: flex; justify-content: end; padding: 12px 10px 16px">
        <el-pagination
          layout="prev, pager, next"
          :total="total"
          page-size="5"
          @current-change="sizechange"
        >
        </el-pagination>
      </div>
    </div>
    <div class="fourRowBox">
      <div class="leftbox">
        <div class="titbox">新增人员趋势</div>
        <div id="twozhubar" style="width: 100%; height: 318px"></div>
      </div>
      <div class="rightbox">
        <div class="titbox">
          <span
            v-for="(item, i) in lastdata"
            :key="i"
            @click="ordercheck(i)"
            :style="{ fontWeight: orderstatus == i ? '700' : 'normal' }"
            >{{ item }}</span
          >
        </div>
        <div class="contentbox">
          <div class="row" v-for="(item, i) in orderdatalist" :key="i">
            <div class="l">
              <div class="icon" :class="{ bgc: i < 3 }">{{ i + 1 }}</div>
              <div class="tex">{{ item.name }}</div>
            </div>
            <div class="num">{{ item.value }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  peopleCount,
  datalistpage,
  umsmember,
  newPersonnelTrend,
} from "@/api/ywfirstpage";
import areaSelectLocal from "@/components/areaSelectLocal.vue";
export default {
  components: {
    areaSelectLocal,
  },
  data() {
    return {
      everydata: {},
      // 区域分布数据
      region: [],
      regiondata: [],
      // 总区域传参
      anmation: {
        areCodeList: [],
        areaNumber: 1,
      },
      tadelist: ["今日", "最近七天", "最近30天"],
      lastdata: ["工单量排行榜", "工单交易额排行榜"],
      // 分页数据
      peoplepage: {
        moneySumSort: null,
        current: 1,
        size: 5,
        areCodeList: [],
        startTime: "",
        endTime: "",
        sign: 1,
      },
      tableData: [],
      orderstatus: 0,
      orderdatalist: [],
      // 新增人员趋势
      finishordercount: {},
      // 饼图
      piedataone: [],
      piedatatwo: [],
      value2: "",
      total: "",
    };
  },
  created() {},
  mounted() {
    this.getpeople();
    this.getpeoplepage();
    this.getums();
    this.getnewPersonnelTrend();
  },
  methods: {
    getpeople() {
      let that = this;
      peopleCount(this.anmation).then((res) => {
        this.everydata = res.data;
        this.region = res.data.reportStatisticsMapVOS
          .map((el) => {
            return el.name;
          })
          .reverse();
        this.regiondata = res.data.reportStatisticsMapVOS
          .map((el) => {
            return el.value;
          })
          .reverse();
        this.piedatatwo = res.data.rolePercentageVOList.map((el) => {
          return { value: el.roleCount, name: el.roleName };
        });
        this.piedataone = res.data.rolePercentageVOList.map((el) => {
          return { icon: "circle", name: el.roleName };
        });
        // 饼图图例
        this.getPie();
        this.histogram();
        this.twohistogram();
      });

      console.log(this.region);
    },
    // 头部区域切换
    changeArea(a) {
      this.anmation.areCodeList = a.map((el) => {
        return el[2];
      });
      this.peoplepage.areCodeList = a.map((el) => {
        return el[2];
      });
      this.getpeople();
      this.getpeoplepage();
      this.getums();
      this.getnewPersonnelTrend();
    },
    // 省市区切换
    checkoutinput(e) {
      this.anmation.areaNumber = e;
      this.getpeople();
    },
    // 获取表格数据
    getpeoplepage() {
      datalistpage(this.peoplepage).then((res) => {
        this.tableData = res.data.records;
        this.total = res.data.total;
      });
      this.getnewPersonnelTrend();
      this.getums()
    },
    // 需改天数
    checoutdatapage(e) {
      this.peoplepage.sign = e;
      this.peoplepage.startTime = null;
      this.peoplepage.endTime = null;
      this.value2 = "";
      this.getpeoplepage();
      this.getums();
      this.getnewPersonnelTrend();
    },
    // 工单排行榜
    getums() {
      umsmember({
        areCodeList: this.anmation.areCodeList,
        sign: this.peoplepage.sign,
        startTime: this.value2[0],
        endTime: this.value2[1],
      }).then((res) => {
        if (this.orderstatus == 0) {
          this.orderdatalist = res.data.orderRank;
        } else {
          this.orderdatalist = res.data.moneyRank;
        }
      });
    },
    // 切换工单排行榜
    ordercheck(e) {
      console.log(e);
      this.orderstatus = e;
      this.getums();
    },
    // 新增人员趋势获取数据
    getnewPersonnelTrend() {
      newPersonnelTrend({
        areCodeList: this.anmation.areCodeList,
        sign: this.peoplepage.sign,
        startTime: this.value2[0],
        endTime: this.value2[1],
      }).then((res) => {
        this.finishordercount = res.data;
        this.twohistogram();
      });
    },
    // 日期改变触发
    changedata() {
      this.peoplepage.startTime = this.value2[0];
      this.peoplepage.endTime = this.value2[1];
      this.peoplepage.sign = null;
      this.getpeoplepage();
    },
    // 分页触发
    sizechange(e) {
      this.peoplepage.current = e;
      this.getpeoplepage();
    },
    headerclickmony(e) {
      console.log(e);
      if (e.column.label == "累计金额(元)") {
        if (e.order == "ascending") {
          this.peoplepage.moneySumSort = "1";
        } else if (e.order == "descending") {
          this.peoplepage.moneySumSort = "2";
        } else {
          this.peoplepage.moneySumSort = null;
        }
        this.getpeoplepage();
      }
    },
    // 饼图图例
    getPie() {
      const chartBoxone = this.$echarts.init(document.getElementById("main"));
      const option = {
        legend: {
          type: "plain",
          top: "20%",
          left: "80%",
          //   orient: "horizontal",
          origin: "vertical",
          itemHeight: 26,
          itemWidth: 12,
          data: this.piedataone,
        },
        color: [
          "#1890FF",
          "#13C2C2",
          "#2FC25B",
          "#FACC14",
          "#F04864",
          "#8543E0",
        ],
        series: [
          {
            name: "Access From",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: -10,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "center",
              formatter: "{b}\n{d}%",
              // formatter: function (params) {
              //   // 使用params.data获取数据项的信息，包括value和name
              //   return  '{d}%';
              // },
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 14,
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: this.piedatatwo,
          },
        ],
      };
      chartBoxone.setOption(option);
      // 根据页面大小自动响应图表大小
      window.addEventListener("resize", function () {
        chartBoxone.resize();
      });
    },
    // 饼图图例
    // 柱状图
    histogram() {
      console.log(this.region, "3434343");
      const chartBox = this.$echarts.init(document.getElementById("histogram"));
      const option = {
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "value",
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            textStyle: {
              color: "#AEAEAE",
            },
          },
        },
        yAxis: {
          type: "category",
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: "#CCCCCC", // 设置 Y 轴线颜色为红色
            },
          },
          axisLabel: {
            textStyle: {
              color: "#AEAEAE",
            },
          },
          data: this.region,
        },
        dataZoom: [
          {
            type: "inside", // 使用滑块型的数据区域缩放
            yAxisIndex: [0], // 指定要控制的 X 轴索引，这里是第一个（如果有多个 X 轴，可以指定多个）
            start: 0, // 缩放范围的起始位置，0 表示最左边
            end: 100, // 缩放范围的结束位置，100 表示最右边
          },
          {
            type: "inside", // 使用内置型的数据区域缩放
            yAxisIndex: [0], // 同样指定要控制的 X 轴索引
            start: 0,
            end: 100,
          },
        ],
        grid: {
          left: "24px",
          right: "8%",
          top: "24px",
          bottom: "24px",
          containLabel: true,
        },
        series: [
          {
            data: this.regiondata,
            type: "bar",
            barWidth: 10,
            // showBackground: true,
            // backgroundStyle: {
            //   color: "rgba(180, 180, 180, 0.2)",
            // },
            itemStyle: {
              normal: {
                barBorderRadius: [0, 4, 4, 0],
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
        ],
      };
      chartBox.setOption(option);
      // 根据页面大小自动响应图表大小
      window.addEventListener("resize", function () {
        chartBox.resize();
      });
    },
    // 双柱状图
    twohistogram() {
      const chartBox = this.$echarts.init(document.getElementById("twozhubar"));
      const option = {
        tooltip: {
          trigger: "axis",
        },
        yAxis: {
          type: "value",
          axisLine: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              type: "dashed", // 设置Y轴刻度线为虚线
              color: "#E8E8E8", // 设置虚线的颜色为绿色
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            textStyle: {
              color: "#AEAEAE",
            },
          },
        },
        xAxis: {
          type: "category",
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: "#CCCCCC",
            },
          },
          axisLabel: {
            textStyle: {
              color: "#AEAEAE",
            },
          },
          data: this.finishordercount.dateList,
        },
        legend: {
          top: "5%", // 控制 板块控制器的位置
          right: "center",
          // icon: 'rect',//形状  类型包括 circle，rect,line，roundRect，triangle，diamond，pin，arrow，none
          // itemWidth: 10,  // 设置宽度
          // itemHeight: 4, // 设置高度
          itemGap: 20, // 设置间距
          data: [
            {
              name: "已完成人数",
              textStyle: {
                color: "#AEAEAE", // 单独设置某一个图列的颜色
              },
            },
            // {
            //   name: "未考试人数",
            //   textStyle: {
            //     color: "#AEAEAE",
            //   },
            // },
            // {
            //   name: "未实名人数",
            //   textStyle: {
            //     color: "#AEAEAE",
            //   },
            // },
            // {
            //   name: "未签约人数",
            //   textStyle: {
            //     color: "#AEAEAE",
            //   },
            // },
          ],
        },

        grid: {
          left: "24px",
          right: "8%",
          top: "48px",
          bottom: "24px",
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
            name: "已完成人数",
            type: "bar",
            stack: "email",
            barWidth: 14,
            itemStyle: {
              // 自定义柱子颜色
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
                      color: "#8CA4FD",
                      // 渐变起始色
                    },
                    {
                      offset: 1,
                      // 渐变结束色
                      color: "#4F6CD8",
                    },
                  ],
                },
              },
            },
            emphasis: {
              focus: "series",
            },
            data: this.finishordercount.finishAllMemberList,
          },
          {
            name: "未考试人数",
            type: "bar",
            stack: "email",
            barWidth: 14,
            itemStyle: {
              // 自定义柱子颜色
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
                      color: "#5EE7F3", // 渐变起始色
                    },
                    {
                      offset: 1,
                      // 渐变结束色
                      color: "#2EBDCB",
                    },
                  ],
                },
              },
            },
            emphasis: {
              focus: "series",
            },
            data: this.finishordercount.notExamMemberList,
          },
          {
            name: "未实名人数",
            type: "bar",
            stack: "email",
            barWidth: 14,
            itemStyle: {
              // 自定义柱子颜色
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
                      color: "#BB78F2",
                      // 渐变起始色
                    },
                    {
                      offset: 1,
                      // 渐变结束色
                      color: "#8543E0",
                    },
                  ],
                },
              },
            },
            emphasis: {
              focus: "series",
            },
            data: this.finishordercount.notRealMemberList,
          },
          {
            name: "未签约人数",
            type: "bar",
            stack: "email",
            barWidth: 14,
            itemStyle: {
              // 自定义柱子颜色
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
                      color: "#FFD551",
                      // 渐变起始色
                    },
                    {
                      offset: 1,
                      // 渐变结束色
                      color: "#FFAA28",
                    },
                  ],
                },
              },
            },
            emphasis: {
              focus: "series",
            },
            data: this.finishordercount.notSignMemberList,
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
.bgc {
  background: linear-gradient(180deg, #8ca4fd 0%, #4f6cd8 100%) !important;
  color: #ffffff;
  font-weight: 500;
}
.toprow {
  margin-bottom: 16px;
  width: 100%;
  background: #ffffff;
  border-radius: 4px;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  .toptit {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
  }
  .toprigtit {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    margin-left: 20px;
    span {
      color: #aaaaaa;
    }
  }
}
.onerowbox {
  width: 100%;
  background: #ffffff;
  border-radius: 4px;
  padding: 24px;
  display: flex;
  margin-bottom: 16px;
  .itembox:last-child {
    margin-right: 0;
  }
  .itembox {
    flex: 1;
    margin-right: 17px;
    height: 110px;
    background: rgba(59, 79, 223, 0.06);
    border-radius: 6px;
    display: flex;
    justify-content: space-between;
    padding: 24px;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #6067aa;
    .leftbox {
      .tit {
        white-space: nowrap;
      }
      .cot {
        font-size: 28px;
        margin-top: 8px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: rgba(0, 0, 0, 0.85);
      }
    }
    .rightbox {
      width: 48px;
      height: 48px;
      font-size: 48px;
      margin-top: 4px;
    }
  }
}
.twoRowBox {
  width: 100%;
  display: flex;
  margin-top: 16px;
  .tworowl {
    flex: 1;
    margin-right: 8px;
    background: #ffffff;
    border-radius: 4px;
    .titbox {
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      border-bottom: 1px solid #e9e9e9;
      height: 53px;
      display: flex;
      align-items: center;
      padding-left: 24px;
    }
  }
  .tworowr {
    flex: 1;
    margin-left: 8px;
    background: #ffffff;
    border-radius: 4px;
    .titbox {
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      border-bottom: 1px solid #e9e9e9;
      height: 53px;
      display: flex;
      align-items: center;
      padding-left: 24px;
      padding-right: 24px;
      justify-content: space-between;
    }
  }
}
.threeRowBox {
  width: 100%;
  background: #ffffff;
  border-radius: 4px;
  .titbox {
    height: 53px;
    border-bottom: 1px solid #e9e9e9;
    margin-top: 16px;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .rightbox {
      display: flex;
      align-items: center;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.65);
      span {
        margin-right: 24px;
      }
    }
  }
}
.fourRowBox {
  width: 100%;
  display: flex;
  margin-top: 16px;
  .leftbox {
    flex: 1.8;

    background: #ffffff;
    border-radius: 4px;
    margin-right: 16px;
    .titbox {
      width: 100%;
      height: 53px;
      border-bottom: 1px solid #e9e9e9;
      padding-left: 24px;
      display: flex;
      align-items: center;
    }
  }
  .rightbox {
    flex: 1;
    background: #ffffff;
    border-radius: 4px;
    .titbox {
      width: 100%;
      height: 53px;
      border-bottom: 1px solid #e9e9e9;
      padding-left: 24px;
      display: flex;
      align-items: center;
      span {
        margin-right: 32px;
      }
    }
    .contentbox {
      height: 318px;
      padding: 24px 32px 42px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .row {
        display: flex;
        justify-content: space-between;
        // margin-top: 17px;
        .l {
          display: flex;
          align-items: center;
          .icon {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #f0f2f5;
            margin-right: 22px;
          }
        }
      }
    }
  }
}
</style>