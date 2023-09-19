<template>
	<div class="app-container disp_flex flex_column">
		<div class="disp_flex orderTypeBox">
			<div class="label" :class="activeType=='all'?'actived label':'label'" @click="changeType('all')">全部工单</div>
			<div v-for="item in orderTypeList" :key="item.value" :class="activeType==item.value?'actived label':'label'" @click="changeType(item.value)">{{item.label}}</div>
		</div>
		<el-card shadow="hover" :body-style="{padding: 10}">
			<el-form ref="form" inline :model="form" class="form business-form disp_flex" label-width="0px">
				<div class="flex">
					<el-form-item label="" prop="serialNumber">
						<el-input placeholder="请输入工单编号" clearable v-model="form.serialNumber" > </el-input>
					</el-form-item>
					<el-form-item label="" prop="orderTypeCode" v-if="activeType=='all'">
						<el-select ref="orderType" v-model="form.orderTypeCode" clearable  placeholder="工单类型" @change="changeOrderType">
							<el-option v-for="item in orderTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="" prop="orderSecondTypeCode">
						<el-select v-model="form.orderSecondTypeCode" clearable placeholder="工单二级类型" >
							<el-option v-for="item in orderTypeSecondList" :key=" item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="" prop="exceptionStatus" v-if="activeId=='all'">
						<el-select v-model="form.exceptionStatus" clearable  placeholder="工单状态">
							<el-option v-for="item in stateDataList" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="" prop="orderUrgency" >
						<el-select v-model="form.orderUrgency" clearable placeholder="紧急程度">
							<el-option v-for="item in orderUrgencyList" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<!-- <el-form-item label="运营商：" prop="operatorId">
						<el-select v-model="form.operatorId" clearable >
							<el-option v-for="item in isp_list" :key="'isp' + item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item> -->
					<el-form-item label="" prop="dist">
						<areaSelect  ref="areaSelect" @change="changeArea($event, 'form')"   :value="regionList" :ismultiple="true" :isCollapse="true"></areaSelect>
					</el-form-item>
					<el-form-item label="" prop="siteInfoId">
						<el-select v-model="form.siteInfoId" clearable placeholder="站点">
							<el-option v-for="item in siteList" :key="'siteId' + item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="" prop="createTime" >
						<el-date-picker
							v-model="createTime"
							type="datetimerange"
							@change="changeTime($event, 'form')"
							range-separator="至"
							value-format="yyyy-MM-dd HH:mm:ss"
							:clearable="false"
							start-placeholder="开始日期"
							end-placeholder="结束日期">
						</el-date-picker>
					</el-form-item>
				</div>
				<div class="disp_flex">
					<el-form-item>
						<el-button  type="primary" v-hold-click @click="submitForm('form')">查询</el-button>
						<el-button  v-hold-click @click="resetForm('form')">重置</el-button>
					</el-form-item>
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
			<m-table height="90%" v-if="isShow" :columns="columns" :defaultSize="defaultSize" :defaultCurrent="defaultCurrent" @update:current="updateCurrent" @update:size="updateSize"   :request="getExceptionOrderPage" :payload="form" :loading.sync="loading" ref="table" :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" >
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
				<el-table-column slot="workOrderStatusName" label="工单状态"  width="120">
					<template  v-slot="{ row }">
						<span class="auditStatusColor" style="background-color: #F5222D;" v-if="row.workOrderStatusName=='工单被退回'"></span>
						<span class="auditStatusColor" style="background-color: #FF7600;" v-else-if="row.workOrderStatusName=='超时未回单'"></span>
						<span class="auditStatusColor" style="background-color: #BFBFBF;" v-else></span>
						<span>{{ row.workOrderStatusName }}</span>
					</template>
				</el-table-column>
				<el-table-column slot="Action" label="操作" width="160" fixed="right">
					<template v-slot="{ row }">
						<el-button type="text" v-hold-click @click.stop="doCommand('info', row)" v-if="perms.includes('sys:orderError:detail')&&row.exceptionStatus!=20"> 详情 </el-button>
						<el-button type="text" v-hold-click @click.stop="doCommand('back', row)" v-if="perms.includes('sys:orderError:back')&&row.exceptionStatus === 36"> 退回运营商 </el-button>
					</template>
				</el-table-column>
			</m-table>
		</el-card>
	</div>
</template>
<script>
import basic from "@/mixins/basic";
import { returnToOperator } from "@/api/order";
import { getDictTypesItem } from "@/api/dict";
import { getLabel, getClass } from "@/utils/dict";
import { deepClone } from "@/utils";

import areaSelect from "@/components/custom/areaSelectAll";
import mTable from "@c/business/table";
import {page } from "@/api/isp";
import { getStationList } from "@/api/area";
import{getExceptionOrderPage,getWorkOrderTypeData} from "./api";

export default {
	data() {
		return {
			isXjSearch:false,
			stateDataList: [
				{
					"value": "36",
					"label": "工单被退回"
				},
				{
					"value": "34",
					"label": "超时未回单"
			}],
			orderTypeList:[],
			orderUrgencyList:[],
			xjTypeList:[],
			isp_list:[],
			siteList:[],
			createTime:[],
			columns: [
				{label: '序号', slot:'index', width: 60},
				{label: '工单类型', prop: 'orderTypeName'},
				{label: '工单二级类型', prop: 'orderSecondTypeName'},
				{label: '工单编号', prop: 'serialNumber', width: 180},
				{label: '所属区域', slot: 'areaName', width: 180},
				{label: '基站名称', prop: 'siteName', width: 180},
				{label: '执行周期', slot: 'orderExecuteStartTime', width: 180},
				{label: '工单状态', slot: 'workOrderStatusName'},
				{label: '紧急程度', prop: 'orderUrgencyName'},
				{label: '操作', slot: 'Action'}
			],
			form: {},
			activeId: 'all',
			activeType:'all',
			orderTypeSecondList:[],
			regionList:[],
			defaultSize:10,
      		defaultCurrent:1,
			isShow:true,
			perms:[]
		};
	},
	mixins: [basic],
	components: {areaSelect,mTable},
	mounted(){
		var that = this
		// 运营商数据
		// that.loader_isp()
		that.getInitPage()
		that.perms = that.$store.getters.user.perms;
		if(this.getRouterValue('defaultCurrent')){
			this.defaultCurrent=Number(this.getRouterValue('defaultCurrent')) 
		}
		if(this.getRouterValue('defaultSize')){
			this.defaultSize=Number(this.getRouterValue('defaultSize')) 
		}
		if(this.getRouterValue('form')){
			this.form=JSON.parse(this.getRouterValue('form'))
			if(this.form.startDate){
				this.createTime=[this.form.startDate,this.form.closeDate]
			}
			if(this.form.orderTypeCode){
				this.getWorkOrderType(this.form.orderTypeCode)
			}
			if(this.form.orderTypeCode){
				this.activeType=this.form.orderTypeCode;
			}
			if(this.form.exceptionStatus){
				this.activeId=this.form.exceptionStatus;
			}
		}
	},
	methods: {
		handleClick(tab, event){
			this.isShow=false;
			if(this.activeId=='all'){
				this.form.exceptionStatus='';
				
			}else{
				this.form.exceptionStatus=this.activeId;
			}
			this.$set(this.form, 'orderSecondTypeCode', null)
			this.$set(this.form, 'serialNumber', null);
			this.$set(this.form, 'orderUrgency', null);
			this.$set(this.form, 'province', null);
			this.$set(this.form, 'city', null);
			this.$set(this.form, 'area', null);
			this.$set(this.form, 'siteInfoId', null);
			this.$nextTick(() => {
				this.isShow=true;
				this.$refs.form.validate((valid) => {
					this.$refs.table?.resetInit();
					
				});
			})
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
		},
		getExceptionOrderPage,
		changeType(val){
			this.activeType=val;
			this.activeId='all'
			this.form.orderTypeCode=(val=='all'?'':val)
			this.getWorkOrderType(this.activeType)
			this.$set(this.form, 'orderSecondTypeCode', null)
			this.$set(this.form, 'serialNumber', null);
			this.$set(this.form, 'orderUrgency', null);
			this.$set(this.form, 'exceptionStatus', null);
			this.$set(this.form, 'area', null);
			this.$set(this.form, 'siteInfoId', null);
			this.$nextTick(() => {
				this.$refs.table.resetInit();
			})
		},
		getRouterValue(key) {
			return this.$route.query?.[key]
		},
		changeOrderType(val){
			this.getWorkOrderType(val)
		},	
		updateCurrent(val){
			this.defaultCurrent=val;
		},
		updateSize(val){
			this.defaultSize=val;
		},
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
			page({name:'page',method:'get'},{current:1,size:9999},{}).then(res=>{
				let _list = [],
					_data = res.data.records || []

				_data.map(item=>{
					var json = {
						label:item.companyName,
						value:item.operatorId,
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
					this.jump(`/order/orderInfo?id=${row.id}&defaultCurrent=${this.defaultCurrent}&defaultSize=${this.defaultSize}&form=${JSON.stringify(this.form)}`);
					break;
				case "back":
					//退回 
					this.returnToOrder(row);
					break;
				case "stop":
					this.$message({
						message: '该功能尚未开放',
						type: 'el-info'
					})
					break;
			}
		},
		returnToOrder:function(row){
			var that = this
			this.$confirm('是否将本工单退回运营商？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				customClass:'del-model',
				type: 'warning'
			}).then(() => {
				returnToOperator( {id:row.id,status:37} ).then((res) => {
					this.$message({
						message: '退回成功',
						type: 'success'
					})
					that.$refs.table.resetInit();
				});
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消'
				});          
			});
			
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
		changeTime(val, type){
			let that = this;
			that.createTime=val;
			if(val==null){
				delete that[type].startDate;
				delete that[type].closeDate;
			}else{
				that[type].startDate = val[0];
				that[type].closeDate = val[1];
			}
		},
		resetForm() {
			this.form = {};
			this.createTime=[],
			this.regionList=[];
			this.siteList=[],
			this.$refs.form.resetFields();
			this.$set(this.form, 'orderTypeCode', this.activeType=='all'?'':this.activeType);
			this.$set(this.form, 'exceptionStatus', this.activeId=='all'?'':this.activeId);
			this.$nextTick(() => {
				this.$refs.table.resetInit();
			})
		},
		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
				this.$refs.table?.resetInit();
			});
		},
  },
};
</script>
<style lang="scss" scoped>
@import "./receipt/index.scss";
.app-container {
	font-size: 0;
	position: relative;
	height: 100%;
	background: transparent;
	.eltabs{
		height: auto;
	}
	.orderTypeBox{
		width: 102.2%;
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
			flex-shrink:0;
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
</style>
