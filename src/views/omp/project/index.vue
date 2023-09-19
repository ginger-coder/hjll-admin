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
					<el-button
						@click="editProject('')"
						type="primary"
						icon="el-icon-plus"
						>新增项目
					</el-button>
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
				:request="getProjectList"
				:payload="queryParams"
			>
				<template slot="action">
					<el-table-column label="操作" width="200" align="center">
						<template v-slot="{ row }">
							<el-button type="text" @click="goInfo(row.id)"
								>详情</el-button
							>
							<el-button type="text" @click="editProject(row.id)"
								>编辑</el-button
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
				label-width="100px"
				ref="updateForm"
			>
				<el-form-item
					label="业务线名称"
					prop="projectName"
					:rules="[
						{
							required: true,
							message: '请输入业务线名称',
							trigger: 'blur',
						},
					]"
				>
					<el-input
						placeholder="请输入业务线名称"
						v-model.trim="updateParams.projectName"
						style="max-width: 200px"
					></el-input>
				</el-form-item>
				<el-form-item
					label="项目负责人"
					prop="userList"
					:rules="[
						{
							required: true,
							message: '请选择项目负责人',
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
							:key="item.userId"
							:label="item.userNickName"
							:value="item.userId"
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
	getProjectList,
	getProjectInfo,
	updateProject,
	deleteProject,
    getHeaderUserList,
} from '@/api/project';
export default {
	components: {
		mTable,
	},
	filters: {},
	data() {
		return {
			title: '创建项目',
			addLoading: false,
			dialogVisible: false,
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
					label: '项目负责人',
					prop: 'headNames',
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
		getProjectList,
		goInfo(id) {
			this.$router.push({
				path: '/omp/projectInfo',
				query: {
					id,
				},
			});
		},
		onSubmitProject(formRef) {
			this.$refs[formRef].validate((valid) => {
				if (valid) {
					updateProject(this.updateParams).then((res) => {
						this.$message.success('更新成功');
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
            console.log('values', values);
			this.updateParams.userList = values.map((el) => {
				const target = this.userOptions.find((e) => e.userId == el);
				return target;
			});
		},
		async editProject(id = '') {
			this.dialogVisible = true;
			const userList = await getHeaderUserList();
			this.userOptions = userList.data.map((el) => {
				return {
					userId: el.id,
					userNickName: el.nickname,
				};
			});
			if (id) {
				this.title = '编辑项目';
				const info = await getProjectInfo(id);
				const data = info.data;
				this.updateParams = {
					id: data.id,
					projectName: data.projectName,
					userList: data.headList.map((el) => {
						return {
							userId: el.headId,
							userNickName: el.headName,
						};
					}),
				};
				this.userList = data.headList.map((el) => el.headId);
			} else {
				this.title = '创建项目';
			}
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
			this.$confirm('请确定是否删除该项目？删除后不可恢复', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(() => {
				this.loading = true;
				deleteProject(id)
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
