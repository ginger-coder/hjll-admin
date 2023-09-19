<template>
	<el-dialog
		title="题库选题"
		:visible.sync="visibleBoolean"
		destroy-on-close
		width="1100px"
		:before-close="handleDialogClose"
	>
		<el-form :inline="true" class="disp_flex ju_bet ali_cen">
			<div>
				<el-form-item class="no-margin-bottom" label="题型">
					<el-select
						v-model="queryParams.themeTypeId"
						placeholder="请选择"
						style="width: 200px"
						clearable
					>
						<el-option
							:label="item.name"
							:value="item.id"
							v-for="item in choose"
							:key="item.id"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item class="no-margin-bottom" label="分类">
					<el-select
						v-model="questionsTypeId"
						placeholder="请选择"
						style="width: 240px"
						clearable
						multiple
						collapse-tags
						@change="onChangeType"
					>
						<el-option
							:label="item.name"
							:value="item.id"
							v-for="item in classTypeOptions"
							:key="item.id"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item class="no-margin-bottom" label="难度">
					<el-select
						v-model="queryParams.questionsDifficultyId"
						placeholder="请选择"
						style="width: 200px"
						clearable
					>
						<el-option
							:label="item.name"
							:value="item.id"
							v-for="item in difficultyOptions"
							:key="item.id"
						></el-option>
					</el-select>
				</el-form-item>
			</div>
			<el-form-item class="no-margin-bottom">
				<el-button type="primary" @click="textSearchTheme"
					>查询</el-button
				>
				<el-button @click="clear">重置</el-button>
			</el-form-item>
		</el-form>
		<div class="pick-topic disp_flex" v-loading="questionBank.loading">
			<div class="search disp_flex flex_column">
				<el-scrollbar
					class="flex"
					wrap-class="hidden-x"
					v-if="
						visibleBoolean &&
						questionBank.tabs &&
						questionBank.tabs.length
					"
				>
					<el-tree
						:data="questionBank.tabs"
						node-key="id"
						@check="getCurrentKey"
						@node-click="getCurrentKey"
					>
					</el-tree>
				</el-scrollbar>
			</div>
			<div class="search_list">
				<div class="header disp_flex ali_cen ju_ard">
					<div class="pick-tip" :inline="true">
						<div class="all">
							<el-checkbox v-model="checkedAll"></el-checkbox>
						</div>
						<el-input
							:disabled="setQuestionTypeCodeDisabled"
							class="flex q-name"
							placeholder="请输入"
							v-model.trim="questionBank.themeName"
						>
							<div slot="append" class="addend-button">
								<el-button
									:disabled="setQuestionTypeCodeDisabled"
									type="text"
									@click="textSearchTheme"
									style="margin: 0 auto"
								>
									搜索
								</el-button>
							</div>
						</el-input>
						<div class="select-tip">
							<span>已选：</span><span>{{ selectTip }}</span>
						</div>
					</div>
					<div class="switch-box">
						展示选项
						<el-switch v-model="questionBank.choosechange" />
					</div>
				</div>
				<div class="topic_wrap disp_flex ju_cen">
					<template
						v-if="questionBank.topic && questionBank.topic.length"
					>
						<div style="width: 100%; overflow-y: auto">
							<el-checkbox-group v-model="questionBank.ids">
								<div
									class="el-checkbox-box disp_flex flex ju_bet"
									v-for="(item, index) in questionBank.topic"
									:key="item.id"
								>
									<el-checkbox
										class="disp_flex flex pick-el-checkbox"
										:label="item.id"
									>
										<div style="padding-left: 20px">
											<div
												class="themeName disp_flex ju_bet ali_cen"
												@click="
													() =>
														(item.choosechange =
															!item.choosechange)
												"
											>
												<div
													class="test-title-left disp_flex"
												>
													<span class="title-type"
														>{{ index + 1 }}、{{
															item.themeTypeName
														}}</span
													>
													<div class="desc disp_flex">
														<div
															class="level disp_flex"
														>
															<div class="title">
																{{
																	item.questionsDifficultyName
																}}
															</div>
															<el-rate
																v-model="
																	item.level
																"
																:max="3"
																disabled
																:colors="
																	questionDiff(
																		item.level
																	)
																"
															></el-rate>
														</div>
														<div class="line"></div>
														<div class="q_title">
															{{
																item.questionsTypeName
															}}
														</div>
													</div>
												</div>
											</div>
											<topic
												:topic="item.topic"
												:value="item.rightAnswer"
												:options="item.options"
												:analysis="item.analysis"
												:isOther="true"
												:show="
													item.choosechange ||
													questionBank.choosechange
												"
												:optionType="
													item.themeTypeName ==
													'多选题'
														? 'checkbox'
														: 'radio'
												"
											>
												<span
													slot="topic_type"
													class="topic_type"
													>{{
														item.questionTypes
													}}</span
												>
											</topic>
										</div>
									</el-checkbox>
									<el-link
										type="danger"
										:underline="false"
										@click="() => delItem(index)"
										v-if="
											hasRule &&
											setQuestionTypeCode ===
												QuestionSettingRules[1].value
										"
										>删除
									</el-link>
								</div>
							</el-checkbox-group>
						</div>
					</template>
					<el-empty v-else />
				</div>
			</div>
		</div>
		<span slot="footer" class="dialog-footer">
			<el-button type="primary" @click="batchSave">添加到备选</el-button>
			<el-button type="text" @click="checkOther">查看备选试题</el-button>
		</span>
		<checkOther
			:visible.sync="checkOtherVisible"
			:id="otherReuquest.id"
			@success="onOtherSave"
			:request="otherReuquest"
		/>
	</el-dialog>
</template>

<script>
import _ from 'lodash';
import checkOther from './checkOther.vue';
import {
	batchSave,
	themePage,
	questionBankList,
	otherQuestionList,
	otherQuestionDelete,
	onBatchSave,
	otherTestPagerList,
	otherTestPagerDelete,
	testPagerBatchSave,
} from '@/api/pxks';
import topic from '../components/topic';
import tool from '../tool';
import { QuestionSettingRules, QUANTITY } from '../config';

export default {
	name: 'pickTopic',
	props: {
		type: {
			type: String,
			default: 'question',
		},
		visible: {
			type: Boolean,
			default: false,
		},
		questionBankId: {
			// 题库id, tabs时会禁用当前题库的id
			type: [Number, String],
			default: undefined,
		},
		textPagerId: {
			// 题库id, tabs时会禁用当前题库的id
			type: [Number, String],
			default: undefined,
		},
		hasRule: {
			// 显示题库规则
			type: Boolean,
			default: false,
		},
		testPaperId: {
			// 显示题库规则
			type: Number | String,
			default: false,
		},
		choose: {
			type: Array,
			default: () => [],
		},
		classTypeOptions: {
			type: Array,
			default: () => [],
		},
		difficultyOptions: {
			type: Array,
			default: () => [],
		},
	},
	components: { topic, checkOther },
	computed: {
		checkOtherId() {},
		otherReuquest() {
			if (this.type == 'testPager') {
				return {
					list: otherTestPagerList,
					del: otherTestPagerDelete,
					save: testPagerBatchSave,
					id: this.textPagerId,
					params: 'testPaperId',
				};
			} else {
				return {
					list: otherQuestionList,
					del: otherQuestionDelete,
					save: onBatchSave,
					id: this.questionBankId,
					params: 'questionBankId',
				};
			}
		},
		setQuestionTypeCodeDisabled: function () {
			// 判断是否为不开启, 需要禁用 tabs 和 tabs 的搜索
			return (
				this.setQuestionTypeCode &&
				this.setQuestionTypeCode !== QuestionSettingRules[0].value &&
				this.hasRule
			);
		},
		allNumber() {
			return this.questionBank.tabs?.reduce((pre, cur) => {
				pre += cur.number || 0;
				return pre;
			}, 0);
		},
		selectTip() {
			let p = 0;
			let d = 0;
			let ds = 0;
			this.questionBank.topic.forEach((el) => {
				console.log(this.questionBank.ids, el.id);
				if (this.questionBank.ids.includes(el.id)) {
					switch (el.themeTypeName) {
						case '单选题':
							d++;
							break;
						case '多选题':
							ds++;
							break;
						case '判断题':
							p++;
							break;
						default:
							break;
					}
				}
			});
			return `${d ? '单选题:' + d + '   ' : ''}${
				ds ? '多选题:' + ds + '   ' : ''
			}${p ? '判断题:' + p : ''}`;
		},
	},
	watch: {
		/**
		 * 出题规则  setQuestionTypeCode 和 questionBank.questionBankId 耦合
		 * 不开启: 根据题库变化获取题目
		 * 所有题库随机: 清空 questionBankId; 并禁用 tabs，全选和多选功能, 添加题目删除功能
		 * 指定数量随机: 展示输入框;正常请求展示;禁用全选和多选功能
		 * */
		setQuestionTypeCode: function (val, old) {
			if (!this.visible || !this.visibleBoolean) return false;
			if (!old && val === QuestionSettingRules[0].value) return false; // setQuestionTypeCode 默认是 undefined, 如果第一次选择不开启没必要执行新得操作
			// 先清空之前的选择
			this.clearData();
			if (val === QuestionSettingRules[0].value) {
				// 这个时候要根据题库去请求数据
				this.themeListFun();
			}
		},
		'questionBank.questionBankIds': function (val) {
			if (!this.visible || !this.visibleBoolean) return false; // 清空功能是否提前
			this.clearData();
			if (!val) {
				this.questionBank.topic = [];
				console.log('清空数据');
			}
		},
		'questionBank.ids': function (val) {
			console.log('questionBank.ids', this.questionBank);
			const { topic } = this.questionBank;
			this.questionBank.checkAll =
				topic.length && val.length === topic.length;
		},
		visible: {
			handler: function (val) {
				this.visibleBoolean = val;
				if (!val) return false;
				this.questionBankListFun();
			},
			immediate: true,
		},
		checkedAll: {
			handler: function (val) {
				if (val) {
					this.questionBank.ids = this.questionBank.topic.map(
						(el) => el.id
					);
				} else {
					this.questionBank.ids = [];
				}
			},
			immediate: true,
		},
	},
	data() {
		return {
			visibleBoolean: this.visible,
			setQuestionTypeCode: undefined, //QuestionSettingRules[0].value, // 出题规则类型 只有试卷选题的时候才有
			paging: {
				total: 0, // 总数
				pages: 1, // 总页数
				current: 1, // 当前页
			},
			questionBank: {
				metadata: [], // 原数据
				questionName: '', // 题库搜索。
				themeName: '', // 题目搜索。
				choosechange: false,
				loading: false,
				questionBankIds: '', //string  watch
				checkAll: false,
				ids: [],
				tabs: [
					{
						id: 0,
						label: '全部',
						children: [],
					},
				], // 要禁用当前题库的id
				topic: [],
			},
			QuestionSettingRules,
			QUANTITY,
			questionsTypeId: [],
			queryParams: {},
			checkOtherVisible: false,
			checkedAll: false,
		};
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
		onChangeType(values) {
			this.queryParams.themeTypeCodeSring = values.join(',');
		},
		checkOther() {
			this.checkOtherVisible = true;
		},
		onOtherSave() {
			this.handleDialogClose();
		},
		getCurrentKey(item, checkedNodes, treeCheckedKeys) {
			console.log('item', item);
			if (item.id == 0) {
				this.questionBank.questionBankIds = item.children
					.map((el) => el.id)
					.join(',');
			} else {
				this.questionBank.questionBankIds = item.id;
			}
			this.themeListFun();
		},
		clear() {
			this.queryParams = {};
			this.questionsTypeId = [];
			this.questionBank.themeName = '';
			this.textSearchTheme();
		},
		async loadingFun(fun) {
			if (this.questionBank.loading || !fun) return false;
			this.questionBank.loading = true;
			await fun?.();
			let time = setTimeout(() => {
				this.questionBank.loading = false;
				clearTimeout(time);
			}, 500);
		},
		clearData() {
			// 清空
			this.questionBank = {
				...this.questionBank,
				checkAll: false,
				ids: [],
				topic: [],
			};
			this.questionsTypeId = [];
			// this.initPaging();
		},
		initPaging() {
			this.queryParams.current = 1;
		},
		load() {
			this.queryParams.current += 1;
			if (this.queryParams.current > this.queryParams.pages) return false;
			this.themeListFun();
		},
		initQuestionBank() {
			this.questionBank = {
				...this.questionBank,
				checkAll: false,
				ids: [],
				topic: [],
				questionBankId: undefined,
			};
		},
		pickAll(check) {
			this.questionBank.ids = check
				? this.questionBank.topic?.map((el) => el.id)
				: [];
		},

		delItem(index) {
			this.loadingFun(() => {
				this.questionBank.metadata.splice(index, 1);
				this.questionBank.topic.splice(index, 1);
			});
		},
		async questionBankListFun() {
			this.initQuestionBank();
			this.visible = true;
			const payload = {
				page: 1,
				size: 999,
			};
			const questionName = this.questionBank.questionName;
			if (questionName) {
				payload.questionName = questionName;
			}
			const res = await questionBankList(payload);
			const data = res?.data;
			if (!data) {
				this.$message.warning('数据异常');
				return false;
			}

			const { tabs = [] } = this.questionBank;
			const records = data?.records || [];

			this.questionBank.tabs[0].children =
				records.map((el) => {
					const { id, questionName } = el;
					return {
						label: questionName,
						id,
						el,
					};
				}) || [];
		},
		textSearchTheme() {
			// 搜索之前要重置分页和重置之前的数据
			// this.clearData();
			// this.queryParams.current = 1;
			this.themeListFun(true);
		},
		async themeListFun(isSearch = false) {
			const { questionBankIds, themeName } = this.questionBank;
			if (!questionBankIds) return false;

			const query = _.cloneDeep(this.queryParams);

			console.log('query', query);
			const payload = Object.assign(query, {
				questionBankIds,
			});
			if (themeName) {
				payload.themeName = themeName;
			}
			this.questionBank.loading = true;
			this.questionBank.ids = [];

			themePage({ ...payload }).then((res) => {
				const records = res?.data || [];

				this.questionBank.topic = [...this.FilteredData(records || [])];

				this.questionBank.metadata = [...records];

				let time = setTimeout(() => {
					this.questionBank.loading = false;
					clearTimeout(time);
				}, 500);
			});
		},
		async batchSave() {
			const { ids, metadata } = this.questionBank;
			if (!ids.length || !metadata.length) {
				this.$message.warning('请选择题目');
				return false;
			}
			// 从原数据中拿
			this.$emit(
				'on-success',
				metadata.filter((el) => ids.includes(el.id)) || []
			);
		},
		handleDialogClose() {
			this.visibleBoolean = false;
			this.$emit('update:visible', this.visibleBoolean);
			this.setQuestionTypeCode = undefined;
			(this.questionBankId = []),
				(this.questionBank = {
					questionName: '', // 题目搜索。
					choosechange: false,
					loading: false,
					questionBankId: '', //string  watch
					checkAll: false,
					ids: [],
					tabs: [{ id: 0, label: '全部', children: [] }], // 要禁用当前题库的id
					topic: [],
					metadata: [],
				});
		},
	},
};
</script>

<style lang="scss" scoped>
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
.question-item {
	margin-bottom: 15px;
}
.pick-topic {
	--space: 10px;
	border: 1px solid #e9e9e9;
	margin-bottom: var(--space);

	::v-deep .el-scrollbar__wrap {
		overflow-x: hidden !important;
	}

	.search {
		flex: 0 0 270px;
		//width: 226px;
		height: 494px;
		padding: var(--space) 0;

		.el-input {
			padding: 0 var(--space);
		}

		.setQuestionTypeCode {
			padding: 0 var(--space);
			margin-bottom: 10px;

			.el-button {
				height: 100%;
				border-radius: 0;
			}
		}

		.search-el-tabs {
			margin-top: var(--space);

			::v-deep {
				.el-tabs__item {
					padding: 0 var(--space);
				}

				.el-tabs__item.is-active {
					color: #5674e5;
					position: relative;
				}

				.el-tabs__item.is-disabled {
					cursor: not-allowed;
				}

				.el-tabs__item.is-active::after {
					content: '';
					width: 100%;
					height: 100%;
					background: linear-gradient(
						90deg,
						#5a77e2 0%,
						#708cf5 100%
					);
					opacity: 0.1;
					position: absolute;
					left: 0;
					top: 0;
					z-index: -1;
				}

				.el-tabs__header.is-left {
					float: none;
					margin-right: 2px;
				}

				.el-tabs--left .el-tabs__active-bar.is-left,
				.el-tabs--left .el-tabs__active-bar.is-right,
				.el-tabs--right .el-tabs__active-bar.is-left,
				.el-tabs--right .el-tabs__active-bar.is-right {
					width: 3px;
				}

				.el-tabs__item.is-left {
					text-align: left;
				}

				.el-tabs__nav-wrap.is-left::after {
					display: none;
				}
			}
		}

		.addend-button {
			padding: 5px 14px;
			text-align: center;
		}
	}

	.search_list {
		flex: 1;
		overflow: hidden;
		//height: 100%;
		//flex: 0 0 670px;
		//height: 494px;
		background: #ffffff;
		border-radius: 4px 4px 0 0;
		border-left: 1px solid #e9e9e9;

		.header {
			background: #fafafa;
			border-radius: 0 4px 0 0;
			border-bottom: 1px solid #e9e9e9;
			padding: var(--space) calc(var(--space) * 2);
			justify-content: space-between;
			align-items: center;
			.pick-tip {
				display: flex;
				align-items: center;
				.all {
					margin-right: 15px;
				}
				.q-name {
					margin-right: 15px;
				}
			}
			.switch-box {
				width: 100px;
			}
		}
	}

	.topic_type {
		display: inline-block;
		width: 80px;
		text-align: left;
		flex: 0 0 80px;
	}

	.topic_wrap {
		height: 436px;
		padding: 0 10px 10px 10px;
		overflow-y: auto;

		.el-checkbox-box {
			padding-top: 15px;
			border-bottom: 1px solid #e9e9e9;
		}
	}
}
</style>
