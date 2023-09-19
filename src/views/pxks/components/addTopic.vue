<template>
	<el-dialog
		width="800px"
		title="编辑题目"
		:visible.sync="visibleBoolean"
		destroy-on-close
		:before-close="handleDialogClose"
	>
		<el-form
			:model="form"
			:rules="rules"
			label-width="80px"
			ref="editTopicForm"
		>
			<el-row>
				<el-col :span="8">
					<el-form-item label="题型" prop="themeTypeId">
						<el-select
							v-model="form.themeTypeId"
							placeholder="请选择"
						>
							<el-option
								v-for="item in choose"
								:label="item.name"
								:value="item.id"
								:key="item.id"
							></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="分类" prop="questionsTypeId">
						<el-select
							v-model="form.questionsTypeId"
							placeholder="请选择"
						>
							<el-option
								v-for="item in classTypeOptions"
								:label="item.name"
								:value="item.id"
								:key="item.id"
							></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<el-form-item label="难度" prop="questionsDifficultyId">
						<el-select
							v-model="form.questionsDifficultyId"
							placeholder="请选择"
						>
							<el-option
								v-for="item in difficultyOptions"
								:label="item.name"
								:value="item.id"
								:key="item.id"
							></el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-row>
			<el-divider></el-divider>
			<el-form-item
				style="margin-bottom: 20px"
				label="题目"
				:prop="themeName"
			>
				<div class="disp_flex">
					<el-input
						v-model="form.themeName"
						placeholder="请输入题目内容"
					/>
					<el-upload
						:headers="headerObj"
						:before-upload="beforeLoadImageUpload"
						:on-success="handleThthemeNameUrlSuccess"
						accept=".png,.jpg,jpeg"
						:action="action"
						:show-file-list="false"
						:limit="1"
						ref="question_Image_ref"
					>
						<el-button type="text" class="q-name-file">
							添加附件
						</el-button>
					</el-upload>
				</div>
				<div class="disp_flex q_image_box" v-if="form.themeNameUrlList">
					<div
						class="file-item"
						v-for="item in form.themeNameUrlList"
					>
						<div class="del_q_image" @click="del_theme_url(item)">
							&#88;
						</div>
						<img :src="item" :key="item" />
					</div>
				</div>
				<!--              <upload-pics class="upload_pics logo" :max="1" :maxSize="'1024'" v-model="form.img"-->
				<!--                           @success="to_set_pics($event, 'companyLogo')" style="float: right;"></upload-pics>-->
			</el-form-item>
			<el-form-item
				style="margin-bottom: 20px"
				prop="rightAnswer"
				label="选项"
			>
				<div class="q_border">
					<div v-if="form.themeTypeName == '单选题'">
						<el-radio-group
							v-model="form.rightAnswer"
							style="width: 100%"
						>
							<el-form-item
								label=""
								style="margin-bottom: 16px"
								v-for="(el, index) in answersOptions"
								:key="'answersOptions_radio_' + index"
							>
								<div class="disp_flex ali_cen">
									<div class="q_form">
										<el-radio
											class="hidden-label"
											:label="el.label"
											@change="
												(e) =>
													checkedChange(e, el, index)
											"
										/>
										<el-input
											v-model="el.value"
											style="width: 200px"
											@input="(e) => input(e, el.label)"
										/>
										<span style="padding-left: 20px">
											<el-tag
												type="success"
												v-if="el.checked"
												>正确</el-tag
											>
											<el-tag type="danger" v-else
												>错误</el-tag
											>
										</span>
									</div>
									<div
										style="margin-left: 12px"
										class="disp_flex"
									>
										<el-upload
											:headers="headerObj"
											:before-upload="
												beforeLoadImageUpload
											"
											:on-success="
												(res, file, fileList) =>
													handleFileSuccess(
														res,
														file,
														fileList,
														el
													)
											"
											accept=".png,.jpg,jpeg"
											:show-file-list="false"
											:action="action"
											:limit="1"
											:ref="'answer_image_ref_' + index"
										>
											<el-button
												type="text"
												class="file-btn"
											>
												添加附件
											</el-button>
										</el-upload>
										<el-button
											v-show="
												index > 1 ||
												index < topicOptions.length
											"
											type="text"
											@click="del(index)"
										>
											删除选项
										</el-button>
									</div>
								</div>
								<div
									class="disp_flex q_image_box"
									v-if="el.fileList.length"
								>
									<div
										class="file-item"
										v-for="item in el.fileList"
									>
										<div
											class="del_q_image"
											@click="
												del_q_image(
													item,
													el,
													'answer_image_ref_' + index
												)
											"
										>
											&#88;
										</div>
										<img :src="item" :key="item" />
									</div>
								</div>
							</el-form-item>
						</el-radio-group>
						<div class="addAndDel" @click="add">+ 添加选项</div>
					</div>
					<div v-if="form.themeTypeName == '多选题'">
						<el-checkbox-group
							v-model="form.rightAnswer"
							style="width: 100%"
						>
							<el-form-item
								label=""
								style="margin-bottom: 16px"
								v-for="(el, index) in answersOptions"
								:key="'answersOptions_checkbox_' + index"
							>
								<div class="disp_flex ali_cen">
									<div class="q_form">
										<el-checkbox
											@change="
												(e) =>
													checkedChange(e, el, index)
											"
											:label="el.label"
										>
											<el-input
												v-model="el.value"
												style="width: 200px"
												@input="
													(e) => input(e, el.label)
												"
											/>
											<span style="padding-left: 20px">
												<el-tag
													type="success"
													v-if="el.checked"
													>正确</el-tag
												>
												<el-tag type="danger" v-else
													>错误</el-tag
												>
											</span>
										</el-checkbox>
									</div>
									<div
										style="margin-left: 12px"
										class="disp_flex"
									>
										<el-upload
											:headers="headerObj"
											:before-upload="
												beforeLoadImageUpload
											"
											:on-success="
												(res, file, fileList) =>
													handleFileSuccess(
														res,
														file,
														fileList,
														el
													)
											"
											accept=".png,.jpg,jpeg"
											:action="action"
											:show-file-list="false"
											:limit="1"
											:ref="'answer_image_ref_' + index"
										>
											<el-button
												type="text"
												class="file-btn"
											>
												添加附件
											</el-button>
										</el-upload>
										<el-button
											v-show="
												index > 0 ||
												index < topicOptions.length
											"
											type="text"
											@click="del(index, el)"
										>
											删除选项
										</el-button>
									</div>
								</div>
								<div
									class="disp_flex q_image_box"
									v-if="el.fileList.length"
								>
									<div
										class="file-item"
										v-for="item in el.fileList"
									>
										<div
											class="del_q_image"
											@click="
												del_q_image(
													item,
													el,
													'answer_image_ref_' + index
												)
											"
										>
											&#88;
										</div>
										<img :src="item" :key="item" />
									</div>
								</div>
							</el-form-item>
						</el-checkbox-group>
						<div class="addAndDel" @click="add">+ 添加选项</div>
					</div>
					<div v-if="form.themeTypeName == '判断题'">
						<el-radio-group
							v-model="form.rightAnswer"
							style="width: 100%"
						>
							<el-form-item
								label=""
								v-for="(el, index) in answersOptions"
								:key="'answersOptions_radio_if_' + index"
								style="margin-bottom: 16px"
							>
								<div class="disp_flex ali_cen">
									<div class="q_form">
										<el-radio
											:label="el.label"
											@change="
												(e) =>
													checkedChange(e, el, index)
											"
										>
											<el-input
												v-model="el.value"
												style="width: 200px"
												@input="
													(e) => input(e, el.label)
												"
											/>
											<span style="padding-left: 20px">
												<el-tag
													type="success"
													v-if="el.checked"
													>正确</el-tag
												>
												<el-tag type="danger" v-else
													>错误</el-tag
												>
											</span>
										</el-radio>
									</div>
									<div
										style="margin-left: 12px"
										class="disp_flex"
									>
										<el-upload
											:headers="headerObj"
											:before-upload="
												beforeLoadImageUpload
											"
											:on-success="
												(res, file, fileList) =>
													handleFileSuccess(
														res,
														file,
														fileList,
														el
													)
											"
											accept=".png,.jpg,jpeg"
											:action="action"
											:show-file-list="false"
											:limit="1"
											:ref="'answer_image_ref_' + index"
										>
											<el-button type="text">
												添加附件
											</el-button>
										</el-upload>
									</div>
								</div>
								<div
									class="disp_flex q_image_box"
									v-if="el.fileList.length"
								>
									<div
										class="file-item"
										v-for="item in el.fileList"
									>
										<div
											class="del_q_image"
											@click="
												del_q_image(
													item,
													el,
													'answer_image_ref_' + index
												)
											"
										>
											&#88;
										</div>
										<img :src="item" :key="item" />
									</div>
								</div>
							</el-form-item>
						</el-radio-group>
					</div>
				</div>
			</el-form-item>
			<el-form-item style="margin-bottom: 20px" label="题目解析">
				<el-input
					type="textarea"
					placeholder="请输入题目解析"
					v-model="form.analysis"
				></el-input>
			</el-form-item>
			<el-form-item style="margin-bottom: 20px" label="解析图片">
				<upload-pics
					class="upload_pics logo"
					:max="1"
					:maxSize="'1024'"
					v-model="form.analysisImage"
					@success="to_set_pics($event, 'analysisImage')"
				/>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="handleCloseEdit">取 消</el-button>
			<el-button type="primary" @click="submit">确 定</el-button>
		</div>
	</el-dialog>
</template>

<script>
import uploadPics from '@/components/custom/uploadPics';
import { topicOptions } from '../config';
import { getToken } from '@/utils/auth';
import store from '@/store';
import { BASE_API, BASE_URL } from '@/config';
import _ from 'lodash';

const defineOptions = {
	checked: false,
	value: '',
	label: topicOptions[0],
	fileList: [],
};

const { VUE_APP_BASE_URL, VUE_APP_BASE_API } = process.env;

function rightAnswerFun(val, rightAnswer) {
	console.log('val', val);
	console.log('rightAnswer', rightAnswer);
	if (rightAnswer.length > 1) {
		return val == '多选题' ? rightAnswer.split(',') : [rightAnswer];
	} else {
		return val == '多选题' ? [rightAnswer] : rightAnswer;
	}
}

export default {
	name: 'addTopic',
	components: {
		uploadPics,
	},
	computed: {
		themeName() {
			return this.form.themeName ? 'themeName' : 'themeNameUrlList';
		},
	},
	props: {
		visible: {
			type: Boolean,
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
		payload: {
			type: Object,
			default: () => ({}),
		},
	},
	watch: {
		'form.themeTypeId': function (val) {
			if (!val) return;
			const qItem = this.choose.find((el) => el.id == val);
			this.form.themeTypeName = qItem.name;

			if (!this.form.id) {
				this.topicOptions.forEach((el) => {
					if (this.form.hasOwnProperty(el)) {
						this.form[el] = undefined;
					}
				});
			}
			if (this.payload.themeTypeId !== val) {
				if (qItem.name == '判断题') {
					this.form.rightAnswer = undefined;
					const [a, b] = topicOptions;
					this.answersOptions = [
						{
							checked: false,
							value: '',
							label: a,
							fileList: [],
						},
						{
							checked: false,
							value: '',
							label: b,
							fileList: [],
						},
					];
				} else {
					this.form.rightAnswer = [];
					this.answersOptions = [_.cloneDeep(defineOptions)];
				}
			}
		},
		payload: function (val) {
			console.log('val', val);
			console.log('themeTypeName', val.themeTypeName);
			if (val.id) {
				this.answersOptions = this.topicOptions
					.map((el) => {
						const value = val[el] ? val[el] : '';
						const fileImage = val[el + 'image'];
						if (value || fileImage) {
							return {
								label: el,
								value,
								checked: val.rightAnswer
									.split(',')
									.includes(el),
								fileList: fileImage ? fileImage.split(',') : [],
							};
						}
						return undefined;
					})
					.filter((el) => el);
				this.form = {
					..._.cloneDeep(val),
					rightAnswer:
						val.themeTypeName == '多选题'
							? val.rightAnswer.split(',')
							: val.rightAnswer,
				};
			}
		},
		visible: {
			handler: function (val) {
				this.visibleBoolean = val;
			},
			immediate: true,
		},
		visibleBoolean: function (val) {
			if (!val) {
				this.answersOptions = [{ ..._.cloneDeep(defineOptions) }];
				this.initForm();
			}
		},
	},
	// computed: {
	// 	themeTypeName() {
	//         console.log(' this.form.themeTypeId',  this.form);
	// 		const qItem = this.choose.find(
	// 			(el) => el.id == this.form.themeTypeId
	// 		);
	// 		return qItem ? qItem?.name : '';
	// 	},
	// },
	data() {
		return {
			headerObj: {
				Authorization: '',
			},
			action: BASE_API + '/basic/BasicFile/itembankUpload',
			topicOptions,
			visibleBoolean: true,
			form: {},
			rules: {
				themeTypeId: [{ required: true, message: '请选择题目类型' }],
				questionsTypeId: [{ required: true, message: '请选择分类' }],
				questionsDifficultyId: [
					{ required: true, message: '请选择难度' },
				],
				themeName: [{ required: true, message: '请输入题目' }],
				themeNameUrlList: [{ required: true, message: '请输入题目' }],
				rightAnswer: [
					{
						required: true,
						message: '请选择正确答案',
						validator: (rule, value, callback) => {
							if (!value) callback(new Error());
							if (
								this.form.themeTypeName == '多选题' &&
								!value.length
							)
								callback(new Error());
							callback();
						},
					},
				],
				// ...topicOptions.reduce((pre, cur) => {
				// 	pre[cur] = [{ required: true, message: '请输入选项内容' }];
				// 	return pre;
				// }, {}),
			},
			answersOptions: [{ ..._.cloneDeep(defineOptions) }],
		};
	},
	created() {
		this.initForm();
		if (store.getters.token) {
			this.headerObj['Authorization'] = getToken();
		}
	},

	methods: {
		del_theme_url(item) {
			this.form.themeNameUrlList = this.form.themeNameUrlList.filter(
				(el) => el != item
			);
			this.$refs.question_Image_ref.clearFiles();
		},
		del_q_image(item, el, uploadRef) {
			console.log('uploadRef', this.$refs[uploadRef]);
			el.fileList = el.fileList.filter((e) => e != item);
			this.$refs[uploadRef][0].clearFiles();
		},
		handleFileSuccess(response, file, fileList, item) {
			item.fileList.push(response.data.url);
		},
		handleThthemeNameUrlSuccess(response, file, fileList, item) {
			this.form.themeNameUrlList.push(response.data.url);
		},
		beforeLoadImageUpload(file) {
			console.log('file', file);
			const isJPG = file.type === 'image/jpeg';
			const isPNG = file.type === 'image/png';
			const isLt2M = file.size / 1024 / 1024 < 2;

			if (!isJPG && !isPNG) {
				this.$message.error('目前仅支持图片，支持jpg/png格式');
			}
			if (!isLt2M) {
				this.$message.error('上传附件图片大小不能超过 2MB');
			}
			return (isJPG || isPNG) && isLt2M;
		},
		initForm() {
			this.form = {
				themeName: undefined,
				themeTypeId: undefined,
				themeTypeName: '',
				analysis: undefined,
				analysisImage: [],
				rightAnswer: [],
				themeNameUrlList: [],
				...topicOptions.reduce((pre, cur) => {
					pre[cur] = undefined;
					pre[`${cur}Image`] = undefined;
					return pre;
				}, {}),
			};
		},
		handleCloseEdit() {
			this.visibleBoolean = false;
			this.$emit('update:visible', this.visibleBoolean);
		},
		handleDialogClose() {
			this.visibleBoolean = false;
			this.$emit('update:visible', this.visibleBoolean);
		},
		submit() {
			this.$refs.editTopicForm.validate((valid) => {
				if (!valid) return false;
				let rightAnswer = [];
				const { answersOptions, topicOptions, form } = this;
                
				let isCanSave = true;
				for (let i = 0; i < answersOptions.length; i++) {
					const el = answersOptions[i];
					if ((!el.value && !el.fileList.length)) {
                        isCanSave = false;
                        break;
					}
				}
				if (!isCanSave) {
					this.$message.warning('请输入选项内容');
					return;
				}

				let newAnswersOptions = _.cloneDeep(answersOptions);
				form.themeNameUrl = form.themeNameUrlList?.join(',');

				let payload = {
					...form,
					analysisImage: form.analysisImage?.toString?.(),
					rightAnswer: [],
				};
				// 清除旧的数据
				topicOptions.forEach((el) => {
					payload[el] = undefined;
					payload[`${el}Image`] = undefined;
				});

				// 修改 answersOptions 中的 label
				// 正确答案从 answersOptions 获取checked true的值
				newAnswersOptions.forEach((el, index) => {
					const label = topicOptions[index];
					el.label = label;
					payload[el.label] = el.value;
					if (el.checked) {
						rightAnswer.push(label.toUpperCase());
					}
					payload[label + 'image'] = el.fileList?.join(',');
				});

				if (!rightAnswer.length) {
					this.$message.warning('请选择正确答案');
					return;
				}
				payload.rightAnswer = rightAnswer;
				// return false;
				this.$emit('edit-success', payload);
			});

			// const answer = this.answersOptions.map(el => el.value);
		},
		to_set_pics(files, key) {
			console.log(files, key);
			this.form[key] = files;
		},
		add() {
			const { answersOptions, topicOptions } = this;
			const length = answersOptions.length;
			if (length >= topicOptions.length) return false;
			this.answersOptions.push({
				checked: false,
				value: '',
				label: topicOptions[length],
				fileList: [],
			});
		},
		del(index) {
			if (this.answersOptions.length === 1) return false;
			this.answersOptions.splice(index, 1);
		},
		checkedChange(e, el, index) {
			// 区分单选和多选
			if (this.form.themeTypeName == '多选题') {
				this.answersOptions[index].checked = e;
			} else {
				this.answersOptions = this.answersOptions.map((item, i) => {
					return {
						...item,
						checked: index === i,
					};
				});
			}
			console.log('checkedChange', this.answersOptions);
		},
		input(e, name) {
			console.log(e, name, 'e, name');
			this.form[name] = e;
		},
	},
};
</script>

<style scoped lang="scss">
.q-name-file {
	margin-left: 15px;
}
.q_image_box {
	padding-top: 20px;
	.file-item {
		width: 56px;
		height: 56px;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		margin-right: 10px;
		.del_q_image {
			width: 16px;
			height: 16px;
			font-size: 12px;
			background: #3a3c47;
			color: #fff;
			text-align: center;
			line-height: 16px;
			border-radius: 50%;
			position: absolute;
			right: -5px;
			top: -5px;
			cursor: pointer;
		}
		img {
			width: 100%;
			height: 100%;
		}
	}
}
.file-btn {
	margin-right: 15px;
}
.addAndDel {
	width: 100%;
	text-align: center;
	border: 1px dotted #ddd;
	cursor: pointer;
}
.ali_cen {
	justify-content: space-between;
}
.q_border {
	border: 1px solid #ddd;
	padding: 20px;
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
</style>
