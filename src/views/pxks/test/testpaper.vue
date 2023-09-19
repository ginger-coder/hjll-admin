<template>
	<div
		class="full-height testpaper has-page-header disp_flex flex flex_column"
	>
		<div class="disp_flex ju_bet ali_cen page-header">
			<span class="title">编辑试卷</span>
			<div class="btn-box">
				<el-button @click="closeTestPager">取消</el-button>
				<el-button type="primary" @click="saveTestPager" v-if="id"
					>保存</el-button
				>
			</div>
		</div>
		<div class="flex page-main full-height">
			<div class="full-height disp_flex">
				<el-card
					shadow="hover"
					class="full-height flex b-el-card"
					:body-style="{
						height: '100%',
						overflow: 'hidden',
						padding: '20px',
					}"
				>
					<div slot="header" class="disp_flex ju_bet ali_cen">
						<span class="m-card-header-title">全部内容</span>
						<div class="disp_flex ali_cen">
							<el-button
								@click="questionBankListFun"
								type="primary"
								>从其他题库选题</el-button
							>
							<el-button @click="delTestOther"
								>批量删除</el-button
							>
						</div>
					</div>
					<div
						v-if="questionList && questionList.length"
						class="b-el-scrollbar"
					>
						<ul class="topic">
							<li
								v-for="(item, index) in questionList"
								:key="index"
							>
								<div
									class="themeName disp_flex ju_bet ali_cen"
									@click="
										() =>
											(item.choosechange =
												!item.choosechange)
									"
								>
									<div class="test-title-left disp_flex">
										<span class="title-type"
											>{{ index + 1 }}、{{
												item.themeTypeName
											}}</span
										>
										<div class="desc disp_flex">
											<div class="level disp_flex">
												<div class="title">
													{{
														item.questionsDifficultyName
													}}
												</div>
												<el-rate
													v-model="item.level"
													:max="3"
													disabled
													:colors="
														questionDiff(item.level)
													"
												></el-rate>
											</div>
											<div class="line"></div>
											<div class="q_title">
												{{ item.questionsTypeName }}
											</div>
										</div>
									</div>
									<div>
										<span style="margin-right: 15px">
											分数：
											<el-input
												size="mini"
												v-model.number="item.score"
												maxlength="2"
												style="width: 50px"
												oninput="value=value.replace(/[^0-9]/g,'')"
												@change=""
											></el-input>
										</span>
										<el-button
											type="text"
											:loading="loading"
											@click.stop="
												() => delTestOther([item.id])
											"
											>删除</el-button
										>
									</div>
								</div>
								<div class="content">
									<topic
										:topic="item.topic"
										:value="item.rightAnswer"
										:options="item.options"
										:analysis="item.analysis"
										:show="item.choosechange"
										:optionType="
											item.themeTypeName === '多选题'
												? 'checkbox'
												: 'radio'
										"
									/>
								</div>
							</li>
						</ul>
					</div>
					<el-empty v-else></el-empty>
				</el-card>
				<div class="right-box disp_flex">
					<el-card shadow="hover" style="margin-bottom: 20px">
						<!-- 题目名称 -->
						<div class="testPagerName">
							<div
								class="disp_flex nickName"
								v-if="!isEditTestPagerName"
							>
								<span class="name">{{
									testPagerInfo.testPaperName
								}}</span>
								<div class="icon-btn" @click="onEditTestName">
									<i class="el-icon-edit"></i>
								</div>
							</div>
							<div class="nickName" v-else>
								<el-input
									@keyup.enter.native="onFinishEditTestName"
									@blur="onFinishEditTestName"
									v-model="testPagerInfo.testPaperName"
								></el-input>
							</div>
						</div>
						<el-divider></el-divider>
						<!-- 分类 -->
						<el-form label-width="50px">
							<el-form-item
								label="分类"
								:rules="[{ required: true, message: '请选择' }]"
							>
								<el-select
									v-model="testPagerInfo.testPaperTypeCode"
									placeholder="请选择"
									clearable
									style="width: 100%"
									collapse-tags
								>
									<el-option
										:label="item.name"
										:value="item.id"
										v-for="item in testPaperYypeOptions"
										:key="item.id"
									></el-option>
								</el-select>
							</el-form-item>
						</el-form>
					</el-card>
					<el-card shadow="hover" class="question-card">
						<div class="testScoreTitle">试题概况</div>
						<el-divider></el-divider>
						<div class="question-scroll">
							<el-form>
								<template>
									<el-form-item
										class="grade"
										v-if="question_type_list.single.length"
									>
										<div class="type-title">
											<h3>单选题</h3>
											<span class="desc"
												>（共{{
													question_type_list.single
														.length
												}}题，合计{{
													counts.single.sumScore
												}}分）</span
											>
										</div>
										<div class="question-tag-list">
											<el-tag
												size="small"
												class="q_tag"
												type="info"
												v-for="(
													item, index
												) in question_type_list.single"
												:key="index"
												>{{ index + 1 }}</el-tag
											>
										</div>
										<div class="grade-text">
											每道题
											<el-input
												size="mini"
												class="num-input"
												v-model="
													counts.single.everyScore
												"
												@input="
													everyScoreChange(
														$event,
														'single'
													)
												"
											></el-input>
											分
										</div>
									</el-form-item>
									<el-form-item
										class="grade"
										v-if="question_type_list.more.length"
									>
										<div class="type-title">
											<h3>多选题</h3>
											<span class="desc"
												>（共{{
													question_type_list.more
														.length
												}}题，合计{{
													counts.more.sumScore
												}}分）</span
											>
										</div>
										<div class="question-tag-list">
											<el-tag
												size="small"
												class="q_tag"
												type="info"
												v-for="(
													item, index
												) in question_type_list.more"
												:key="index"
												>{{ index + 1 }}</el-tag
											>
										</div>
										<div class="grade-text">
											每道题
											<el-input
												size="mini"
												class="num-input"
												v-model="counts.more.everyScore"
												@input="
													everyScoreChange(
														$event,
														'more'
													)
												"
											></el-input>
											分
										</div>
									</el-form-item>
									<el-form-item
										class="grade"
										v-if="question_type_list.judge.length"
									>
										<div class="type-title">
											<h3>判断题</h3>
											<span class="desc"
												>（共{{
													question_type_list.judge
														.length
												}}题，合计{{
													counts.judge.sumScore
												}}分）</span
											>
										</div>
										<div class="question-tag-list">
											<el-tag
												size="small"
												class="q_tag"
												type="info"
												v-for="(
													item, index
												) in question_type_list.judge"
												:key="index"
												>{{ index + 1 }}</el-tag
											>
										</div>
										<div class="grade-text">
											每道题
											<el-input
												size="mini"
												class="num-input"
												v-model="
													counts.judge.everyScore
												"
												@input="
													everyScoreChange(
														$event,
														'judge'
													)
												"
											></el-input>
											分
										</div>
									</el-form-item>
								</template>
							</el-form>

							<p>总计</p>
							<p class="grade-text">
								共
								<span class="grade-num">
									{{ questionList.length }}</span
								>
								题,总分
								<span class="grade-num">{{ sumScore }}</span
								>分
							</p>
						</div>
					</el-card>
				</div>
			</div>
			<save-test
				:id="topicId"
				ref="saveTest"
				@save-success="testPaperThemeUpdateFun"
				url="/itembank/test-paper-theme/detail"
			/>
			<pickTopic
				v-loading="questionBank.loading"
				:visible.sync="questionBank.visible"
				@on-success="batchAltSave"
				:choose="choose"
				:classTypeOptions="classTypeOptions"
				:difficultyOptions="difficultyOptions"
				type="testPager"
				:textPagerId="id"
			/>
		</div>
	</div>
</template>
<script>
import _ from 'lodash';
import tool from '../tool';
import {
	getTestPagerInfo,
	getTestPagerQuestionList,
	themeTestPagerAltSave,
	savepapertop,
	deleteTestPagerQuestion,
} from '@/api/pxks';
import saveTest from './components/savetest.vue';
import topic from '../components/topic';
import pickTopic from '../components/pickTopic';

const defulatCounts = {
	single: {
		everyScore: '',
		sumScore: 0,
	},
	more: {
		everyScore: '',
		sumScore: 0,
	},
	judge: {
		everyScore: '',
		sumScore: 0,
	},
};
const defulatQuestionTypeList = {
	single: [],
	more: [],
	judge: [],
};
export default {
	components: {
		saveTest,
		topic,
		pickTopic,
	},
	data() {
		return {
			questionBank: {
				loading: false,
				visible: false,
			},

			isEditTestPagerName: false,
			loading: false,
			visible: false,
			id: '',
			testPagerInfo: {},
			questionList: [],
			testPaperYypeOptions: [],
			form: {
				singleCount: '',
				moreCount: '',
				judgeCount: '',
			},
			counts: _.cloneDeep(defulatCounts),
			// 各类型题目类别归类
			question_type_list: _.cloneDeep(defulatQuestionTypeList),
			amount: 0,
			max: 0,
			surplus: 0,
			singleCount: 0,

			testPaperTypeCode: [], //分类

			topicId: '',

			classTypeOptions: [], //分类选项
			difficultyOptions: [], //难度选项
			choose: [],

			themeTypeParams: {},
		};
	},
	watch: {
		'$route.query': {
			immediate: true,
			handler(newValue, oldValue) {
				if (!newValue.id) {
					this.$router.go(-1);
				}
				this.id = newValue.id || '';
				this.initTestPagerInfo(newValue.id);
				this.initTestPagerQuestionList(newValue.id);
			},
		},
		'questionBank.visible': {
			immediate: true,
			handler(newValue, oldValue) {
				if (oldValue && !newValue && this.id) {
					this.initTestPagerQuestionList(this.id);
				}
			},
		},
		counts(item) {
			if (!item.single.everyScore) {
				item.single.sumScore =
					item.single.everyScore *
					this.question_type_list.single.length;
			}
			if (!item.more.everyScore) {
				item.more.sumScore =
					item.more.everyScore * this.question_type_list.more.length;
			}
			if (!item.judge.everyScore) {
				item.judge.sumScore =
					item.judge.everyScore *
					this.question_type_list.judge.length;
			}
			console.log('counts', item);
		},
	},
	methods: {
		...tool,
		questionDiff(star) {
			if (star == 1) {
				return ['#52C41A', '#52C41A', '#52C41A'];
			}
			if (star == 2) {
				return ['#FFBF00', '#FFBF00', '#FFBF00'];
			}
			if (star == 3) {
				return ['#F5222D', '#F5222D', '#F5222D'];
			}
		},
		everyScoreChange(score, key) {
			this.counts[key].sumScore =
				score * this.question_type_list[key].length;
			this.questionList.forEach((el) => {
				if (this.themeTypeParams[key] == el.themeTypeId) {
					el.score = score;
				}
			});
		},
		batchAltSave(themeListData) {
			const themeList = themeListData.map((el) => el.id);
			themeTestPagerAltSave({
				testPaperId: this.id,
				themeList,
			}).then((res) => {
				this.$message.success('添加备选成功');
				this.initTestPagerQuestionList(this.id);
			});
		},
		// batchSave() {
		//     themeTestPagerBatchSave({
		//         testPaperId: this.id
		//     })
		//         .then(res => {
		//             this.$message.success('添加成功');
		//             this.initTestPagerQuestionList(this.id);
		//         })
		// },
		testPaperThemeUpdateFun() {},
		save() {},
		delTestOther(ids = []) {
			const oIds = this.getAllCheckItem();
			if (!ids.length && !oIds.length) {
				this.$message.warning('请选择提目');
				return;
			}
			this.loading = true;
			const themeList = ids.length ? _.cloneDeep(ids) : _.cloneDeep(oIds);

			deleteTestPagerQuestion({
				testPaperId: this.id,
				themeList,
			})
				.then((res) => {
					this.$message.success('删除成功');
					this.initTestPagerQuestionList(this.id);
				})
				.finally(() => {
					this.loading = false;
				});
		},
		getAllCheckItem() {
			let checkIds = [];
			this.questionList.forEach((el) => {
				console.log('el', el.topic.checked, el.id);
				if (el.topic.checked) {
					checkIds.push(el.id);
				}
			});
			return checkIds;
		},
		questionBankListFun() {
			this.questionBank.visible = true;
		},
		saveTestPager() {
			const totalScore = this.questionList.reduce((total, item) => {
				return total + Number(item.score);
			}, 0);
			const themeTestPaperList = this.questionList.map((el) => {
				return {
					testPaperId: this.id,
					themeId: el.id,
					score: el.score,
				};
			});
			const params = {
				testPaperName: this.testPagerInfo.testPaperName,
				testPaperTypeCode: this.testPagerInfo.testPaperTypeCode,
				id: this.id,
				totalScore,
				themeTestPaperList,
			};
			savepapertop(params).then((res) => {
				this.$message.success('保存成功');
				this.initTestPagerQuestionList(this.id);
			});
		},
		closeTestPager() {
			this.$router.replace('/testTrain/TestList');
		},
		onEditTestName() {
			this.isEditTestPagerName = true;
		},
		onFinishEditTestName() {
			this.isEditTestPagerName = false;
		},
		// 获取试卷详情
		initTestPagerInfo(id) {
			getTestPagerInfo({
				id,
			}).then((res) => {
				this.testPagerInfo = res.data;
			});
		},
		// 获取试卷下题目列表
		async initTestPagerQuestionList(testPaperId = this.id) {
			const dictRes = await this.$dict('question_type');

			dictRes.forEach((el) => {
				if (el.name.indexOf('单') > -1) {
					this.themeTypeParams.single = el.id;
				}
				if (el.name.indexOf('多') > -1) {
					this.themeTypeParams.more = el.id;
				}
				if (el.name.indexOf('判') > -1) {
					this.themeTypeParams.judge = el.id;
				}
			});

			// 各类型题目类别归类
			this.counts = _.cloneDeep(defulatCounts);
			this.question_type_list = _.cloneDeep(defulatQuestionTypeList);
			console.log('我在初始化');
			console.log('this.question_type_list', this.question_type_list);
			console.log('this.counts', this.counts);
			await getTestPagerQuestionList({
				testPaperId,
				...this.themeTypeParams,
			}).then((res) => {
				this.questionList = this.FilteredData(res.data || []);
				for (const key in this.themeTypeParams) {
					if (Object.hasOwnProperty.call(this.themeTypeParams, key)) {
						const item = this.themeTypeParams[key];
						this.questionList.forEach((el) => {
							if (el.themeTypeId == item) {
								this.question_type_list[key].push(el);
								this.counts[key].sumScore += el.score;
							}
						});
					}
				}
			});
		},
	},
	computed: {
		sumScore() {
			let score = 0;
			this.questionList.forEach((el) => {
				score += +el.score;
			});
			return score;
		},
	},
	async created() {
		this.testPaperYypeOptions = await this.$dict('test_paper_type');
		this.choose = await this.$dict('question_type');
		this.classTypeOptions = await this.$dict('test_questions_type');
		this.difficultyOptions = await this.$dict('questions_difficulty');
	},
};
</script>
<style lang="scss" scoped>
@import '../topic.scss';
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
		display: flex;
		flex-direction: column;

        .b-el-scrollbar {
            height: 100%;
            overflow-y: auto;
        }

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
		flex-direction: column;

		.question-card {
			flex: 1;
			display: flex;
			flex-direction: column;
			::v-deep {
				.el-card__body {
					height: 100%;
					display: flex;
					flex-direction: column;
					.question-scroll {
						flex: 1;
						overflow-y: auto;
					}
				}
			}
		}

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
