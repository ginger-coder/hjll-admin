<template>
  <div >
    <h2 class="main">账单详情</h2>
    <page-box title="账单信息" v-loading="loading" class="bg-white">
      <el-descriptions>
        <el-descriptions-item label="提现地址">{{ info.bankCard || '-' }}</el-descriptions-item>
        <el-descriptions-item label="提现金额">{{ info.money|moneyText }}</el-descriptions-item>
        <el-descriptions-item label="提现时间">{{ info.time }}</el-descriptions-item>
        <el-descriptions-item label="提现方类型">
          <el-link type="primary">{{ info.nameType || '-' }}</el-link>
        </el-descriptions-item>
        <el-descriptions-item label="提现方">
          <el-link type="primary">{{ info.updateUser || '-' }}</el-link>
        </el-descriptions-item>
        <el-descriptions-item label="提现状态">
          {{ info.cashOutStatusText || '-' }}
        </el-descriptions-item>
      </el-descriptions>
    </page-box>
    <page-box v-loading="loading" title="提现进度" class="mt20 bg-white" title-border>
      <el-steps align-center :active="!info.cashOutStatus ? 2: 3" class="mt20 m___steps" align-centericon>
        <el-step title="提现申请" :description="info.time">
          <div slot="icon"></div>
        </el-step>
        <el-step title="等待审核" icon="">
          <div slot="icon"></div>
        </el-step>
        <el-step :title="info.cashOutStatusText || '完成'" icon="">
          <div slot="icon"></div>
        </el-step>
      </el-steps>
    </page-box>
  </div>
</template>

<script>

import pageBox from "@/views/finance/components/pageBox.vue";
import {details} from "../api";

import {filterTime, moneyText, dataMaps, cashOutStatus, personnelType} from '@/utils/comSelect'
import '@/views/finance/finance.scss'

export default {
  name: "list",
  components: {pageBox},
  filters: {moneyText},
  data() {
    return {
      info: {},
      loading: true,
      cashOutStatusMaps: dataMaps(cashOutStatus),
      personnelTypeMaps: dataMaps(personnelType),
    }
  },
  created() {

    const id = this.$route?.params?.id;
    if (id) {
      this.details(id);
    }
  },
  methods: {
    async details(id) {
      this.loading = true
      const res = await details(id);
      this.loading = false;
      this.info = {
        ...res?.data,
        cashOutStatusText: this.cashOutStatusMaps[res?.data?.cashOutStatus],
        time: res?.data?.createTime ? filterTime(res?.data?.createTime) : '-'
      };
      console.log(this.cashOutStatusMaps[this.info.cashOutStatus],);
    }
  }
}
</script>

<style scoped lang="scss">

.main {
  background: #fff;
  height: 100px;
  line-height: 100px;
  margin: -20px -20px 20px -20px;
  padding-left: 20px;
}

</style>