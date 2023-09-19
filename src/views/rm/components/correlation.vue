<template>
  <div class="popup">
    <el-dialog
      top="'100px'"
      v-if="visible"
      :title="dialogTitle+filtertype"
      :visible.sync="visible"
      :width="popupWidth"
      :before-close="handleClose"
    >
      <el-form
        :model="formData"
        ref="formRef"
        :label-width="'120px'"
        :inline="true"
      >
        <el-form-item label="所属区域：">
          <area-select
            @change="changeArea($event, 'searchs')"
          ></area-select>
        </el-form-item>
        <!-- 不同模块的单独查询条件 -->
        <template v-for="(item, index) in filterData">
          <el-form-item
            :key="index"
            v-if="item.type == 'select'"
            placeholder="请选择"
            :label="item.label + '：'"
          >
            <el-select v-model="formData[item['prop']]" clearable>
              <el-option
                v-for="obj in selectKey[item['key']]"
                :key="obj.value"
                :label="obj.label"
                :value="obj.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :key="index"
            v-if="item.type == 'input'"
            :label="item.label + '：'"
          >
            <el-input
              v-model="formData[item['prop']]"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </template>
        <div class="btn-box">
          <el-button type="primary" class="btn-search" @click="onSearch"
            >查询</el-button
          >
          <el-button type="default" class="btn-search" @click="sure"
            >确定</el-button
          >
        </div>
      </el-form>
      <el-table
        v-if="filtertype!='基站'"
        :data="selectRow"
        style="width: 100%"
        height="250">
        <el-table-column
          v-for="(item,index) in selectTable"
          :key="index"
          :prop="item.prop"
          :label="item.label" :width="item.width"  :align="item.align || 'center'"
          :sortable="item.sortable"  show-overflow-tooltip
         >
         <template slot-scope="{row}">
          <span v-if="item.text">{{row[item.prop] || '-'}}</span>
          <!-- 操作按钮 -->
					<span  v-if="item.isOperation">
						<template>
							<el-button
              @click="del(row)" 
              type="text" 
							>删除</el-button>
						</template>
					</span>
        </template>
        </el-table-column>
   
      </el-table>
      <publicTable
        :tableData="tableData"
        :tagHeight="665"
        :columObj="columObj"
        :pageObj="pageObj"
        @rowOperation="rowOperation"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
        @select-change="handleSelectionChange"
        @getCurrentRow="getCurrentRow"
      >
      </publicTable>
    </el-dialog>
  </div>
</template>
  
<script>
import {
  deviceData,
  machineData,
  towerData,
  corelationStaion,
} from "@/utils/filterTable";
import publicTable from "@c/business/tables";
import AreaSelect from "@/components/custom/areaSelect";
import { getBillData } from "@/api/finance"
import {
	bindStation,
  getDeviceData,
  getRoomData,
  getTowerData,
  getStationData
  } from "@/api/resource";
import resource from "@/mixins/resource";
export default {
  mixins: [resource],
  components: {
    publicTable,
    AreaSelect,
  },
  props: {
    filtertype: {
      type: String,
      default: "",
    },
    dialogTitle: {
      type: String,
      default: "关联",
    },
    visible: {
      type: Boolean,
      default: false,
    },
    popupWidth: {
      type: String,
      default: "1200px",
    },
  },
  data() {
    return {
      text: "展开",
      loading: false,
      selectKey:[],
      placeholder: "",
      filterData: [],
      ref:null,
      typeOptions: [
        {
          label: "所有",
          value: 1,
        },
      ],
      columObj: {
        selection: null,
        loading: true,
        index: null,
        selectType: false,
        selectable: (row, index) => {
          if (row.switchs) {
            return true;
          }
        },
        columnData: [],
      },
      pageObj: {
        //分页对象
        position: "right", //分页组件位置
        total: 0,
        show: true,
        pageData: {
          page: 1,
          isBind:true,
          size: 5,
        },
      },
      selectTable:[],
      tableData: [],
      selectRow:[],
      radioRow:null,
      formData: {
        areaCode:null,
      },
      getDatalist:null
    };
  },
  
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        // 当visible改变的时候，触发父组件的 updateVisible方法，在该方法中更改传入子组件的 centerDialogVisible的值
        this.$emit("updateVisible", val);
      },
    },
  },
  watch:{
    'filtertype'(newval,oldval){
      if (newval == "设备") {
      this.columObj.selection = true
      this.columObj.index = true
      this.getStationList()
      this.filterData = deviceData;
      this.columObj.columnData = [
      {
            prop: "deviceCode",
            text: true,
            editRow: undefined,
            label: "设备编码",
            width: "",
            align: "center",
          },
          {
            prop: "deviceType",
            label: "设备类型",
            text: true,
            editRow: undefined,
            width: "",
            align: "center",
          },
          {
            prop: "deviceSecondType",
            label: "设备细分类型",
            text: true,
            editRow: undefined,
            width: "",
            align: "center",
          },
          {
            prop: "area",
            label: "所属区域",
            text: true,
            editRow: undefined,
            width: "",
            align: "center",
          }
      ]
    } else if (newval == "机房") {
      this.columObj.selection = true
      this.columObj.index = true
      this.getStationList()
      this.filterData = machineData;
      this.columObj.columnData = [
      {
            prop: "machineRoomCode",
            text: true,
            editRow: undefined,
            label: "机房编码",
            width: "",
            align: "center",
          },
          {
            prop: "machineRoomName",
            label: "机房名称",
            text: true,
            editRow: undefined,
            align: "center",
          },
          {
            prop: "area",
            label: "所属区域",
            text: true,
            editRow: undefined,
            width: "",
            align: "center",
          },
          {
            prop: "machineRoomLevel",
            label: "机房细分类型",
            text: true,
            width: "",
            align: "center",
          },
      ]
    } else if (newval == "铁塔") {
      this.columObj.selection = true
      this.columObj.index = true
      this.getStationList()
      this.filterData = towerData;
      this.columObj.columnData = [
      {
            prop: "towerCode",
            text: true,
            editRow: undefined,
            label: "铁塔编码",
            width: "",
            align: "center",
          },
          {
            prop: "towerName",
            label: "铁塔名称",
            text: true,
            editRow: undefined,
            align: "center",
          },
          {
            prop: "area",
            label: "所属区域",
            text: true,
            editRow: undefined,
            width: "",
            align: "center",
          },
          {
            prop: "towerType",
            label: "铁塔细分类型",
            text: true,
            width: "",
            align: "center",
          },
      ]
    } else if(newval == '基站') {
      this.columObj.selection = false
      this.columObj.false = true
      this.getStationList()
      this.columObj.columnData = [
      {
            prop: "",
            radio:true,
            editRow: undefined,
            label: "",
            width: "100",
            align: "center",
          },
      {
            prop: "stationCode",
            text: true,
            editRow: undefined,
            label: "基站编码",
            width: "",
            align: "center",
          },
          {
            prop: "stationName",
            label: "基站名称",
            text: true,
            editRow: undefined,
            align: "center",
          },
          {
            prop: "area",
            label: "所属区域",
            text: true,
            editRow: undefined,
            width: "",
            align: "center",
          },
          {
            prop: "stationType",
            label: "基站细分类型",
            text: true,
            width: "",
            align: "center",
          },
      ]
      this.filterData = corelationStaion;
    }
    this.selectTable = JSON.parse(JSON.stringify(this.columObj.columnData));
    this.selectTable.push({
      isOperation: true,
      label: "操作",
      fixed: "right",
    })
    }
  },
  mounted(){
  },
  created() {
    this.dictParams = ['stationType','protectionLevel','operator']
  },
  methods: {
    changeArea({province, city, area}) {
        this.formData.areaCode = area
    },
    getStationList(){
      this.pageObj.pageData = {...this.pageObj.pageData,...this.formData}
      if(this.filtertype == '设备'){
        this.getDatalist = getDeviceData
      }else if(this.filtertype == '机房'){
        this.getDatalist = getRoomData
      }else if(this.filtertype == '铁塔'){
        this.getDatalist = getTowerData
      }else{
        delete this.pageObj.pageData.isBind
        this.getDatalist = getStationData
      }
      console.log(this.pageObj.pageData)
      this.getDatalist(this.pageObj.pageData).then((res)=>{
            if(res.code == 0){
                this.tableData = res.data.list || []
                this.columObj.loading = false
                this.pageObj.total = res.data.total
            }else{
                this.$message.error('请求报错')
            }
        })
    },
    // 删除
    del(row){
      this.selectRow.forEach((item,i)=>{
          if(item.id == row.id){
            this.ref.toggleRowSelection(item)
            this.selectRow.splice(i,1)
          }
      })
      if(this.selectRow.length==0){
        this.ref.clearSelection()
      }
    },
    // 操作栏按钮
    rowOperation(row, $index, now) {
      console.log(row)
    },
    // 单选框
    getCurrentRow(val){
      this.radioRow = val
    },
    // 复选框选中添加id
    handleSelectionChange(row) {
      this.ref = row.ref 
      this.selectRow= row.row;
    },
    //页码变化
    handleCurrentChange(e) {
      this.pageObj.pageData.current = e;
      this.getStationList();
    },
    //条数变化
    handleSizeChange(e) {
      this.pageObj.pageData.size = e;
      this.pageObj.pageData.current = 1;
      this.getStationList();
    },
    // 校验
    onValidate(callback) {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          // console.log(this.formData)
          callback();
        }
      });
    },
    // 搜索
    onSearch() {
      this.getStationList()
    },
    sure() {
      this.$emit("sure",this.selectRow,this.radioRow);
      this.handleClose()
    },
    Cancel() {
      this.$emit("resetPopupData");
    },
    Save() {
      this.$emit("submitPopupData",this.selectRow);
    },
    handleClose() {
      this.formData = {}
      this.selectRow = []
      if(this.ref){
        this.ref.clearSelection()
      }
      this.$emit("handleClose");
    },
  },
};
</script>
 <style lang="scss">
.popup .el-radio__label{
  display: none !important;
}
</style> 
<style scoped lang="scss">

 .popup {
  .el-dialog__wrapper{
    margin-top: 2% !important;
  }
}   
.search-form-box {
  background: #fff;
  padding: 15px 0;
  margin-bottom: 20px;
}
.btn-box {
  display: inline-block;
  margin-left: 20px;
}

.up-down {
  display: inline-block;
  margin-left: 20px;
  cursor: pointer;
  color: #5674e5;
  font-size: 14px;
}
.up-down i {
  margin-left: 5px;
}
.el-input{
    margin-right: 15px !important;
}
</style>
  