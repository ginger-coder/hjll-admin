<!--
  功能：工单价格设置
  作者：bianxiaokai
  时间：2023年08月27日 14:56:21
-->
<template>
	<div class="price-container">
		<el-card shadow="hover" class="m-card-full-body">
			<div ref="pageHead">
				<el-form
					ref="queryForm"
					:model="queryParams"
					class="form_horizontal"
				>
					<el-form-item label="工单类型：">
						<el-select
							v-model="queryParams.workerType"
							placeholder="请选择工单类型"
							style="width: 100%"
							@change="workOrderhandleChange"
						>
							<el-option
								:label="item.label"
								:value="item.value"
								v-for="item in orderTypeList"
								:key="item.value"
							></el-option>
						</el-select>
					</el-form-item>
					<!-- <el-form-item label="工单细分类型：">
						<el-cascader
							v-model="orderTypeChArr"
							:options="orderTypeChildrenList"
							
						>
						</el-cascader>
					</el-form-item> -->
					<el-form-item label="工单细分类型：">
						<el-select
							v-model="queryParams.workerSecondType"
							placeholder="请选择工单细分类型"
							clearable
						>
							<el-option
								:label="item.label"
								:value="item.value"
								v-for="item in orderTypeInfoList"
								:key="item.value"
							></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button
							type="primary"
							v-hold-click
							@click="searchForm('queryParams')"
							>查询</el-button
						>
						<el-button
							v-hold-click
							@click="resetForm('queryParams')"
							>重置</el-button
						>
						<el-button
							type="primary"
							v-hold-click
							@click="onCreateVisible"
							>新增</el-button
						>
					</el-form-item>
				</el-form>
			</div>
		</el-card>
		<el-card
			shadow="hover"
			v-loading="loading"
			style="margin-top: 24px"
			:body-style="{ height: '100%', paddingBottom: '80px' }"
			class="m-card-full-body flex"
		>
			<mTable
				ref="mTable"
				height="100%"
				:loading.sync="loading"
				:columns="columns"
				:request="getOrderPriceList"
				:payload="queryParams"
			>
				<el-table-column slot="index" label="序号">
					<template slot-scope="scope">
						{{
							scope.$index +
							1 +
							($refs.mTable.current - 1) * $refs.mTable.size
						}}
					</template>
				</el-table-column>
				<el-table-column slot="priceFactor" label="价格因素">
					<template slot-scope="scope">
						{{ getPriceListInfo(scope.row.priceFactor) }}
					</template>
				</el-table-column>
				<el-table-column slot="rseStatus" label="状态">
					<template slot-scope="scope">
						<el-switch
							v-model="scope.row.useStatus"
							active-value="1"
							inactive-value="-1"
							@change="onChangeStatus(scope.row)"
						>
						</el-switch>
					</template>
				</el-table-column>
				<template slot="action">
					<el-table-column label="操作" width="138">
						<template v-slot="{ row }">
							<el-button
								type="text"
								v-hold-click
								@click.stop="onEdit('edit', row)"
							>
								编辑
							</el-button>
							<el-button
								type="text"
								v-hold-click
								@click.stop="onEdit('info', row)"
							>
								详情
							</el-button>
						</template>
					</el-table-column>
				</template>
			</mTable>
		</el-card>
		<!--  编辑   -->
		<el-dialog
			:visible.sync="editVisible"
			:title="dialogTitle"
			class="el-dialog-unify el-dialog-medium"
			width="1080px"
			@close="onClose"
		>
			<el-form
				ref="form"
				:model="infoEditData"
				label-width="130px"
				label-position="top"
				:disabled="dialogType == 'info'"
			>
				<el-form-item label="工单类型：">
					<el-cascader
						v-model="infoEditData.workOrderTypeList"
						:options="orderTypeChildrenList"
						@change="orderEditTypeChange"
					>
					</el-cascader>
				</el-form-item>
				<el-form-item label="价格因素：">
					<el-checkbox-group
						v-model="workOrderEffectFactorsType"
						@change="workOrderEffectFactorsChange"
					>
						<el-checkbox
							v-for="item in priceTypeList"
							:label="item.value"
							name="type"
							>{{ item.label }}</el-checkbox
						>
					</el-checkbox-group>
				</el-form-item>
				<el-divider></el-divider>
				<el-form-item
					label="项目价格"
					v-if="workOrderEffectFactorsType.indexOf(1) > -1"
				>
					<el-row :gutter="10">
						<el-col :span="6">
							<el-select
								v-model="infoEditData.projectPriceType"
								placeholder="请选择工单类型"
								style="width: 100%"
								@change="infoEditData.projectPrice = ''"
							>
								<el-option
									label="单个项目累计金额"
									value="1"
								></el-option>
								<el-option
									label="项目整包"
									value="2"
								></el-option>
							</el-select>
						</el-col>
						<el-col :span="6"
							><el-input
								style="width: 100%"
								v-if="infoEditData.projectPriceType == 2"
								placeholder="请输入"
								v-model="infoEditData.projectPrice"
								@input="changeValue"
							>
								<template slot="append">元/单</template>
							</el-input></el-col
						>
					</el-row>
				</el-form-item>
				<template v-for="item in workTypeMap">
					<el-form-item
						:key="item.index"
						:label="item.label"
						v-if="
							workOrderEffectFactorsType.indexOf(2) > -1 &&
							item.index == 2
						"
					>
						<el-row :gutter="10" class="line-item">
							<el-col :span="3" style="text-align: right"
								>基础里程费</el-col
							>
							<el-col :span="6">
								<el-input
									style="width: 100%"
									v-model="item.children[0].pricing"
									@input="changeValue"
								>
									<template slot="append">元</template>
								</el-input>
							</el-col>
							<el-col :span="1" style="text-align: center"
								>/</el-col
							>
							<el-col :span="6">
								<el-input
									style="width: 100%"
									v-model="item.children[0].startRule"
									@input="changeValue"
								>
									<template slot="append">公里</template>
								</el-input>
							</el-col>
						</el-row>
						<el-row :gutter="10" class="line-item">
							<el-col :span="3" style="text-align: right"
								>超出里程费</el-col
							>
							<el-col :span="4">
								<el-input
									style="width: 100%"
									v-model="item.children[1].startRule"
									@input="changeValue"
								>
									<template slot="append">公里</template>
								</el-input>
							</el-col>
							<el-col :span="1" style="text-align: center"
								>至</el-col
							>
							<el-col :span="4">
								<el-input
									style="width: 100%"
									v-model="item.children[1].endRule"
									@input="changeValue"
								>
									<template slot="append">公里</template>
								</el-input>
							</el-col>
							<el-col :span="5">
								<el-input
									style="width: 100%"
									v-model="item.children[1].pricing"
									@input="changeValue"
								>
									<template slot="append">元 / 公里</template>
								</el-input>
							</el-col>
							<el-col :span="4">
								<el-button
									type="info"
									icon="el-icon-plus"
									circle
									size="mini"
								></el-button>
								<el-button
									type="info"
									icon="el-icon-minus"
									circle
									size="mini"
								></el-button>
							</el-col>
						</el-row>
					</el-form-item>
					<el-form-item
						:key="item.index"
						:label="item.label"
						v-if="
							workOrderEffectFactorsType.indexOf(3) > -1 &&
							item.index == 3
						"
					>
						<el-row :gutter="10" class="line-item">
							<el-col :span="3" style="text-align: right"
								>响应时间费</el-col
							>
							<el-col :span="9">
								<el-col :span="11">
									<el-input
										v-model="item.children[0].startRule"
										@input="changeValue"
									>
										<template slot="append">分钟</template>
									</el-input>
								</el-col>
								<el-col :span="2" style="text-align: center">
									至
								</el-col>
								<el-col :span="11">
									<el-input
										v-model="item.children[0].endRule"
										@input="changeValue"
									>
										<template slot="append">分钟</template>
									</el-input>
								</el-col>
							</el-col>
							<el-col :span="4">
								<el-input
									style="width: 100%"
									v-model="item.children[0].pricing"
									@input="changeValue"
								>
									<template slot="append">元</template>
								</el-input>
							</el-col>
							<el-col :span="4">
								<el-button
									type="info"
									icon="el-icon-plus"
									circle
									size="mini"
								></el-button>
								<el-button
									type="info"
									icon="el-icon-minus"
									circle
									size="mini"
								></el-button>
							</el-col>
						</el-row>
						<el-row :gutter="10" class="line-item">
							<el-col :span="3" style="text-align: right"
								>处理时间费</el-col
							>
							<el-col :span="9">
								<el-col :span="11">
									<el-input
										v-model="item.children[1].startRule"
										@input="changeValue"
									>
										<template slot="append">分钟</template>
									</el-input>
								</el-col>
								<el-col :span="2" style="text-align: center">
									至
								</el-col>
								<el-col :span="11">
									<el-input
										v-model="item.children[1].endRule"
										@input="changeValue"
									>
										<template slot="append">分钟</template>
									</el-input>
								</el-col>
							</el-col>
							<el-col :span="4">
								<el-input
									style="width: 100%"
									v-model="item.children[1].pricing"
									@input="changeValue"
								>
									<template slot="append">元</template>
								</el-input>
							</el-col>
							<el-col :span="4">
								<el-button
									type="info"
									icon="el-icon-plus"
									circle
									size="mini"
								></el-button>
								<el-button
									type="info"
									icon="el-icon-minus"
									circle
									size="mini"
								></el-button>
							</el-col>
						</el-row>
					</el-form-item>
					<el-form-item
						:key="item.index"
						:label="item.label"
						v-if="
							workOrderEffectFactorsType.indexOf(4) > -1 &&
							item.index == 4
						"
					>
						<el-row :gutter="10" class="line-item">
							<el-col :span="9">
								<el-col :span="8" style="text-align: right"
									>证件类型</el-col
								>
								<el-col :span="16">
									<el-select
										v-model="item.children[0].startRule"
										placeholder="请选择证件类型"
										style="width: 100%"
									>
										<el-option
											:label="item.certificateName"
											:value="item.certificateName"
											v-for="item in orderBookList"
											:key="item.id"
										></el-option>
									</el-select>
								</el-col>
							</el-col>
							<el-col :span="8">
								<el-col :span="9" style="text-align: right"
									>影响系数</el-col
								>
								<el-col :span="15">
									<el-input
										style="width: 100%"
										v-model="item.children[0].pricing"
										@input="changeValue"
									></el-input>
								</el-col>
							</el-col>
							<el-col :span="4">
								<el-button
									type="info"
									icon="el-icon-plus"
									circle
									size="mini"
								></el-button>
								<el-button
									type="info"
									icon="el-icon-minus"
									circle
									size="mini"
								></el-button>
							</el-col>
						</el-row>
					</el-form-item>
				</template>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button size="small" @click="onClose">取消</el-button>
					<el-button size="small" type="primary" @click="onSubmit"
						>确认</el-button
					>
				</span>
			</template>
		</el-dialog>
	</div>
</template>
<script>
import {
	getOrderPriceList,
	workOrderType,
	getListForOrder,
	getOrderPriceDetail,
	getOrderPriceEdit,
	orderChangeStatus,
} from '@/api/order';
import mTable from '@c/business/table';
import _ from 'lodash';

const defaultForm = {
	priceFactor: '', // 价格因素[多因素用逗号分割] 1:项目价格 2:里程 3:时间 4:天气)
	projectPrice: '', // 项目价格
	projectPriceType: '', // 项目价格类型
	workOrderEffectFactors: [
		// 	工单定价影响因素集合
		// {
		// 	endRule: '', // 结束规则
		// 	pricing: '', // 价格配置 或 权重配置
		// 	ruleType: 0, // 规则类型(1:项目价格 2:基础里程配置 3:超出里程配置 4:响应时间配置 5:处理时间配置 6:证件补贴配置)
		// 	startRule: '', // 开始规则
		// },
	],
	workOrderTypeList: [],
	workOrderSecondType: '', // 工单细类
	workOrderSecondTypeName: '', // 工单细类类型名称
	workOrderType: '', // 工单类型
	workOrderTypeName: '', // 工单类型名称
};
const defaultWorkTypeMap = [
	{
		index: 2,
		label: '里程费：',
		children: [
			{
				endRule: '',
				pricing: '',
				ruleType: 2,
				startRule: '',
			},
			{
				endRule: '',
				pricing: '',
				ruleType: 3,
				startRule: '',
			},
		],
	},
	{
		index: 3,
		label: '时间费：',
		children: [
			{
				endRule: '',
				pricing: '',
				ruleType: 4,
				startRule: '',
			},
			{
				endRule: '',
				pricing: '',
				ruleType: 5,
				startRule: '',
			},
		],
	},
	{
		index: 4,
		label: '特种证件补贴费：',
		children: [
			{
				endRule: '',
				pricing: '',
				ruleType: 6,
				startRule: '',
			},
		],
	},
];
export default {
	components: {
		mTable,
	},
	data() {
		return {
			workOrderEffectFactorsType: [],
			workTypeMap: _.cloneDeep(defaultWorkTypeMap),
			loading: false,
			signTypeData: [],
			dialogTitle: '新增',
			editVisible: false,
			dialogType: 'create',

			infoEditData: _.cloneDeep(defaultForm),
			queryParams: {},
			priceTypeList: [
				{
					label: '项目价格',
					value: 1,
				},
				{
					label: '里程费',
					value: 2,
				},
				{
					label: '时间费',
					value: 3,
				},
				{
					label: '特种证件补贴费',
					value: 4,
				},
			],
			orderTypeArr: [],
			columns: [
				{
					label: '序号',
					slot: 'index',
				},
				{
					label: '工单类型',
					prop: 'workOrderTypeName',
				},
				{
					label: '工单细分类型',
					prop: 'workOrderSecondTypeName',
				},
				{
					label: '价格因素',
					slot: 'priceFactor',
				},
				{
					slot: 'rseStatus',
				},
				{
					slot: 'action',
				},
				{
					label: '备注',
					prop: 'remark',
				},
			],
			orderTypeChildrenList: [],
			orderTypeInfoList: [],
			orderTypeList: [],
			orderBookList: [],
		};
	},
	mounted() {
		this.initOrderList();
		this.initBookList();
	},
	methods: {
		getOrderPriceList,
		workOrderEffectFactorsChange(value) {
			this.infoEditData.priceFactor = value.join(',');
			this.workTypeMap.forEach((el) => {
				if (!value.includes(el.index)) {
					el.children = el.children.map((e) => {
						e.startRule = '';
						e.endRule = '';
						e.pricing = '';
						return e;
					});
				}
			});
			if (value.indexOf(1) < 0) {
				this.infoEditData.projectPriceType = '';
				this.infoEditData.projectPrice = '';
			}
		},
		getPriceListInfo(row) {
			const data = row.split(',').map((el) => {
				const item = this.priceTypeList.find((e) => e.value == el);
				return item.label;
			});
			return data.join(',');
		},
		orderEditTypeChange(value) {
			let item = this.orderTypeChildrenList.find(
				(el) => el.value == value[0]
			);
			let childItem = item.children.find((el) => el.code == value[1]);

			this.infoEditData.workOrderSecondType = childItem.value;
			this.infoEditData.workOrderSecondTypeName = childItem.label;
			this.infoEditData.workOrderType = item.value;
			this.infoEditData.workOrderTypeName = item.label;
		},
		workOrderhandleChange(value) {
			this.orderTypeInfoList = this.orderTypeChildrenList.find(
				(el) => el.value == value
			).children;
		},
		initBookList() {
			getListForOrder().then((res) => {
				this.orderBookList = res.data || [];
			});
		},
		initOrderList() {
			workOrderType({ method: 'get', name: 'getAllWorkOrderType' }).then(
				(res) => {
					this.orderTypeList = res.data.map((item) => {
						return {
							label: item.name,
							value: item.code,
							code: item.code,
						};
					});
					this.orderTypeChildrenList = res.data.map((item) => {
						let array = [];
						if (item.orderTypeDetailList) {
							item.orderTypeDetailList.map((items) => {
								array.push({
									label: items.name,
									value: items.code,
									code: items.code,
								});
							});
						}
						return {
							label: item.name,
							value: item.code,
							code: item.code,
							children: array.length > 0 ? array : null,
							workOrderTypeXunJian: '',
						};
					});
				}
			);
		},
		onChangeStatus(row) {
			orderChangeStatus({
				id: row.id,
				useStatus: row.useStatus,
			}).then((res) => {
				this.$message('状态更新成功');
				this.$refs.mTable.resetInit();
			});
		},
		onSubmit() {
			if (this.dialogType == 'create' || this.dialogType == 'edit') {
				let arr = [];
				this.workTypeMap.forEach((el) => {
					arr = [...arr, ...el.children];
				});
				arr = arr.filter((el) => {
					return el.endRule || el.pricing || el.startRule;
				});
				let params = Object.assign(this.infoEditData, {
					workOrderEffectFactors: arr,
				});
				// 创建
				getOrderPriceEdit(params).then((res) => {
					this.editVisible = false;
					this.$refs.mTable.resetInit();
				});
			}

			if (this.dialogType == 'info') {
				this.editVisible = false;
				// 初始化
				this.infoEditData = _.cloneDeep(defaultForm);
			}
		},
		onCreateVisible() {
			this.dialogTitle = '创建';
			this.dialogType = 'create';
			this.editVisible = true;
			this.workTypeMap = _.cloneDeep(defaultWorkTypeMap);
			this.workOrderEffectFactorsType = [];
		},
		changeValue() {
			this.$forceUpdate();
		},
		onEdit(type, row) {
			this.dialogTitle = type == 'edit' ? '编辑' : '详情';
			this.dialogType = type;
			this.workTypeMap = _.cloneDeep(defaultWorkTypeMap);
			this.editVisible = true;
			// 详情接口
			getOrderPriceDetail({
				id: row.id,
			}).then((res) => {
				this.infoEditData = _.cloneDeep(res.data);
				this.workOrderEffectFactorsType =
					res.data.priceFactor.split(',').map(el => Number(el));
				res.data.workOrderEffectFactors.forEach((el) => {
					// if (el.ruleType == 1) {
					// 	this.workTypeMap[0].children = [el];
					// }
					if (el.ruleType == 2) {
						this.workTypeMap[0].children[0] = el;
					}
					if (el.ruleType == 3) {
						this.workTypeMap[0].children[1] = el;
					}
					if (el.ruleType == 4) {
						this.workTypeMap[1].children[0] = el;
					}
					if (el.ruleType == 5) {
						this.workTypeMap[1].children[1] = el;
					}
					if (el.ruleType == 6) {
						this.workTypeMap[2].children = [el];
					}
				});
				setTimeout((e) => {
					this.$forceUpdate();
				}, 500);
				// 工单类型
				this.infoEditData.workOrderTypeList = [
					res.data.workOrderType,
					res.data.workOrderSecondType,
				];
			});
		},
		onClose() {
			this.infoEditData = _.cloneDeep(defaultForm);
			this.editVisible = false;
		},
		handleStatus(id) {},
		searchForm() {
			this.$refs.mTable.resetInit();
		},
		resetForm() {
			this.orderTypeInfoList = [];
			this.queryParams = {};
			this.$refs.mTable.resetInit();
		},
	},
};
</script>
<style lang="scss" scoped>
.price-container {
	height: 100%;
	display: flex;
	flex-direction: column;
}
.line-item {
	margin-bottom: 10px;
	&:last-of-type(1) {
		margin-bottom: 0;
	}
}
.addOrRemove {
	font-size: 20px;
	color: #ddd;
	font-weight: bold;
}
</style>
