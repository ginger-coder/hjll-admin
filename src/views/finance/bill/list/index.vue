


<template>
  <div class="_full-table disp_flex flex_column">
    <page-box class="bg-white">
      <el-form :model="formModel" inline ref="form" class="my_form disp_flex ju_bet">
        <div class="flex disp_flex" style="flex-wrap: wrap">
          <el-form-item class="" label="提现人" label-width="55px">
            <el-input placeholder="请输入提现人"/>
          </el-form-item>
          <el-form-item class="" label="账单类型" label-width="70px">
            <el-select v-model="formModel.moneyType" placeholder="请选择账单类型">
              <el-option v-for="el in moneyType" :key="el.value" v-bind="el"/>
            </el-select>
          </el-form-item>
          <el-form-item class="" label="账单方类型" label-width="84px">
            <el-select value="" placeholder="请选择账单方类型"></el-select>
          </el-form-item>
        </div>
        <el-form-item class="">
          <el-button :loading="loading" @click="resetForm('form')">重置</el-button>
          <el-button :loading="loading" type="primary" @click="submitForm('form')">筛选</el-button>
        </el-form-item>
      </el-form>
    </page-box>
    <page-box title="基本列表" class="flex mt20 bg-white tableFlex">
      <div slot="headerSlot">
        <el-button type="primary" icon="el-icon-plus">新建</el-button>
        <el-button @click="select = !select">批量操作</el-button>
      </div>
      <m-table
          ref="table"
          :columns="columns"
          :request="getTableData"
          :payload="formModel"
          :loading.sync="loading"
          :select="select">
        <el-table-column slot="opt" label="账单方">
          <el-link type="primary" slot-scope="{ row }">{{ row.createUser || '' }}</el-link>
        </el-table-column>
        <el-table-column slot="Action" label="操作" width="80">
          <el-button slot-scope="{ row }" type="text" @click="toPage(row)">详情</el-button>
        </el-table-column>
      </m-table>
    </page-box>
  </div>
</template>

<script>

import pageBox from "@/views/finance/components/pageBox.vue";
import mTable from "@/views/finance/components/table.vue";
import {getTableData} from "../api";
import {moneyType} from '@/utils/comSelect'
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
      formModel: {
        moneyType: undefined
      },
      columns: [

        {
          prop: "lx",
          label: "账单类型",
        },
        {
          prop: "relevanceType",
          label: "账单方类型",
        },
        {
          label: '账单方',
          slot: 'opt',
        },
        {
          prop: "money",
          label: "账单金额",
        },
        {
          prop: "amount",
          label: "账户余额",
        },
        {
          prop: "createTime",
          label: "账单时间",
        },
        {
          label: "操作",
          slot: 'Action',
        },
      ],
      select: false,
      loading: false,
      moneyType
    }
  },
  methods: {
    getTableData,
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        this.$refs.table?.resetInit();
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    toPage(row) {
      if (!row?.id) return false
      this.$router.push(`/finance/bill/details/${row?.id}`)
    }
  }
}
</script>







































