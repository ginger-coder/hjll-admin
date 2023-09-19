<template>
	<div
		class="full-height testpaper has-page-header disp_flex flex flex_column"
	>
		<div class="disp_flex ju_bet ali_cen page-header">
			<span class="title">{{
				queryParams.id ? '管理考试' : '创建考试'
			}}</span>
			<div class="btn-box">
				<el-button @click="onClose">取消</el-button>
				<template v-if="!queryParams.id">
					<el-button @click="onClose">上一步</el-button>
					<el-button type="primary" @click="onCreate(0, 'create')"
						>仅创建考试</el-button
					>
					<el-button type="primary" @click="onCreate(1, 'create')"
						>创建并发布考试</el-button
					>
				</template>
				<template v-else>
					<el-button type="primary" @click="onCreate(0, 'update')"
						>仅保存考试</el-button
					>
					<el-button type="primary" @click="onCreate(1, 'update')"
						>保存并发布考试</el-button
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
								<el-form-item label="所选试卷：">
									<span style="margin-right: 15px">{{
										queryParams.testPaperName
									}}</span>
									<el-button
										type="text"
										@click="onOpenTestPagerDialog"
										>更改</el-button
									>
								</el-form-item>
								<el-form-item
									label="考试名称："
									prop="examName"
									:rules="[
										{
											required: true,
											message: '考试名称不能为空',
										},
									]"
								>
									<el-input
										placeholder="请输入"
										v-model="queryParams.examName"
									>
									</el-input>
								</el-form-item>
								<el-form-item
									label="考试分类："
									prop="examTypeCode"
									:rules="[
										{
											required: true,
											message: '请选择考试分类',
										},
									]"
								>
									<el-select
										v-model="queryParams.examTypeCode"
										placeholder="请选择"
									>
										<el-option
											:label="item.name"
											:value="item.id"
											v-for="item in testPaperYypeOptions"
											:key="item.id"
										></el-option>
									</el-select>
								</el-form-item>
								<el-form-item
									label="考试模式："
									prop="examMode"
									:rules="[
										{
											required: true,
											message: '请选择考试模式',
										},
									]"
								>
									<el-radio-group
										v-model="queryParams.examMode"
										size="mini"
									>
										<el-radio-button :label="0"
											>正常考试</el-radio-button
										>
										<el-radio-button :label="1"
											>模拟考试</el-radio-button
										>
									</el-radio-group>
									<div class="item-tip">
										正式考试在交卷后才可查看答案
									</div>
								</el-form-item>
								<el-form-item label="切屏即交卷：">
									<el-switch
										v-model="queryParams.screenCutting"
										:active-value="0"
										:inactive-value="1"
									>
									</el-switch>
									<div class="item-tip">
										退出考试界面 、关闭小程序、或退出微信
										即认为是切屏
									</div>
								</el-form-item>
								<el-form-item label="试题乱序：">
									<el-switch
										v-model="queryParams.themeDisorder"
										:active-value="0"
										:inactive-value="1"
									>
									</el-switch>
									<div class="item-tip">
										开启后试题的顺序每个人都不一样
									</div>
								</el-form-item>
								<!-- <el-form-item label="选项乱序：">
									<el-switch
										v-model="queryParams.themeDisorder"
										:active-value="1"
										:inactive-value="0"
									>
									</el-switch>
									<div class="item-tip">
										开启后每个人选项的顺序都不一样
									</div>
								</el-form-item> -->
								<el-form-item label="查看答案方式：">
									<el-radio-group
										v-model="queryParams.viewAnswerMethods"
										size="mini"
									>
										<el-radio-button :label="0"
											>考完立即可看</el-radio-button
										>
										<el-radio-button :label="1"
											>待所有人完成可查</el-radio-button
										>
										<el-radio-button :label="2"
											>考试结束后可查</el-radio-button
										>
									</el-radio-group>
								</el-form-item>
								<el-form-item
									label="考试时间："
									prop="examTime"
									:rules="[
										{
											required: true,
											message: '请选择考试模式',
										},
									]"
								>
									<el-date-picker
										v-model="queryParams.examTime"
										type="datetimerange"
										range-separator="至"
										start-placeholder="开始时间"
										end-placeholder="结束时间"
										value-format="yyyy-MM-dd HH:mm:ss"
										@change="onExamTimeChange"
									>
									</el-date-picker>
								</el-form-item>
								<el-form-item label="答题时长：">
									<el-radio-group
										v-model="queryParams.examPaperTimeValue"
									>
										<el-radio :label="0">不限时</el-radio>
										<el-radio :label="1">
											<span
												v-if="
													queryParams.examPaperTimeValue ==
													1
												"
												style="
													color: red;
													margin-right: 7px;
												"
												>*</span
											>
											<el-input
												placeholder="请输入"
												v-model="
													queryParams.examPaperTime
												"
												:disabled="
													queryParams.examPaperTimeValue !=
													1
												"
												@input="onExamPagerTimeChange"
												class="samll-text-input"
                                                type="number"
											>
											</el-input
											>分钟
										</el-radio>
									</el-radio-group>
								</el-form-item>
								<el-form-item
									label="及格分数："
									prop="passGrade"
									:rules="[
										{
											required: true,
											validator: validateScore,
											trigger: 'change',
										},
									]"
								>
									<div>
										<el-input
											placeholder="请输入"
											v-model="queryParams.passGrade"
											class="samll-text-input"
										>
										</el-input
										>分
									</div>
									<div class="item-tip">
										（总分：{{ queryParams.scoreNum }}）
									</div>
								</el-form-item>
								<el-form-item
									label="考试人群："
									prop="answerPeople"
									:rules="[
										{
											required: true,
											message: '请选择考试人群',
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
								<el-form-item label="考试封面：">
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
											v-if="queryParams.examImage"
											:src="queryParams.examImage"
											class="avatar"
										/>
										<i
											v-else
											class="el-icon-plus avatar-uploader-icon"
										></i>
									</el-upload>
									<div class="item-tip">
										建议图片尺寸5:3 大小 &lt; 1M
									</div>
								</el-form-item>
								<el-form-item label="考试说明：">
									<el-input
										type="textarea"
										:rows="3"
										placeholder="请输入内容"
										v-model="
											queryParams.examinationInstructions
										"
									>
									</el-input>
								</el-form-item>
							</el-form>
						</div>
					</el-scrollbar>
				</el-card>
				<div class="right-box">
					<el-card
						shadow="hover"
						style="margin-bottom: 20px; height: 140px"
					>
						<el-steps direction="vertical" :active="2">
							<el-step title="选择试卷"></el-step>
							<el-step title="设置信息"></el-step>
						</el-steps>
					</el-card>
				</div>
			</div>
		</div>

		<el-dialog
			title="选择试卷"
			:visible.sync="onSelectTestPagerDialog"
			destroy-on-close
			width="1100px"
			:before-close="onCancel"
		>
			<h4>从已有试卷选择</h4>
			<el-form :inline="true" class="disp_flex ju_bet ali_cen">
				<div>
					<el-form-item label="名称">
						<el-input
							v-model="testPagerQueryParams.testPaperName"
							placeholder="请输入"
						/>
					</el-form-item>
					<el-form-item label="分类">
						<el-select
							v-model="testPaperTypeData"
							placeholder="请选择"
							style="width: 240px"
							clearable
							multiple
							collapse-tags
							@change="onChangeTestPaperType"
						>
							<el-option
								:label="item.name"
								:value="item.id"
								v-for="item in testPagerTypeList"
								:key="item.id"
							></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="onSearchTestPagerList"
							>查询</el-button
						>
						<el-button @click="onClearTestPager">重置</el-button>
					</el-form-item>
				</div>
			</el-form>
			<mTable
				ref="testPagerTable"
				style="height: 400px"
				:loading.sync="testPagerLoading"
				stripe
				:columns="testPagerColumns"
				:request="testpaper"
				:payload="testPagerQueryParams"
				:alertText="true"
			>
				<el-table-column slot="index" label="序号">
					<template slot-scope="scope">
						{{
							scope.$index +
							1 +
							($refs.testPagerTable.current - 1) *
								$refs.testPagerTable.size
						}}
					</template>
				</el-table-column>
				<template slot="radio">
					<el-table-column label="" width="35">
						<template slot-scope="scope">
							<el-radio
								class="radio"
								v-model="testPagerRadioId"
								:label="scope.row.id"
								@change.native="
									onChangeTestPaperRadio(scope.row)
								"
								><i></i>
							</el-radio>
						</template>
					</el-table-column>
				</template>
			</mTable>
			<div slot="footer" class="dialog-footer">
				<el-button @click="onCancelTestPagerDialog">取消</el-button>
				<el-button type="primary" @click="onSaveSelectTestPager"
					>保存</el-button
				>
			</div>
		</el-dialog>
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
import { work_role_page, testpaper } from '@/api/pxks';
import {
	examPeopleList,
	examSave,
	getExamDetail,
	examUpdate,
} from '@/api/exam';
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
			headerObj: {
				Authorization: '',
			},
			action: BASE_API + '/basic/BasicFile/itembankUpload',

			testPagerId: '',
			testPaperYypeOptions: [],
			id: '',
            showAnswerPeople: [],
			queryParams: {
				answerPeople: [],
				answerPeopleInfoList: [],
				examImage: '',
				testPaperId: '',
				screenCutting: 1,
				themeDisorder: 1,
				viewAnswerMethods: 2,
			},
			loading: false,
			examTime: [],

			peopleLoading: false,
			examPeopleDialog: false,
			roleUserList: [],
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
			testPagerTypeList: [],
			testPagerQueryParams: {
				status: 0,
			},
			testPaperTypeData: [],
			_testPager: {},
			testPagerColumns: [
				{
					slot: 'radio',
				},
				{
					label: '序号',
					slot: 'index',
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
				if (newValue.id) {
					this.queryParams.id = newValue.id;
					this.initExamData(this.queryParams.id);
				} else {
					this.queryParams.testPaperId = newValue.testPagerId;
					this.queryParams.testPaperName = newValue.testPagerName;
					this.queryParams.scoreNum = newValue.score;
				}
			},
		},
	},
	methods: {
		validateScore(rule, value, callback) {
			if (value === '') {
				callback(new Error('请输入总分'));
			} else if (value > this.queryParams.scoreNum) {
				callback(new Error('总分数不能超过最大总分'));
			} else {
				callback();
			}
		},
		examPeopleList,
		testpaper,
		onChangeTestPaperType(val) {
			this.testPagerQueryParams.testPaperTypeCodeString = val.join(',');
		},
		onUpdateExamPeople({ answerPeople, answerPeopleInfo }) {
			this.queryParams.answerPeopleInfoList =
				_.cloneDeep(answerPeopleInfo);
            this.showAnswerPeople = _.cloneDeep(answerPeopleInfo);
			this.queryParams.answerPeople = _.cloneDeep(answerPeople);
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
			this.$refs.testPagerTable?.resetInit();
		},
		initExamData(examId) {
			getExamDetail({
				examId,
			}).then((res) => {
				if (res.data) {
					console.log(res.data);
					const examTime = [
						new Date(res.data.startTime),
						new Date(res.data.endTime),
					];
					const examPaperTimeValue =
						Number(res.data.examPaperTime) > 0 ? 1 : 0;
					this.queryParams = {
						examPaperTimeValue,
						examPaperTime: Number(res.data.examPaperTime),
						examTime,
						...this.queryParams,
						...res.data,
					};
                    this.showAnswerPeople = _.cloneDeep(res.data.answerPeople);
				}
			});
		},
		onExamPagerTimeChange(value) {
			if (this.queryParams.examPaperTimeValue == 0) {
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
			// this.$refs.testPagerTable?.clear();
			this.peopleQueryParams = {};
            this.onSelectTestPagerDialog = false;
			this.examPeopleDialog = false;
			this._save_people = [];
		},
		onClear() {
			this.peopleQueryParams = {};
			this.onSearchPeople();
		},
		onSearchPeople() {
			setTimeout(() => {
				this.$refs?.testPagerTable.resetInit();
			}, 500);
		},
		onSelectChange({ row, selectKey, type }) {
			this._save_people = _.cloneDeep(row);
		},

		handleThthemeNameUrlError() {
			this.$message.error('上传失败');
		},
		handleThthemeNameUrlSuccess(response, file, fileList, item) {
			this.queryParams.examImage = response.data.url;
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

					if (this.queryParams.examPaperTimeValue == 0) {
						this.queryParams.examPaperTime = 0;
					} else {
						this.queryParams.examPaperTime =
							+this.queryParams.examPaperTime;
						if (!this.queryParams.examPaperTime) {
							this.$message.warning('请选择输入答题时长');
							return false;
						}
						if (this.queryParams.examPaperTime <= 0) {
							this.$message.warning('答题时长必须大于0');
							return false;
						}
					}

					const request = type == 'create' ? examSave : examUpdate;
					return request({
						...this.queryParams,
						status,
					}).then((res) => {
						if (status == 1) {
							this.$message.success('创建并发布成功');
						} else {
							this.$message.success('创建成功');
						}
						this.$router.replace('/testTrain/examinationList');
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
		isEdit() {
			return this.id ? true : false;
		},
	},
	async created() {
		this.testPaperYypeOptions = await this.$dict('exam_type');
		this.testPagerTypeList = await this.$dict('test_paper_type');
		work_role_page({
			size: 100,
			current: 1,
		}).then((res) => {
			// console.log('res', res);
			this.roleUserList = res.data.records;
		});
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
	.item-tip {
		font-size: 12px;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.45);
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
