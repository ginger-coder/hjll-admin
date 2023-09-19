<template>
  <div style="height: 100%">
    <div v-loading="loading" class="formPage" ref="orderCreate">
      <div class="header_box disp_flex ju_bet ali_cen">
        <div>
          <div class="title">{{ title }}</div>
        </div>
        <div class="back_box">
          <el-button v-hold-click type="" @click="back">返回</el-button>
        </div>
      </div>
      <div class="form_box scrllbar">
        <el-form ref="form" :model="info" label-width="130px">
          <el-form-item label="细分类型名称：" prop="name">
            {{ info.name || "-" }}
          </el-form-item>
          <el-form-item label="细分类型编码：" prop="code">
            {{ info.code || "-" }}
          </el-form-item>
		   <el-form-item label="工单类型名称：" prop="orderTypeCodeName">
            {{ info.orderTypeCodeName || "-" }}
          </el-form-item>
		  	   <el-form-item label="工单类型编码：" prop="orderTypeCode">
            {{ info.orderTypeCode || "-" }}
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import basic from "@/mixins/basic";
import { xjType, pollinginfo } from "@/api/order";
import { deepClone, priceInput } from "@/utils";

import store from "@/store";
export default {
  components: {},
  data() {
    return {
      title: "巡检类型详情",
      titleTips: "",
      loading: false,
      id: "",

      info: {},
    };
  },
  mixins: [basic],
  created() {
    let _query = this.$route.query;
    if (_query.id) {
      this.id = _query.id;
    //   this.loader_order_info();
    } else {
    }
  },
  mounted() {
    let that = this;
    that.$nextTick(() => {
      that.$refs.orderCreate.scrollTop = 0;
    });
    // that.initer();
	this.getinfo()
  },
  methods: {
    async getinfo() {
     let obj = await pollinginfo({ id: this.id });
	 this.info = obj.data
    },
    back() {
      this.$router.go(-1);
    },
    initer: function () {
      let that = this;
    },
    loader_order_info: function () {
      var that = this;
      xjType({ method: "get", name: "detail" }, { id: that.id })
        .then((res) => {
          that.info = deepClone(res.data);
        })
        .catch((error) => {});
    },
  },
};
</script>
<style lang="scss" scoped>
.app-container {
  font-size: 0;
  position: relative;

  ::v-deep {
    .el-table {
      &::before {
        content: none;
      }
    }
  }
}
.header_box {
  background: #ffffff;
  margin: -20px;
  padding: 20px;
  .title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 10px;
  }
  .back_box {
  }
}
.form_box {
  background-color: #ffffff;
  margin-top: 40px;
  border-radius: 4px;
  .el-form {
    width: 50%;
    min-width: 450px;
    min-height: 800px;
    margin: 0 auto;
    padding-top: 40px;
  }
}
</style>
