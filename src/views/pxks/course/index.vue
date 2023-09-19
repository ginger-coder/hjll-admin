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
				<el-form-item label="名称">
					<el-input
						placeholder="请输入"
						v-model="queryParams.courseName"
					>
					</el-input>
				</el-form-item>
				<el-form-item label="分类">
					<el-select
						v-model="courseTypeCode"
						placeholder="请选择"
						multiple
						@change="onTypeCodeChange"
					>
						<el-option
							:label="item.name"
							:value="item.id"
							v-for="item in classTypeOptions"
							:key="item.id"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="状态">
					<el-select
						v-model="queryParams.status"
						placeholder="请选择"
					>
						<el-option label="未发布" :value="0"></el-option>
						<el-option label="已发布" :value="1"> </el-option>
						<el-option label="进行中" :value="2"> </el-option>
						<el-option label="已结束" :value="3"> </el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="课程时间">
					<el-date-picker
						v-model="examTime"
						type="datetimerange"
						range-separator="至"
						start-placeholder="开始日期"
						value-format="yyyy-MM-dd HH:mm:ss"
						end-placeholder="结束日期"
						@change="onExamTimeChange"
					>
					</el-date-picker>
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
				<el-button
					@click="createCourse(0)"
					type="primary"
					icon="el-icon-plus"
					>创建课程
				</el-button>
			</div>
			<mTable
				ref="mTable"
				height="100%"
				:loading.sync="loading"
				stripe
				:columns="columns"
				:request="getCourseList"
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
				<el-table-column slot="status" label="状态">
					<template v-slot="{ row }">
						<el-link
							:underline="false"
							:type="row.status | statusStyle"
							>{{ row.status | filterStatus }}</el-link
						>
					</template>
				</el-table-column>
				<el-table-column
					slot="action"
					label="操作"
					width="200"
					align="center"
				>
					<template v-slot="{ row }">
						<el-button
							type="text"
							v-if="row.status == 0 && perms.includes('sys:course:edit')"
							@click="createCourse(row.id)"
							>管理课程</el-button
						>
						<el-button
							type="text"
							v-if="(row.status == 1 || row.status == 2) && perms.includes('sys:course:editBook')"
							@click="createCourse(row.id, 'book')"
							>管理课件/参与人</el-button
						>
						<el-button
							type="text"
							v-if="row.status == 0"
							@click="onChangeExamStatus(row.id, 'start')"
							>发布课程</el-button
						>
						<el-button
							type="text"
							v-if="row.status == 1"
							@click="onChangeExamStatus(row.id, 'init')"
							>下架课程
						</el-button>
						<el-button
							type="text"
							v-if="row.status == 2"
							@click="onChangeExamStatus(row.id, 'end')"
							>结束课程
						</el-button>
						<!-- <el-button
								type="text"
								v-if="row.status == 1"
								@click="onChangeJoinPeople(row.id)"
								>管理参与人
							</el-button> -->
						<!-- <el-button
								type="text"
								v-if="row.status == 2 || row.status == 3"
								@click="del(row.id)"
								>课程分析
							</el-button> -->
						<el-button
							type="text"
							v-if="row.status == 0 || row.status == 3"
							@click="del(row.id)"
							>删除
						</el-button>
					</template>
				</el-table-column>
			</mTable>
		</el-card>
	</div>
</template>

<script>
import mTable from '@c/business/table';
import examPeopleDialog from '@/components/examPeopleDialog.vue';
import {
	getCourseList,
	courseDelete,
	courseUpdateStatus,
	courseCheck,
} from '@/api/course';
export default {
	components: {
		mTable,
		examPeopleDialog,
	},
	watch: {
		$route: {
			handler: function (val, oldVal) {
				if (val.query.courseName) {
					this.queryParams.courseName = val.query.courseName;
					setTimeout(() => {
						this.$refs.mTable.resetInit();
					}, 500);
				}
			},
			// 深度观察监听
			deep: true,
			immediate: true,
		},
	},
	filters: {
		filterStatus(status) {
			let statusText = '';
			switch (status) {
				case 0:
					statusText = '未发布';
					break;
				case 1:
					statusText = '已发布';
					break;
				case 2:
					statusText = '进行中';
					break;
				case 3:
					statusText = '已结束';
					break;
				default:
					break;
			}
			return statusText;
		},
		statusStyle(status) {
			let type = '';
			switch (status) {
				case 0:
					type = 'warning';
					break;
				case 1:
					type = 'success';
					break;
				case 2:
					type = 'danger';
					break;
				case 3:
					type = 'default';
					break;

				default:
					break;
			}
			return type;
		},
	},
	data() {
		return {
			courseId: '',
			options: [],
			courseTypeCode: [],
			queryParams: {},
			loading: true,
			columns: [
				{
					label: '序号',
					slot: 'index',
				},
				{
					label: '名称',
					prop: 'courseName',
				},
				{
					label: '分类',
					prop: 'courseTypeName',
				},
				{
					label: '状态',
					slot: 'status',
				},
				{
					label: '开始时间',
					prop: 'startTime',
				},
				{
					label: '结束时间',
					prop: 'endTime',
				},
				{
					label: '创建人',
					prop: 'createUserName',
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
            perms: [],
		};
	},
	async created() {
		this.classTypeOptions = await this.$dict('course_type');
	},
    mounted() {
        this.perms = this.$store.getters.user.perms;
    },
	methods: {
		createCourse(id = 0, type = '') {
			this.$router.push(
				`/testTrain/course/${type ? 'editBook' : 'edit'}${
					id ? '?id=' + id : ''
				}${type ? '&type=' + type : ''}`
			);
		},
		onTypeCodeChange(values) {
			this.queryParams.courseTypeCodeString = values.join(',');
		},
		onExamTimeChange(timeArr) {
			this.queryParams.startTime = timeArr[0];
			this.queryParams.endTime = timeArr[1];
		},
		getCourseList,
		onSearch() {
			this.$refs.mTable.resetInit();
		},
		resetField() {
			this.queryParams = {};
			this.examTime = [];
			this.courseTypeCode = [];
			this.$refs.mTable.resetInit();
		},
		createExam(id = 0) {
			this.$router.push(
				`/testTrain/examinationCreate${id ? '?id=' + id : ''}`
			);
		},
		editExam(id = 0) {
			this.$router.push(
				`/testTrain/examinationEdit${id ? '?id=' + id : ''}`
			);
		},
		exportFile() {},
		onChangeExamStatus(courseId, type) {
			if (type == 'start') {
				this.$confirm('请确认是否发布该课程？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}).then(() => {
					this.loading = true;
					courseUpdateStatus({
						courseId,
						status: 1,
					})
						.then((res) => {
							this.$message.success('发布成功');
							this.onSearch();
						})
						.finally(() => {
							this.loading = false;
						});
				});
			} else if (type == 'end') {
				courseCheck({
					courseId,
				}).then((res) => {
					const msg =
						res.data > 0
							? '仍有 ' +
							  res.data +
							  ' 人未完成课程，请确认是否结束该课程？'
							: '确认是否结束该课程？';
					this.$confirm(msg, '结束课程', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
					}).then(() => {
						courseUpdateStatus({
							courseId,
							status: 3,
						})
							.then((res) => {
								this.loading = true;
								this.$message.success('结束课程成功');
								this.onSearch();
							})
							.finally(() => {
								this.loading = false;
							});
					});
				});
			} else if (type == 'init') {
				this.$confirm('确认是否下架该课程？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}).then((res) => {
					this.loading = true;
					courseUpdateStatus({
						courseId,
						status: 0,
					})
						.then((res) => {
							this.$message.success('下架成功');
							this.onSearch();
						})
						.finally(() => {
							this.loading = false;
						});
				});
			}
		},
		del(id) {
			this.$confirm('请确定是否删除该课程？删除后不可恢复', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(() => {
				this.loading = true;
				courseDelete(id)
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
