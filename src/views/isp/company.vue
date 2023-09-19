<template>
	<div style="height: 100%">
		<div class="disp_flex flex_column" style="height: 100%">
			<el-card shadow="hover">
				<div>
					<el-form
						inline
						ref="payloads"
						:model="payloads"
						style="margin-bottom: 10px"
					>
						<el-form-item style="margin-bottom: 0" label="企业名称">
							<el-input
								v-model="payloads.companyName"
								placeholder="请输入企业名称"
							/>
						</el-form-item>
						<el-form-item style="margin-bottom: 0" label="服务状态">
							<el-select
								v-model="payloads.status"
								placeholder="请选择服务状态"
							>
								<el-option
									v-for="el in typeListData"
									:value="el.value"
									:label="el.label"
									:key="el.value"
								/>
							</el-select>
						</el-form-item>
					</el-form>
					<div class="page_handle_group">
						<el-button
							type="primary"
							@click="submitForm('payloads')"
							v-hold-click
							>查询</el-button
						>
						<el-button @click="resetForm('payloads')" v-hold-click
							>重置</el-button
						>
						<el-button
							type="primary"
							v-hold-click
							plain
							@click="exportBtn"
							>导出</el-button
						>
					</div>
				</div>
			</el-card>
			<el-card
				shadow="hover"
				v-loading="loading"
				style="margin-top: 24px"
				:body-style="{ height: '91%' }"
				class="m-card-full-body flex"
			>
				<mTable
					ref="mTable"
					height="100%"
					:loading.sync="loading"
					:columns="columns"
					:request="companyPage"
					:payload="payloads"
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
					<el-table-column slot="status" label="服务状态">
						<template slot-scope="scope">
							<span v-if="scope.row.status == 0">正常使用</span>
							<span v-if="scope.row.status == 1">暂停使用</span>
						</template>
					</el-table-column>
					<template slot="action">
						<el-table-column
							label="操作"
							width="200"
							align="center"
						>
							<template v-slot="{ row }">
								<el-button type="text" @click="detailBtn(row)"
									>详情</el-button
								>
								<el-button type="text" @click="allocation(row)"
									>分配资源</el-button
								>
							</template>
						</el-table-column>
					</template>
				</mTable>
			</el-card>
		</div>
		<el-dialog
			title="权限配置"
			:visible.sync="isShow"
			:lock-scroll="true"
			:before-close="dialogCancel"
			width="70%"
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
import { companyPage } from '@/api/isp';
import {
	addMenus,
	updateMenusForCompany,
	getMenuIdsForCompany,
	getMenusResourcesForCompany,
} from '@/api/roles';
import mTable from '@c/business/table';
import moment from 'moment';
import { ADownFIle } from '@/utils';
import treeMenu from '@c/treeMenu';
const { VUE_APP_BASE_URL, VUE_APP_BASE_API } = process.env;

export default {
	components: {
		mTable,
		treeMenu,
	},
	data() {
		return {
			loading: false,
			addLoading: false,
			typeListData: [
				{
					label: '正常使用',
					value: 0,
				},
				{
					label: '暂停使用',
					value: 1,
				},
			],
			options: [],
			payloads: {
				authStatus: 1,
			},
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
			treeData: [],
			treeOriginData: [],
			isShow: false,
			checkOutArray: [],
			checkALLArray: [],
			checkArray: [],
			arrayList: [],
			tenantId: '',
			roleId: '',
		};
	},
	mounted() {
		this.getMenusResourcesList();
	},
	methods: {
		companyPage,
		resetForm(formName) {
			this.payloads = {
				payloads: 1,
			};
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
		exportBtn() {
			this.$message.warning('正在建设中！');
		},
		detailBtn(row) {
			this.$router.push(`/isp/ispInfo?id=${row.id}`);
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
						})
						.catch((err) => {});
				})
				.catch((err) => {});
		},
		dialogCancel() {
			this.isShow = false;
		},
		// 分配资源
		allocation(data) {
			this.isShow = true;
			this.tenantId = data.tenantId;
			this.roleId = data.roleId;
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
	},
};
</script>

<style lang="scss" scoped>
.demo-ruleForm {
	padding: 15px 0;
}
</style>
