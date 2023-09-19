<template>
  <div class="app-container">
    <el-scrollbar wrap-class="app-container-wrapper">
      <el-table :data="tableData" row-key="value" border :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column type="index" width="62" align="center" label="序号">
        </el-table-column>
        <el-table-column prop="label" label="Label" min-width="180">
        </el-table-column>
        <el-table-column prop="value" label="Value" min-width="180">
        </el-table-column>
      </el-table>
    </el-scrollbar>
  </div>
</template>
<script>
import { parseTime } from "@/utils";

import dict from "@/utils/dict"

import variables from "@/styles/variables.scss"

console.log('dict', dict)

export default {
  components: {},
  data() {
    return {
      tableData: [],

      variables:variables
    };
  },
  mounted() {
    let that = this;

    let list = dict.comm || [];
    list.map(item => {
      item.children = dict[item.value] || []
    })
    that.tableData = list;
  },
  created() {
    this.initer();
  },
  methods: {
    initer() {
      let that = this;
    },
  },
};

</script>
<style scoped>
</style>
