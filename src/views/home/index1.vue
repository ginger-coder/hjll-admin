<template>
  <div class="app-container page-app-container home-container min">
    <div class="contain" style="min-width:800px!important">
      <div class="cl">
        <img src="../../assets/avatar.png" alt="" style="
            width: 45px;
            height: 45px;
            margin-right: 20px;
            margin-top: 25px;
          " />
        <div>
          <h2>您好，管理员</h2>
          <p>平台超级管理员 | 助力中国通信维护领域降本增效</p>
        </div>
      </div>
      <div class="cr">
        <div style="
            width: 100px;
            border-right: 2px solid #f2f2f2;
            padding-right: 26px;
            height: 60px;
          ">
          <p style="margin-top">未读提醒</p>
          <p style="text-align: right; font-size: 30px; margin-right: 12px">
            0
          </p>
        </div>
        <div style="
            width: 100px;
            border-right: 2px solid #f2f2f2;
            padding-right: 26px;
            height: 60px;
            margin-left: 20px;
          ">
          <p style="margin-top">未读通知</p>
          <p style="text-align: right; font-size: 30px; margin-right: 12px">
            0
          </p>
        </div>
        <div style="
            width: 100px;
            border-right: 2px solid #f2f2f2;
            padding-right: 26px;
            height: 60px;
            margin-left: 20px;
          ">
          <p style="margin-top">未读消息</p>
          <p style="text-align: right; font-size: 30px; margin-right: 12px">
            0
          </p>
        </div>
      </div>
    </div>
    <el-scrollbar wrap-class="app-container-wrapper" style="background: #f2f2f2">
      <div style="background: #f2f2f2; height: 20px; margin: -20px -20px 0"></div>
      <el-row :gutter="20" style="margin-bottom: 12px">
        <el-col :span="8">
          <div style="
              height: 100px;
              background: white;
              border-radius: 6px;
              text-align: center;
              padding-top: 20px;
            ">
            <div>
              <span style="color: #5499ff">新增 <span style="color: #000; font-size: 24px">{{
                userOfflineTrain
              }}</span></span>
            </div>
            <p style="color: #a9b2b7">运维人员线下培训预约</p>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="
              height: 100px;
              background: white;
              border-radius: 6px;
              text-align: center;
              padding-top: 20px;
            ">
            <div>
              <span style="color: #5499ff">新增 <span style="color: #000; font-size: 24px">{{
                userTheoryExam
              }}</span></span>
            </div>
            <p style="color: #a9b2b7">运维人员理论考试预约</p>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="
              height: 100px;
              background: white;
              border-radius: 6px;
              text-align: center;
              padding-top: 20px;
            ">
            <div>
              <span style="color: #5499ff">新增 <span style="color: #000; font-size: 24px">{{
                userPracticalOperation
              }}</span></span>
            </div>
            <p style="color: #a9b2b7">运维人员实操考试预约</p>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="16">
          <el-row :gutter="0">
            <el-col :span="8">
              <div style="
                  height: 100px;
                  background: white;
                  border-top-left-radius: 6px;
                  border-bottom-left-radius: 6px;
                  text-align: center;
                  padding-top: 20px;
                ">
                <div>
                  <span style="color: #000; font-size: 24px">{{ companyVerify }}</span>
                </div>
                <p style="color: #cdcdcd">运维商待验证</p>
              </div>
            </el-col>
            <el-col :span="8">
              <div style="
                  height: 100px;
                  background: white;
                  text-align: center;
                  padding-top: 20px;
                ">
                <div>
                  <span style="color: #000; font-size: 24px">{{ companyCheck }}</span>
                </div>
                <p style="color: #cdcdcd">运维商待审核</p>
              </div>
            </el-col>
            <el-col :span="8">
              <div style="
                  height: 100px;
                  background: white;
                  border-top-right-radius: 6px;
                  border-bottom-right-radius: 6px;
                  text-align: center;
                  padding-top: 20px;
                ">
                <div>
                  <span style="color: #000; font-size: 24px">{{ userWaitSign }}</span>
                </div>
                <p style="color: #cdcdcd">运维人员待签约</p>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="8" style="height: 220px; background: #deeaf6; border-radius: 6px">
          <el-row :gutter="20" style="padding-top: 48px; text-align: center; line-height: 45px">
            <el-col :span="11" style="
                background: #fff;
                height: 45px;
                border-radius: 6px;
                margin-right: 10px;
                margin-left: 10px;
                margin-bottom: 35px;
              ">
              <router-link to="/order/orderCreate">发布工单</router-link>
            </el-col>
            <el-col :span="11" style="
                background: #fff;
                height: 45px;
                border-radius: 6px;
                margin-left: 10px;
                margin-bottom: 35px;
              ">导入设备资源</el-col>
            <el-col :span="11" style="
                background: #fff;
                height: 45px;
                border-radius: 6px;
                margin-right: 10px;
                margin-left: 10px;
              ">
              <router-link to="/isp/ispCreate">新建运营商</router-link>
            </el-col>
            <el-col :span="11" style="
                background: #fff;
                height: 45px;
                border-radius: 6px;
                margin-left: 10px;
              ">
              <router-link to="/omp/ompCreate">新建运维人员</router-link>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="16" style="margin-top: -100px">
          <div style="height: 100px">
            <el-row :gutter="20">
              <el-col :span="8">
                <div style="
                    height: 100px;
                    background: white;
                    border-radius: 6px;
                    text-align: center;
                    padding-top: 20px;
                  ">
                  <div>
                    <span style="color: #000; font-size: 24px">{{ workWaitOrder }}</span>
                  </div>
                  <p style="color: #cdcdcd">待确认工单</p>
                </div>
              </el-col>
              <el-col :span="8">
                <div style="
                    height: 100px;
                    background: white;
                    border-radius: 6px;
                    text-align: center;
                    padding-top: 20px;
                  ">
                  <div>
                    <span style="color: #000; font-size: 24px">{{ payWaitOrder }}</span>
                  </div>
                  <p style="color: #cdcdcd">待支付工单</p>
                </div>
              </el-col>
              <el-col :span="8">
                <div style="
                    height: 100px;
                    background: white;
                    border-radius: 6px;
                    text-align: center;
                    padding-top: 20px;
                  ">
                  <div>
                    <span style="color: #000; font-size: 24px">{{ exceptionOrder }}</span>
                  </div>
                  <p style="color: #cdcdcd">异常工单</p>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
      <!-- 交易部分 -->
      <el-row :gutter="30" style="margin-top: 20px">
        <el-col :span="6">
          <div style="height: 210px; background: white; padding: 18px">
            <p style="display: flex; justify-content: space-between">
              <span>今日交易额</span>
              <span class="el-icon-info"></span>
            </p>
            <h2 style="font-size: 33px; font-weight: 400">{{ todayMoney }}</h2>
            <p>
              周同比
              <i class="el-icon-caret-top" style="color: greenyellow"></i> {{ yearOnYearRatio }}%
              <span style="margin-left: 10px"></span> 日环比
              <i class="el-icon-caret-bottom" style="color: red"></i> {{ dailyCycleRatio }} %
            </p>
            <p style="border-top: 1px solid #f2f2f2; padding-top: 4px">
              日均交易额 ￥ {{ dayAverage }}
            </p>
          </div>
        </el-col>
        <el-col :span="6">
          <div style="height: 210px; background: white; padding: 18px">
            <p style="display: flex; justify-content: space-between">
              <span>今日工单量</span>
              <span class="el-icon-info"></span>
            </p>
            <h2 style="font-size: 33px; font-weight: 400">{{ workOrderNum }}</h2>
            <div ref="myDiv" style="height: 16px"></div>
            <p style="border-top: 1px solid #f2f2f2; padding-top: 4px">
              日均工单量 {{ workOrderAverage }}
            </p>
          </div>
        </el-col>
        <el-col :span="6">
          <div style="height: 210px; background: white; padding: 18px">
            <p style="display: flex; justify-content: space-between">
              <span>已支付工单量</span>
              <span class="el-icon-info"></span>
            </p>
            <h2 style="font-size: 33px; font-weight: 400">{{ alreadyPayWorkOrderNum }}</h2>
            <div ref="myDiv1" style="height: 16px"></div>
            <p style="border-top: 1px solid #f2f2f2; padding-top: 4px">
              支付率 {{ payOdds }} %
            </p>
          </div>
        </el-col>
        <el-col :span="6">
          <div style="height: 210px; background: white; padding: 18px">
            <p style="display: flex; justify-content: space-between">
              <span>当前主动接单人员</span>
              <span class="el-icon-info"></span>
            </p>
            <h2 style="font-size: 33px; font-weight: 400">{{ initiativeTakeOrderUserNum }}</h2>
            <div ref="myDiv2" style="height: 16px"></div>
            <p style="border-top: 1px solid #f2f2f2; padding-top: 4px">
              全部运维人员 {{ userCount }}
            </p>
          </div>
        </el-col>
      </el-row>
      <!-- 交易额部分 -->
      <div style='position: relative;'>
        <el-tabs style="
          margin-top: 20px;
          position: relative;
          background-color: #fff;
          padding: 14px 20px;
        " v-model="activeName">
          <el-tab-pane label="交易额" name="first">
            <div style="height: 400px; background: white; width: 900px" ref="trans"></div>
            <div style="
              position: absolute;
              top: 0px;
              right: 0;
              width: 20%;
              padding-left: 12px;
              background: white;
              height: 400px;
              min-width: 200px;
            ">
              <h3>通信企业交易额排名</h3>
              <p v-for="(item, index) in companyInfoList" :key="index">
                <span style="
                  margin-right: 14px;
                  width: 16px;
                  height: 16px;
                  background: #000;
                  display: inline-block;
                  border-radius: 50%;
                  color: #fff;
                  text-align: center;
                  line-height: 16px;
                ">{{ index+ 1 }}</span><span>{{ item.companyName | ellipsis }}</span><span
                  style="float: right; margin-right: 20px">{{ item.sumMoney }}</span>
              </p>
            </div>
          </el-tab-pane>
          <el-tab-pane label="工单量" name="second" tab-position="right">
            <div style="height: 400px; background: white; width: 900px" ref="orders"></div>
            <div style="
              position: absolute;
              top: 0px;
              right: 0;
              width: 20%;
              padding-left: 12px;
              background: white;
              height: 400px;
            ">
              <h3>运营商工单量排名</h3>
              <p v-for="(item, index) in companyInfoList" :key="index">
                <span style="
                  margin-right: 14px;
                  width: 16px;
                  height: 16px;
                  background: #000;
                  display: inline-block;
                  border-radius: 50%;
                  color: #fff;
                  text-align: center;
                  line-height: 16px;
                ">{{ index+ 1 }}</span><span>{{ item.companyName | ellipsis }}</span><span
                  style="float: right; margin-right: 20px">{{ item.sumMoney }}</span>
              </p>
            </div>
          </el-tab-pane>
        </el-tabs>
        <div style="position: absolute;right:20px;top:5px;
    color: #e6a23c;
    font-weight: 600;
    font-size: 14px;" class="choosespan">
          <span @click="todayord">今日</span><span @click="weekord">本周</span><span @click="monthord">本月</span><span
            @click="yearord">全年</span>
          <el-date-picker v-model="valuedata" type="daterange" range-separator="~" start-placeholder="开始日期"
            end-placeholder="结束日期" @change="blurrr">
          </el-date-picker>
        </div>
      </div>

      <!-- 交易类别 -->

      <el-row :gutter="30">
        <el-col :span="12">
          <div style="height: 350px; background: #fff; position: relative">
            <h2 style="
                border-bottom: 3px solid #f2f2f2;
                height: 50px;
                line-height: 50px;
                padding-left: 20px;
              ">
              交易额类别占比
            </h2>
            <div style="height: 300px; width: 50%; position: relative" ref="transleft"></div>
            <div style="position: absolute; top: 180px; right: 48px">
              <p v-for="(item, index) in dealMoneyTypeRatioList" :key="index"
                v-if="item.workOrderTypeName ? true : false">
                <span style="
                    display: inline-block;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    margin-right: 6px;
                  "
                  :class="item.workOrderTypeName == '发电' ? 'classa' : item.workOrderTypeName == '巡检' ? 'classb' : 'classc'"></span>
                <span style="padding-right: 8px; border-right: 2px solid #f2f2f2">{{ item.workOrderTypeName }}</span>
                <span style="margin-right: 68px; margin-left: 69px; color: #929292">{{ item.moneyRate }}</span>
                <span>￥{{ item.money }}</span>
              </p>
            </div>
            <div style="
                position: absolute;
                top: 180px;
                left: 19%;
                text-align: center;
              ">
              <p>交易额</p>
              <h2>￥{{ jyecount }}</h2>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div style="height: 350px; background: #fff; position: relative">
            <h2 style="
                border-bottom: 3px solid #f2f2f2;
                height: 50px;
                line-height: 50px;
                padding-left: 20px;
              ">
              工单量类别占比
            </h2>
            <div style="height: 300px; width: 50%" ref="transright"></div>
            <div style="position: absolute; top: 180px; right: 48px">
              <p v-for="(item, index) in dealMoneyTypeRatioList" :key="index"
                v-if="item.workOrderTypeName ? true : false">
                <span style="
                    display: inline-block;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    margin-right: 6px;
                  "
                  :class="item.workOrderTypeName == '发电' ? 'classa' : item.workOrderTypeName == '巡检' ? 'classb' : 'classc'"></span>

                <span style="padding-right: 8px; border-right: 2px solid #f2f2f2">{{ item.workOrderTypeName }}</span>
                <span style="margin-right: 68px; margin-left: 69px; color: #929292">{{ item.orderRate }}</span>
                <span>{{ item.orders }}</span>
              </p>
            </div>
            <div style="
                position: absolute;
                top: 180px;
                left: 21%;
                text-align: center;
              ">
              <p>工单量</p>
              <h2>{{ gdlcount }}</h2>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-scrollbar>
  </div>
</template>
<script>
import * as echarts from "echarts";
import { homemsg, andorder } from '@/api/home';
export default {
  data() {
    return {
      dealMoneyTypeRatioList: [],
      jyecount: 0,
      gdlcount: 0,
      valuedata: '',
      activeName: "first",
      alreadyPayWorkOrderNum: 0,
      companyCheck: 0,
      companyVerify: 0,
      dailyCycleRatio: 0,
      dayAverage: 0,
      exceptionOrder: 0,
      initiativeTakeOrderUserNum: 0,
      payOdds: 0,
      payWaitOrder: 0,
      todayMoney: 0,
      userCount: 0,
      userOfflineTrain: 0,
      userPracticalOperation: 0,
      userTheoryExam: 0,
      userWaitSign: 0,
      workOrderAverage: 0,
      workOrderNum: 0,
      workWaitOrder: 0,
      yearOnYearRatio: 0,
      // 运营商交易额
      companyInfoList: [],
      jiaoyie: [],
      gdl: [],
      jye: ["0时", "1时", "2时", "3时", "4时", "5时", "6时", "7时", "8时", "9时", "10时", "11时", "12时", "13时", "14时", "15时", "16时", "17时", "18时", "19时", "20时", "21时", "22时", "23时"],
    };
  },
  mounted() {
    this.homemsg()
    this.andorder({ sign: 1 })
    document.getElementsByClassName('el-range__close-icon')[0].className += ' el-icon-date'; //在原来的后面加这个
    const myChart = echarts.init(this.$refs.myDiv); // 得到图表实例
    const myChart1 = echarts.init(this.$refs.myDiv1); // 得到图表实例
    const myChart2 = echarts.init(this.$refs.myDiv2); // 得到图表实例
    const trans = echarts.init(this.$refs.trans); // 得到图表实例
    const orders = echarts.init(this.$refs.orders); // 得到图表实例
    const transleft = echarts.init(this.$refs.transleft); // 得到图表实例
    const transright = echarts.init(this.$refs.transright); // 得到图表实例
    myChart.setOption({
      xAxis: {
        type: "category",
        boundaryGap: false, //设置x轴两边的留白
        axisTick: {
          //x轴刻度尺
          show: false,
        },
        axisLine: {
          //x轴线条颜色
          lineStyle: {
            color: "#999",
          },
        },
      },
      yAxis: {
        axisTick: {
          //x轴刻度尺
          show: false,
        },
        show: false,
        type: "value",
        max: 100, //最大刻度值
        interval: 10, //刻度值间隔值
        splitLine: {
          //网格线
          show: false, //关闭网格线

          lineStyle: {
            type: "dashed", //设置网格线类型 dotted：虚线   solid:实线
            color: "#000", //网格线颜色
          },
        },
        axisLine: {
          //y轴线条颜色
          show: true,
          lineStyle: {
            color: "#999",
          },
        },
      },
      series: [
        {
          data: [41, 44, 48, 43, 42, 45, 40],
          type: "line",
          smooth: true, //面积图改成弧形状
          lineStyle: {
            width: 0, //外边线宽度
            color: "red", //外边线颜色
          },
          showSymbol: false, //去除面积图节点圆
          areaStyle: {
            //区域填充渐变颜色
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "rgba(237,66,100, 0.5)", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "rgba(234,174,10, 1)", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
        },
      ],
    });
    myChart1.setOption({
      xAxis: {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      yAxis: {
        show: false,
        type: "value",
      },
      splitLine: {
        show: false,
      },
      series: [
        {
          data: [90, 200, 100, 90, 110, 100, 90],
          type: "bar",
        },
      ],
    });
    myChart2.setOption({
      xAxis: {
        type: "category",
        boundaryGap: false, //设置x轴两边的留白
        axisTick: {
          //x轴刻度尺
          show: false,
        },
        axisLine: {
          //x轴线条颜色
          lineStyle: {
            color: "#999",
          },
        },
      },
      yAxis: {
        axisTick: {
          //x轴刻度尺
          show: false,
        },
        show: false,
        type: "value",
        max: 100, //最大刻度值
        interval: 10, //刻度值间隔值
        splitLine: {
          //网格线
          show: false, //关闭网格线

          lineStyle: {
            type: "dashed", //设置网格线类型 dotted：虚线   solid:实线
            color: "#000", //网格线颜色
          },
        },
        axisLine: {
          //y轴线条颜色
          show: true,
          lineStyle: {
            color: "#999",
          },
        },
      },
      series: [
        {
          data: [41, 44, 48, 53, 52, 42, 40],
          type: "line",
          smooth: true, //面积图改成弧形状
          lineStyle: {
            width: 0, //外边线宽度
            color: "red", //外边线颜色
          },
          showSymbol: false, //去除面积图节点圆
          areaStyle: {
            //区域填充渐变颜色
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "rgba(237,66,100, 0.5)", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "rgba(234,174,10, 1)", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
        },
      ],
    });
    trans.setOption({
      xAxis: {
        type: "category",
        data: this.jye
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: this.jiaoyie,
          type: "bar",
        },
      ],
    });
    orders.setOption({
      xAxis: {
        type: "category",
        data: this.jye
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: this.gdl,
          type: "bar",
        },
      ],
    });

    transleft.setOption({
      tooltip: {
        trigger: "item",
      },
      legend: {
        top: "5%",
        left: "center",
      },
      series: [
        {
          // name: "Access From",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: "20",
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: true,
          },
          data: [{ value: 148 }, { value: 222 }, { value: 48 }],
        },
      ],
    });
    transright.setOption({
      tooltip: {
        trigger: "item",
      },
      legend: {
        top: "5%",
        left: "center",
      },
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: "40",
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: [{ value: 148 }, { value: 222 }, { value: 48 }],
        },
      ],
    });
  },
  filters: {
    ellipsis(value) {
      if (!value) return '';
      if (value.length > 5) {
        return value.slice(0, 5) + '...'
      }
      return value
    },
    moment(date) {
      return moment(date).format('YYYY-DD-MM HH:MM:SS');
    }
  },
  methods: {
    changdetb(data) {
      this.dealMoneyTypeRatioList = data.dealMoneyTypeRatioList
      const count = this.dealMoneyTypeRatioList[2].money ? this.dealMoneyTypeRatioList[2].money : 0
      this.jyecount = this.dealMoneyTypeRatioList[0].money + this.dealMoneyTypeRatioList[1].money + count
      this.gdlcount = this.dealMoneyTypeRatioList[0].orders + this.dealMoneyTypeRatioList[1].orders + count
      const transleft = echarts.init(this.$refs.transleft);
      transleft.setOption({
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "5%",
          left: "center",
        },
        series: [
          {
            // name: "Access From",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "20",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: true,
            },
            data: [{ value: this.dealMoneyTypeRatioList[0].money }, { value: this.dealMoneyTypeRatioList[1].money }, { value: this.dealMoneyTypeRatioList[2].money }],
          },
        ],
      });
      const transright = echarts.init(this.$refs.transright); // 得到图表实例
      transright.setOption({
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "5%",
          left: "center",
        },
        series: [
          {
            name: "Access From",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "40",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: [{ value: this.dealMoneyTypeRatioList[0].orders }, { value: this.dealMoneyTypeRatioList[1].orders }, { value: this.dealMoneyTypeRatioList[2].orders }],
          },
        ],
      });

    },
    async blurrr() {
      console.log(11);
      // console.log(this.valuedata);
      const startTime = this.$moment(this.valuedata[0]).format('YYYY-MM-DD HH:MM:SS')
      const endTime = this.$moment(this.valuedata[1]).format('YYYY-MM-DD HH:MM:SS')
      const { data } = await andorder({ startTime, endTime })
      // console.log(data);
      this.changdetb(data)

    },
    async homemsg() {

      const data = await homemsg({
        startTime: this.showWeekFirstDay()
      })
      console.log(data);
      this.alreadyPayWorkOrderNum = data.data.alreadyPayWorkOrderNum
      this.companyCheck = data.data.companyCheck
      this.companyVerify = data.data.companyVerify
      this.dailyCycleRatio = data.data.dailyCycleRatio
      this.dayAverage = data.data.dayAverage
      this.exceptionOrder = data.data.exceptionOrder
      this.initiativeTakeOrderUserNum = data.data.initiativeTakeOrderUserNum
      this.payOdds = data.data.payOdds
      this.payWaitOrder = data.data.payWaitOrder
      this.todayMoney = data.data.todayMoney
      this.userCount = data.data.userCount
      this.userOfflineTrain = data.data.userOfflineTrain
      this.userPracticalOperation = data.data.userPracticalOperation
      this.userTheoryExam = data.data.userTheoryExam
      this.userWaitSign = data.data.userWaitSign
      this.workOrderAverage = data.data.workOrderAverage
      this.workOrderNum = data.data.workOrderNum
      this.workWaitOrder = data.data.workWaitOrder
      this.yearOnYearRatio = data.data.yearOnYearRatio
    },
    showWeekFirstDay: function () {
      let Nowdate = new Date();
      let WeekFirstDay = new Date(Nowdate - (Nowdate.getDay() - 1) * 86400000);
      let M = Number(WeekFirstDay.getMonth()) + 1;
      if (M < 10) {
        M = "0" + M;
      }
      let D = WeekFirstDay.getDate();
      if (D < 10) {
        D = "0" + D;
      }
      return WeekFirstDay.getFullYear() + "-" + M + "-" + D;
      // console.log(WeekFirstDay.getFullYear() + "-" + M + "-" + D);
    },
    async andorder(datas) {
      const { data } = await andorder(datas)
      this.companyInfoList = data.companyInfoList
      this.companyInfoList.sort(function (a, b) {
        return a.sumMoney - b.sumMoney
      })
      this.jiaoyie = data.money
      this.gdl = data.order
      console.log(this.gdl);
      const orders = echarts.init(this.$refs.orders); // 得到图表实例
      orders.setOption({
        xAxis: {
          type: "category",
          data: this.jye
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: this.gdl,
            type: "bar",
          },
        ],
      });

    },
    async todayord() {
      const { data } = await andorder({ sign: 1 })
      this.companyInfoList = data.companyInfoList
      this.jye = ["0时", "1时", "2时", "3时", "4时", "5时", "6时", "7时", "8时", "9时", "10时", "11时", "12时", "13时", "14时", "15时", "16时", "17时", "18时", "19时", "20时", "21时", "22时", "23时"]
      console.log(this.jye);
      this.jiaoyie = data.money
      if (this.activeName == "first") {
        const trans = echarts.init(this.$refs.trans); // 得到图表实例
        trans.setOption({
          xAxis: {
            type: "category",
            data: this.jye
          },
          yAxis: {
            type: "value",
          },
          series: [
            {
              data: this.jiaoyie,
              type: "bar",
            },
          ],
        });

      } else {
        this.gdl = data.order
        console.log(this.gdl);
        const orders = echarts.init(this.$refs.orders); // 得到图表实例
        orders.setOption({
          xAxis: {
            type: "category",
            data: this.jye
          },
          yAxis: {
            type: "value",
          },
          series: [
            {
              data: this.gdl,
              type: "bar",
            },
          ],
        });
      }
      this.changdetb(data)

    },
    async weekord() {
      const { data } = await andorder({ sign: 2 })
      this.companyInfoList = data.companyInfoList
      this.jye = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
      console.log(this.jye);
      this.jiaoyie = data.money
      console.log(data);
      const trans = echarts.init(this.$refs.trans); // 得到图表实例
      trans.setOption({
        xAxis: {
          type: "category",
          data: this.jye
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: this.jiaoyie,
            type: "bar",
          },
        ],
      });
      this.gdl = data.order
      console.log(this.gdl);
      const orders = echarts.init(this.$refs.orders); // 得到图表实例
      orders.setOption({
        xAxis: {
          type: "category",
          data: this.jye
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: this.gdl,
            type: "bar",
          },
        ],
      });
    },
    async monthord() {
      const { data } = await andorder({ sign: "3" })
      this.companyInfoList = data.companyInfoList
      this.jye = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']
      this.jiaoyie = data.money
      if (this.activeName == "first") {
        const trans = echarts.init(this.$refs.trans); // 得到图表实例
        trans.setOption({
          xAxis: {
            type: "category",
            data: this.jye
          },
          yAxis: {
            type: "value",
          },
          series: [
            {
              data: this.jiaoyie,
              type: "bar",
            },
          ],
        });

      } else {
        this.gdl = data.order
        console.log(this.gdl);
        const orders = echarts.init(this.$refs.orders); // 得到图表实例
        orders.setOption({
          xAxis: {
            type: "category",
            data: this.jye
          },
          yAxis: {
            type: "value",
          },
          series: [
            {
              data: this.gdl,
              type: "bar",
            },
          ],
        });
      }
      this.changdetb(data)

    },
    async yearord() {
      const { data } = await andorder({ sign: 4 })
      this.companyInfoList = data.companyInfoList
      this.jye = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
      this.jiaoyie = data.money
      if (this.activeName == "first") {
        const trans = echarts.init(this.$refs.trans); // 得到图表实例
        trans.setOption({
          xAxis: {
            type: "category",
            data: this.jye
          },
          yAxis: {
            type: "value",
          },
          series: [
            {
              data: this.jiaoyie,
              type: "bar",
            },
          ],
        });

      } else {
        this.gdl = data.order
        console.log(this.gdl);
        const orders = echarts.init(this.$refs.orders); // 得到图表实例
        orders.setOption({
          xAxis: {
            type: "category",
            data: this.jye
          },
          yAxis: {
            type: "value",
          },
          series: [
            {
              data: this.gdl,
              type: "bar",
            },
          ],
        });
      }
      this.changdetb(data)
    }
  },
};
</script>
<style lang="scss" scoped >
@import "~@/styles/home.scss";

.contain {
  height: 200px;
  background: #fff;
  margin: -20px -19px 0px;
  padding-top: 45px;
}

.cl {
  float: left;
  display: flex;
  margin-left: 20px;
}

.cr {
  float: right;
  margin-right: 16px;
  display: flex;
}

// 穿刺写法
::v-deep .el-range__icon {
  display: none;
}

.choosespan>span {
  margin-right: 20px
}

.classa {
  background: #61a0a8
}

.classb {
  background: #c23531
}

.classc {
  background: #2f4554
}
 ::v-deep.min {
  min-width:80%;
}
</style>
