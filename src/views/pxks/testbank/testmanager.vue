<template>
	<div class="disp_flex flex_column full-height">
		<addTopic
			:visible.sync="dialogVisible"
			:choose="choose"
			:classTypeOptions="classTypeOptions"
			:difficultyOptions="difficultyOptions"
			:payload="form"
			@edit-success="cofirmsave"
		/>
		<el-card
			shadow="hover"
			class="testManager-card"
			:body-style="{ padding: '0 20px 20px 20px' }"
		>
			<div slot="header" class="testManager-header">
				<span class="m-card-header-title">
					{{ myname }}
					<i class="el-icon-edit" @click="onOpenPagerName"></i>
				</span>
				<div class="show-all-select">
					<span>展示选项</span>
					<el-switch
						v-model="choosechange"
						:active-value="true"
						:inactive-value="false"
						@change="onSelectChoose"
					/>
				</div>
			</div>
			<div>
				<el-descriptions class="descriptions" :column="12">
					<el-descriptions-item label="题数">{{
						counts.total || 0
					}}</el-descriptions-item>
					<el-descriptions-item label="单选题">{{
						counts.singleCount || 0
					}}</el-descriptions-item>
					<el-descriptions-item label="多选题">{{
						counts.moreCount || 0
					}}</el-descriptions-item>
					<el-descriptions-item label="判断题">{{
						counts.judgeCount || 0
					}}</el-descriptions-item>
				</el-descriptions>

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
								v-model="themeTypeCodeString"
								placeholder="请选择"
								style="width: 240px"
								clearable
								multiple
								collapse-tags
								@change="onChangeThemeType"
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
						<el-form-item class="no-margin-bottom" label="题目">
							<el-input
								placeholder="请输入"
								v-model="queryParams.themeName"
							>
							</el-input>
						</el-form-item>
					</div>
					<el-form-item class="no-margin-bottom">
						<el-button type="primary" @click="textSearch"
							>查询</el-button
						>
						<el-button @click="clear">重置</el-button>
					</el-form-item>
				</el-form>
			</div>
		</el-card>
		<el-card
			shadow="hover"
			style="margin-top: 24px"
			:body-style="{ flex: 1, overflow: 'hidden' }"
			class="disp_flex flex_column flex"
		>
			<div slot="header" class="disp_flex ju_bet ali_cen">
				<span class="m-card-header-title">全部内容</span>
				<div class="disp_flex ali_cen">
					<el-button
						type="primary"
						icon="el-icon-plus"
						@click="dialogVisible = true"
						>创建单个题目</el-button
					>
					<el-button @click="questionBankListFun" type="primary"
						>从其他题库选题</el-button
					>
					<el-button @click="downVisible = true"
						>从文件批量导入</el-button
					>
					<el-button @click="deltest">批量删除</el-button>
				</div>
			</div>
			<el-scrollbar wrap-class="app-container-wrapper">
				<template v-if="testlist && testlist.length">
					<ul
						class="topic topic-scroll"
						:infinite-scroll-immediate="false"
						v-infinite-scroll="load"
					>
						<li v-for="(item, index) in testlist" :key="index">
							<div
								class="themeName disp_flex ju_bet ali_cen"
								@click="
									() =>
										(item.choosechange = !item.choosechange)
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
									<el-button
										type="text"
										:loading="loading"
										@click.stop="deltest([item.id])"
										>删除</el-button
									>
									<el-button
										type="text"
										:loading="loading"
										@click.stop="edittest(item.id)"
										>编辑</el-button
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
				</template>
				<el-empty v-else description="暂无数据"></el-empty>

				<pick-topic
					v-loading="questionBank.loading"
					:questionBankId="id"
					:visible.sync="dialog"
					@on-success="batchSave"
					:choose="choose"
					:classTypeOptions="classTypeOptions"
					:difficultyOptions="difficultyOptions"
				/>
			</el-scrollbar>
			<el-dialog
				title="修改题目名称"
				:visible.sync="xg"
				width="40%"
				:before-close="handleClose"
			>
				<el-form ref="form" :model="form" label-width="80px">
					<el-form-item label="名称">
						<el-input
							v-model.trim="questionName"
							placeholder="请输题库名称"
							style="width: 200px"
						></el-input>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="xg = false">取 消</el-button>
					<el-button type="primary" @click="changename"
						>确 定</el-button
					>
				</span>
			</el-dialog>
			<el-dialog
				title="批量导入"
				:visible.sync="downVisible"
				:before-close="() => (downVisible = false)"
			>
				<div style="padding: 15px 0 30px 0">
					<p>Excel批量导入题目</p>
					<p>支持批量导入单选题、多选题、判断题</p>
					<p>暂不支持携带图片，请上传后进入对于题目编辑添加。</p>
					<p>
						第一步：下载导入模版-根据导入模版中提示调整自己的题目格式：
					</p>
					<el-button @click="exportTemplate" type="primary"
						>下载模板</el-button
					>
					<p>第二步：上传文件，点击下方【上传Excel】完成导入</p>
					<el-upload
						:before-upload="beforeUpload"
						multiple
						accept="xlsx, .xlsx"
						:limit="1"
						:file-list="fileList"
						action=""
					>
						<el-button>上传Excel</el-button>
					</el-upload>
				</div>

				<span slot="footer" class="dialog-footer">
					<el-button @click="downVisible = false">取 消</el-button>
				</span>
			</el-dialog>
		</el-card>
	</div>
</template>
<script>
/**
 * maxOptions: ['a', 'b', 'c', 'd', 'e', 'f'] // Tuple
 * label: string
 * el-radio el-checkbox的 label 需要唯一性, 是用 maxOptions 循环出来的。
 * 选中的时候 rightAnswer 存 label 的值
 * 提交和编辑的时候用 rightAnswer 获取正确答案的文字提交和显示
 * */
import _ from 'lodash';
import {
	otherQuestionSave,
	sttypelist,
	themeadd,
	themePage,
	themeQuestionDelete,
	themedetail,
	countType,
	updatetest,
	xgname,
	tixqname,
	questionBankList,
	importTheme,
} from '@/api/pxks';
import { dictItemPages } from '@/api/dict';
import tool from '../tool';
import uploadPics from '@/components/custom/uploadPics';
import topic from '../components/topic';
import pickTopic from '../components/pickTopic';
import addTopic from '../components/addTopic';
import { ADownFIle } from '@/utils';
import { topicOptions } from '../config';
import { getToken } from '@/utils/auth';
import store from '@/store';
import { BASE_API, BASE_URL } from '@/config';

const { VUE_APP_BASE_URL, VUE_APP_BASE_API } = process.env;
export default {
	components: {
		uploadPics,
		topic,
		pickTopic,
		addTopic,
	},
	watch: {
		currentOptionsNum: function (val) {
			console.log(val, 'currentOptionsNum');
		},
		dialog: {
			immediate: true,
			handler(newValue, oldValue) {
				if (oldValue && !newValue && this.id) {
					this.reRequest();
				}
			},
		},
	},
	data() {
		return {
			id: '',
			headerObj: {
				Authorization: '',
			},
			action: BASE_API + '/basic/BasicFile/Upload',

			fileList: [],
			loading: false,
			downVisible: false,
			maxOptions: topicOptions, // 最多的选项
			answersOptions: [{ checked: false, value: undefined }],

			// topicOptions.map((el, index) => ({
			//   label: el,
			//   value: el,
			//   index,
			//   visible: index === 0,
			//   text: undefined,
			//   [`${el}Image`]: undefined,
			// })),
			currentOptions: ['a'], // 当前的选择数据
			currentOptionsNum: 1,
			topicOptions: [],
			myname: '',
			questionName: '',
			xg: false,
			newname: '',
			right: '正确',
			worry: '错误',
			input2: '',
			truefase: true,
			truefase1: true,
			truefase2: true,
			truefase3: true,
			truefase4: true,
			choosechange: false,
			dialogVisible: false,
			dialog: false,
			value: '',
			classTypeOptions: [], //分类选项
			difficultyOptions: [], //难度选项

			choose: [],
			chooseMap: {},
			testlist: [],
			count: {},
			counts: {},
			rules: {
				themeTypeId: [{ required: true, message: '请选择题目类型' }],
				themeName: [{ required: true, message: '请输入题目' }],
				rightAnswer: [
					{
						required: true,
						message: '请选择正确答案',
						validator: (rule, value, callback) => {
							if (!value) callback(new Error());
							if (this.form.themeTypeId === '2' && !value.length)
								callback(new Error());
							callback();
						},
					},
				],
				...topicOptions.reduce((pre, cur) => {
					pre[cur] = [{ required: true, message: '请输入选项内容' }];
					return pre;
				}, {}),
			},
			form: {
				questionBankId: '',
				themeName: '',
				themeTypeId: '',
				analysis: '',
				rightAnswer: undefined,
				...topicOptions.reduce((pre, cur) => {
					pre[cur] = undefined;
					pre[`${cur}Image`] = undefined;
					return pre;
				}, {}),
			},
			themeTypeCodeString: [],
			queryParams: {
				questionBankId: '',
				current: 1,
				size: 100,
			},
			newId: '',
			hiddenoropen: false,

			questionBank: {
				visible: false,
				metadata: [], // 原数据
				questionName: '', // 题库搜索。
				themeName: '', // 题目搜索。
				choosechange: false,
				loading: false,
				questionBankId: undefined, //string  watch
				checkAll: false,
				ids: [],
				tabs: [], // 要禁用当前题库的id
				topic: [],
			},
			paging: {
				total: 0, // 总数
				pages: 1, // 总页数
				current: 1, // 当前页
			},
		};
	},
	async created() {
		this.getId();
		this.PaperName();

		this.choose = await this.$dict('question_type');
		this.classTypeOptions = await this.$dict('test_questions_type');
		this.difficultyOptions = await this.$dict('questions_difficulty');
		await this.sttypelist(); // 获取题目
		await this.countTypeFun(); // 题数 题目更新的时候需要重新获取提数
	},
	methods: {
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
		onChangeThemeType(values) {
			this.queryParams.themeTypeCodeString = values.join(',');
		},
		handleFileSuccess(response, file, fileList) {
			console.log('file', file);
		},
		/**
		 * 业务场景: 新增题目,题库选题,文件上传后需要重置分页并且需要清空列表
		 * @returns void
		 * */
		async reRequest() {
			this.initPaging(); // 重置分页
			await this.sttypelist(); // 重新发请请求
			await this.countTypeFun();
		},

		initPaging() {
			// 重置分页
			this.queryParams.current = 1;
			this.queryParams.size = 100;
			this.testlist = [];
		},
		load() {
			const { current, pages } = this.paging;
			if (current >= pages) return false;
			this.paging.current += 1;
			this.sttypelist(); // 获取题目
		},
		isExcel(file) {
			return /\.(xlsx|xls|csv)$/.test(file.name);
		},
		beforeUpload(file) {
			const status = this.isExcel(file);
			if (!status) {
				this.$message.error('请上传模板对应的文件');
				return false;
			}
			this.uploadFile(file);
			return false;
		},
		beforeLoadImageUpload(file) {
			const isJPG = file.type === 'image/jpeg';
			const isPNG = file.type === 'image/png';
			const isLt2M = file.size / 1024 / 1024 < 2;

			if (!isJPG || !isPNG) {
				this.$message.error('目前仅支持图片，支持jpg/png格式');
			}
			if (!isLt2M) {
				this.$message.error('上传附件图片大小不能超过 2MB');
			}
			return (isJPG || isPNG) && isLt2M;
		},
		uploadFile(file) {
			console.log('this.id', this.id);
			const formData = new FormData();
			formData.append('questionBankId', this.id + '');
			formData.append('excel', file);
			importTheme(formData).then((res) => {
				const status = res?.data;
				const msg = res?.msg || (status ? '操作成功' : '操作失败');
				this.$message[status ? 'success' : 'error'](msg);
				if (status) {
					this.downVisible = false;
					this.reRequest();
				}
			});
		},
		exportTemplate() {
			ADownFIle(
				VUE_APP_BASE_URL +
					VUE_APP_BASE_API +
					'/itembank/theme/excel/template',
				'模板'
			);
		},
		questionBankListFun() {
			this.dialog = true;
		},
		async batchSave(themeListData) {
			const themeList = themeListData.map((el) => el.id);
			this.questionBank.loading = true;
			otherQuestionSave({
				questionBankId: this.id,
				themeList,
			})
				.then(async (res) => {
					const { data, msg } = res;
					this.$message[data ? 'success' : 'error'](
						msg || data ? '添加备选成功' : '添加备选失败'
					);
					this.questionBank.loading = false;
				})
				.catch(() => {
					this.questionBank.loading = false;
				});
		},
		handleDialogClose() {
			this.dialog = false;
			this.questionBank = {
				questionName: '', // 题目搜索。
				choosechange: false,
				loading: false,
				questionBankId: undefined, //string  watch
				checkAll: false,
				ids: [],
				tabs: [{}], // 要禁用当前题库的id
				topic: [],
			};
		},

		handleCheckbox(checked, key, index) {
			// let value = this.form[key]; // key 对应的答案
			// const rightAnswer = this.form.rightAnswer || []; // 答案集合
			// const valueIndex = rightAnswer.indexOf(value); // 是否包含答案
			// if (valueIndex > -1 && !checked) {
			//   rightAnswer[valueIndex] = undefined;
			// } else {
			//   rightAnswer.push(value)
			// }
			// // rightAnswer[index] = checked ? value : null
			// // 如果 checked = false 并且包含的时候删除这个值
			// this.form.rightAnswer = [...rightAnswer].filter(el => el);

			// 设置必填
			this.rules[key] = [
				{ required: checked, message: '请输入选项内容' },
			];
		},

		addOptionItem() {
			// const length = this.maxOptions.length;
			// let index = this.currentOptionsNum;
			// const keyName = this.maxOptions[index - 1]
			// if (index < length) {
			//   index += 1;
			//   this.$set(this.form, keyName, this.form[keyName] || undefined)
			//   this.rules[keyName] = [{required: true, message: '请输入选项内容'}]
			// }
			// this.currentOptionsNum = index;
			const { currentOptionsNum, form, maxOptions } = this;
			const max = maxOptions?.length || 0;
			if (!max || currentOptionsNum >= max) {
				this.currentOptionsNum = max;
				return false;
			}
			const keyName = maxOptions[currentOptionsNum];
			if (keyName) {
				this.$set(this.form, keyName, this.form[keyName] || undefined);
			}

			this.currentOptionsNum += 1;
		},
		delOptionItem(keyName) {
			/**
			 * 删除选项
			 * 1 清空 form.keyName 对应得值
			 * 2 如果 form.rightAnswer 中包含 keyName
			 * 3
			 * */

			if (this.currentOptionsNum > 1) {
				this.currentOptionsNum -= 1;
				// this.$set(this.form, keyName, undefined);
				this.form[keyName] = undefined;
				// this.rules[keyName] = [{required: false, message: '请输入选项内容'}]

				// themeTypeId === '2'时，rightAnswer是个数组，否则就是个字符串
				const { rightAnswer, themeTypeId } = this.form;
				// rightAnswer 包含 keyName 就结束
				if (!rightAnswer.includes(keyName)) return false;

				this.$set(
					this.form,
					'rightAnswer',
					themeTypeId === '2'
						? rightAnswer.filter((el) => el !== keyName)
						: rightAnswer.replace(keyName, '')
				);
			}
		},
		choosetf() {
			this.truefase = !this.truefase;
		},
		setedit() {
			this.hiddenoropen = !this.hiddenoropen;
		},
		// choosechange(){
		//     this.choosechange=!this.choosechange
		// },
		onSelectChoose(value) {
			this.testlist = this.testlist.map((el) => {
				el.choosechange = value;
				return el;
			});
		},
		async searchtests() {
			this.queryParams.questionBankId = this.id;
			const data = await themePage(this.queryParams);

			this.testlist = data.data.records;
		},
		deltest(ids = []) {
			const themeList = ids.length
				? _.cloneDeep(ids)
				: _.cloneDeep(this.getAllCheckItem());
			if (!themeList.length) {
				this.$message.warning('请选择题目');
				return;
			}
			this.loading = true;
			themeQuestionDelete({
				questionBankId: this.id,
				themeList,
			})
				.then((res) => {
					this.$message.success('删除成功');
					this.reRequest();
				})
				.finally(() => {
					this.loading = false;
				});
		},
		getAllCheckItem() {
			let checkIds = [];
			this.testlist.forEach((el) => {
				console.log('el', el.topic.checked, el.id);
				if (el.topic.checked) {
					checkIds.push(el.id);
				}
			});
			return checkIds;
		},
		getId() {
			const { id } = this.$route.query;

			this.id = id;
		},
		handleCloseEdit() {
			// this.$refs.topicForm.resetFields();
			this.dialogVisible = false;
			const questionBankId = this.id;
			this.form = {
				themeName: '',
				themeTypeId: '',
				analysis: '',
				rightAnswer: '',
				questionBankId,
			};
			this.currentOptionsNum = 1;
		},

		async cofirmsave(payload) {
			console.log('payload', payload);
			const rightAnswer = payload?.rightAnswer || [];
			console.log(rightAnswer);
			if (!rightAnswer || !rightAnswer.length) return false;
			// 过滤各种图片
			Object.keys(payload).forEach((el) => {
				if (/Image/.test(el)) {
					payload[el] = payload[el]?.toString?.();
				}
			});
			payload = {
				...payload,
				questionBankId: this.id,
			};
			if (payload?.id) {
				updatetest(payload).then((res) => {
					const s = res?.data;
					this.dialogVisible = !s;
					this.$message[s ? 'success' : 'error'](res?.msg);
					if (s) {
						this.reRequest();
						this.handleCloseEdit();
					}
				});
			} else {
				themeadd(payload).then((res) => {
					const s = res?.data;
					this.dialogVisible = !s;
					this.$message[s ? 'success' : 'error'](res?.msg);
					if (s) {
						this.reRequest();
						this.handleCloseEdit();
					}
				});
			}
		},
		handleClose(done) {
			this.$confirm('确认关闭？')
				.then((_) => {
					this.handleCloseEdit();
					done();
				})
				.catch((_) => {});
		},
		async changename() {
			if (!this.questionName) {
				this.$message.warning('请输入题库名称');
				return false;
			}
			const data = await xgname({
				id: this.id,
				questionName: this.questionName,
			});
			this.xg = false;
			this.sttypelist();
			this.PaperName();
		},
		async edittest(id) {
			const res = await themedetail({ id });
			const {
				themeTypeId,
				themeTypeName,
				themeNameUrl,
				questionsTypeId,
				questionsDifficultyId,
				questionsDifficultyName,
				rightAnswer,
				...rest
			} = res?.data || {};

			this.dialogVisible = true;
			this.newId = id;

			const newRightAnswer = rightAnswer
				?.map((el) => el.toLowerCase())
				.join(',');

			console.log('newRightAnswer', newRightAnswer);
			console.log('rest', rest);

			const newForm = {
				...this.form,
				...rest,
				id,
				themeNameUrlList: themeNameUrl ? themeNameUrl.split(',') : [],
				// ...data,
				themeTypeName,
				themeTypeId,
				questionsTypeId,
				questionsDifficultyId,
				questionsDifficultyName,
				rightAnswer: _.cloneDeep(newRightAnswer),
			};
			// 过滤图片
			Object.keys(rest).forEach((el) => {
				if (/Image/.test(el)) {
					const item = rest[el];
					if (item) {
						newForm[el] =
							rest[el]?.split(',')?.filter((src) => src) || [];
					}
				}
			});
			// 生成选项 接口返回的选项字段是小写, rightAnswer 的值是大写
			this.maxOptions.forEach((el, index) => {
				const value = rest?.[el.toLowerCase()]; // 转小写获取对应的value
				if (value) {
					newForm[el] = value;
					if (index) {
						this.currentOptionsNum += 1;
					}
				}
			});
			console.log('setForm', newForm);
			// 有新属性需要set
			this.$set(this, 'form', newForm);
		},
		async countTypeFun() {
			let questionType = {};
			this.choose.forEach((el) => {
				if (el.name.indexOf('单') > -1) {
					questionType['single'] = el.id;
				}
				if (el.name.indexOf('多') > -1) {
					questionType['more'] = el.id;
				}
				if (el.name.indexOf('判') > -1) {
					questionType['judge'] = el.id;
				}
			});
			// 题数
			const res = await countType({
				questionBankId: this.id + '',
				...questionType,
			});
			const resData = res?.data || {};
			this.counts = {
				total: Object.values(resData)?.reduce((p, c) => p + c) || 0,
				...resData,
			};
		},
		// 获取全部类型
		async questionTypes(dictProp, data) {
			const res = await dictItemPages(
				{},
				{
					typeCode: dictProp,
				}
			);
			this[data] = res?.data?.list || [];
		},

		onOpenPagerName() {
			this.questionName = this.myname;
			this.xg = true;
		},

		// 获取试卷名
		async PaperName() {
			this.myname = (await tixqname({ id: this.id }))?.data?.questionName;
		},
		...tool,
		clear() {
			this.queryParams = {
				current: 1,
				size: 1000,
				questionBankIds: this.id,
			};
			this.themeTypeCodeString = [];
			this.textSearch();
		},
		textSearch() {
			this.initPaging();
			this.sttypelist();
		},
		async sttypelist() {
			// 题目列表
			this.loading = true;
			// this.queryParams.themeTypeId
			const res = await themePage({
				...this.queryParams,
				questionBankIds: this.id,
			});
			this.loading = false;
			const {
				total = 0,
				pages,
				records = [],
				current,
				...rest
			} = res?.data || {};
			this.paging = {
				// 分页
				total,
				pages,
				current,
			};

			this.count = {
				total,
				records,
				...rest,
			};
			console.log('records', records);
			console.log('this.FilteredData(records || []),', this.FilteredData(records || []));
			// 自定义内容
			this.testlist = [
				...this.testlist,
				...this.FilteredData(records || []),
			];
		},
	},
};
</script>
<style lang="scss" scoped>
@import '../topic.scss';

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
.testManager-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	span {
		margin-right: 15px;
	}
}

code {
	color: #2f4f4f;
	font-family: Menlo, Monaco, 'Courier New', monospace;
	font-size: 1em !important;
	padding: 0;
}

.descriptions {
	border: 2px dashed #e9e9e9;
	border-left: none;
	border-right: none;
	padding: 16px 0 6px 0;
	margin-bottom: 16px;
}

.testManager-card {
	::v-deep .el-card__header {
		border-bottom: 0;
	}
}

.hidden-label {
	margin-right: 12px;

	::v-deep {
		.el-radio__label,
		.el-checkbox__label {
			display: none;
		}
	}
}

.el-radio {
	display: block;
	line-height: 23px;
	white-space: normal;
	//margin-right: 0;
}
</style>
