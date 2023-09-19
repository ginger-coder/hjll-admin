<template>
  <div class="app-container disp_flex flex_column">
      <el-card shadow="hover" :body-style="{padding: 10}">
        <div ref="pageHead">
          <el-form ref="searchs" :model="searchs" class="form_horizontal">
            <el-form-item label="巡检模块名称：" prop="name">
              <el-input placeholder="请输入项目模块名称" clearable v-model="searchs.name" ></el-input>
            </el-form-item>
            <el-form-item label="状态：" prop="status">
              <el-select v-model="searchs.status" clearable >
                <el-option v-for="item in temStatusLists" :key="item.value" :label="item.label"
                          :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="巡检类型：" prop="orderSecondType">
              <el-select v-model="searchs.orderSecondType" clearable >
                <el-option v-for="item in orderTypeList" :key="item.code" :label="item.name"
                          :value="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="巡检周期：" prop="period">
              <el-select v-model="searchs.period" clearable >
                <el-option v-for="item in periodData" :key="item.value" :label="item.label"
                          :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="站点类型：" prop="relatedSiteType">
              <el-select v-model="searchs.relatedSiteType" clearable >
                <el-option v-for="item in stationTypeData" :key="item.value" :label="item.label"
                          :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item >
              <el-button type="primary" v-hold-click @click="submitForm('searchs')">查询</el-button>
              <el-button type="primary" v-hold-click @click="openDialog()">新增</el-button>
              <el-button  v-hold-click @click="resetForm('searchs')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
      <el-card shadow="hover" class="flex mt-space table-card" :body-style="{height: '100%', paddingBottom: 0}" style="margin-top: 24px;">
        <template>
          <m-table height="100%" :columns="columns" :defaultSize="defaultSize" :defaultCurrent="defaultCurrent" @update:current="updateCurrent" @update:size="updateSize"  :request="getTableData" :payload="searchs" :loading.sync="loading" ref="table">
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
          <el-table-column  label="操作" align="center" width="180" slot="Action" fixed="right">
              <template v-slot="{ row }">
                <el-button type="text" v-hold-click @click.stop="doCommand('info', row)"> 配置巡检项目</el-button>
                <el-dropdown @command="doCommand($event, row)">
                  <el-button @click.stop type="text">更多</el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="edit">编辑</el-dropdown-item>
                    <el-dropdown-item command="delete"><span class="el-danger">删除</span></el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
          </el-table-column>
        </m-table>
        </template>
      </el-card>

    <config-form-dialog ref="configFormDialog" :pageFun="pageFun" :moduleType="'Module'" :title="'模块'"
                        @success="dialogCancelAfter"></config-form-dialog>
  </div>
</template>
<script>
import basic from "@/mixins/basic";
import {mkConfig,getTableData,temStatusLists,getPollingType,updatePollingModule,removePollingModule} from "@/api/orderXjConfig";
import mTable from '@c/business/table'
import {getLabel, getClass, orderStatus} from "@/utils/dict";
import {deepClone} from "@/utils";
import ConfigFormDialog from '../../components/addModules.vue';
import { getBatchSystem } from "@/api/system"

export default {
  components: {ConfigFormDialog,mTable},
  data() {
    return {
      pageFun: mkConfig,
      // apiKey: "id",

      temStatusLists: [
        {label: '开启', value: 0},
        {label: '关闭', value: 1}
      ],
      orderTypeList:[],
      searchs:{},
      columns: [
				{label: '序号', slot:'index', width: 60},
				{label: '巡检模块名称', prop: 'name'},
				{label: '巡检类型', prop: 'orderSecondTypeName'},
				{label: '巡检周期', prop: 'periodName'},
				{label: '站点类型', prop: 'siteTypeName'},
        {label: '巡检项目数量统计', prop: 'itemCount'},
				{label: '状态', slot: 'status', width: 180},
				{label: '创建时间', prop: 'createTime'},
				{label: '操作', slot: 'Action'}
			],
      defaultSize:10,
      defaultCurrent:1,
      stationTypeData:[],
      periodData:[],
    };
  },
  mixins: [basic],
  methods: {
    getTableData,
    getRouterValue(key) {
      return this.$route.query?.[key]
    },
    updateCurrent(val){
      this.defaultCurrent=val;
    },
    updateSize(val){
      this.defaultSize=val;
    },
    getBatchList(){
      getBatchSystem(['stationType','period']).then((res)=>{
            if(res.success){
              this.stationTypeData = res.data.stationType;
              this.periodData = res.data.period;
            }
        })
    },
    showItemName(row) {
      return row?.itemVOList?.map?.(el => el?.itemName)?.toString() || '-'
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
          this.jump(`/xj/mkSet?id=${row.id}&orderDetailsType=${row.orderDetailsType}&&defaultCurrent=${this.defaultCurrent}&&defaultSize=${this.defaultSize}&&searchs=${JSON.stringify(this.searchs)}&row=${JSON.stringify(row)}`);
          break;
        case "edit":
          this.table_cell_edit(row);
          break;
        case "delete":
          this.table_row_remove(row);
          break;
      }
    },
    getPollingTypeList(){
      getPollingType({},{orderTypeCode:'XJ-TYPE-789'}).then(res=>{
        this.orderTypeList=res;
      })
    },
    table_cell_state_change(row, status) {
      let that = this;
      row.status = status
      updatePollingModule({}, {}, row)
          .then(res => {
            that.$message.success("修改成功");
            that.resetForm();
          })
          .catch(err => {

          })
    },
    table_cell_edit: function (info) {
      if(info.relatedSiteType){
        info.relatedSiteType=info.relatedSiteType.split(',')
      }
      if(info.period){
        info.period= info.period.toString();
      }
      this.$refs.configFormDialog.openDialog(info)
    },
    table_row_remove: function (row) {
      var that = this

      let _form = new FormData()
      _form.append('ids', row.id)
      removePollingModule(
          {name: "remove", method: "post"},
          {},
          _form
      )
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
      this.searchs = {};
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
      this.searchs={};
      this.$refs.table?.resetInit();
    }
  },
  mounted() {
      let that = this;
      that.getPollingTypeList();
      if(this.getRouterValue('defaultCurrent')){
        this.defaultCurrent=Number(this.getRouterValue('defaultCurrent')) 
      }
      if(this.getRouterValue('defaultSize')){
        this.defaultSize=Number(this.getRouterValue('defaultSize')) 
      }
      if(this.getRouterValue('searchs')){
        this.searchs=JSON.parse(this.getRouterValue('searchs'))
      }
      that.getBatchList();
  },
};
</script>
<style lang="scss" scoped>
.app-container {
  font-size: 0;
  position: relative;
  background: transparent;

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
