<template>
	<div class="disp_flex flex_column" style="height: 100%">
		<div class="back" @click="onBack" style="margin-bottom: 20px">
			<el-button type="primary">返回</el-button>
		</div>
		<el-card
			shadow="hover"
			style="margin-bottom: 24px"
			:body-style="{ padding: '16px 20px 0 20px' }"
            :loading="loading"
		>
			<el-descriptions>
				<el-descriptions-item label="业务线名称：">{{
					queryParams.projectName
				}}</el-descriptions-item>
				<el-descriptions-item label="项目负责人：">{{
					queryParams.headName
				}}</el-descriptions-item>
				<el-descriptions-item label="工作组数量：">{{
					queryParams.groupCount
				}}</el-descriptions-item>
				<el-descriptions-item label="总人数：">
					{{ queryParams.userCount }}
				</el-descriptions-item>
				<el-descriptions-item label="创建人：">{{
					queryParams.createUser
				}}</el-descriptions-item>
				<el-descriptions-item label="创建时间：">{{
					queryParams.createTime
				}}</el-descriptions-item>
			</el-descriptions>
		</el-card>
		<el-card class="m-card-full-body flex">
			<el-table
				:data="queryParams.workGroupList"
                :loading="loading"
				border
				style="width: 100%"
			>
				<el-table-column prop="id" label="序号"> </el-table-column>
				<el-table-column prop="groupName" label="工作组名称">
				</el-table-column>
				<el-table-column prop="headNames" label="工作组负责人">
				</el-table-column>
				<el-table-column prop="userCount" label="总人数">
				</el-table-column>
				<el-table-column prop="createUser" label="创建人">
				</el-table-column>
				<el-table-column prop="createTime" label="创建时间">
				</el-table-column>
			</el-table>
		</el-card>
	</div>
</template>

<script>
import { getProjectInfo } from '@/api/project';
export default {
	components: {},
	filters: {},
	data() {
		return {
			id: '',
			loading: false,
			queryParams: {},
			columns: [
				{
					label: '序号',
					prop: 'id',
				},
				{
					label: '工作组名称',
					prop: 'courseName',
				},
				{
					label: '工作组负责人',
					prop: 'courseName',
				},
				{
					label: '总人数',
					prop: 'courseName',
				},
				{
					label: '创建人',
					prop: 'createUserName',
				},
				{
					label: '创建时间',
					prop: 'createTime',
				},
			],
		};
	},
	async created() {
		this.id = this.$route.query.id || '';
	},
	mounted() {
		this.initProjectInfo();
	},
	methods: {
		initProjectInfo() {
            this.loading = true;
			getProjectInfo(this.id).then((res) => {
				this.queryParams = res.data;
			}).finally(() => {
                this.loading = false;
            })
		},
		getCourseList() {},
		onBack() {
			this.$router.go(-1);
		},
	},
};
</script>

<style lang="scss" scoped></style>
