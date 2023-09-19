<template>
  <div>
    <el-card style="height: 100%" class="form_box scrllbar">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="130px"
        class="demo-ruleForm"
        label="right"
      >
        <el-form-item label="计划名称：" prop="name">
          <el-input v-model="ruleForm.name" style="width: 400px"></el-input>
        </el-form-item>
        <el-form-item label="巡检类型" prop="workOrderTypeDetailsId">
          <el-select
            v-model="ruleForm.workOrderTypeDetailsId"
            placeholder="机房巡检"
            style="width: 400px"
            @change="changeWorkOrderTypeId"
          >
            <el-option label="铁塔巡检" value="2"></el-option>
            <el-option label="机房巡检" value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属通信企业" prop="tenantId">
          <el-select
            v-model="ruleForm.tenantId"
            placeholder="请输入所属通信企业"
            style="width: 400px"
          >
            <el-option
              v-for="item in tenantId"
              :key="item.id"
              :label="item.companyName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计划执行区域" prop="quyu">
          <areaSelect
            ref="areaSelect"
            @change="changeArea($event, 'form')"
            :value="[form.province, form.city, form.area]"
            style="width: 400px"
          ></areaSelect>
        </el-form-item>
        <el-form-item label="选择模版：" prop="templateId">
          <el-select
            v-model="ruleForm.templateId"
            style="width: 400px"
            clearable
          >
            <el-option
              v-for="item in mbList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工单执行时间：" prop="timeArr">
          <el-date-picker
            value-format="yyyy-MM-dd"
            format="yyyy 年 MM 月 dd 日"
            v-model="ruleForm.timeArr"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changeTime"
            style="width: 400px"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="工单紧急程度：" prop="orderUrgency">
          <el-radio-group v-model="ruleForm.orderUrgency" @input="orderchang">
            <el-radio-button label="2">紧急</el-radio-button>
            <el-radio-button label="1">正常</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="派单模式:" prop="deliveryOrder">
          <el-radio-group v-model="ruleForm.deliveryOrder" @input="deverchang">
            <el-radio-button label="1">抢单</el-radio-button>
            <el-radio-button label="2">自动派单</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="工单分布" prop="dever">
          <el-radio-group v-model="ruleForm.dever" @input="deverschang">
            <el-radio-button label="1">均匀分布在整个执行周期</el-radio-button>
            <el-radio-button label="2">与设定执行周期保持一致</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注（可选）" prop="desc" placeholder="请输入备注">
          <el-input type="textarea" v-model="ruleForm.desc"></el-input>
        </el-form-item>
        <el-form-item>
          <table>
            <tr>
              <td>巡检类型</td>
              <td>机房巡检</td>
              <td>铁塔巡检</td>
              <td>总计</td>
            </tr>
            <tr>
              <td>数量</td>
              <td></td>
              <td></td>
              <td>{{ total }}</td>
            </tr>
          </table>
        </el-form-item>
        <el-form-item v-if="$route.query.row">
          <el-button type="primary" @click="submitForm()">仅保存</el-button>
          <el-button type="primary" @click="resetForm()"
            >保存并执行计划</el-button
          >
        </el-form-item>
        <el-form-item v-else>
          <el-button type="primary" @click="submitForm()">仅创建</el-button>
          <el-button type="primary" @click="resetForm()"
            >创建并执行计划</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {
  queryList,
  getCommunication,
  createliste,
  gettemplate,
  particularsList,
} from "../../api/patrol";
import areaSelect from "@/components/custom/areaSelect";
import moment from "moment";
// import memont form 'memont'
export default {
  components: {
    areaSelect,
  },
  data() {
    return {
      tenantId: [],
      ruleForm: {
        name: "",
        workOrderTypeDetailsId: "",
        tenantId: undefined,
        region: "",
        province: "",
        city: "",
        area: "",
        orderExecuteStartTime: "",
        orderExecuteEndTime: "",
        orderUrgency: "1",
        deliveryOrder: "1",
        dever: "1",
        workDistribution: "",
        planStatus: "",
        templateId: "",
        desc: "",
      },
      mbList: [],
      form: {
        province: "14",
        city: "1403",
        area: "140302",
      },
      rules: {
        name: [{ required: true, message: "请输入计划名称", trigger: "blur" }],
        deliveryOrder: [
          { required: true, message: "请选择派单模式", trigger: "blur" },
        ],
        orderUrgency: [
          { required: true, message: "请选择工单紧急程度", trigger: "blur" },
        ],
        dever: [
          { required: true, message: "请选择工单分布模式", trigger: "blur" },
        ],
        // timeArr: [{ required: true, message: "请选择工单执行周期", trigger: "blur" }],
        // quyu:[{ required: true, message: "请选择计划区域", trigger: "blur" }],
        tenantId: [
          { required: true, message: "请选择所属通信企业", trigger: "blur" },
        ],
        templateId: [
          { required: true, message: "请选择模板", trigger: "blur" },
        ],
        workOrderTypeDetailsId: [
          { required: true, message: "请选择巡检类型", trigger: "blur" },
        ],
      },
      value1: "",
      value: [],
      total: "",
    };
  },
  created() {
    // const timeArr = this.$route.query.row.timeArr || null;
    // this.ruleForm = this.$route.query.row;
    // this.ruleForm.timeArr = ["2022-01-01", "2022-01-03"];
    this.getlist();
    if (this.$route.query.row) {
      particularsList(this.$route.query.row).then((res) => {
        this.ruleForm.orderExecuteStartTime = res.createTime;
        this.ruleForm = res.data;
        console.log(res, 22);
      });
    } else {
    }
  },
  mounted() {
    queryList().then((res) => {
      console.log(res, 111);
      this.total = res.data.total;
    });
  },
  methods: {
    getlist() {
      getCommunication()
        .then((res) => {
          console.log(res.data);
          this.tenantId = res.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    changeArea(val, type) {
      this.ruleForm.province = val.province;
      this.ruleForm.city = val.city;
      this.ruleForm.area = val.area;
    },
    changeTime: function (time) {
      console.log(time);
      this.ruleForm.orderExecuteStartTime = time[0];
      this.ruleForm.orderExecuteEndTime = time[1];
      console.log(this.ruleForm.orderExecuteStartTime);
    },
    orderchang(val) {
      this.ruleForm.orderUrgency = val;
    },
    deverchang(val) {
      console.log(val);
      this.ruleForm.deliveryOrder = val;
    },
    deverschang(val) {
      this.ruleForm.workDistribution = val;
    },
    submitForm: function (type) {
      let that = this;
      that.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.ruleForm.planStatus = "0";
          createliste(this.ruleForm).then((res)=>{
              if(res.code==0){
                this.$message({
            showClose: true,
            message: "已新建巡检计划",
            type: "success",
          });
          this.$router.push({
            path: "/patrol",
          });
              }
          }).catch((ret)=>{
            console.log();
          })


        } else {
          this.$message({
            showClose: true,
            message: "请填写必填项",
            type: "warning",
          });
        }
      });
    },
    resetForm: function () {
      this.$refs.ruleForm.validate((val) => {
        if (val) {
          this.ruleForm.planStatus = "1";
          createliste(this.ruleForm)
            .then((res) => {
              if (res.code == 0) {
                this.$message({
                  showClose: true,
                  message: "已新建并执行了巡检计划",
                  type: "success",
                });
                this.$router.push({
                  path: "/patrol",
                });
              } else {
                console.log(2);
              }
            })
            .catch((ret) => {
              console.log(ret);
            });
        } else {
          console.log("3333444444");
        }
      });
    },
    changeWorkOrderTypeId() {
      gettemplate(this.ruleForm.workOrderTypeDetailsId)
        .then((res) => {
          console.log(res.data.records);
          this.mbList = res.data.records;
          this.ruleForm.templateId = this.mbList.id;
          this.mbList = res.data.records;
        })
        .catch((result) => {
          console.log(result);
        });
    },
  },
};
</script>

<style scoped lang="scss">
.el-form {
  width: 50%;
  min-width: 450px;
  min-height: 800px;
  margin: 0 auto;
  padding-top: 40px;
}
.el-card {
  height: 100%;
}
.el-form-item table {
  width: 100%;
  height: 30px;
  border: 1px solid black;
  border-collapse: collapse;
  text-align: center;
  tr {
    border: 1px solid black;
    border-collapse: collapse;
  }
  td {
    border: 1px solid black;
    border-collapse: collapse;
    padding: 0.5rem;
  }
}
</style>
