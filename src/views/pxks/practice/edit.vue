<template>
	<div
		class="full-height testpaper has-page-header disp_flex flex flex_column"
	>
		<div class="disp_flex ju_bet ali_cen page-header">
			<span class="title">{{
				queryParams.exerciseId ? '管理练习' : '创建练习'
			}}</span>
			<div class="btn-box">
				<el-button @click="onClose">取消</el-button>
				<template v-if="!queryParams.exerciseId">
					<el-button type="primary" @click="onCreate(0, 'create')"
						>仅创建练习</el-button
					>
					<el-button type="primary" @click="onCreate(1, 'create')"
						>创建并发布练习</el-button
					>
				</template>
				<template v-else>
					<el-button
						type="primary"
						@click="onCreate(queryParams.status, 'update')"
						>仅保存练习</el-button
					>
					<el-button type="primary" @click="onCreate(1, 'update')"
						>保存并发布练习</el-button
					>
				</template>
			</div>
		</div>
		<div class="flex page-main full-height">
			<div class="full-height disp_flex">
				<el-card shadow="hover" class="full-height flex b-el-card">
					<el-scrollbar class="flex">
						<div class="testPager-container">
							<el-form
								ref="queryParamsForm"
								:model="queryParams"
								class="demo-form-inline"
								label-width="120px"
								label-position="right"
								style="width: 500px; margin: 0 auto"
							>
								<el-form-item
									label="练习名称："
									prop="exerciseName"
									:rules="[
										{
											required: true,
											message: '练习名称不能为空',
										},
									]"
								>
									<el-input
										placeholder="请输入"
										v-model="queryParams.exerciseName"
									>
									</el-input>
								</el-form-item>
								<el-form-item
									label="练习分类："
									prop="exerciseTypeCode"
									:rules="[
										{
											required: true,
											message: '请选择练习分类',
										},
									]"
								>
									<el-select
										v-model="queryParams.exerciseTypeCode"
										placeholder="请选择"
									>
										<el-option
											:label="item.name"
											:value="item.id"
											v-for="item in classTypeOptions"
											:key="item.id"
										></el-option>
									</el-select>
								</el-form-item>
								<el-form-item
									label="选择题库："
									prop="questionBankIds"
									:rules="[
										{
											required: true,
											message: '请选择题库',
										},
									]"
								>
									<el-select
										v-model="queryParams.questionBankIds"
										filterable
										placeholder="请选择"
										multiple
										collapse-tags
									>
										<el-option
											v-for="item in questionList"
											:key="item.id"
											:label="item.questionName"
											:value="item.id"
										>
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="算法推荐：">
									<el-radio-group
										v-model="queryParams.algorithm"
									>
										<el-radio :label="0">开启</el-radio>
										<el-radio :label="1">不开启</el-radio>
									</el-radio-group>
									<div class="tip">
										开启后会根据算法为每个用户个性化动态调整做题顺序，不开启则随机出题。
										练习模式默认试题和选项乱序。
									</div>
								</el-form-item>
								<el-form-item
									label="练习人群："
									prop="answerPeople"
									:rules="[
										{
											required: true,
											message: '请选择练习人群',
										},
									]"
								>
									<span style="margin-right: 15px">{{
										answerPeopleInfo
									}}</span>
									<el-button
										type="text"
										@click="onSelectExamDialog"
										>选择</el-button
									>
								</el-form-item>
								<el-form-item
									label="练习封面："
									prop="exerciseImage"
									:rules="[
										{
											required: true,
											message: '请选择练习封面',
										},
									]"
								>
									<el-upload
										class="avatar-uploader"
										:headers="headerObj"
										:before-upload="beforeLoadImageUpload"
										:on-success="
											handleThthemeNameUrlSuccess
										"
										:on-error="handleThthemeNameUrlError"
										accept=".png,.jpg,jpeg"
										:action="action"
										:show-file-list="false"
									>
										<img
											v-if="queryParams.exerciseImage"
											:src="queryParams.exerciseImage"
											class="avatar"
										/>
										<i
											v-else
											class="el-icon-plus avatar-uploader-icon"
										></i>
									</el-upload>
									<div class="tip">
										建议图片尺寸5:3 大小 &lt; 1M
									</div>
								</el-form-item>
								<el-form-item label="练习说明：">
									<el-input
										type="textarea"
										:rows="3"
										placeholder="请输入内容"
										v-model="
											queryParams.exerciseInstructions
										"
									>
									</el-input>
								</el-form-item>
							</el-form>
						</div>
					</el-scrollbar>
				</el-card>
			</div>
		</div>
		<examPeopleDialog
			:visible.sync="examPeopleDialog"
			@save="onUpdateExamPeople"
            :active="showAnswerPeople"
		/>
	</div>
</template>
<script>
import _ from 'lodash';
import mTable from '@c/business/table';
import examPeopleDialog from '@/components/examPeopleDialog.vue';
import areaSelect from '@/components/custom/areaSelect';
import { getToken } from '@/utils/auth';
import { work_role_page, tklist } from '@/api/pxks';
import { createExercise, getExerciseInfo, exerciseUpdate } from '@/api/exer';
import store from '@/store';
import { BASE_API, BASE_URL } from '@/config';

export default {
	components: {
		mTable,
		areaSelect,
		examPeopleDialog,
	},
	data() {
		return {
            showAnswerPeople: [],
			headerObj: {
				Authorization: '',
			},
			action: BASE_API + '/basic/BasicFile/itembankUpload',

			questionBankIds: [],
			q_loading: false,
			questionList: [],

			testPagerId: '',
			testPaperYypeOptions: [],
			id: '',
			queryParams: {
				exerciseId: '',
				answerPeople: [],
				answerPeopleInfoList: [],
				exerciseImage: '',
				questionBankIds: [],
				algorithm: 0,
				exerciseName: '',
				exerciseTypeCode: '',
			},
			loading: false,
			examTime: [],

			peopleLoading: false,
			examPeopleDialog: false,
			peopleQueryParams: {},
			columns: [
				{
					label: '姓名',
					prop: 'nickName',
				},
				{
					label: '区域',
					prop: 'areaFullName',
				},
				{
					label: '角色',
					prop: 'workRoleName',
				},
				{
					label: '签约情况',
					prop: 'sign',
				},
				{
					label: '评分',
					prop: 'score',
				},
			],
			_save_people: [],

			testPagerRadioId: '',
			testPagerLoading: false,
			onSelectTestPagerDialog: false,
			testPagerQueryParams: {
				status: 0,
			},
			classTypeOptions: [],
			testPaperTypeData: [],
			_testPager: {},
			testPagerColumns: [
				{
					slot: 'radio',
				},
				{
					label: '序号',
					prop: 'id',
				},
				{
					label: '名称',
					prop: 'testPaperName',
				},
				{
					label: '分类',
					prop: 'testPaperTypeName',
				},
				{
					label: '题数',
					prop: 'testPaperThemeCount',
				},
				{
					label: '总分',
					prop: 'totalScore',
				},
				{
					label: '已应用考试',
					prop: 'examNames',
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
	watch: {
		'$route.query': {
			immediate: true,
			handler(newValue, oldValue) {
				if (newValue.exerciseId) {
					this.queryParams.exerciseId = newValue.exerciseId;
					this.initExamData(this.queryParams.exerciseId);
				}
			},
		},
	},
	methods: {
		remoteMethod(query = '') {
			this.q_loading = true;
			tklist({
				current: 1,
				size: 1000,
				questionName: query,
			})
				.then((res) => {
					this.questionList = res.data?.records || [];
					console.log('this.questionList', this.questionList);
				})
				.finally(() => {
					this.q_loading = false;
				});
		},
		onUpdateExamPeople({ answerPeople, answerPeopleInfo }) {
			this.queryParams.answerPeopleInfoList =
				_.cloneDeep(answerPeopleInfo);
			this.queryParams.answerPeople = _.cloneDeep(answerPeople);
            this.showAnswerPeople = _.cloneDeep(answerPeopleInfo);
		},
		// 选择其它试卷
		onOpenTestPagerDialog() {
			this.onSelectTestPagerDialog = true;
			this.onClearTestPager();
		},
		onCancelTestPagerDialog() {
			this.onSelectTestPagerDialog = false;
		},
		onChangeTestPaperRadio(row) {
			this._testPager = _.cloneDeep(row);
		},
		onSaveSelectTestPager() {
			this.queryParams.testPaperId = this._testPager.id;
			this.queryParams.testPaperName = this._testPager.testPaperName;
			this.onCancelTestPagerDialog();
		},
		onSearchTestPagerList() {
			if (this.testPaperTypeData.length) {
				this.testPagerQueryParams.testPaperTypeCode =
					this.testPaperTypeData.join(',');
			} else {
				this.testPagerQueryParams.testPaperTypeCode = '';
			}
			this.onSearchTestPagerReset();
		},
		onClearTestPager() {
			this.testPagerQueryParams = {};
			this._testPager = {};
			this.testPaperTypeData = [];
			this.testPagerRadioId = '';
			this.onSearchTestPagerReset();
		},
		onSearchTestPagerReset() {
			setTimeout(() => {
				this.$refs.testPagerTable.resetInit();
			}, 500);
		},
		initExamData(exerciseId) {
			getExerciseInfo({
				exerciseId,
			}).then((res) => {
				if (res.data) {
					const examTime = [
						new Date(res.data.startTime),
						new Date(res.data.endTime),
					];
					const examPaperTimeValue =
						Number(res.data.examPaperTime) > 0 ? 1 : 0;
					this.queryParams = {
						examPaperTimeValue,
						examTime,
						...this.queryParams,
						...res.data,
					};
                    this.showAnswerPeople = _.cloneDeep(res.data.answerPeople);
				}
			});
		},
		onExamPagerTimeChange(value) {
			if (value == 0) {
				this.queryParams.examPaperTime = 0;
			}
		},
		onSelectExamDialog() {
			this.examPeopleDialog = true;
			this.onClear();
		},
		changeArea(val) {
			this.peopleQueryParams.province = val.province;
			this.peopleQueryParams.city = val.city;
			this.peopleQueryParams.area = val.area;
		},
		onCancel() {
			this.peopleQueryParams = {};
			this.examPeopleDialog = false;
			this._save_people = [];
			this.$refs.mTable.clear();
		},
		onSave() {
			if (!this._save_people.length) {
				this.$message.warning('请选择考试人员');
				return;
			}
			this.queryParams.answerPeopleInfoList = _.cloneDeep(
				this._save_people
			);
			this.queryParams.answerPeople = this._save_people.map(
				(el) => el.userId
			);
			this.examPeopleDialog = false;
		},
		onClear() {
			this.peopleQueryParams = {};
			this.onSearchPeople();
		},
		onSearchPeople() {
			setTimeout(() => {
				this.$refs?.mTable.resetInit();
			}, 500);
		},
		onSelectChange({ row, selectKey, type }) {
			this._save_people = _.cloneDeep(row);
		},

		handleThthemeNameUrlError() {
			this.$message.error('上传失败');
		},
		handleThthemeNameUrlSuccess(response, file, fileList, item) {
			console.log('response.data.url', response.data.url);
			this.queryParams.exerciseImage = response.data.url;
		},
		beforeLoadImageUpload(file) {
			console.log('file', file);
			const isJPG = file.type === 'image/jpeg';
			const isPNG = file.type === 'image/png';
			const isLt2M = file.size / 1024 / 1024 <= 1;

			if (!isJPG && !isPNG) {
				this.$message.error('目前仅支持图片，支持jpg/png格式');
			}
			if (!isLt2M) {
				this.$message.error('上传附件图片大小不能超过 1MB');
			}
			return (isJPG || isPNG) && isLt2M;
		},
		onExamTimeChange(times) {
			this.queryParams.startTime = times[0];
			this.queryParams.endTime = times[1];
		},
		onClose() {
			this.$router.go(-1);
		},
		onCreate(status, type) {
			this.$refs.queryParamsForm.validate((valid) => {
				if (valid) {
					if (
						!this.queryParams.answerPeopleInfoList?.length &&
						!this.queryParams.answerPeople.length
					) {
						this.$message.warning('请选择考试人群');
						return false;
					}

					const request =
						type == 'create' ? createExercise : exerciseUpdate;
					return request({
						...this.queryParams,
						status,
					}).then((res) => {
						if (status == 1) {
							this.$message.success('创建并发布成功');
						} else {
							this.$message.success('创建成功');
						}
						this.$router.replace('/testTrain/practice');
					});
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
	},
	computed: {
		answerPeopleInfo() {
			const targetArr = this.queryParams.answerPeopleInfoList.filter(
				(el) => {
					return el.nickName;
				}
			);
			if (targetArr.length) {
				console.log('targetArr', targetArr);
				return (
					targetArr[0].nickName +
					'等' +
					this.queryParams.answerPeopleInfoList.length +
					'人'
				);
			}
			return '已选择' + this.queryParams.answerPeople.length + '人';
		},
	},
	async created() {
		this.classTypeOptions = await this.$dict('exercise_type');
		this.remoteMethod();
		if (store.getters.token) {
			this.headerObj['Authorization'] = getToken();
		}
	},
};
</script>
<style lang="scss" scoped>
::v-deep {
	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}
	.avatar-uploader .el-upload:hover {
		border-color: rgba(0, 0, 0, 0.65);
	}
	.avatar-uploader-icon {
		font-size: 16px;
		color: rgba(0, 0, 0, 0.65);
		width: 88px;
		height: 88px;
		line-height: 88px;
		text-align: center;
	}
	.avatar {
		width: 88px;
		height: 88px;
		display: block;
	}
}
::v-deep .el-card__body {
	height: 100%;
}
::v-deep .el-scrollbar__wrap {
	overflow-x: auto !important;
}
.full-height {
	height: 100%;
	overflow: hidden;
}
.testPager-container {
	.tip {
		font-size: 12px;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.45);
		line-height: 20px;
	}
	.samll-text-input {
		width: 80px;
		margin-right: 14px;
	}
}
.type-title {
	h3 {
		display: inline;
	}
	.desc {
		font-size: 12px;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: rgba(0, 0, 0, 0.45);
	}
}
.question-tag-list {
	.q_tag {
		margin-left: 10px;
		margin-bottom: 10px;
	}
}
.testPagerName {
	.nickName {
		.name {
			margin-right: 15px;
		}
		.icon-btn {
			cursor: pointer;
		}
	}
}
.test-title-left {
	.title-type {
		margin-right: 16px;
	}
	.desc {
		padding-left: 15px;
		border-radius: 2px;
		border: 1px solid #d9d9d9;
		font-size: 12px;
		color: rgba(0, 0, 0, 0.65);
		padding: 0 8px;
		align-items: center;
		.line {
			border-right: 1px solid #eee;
			width: 2px;
			height: 70%;
		}
		.level {
			.title {
				box-sizing: border-box;
				padding-top: 4px;
			}
		}
		.q_title {
			display: flex;
			align-items: center;
			padding-left: 8px;
		}
	}
}

.has-page-header {
	margin: -20px;

	.page-header {
		background-color: #fff;
		margin-bottom: 24px;
		padding: 20px 24px;

		.title {
			font-size: 20px;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: bold;
			color: rgba(0, 0, 0, 0.85);
			line-height: 28px;
		}
	}

	.page-main {
		padding: 0 20px;
		overflow: hidden;
	}
}

.testpaper {
	--space: 24px;

	.b-el-card {
		margin-right: var(--space);

		.topic {
			padding: 0 20px;
			box-sizing: border-box;
		}

		::v-deep .b-el-scrollbar.el-scrollbar__wrap {
			overflow-x: auto !important;
		}
	}

	.mb-space {
		margin-bottom: var(--space);
	}

	.right-box {
		flex: 0 0 320px;

		h3 {
			margin: 0;
		}

		.grade {
			::v-deep .el-form-item__content {
				margin-left: 0 !important;
			}
		}

		.grade-text {
			color: rgba(0, 0, 0, 0.65);
			line-height: 22px;
		}

		.grade-num {
			color: #5674e5;
			padding: 0 3px;
			display: inline-block;
			width: 40px;
			text-align: center;
		}

		.num-input {
			width: 80px;
			//margin: 0 15px;
		}
	}
}
</style>
