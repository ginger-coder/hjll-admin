<template>
	<div style="height: 100%">
		<el-card shadow="hover" class="m-card-full-body flex">
			<div ref="pageHead">
				<el-form ref="searchs" :model="searchs" class="form_horizontal">
					<el-form-item label="企业名称：" prop="keyword">
						<el-input
							placeholder="请输入企业名称"
							clearable
							v-model="searchs.entName"
						></el-input>
					</el-form-item>
					<el-form-item label="企业认证方式：" prop="authWay">
						<el-select v-model="searchs.authWay" clearable>
							<el-option
								v-for="item in signTypeData"
								:key="'state' + item.value"
								:label="item.label"
								:value="item.value"
							></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="企业认证状态：" prop="authStatus">
						<el-select v-model="searchs.authStatus" clearable>
							<el-option
								v-for="item in signStatusData"
								:key="'state' + item.value"
								:label="item.label"
								:value="item.value"
							></el-option>
						</el-select>
					</el-form-item>
					<el-form-item
						label="协议签署状态："
						prop="agreementSignStatus"
					>
						<el-select
							v-model="searchs.agreementSignStatus"
							clearable
						>
							<el-option
								v-for="item in pdfSignStatusData"
								:key="'state' + item.value"
								:label="item.label"
								:value="item.value"
							></el-option>
						</el-select>
					</el-form-item>
					<el-form-item> </el-form-item>
				</el-form>
				<div v-if="perOperate" class="page_handle_group">
					<el-button
						type="primary"
						v-hold-click
						@click="submitForm('searchs')"
						>查询</el-button
					>
					<el-button v-hold-click @click="resetForm('searchs')"
						>重置</el-button
					>
					<!-- <el-button
						type="primary"
						v-hold-click
						@click="jump('/isp/ispCreate')"
						plain
						>新增</el-button
					>
					<el-button
						type="primary"
						v-hold-click
						plain
						@click="exportBtn"
						>导出</el-button
					> -->
				</div>
			</div>
		</el-card>
		<el-card
			shadow="hover"
			v-loading="loading"
			style="margin-top: 24px; height: 80%"
			:body-style="{ height: '100%' }"
			class="m-card-full-body flex"
		>
			<mTable
				ref="mTable"
				height="100%"
				:loading.sync="loading"
				:columns="columns"
				:request="companyPage"
				:payload="searchs"
				:hideOnSinglePage="false"
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
				<!-- <el-table-column
					label="认证状态"
					width="140"
					slot="checkStatus"
					:filters="checkStatusData"
					:filter-method="filterCheckStatus"
				>
					<template v-slot="{ row }">
						<span
							v-if="row.checkStatus !== null"
							:class="dotClass(row.checkStatus)"
							>●</span
						>
						{{ label(checkStatusData, row.checkStatus) }}
					</template>
				</el-table-column>
				<el-table-column
					label="验证审核结果"
					width="140"
					slot="authenStatus"
					:filters="authenStatusData"
					:filter-method="filterAuthenStatus"
				>
					<template v-slot="{ row }">
						<span
							v-if="row.authenStatus !== null"
							:class="dotClass(row.authenStatus)"
							>●</span
						>
						{{ label(authenStatusData, row.authenStatus) }}
					</template>
				</el-table-column> -->
				<template slot="action">
					<el-table-column label="操作" width="138" fixed="right">
						<template v-slot="{ row }">
							<el-button
								type="text"
								v-hold-click
								@click.stop="doCommand('info', row)"
							>
								详情
							</el-button>
							<el-button
								v-if="
									row.agreementSignStatus == '未发起' ||
									row.agreementSignStatus == '已拒签'
								"
								type="text"
								v-hold-click
								@click.stop="doCommand('sign', row)"
							>
								发起签约
							</el-button>
							<el-button
								v-if="row.agreementSignStatus == '待签署'"
								type="text"
								v-hold-click
								@click.stop="doCommand('back', row)"
							>
								撤消
							</el-button>
							<el-button
								v-if="row.agreementSignStatus == '已完成'"
								type="text"
								@click="allocation(row)"
								>分配资源</el-button
							>
						</template>
					</el-table-column>
				</template>
			</mTable>
		</el-card>
		<!--  通过   -->
		<el-dialog
			:visible.sync="money.verify.visible"
			title="输入验证金额"
			width="30%"
		>
			<div
				style="
					width: 100%;
					height: 60px;
					display: flex;
					align-items: center;
				"
			>
				<span style="min-width: 60px; margin-right: 1rem"
					>验证金额:</span
				>
				<el-input
					placeholder="请输入验证金额"
					clearable
					v-model="money.verify.money"
				></el-input>
			</div>
			<template #footer>
				<span class="dialog-footer">
					<el-button size="small" text @click="() => doVerify()"
						>取消</el-button
					>
					<el-button
						size="small"
						type="primary"
						@click="() => doVerify(true)"
						>确认</el-button
					>
				</span>
			</template>
		</el-dialog>
		<el-dialog
			title="权限配置"
			:visible.sync="isShow"
			:lock-scroll="true"
			width="70%"
			@close="dialogCancel"
		>
			<treeMenu
				:data="treeData"
				:treeOriginData="treeOriginData"
				@getCheckOutArray="getCheckOutArray"
				@getCheckALLArray="getCheckALLArray"
				:checkArray="checkArray"
			></treeMenu>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" v-hold-click @click="dialogSubmit"
					>确 定</el-button
				>
				<el-button v-hold-click @click="dialogCancel">取 消</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
import basic from '@/mixins/basic';
import treeMenu from '@c/treeMenu';
import {
	companyPage,
	verifyMoney,
	removeCompany,
	audit,
	deleteEnterprise,
	cancelEnterprise,
} from '@/api/isp';
import {
	getMenuIdsForCompany,
	addMenus,
	updateMenusForCompany,
	getMenusResourcesForCompany,
} from '@/api/roles';

import accountForm from './components/accountForm';
import accountInfo from './components/accountInfo';
import mTable from '@c/business/table';
import { getLabel, ispStatus } from '@/utils/dict';

export default {
	components: {
		accountForm,
		accountInfo,
		mTable,
		treeMenu,
	},
	data() {
		return {
			isShow: false,
			moduleTitle: '账号',
			signTypeData: ispStatus.signType,
			signStatusData: ispStatus.signStatus,
			pdfSignStatusData: ispStatus.pdfSignStatus,
			columns: [
				{
					label: '序号',
					slot: 'index',
				},
				{
					label: '企业编号',
					prop: 'entCode',
				},
				{
					label: '注册手机号',
					prop: 'regMobile',
				},
				{
					label: '注册时间',
					prop: 'regTime',
				},
				{
					label: '企业名称',
					prop: 'entName',
				},
				{
					label: '工商注册号',
					prop: 'entQualificationNum',
				},
				{
					label: '企业认证方式',
					prop: 'authWay',
				},
				{
					label: '企业认证状态',
					prop: 'authStatus',
				},
				{
					label: '协议签署状态',
					prop: 'agreementSignStatus',
				},
				{
					label: '协议发起时间',
					prop: 'agreementStartTime',
				},
				{
					label: '协议截止时间',
					prop: 'agreementEndTime',
				},
				{
					label: '协议回签时间',
					prop: 'agreementSignTime',
				},
				{
					slot: 'action',
				},
			],
			searchs: {},
			money: {
				verify: {
					id: '',
					visible: false,
					money: '',
				},
			},

			treeData: [],
			treeOriginData: [],
			tenantId: '',
			roleId: '',
			checkArray: [],
			checkOutArray: [],
			checkALLArray: [],
			arrayList: [],
		};
	},
	mixins: [basic],
	mounted() {
		this.getMenusResourcesList();
	},
	methods: {
		companyPage,
		treeDataFun(data) {
			let arr = [];
			data.forEach((item) => {
				if (item.type == 1) {
					if (item.children) {
						arr.push({
							value: item.value,
							label: item.label,
							list: this.treeDataFun(item.children),
							type: item.type,
						});
					} else {
						arr.push({
							value: item.value,
							label: item.label,
							type: item.type,
						});
					}
				} else {
					if (item.children) {
						arr.push({
							value: item.value,
							label: item.label,
							children: this.treeDataFun(item.children),
							type: item.type,
						});
					} else {
						arr.push({
							value: item.value,
							label: item.label,
							type: item.type,
						});
					}
				}
			});
			return arr;
		},
		getMenusResourcesList() {
			getMenusResourcesForCompany({}, {}, {})
				.then((res) => {
					if (res.code == '0') {
						this.treeOriginData = res.data;
						this.treeData = this.treeDataFun(res.data);
					}
				})
				.catch((err) => {});
		},
		dialogCancel() {
			this.isShow = false;
			this.checkArray = [];
		},
		// 分配资源
		allocation(data) {
			this.isShow = true;
			this.tenantId = data.tenantId;
			this.roleId = data.roleId;
			this.checkOutArray = [];
			this.checkALLArray = [];
			this.arrayList = [];
			this.getMenuIdsList();
		},
		getCheckOutArray(checkOutArray) {
			this.checkOutArray = checkOutArray;
		},
		getCheckALLArray(checkALLArray) {
			console.log(checkALLArray);
			this.checkALLArray = checkALLArray;
		},
		getMenuIdsList() {
			getMenuIdsForCompany({}, { id: this.roleId }, {})
				.then((res) => {
					this.checkArray = res.data;
					this.checkOutArray = res.data;
					this.checkALLArray = res.data;
					this.arrayList = res.data;
				})
				.catch((err) => {});
		},
		// 权限分配
		dialogSubmit() {
			let that = this;
			console.log(that.checkALLArray);
			console.log(that.arrayList);
			if (that.arrayList == that.checkALLArray)
				return (that.isShow = false);
			addMenus(
				{},
				{},
				{ tenantId: this.tenantId, menuIds: this.checkALLArray }
			)
				.then((res) => {
					updateMenusForCompany(
						{},
						{ id: this.roleId },
						this.checkOutArray
					)
						.then((res) => {
							that.$message.success('分配成功');
							that.$refs.mTable?.resetInit();
							that.isShow = false;
							that.checkArray = [];
						})
						.catch((err) => {});
				})
				.catch((err) => {});
		},

		checkboxInit(row, index) {
			// 管理员账号不可删除
			return row.grade !== 10;
		},
		filter_page_row(row) {
			let that = this;

			row.name = row.name || row.account || '';

			row.roleno_names = row.roleno_names || '';
			row.roleName = row.roleno_names || '';

			row.stateName = '';
			row.stateName = that.filterDictLabel(that.stateData, row.state);
			return row;
		},
		label(list, value) {
			return getLabel(list, value);
		},
		dotClass(status) {
			switch (`${status}`) {
				case '1':
					return 'dot-success';
				case '2':
					return 'dot-error';
				default:
					return 'dot-normal';
			}
		},
		doCommand(command, row) {
			console.log('command', command);
			switch (command) {
				case 'info':
					this.jump(`/isp/ispInfo?id=${row.id}`);
					break;
				case 'sign':
					this.$router.push({
						path: '/isp/ispSign/card',
						query: {
							id: row.id,
							signatureId: row.signatureId,
							entQualificationNum: row.entQualificationNum,
							entName: row.entName,
							signatory: row.signatory,
						},
					});
					break;
				case 'back':
					this.table_back(row);
					console.log('撤消签约');
					break;
				case 'verify':
					break;
				case 'audit':
					this.jump(`/isp/ispAuditPage?id=${row.id}`);
					break;
				case 'edit':
					this.jump(
						`/isp/ispCreate?id=${row.id}&userId=${row.userId}`
					);
					break;
				case 'delete':
					this.table_remove(row);
					break;
				case 'qiyong':
					this.table_qiyong(row);
					break;
			}
		},
		table_qiyong: function (row) {
			var that = this;

			that.$confirm('确定弃用该数据吗', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					audit({ id: row.id, authenStatus: 3 })
						.then((res) => {
							that.$message.success('操作成功');
							that.$refs.mTable.resetInit();
						})
						.catch((err) => {});
				})
				.catch(() => {});
		},
		table_remove: function (row) {
			var that = this;

			that.$confirm('确定删除该数据吗', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					removeCompany({ id: row.id })
						.then((res) => {
							that.$message.success('删除成功');
							that.$refs.mTable.resetInit();
						})
						.catch((err) => {});
				})
				.catch(() => {});
		},
		table_back: function (row) {
			var that = this;
			that.$confirm('确定撤销该数据吗', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					cancelEnterprise({ id: row.id })
						.then((res) => {
							that.$message.success('撤销成功');
							that.$refs.mTable.resetInit();
						})
						.catch((err) => {});
				})
				.catch(() => {});
		},
		showVerify(id) {
			document.body.click();
			this.money.verify.id = id;
			this.money.verify.visible = true;
		},
		async doVerify(submit) {
			this.money.verify.visible = false;
			const money = Number.parseFloat(this.money.verify.money);

			if (submit && !Number.isNaN(money)) {
				verifyMoney({}, { id: this.money.verify.id, money })
					.then(() => {
						this.$message({
							message: '金额验证成功',
							type: 'success',
						});
						this.$refs.mTable.resetInit();
					})
					.catch(() => {
						this.$refs.mTable.resetInit();
					});
			}

			this.money.verify.money = '';
		},
		filterCheckStatus(value, row) {
			return row.checkStatus === value;
		},
		filterAuthenStatus(value, row) {
			return row.authenStatus === value;
		},
		jump_zz: function (row) {
			var that = this;
			this.$router.push(`/rm/rmZz?companyName=${row.companyName}`);
		},
		jump_order: function (row) {
			var that = this;
			this.$router.push(`/order/orderList`);
			// this.$router.push(`/order/orderList?companyName=${row.companyName}`)
		},
		exportBtn() {
			this.$message.warning('正在建设中！');
		},
		resetForm(formName) {
			this.searchs = {};
			this.$refs[formName].resetFields();
			this.$nextTick(() => {
				this.$refs.mTable.resetInit();
			});
		},
		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
				this.$refs.mTable?.resetInit();
			});
		},
	},
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

	//.no_border_table {
	//  margin-bottom: 72px;
	//}

	.dialog-footer {
		display: flex;
		justify-content: right;
	}

	.dot {
		&-success {
			color: #67c23a;
		}

		&-error {
			color: #f56c6c;
		}

		&-uncheck {
			color: #e6a23c;
		}

		&-normal {
			color: #909399;
		}
	}
}
</style>
