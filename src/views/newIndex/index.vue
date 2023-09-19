<template>
  <div class="newIndex">
    <div class="title">
      <div class="title1">海久六灵数字维护共享平台</div>
      <div class="title2">海纳出现，让你改变</div>
    </div>
    <el-row :gutter="20">
      <el-col :span="6" v-if="perms.includes('sys:navigation:index')"
        ><div class="grid-content bg-purple bg1" @click="onepang">
          <div class="tite">首页</div>
          <button class="contBtn">
            <router-link to="#">点击查看</router-link>
          </button>
          <img src="../../assets/static/one.png" alt="" />
        </div>
      </el-col>
      <el-col :span="6" v-if="perms.includes('sys:officialWebsite:index')"
        ><div class="grid-content bg-purple bg1" @click="guanwang">
          <div class="tite">官网</div>
          <button class="contBtn">
            <router-link to="#">点击查看</router-link>
          </button>
          <img src="../../assets/static/one.png" alt="" />
        </div>
      </el-col>
      <el-col :span="6"
      ><div class="grid-content bg-purple bg1" @click="largeScreen">
        <div class="tite">大屏</div>
        <button class="contBtn">
          <router-link to="#">点击查看</router-link>
        </button>
        <img src="../../assets/static/one.png" alt="" />
      </div>
      </el-col>
      <el-col :span="6" v-if="perms.includes('sys:screen:index')"
        ><div class="grid-content bg-purple bg1" @click="twojump">
          <div class="tite">维护智慧大屏</div>
          <button class="contBtn"><a href="https://haijiu.hainacssp.com:4438/app/charts-project/index.html">点击查看</a></button>
          <img src="../../assets/static/one2.png" alt="#" /></div
      ></el-col>
      <el-col :span="6" v-if="perms.includes('sys:monitoringCenter:index')"
        ><div class="grid-content bg-purple bg1" @click="threejump">
          <div class="tite">监控中心</div>
          <button class="contBtn">
            <router-link to="#">点击查看</router-link>
          </button>
          <img src="../../assets/static/one3.png" alt="#" /></div
      ></el-col>

    </el-row>
    <el-row :gutter="20">
      <!-- <el-col :span="6"
        ><div class="grid-content bg-purple bg1" @click="elevenjump">
          <div class="tite">数据分析</div>
          <button class="contBtn">
            <router-link to="#">点击查看</router-link>
          </button>
          <img src="../../assets/static/one11.png" alt="" /></div
      ></el-col> -->
      <el-col :span="6" v-if="perms.includes('sys:workOrderSystem:index')"
        ><div class="grid-content bg-purple bg1" @click="fourjump">
          <div class="tite">工单系统</div>
          <button class="contBtn">
            <router-link to="order/orderList1">点击查看</router-link>
          </button>
          <img src="../../assets/static/one4.png" alt="" /></div
      ></el-col>
      <el-col :span="6" v-if="perms.includes('sys:algorithmCenter:index')"
        ><div class="grid-content bg-purple bg1" @click="fivejump">
          <div class="tite">算法中心</div>
          <button class="contBtn">
            <router-link to="#">点击查看</router-link>
          </button>
          <img src="../../assets/static/one5.png" alt="" /></div
      ></el-col>
      <el-col :span="6" v-if="perms.includes('sys:contractingSystem:index')"
        ><div class="grid-content bg-purple bg1" @click="messmethods">
          <div class="tite">发包系统</div>
          <button class="contBtn" @click="messmethods">
            <router-link to="#">点击查看</router-link>
          </button>
          <img src="../../assets/static/one6.png" alt="" /></div
      ></el-col>
      <el-col :span="6" v-if="perms.includes('sys:loopSystem:index')"
        ><div class="grid-content bg-purple bg1" @click="sevenjump">
          <div class="tite">动环系统</div>
          <button class="contBtn">
            <a href="http://221.180.46.35:18888/vuepeim/login">点击查看</a>
          </button>
          <img src="../../assets/static/one7.png" alt="" /></div
      ></el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6" v-if="perms.includes('sys:alarmCenter:index')"
        ><div class="grid-content bg-purple bg1" @click="eightjump">
          <div class="tite">告警中台</div>
          <button class="contBtn">
            <router-link to="#">点击查看</router-link>
          </button>
          <img src="../../assets/static/one8.png" alt="" /></div
      ></el-col>
      <el-col :span="6" v-if="perms.includes('sys:resourceManagement:index')"
        ><div class="grid-content bg-purple bg1" @click="ninejump">
          <div class="tite">资源管理</div>
          <button class="contBtn">
            <router-link to="#">点击查看</router-link>
          </button>
          <img src="../../assets/static/one9.png" alt="" /></div
      ></el-col>
      <el-col :span="6" v-if="perms.includes('sys:customerManagement:index')"
        ><div class="grid-content bg-purple bg1" @click="tenjump">
          <div class="tite">客户管理</div>
          <button class="contBtn">
            <router-link to="isp/ispList">点击查看</router-link>
          </button>
          <img src="../../assets/static/one10.png" alt="" /></div
      ></el-col>
      <el-col :span="6" v-if="perms.includes('sys:trainingSystem:index')"
        ><div class="grid-content bg-purple bg1" @click="messmethods">
          <div class="tite">培训系统</div>
          <button class="contBtn" @click="messmethods">点击查看</button>
          <img src="../../assets/static/one12.png" alt="" /></div
      ></el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6" v-if="perms.includes('sys:qualityAssessment:index')"
        ><div class="grid-content bg-purple bg1" @click="messmethods">
          <div class="tite">质量考核系统</div>
          <button class="contBtn" @click="messmethods">点击查看</button>
          <img src="../../assets/static/one13.png" alt="" /></div
      ></el-col>
      <el-col :span="6" v-if="perms.includes('sys:flexibleEmployment:index')"
        ><div class="grid-content bg-purple bg1" @click="messmethods">
          <div class="tite">灵活用工</div>
          <button class="contBtn" @click="messmethods">点击查看</button>
          <img src="../../assets/static/one14.png" alt="" /></div
      ></el-col>
      <el-col :span="6" v-if="perms.includes('sys:cmsSystem:index')"
        ><div class="grid-content bg-purple bg1">
          <div class="tite">CMS 系统</div>
          <button class="contBtn">点击查看</button>
          <img src="../../assets/static/one14.png" alt="" /></div
      ></el-col>
      <el-col :span="6" v-if="perms.includes('sys:integralSystem:index')"
        ><div class="grid-content bg-purple bg1" >
          <div class="tite">积分系统</div>
          <button class="contBtn" >点击查看</button>
          <img src="../../assets/static/one14.png" alt="" /></div
      ></el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
        return {
          perms:[],
        }
  },
  methods: {
    messmethods() {
      // this.$message({
      //   showClose: true,
      //   message: "功能还在内测中",
      // });
      this.$router.push({
        path: "/testTrain/examination",
      });
    },
    onepang() {
      this.$router.push({
        path: "/",
      });
    },
    guanwang() {
      location.href = "https://hainacssp.com/";
    },
    twojump() {
      console.log(11111);
      location.href = "https://haijiu.hainacssp.com:4438/app/charts-project/index.html";
    },
    largeScreen() {
      this.$router.push({
        path: "/china",
      });
    },
    threejump() {
      this.$router.push({
        path: "datamap/index",
      });
    },
    fourjump() {
      this.$router.push({
        path: "order/orderList1",
      });
    },
    fivejump() {
      this.$router.push({
        path: "orderPrice/xj",
      });
    },
    sevenjump() {
      location.herf = "http://221.180.46.35:18888/vuepeim/login";
    },
    eightjump() {
      this.$router.push({
        path: "datamap/index",
      });
    },
    ninejump() {
      this.$router.push({
        path: "rm/rmZz",
      });
    },
    tenjump() {
      this.$router.push({
        path: "isp/ispList",
      });
    },
    elevenjump() {
      this.$router.push({
        path: "addcount/index",
      });
    },
  },
  mounted() {
    let that = this;
    that.perms = that.$store.getters.user.perms;
  },
};
</script>

<style lang="scss" scoped>
.newIndex {
  padding: 0 10%;
}
.title {
  text-align: center;
  margin-top: 100px;
  margin-bottom: 100px;
  .title1 {
    height: 50px;
    font-size: 36px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #00083d;
    line-height: 50px;
    text-align: center;
  }
  .title2 {
    height: 33px;
    font-size: 24px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ccced5;
    line-height: 33px;
    margin-top: 2px;
  }
}
.el-row {
  margin-bottom: 20px;
  .el-col {
    .grid-content {
      border: 1px solid #d8eaf9;
      border-radius: 7px;
      height: 132px;
      padding: 15px;
      border-radius: 7px;
      position: relative;
      transition: all 0.35s ease 0.1s;
      img {
        position: absolute;
        bottom: 0;
        right: 0;
      }
      .tite {
        font-size: 20px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 700;
        color: #083f5c;
        line-height: 28px;
      }
      .contBtn {
        width: 60px;
        height: 20px;
        background: #fff;
        border-radius: 10px;
        border: none;
        font-size: 11px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #6b6d7c;
        line-height: 16px;
        margin-top: 52px;
      }
    }
    .grid-content:hover {
      transform: scale(1.07);
      z-index: 999;
    }
  }
}
.bg1 {
  background: linear-gradient(180deg, #edf7ff 0%, #e9f6ff 100%);
}
</style>
