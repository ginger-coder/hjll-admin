<template>
  <div class="app-container disp_flex flex_column">
    <!-- <el-scrollbar wrap-class="app-container-wrapper"> -->
        <el-card shadow="hover" :body-style="{padding: 10}">
          <div ref="pageHead">
            <el-form ref="payload" :model="payload" class="form_horizontal">
              <el-form-item label="巡检项目名称：" prop="name">
                <el-input placeholder="请输入巡检项目名称" clearable v-model="payload.name" @clear="do_search"
                          @keyup.enter.native="do_search"></el-input>
              </el-form-item>
              <el-form-item label="状态：" prop="status">
                  <el-select v-model="payload.status" clearable >
                    <el-option v-for="item in temStatusLists" :key="item.value" :label="item.label"
                              :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
              <el-form-item label="巡检类型：" prop="orderDetailsType">
                  <el-select v-model="payload.orderDetailsType" clearable >
                    <el-option v-for="item in orderTypeList" :key="item.code" :label="item.name"
                              :value="item.code"></el-option>
                  </el-select>
                </el-form-item>
              <el-form-item label="巡检周期：" prop="period">
                <el-select v-model="payload.period" clearable >
                  <el-option v-for="item in periodData" :key="item.value" :label="item.label"
                            :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="站点类型：" prop="relatedSiteType">
                <el-select v-model="payload.relatedSiteType" clearable >
                  <el-option v-for="item in stationTypeData" :key="item.value" :label="item.label"
                            :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item >
                <el-button  type="primary" v-hold-click @click="submitForm('payload')">查询</el-button>
                <el-button type="primary"  v-hold-click @click="openDialog()">新增</el-button>
                <el-button  v-hold-click @click="resetForm('payload')">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
      </el-card>
      <el-card shadow="hover" class="flex mt-space table-card" :body-style="{height: '100%', paddingBottom: 0}">
        <template>
          <m-table height="100%" :columns="columns"  :request="getPollingItemPage" :payload="payload" :loading.sync="loading" ref="table" >
            <el-table-column slot="index" label="序号">
              <template slot-scope="scope">
              {{ scope.$index+1+($refs.table.current-1)*$refs.table.size }}
              </template>
            </el-table-column>
            <el-table-column label="状态" width="120" align="center" slot="status">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.status" active-color="#5A77E2" inactive-color="#909399" :active-value='0'
                          :inactive-value='1' @change="table_cell_state_change(scope.row,$event)">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column v-if="perOperate" label="操作"  slot="Action" align="center" width="200" fixed="right">
            <template v-slot="{ row }">
              <!-- <el-button type="text" v-hold-click @click.stop="doCommand('info', row)" style="margin-right: 5px;" v-if="row.status==0"> 配置巡检要求</el-button>
              <el-button   type="text" disabled style="margin-right: 5px;" v-if="row.status==1"> 配置巡检要求</el-button> 
              <el-divider direction="vertical" ></el-divider> -->
              <el-button type="text" v-hold-click @click.stop="doCommand('edit', row)" style="margin: 0 5px;"> 编辑</el-button>
              <el-divider direction="vertical" ></el-divider>
              <!-- <el-button type="text" v-hold-click @click.stop="doCommand('total', row)" style="margin: 0 5px;"> 配置金额</el-button>
              <el-divider direction="vertical" ></el-divider> -->
              <el-button type="text" v-hold-click @click.stop="doCommand('delete', row)" style="margin-left: 5px;"> 删除</el-button>
              <el-dropdown @command="doCommand($event, row)">
                <el-button @click.stop type="text">更多</el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="info" style="margin-right: 5px;" v-if="row.status==0">配置巡检要求</el-dropdown-item>
                  <el-dropdown-item command="total">配置金额</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
          </m-table>
        
        </template>
      </el-card>
    <addPatrolConfig :saveJump.sync="saveJump" ref="addPatrolConfig" @success="dialogCancelAfter"></addPatrolConfig>
    <settingAmount :saveJump.sync="saveJump" ref="addSettingAmount" @success="dialogCancelAfter"></settingAmount>
    <config-form-dialog :saveJump.sync="saveJump" ref="configFormDialog" :moduleType="'Item'"
                        :title="'项目'" @success="dialogCancelAfter"></config-form-dialog>
  </div>
</template>
<script>
import basic from "@/mixins/basic";
import {xmConfig,getPollingItemPage,getPollingType} from "@/api/orderXjConfig";
import {getLabel, getClass, orderStatus} from "@/utils/dict";
import {deepClone} from "@/utils";
import ConfigFormDialog from '../../components/xjConfigFormDialog.vue';
import addPatrolConfig from '../../components/addPatrolConfig.vue'
import settingAmount from '../../components/settingAmount.vue'
import mTable from '@c/business/table'
import { getBatchSystem } from "@/api/system"

export default {
  components: {ConfigFormDialog,mTable,addPatrolConfig,settingAmount},
  data() {
    return {
      temStatusLists: [
        {label: '开启', value: 0},
        {label: '关闭', value: 1}
      ],
      orderTypeList:[],
      saveJump: false,
      payload: {},
      columns: [
				{label: '序号', slot:'index', width: 60},
				{label: '巡检项目名称', prop: 'name'},
				{label: '巡检类型', prop: 'orderSecondTypeName'},
        {label: '巡检周期', prop: 'periodName'},
        {label: '站点类型', prop: 'siteTypeName'},
        {label: '状态', slot: 'status', width: 180},
        // {label: '巡检要求', prop: 'requireInfo'},
				{label: '创建时间', prop: 'createTime'},
				{label: '操作', slot: 'Action'}
			],
      stationTypeData:[],
      periodData:[],
    };
  },
  mixins: [basic],
  methods: {
    getPollingItemPage,
    getBatchList(){
      getBatchSystem(['stationType','period']).then((res)=>{
            if(res.success){
              this.stationTypeData = res.data.stationType;
              this.periodData = res.data.period;
            }
        })
    },
    // 巡检类型
    getPollingTypeList(){
      getPollingType({},{orderTypeCode:'XJ-TYPE-789'}).then(res=>{
        this.orderTypeList=res;
      })
    },
    tableStatusLabel(list, value) {
      return getLabel(list, value);
    },
    tableStatusClass(list, value) {
      return getClass(list, value);
    },
    filter_page_row(row) {
      let that = this;

      return row;
    },
    doCommand(command, row) {
      switch (command) {
        case "info":
          const {id, name, orderTypeDetailsId} = row;
          // this.jump(`/xj/xmSet?id=${id}&typeDetailsIds=${orderTypeDetailsId}&itemName=${name}`);
          this.table_cell_config(row);
          break;
        case "edit":
          this.table_cell_edit(row);
          break;
        case "total":
          this.table_cell_total(row);
          break;
        case "delete":
          this.table_row_remove(row);
          break;
      }
    },

    table_cell_state_change(row, status) {
      let that = this;
      row.status = status
      xmConfig({name: 'updateItem', method: 'post'}, {}, row)
          .then(res => {
            that.$message.success("修改成功");
            that.resetForm();
          })
          .catch(err => {

          })
    },
    table_cell_edit: function (info) {
      var that = this
      // if (info.umsRole) {
      //   info.umsRole = info.umsRole.split(",").map(item => item || '')
      // }
      if(info.relatedSiteType){
        info.relatedSiteType=info.relatedSiteType.split(',')
      }
      if(info.period){
        info.period= info.period.toString();
      }
      this.$refs.configFormDialog.openDialog(info)
    },
    table_cell_total: function (info) {
      this.$refs.addSettingAmount.openDialog(info)
    },
    table_cell_config(info){
      this.$refs.addPatrolConfig.openDialog(info)
    },
    table_row_remove: function (row) {
      var that = this

      let _form = new FormData()
      _form.append('ids', row.id)
      xmConfig(
          {name: "remove", method: "post"},
          {},
          _form)
          .then((res) => {
            that.$message.success("删除成功");
            that.$refs.table.resetInit();
          })
          .catch((err) => {
          });
    },
    openDialog: function (row) {
      var that = this
      this.$refs.configFormDialog.openDialog(row)
    },
    resetForm(formName) {
      this.payload = {};
      this.$refs[formName].resetFields();
      this.$nextTick(() => {
        this.$refs.table.resetInit();
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        this.$refs.table?.resetInit();
      });
    },
    dialogCancelAfter(){
      this.payload = {};
      this.$refs.table?.resetInit();
    }
  },
  mounted() {
    this.$on('lists.end', () => {
      if (this.saveJump) {
        this.saveJump = false;
        this.doCommand('info', this.lists?.[0] || {})
      }
    });
    this.getPollingTypeList();
    this.getBatchList();
  }
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

  .btn {
    &-verify {
      background: #4993f7;
      border-radius: 4px;
      color: white;
      width: 45px;
      height: 22px;
      display: inline-block;
      text-align: center;
      margin-left: 0.3rem;
      font-size: 13px;

      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
