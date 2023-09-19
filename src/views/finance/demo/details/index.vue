<template>
  <div>
    <div class="fixed-top-box disp_flex ju_bet ali_cen">
      <h2>奖励详情</h2>
      <!--      <div>-->
      <!--        <el-button>拒绝</el-button>-->
      <!--        <el-button type="primary">通过</el-button>-->
      <!--      </div>-->
    </div>

    <page-box title="奖励信息" class="mt20 bg-white" border>
      <el-descriptions class="mt20">
        <el-descriptions-item label="奖励类型">kooriookami</el-descriptions-item>
        <el-descriptions-item label="奖励金额">18100000000</el-descriptions-item>
        <el-descriptions-item label="奖励时间">苏州市</el-descriptions-item>
        <el-descriptions-item label="提现方类型">
          <el-link type="primary">账单方</el-link>
        </el-descriptions-item>
        <el-descriptions-item label="提现方">
          <el-link type="primary">账单方</el-link>
        </el-descriptions-item>
        <el-descriptions-item label="提现状态">江苏省苏州市吴中区吴中大道 1188 号</el-descriptions-item>
      </el-descriptions>
    </page-box>
    <page-box title="提现进度" class="mt20 bg-white" border>
      <el-steps :active="2" class="mt20 m___steps" align-centericon>
        <el-step title="提现申请" description="2022-12-28 10:23">
          <div slot="icon"></div>
        </el-step>
        <el-step title="等待审核" icon="">
          <div slot="icon"></div>
        </el-step>
        <el-step title="完成" icon="">
          <div slot="icon"></div>
        </el-step>
      </el-steps>
    </page-box>
  </div>
</template>

<script>

import pageBox from "@/views/finance/components/pageBox.vue";
import '@/views/finance/finance.scss'
export default {
  name: "list",
  components: {pageBox},

  data() {
    return {}
  },
  methods: {}
}
</script>

<style scoped lang="scss">
.fixed-top-box {
  background-color: #fff;
  margin-top: -20px;
  margin-left: -20px;
  padding: 20px;
  width: calc(100% + 40px);

  position: relative;
  z-index: 99;
}

.main {
  background: #fff;
  height: 100px;
  line-height: 100px;
  margin: -20px -20px 20px -20px;
  padding-left: 20px;
}
</style>