<template>
	<div class="device-contioner">
	  <Popup
		:dialogTitle="dialogTitle"
		:visible="dialogVisible"
		@updateVisible="updateVisible"
		@resetPopupData="resetPopupData"
		@submitPopupData="submitPopupData"
		@handleClose="handleClose"
		:popupWidth="'550px'"
	  >
	  	<div class="text">
		  确认删除已选中的数据项?
		</div>
	  </Popup>
	  <Correlation
      :visible="dialogVisible2"
      :filtertype="filtertype"
      @updateVisible="(()=>{})"
      @resetPopupData="(()=>{})"
      @submitPopupData="(()=>{})"
	  @sure="sure"
      @handleClose="(()=>{this.dialogVisible2=false})"
    >
    </Correlation>
	  <div class="table-box">
		<searchForm  :type="'铁塔'" @onSearch="onSearch" @onReset="onReset" @onAdd="onAdd" :btnItems="'search,reset,export'"/>
		<div class="el-drawer_mTable">
		  <publicTable
			:tableData="tableData"
			:tagHeight="380"
			:columObj="columObj"
			:pageObj="pageObj"
			@rowOperation="rowOperation"
			@handleSizeChange="handleSizeChange"
			@handleCurrentChange="handleCurrentChange"
			@select-change="handleSelectionChange"
		  >
		  </publicTable>
		</div>
	  </div>
	</div>
  </template>
  
  <script>
  import publicTable from "@c/business/tables";
  import "element-ui/lib/theme-chalk/display.css";
  import basic from "@/mixins/basic";
  import searchForm from "./components/filter"
  import Popup from "./components/popup"
  import Correlation from "./components/correlation"
  import tableSelection from "@/mixins/tableSelection";
  import areaSelect from "@/components/custom/areaSelect";
  import {
	getTowerData,
	getTowerDetail,
	deleteTower,
	changeTower,
	bindStation
  } from "@/api/resource";
  import { getBillData } from "@/api/finance"
  export default {
	components: {
	  publicTable,
	  searchForm,
	  Popup,
	  Correlation,
	  areaSelect,
	},
	mixins: [basic, tableSelection],
	data() {
	  return {
		dialogVisible: false, // 弹框的出现与否
		dialogTitle: '提示', // 标题
		filtertype:null,
		dialogVisible2:false,
		columObj: {
		  selection: false,
		  loading: true,
		  index:true,
		  selectType: false,
		  selectable: (row, index) => {
			if (row.switchs) {
			  return true;
			}
		  },
		  columnData: [
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
			  width: "200",
			  align: "center",
			},
			{
			  prop: "towerType",
			  label: "铁塔细分类型",
			  text: true,
			  editRow: undefined,
			  width: "180",
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
			  prop: "stationName",
			  label: "所属基站",
			  text: true,
			  editRow: undefined,
			  width: "",
			  align: "center",
			},
			{
			  prop: "stationCode",
			  label: "基站编码",
			  text: true,
			  editRow: undefined,
			  width: "100",
			  align: "center",
			},
			{
			  prop: "startTime",
			  label: "投产时间",
			  text: true,
			  editRow: undefined,
			  width: "",
			  align: "center",
			},
			{
			  isOperation: true,
			  label: "操作",
			  width: "300",
			  operation: [
				{
				  operation: "details",
				  type: "text",
				  label: "详情",
				  icon: "",
				  color: "#5674E5",
				  isShow: (row, $index) => {
					return true;
				  },
				},
				{
				  operation: "edit",
				  type: "text",
				  label: "修改",
				  icon: "",
				  color: "#5674E5",
				  isShow: (row, $index) => {
					return true;
				  },
				},
				{
				  operation: "del",
				  type: "text",
				  label: "删除  ",
				  icon: "",
				  color: "#5674E5",
				  isShow: (row, $index) => {
					return true;
				  },
				},
				{
				  operation: "remark",
				  type: "text",
				  label: "关联基站  ",
				  icon: "",
				  color: "#5674E5",
				  isShow: (row, $index) => {
					if(row.bindStatus == 0){
						return true;
					}else{
						return false;
					}
				  },
				},
 			  ],
			},
		  ],
		},
		pageObj: {
		  //分页对象
		  position: "right", //分页组件位置
		  total: 0,
		  show: true,
		  pageData: {
			page: 1,
			size: 30,
		  },
		},
		tableData: [],
		row:[],
		selectIds: [],
	  };
	},
	created() {
	  this.getData();
	},
  
	methods: {
		sure(val,radioRow){
		let params = {
			stationCode:radioRow.stationCode,
			resourceType: '2',
			resourceIdList:[this.row.id]
		}
		bindStation(params).then((res)=>{
			if(res.code == 0){
			this.$message.success('关联成功')
			this.getData()
			}
		})
		},
	  updateVisible (val) {
		this.dialogVisible = val
	  },
	  // 点击取消的事件
	  resetPopupData () {
		//  这里可重置数据
		this.dialogVisible = false
	  },
	  // 点击确定的按钮
	  submitPopupData () {
		// 请求删除接口
		deleteTower(this.row.id).then((res)=>{
			if(res.code == 0){
				this.dialogVisible = false
				this.$message.success('删除成功')
				this.getData()
			}
		})
	  },
	  // 关闭弹框（头部的X）
	  handleClose () {
		this.dialogVisible = false
	  },
	  // 获取数据
	  getData() {
		getTowerData(this.pageObj.pageData).then((res)=>{
			if(res.code == 0){
				this.tableData = res.data.list || []
				this.columObj.loading = false
				this.pageObj.total = res.data.total
			}else{
				this.$message.error('请求报错')
			}
		})
	  },
	  // 操作栏按钮
	  rowOperation(row, $index, now) {
		this.row = row
		if (now == "details") {
		  // 跳转详情
		  this.$router.push({
			name:'rmTowerInfo',
			query:{
			  id:row.id,
			  module:'details'
			}
		  })
		} else if (now == "edit") {
		  // 跳转修改编辑页面
		  this.$router.push({
			name:'rmTowerInfo',
			query:{
			  id:row.id,
			  module:'edit'
			}
		  })
		} else if(now == 'del'){
		  this.dialogVisible = true
			// 删除
		}else if(now == 'remark'){
			// 关联基站
			this.filtertype = '基站'

			this.dialogVisible2 = true
		}
	  },
	  // 复选框选中添加id
	  handleSelectionChange(row) {
			  this.selectIds = row.selectKey
	  },
	  //页码变化
	  handleCurrentChange(e) {
		  this.pageObj.pageData.current = e;
		  this.getData()
	  },
	  //条数变化
	  handleSizeChange(e) {
		  this.pageObj.pageData.size = e;
		  this.pageObj.pageData.current = 1;
		  this.getData()
	  },
	  // 
	  confirMarea() {
		this.$message.warning("暂未开通");
	  },
	  // 
	  cancelMarea() {
		this.$message.warning("暂未开通");
  
	  },
	  // 获取表格数据
	  onSearch(val) {
		delete val.time;
		this.pageObj.pageData = Object.assign(this.pageObj.pageData, val);
		this.getData();
	  },
	  // 重置请求参数请求数据
	  onReset() {
		this.getData();
	  },
	  onAdd(){
		this.$router.push({
			name:'rmTowerInfo',
			query:{
			  module:'add'
			}
		  })
	  }
	},
  };
  </script>
  
  <style lang="scss" scoped>
  @import "../datamap/index.scss";
  </style>
  <style scoped lang="scss">
 .text{
	margin: 20px 0;
  }
  .tab-bar {
	width: 100%;
	display: flex;
  }
  .options {
	width: 100%;
	display: flex;
	padding: 5px 10px;
	background: #fff;
  }
  .options span {
	flex: 1;
	height: 30px;
	line-height: 30px;
	font-size: 16px;
  }
  .options .btns {
	justify-content: flex-end;
  }
  .el-drawer_mTable {
	background: #fff;
	padding: 10px;
  }
  </style>
  