<template>
  <div>
    <div class="statistic">
      <div v-for="(item,i) in page.statistic.config" class="statistic-cell">
        <div class="head">
          <div class="l">
            <img :src="item.icon" alt=""/>
            <span>{{ item.label }}</span>
          </div>
          <div class="r">
            <img :src="item.suffix" alt=""/>
          </div>
        </div>
        <div class="body">
          <span v-if="i === 0">¥</span>
          <span>{{ Intl.NumberFormat('en-US').format(page.statistic.value[i]) }}</span>
        </div>
        <div v-if="i < 2">
          <div class="progress">
            <el-popover
                placement="top"
                trigger="hover"
                popper-class="progress-pop"
            >
              <template #reference>
                <div :class="[page.statistic.value2[i] > 0 ? 'blue' : 'red']"
                     :style="{width: `${Math.abs(page.statistic.value2[i]) * 1.1}px`,transform: `translateX(${(page.statistic.value2[i] > 0 ? 110 : 110 - Math.abs(page.statistic.value2[i]) * 1.1)}px)`}">
                </div>
              </template>
              <span>{{ Math.abs(page.statistic.value2[i]) }}%</span>
              <span v-if="page.statistic.value2[i] > 0" class="triangle"></span>
              <span v-else class="triangle-down"></span>
            </el-popover>
          </div>
        </div>
        <div v-else :class="[`color${i}`]">
          <el-progress :percentage="page.statistic.value1[i]" :show-text="false"></el-progress>
        </div>
        <div class="bottom">
          <div>
            <span>{{ item.detail }}</span>
          </div>
          <div>
            <span v-if="i === 0">¥</span>
            <span>{{ Intl.NumberFormat('en-US').format(page.statistic.value1[i]) }}</span>
            <span v-if="i === 2">%</span>
          </div>
        </div>
      </div>
    </div>
    <div class="line">
      <div class="card">
        <div class="h">
          <span class="title">交易额类别占比</span>
          <div class="tool">
             <span v-for="t in page.date.label" :class="[ page.date.select === t ? 'selected':'']"
                   @click="()=>clickDate(t)">
               {{ t }}
             </span>
            <el-date-picker
                v-model="page.date.value"
                type="daterange"
                @change="changeDate"
            />
          </div>
        </div>
        <div id="line" ref="line"></div>
      </div>
    </div>
    <home-trade-box @pie-data="handlePie"></home-trade-box>
    <div class="pie">
      <div class="card">
        <div class="h">
          <span class="title">交易额类别占比</span>
          <img src="../../assets/home/info.png" alt=""/>
        </div>
        <div class="hr"></div>
        <div id="pie1" ref="pie1"></div>
      </div>
      <div class="card">
        <div class="h">
          <span class="title">工单量类别占比</span>
          <img src="../../assets/home/info.png" alt=""/>
        </div>
        <div class="hr"></div>
        <div id="pie2" ref="pie2"></div>
      </div>
    </div>
  </div>
</template>
<script>
import * as echarts from "echarts";
import {option, option as pieOp} from "@/views/home/pie";
import {option as lineOp} from "@/views/addcount/line";
import HomeTradeBox from "@/components/HomeTradeBox";
import request from "@/api/request";
import moment from 'moment'

export default {
  components: {HomeTradeBox},
  data() {
    return {
      page: {
        statistic: {
          config: [
            {
              label: '今日交易额',
              icon: require('@/assets/home/statis1.png'),
              suffix: require('@/assets/home/info.png'),
              value1: 12345,
              pct: undefined,
              detail: '日均交易额'
            }, {
              label: '今日工单量',
              icon: require('@/assets/home/statis2.png'),
              suffix: require('@/assets/home/info.png'),
              value1: 1234,
              pct: 50,
              detail: '日均工单量'
            }, {
              label: '已支付工单量',
              icon: require('@/assets/home/statis3.png'),
              suffix: require('@/assets/home/info.png'),
              value1: 60,
              pct: 50,
              detail: '支付率'
            }, {
              label: '当前主动接单人员',
              icon: require('@/assets/home/statis4.png'),
              suffix: require('@/assets/home/info.png'),
              pct: 50,
              value1: 1234,
              detail: '全部运维人员'
            }],
          value: [0, 0, 0, 0],
          value1: [0, 0, 0, 0],
          value2: [0, 0]
        },
        date: {
          label: ['今日', '本周', '本月', '全年'],
          value: [],
          select: ''
        },
      },
      line: null,
    }
  },
  mounted() {
    const parent = document.getElementsByClassName('app-main')[0];
    if (parent) {
      parent.style.backgroundColor = '#F2F5FA';
    }

    const d = moment(new Date()).format('YYYY-MM-DD')
    this.page.date.value = [d, d]
    this.clickDate('今日')

    this.fetchData();

    const line = echarts.init(this.$refs.line);
    line.setOption(lineOp);
    this.line = line;

    const pie1 = echarts.init(this.$refs.pie1);
    this.pie1 = pie1;
    option.index = 1;
    pie1.setOption(pieOp);
    const pie2 = echarts.init(this.$refs.pie2);
    this.pie2 = pie2;
    option.index = 2;
    pie2.setOption(pieOp);


    window.addEventListener("resize", () => {
      line.resize();
      pie1.resize();
      pie2.resize();
    })
  },
  beforeDestroy() {
    const parent = document.getElementsByClassName('app-main')[0];
    if (parent) {
      parent.style.backgroundColor = '#f2f2f2';
    }
  },
  methods: {
    async fetchData() {
      const res = await request({
        url: "system/home/list",
        method: "get"
      });
      if (res && res.code === 0) {
        const {
          todayMoney, workOrderNum, alreadyPayWorkOrderNum, initiativeTakeOrderUserNum,
          dayAverage, workOrderAverage, payOdds, userCount,
          todayOdds, initiativeUserOdds
        } = res.data;

        this.page.statistic.value = [todayMoney, workOrderNum, alreadyPayWorkOrderNum, initiativeTakeOrderUserNum]
        this.page.statistic.value1 = [dayAverage, workOrderAverage, payOdds, userCount].map(i=>Number.parseFloat(i))
        this.page.statistic.value2 = [todayOdds, initiativeUserOdds]
      }
    },
    async clickDate(t) {
      if (this.page.date.select === t) {
        return;
      } else {
        this.page.date.select = t;
      }

      let sign = -99;
      if (t === '本周') {
        sign = 2;
      } else if (t === '本月') {
        sign = 3;
        lineOp.dataZoom = [{
          type: 'inside',
          disabled: false,
          start: 0,
          end: 30
        }]
      } else if (t === '全年') {
        sign = 4;
      } else {
        sign = 1;
      }

      if (t !== '本月') {
        lineOp.dataZoom = [{
          type: 'inside',
          disabled: true,
          start: 0,
          end: 100
        }]
      }

      if (sign < 0) {
        return;
      }

      await this.getLineData(sign);

      lineOp.xAxis.data = this.dates;
      lineOp.series[0].data = this.money;
      lineOp.series[1].data = this.order;

      if (this.line) {
        this.line.setOption(lineOp);
      }
    },
    async getLineData(sign) {
      const res = await request({
        url: "system/home/moneyAndOrder?sign=" + sign,
        method: "get"
      });
      if (res && res.code === 0) {
        const {dates, money, order, companyInfoList, companyInfoS} = res.data;
        this.companyInfoList = companyInfoList
        this.companyInfoS = companyInfoS
        this.money = money
        this.order = order
        this.dates = dates
      }
    },
    async changeDate(arr) {
      this.page.date.select = '';
      const [s, e] = arr.map(d => moment(d).format('YYYY-MM-DD'));
      const res = await request({
        url: `system/home/moneyAndOrder?startTime=${s}&endTime=${e}`,
        method: "get"
      });
      if (res && res.code === 0) {
        const {dates, money, order, companyInfoList, companyInfoS} = res.data;
        this.companyInfoList = companyInfoList
        this.companyInfoS = companyInfoS
        this.money = money
        this.order = order
        this.dates = dates
      }

      lineOp.xAxis.data = this.dates;
      lineOp.series[0].data = this.money;
      lineOp.series[1].data = this.order;

      if (this.dates.length > 10) {
        lineOp.dataZoom = [{
          type: 'inside',
          disabled: false,
          start: 0,
          end: (10 / this.dates.length) * 100
        }]
      } else {
        lineOp.dataZoom = [{
          type: 'inside',
          disabled: true,
          start: 0,
          end: 100
        }]
      }

      if (this.line) {
        this.line.setOption(lineOp);
      }
    },
    handlePie(data) {
      option.index = 1;
      option.series[0].data = JSON.parse(JSON.stringify(data)).map(item => {
        item.value = item.money;
        return item;
      });
      this.pie1.setOption(option);

      option.index = 2;
      option.series[0].data = JSON.parse(JSON.stringify(data)).map(item => {
        item.value = item.order;
        return item;
      });
      this.pie2.setOption(option);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/styles/home.scss";

.statistic {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(1, 1fr);
  grid-column-gap: 24px;

  .progress {
    width: 220px;
    height: 5px;
    background: #708CF51F;
    border-radius: 3px;

    .red {
      height: 5px;
      border-radius: 3px;
      background: linear-gradient(90deg, #FFD551 0%, #FFAA28 100%);

      &:hover {
        cursor: pointer;
      }
    }

    .blue {
      height: 5px;
      background: linear-gradient(90deg, #5A77E2 0%, #708CF5 100%);
      border-radius: 3px;

      &:hover {
        cursor: pointer;
      }
    }
  }

  &-cell {
    padding: 16px 24px;
    height: 192px;
    background: #FFFFFF;
    border-radius: 8px;

    .head {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .l {
        display: flex;
        align-items: center;

        img {
          width: 32px;
          height: 32px;
          margin-right: 10px;
        }

        span {
          font-size: 14px;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.45);
        }
      }

      .r img {
        width: 14px;
        height: 14px;
      }
    }

    .body {
      margin: 28px 0;
      font-size: 30px;
      color: rgba(0, 0, 0, 0.85);
    }

    .hr {
      height: 7px;
      display: flex;
      align-items: center;

      div {
        width: 100%;
        height: 1px;
        border-top: 1px solid #E8E8E8;
      }
    }

    .bottom {
      display: flex;
      justify-content: space-between;
      margin: 10px 0 0 0;

      span {
        &:first-child {
          color: rgba(0, 0, 0, 0.65);
        }

        &:last-child {
          color: rgba(0, 0, 0, 0.85);
        }
      }
    }
  }

  .color1 {
    ::v-deep {
      .el-progress-bar__inner {
        background-color: unset; // 将进度条默认的颜色给去除掉，若不生效就再加个!important
        background-image: linear-gradient(90deg, #5A77E2 0%, #708CF5 100%); // 给进度条加上渐变色
      }
    }
  }

  .color2 {
    ::v-deep {
      .el-progress-bar__inner {
        background-color: unset; // 将进度条默认的颜色给去除掉，若不生效就再加个!important
        background-image: linear-gradient(90deg, #3DC6D3 0%, #4BD4E1 100%); // 给进度条加上渐变色
      }
    }
  }

  .color3 {
    ::v-deep {
      .el-progress-bar__inner {
        background-color: unset; // 将进度条默认的颜色给去除掉，若不生效就再加个!important
        background-image: linear-gradient(90deg, #46B1EA 0%, #58C2FA 100%); // 给进度条加上渐变色
      }
    }
  }
}

.line {
  margin-top: 24px;
  margin-bottom: 24px;

  .card {
    padding-top: 12px;

    .h {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
    }

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
  }


  #line {
    width: 100%;
    height: 340px;
  }
}

.pie {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(1, 1fr);
  grid-column-gap: 24px;
  margin-top: 24px;

  .h {
    display: flex;
    align-items: center;
    justify-content: space-between;

    img {
      width: 16px;
      height: 16px;
      margin-right: 24px;
    }
  }

  #pie1, #pie2 {
    width: 100%;
    height: 270px;
  }
}

.card {
  background-color: #FFFFFF;
  border-radius: 8px;

  .title {
    display: block;
    font-size: 16px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    margin: 16px 0 16px 24px;
    width: max-content;
  }

  .hr {
    width: 100%;
    height: 1px;
    border-bottom: 1px solid #E9E9E9;
  }

  .body {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
    padding: 24px 24px 0 24px;

    &-cell {
      display: flex;
      flex-direction: column;

      span {
        &:first-child {
          font-size: 15px;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.45);
        }

        &:last-child {
          display: flex;
          align-items: center;
          width: 36px;
          height: 42px;
          font-size: 30px;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.85);
          margin-top: 6px;
        }
      }
    }

    .mb24 {
      margin-bottom: 24px;
    }
  }
}


</style>
