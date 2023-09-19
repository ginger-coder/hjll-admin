<template>
  <div class="tabs-wrapper">
    <div class="tool">
      <span v-for="t in date.label" :class="[date.select === t ? 'selected':'']" @click="()=>clickDate(t)">{{
          t
        }}</span>
      <el-date-picker
          v-model="date.value"
          type="daterange"
          @change="changeDate"
      />
    </div>

    <el-tabs v-model="activeName" class="tabs" @tab-click="changeTab">
      <el-tab-pane label="交易额" name="1" :lazy="true">
        <div class="pane">
          <div class="l">
            <div class="title">交易额趋势</div>
            <keep-alive>
              <div class="bar" ref="bar"></div>
            </keep-alive>
          </div>
          <div class="r">

            <div class="title">运营商交易名额</div>
            <div class="list">
              <el-scrollbar wrap-class="list-scrollbar">
                <div class="list-cell" v-for="(item,i) in companyInfoList">
                  <div :class="['dot', i <= 2 ? 'gradient' : '']">{{ i + 1 }}</div>
                  <span class="mg">{{ item.companyName }}</span>
                  <span class="last">{{ Intl.NumberFormat('en-US').format(item.sumMoney) }}</span>
                </div>
              </el-scrollbar>

            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="工单量" name="2" :lazy="true">
        <div class="pane">
          <div class="l">
            <div class="title">工单量趋势</div>
            <keep-alive>
              <div class="bar" ref="bar1"></div>
            </keep-alive>
          </div>
          <div class="r">
            <div class="title">运营商工单量排名</div>
            <div class="list">
              <div class="list-cell" v-for="(item,i) in companyInfoS">
                <div :class="['dot', i <= 2 ? 'gradient' : '']">{{ i + 1 }}</div>
                <span class="mg">{{ item.companyName }}</span>
<!--                <span class="last">{{ Intl.NumberFormat('en-US').format(item.sumMoney) }}</span>-->
                <span class="last">{{ item.orders || 0 }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {option as barOp} from "@/components/bar";
import * as echarts from 'echarts';
import request from "@/api/request";
import moment from 'moment'

export default {
  name: "HomeTradeBox",
  components: {},
  props: {},
  data() {
    return {
      bar: null,
      activeName: '1',
      date: {
        label: ['今日', '本周', '本月', '全年'],
        value: [],
        select: ''
      },
      companyInfoList: [],
      companyInfoS: [],
      money: [],
      order: [],
      dates: [],
      pieData: []
    };
  },
  mounted() {
    const d = moment(new Date()).format('YYYY-MM-DD')
    this.date.value = [d, d]
    this.changeTab({name: '1'})
    this.clickDate('本月')

    window.addEventListener("resize", () => {
      this.bar && this.bar.resize();
    })
  },
  methods: {
    async fetchData(sign) {
      const res = await request({
        url: "admin/home/moneyAndOrder?sign=" + sign,
        method: "get"
      });
      if (res && res.code ==  0) {
        const {dates, money, order, companyInfoList, companyInfoS, dealMoneyTypeRatioList} = res.data;
        this.companyInfoList = companyInfoList
        this.companyInfoS = companyInfoS
        this.money = money
        this.order = order
        this.dates = dates
        const defaults = ['巡检', '发电', '故障'].map(n => {
          return {workOrderTypeName: n, orders: 0, money: 0}
        })
        this.pieData = (dealMoneyTypeRatioList.length === 0 ? defaults : dealMoneyTypeRatioList).map((item, i) => {
          return {
            ...item,
            name: item.workOrderTypeName,
            order: item.orders,
            money: item.money,
            label: {
              show: true,
              position: 'outside',
              padding: [0, -13, 0, -13],
              formatter: '{d}%',
              color: ['#4F6CD8', '#3CA8E2', '#5EE7F3'][i]
            }
          }
        })
      }
    },
    changeTab(e) {
      this.$nextTick(() => {
        this.bar = echarts.init(e.name === '1' ? this.$refs.bar : this.$refs.bar1);
        if (this.bar) {
          barOp.series[0].data = this.activeName === '1' ? this.money : this.order;
          this.bar.setOption(barOp);
          this.bar.resize()
        }
      })
    },
    async clickDate(t) {
      if (this.date.select === t) {
        return;
      } else {
        this.date.select = t;
      }

      let sign = -99;
      if (t === '本周') {
        sign = 2;
        // barOp.xAxis.data = this.getWeek();
      } else if (t === '本月') {
        sign = 3;
        // barOp.xAxis.data = this.getMonth();
        barOp.dataZoom = [{
          type: 'inside',
          disabled: false,
          start: 0,
          end: 30
        }]
      } else if (t === '全年') {
        sign = 4;
        // barOp.xAxis.data = this.getYear();
      } else {
        sign = 1;
        // barOp.xAxis.data = this.getDay();
      }

      if (t !== '本月') {
        barOp.dataZoom = [{
          type: 'inside',
          disabled: true,
          start: 0,
          end: 100
        }]
      }

      if (sign < 0) {
        return;
      }

      await this.fetchData(sign);

      barOp.xAxis.data = this.dates;
      barOp.series[0].data = this.activeName === '1' ? this.money : this.order;

      if (this.bar) {
        this.bar.setOption(barOp);
        this.$emit('pie-data', this.pieData);
      }
    },
    async changeDate(arr) {
      this.date.select = '';
      const [s, e] = arr.map(d => moment(d).format('YYYY-MM-DD'));
      const res = await request({
        url: `admin/home/moneyAndOrder?startTime=${s}&endTime=${e}`,
        method: "get"
      });
      if (res && res.code ==  0) {
        const {dates, money, order, companyInfoList, companyInfoS, dealMoneyTypeRatioList} = res.data;

        this.companyInfoList = companyInfoList
        this.companyInfoS = companyInfoS
        this.money = money
        this.order = order
        this.dates = dates
        this.pieData = dealMoneyTypeRatioList.map((item, i) => {
          return {
            ...item,
            name: item.workOrderTypeName,
            order: item.orders,
            money: item.money,
            label: {
              show: true,
              position: 'outside',
              padding: [0, -13, 0, -13],
              formatter: '{d}%',
              color: ['#4F6CD8', '#3CA8E2', '#5EE7F3'][i]
            }
          }
        });


        console.log(this.pieData, ' this.pieData');
      }

      barOp.xAxis.data = this.dates;
      barOp.series[0].data = this.activeName === '1' ? this.money : this.order;
      if (this.dates.length > 9) {
        barOp.dataZoom = [{
          type: 'inside',
          disabled: false,
          start: 0,
          end: (8 / this.dates.length) * 100
        }]
      } else {
        barOp.dataZoom = [{
          type: 'inside',
          disabled: true,
          start: 0,
          end: 100
        }]
      }

      if (this.bar) {
        this.bar.setOption(barOp);
        console.warn(this.pieData,)
        this.$emit('pie-data', this.pieData);
      }
    },
    getDay() {
      return new Array(12)
          .fill(0)
          .map((_, i) => i * 2)
          .map(i => (i < 10 ? '0' + i : i) + ':00')
    },
    getWeek() {
      return ['一', '二', '三', '四', '五', '六', '日'].map(t => '星期' + t)

      // const now = new Date();
      // const [y, m, d, w] = [now.getFullYear(), now.getMonth(), now.getDate(), now.getDay()]
      // new Array(7)
      //     .fill(0)
      // .map((_, i) => filterTime(new Date(y, m, d - w + i + 1), 'MM-DD'))
    },
    getMonth() {
      const now = new Date();
      const [s, e] = [new Date(now.getFullYear(), now.getMonth(), 1), new Date(now.getFullYear(), now.getMonth() + 1, 0)]
      const d = (e.getTime() - s.getTime()) / (86400 * 1000);

      return new Array(d > 28 ? 5 : 4).fill(0).map((_, i) => {
        return '第' + (i + 1) + '周'
      })
      // return new Array((e.getTime() - s.getTime()) / (86400 * 1000))
      //     .fill(0)
      //     .map((_, i) => i + 1)
      //     .map(i => (now.getMonth() + 1) + '-' + (i < 10 ? '0' + i : i))
    },
    getYear() {
      return new Array(12)
          .fill(0)
          .map((_, i) => (i + 1) + '月')
    }
  },
}
</script>

<style scoped lang="scss">
.list-scrollbar {
  overflow: auto;
}
.tabs-wrapper {
  background-color: #FFFFFF;
  border-radius: 8px;
  padding: 8px 24px;
  position: relative;

  .tool {
    position: absolute;
    right: 24px;
    top: 8px;
    height: 36px;
    z-index: 99;
    display: flex;
    align-items: center;

    span {
      display: block;
      margin-right: 24px;
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.65);

      &:hover {
        cursor: pointer;
      }
    }

    .selected {
      color: #5674E5;
    }
  }

  .pane {
    display: flex;

    .title {
      margin: 24px 0;
      font-size: 14px;

      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
    }

    .l {
      width: 65%;

      .bar {
        width: 100%;
        height: 300px;
      }
    }

    .r {
      flex: 1;

      .list {
        height: 300px;
        //overflow-y: scroll;
        //overflow-x: hidden;
        overflow: hidden;
        &-cell {
          display: flex;
          height: 22px;
          align-items: center;
          margin-bottom: 15px;
          padding-right: 15px;

          .dot {
            width: 20px;
            height: 20px;
            border-radius: 20px;
            background: #F0F2F5;
            color: rgba(0, 0, 0, 0.65);
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .gradient {
            color: #FFFFFF;
            background: linear-gradient(180deg, #8CA4FD 0%, #4F6CD8 100%);
          }

          .mg {
            margin-right: 34px;
            margin-left: 24px;
            width: max-content;
            flex: 1;
          }

          .last {
            width: max-content;
          }
        }


        span {
          display: block;
          font-size: 14px;
          color: rgba(0, 0, 0, 0.65);
        }
      }
    }
  }
}
</style>
