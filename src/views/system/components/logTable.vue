<template>
  <div>
    <el-table :data="lists" ref="lists" fit highlight-current-row border v-loading.body="loading" element-loading-spinner="el-icon-loading" element-loading-custom-class="custom-loading">
      <el-table-column type="index" width="66" align="center" label="序号"></el-table-column>
      <el-table-column label="访问IP" min-width="300" prop="ip" show-overflow-tooltip></el-table-column>
      <el-table-column label="最新更新时间" width="188" prop="updateTime"></el-table-column>
    </el-table>
    <div class="pagign_box tr">
      <el-pagination background :page-size="pageSize" :current-page="currentPage" @current-change="paging_change" @size-change="size_change" layout="sizes, total, prev, pager, next" :page-sizes="[10, 20]" :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>

import basic from "@/mixins/basic"
import {logList} from "@/api/demo"

export default {
  components: {},
  data() {
    return {
      pageFun:logList,
      apiUrl:'log',
      apiKey:'id',
    };
  },
  mixins:[basic],
  created() {
    this.initer();
  },
  methods: {
    initer() {
      let that = this;
    }
  },
};

</script>
<style lang="scss" scoped>

</style>
