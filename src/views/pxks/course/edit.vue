<template>
	<div class="has-page-header">
		<div class="disp_flex ju_bet ali_cen page-header">
			<span class="title">{{
				queryParams.id ? '管理课程' : '创建课程'
			}}</span>
			<div class="btn-box">
				<el-button @click="onClose">取消</el-button>
				<template v-if="!queryParams.id">
					<el-button type="primary" @click="onCreate(0, 'create')"
						>仅创建课程</el-button
					>
					<el-button type="primary" @click="onCreate(1, 'create')"
						>创建并发布课程</el-button
					>
				</template>
				<template v-else>
					<el-button
						type="primary"
						@click="onCreate(queryParams.status, 'update')"
						>仅保存课程</el-button
					>
					<el-button type="primary" @click="onCreate(1, 'update')"
						>保存并发布课程</el-button
					>
				</template>
			</div>
		</div>
		<div class="page-main">
			<el-card shadow="hover" class="card-init">
				<div slot="header" class="clearfix">
					<span>基本信息</span>
				</div>
				<el-form
					:model="queryParams"
					ref="initFormRef"
					label-width="100px"
					class="init-dynamic"
				>
					<el-form-item
						label="课程名称："
						prop="courseName"
						:rules="[
							{
								required: true,
								message: '请输入课程名称',
								trigger: 'blur',
							},
						]"
					>
						<el-input v-model="queryParams.courseName"></el-input>
					</el-form-item>
					<el-form-item
						label="课程分类："
						prop="courseTypeCode"
						:rules="[
							{
								required: true,
								message: '请输入课程分类',
								trigger: 'change',
							},
						]"
					>
						<el-select
							v-model="queryParams.courseTypeCode"
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
						label="课程时间："
						prop="courseTime"
						:rules="[
							{
								required: true,
								message: '请选择课程时间范围',
								trigger: 'change',
							},
						]"
					>
						<el-date-picker
							v-model="queryParams.courseTime"
							type="datetimerange"
							range-separator="至"
							start-placeholder="开始日期"
							value-format="yyyy-MM-dd HH:mm:ss"
							end-placeholder="结束日期"
							@change="onCourseTimeChange"
						>
						</el-date-picker>
					</el-form-item>
					<el-form-item
						label="课程封面："
						prop="courseImage"
						:rules="[
							{
								required: true,
								message: '请选择课程封面',
								trigger: 'change',
							},
						]"
					>
						<el-upload
							class="avatar-uploader"
							:headers="headerObj"
							:before-upload="beforeLoadImageUpload"
							:on-success="handleThthemeNameUrlSuccess"
							:on-error="handleThthemeNameUrlError"
							accept=".png,.jpg,jpeg"
							:action="action"
							:show-file-list="false"
						>
							<img
								v-if="queryParams.courseImage"
								:src="queryParams.courseImage"
								class="avatar"
							/>
							<i
								v-else
								class="el-icon-plus avatar-uploader-icon"
							></i>
						</el-upload>
						<div class="tip">建议图片尺寸5:3 大小 &lt; 2M</div>
					</el-form-item>
					<el-form-item
						label="课程简介："
						prop="illustrate"
						:rules="[
							{
								required: true,
								message: '请输入课程简介',
								trigger: 'blur',
							},
						]"
					>
						<el-input
							type="textarea"
							:rows="3"
							placeholder="请输入内容"
							v-model="queryParams.illustrate"
						>
						</el-input>
					</el-form-item>
					<el-form-item
						label="课程人群："
						prop="answerPeople"
						:rules="[
							{
								required: true,
								message: '请选择人群',
							},
						]"
					>
						<span style="margin-right: 15px">{{
							answerPeopleInfo
						}}</span>
						<el-button type="text" @click="onSelectExamDialog"
							>选择</el-button
						>
					</el-form-item>
				</el-form>
			</el-card>
			<el-card shadow="hover" class="box-card">
				<div slot="header" class="clearfix">
					<span>课程内容</span>
				</div>
				<courseContent
					@change="onCourseCompChange"
					:list="queryParams.courseContentVOList"
				/>
			</el-card>
		</div>
		<examPeopleDialog
			:visible.sync="examPeopleDialog"
			@save="onUpdateExamPeople"
            :active="showAnswerPeople"
		/>
	</div>
</template>

<script>
import examPeopleDialog from '@/components/examPeopleDialog.vue';
import courseContent from './courseContent.vue';
import store from '@/store';
import { getToken } from '@/utils/auth';
import { BASE_API } from '@/config';
import { getCourseInfo, onCourseCreate, onCourseUpdate } from '@/api/course';

export default {
	components: {
		examPeopleDialog,
		courseContent,
	},
	filters: {},
	watch: {
		'$route.query': {
			immediate: true,
			handler(newValue, oldValue) {
				if (newValue.id) {
					this.queryParams.id = newValue.id;
					this.initCourseData(newValue.id);
				}
			},
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
	data() {
		return {
            showAnswerPeople: [],
			headerObj: {
				Authorization: '',
			},
			action: BASE_API + '/basic/BasicFile/itembankUpload',
			queryParams: {
				courseImage: '',
				answerPeople: [],
				answerPeopleInfoList: [],
			},
			courseTypeCode: [],
			classTypeOptions: [],
			courseTime: [],
			examPeopleDialog: false,
		};
	},
	async created() {
		this.classTypeOptions = await this.$dict('course_type');
		if (store.getters.token) {
			this.headerObj['Authorization'] = getToken();
		}
	},
	methods: {
		onCourseCompChange(data) {
			this.queryParams.courseContentList = _.cloneDeep(data);
		},
		onUpdateExamPeople({ answerPeople, answerPeopleInfo }) {
			this.queryParams.answerPeopleInfoList =
				_.cloneDeep(answerPeopleInfo);
			this.queryParams.answerPeople = _.cloneDeep(answerPeople);
            this.showAnswerPeople = _.cloneDeep(answerPeopleInfo);
		},
		onSelectExamDialog() {
			this.examPeopleDialog = true;
		},
		handleThthemeNameUrlError() {
			this.$message.error('上传失败');
		},
		handleThthemeNameUrlSuccess(res, file, fileList, item) {
			console.log('res', res);
			this.queryParams.courseImage = res.data.url;
			console.log(
				'this.queryParams.courseImage',
				this.queryParams.courseImage
			);
		},
		beforeLoadImageUpload(file) {
			const isJPG = file.type === 'image/jpeg';
			const isPNG = file.type === 'image/png';
			const isLt2M = file.size / 1024 / 1024 <= 2;

			if (!isJPG && !isPNG) {
				this.$message.error('目前仅支持图片，支持jpg/png格式');
			}
			if (!isLt2M) {
				this.$message.error('上传附件图片大小不能超过 2MB');
			}
			return (isJPG || isPNG) && isLt2M;
		},
		onCourseTimeChange(values) {
			this.queryParams.startTime = values[0];
			this.queryParams.endTime = values[1];
		},
		onTypeCodeChange(values) {
			this.queryParams.courseTypeCodeString = values.join(',');
		},
		initCourseData(courseId) {
			getCourseInfo({
				courseId,
			}).then((res) => {
				if (res.data) {
					this.courseTime = [
						new Date(res.data.startTime),
						new Date(res.data.endTime),
					];
					this.queryParams = {
						...this.queryParams,
						...res.data,
					};
                    this.showAnswerPeople = _.cloneDeep(res.data.answerPeople);
				}
			});
		},
		onClose() {
			this.$router.go(-1);
		},
		onCreate(status, type) {
			this.$refs.initFormRef.validate((valid) => {
				if (valid) {
					const request =
						type == 'create' ? onCourseCreate : onCourseUpdate;
					return request({
						...this.queryParams,
						status,
					}).then((res) => {
						if (status == 1) {
							this.$message.success('创建并发布成功');
						} else {
							this.$message.success('创建成功');
						}
						this.$router.replace('/testTrain/course');
					});
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
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
		.card-init {
			margin-bottom: 20px;
		}
	}
}
</style>
