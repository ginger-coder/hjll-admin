<template>
  <!--  :fetch-suggestions="querySearchAsync"-->
  <!--   @select="handleSelect"-->
  <el-autocomplete
      class="search-component"
      v-model="value"
      value-key="siteName"
      :fetch-suggestions="querySearchAsync"
      @select="handleSelect"
      placeholder="请输入内容"
  />
</template>

<script>
import request from "@/api/request";

export default {
  name: "search",
  props: {
    keyword: {
      type: String,
      default: '',
    }
  },
  data() {
    return {
      value: undefined,
      loading: false,
      options: []
    }
  },
  methods: {
    async querySearchAsync(siteName, cb) {
      this.value = siteName;
      let data = [];
      if (siteName && siteName !== '') {
        this.loading = true;
        const res = await request({
          url: `/basestation/tSite/selectByName`,
          method: "post",
          data: {siteName},
        })
        console.log(res, 'res');
        data = res?.data || [];

      }
      cb(data)
    },
    handleSelect(item) {
      this.$emit('select', item)
    }
  },
  watch: {
    keyword: val => {
      this.$nextTick(() => {
        this.value = val;
      })
    },
  }
}
</script>

<style scoped>

</style>
