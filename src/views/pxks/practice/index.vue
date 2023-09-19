<template>
	<div style="height: 100%">
		<!--    </el-scrollbar>-->
		<div class="disp_flex flex_column" style="height: 100%">
			<el-card shadow="hover">
				<div class="disp_flex ju_bet">
					<el-form inline ref="Form" :model="queryParams">
						<el-form-item label="名称">
							<el-input
								v-model="queryParams.exerciseName"
								placeholder="请输入"
							/>
						</el-form-item>
						<el-form-item label="分类">
							<el-select
								v-model="exerciseTypeCode"
								placeholder="请选择"
								style="width: 240px"
								clearable
								multiple
								collapse-tags
								@change="onChangeExerCode"
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
								style="width: 240px"
								clearable
							>
								<el-option
									label="未发布"
									:value="0"
								></el-option>
								<el-option
									label="已发布"
									:value="1"
								></el-option>
								<el-option
									label="已下架"
									:value="2"
								></el-option>
							</el-select>
						</el-form-item>
					</el-form>
					<div>
						<el-button type="primary" @click="onSearch"
							>搜索</el-button
						>
						<el-button @click="onClear">重置</el-button>
					</div>
				</div>
			</el-card>
			<el-card
				shadow="hover"
				style="margin-top: 24px"
				:body-style="{ height: '100%', paddingBottom: '80px' }"
				class="m-card-full-body flex"
			>
				<div slot="header" class="disp_flex ju_bet ali_cen">
					<span class="m-card-header-title">基本列表</span>
					<el-button
						type="primary"
						icon="el-icon-plus"
						@click="editExer(0)"
						>创建练习</el-button
					>
				</div>
				<mTable
					ref="mTable"
					height="100%"
					:loading.sync="loading"
					stripe
					:columns="columns"
					:request="getExerciseList"
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
					<template slot="status">
						<el-table-column label="状态">
							<template v-slot="{ row }">
								<el-link
									:underline="false"
									:type="row.status | statusStyle"
									>{{ row.status | filterStatus }}</el-link
								>
							</template>
						</el-table-column>
					</template>
					<template slot="action">
						<el-table-column label="操作" width="240">
							<template v-slot="{ row }">
								<el-button
									v-if="row.status == 0 && perms.includes('sys:practice:edit')"
									type="text"
									:loading="loading"
									@click="editExer(row.id)"
									>管理练习</el-button
								>
								<el-button
									type="text"
									:loading="loading"
									v-if="row.status == 1 || row.status == 2"
									@click="onChangeJoinPeople(row.id)"
									>管理参与人
								</el-button>
								<el-button
									type="text"
									:loading="loading"
									v-if="row.status == 0 || row.status == 2"
									@click="onChangeExamStatus(row.id, 'start')"
									>发布练习</el-button
								>
								<el-button
									type="text"
									:loading="loading"
									v-if="row.status == 1"
									@click="onChangeExamStatus(row.id, 'end')"
									>下架练习
								</el-button>
								<el-button
									type="text"
									:loading="loading"
									v-if="(row.status == 1 || row.status == 1) && perms.includes('sys:practice:pracAnalysis')"
									@click="onCheckAnaly(row.id, 'end')"
									>练习分析
								</el-button>

								<el-button
									type="text"
									:loading="loading"
									v-if="row.status == 0 || row.status == 2"
									@click="del(row.id)"
									>删除
								</el-button>
							</template>
						</el-table-column>
					</template>
				</mTable>
			</el-card>
		</div>
		<!-- 管理参与人 -->
		<examPeopleDialog
			:visible.sync="examPeopleDialogModal"
			@save="onUpdateExamPeople"
            :active="activeAnswerPeople"
		/>
	</div>
</template>
<script>
import {
	getExerciseList,
	exerciseStatusUpdate,
	exerciseDelete,
	exerciseUpdate,
    getExerciseInfo,
} from '@/api/exer';
import mTable from '@c/business/table';
import { ADownFIle } from '@/utils';
import examPeopleDialog from '@/components/examPeopleDialog.vue';

const { VUE_APP_BASE_URL, VUE_APP_BASE_API } = process.env;

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
					statusText = '已下架';
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

				default:
					break;
			}
			return type;
		},
	},
	data() {
		return {
			exerciseId: '',
			examPeopleDialogModal: false,
			dialogVisible: false,
			exerciseTypeCode: [],
			queryParams: {},
			createQueryParams: {
				testPaperName: '',
				testPaperTypeCode: '',
			},
			testPaperTypeData: [],
			classTypeOptions: [],
			loading: false,
			addLoading: false,
            activeAnswerPeople: [],
			columns: [
				{
					label: '序号',
					slot: 'index',
				},
				{
					label: '名称',
					prop: 'exerciseName',
				},
				{
					label: '分类',
					prop: 'exerciseTypeName',
				},
				{
					label: '涉及题库',
					prop: 'questionNames',
				},
				{
					label: '题数',
					prop: 'themeCountSum',
				},
				{
					slot: 'status',
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
            perms: [],
		};
	},
	mounted() {
        this.perms = this.$store.getters.user.perms;
    },
	async created() {
		this.classTypeOptions = await this.$dict('exercise_type');
	},
	methods: {
		getExerciseList,
		onChangeExerCode(value) {
			this.queryParams.exerciseTypeCodeString = value.join(',');
		},
		onClear() {
			this.queryParams = {};
			this.exerciseTypeCode = [];
			this.onSearch();
		},
		onSearch() {
			this.$refs.mTable.resetInit();
		},
		onChangeJoinPeople(id) {
            getExerciseInfo({
                exerciseId: id
            })
                .then(res => {
                    if(res.data.answerPeople) {
                        this.activeAnswerPeople = _.cloneDeep(res.data.answerPeople);
                    }
                })
			this.exerciseId = id;
			this.examPeopleDialogModal = true;
		},
        onCheckAnaly(id = 0) {
			this.$router.push(
				{
                    path: '/testTrain/practiceAnalysis',
                    query: {
                        id
                    }
                }
			);
		},
		del(id) {
			this.$confirm('请确定是否删除该考试？删除后不可恢复', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(() => {
				this.loading = true;
				exerciseDelete(id)
					.then((res) => {
						this.$message.success('删除成功');
						this.onSearch();
					})
					.finally(() => {
						this.loading = false;
					});
			});
		},
		onUpdateExamPeople({ answerPeople }) {
			exerciseUpdate({
				id: this.exerciseId,
				answerPeople,
			}).then((res) => {
				this.$message.success('保存成功');
				this.examPeopleDialogModal = false;
				this.onSearch();
			});
		},
		editExer(id = 0) {
			this.$router.push(
				`/testTrain/practiceEdit${id ? '?exerciseId=' + id : ''}`
			);
		},
		onChangeExamStatus(exerciseId, type) {
			console.log(exerciseId, type);
			if (type == 'start') {
				this.$confirm('请确认是否发布该练习？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}).then(() => {
					this.loading = true;
					exerciseStatusUpdate({
						exerciseId,
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
				this.$confirm('请确认是否下架该练习？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}).then(() => {
					this.loading = true;
					exerciseStatusUpdate({
						exerciseId,
						status: 2,
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
	},
};
</script>

<style lang="scss" scoped>
.demo-ruleForm {
	padding: 15px 0;
}
</style>
