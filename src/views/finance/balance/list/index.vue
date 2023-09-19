<template>
  <div class="_full-table disp_flex flex_column" ref="_fullPage">
    <page-box class="bg-white">
      <el-form :model="formModel" inline ref="form" class="form_horizontal my_form disp_flex ju_bet">
        <div class="flex disp_flex" style="flex-wrap: wrap">
          <el-form-item class="" label="提现人：">
            <el-input placeholder="请输入提现人" v-model="formModel.updateUser"/>
          </el-form-item>
          <el-form-item class="" label="提现方类型：">
            <el-select v-model="formModel.nameType" placeholder="请选择账单类型">
              <el-option v-for="el in personnelType" :key="el.value" v-bind="el"/>
            </el-select>
          </el-form-item>
          <el-form-item class="" label="状态：">
            <el-select v-model="formModel.cashOutStatus" placeholder="请选择状态">
              <el-option v-for="el in cashOutStatus" :key="el.value" v-bind="el"/>
            </el-select>
          </el-form-item>
          <el-form-item class="" label="申请时间：">
            <el-date-picker
                v-model="formModel.time"
                type="datetimerange"
                :picker-options="pickerOptions"
                :format="globalFormat"
                :value-format="globalFormat"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>

        </div>
        <el-form-item class="">
          <el-button :loading="loading" @click="resetForm('form')">重置</el-button>
          <el-button :loading="loading" type="primary" @click="submitForm('form')">筛选</el-button>
        </el-form-item>
      </el-form>
    </page-box>
    <!--    <div style="background-color: #f2f2f2; height: 20px;"/>-->
    <page-box title="基本列表" ref="pageBox" class="mt24 flex bg-white tableFlex">
      <div slot="headerSlot">
        <el-button @click="allSelect(1)">批量通过审核</el-button>
        <el-button @click="allSelect(2)">批量拒绝审核</el-button>
        <!--        <el-button>批量更改为通过审核</el-button>-->
      </div>
      <m-table
          height="100%"
          class="flex"
          ref="table"
          :columns="columns"
          :request="getTableData"
          :payload="{
            ...formModel,
            time: undefined
          }"
          :loading.sync="loading"
          :select="select"
          @select-change="handleSelect">
        <el-table-column slot="opt" label="账单方">
          <el-link type="primary" :underline="false" slot-scope="{ row }">{{ row.name || '' }}</el-link>
        </el-table-column>
        <el-table-column slot="money" label="提现金额">
          <template slot-scope="{ row }">
            {{ `￥${row.money || 0}` }}
          </template>
        </el-table-column>
        <el-table-column slot="money" label="提现金额">
          <template slot-scope="{ row }">
            {{ row.createTime | filterTime }}
          </template>
        </el-table-column>
        <el-table-column slot="status" label="状态">
          <template slot-scope="{ row }">
            <template v-for="el in cashOutStatus">
                <span class="disp_flex ali_cen" :key="el.value" v-if="row.cashOutStatus === el.value">
                  <el-badge style="height: 12px;margin-right: 5px" is-dot :type="el.type"/>  {{ el.label }}
                </span>
            </template>
          </template>
        </el-table-column>
        <el-table-column slot="Action" label="操作" width="120">
          <template slot-scope="{ row }">
            <el-button type="text" @click="toPage(row)">详情</el-button>
            <el-dropdown trigger="click">
              <el-button type="text">审核</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <el-link type="success" :underline="false" @click="rowClick(1, row.id)">通过审核</el-link>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-link type="danger" :underline="false" @click="rowClick(2, row.id)">拒绝审核</el-link>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>

        </el-table-column>
      </m-table>
    </page-box>
  </div>
</template>

<script>
import collapseTransition from 'element-ui/lib/transitions/collapse-transition';
import pageBox from "@/views/finance/components/pageBox.vue";
import mTable from "@/views/finance/components/table.vue";
import {getTableData, cashStatus} from "../api";
import {filterTime, globalFormat, pickerOptions, cashOutStatus, personnelType} from '@/utils/comSelect'
import '@/views/finance/finance.scss'

export default {
  name: "list",
  components: {
    pageBox,
    mTable,
    collapseTransition
  },
  filters: {
    filterTime
  },
  data() {
    return {
      pickerOptions,
      cashOutStatus,
      personnelType,
      globalFormat,
      show: false,
      formModel: {
        nameType: undefined,
        status: undefined,
        createUser: undefined, // 体现人
        time: undefined
      },
      columns: [

        {
          prop: "bank",
          // align: 'center',
          label: "提现地址",
        },
        {
          // align: 'center',
          prop: "nameType",
          label: "提现方类型",
        },
        {
          // align: 'center',
          slot: 'opt',
          label: '提现方',
        },
        {
          // align: 'center',
          slot: 'money',
          label: "提现金额",
        },
        {
          // align: 'center',
          slot: 'status',
          prop: "cashOutStatus",
          label: "状态",
        },
        {
          // align: 'center',
          slot: "createTime",
          label: "申请时间",
        },
        {
          // align: 'center',
          slot: 'Action',
          label: "操作",
        },
      ],
      select: false,
      loading: false,
      ids: []
    }
  },
  methods: {
    getTableData,
    disabledDate(time) {
      return time.getTime() > Date.now();
    },
    submitForm(formName) {
      this.show = !this.show;
      // this.$refs[formName].validate((valid) => {
      //   this.$refs.table?.resetInit();
      // });
    },
    resetForm(formName) {
      this.formModel = {};
      this.$refs[formName].resetFields();
      this.$refs.table.resetInit();
    },
    toPage(row) {
      if (!row?.id) return false
      this.$router.push(`/finance/balance/details/${row?.id}`)
    },
    handleSelect(rows = {}) {
      this.ids = rows?.selectKey || [] // JSON.stringify(rows?.selectKey || []);
    },
    allSelect(status = 0) {
      const {ids = [], select = false} = this;
      if (!select || !ids || !ids?.length) {
        this.select = true;
        this.$message.info('请选择要操作的数据');
        return false;
      }
      this.$confirm(
          `确认批量${status === 1 ? '通过' : '拒绝'}数据吗?`,
          '操作',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: false
          })
          .then(() => {
            this.handleCashStatus(status, ids)
          })
    },
    rowClick(status, id) {
      this.$confirm(
          `确认${status === 1 ? '通过' : '拒绝'}申请吗?`,
          '操作',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: false
          })
          .then(() => {
            this.handleCashStatus(status, [id])
          })
    },
    async handleCashStatus(status = 0, ids = []) {
      this.loading = true;
      // const res = await cashStatus({
      //   status,
      //   ids
      // });
      // console.log(res, 'res');
      // this.loading = false;
      cashStatus({
        status,
        ids
      })
          .then((res) => {

            const {data = false, msg} = res || {};
            this.$message({
              message: msg,
              type: data ? 'success' : 'error'
            })
            if (data) {
              this.$refs.table.resetInit();
            }
          })
          .finally(() => {
            this.loading = false;
          })
      // await this.$refs.table?.init();
    }
  },
  watch: {
    'formModel.time'(val = []) {
      console.log(val);
      this.formModel.startTime = val?.[0] || undefined
      this.formModel.endTime = val?.[1] || undefined
    }
  }
}
</script>

<style scoped lang="scss">

.mt24 {
  margin-top: 20px;
}
</style>
