<template>
  <div class="_full-table disp_flex flex_column">
    <page-box class="bg-white">
      <el-form :model="formModel" inline ref="form" class="my_form disp_flex ju_bet" label-width="70px">
        <div class="flex disp_flex" style="flex-wrap: wrap">
          <el-form-item class="" label="被奖励方">
            <el-input placeholder="请输入被奖励方"/>
          </el-form-item>
          <el-form-item class="" label="奖励类型">
            <el-select v-model="formModel.moneyType" placeholder="请选择奖励类型">
              <!--              <el-option v-for="el in moneyType" :key="el.value" v-bind="el"/>-->
            </el-select>
          </el-form-item>
          <el-form-item class="" label="奖励时间">

          </el-form-item>
        </div>
        <el-form-item class="my-el-form-item">
          <el-button @click="resetForm('form')">重置</el-button>
          <el-button type="primary" @click="submitForm('form')">筛选</el-button>
        </el-form-item>
      </el-form>
    </page-box>
    <page-box title="基本列表" class="flex mt20 bg-white tableFlex">
      <div slot="headerSlot">
        <el-button type="primary">导出筛选出的奖励数据</el-button>
      </div>
      <m-table :data="tableData" :columns="columns" :select="select">
        <el-table-column slot="opt" label="账单方">
          <el-link :underline="false" type="primary" slot-scope="{ row }">账单方</el-link>
        </el-table-column>
        <el-table-column slot="Action" label="操作" width="120">
          <template slot-scope="{ row }">
            <el-link :underline="false" type="primary" @click.stop="toPage">详情</el-link>
            <el-link :underline="false" type="primary">设为线下发放</el-link>
            <el-link :underline="false" type="warning">取消线下发放</el-link>
          </template>
        </el-table-column>
      </m-table>
    </page-box>


  </div>
</template>

<script>
import pageBox from "@/views/finance/components/pageBox.vue";
import mTable from "@/views/finance/components/table.vue";
import '@/views/finance/finance.scss'

export default {
  name: "list",
  components: {
    pageBox,
    mTable
  },
  data() {
    return {
      tableData: [
        {
          time: new Date().getTime(),
          lx: '类型',
          BillingType: '账单方类型',
          money: 0,
          balance: 0,
        },
        {
          time: new Date().getTime(),
          lx: '类型',
          BillingType: '账单方类型',
          money: 0,
          balance: 0,
        }
      ],
      formModel: {},
      columns: [

        {
          prop: "lx",
          label: "奖励类型",
        },
        {
          prop: "BillingType",
          label: "关联工单/事项",
        },
        {
          label: '被奖励方',
          slot: 'opt',
        },
        {
          prop: "money",
          label: "奖励金额",
        },
        {
          prop: "time",
          label: "奖励时间",
        },
        {
          label: "操作",
          slot: 'Action',
        },
      ],
      select: false,
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    toPage(url = '/') {
      this.$router.push('/finance/award/details')
    }
  }
}
</script>
