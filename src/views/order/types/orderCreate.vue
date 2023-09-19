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
          <el-form-item label="服务类型名称：" prop="parentCode">
            <el-select
              v-model="form.parentCode"
              placeholder="请选择服务类型名称"
              @visible-change="servestype"
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
          <el-form-item label="工单类型名称：" prop="name">
            <el-input placeholder="请输入工单类型名称" v-model="form.name">
            </el-input>
          </el-form-item>

          <el-form-item label=" " style="margin-top: 40px">
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
import { workOrderType, getServiceType, orderdetail } from "@/api/order";
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

      orderTypeList: [],

      form: {},
      rules: {
        type: [
          { required: true, message: "请选择工单类型", trigger: "change" },
        ],
        parentCode: [{ required: true, message: "请选择", trigger: "input" }],
        name: [{ required: true, message: "请输入", trigger: "blur" }],
      },
      options: [],
    };
  },
  mixins: [basic],
  created() {
    let _query = this.$route.query;
    if (_query.id) {
      this.id = _query.id;
      this.title = "编辑工单类型";
      this.getinfo();
    } else {
      this.title = "新增工单类型";
    }
  },
  mounted() {
    let that = this;
    that.$nextTick(() => {
      that.$refs.orderCreate.scrollTop = 0;
    });
    that.initer();
  },
  methods: {
    async getinfo() {
      this.servestype();
      let obj = await orderdetail({ id: this.id });
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
      workOrderType({ method: "post", name: "detail" }, { id: that.id })
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
          res.data.records.map((item) => {
            _list.push({
              label: item.name,
              value: item.id.toString(),
            });
          });
          that.orderTypeList = _list;
          if (that.id) {
            this.loader_order_info();
          }
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
          console.log(that.id);

          if (that.id) {
            _json.name = "update";
          }
          workOrderType(_json, {}, _post).then((res) => {
            that.$message({
              type: "success",
              message: res.msg,
            });
            that.back();
          });
        }
      });
    },
    async servestype() {
      let obj = await getServiceType({ groupCode: "101" });
      this.options = obj.map((el) => {
        return { value: el.typeCode, label: el.typeName };
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
