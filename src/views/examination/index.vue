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
						v-model="queryParams.examName"
					>
					</el-input>
				</el-form-item>
				<el-form-item label="分类">
					<el-select
						v-model="examTypeCode"
						placeholder="请选择"
						multiple
						style="width: 240px"
						collapse-tags
						@change="onExamTypeChange"
					>
						<el-option
							:label="item.name"
							:value="item.id"
							v-for="item in classTypeOptions"
							:key="item.id"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="模式">
					<el-select
						v-model="queryParams.examMode"
						placeholder="请选择"
					>
						<el-option label="正式考试" :value="0"></el-option>
						<el-option label="模拟考试" :value="1"> </el-option>
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
				<el-form-item label="考试时间">
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
					@click="createExam(0)"
					type="primary"
					icon="el-icon-plus"
                    v-if="perms.includes('sys:examination:create')"
					>创建考试
				</el-button>
			</div>
			<mTable
				ref="mTable"
				height="100%"
				:loading.sync="loading"
				stripe
				:columns="columns"
				:request="getExamPageList"
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
				<template slot="action">
					<el-table-column slot="examMode" label="模式">
						<template v-slot="{ row }">
							{{ row.examMode == 0 ? '正式考试' : '模拟考试' }}
						</template>
					</el-table-column>
					<el-table-column slot="status" label="状态">
						<template v-slot="{ row }">
							<span
								class="status-item"
								:class="{
									'font-success': row.status == 1,
									'font-warning': row.status == 2,
									'font-default': row.status == 0,
									'font-info': row.status == 3,
								}"
								>{{ row.status | filterStatus }}</span
							>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="200" align="center">
						<template v-slot="{ row }">
							<el-button
								v-if="row.status == 0 && perms.includes('sys:examination:edit')"
								type="text"
								@click="editExam(row.id)"
								>管理考试</el-button
							>
							<el-button
								type="text"
								v-if="row.status == 0"
								@click="onChangeExamStatus(row.id, 'start')"
								>发布考试</el-button
							>
							<el-button
								type="text"
								v-if="row.status == 2"
								@click="onChangeExamStatus(row.id, 'end')"
								>结束考试
							</el-button>
							<el-button
								type="text"
								v-if="row.status == 1"
								@click="onChangeJoinPeople(row.id)"
								>管理参与人
							</el-button>
							<el-button
								type="text"
								v-if="row.status == 1"
								@click="onChangeExamStatus(row.id, 'init')"
								>下架考试
							</el-button>
							<el-button
								type="text"
								v-if="(row.status == 2 || row.status == 3) && perms.includes('sys:examination:examAnalysis')"
								@click="onCheckAnaly(row.id)"
								>考试分析
							</el-button>
							<el-button
								type="text"
								v-if="row.status == 0 || row.status == 3"
								@click="del(row.id)"
								>删除
							</el-button>
						</template>
					</el-table-column>
				</template>
			</mTable>
		</el-card>
		<examPeopleDialog
			:visible.sync="examPeopleDialogModal"
			@save="onUpdateExamPeople"
			:active="activeAnswerPeople"
		/>
	</div>
</template>

<script>
import mTable from '@c/business/table';
import examPeopleDialog from '@/components/examPeopleDialog.vue';
import {
	getExamPageList,
	examDelete,
	examUpdateStatus,
	examUpdate,
	examEndCheck,
    getExamDetail,
} from '@/api/exam';
export default {
	components: {
		mTable,
		examPeopleDialog,
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
	},
	data() {
		return {
			examPeopleDialogModal: false,
			examId: '',
			options: [],
			examTypeCode: [],
			queryParams: {},
			loading: true,
			columns: [
				{
					label: '序号',
					slot: 'index',
				},
				{
					label: '名称',
					prop: 'examName',
				},
				{
					label: '分类',
					prop: 'examTypeName',
				},
				{
					slot: 'examMode',
				},
				{
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
					label: '应参与人数',
					prop: 'answerCount',
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
			activeAnswerPeople: [],
            perms: [],
		};
	},
	async created() {
		this.classTypeOptions = await this.$dict('exam_type');
	},
    mounted() {
        this.perms = this.$store.getters.user.perms;
    },
	methods: {
		onExamTypeChange() {
			this.queryParams.examTypeCodeString = this.examTypeCode.join(',');
		},
		onChangeJoinPeople(id) {
			getExamDetail({
				examId: id,
			}).then((res) => {
				if (res.data.answerPeople) {
					this.activeAnswerPeople = _.cloneDeep(
						res.data.answerPeople
					);
				}
			});
			this.examId = id;
			this.examPeopleDialogModal = true;
		},
		onUpdateExamPeople({ answerPeople }) {
			examUpdate({
				id: this.examId,
				answerPeople,
			}).then((res) => {
				this.$message.success('保存成功');
				this.examPeopleDialogModal = false;
                this.onSearch();
			});
		},
		onExamTimeChange(timeArr) {
			this.queryParams.startTime = timeArr[0];
			this.queryParams.endTime = timeArr[1];
		},
		getExamPageList,
		onSearch() {
			this.$refs.mTable.resetInit();
		},
		resetField() {
			this.queryParams = {};
			this.examTime = [];
			this.examTypeCode = [];
			this.$refs.mTable.resetInit();
		},
		onCheckAnaly(id = 0) {
			this.$router.push(
				{
                    path: '/testTrain/examinationAnalysis',
                    query: {
                        id
                    }
                }
			);
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
		async onChangeExamStatus(examId, type) {
			if (type == 'start') {
				this.$confirm('请确认是否发布该考试？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}).then(() => {
					this.loading = true;
					examUpdateStatus({
						examId,
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
				const checkResponse = await examEndCheck({
					examId,
				});
				let endTitle = '';
				if (checkResponse.data && checkResponse.data > 0) {
					endTitle =
						'仍有 ' +
						Number(checkResponse.data) +
						' 人未完成考试，请确认是否结束该考试？';
				} else {
					endTitle = '请确认是否结束该考试？';
				}
				this.$confirm(endTitle, '结束考试', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}).then(() => {
					this.loading = true;
					examUpdateStatus({
						examId,
						status: 3,
					})
						.then((res) => {
							this.$message.success('结束考试成功');
							this.onSearch();
						})
						.finally(() => {
							this.loading = false;
						});
				});
			} else if (type == 'init') {
				this.loading = true;
				examUpdateStatus({
					examId,
					status: 0,
				})
					.then((res) => {
						this.$message.success('下架成功');
						this.onSearch();
					})
					.finally(() => {
						this.loading = false;
					});
			}
		},
		del(id) {
			this.$confirm('请确定是否删除该考试？删除后不可恢复', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(() => {
				this.loading = true;
				examDelete(id)
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

<style lang="scss" scoped>
.status-item {
	position: relative;
	padding-left: 4px;
	text-align: center;
	&.font-success::before {
		content: '';
		width: 6px;
		height: 6px;
		border-radius: 50%;
		position: absolute;
		left: -5px;
		top: 4px;
		background: #67c23a;
	}
	&.font-warning::before {
		content: '';
		width: 6px;
		height: 6px;
		border-radius: 50%;
		position: absolute;
		left: -5px;
		top: 4px;
		background: #e6a23c;
	}
	&.font-info::before {
		content: '';
		width: 6px;
		height: 6px;
		border-radius: 50%;
		position: absolute;
		left: -5px;
		top: 4px;
		background: #909399;
	}
	&.font-default::before {
		content: '';
		width: 6px;
		height: 6px;
		border-radius: 50%;
		position: absolute;
		left: -5px;
		top: 4px;
		background: #f56c6c;
	}
}
</style>
