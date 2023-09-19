<template>
	<div class="disp_flex flex_column" style="height: 100%">
		<el-card
			shadow="hover"
			style="margin-bottom: 24px"
			:body-style="{ padding: '16px 20px 0 20px' }"
		>
			<el-form
				ref="form"
				:inline="true"
				:model="queryParams"
				class="demo-form-inline"
			>
				<el-form-item label="业务线名称：">
					<el-input
						placeholder="请输入"
						v-model="queryParams.projectName"
						clear
					>
					</el-input>
				</el-form-item>
				<el-form-item label="工作组名称：">
					<el-input
						placeholder="请输入"
						v-model="queryParams.groupName"
						clear
					>
					</el-input>
				</el-form-item>
				<el-form-item label="负责人：">
					<el-input
						placeholder="请输入"
						v-model="queryParams.headName"
					>
					</el-input>
				</el-form-item>
				<el-form-item>
					<el-button @click="onSearch" type="primary"
						>查 询</el-button
					>
					<el-button @click="resetField">重 置</el-button>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card
			shadow="hover"
			class="m-card-full-body flex"
			:body-style="{ height: '91%', paddingBottom: '10px' }"
		>
			<div slot="header" class="disp_flex ali_cen ju_bet">
				基本列表
				<div>
<!--					<el-button
						@click="editProject('')"
						type="primary"
						icon="el-icon-plus"
						>新增工作组
					</el-button>-->
					<!-- <el-button
						@click="exportFile"
						type="primary"
						icon="el-icon-download"
						>导出
					</el-button> -->
				</div>
			</div>
			<mTable
				ref="mTable"
				height="100%"
				:loading.sync="loading"
				stripe
				:columns="columns"
				:request="getGroupList"
				:payload="queryParams"
			>
				<template slot="action">
					<el-table-column label="操作" width="200" align="center">
						<template v-slot="{ row }">
							<el-button type="text" @click="goInfo(row.id)"
								>详情</el-button
							>
							<el-button type="text" @click="del(row.id)"
								>删除
							</el-button>
						</template>
					</el-table-column>
				</template>
			</mTable>
		</el-card>
		<el-dialog
			:title="title"
			:visible.sync="dialogVisible"
			destroy-on-close
            class="el-dialog-unify el-dialog-small"
            width="600px"  
		>
			<el-form
				class="demo-ruleForm"
				:model="updateParams"
				label-width="120px"
				ref="updateForm"
			>
				<el-form-item
					label="业务线名称"
					prop="projectId"
					:rules="[
						{
							required: true,
							message: '请选择项目',
							trigger: 'change',
						},
					]"
				>
					<el-select
						v-model="updateParams.projectId"
						placeholder="请选择"
						filterable
						collapse-tags
					>
						<el-option
							v-for="item in projectOptions"
							:key="item.id"
							:label="item.projectName"
							:value="item.id"
						>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item
					label="工作组名称"
					prop="groupName"
					:rules="[
						{
							required: true,
							message: '请输入工作组名称',
							trigger: 'blur',
						},
					]"
				>
					<el-input
						placeholder="请输入工作组名称"
						v-model.trim="updateParams.groupName"
						style="max-width: 200px"
					></el-input>
				</el-form-item>
				<el-form-item
					label="工作组负责人"
					prop="userList"
					:rules="[
						{
							required: true,
							message: '请选择工作组负责人',
							trigger: 'change',
						},
					]"
				>
					<el-select
						v-model="userList"
						placeholder="请选择"
						multiple
						@change="onHeaderUserChange"
						filterable
						collapse-tags
					>
						<el-option
							v-for="item in userOptions"
							:key="item.id"
							:label="item.nickname"
							:value="item.id"
						>
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button :loading="addLoading" @click="handleClose"
					>取 消</el-button
				>
				<el-button
					:disabled="addLoading"
					:loading="addLoading"
					type="primary"
					@click="onSubmitProject('updateForm')"
					>确 定</el-button
				>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import mTable from '@c/business/table';
import {
	getGroupList,
	createGroup,
	getGroupInfo,
	deleteGroup,
	getHeaderUserList,
	getAllProjectList,
} from '@/api/project';
export default {
	components: {
		mTable,
	},
	filters: {},
	data() {
		return {
			title: '创建工作组',
			addLoading: false,
			dialogVisible: false,

			projectOptions: [],

			userOptions: [],
			userList: [],

			updateParams: {},
			queryParams: {},
			loading: true,
			columns: [
				{
					label: '序号',
					prop: 'id',
				},
				{
					label: '业务线名称',
					prop: 'projectName',
				},
				{
					label: '工作组名称',
					prop: 'groupName',
				},
				{
					label: '业务线负责人',
					prop: 'headNames',
				},
				{
					label: '总人数',
					prop: 'userCount',
				},
				{
					label: '创建时间',
					prop: 'createTime',
				},
				{
					slot: 'action',
				},
			],
			examTime: [],
			classTypeOptions: [],
		};
	},
	async created() {
		// this.classTypeOptions = await this.$dict('course_type');
	},
	methods: {
		getGroupList,
		goInfo(id) {
			this.$router.push({
				path: '/omp/groupInfo',
				query: {
					id,
				},
			});
		},
		onSubmitProject(formRef) {
			this.$refs[formRef].validate((valid) => {
				if (valid) {
					createGroup(this.updateParams).then((res) => {
						this.$message.success('创建成功');
						this.handleClose();
						this.onSearch();
					});
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		handleClose() {
			this.updateParams = {};
			this.$refs.updateForm.resetFields();
			this.userList = [];
			this.dialogVisible = false;
		},
		onHeaderUserChange(values) {
			this.updateParams.userList = values.map((el) => {
				const target = this.userOptions.find((e) => e.id == el);
				return {
					userId: target.id,
					userNickName: target.nickname,
				};
			});
		},
		editProject(id = '') {
			this.dialogVisible = true;
			getHeaderUserList().then((res) => {
				this.userOptions = res.data.map((el) => {
					return {
						id: el.id,
						nickname: el.nickname,
					};
				});
			});
			getAllProjectList().then((res) => {
				this.projectOptions =
					res.data.map((el) => {
						return {
							id: el.id,
							projectName: el.projectName,
						};
					}) || [];
			});
		},
		onSearch() {
			this.$refs.mTable.resetInit();
		},
		resetField() {
			this.queryParams = {};
			this.$refs.mTable.resetInit();
		},
		exportFile() {},
		del(id) {
			this.$confirm('请确定是否删除该工作组？删除后不可恢复', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(() => {
				this.loading = true;
				deleteGroup(id)
					.then((res) => {
						this.$message.success('删除成功');
						this.onSearch();
					})
					.finally(() => {
						this.loading = false;
					});
			});
		},
		FilterTime() {},
	},
};
</script>

<style lang="scss" scoped></style>
