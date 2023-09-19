<template>
  <div>
    <h2 class="main">账单详情</h2>
    <page-box v-loading="loading " class="bg-white">
      <el-descriptions title="账单信息">
        <el-descriptions-item label="账单类型">{{ info.moneyType || '暂无' }}</el-descriptions-item>
        <el-descriptions-item label="账单金额">{{ info.money || '暂无' }}</el-descriptions-item>
        <el-descriptions-item label="账户余额">{{ info.amount || '暂无' }}</el-descriptions-item>
        <el-descriptions-item label="账单方">
          <el-link type="primary">{{ info.createUser || '暂无' }}</el-link>
        </el-descriptions-item>
        <el-descriptions-item label="账单时间">{{ info.createTime || '暂无' }}</el-descriptions-item>
      </el-descriptions>
    </page-box>
  </div>
</template>

<script>

import pageBox from "@/views/finance/components/pageBox.vue";
import {details} from "../api";
import '@/views/finance/finance.scss'
export default {
  name: "list",
  components: {pageBox},

  data() {
    return {
      info: {},
      loading: true
    }
  },
  created() {
    const id = this.$route?.params?.id;
    if (id) {
      // this.details(id);
    }
  },
  methods: {
    async details(id) {
      this.loading = true
      const res = await details(id);
      this.loading = false;
      this.info = res?.data || {};
    }
  }
}
</script>

