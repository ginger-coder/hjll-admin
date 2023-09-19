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
        <el-form ref="form" :model="form" :rules="rules" label-width="130px">
          <el-form-item label="细分类型名称：" prop="name">
            <el-input placeholder="请输入巡检类型名称" v-model="form.name">
            </el-input>
          </el-form-item>
          <el-form-item label="工单类型：" prop="orderTypeCode">
            <el-select
              v-model="form.orderTypeCode"
              placeholder="请选择工单类型"
              @visible-change="getselect"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" style="margin-top: 40px">
            <el-button v-hold-click type="primary" @click="submitForm()"
              >保存</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import basic from "@/mixins/basic";
import {
  xjType,
  workOrderType,
  getpollingseleect,
  pollinginfo,
  pollingupdate,
} from "@/api/order";
import { deepClone, priceInput } from "@/utils";

import store from "@/store";
export default {
  components: {},
  data() {
    return {
      title: "",
      titleTips: "",
      loading: false,
      id: "",

      form: {},
      rules: {
        orderTypeCode: [{ required: true, message: "请选择", trigger: "input" }],
        name: [{ required: true, message: "请输入", trigger: "blur" }],
      },
      orderTypeList: [],
      options: [],
    };
  },
  mixins: [basic],
  created() {
    let _query = this.$route.query;
    if (_query.id) {
      this.id = _query.id;
      this.title = "编辑巡检类型";
      //   this.loader_order_info();
       this.getinfo();
    } else {
      this.title = "新增巡检类型";
     
    }
  },
  mounted() {
    let that = this;
    that.$nextTick(() => {
      that.$refs.orderCreate.scrollTop = 0;
    });
    this.getinfo();
  },
  methods: {
    async getinfo() {
      this.getselect();
      let obj = await pollinginfo({ id: this.id });
      this.form = obj.data;
        
    },
    back() {
      this.$router.go(-1);
    },
    initer: function () {
      let that = this;
      that.loader_orderType();
    },
    loader_order_info: function () {
      var that = this;
      xjType({ method: "get", name: "detail" }, { id: this.id })
        .then((res) => {
          that.form = deepClone(res.data);
        })
        .catch((error) => {});
    },
    // 工单类型
    loader_orderType: function () {
      let that = this;
      workOrderType({ method: "get", name: "getAllWorkOrderType" })
        .then((res) => {
          let _list = [];
          res.data.map((item) => {
            _list.push({
              label: item.name,
              value: item.id.toString(),
              code: item.code,
            });
          });
          that.orderTypeList = _list;
        })
        .catch((error) => {});
    },
    submitForm: function (type) {
      let that = this;
      that.$refs.form.validate((valid) => {
        if (valid) {
          var _post = deepClone(that.form);
          var _json = {
            method: "post",
            name: "save",
          };
          if (that.id) {
            _json.name = "update";
          }
          //   _post.orderTypeCode =
          //     that.orderTypeList.filter((item) => item.label == "巡检").length > 0
          //       ? that.orderTypeList.filter((item) => item.label == "巡检")[0]
          //           .code
          //       : "";
          _post.useStatus = _post.useStatus || "1";
          xjType(_json, {}, _post).then((res) => {
            that.$message({
              type: "success",
              message: res.msg,
            });
            that.back();
          });
        }
      });
    },
    async getselect() {
      let obj = await getpollingseleect({ current: 1, size: 600, status: 0 });
      this.options = obj.data.records.map((el) => {
        return { value: el.code, label: el.name };
      });
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
