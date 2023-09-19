<template>
	
	<div class="app-container disp_flex flex_column">
		<div class="disp_flex orderTypeBox">
			<div class="label" :class="activeType=='all'?'actived label':'label'" @click="changeType('all')">全部工单</div>
			<div v-for="item in orderTypeList" :key="item.value" :class="activeType==item.value?'actived label':'label'" @click="changeType(item.value)">{{item.label}}</div>
		</div>
		<el-card shadow="hover" :body-style="{padding: 10}" class="topformbox" :style="{height: !icoshow? '90px' :''}">
			<el-form ref="form" inline :model="form" class="form business-form disp_flex" label-width="0px">
				<div class="flex">
					<el-form-item label="" prop="serialNumber">
						<el-input placeholder="请输入工单编号" clearable v-model="form.serialNumber" > </el-input>
					</el-form-item>
					<el-form-item label="" prop="orderTypeCode" v-if="activeType=='all'">
							<el-select ref="orderType" v-model="form.orderTypeCode" clearable placeholder="工单类型" @change="changeOrderType">
								<el-option v-for="item in orderTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
					</el-form-item>
					<el-form-item label="" prop="orderSecondTypeCode">
						<el-select v-model="form.orderSecondTypeCode" clearable  placeholder="工单二级类型">
							<el-option v-for="item in orderTypeSecondList" :key=" item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="" prop="workOrderStatus" v-if="activeId=='all'">
							<el-select v-model="form.workOrderStatus" clearable placeholder="工单状态">
								<el-option v-for="item in stateDataList" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
					</el-form-item>
					<el-form-item label="" prop="orderUrgency">
						<el-select v-model="form.orderUrgency" clearable  placeholder="紧急程度">
							<el-option v-for="item in orderUrgencyList" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="" prop="operatorId">
						<el-select v-model="form.operatorId" clearable placeholder="运营商">
							<el-option v-for="item in isp_list" :key="'isp' + item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="" prop="dist">
						<areaSelect  ref="areaSelect" @change="changeArea($event, 'form')"   :value="regionList" :ismultiple="true" :isCollapse="true"></areaSelect>
					</el-form-item>
					<el-form-item label="" prop="siteInfoId">
						<el-select v-model="form.siteInfoId" clearable placeholder="站点"> 
							<el-option v-for="item in siteList" :key="'siteId' + item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
				</div>
				<div class="disp_flex">
					<el-form-item>
						<el-button  type="primary" v-hold-click @click="submitForm('form')">查询</el-button>
						<el-button  v-hold-click @click="resetForm('form')">重置</el-button>
					</el-form-item>
				</div>
				<div class="searchiconbox" @click="showisshow">
					<svg-icon icon-class="xiangshang" className="icon" :hidden="!icoshow"></svg-icon>
					<svg-icon icon-class="xiangxia" className="icon" :hidden="icoshow"></svg-icon>
				</div>
			</el-form>
		</el-card>
		<el-card shadow="hover" class="flex mt-space table-card" :body-style="{height: '100%', paddingBottom: 0}">
			<el-tabs v-model="activeId" @tab-click="handleClick" class="eltabs">
					<el-tab-pane label="全部" name="all" class="el-tab-pane">
					</el-tab-pane>
					<el-tab-pane :label="item.label" :name="item.value" v-for="item in stateDataList" class="el-tab-pane">
					</el-tab-pane>
			</el-tabs>
			<m-table height="92%" :columns="columnsData"  :request="getWorkOrderData" :defaultSize="defaultSize" :defaultCurrent="defaultCurrent" @update:current="updateCurrent" @update:size="updateSize" :payload="form" :loading.sync="loading" ref="table"  :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" >
					<el-table-column slot="index" label="序号">
						<template slot-scope="scope">
						{{ scope.$index+1+($refs.table.current-1)*$refs.table.size }}
						</template>
					</el-table-column>
					<el-table-column slot="areaName" label="所属区域" width="180">
						<template slot-scope="{ row }">
						{{row.provinceName+row.cityName+row.areaName || "-" }}
						</template>
					</el-table-column>
					<el-table-column slot="orderExecuteStartTime" label="执行周期" width="300">
						<template slot-scope="{ row }">
						{{row.orderExecuteStartTime+'—'+row.orderExecuteEndTime || "-" }}
						</template>
					</el-table-column>
					<el-table-column slot="workOrderStatusName" label="工单状态" width="120">
						<template  v-slot="{ row }">
							<span class="auditStatusColor" style="background-color: #FFBF00;" v-if="row.workOrderStatusName=='待派发'||row.workOrderStatusName=='待确认'"></span>
							<span class="auditStatusColor" style="background-color: #22BBF5;" v-else-if="row.workOrderStatusName=='派发中'"></span>
							<span class="auditStatusColor" style="background-color: #22BBF5;" v-else-if="row.workOrderStatusName=='已派单'"></span>
							<span class="auditStatusColor" style="background-color: #9B00FF;" v-else-if="row.workOrderStatusName=='已接单'"></span>
							<span class="auditStatusColor" style="background-color: #5674E5;" v-else-if="row.workOrderStatusName=='已出发'"></span>
							<span class="auditStatusColor" style="background-color: #00F1FF;" v-else-if="row.workOrderStatusName=='已到达'"></span>
							<span class="auditStatusColor" style="background-color: #FF7600;" v-else-if="row.workOrderStatusName=='处理中'"></span>
							<span class="auditStatusColor" style="background-color: #FFBF00;" v-else-if="row.workOrderStatusName=='待审核'"></span>
							<span class="auditStatusColor" style="background-color: #52C41A;" v-else-if="row.workOrderStatusName=='已回单'||row.workOrderStatusName=='已完成'"></span>
							<span class="auditStatusColor" style="background-color: #F5222D;" v-else-if="row.workOrderStatusName=='已驳回'"></span>
							<span class="auditStatusColor" style="background-color: #FFBF00;" v-else-if="row.workOrderStatusName=='待结算'"></span>
							<span class="auditStatusColor" style="background-color: #BFBFBF;" v-else></span>
							<span>{{ row.workOrderStatusName }}</span>
						</template>
					</el-table-column>
					<el-table-column slot="Action" label="操作" width="200">
						<template v-slot="{ row }">
							<el-button type="text" v-hold-click @click.stop="doCommand('info', row)" v-if="perms.includes('sys:order:detail')"> 详情 </el-button>
							<el-button type="text" v-hold-click @click.stop="doCommand('sendOrder', row)" v-if="row.workOrderStatus === 1&&perms.includes('sys:order:sendOrder')"> 指定派单人员 </el-button>
						</template>
					</el-table-column>
			</m-table>
		</el-card>
		<el-dialog
				title="指定接单人员"
				:visible.sync="dialogVisible"
				class="el-dialog-unify el-dialog-small"   
				width="600px"
				@close="closedialog"
				>
				<div style="margin-bottom: 20px;">
					<el-select
						class="selnBox"
						v-model="value"
						filterable
						default-first-option
						@focus="focus"
						ref="mySelect"
						clearable
						:loading="loading"
						placeholder="请选择指派人员">
						<el-option
							v-for="(item,index) in options"
							:key="index"
							:label="item.label"
							:value="item.value"
						>
						</el-option>
					</el-select>
				</div>
				<span slot="footer" class="dialog-footer">
					<el-button @click="dialogVisible = false">取 消</el-button>
					<el-button type="primary" @click="designate">确 定</el-button>
				</span>
		</el-dialog>
	</div>
	
</template>
<script>
import basic from "@/mixins/basic";
import { zpList,dispatcherOrder,getAuthRecord } from "@/api/order";
import { getDictTypesItem } from "@/api/dict";
import { getLabel, getClass } from "@/utils/dict";
import { deepClone } from "@/utils";

import areaSelect from "@/components/custom/areaSelectAll";
import mTable from "@c/business/table";
import { getStationList } from "@/api/area";
import{getWorkOrderData,getWorkOrderTypeData} from "./api";


export default {
	data() {
		return {
			isXjSearch:false,
			stateDataList: [
			{
				"value": "-1",
				"label": "已撤回"
			},
			{
				"value": "0",
				"label": "待派发"
			},
			{
				"value": "1",
				"label": "派发中"
			},
			{
				"value": "2",
				"label": "待确认"
			},
			{
				"value": "3",
				"label": "已接单"
			},
			{
				"value": "4",
				"label": "已出发"
			},
			{
				"value": "5",
				"label": "已到达"
			},
			{
				"value": "6",
				"label": "处理中"
			},
			{
				"value": "7",
				"label": "待审核"
			},
			{
				"value": "23",
				"label": "已驳回"
			},
			{
				"value": "11",
				"label": "待结算"
			},
			{
				"value": "9",
				"label": "已完成"
			}
			],
			orderTypeList:[],
			orderUrgencyList:[],
			orderResourceTypeList:[],
			orderTypeSecondList:[],
			xjTypeList:[],
			isp_list:[],
			siteList:[],
			createTime:[],
			columns: [
				{label: '序号', slot:'index', width: 60},
				{label: '运营商', prop: 'companyName', width: 180},
				{label: '工单类型', prop: 'orderTypeName'},
				{label: '工单二级类型', prop: 'orderSecondTypeName'},
				{label: '工单编号', prop: 'serialNumber', width: 180},
				{label: '站点类型', prop: 'siteTypeName', width: 180},
				{label: '基站名称', prop: 'siteName', width: 180},
				{label: '所属区域', slot: 'areaName'},
				{label: '紧急程度', prop: 'orderUrgencyName'},
				{label: '执行周期', slot: 'orderExecuteStartTime', width: 180},
				{label: '工单状态', slot: 'workOrderStatusName'},
				{label: '接单人', prop: 'respondent'},
				{label: '联系方式', prop: 'phoneNumber', width: 120},
				{label: '预计派发时间', prop: 'preDeliveryTime', width: 180},
				{label: '派发时间', prop: 'deliveryOrderTime', width: 180},
				{label: '接单时间', prop: 'haveOrderTime', width: 180},
				{label: '出发时间', prop: 'departTime', width: 180},
				{label: '到达时间', prop: 'arriveTime', width: 180},
				{label: '开始处理时间', prop: 'disposeTime', width: 180},
				{label: '回单时间', prop: 'receiptTime', width: 180},
				{label: '审核时间', prop: 'updateTime', width: 180},
				{label: '完成时间', prop: 'finishTime', width: 180},
				{label: '操作', slot: 'Action'}
			],
			form: {},
			activeId: 'all',
			activeType:'all',
			dialogVisible:false,
			options: [],
			value:'',
			columnsData:[],
			codearea:'',
			codeListData:{},
			defaultSize:10,
      		defaultCurrent:1,
			perms:[],
			regionList:[],
			icoshow:false,
		};
	},
	mixins: [basic],
	components: {areaSelect,mTable},
	mounted(){
		var that = this;
		if(this.getRouterValue('defaultCurrent')){
			this.defaultCurrent=Number(this.getRouterValue('defaultCurrent')) 
		}
		if(this.getRouterValue('defaultSize')){
			this.defaultSize=Number(this.getRouterValue('defaultSize')) 
		}
		if(this.getRouterValue('form')){
			this.form=JSON.parse(this.getRouterValue('form'));
			if(this.form.area){
				this.loader_site({area:this.form.area});
			}
			if(this.form.orderTypeCode){
				this.getWorkOrderType(this.form.orderTypeCode);
			}
			if(this.form.orderTypeCode){
				this.activeType=this.form.orderTypeCode;
			}
			if(this.form.workOrderStatus){
				this.activeId=this.form.workOrderStatus;
			}
		}
		let array=that.columns;
		that.perms = that.$store.getters.user.perms;
		this.columnsData=array.filter(ele => ele.label!='预计派发时间'&&ele.label!='派发时间'&&ele.label!='接单时间'&&ele.label!='出发时间'&&ele.label!='到达时间'&&ele.label!='开始处理时间'&&ele.label!='回单时间'&&ele.label!='审核时间'&&ele.label!='完成时间');
		// 运营商数据
		that.loader_isp()
		that.getInitPage()
	},
	methods: {
		showisshow(){
          this.icoshow = !this.icoshow
		},
		updateCurrent(val){
			this.defaultCurrent=val;
		},
		updateSize(val){
			this.defaultSize=val;
		},
		getRouterValue(key) {
			return this.$route.query?.[key]
		},
		changeType(val){
			this.activeType=val;
			this.activeId='all'
			this.form.orderTypeCode=(val=='all'?'':val)
			this.getWorkOrderType(this.activeType)
			this.$set(this.form, 'orderSecondTypeCode', null)
			this.$set(this.form, 'serialNumber', null);
			this.$set(this.form, 'orderUrgency', null);
			this.$set(this.form, 'workOrderStatus', null);
			this.$set(this.form, 'province', null);
			this.$set(this.form, 'city', null);
			this.$set(this.form, 'area', null);
			this.$set(this.form, 'siteInfoId', null);
			this.$nextTick(() => {
				this.$refs.table.resetInit();
			})
		},
		changeOrderType(val){
			this.getWorkOrderType(val)
		},	
		handleClick(tab, event){
			let array=this.columns;
			if(this.activeId=='all'){
				this.form.workOrderStatus='';
				
			}else{
				this.form.workOrderStatus=this.activeId;
			}
			this.$set(this.form, 'orderSecondTypeCode', null)
			this.$set(this.form, 'serialNumber', null);
			this.$set(this.form, 'orderUrgency', null);
			this.$set(this.form, 'province', null);
			this.$set(this.form, 'city', null);
			this.$set(this.form, 'area', null);
			this.$set(this.form, 'siteInfoId', null);
			if(this.activeId=='all'){
				this.columnsData=array.filter(ele => ele.label!='预计派发时间'&&ele.label!='派发时间'&&ele.label!='接单时间'&&ele.label!='出发时间'&&ele.label!='到达时间'&&ele.label!='开始处理时间'&&ele.label!='回单时间'&&ele.label!='审核时间'&&ele.label!='完成时间');
			}else if(this.activeId=='0'){
				this.columnsData=array.filter(ele => ele.label!='接单人'&&ele.label!='派发时间'&&ele.label!='接单时间'&&ele.label!='出发时间'&&ele.label!='到达时间'&&ele.label!='开始处理时间'&&ele.label!='回单时间'&&ele.label!='审核时间'&&ele.label!='完成时间');
			}else if(this.activeId=='1'||this.activeId=='-1'){
				this.columnsData=array.filter(ele => ele.label!='接单人'&&ele.label!='预计派发时间'&&ele.label!='接单时间'&&ele.label!='出发时间'&&ele.label!='到达时间'&&ele.label!='开始处理时间'&&ele.label!='回单时间'&&ele.label!='审核时间'&&ele.label!='完成时间');
			}else if(this.activeId=='2'){
				this.columnsData=array.filter(ele => ele.label!='预计派发时间'&&ele.label!='接单时间'&&ele.label!='出发时间'&&ele.label!='到达时间'&&ele.label!='开始处理时间'&&ele.label!='回单时间'&&ele.label!='审核时间'&&ele.label!='完成时间');
			}else if(this.activeId=='3'){
				this.columnsData=array.filter(ele => ele.label!='预计派发时间'&&ele.label!='派发时间'&&ele.label!='出发时间'&&ele.label!='到达时间'&&ele.label!='开始处理时间'&&ele.label!='回单时间'&&ele.label!='审核时间'&&ele.label!='完成时间');
			}else if(this.activeId=='4'){
				this.columnsData=array.filter(ele => ele.label!='预计派发时间'&&ele.label!='派发时间'&&ele.label!='接单时间'&&ele.label!='到达时间'&&ele.label!='开始处理时间'&&ele.label!='回单时间'&&ele.label!='审核时间'&&ele.label!='完成时间');
			}else if(this.activeId=='5'){
				this.columnsData=array.filter(ele => ele.label!='预计派发时间'&&ele.label!='派发时间'&&ele.label!='接单时间'&&ele.label!='出发时间'&&ele.label!='开始处理时间'&&ele.label!='回单时间'&&ele.label!='审核时间'&&ele.label!='完成时间');
			}else if(this.activeId=='6'){
				this.columnsData=array.filter(ele => ele.label!='预计派发时间'&&ele.label!='派发时间'&&ele.label!='接单时间'&&ele.label!='出发时间'&&ele.label!='到达时间'&&ele.label!='回单时间'&&ele.label!='审核时间'&&ele.label!='完成时间');
			}else if(this.activeId=='7'){
				this.columnsData=array.filter(ele => ele.label!='预计派发时间'&&ele.label!='派发时间'&&ele.label!='接单时间'&&ele.label!='出发时间'&&ele.label!='到达时间'&&ele.label!='开始处理时间'&&ele.label!='审核时间'&&ele.label!='完成时间');
			}else if(this.activeId=='23'||this.activeId=='11'){
				this.columnsData=array.filter(ele => ele.label!='预计派发时间'&&ele.label!='派发时间'&&ele.label!='接单时间'&&ele.label!='出发时间'&&ele.label!='到达时间'&&ele.label!='开始处理时间'&&ele.label!='回单时间'&&ele.label!='完成时间');
			}else if(this.activeId=='9'){
				this.columnsData=array.filter(ele => ele.label!='预计派发时间'&&ele.label!='派发时间'&&ele.label!='接单时间'&&ele.label!='出发时间'&&ele.label!='到达时间'&&ele.label!='开始处理时间'&&ele.label!='回单时间'&&ele.label!='审核时间');
			}
			this.$refs.form.validate((valid) => {
				this.$refs.table?.resetInit();
			});
		},
		getInitPage(){
			var that = this;
			// 工单类型
			getDictTypesItem({name:'order_type',method:'get'}).then(res=>{
				if(res.code=='0'){
					that.orderTypeList = res.data|| [];
				}	
			})
			// 紧急程度
			getDictTypesItem({name:'order_urgency',method:'get'}).then(res=>{
				if(res.code=='0'){
					that.orderUrgencyList = res.data|| [];
				}	
			})
			// 业务类型
			getDictTypesItem({name:'order_resource_type',method:'get'}).then(res=>{
				if(res.code=='0'){
					that.orderResourceTypeList = res.data|| [];
				}	
			})
		},
		getWorkOrderData,
		getWorkOrderType(orderTypeCode){
			var that = this
			getWorkOrderTypeData({current:1,size:99,orderTypeCode:orderTypeCode}).then(res=>{
				let _list = [],
					_data = res.data.records || []

				_data.map(item=>{
					var json = {
						label:item.name,
						value:item.code,
					}
					_list.push(json)
				})
				that.orderTypeSecondList = _list
				
			})
		},
		loader_isp:function(){
			var that = this
			getAuthRecord({}).then(res=>{
				let _list = [],
					_data = res.data|| []

				_data.map(item=>{
					var json = {
						label:item.entName,
						value:item.tenantId,
					}
					_list.push(json)
				})
				that.isp_list = _list
				
			})
		},
		loader_site: function (searchs) {
			let that = this;
			if(searchs.length==0){
				return this.siteList=[];
			}
			getStationList( {name:searchs.join(',')}, {})
				.then((res) => {
					let _list = [];
					res.data.map((item) => {
						_list.push({
							label: item.stationName,
							value: item.id,
						});
					});
					that.siteList = _list;
				})
				.catch((error) => {
			});
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
					this.jump(`/order/orderInfo?id=${row.id}&state=true&&defaultCurrent=${this.defaultCurrent}&&defaultSize=${this.defaultSize}&&form=${JSON.stringify(this.form)}`);
					break;
				case "sendOrder":
					//指定接单人员
					this.directWriter(row);
					break;
			}
		},
		directWriter(e) {
			this.codearea=e.area
			this.codeListData.orderId=e.id
			this.dialogVisible=true
		},
		focus(){
			zpList({areaList:this.codearea}).then(res=>{
				this.options=res.data.map((el,index)=>{
					return {value:el.id,label:el.nickName}
				})

			})
		},
		changeArea(val, type) {
			let that = this;
			let array=[];
			val.map(item=>{
				array.push(item[2])
			})
			that.regionList=val;
			that.$set(this.form, 'siteInfoId', null);
			that[type].area=array.join(',');
			that.loader_site(array);
		},
		resetForm() {
			this.form = {};
			this.siteList=[];
			this.regionList=[];
			this.$refs.form.resetFields();
			this.$set(this.form, 'orderTypeCode', this.activeType=='all'?'':this.activeType);
			this.$set(this.form, 'workOrderStatus', this.activeId=='all'?'':this.activeId);
			this.$nextTick(() => {
				this.$refs.table.resetInit();
			})
		},
		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
				this.$refs.table?.resetInit();
			});
		},
		closedialog(){
			this.value=""
		},
		designate(){
			if (!this.value) {
				this.$refs.mySelect.focus();
				this.$message({
					message: '请选择指派人员',
					type: 'warning'
				});
				return false;
			}
			this.codeListData.userId=this.value
			dispatcherOrder(this.codeListData).then(res=>{
				this.dialogVisible=false
				this.$message({
					type:'success',
					message:'操作成功'
				})
				this.$refs.table?.resetInit();
	  	 	})
		},
  },
};
</script>
<style lang="scss" scoped>
@import "./receipt/index.scss";
.topformbox{

}
.app-container {
	font-size: 0;
	position: relative;
	height: 100%;
	background: transparent;
	.eltabs{
		height: auto;
	}
	.orderTypeBox{
		width: 106%;
		height: 40px;
		margin-left: -20px;
		margin-top: -20px;
		background: #fff;
		margin-bottom: 20px;
		align-items: center;
		.label{
			margin: 0 20px;
			height: 100%;
			line-height: 40px;
			font-size: 14px;
			cursor: pointer;
			&.actived{
				border-bottom: 1px solid #4365AC;
				color: #4365AC;
			}
		}
	}
	.form {
		margin-top: 16px;
	}
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
.auditStatusColor{
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 5px;
  display: inline-block;
}
.searchiconbox{
	width: 50px;
	height: 50px;
	font-size: 40px;
	margin-left: 20px;
}
</style>
