<template>
  <div>
    <span class="title">运维新增数据</span>
    <div class="first">
      <div class="left">
        <div class="top">
          <div v-for="(item,i) in page.first.top.config" class="top-cell" :style="{background:item.color}" :key="i"> 
            <div class="l">
              <span>{{ page.first.top.value[i] }}</span>
              <span>{{ item.label }}</span>
            </div>
            <div class="r">
              <img :src="item.img" alt=""/>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="card w626">
            <span class="title">数据</span>
            <div class="hr"></div>
            <div class="body">
              <div v-for="(item,i) in page.first.bottom.config" :class="['body-cell',i < 3 ? 'mb24' : '']" :key="i">
                <span>{{ item }}</span>
                <span>{{ page.first.bottom.value[i] }}</span>
              </div>
            </div>
          </div>
          <div class="card">
            <span class="title">快捷入口</span>
            <div class="hr"></div>
            <div class="r">
              <div v-for="(item,i) in page.first.bottom.config1" class="body-cell"
                   :style="{backgroundColor:item.color}" :key="i" @click="handleClick(i)">
                <span :style="{color:item.text}">{{ item.label }}</span>
                <img v-if="item.img" :src="item.img" alt=""/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="portrait">
          <img v-if="page.user.portrait" :src="page.user.portrait" alt=""/>
          <img v-else src="@/assets/avatar.png" alt=""/>
        </div>
        <div class="name">您好, 管理员</div>
        <div class="detail">
          <div></div>
          <div>平台超级管理员 ｜ 助力中国通信维护领域降本增效</div>
        </div>
        <div class="btn">导入设备资源</div>
        <div class="footer">
          <div v-for="(item,i) in page.user.config" :class="['footer-cell',i === 1 ? 'border' :'']" :key="i">
            <span>{{ item.label }}</span>
            <span>{{ page.user.value[i] }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="statistic">
      <div v-for="(item,i) in page.statistic.config" class="statistic-cell" :key="i">
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
          <span v-if="i === 0">¥ </span>
          <span>{{ Intl.NumberFormat('en-US').format(page.statistic.value[i]  || 0) }}</span>
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
                     :style="{width: `50%`, transform: `translateX(${(page.statistic.value2[i] > 0 ? '100%' : 0)})`}">
                </div>
              </template>
              <span>{{ Math.abs(page.statistic.value2[i]) }}%</span>
              <span v-if="page.statistic.value2[i] > 0" class="triangle"></span>
              <span v-else class="triangle-down"></span>
            </el-popover>
          </div>
        </div>
        <div v-else :class="[`color${i}`]">
          <el-popover
              placement="top"
              trigger="hover"

              popper-class="progress-pop"
              :title="`${page.statistic.value2[i] || 0}%`">
            <template #reference>
              <el-progress :percentage="page.statistic.value1[i]" :show-text="false"/>
            </template>

          </el-popover>


        </div>
        <div class="bottom">
          <div>
            <span>{{ item.detail }}</span>
          </div>
          <div>
            <span v-if="i === 0">¥ </span>
            <span>{{ Intl.NumberFormat('en-US').format(page.statistic.value1[i] || 0)}}</span>
            <span v-if="i === 2 || i ===3">%</span>
          </div>
        </div>
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
import {option} from "@/views/home/pie";
import HomeTradeBox from "@/components/HomeTradeBox";
import request from "@/api/request";

export default {
  components: {HomeTradeBox},
  data() {
    return {
      page: {
        user: {
          portrait: '',
          config: [{label: '未读提醒'}, {label: '未读通知'}, {label: '未读消息'}],
          value: [0, 0, 0],
        },
        first: {
          top: {
            config: [
              {
                img: require('@/assets/home/top1.png'),
                color: 'linear-gradient(90deg, #708CF5 0%, #5A77E2 100%)',
                label: "线下培训预约"
              },
              {
                img: require('@/assets/home/top2.png'),
                color: 'linear-gradient(90deg, #4BD4E1 0%, #3DC6D3 100%)',
                label: "理论考试预约"
              },
              {
                img: require('@/assets/home/top3.png'),
                color: 'linear-gradient(90deg, #58C2FA 0%, #46B1EA 100%)',
                label: "实操考试预约"
              },
            ],
            value: [0, 0, 0]
          },
          bottom: {
            config: ['运营商待验证', '运营商待审核', '运维人员待签约', '待确认工单', '待支付工单', '异常工单'],
            config1: [{
              img: require('@/assets/home/kj1.png'),
              color: '#399FFD0F',
              text: '#0057A7',
              label: "发布工单"
            }, {
              img: require('@/assets/home/kj2.png'),
              color: '#3968FD0F',
              text: '#5A77E2',
              label: "新建运营商"
            }, {
              img: require('@/assets/home/kj3.png'),
              color: '#42CBD80F',
              text: '#31C0CD',
              label: "新建运维人员"
            }, {
              color: '#F2F5FA38',
              label: ""
            }],
            value: [0, 0, 0, 0, 0, 0]
          },

        },
        statistic: {
          config: [
            {
              label: '今日交易额',
              icon: require('@/assets/home/statis1.png'),
              suffix: require('@/assets/home/info.png'),
              pct: undefined,
              detail: '日均交易额'
            }, {
              label: '今日工单量',
              icon: require('@/assets/home/statis2.png'),
              suffix: require('@/assets/home/info.png'),
              pct: 50,
              color: 'linear-gradient(90deg, #5A77E2 0%, #708CF5 100%)',
              detail: '日均工单量'
            }, {
              label: '已支付工单量',
              icon: require('@/assets/home/statis3.png'),
              suffix: require('@/assets/home/info.png'),
              pct: 50,
              color: 'linear-gradient(90deg, #3DC6D3 0%, #4BD4E1 100%)',
              detail: '支付率'
            }, {
              label: '当前主动接单人员',
              icon: require('@/assets/home/statis4.png'),
              suffix: require('@/assets/home/info.png'),
              pct: 50,
              color: 'linear-gradient(90deg, #46B1EA 0%, #58C2FA 100%)',
              detail: '接单率'
            }],
          value: [0, 0, 0, 0],
          value1: [0, 0, 0, 0],
          value2: [0, 0,0, 0]
        }
      }
    }
  },
  mounted() {
    const parent = document.getElementsByClassName('app-main')[0];
    if (parent) {
      parent.style.backgroundColor = '#F2F5FA';
    }

    this.fetchData()

    const pie1 = echarts.init(this.$refs.pie1);
    this.pie1 = pie1;
    option.index = 1;
    pie1.setOption(option);
    option.series[1].data[0].name = '交易额'
    const pie2 = echarts.init(this.$refs.pie2);
    this.pie2 = pie2;
    option.index = 2;
    option.series[1].data[0].name = '工单'
    pie2.setOption(option);


    window.addEventListener("resize", () => {
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
    handleClick(e){
    console.log(e);
    if(e==0){
      this.$router.push({ path: 'order/orderCreate' })
    }else if(e==1){
      this.$router.push({ path: 'isp/ispCreate' })
    }else{
      this.$router.push({ path: 'omp/ompCreate' })
    }
    },
    async fetchData() {
      const res = await request({
        url: "admin/home/list",
        method: "get"
      });
      if (res && res.code === 0) {
        const {
          userOfflineTrain, userTheoryExam, userPracticalOperation,
          companyVerify, companyCheck, userWaitSign, workWaitOrder, payWaitOrder, exceptionOrder,
          todayMoney, workOrderNum, alreadyPayWorkOrderNum, initiativeTakeOrderUserNum,
          dayAverage, workOrderAverage, payOdds, userCount,
          todayOdds, initiativeUserOdds, turnoverOdds
        } = res.data;
        this.page.first.top.value = [userOfflineTrain, userTheoryExam, userPracticalOperation]
        this.page.first.bottom.value = [companyVerify, companyCheck, userWaitSign, workWaitOrder, payWaitOrder, exceptionOrder]
        this.page.statistic.value = [todayMoney, workOrderNum, alreadyPayWorkOrderNum, initiativeTakeOrderUserNum]
        this.page.statistic.value1 = [dayAverage, workOrderAverage, payOdds, initiativeUserOdds].map(i => Number.parseFloat(i))
        this.page.statistic.value2 = [turnoverOdds, todayOdds, payOdds, initiativeUserOdds]
      }
    },
    handlePie(data) {
      option.index = 1;
      option.series[0].data = JSON.parse(JSON.stringify(data)).map(item => {
            item.value = item.money;
            item.label.show = item.money > 0
            return item;
          });
      option.series[1].data[0].name = '交易额'
      this.pie1.setOption(option);

      option.index = 2;
      option.series[0].data = JSON.parse(JSON.stringify(data)).map(item => {

        item.value = item.order;
        item.label.show = item.order > 0
        return item;
      });
      option.series[1].data[0].name = '工单'
      this.pie2.setOption(option);
    }
  }
};
</script>

<style lang="scss">
.progress-pop {
  display: flex;
  justify-content: center;
  align-items: center;

  min-width: auto !important;

  .el-popover__title {
    margin-bottom: 0;
  }
}

.triangle-down {
  margin: 0 0 0 4px;
  width: 10px;
  height: 10px;
  background-color: #52C41A;
  clip-path: polygon(100% 0, 0 0, 50% 100%);
}

.triangle {
  margin: 0 0 0 4px;
  width: 10px;
  height: 10px;
  background-color: #F5222D;
  clip-path: polygon(50% 0, 0 100%, 100% 100%);
}
</style>
<style lang="scss" scoped>
@import "~@/styles/home.scss";

.title {
  width: 96px;
  height: 22px;
  font-size: 16px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
}

.first {
  display: flex;
  height: 396px;
  margin-top: 16px;

  .left {
    flex: 1;

    .top {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(1, 1fr);
      grid-column-gap: 24px;
      margin-bottom: 21px;

      &-cell {
        &:hover {
          cursor: pointer;
        }

        height: 108px;
        border-radius: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .l {
          display: flex;
          flex-direction: column;
          margin-left: 24px;


          span {
            color: #FFFFFF;

            &:first-child {
              font-size: 30px;
              margin-bottom: 6px;
            }

            &:last-child {
              font-size: 14px;
              font-weight: 400;
            }
          }
        }

        .r {
          img {
            width: 90px;
            height: 108px;
          }
        }
      }
    }

    .bottom {
      width: 100%;
      display: grid;
      grid-template-columns: 2fr 1fr;
      grid-template-rows: repeat(1, 1fr);
      grid-column-gap: 48px;

      .w626 {
        width: calc(100% + 24px)
      }

      .r {
        padding: 24px;

        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(2, 1fr);
        grid-row-gap: 10px;
        grid-column-gap: 10px;


        .body-cell {
          &:hover {
            cursor: pointer;
          }

          position: relative;
          border-radius: 4px;
          height: 77px;
          padding: 14px;

          span {
            width: 50px;
            height: 44px;
          }

          img {
            position: absolute;
            width: 32px;
            height: 32px;
            bottom: 0;
            right: 0;
          }
        }
      }
    }
  }

  .right {
    width: 28.02%;
    height: 100%;
    background: #FFFFFF;
    border-radius: 8px;
    margin-left: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .portrait {
      img {
        width: 106px;
        height: 106px;
        border-radius: 53px;
      }

      margin-top: 24px;
    }

    .name {
      font-size: 20px;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 500;

      margin-top: 24px;
    }

    .detail {
      margin-top: 8px;

      width: 200px;
      height: 44px;
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.65);
      text-align: center;
      line-height: 20px;
    }

    .btn {
      width: 110px;
      height: 30px;
      background: #F5F5F5;
      border-radius: 4px;
      border: 1px solid #D9D9D9;
      margin-top: 16px;

      display: flex;
      justify-content: center;
      align-items: center;

      span {
        font-size: 13px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.65);
      }
    }

    .footer {
      display: flex;
      width: 100%;
      margin-top: 54px;

      &-cell {
        flex: 1;

        display: flex;
        flex-direction: column;
        align-items: center;

        span {
          &:first-child {
            font-size: 14px;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.45);
            margin-bottom: 8px;
          }

          &:last-child {
            font-size: 20px;
            color: rgba(0, 0, 0, 0.85);
          }
        }
      }

      .border {
        border-left: 1px solid #E9E9E9;
        border-right: 1px solid #E9E9E9;
      }
    }
  }
}

.statistic {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(1, 1fr);
  grid-column-gap: 24px;
  margin: 24px 0;

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

        &:hover {
          cursor: pointer;
        }
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

  ::v-deep {
    .el-progress-bar__outer {
      background-color: #708cf51f;
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

  .progress {
    //width: 220px;
    width: 100%;
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
