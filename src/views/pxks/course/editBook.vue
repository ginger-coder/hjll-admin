<template>
	<div class="has-page-header">
		<div class="disp_flex ju_bet ali_cen page-header">
			<span class="title">管理课件/参与人</span>
			<div class="btn-box">
				<el-button @click="onClose">取消</el-button>
				<el-button type="primary" :loading="saveLoading" @click="onSave"
					>保存</el-button
				>
			</div>
		</div>
		<div class="page-main">
			<el-card shadow="hover" class="box-card" :loading="loading">
				<div slot="header" class="clearfix">
					<span>课程内容</span>
				</div>
				<el-form
					:model="queryParams"
					ref="initFormRef"
					label-width="100px"
					class="init-dynamic"
				>
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
				<courseContent
					@change="onCourseCompChange"
					:list="queryParams.courseContentVOList"
				/>
			</el-card>
		</div>
		<examPeopleDialog
			:visible.sync="examPeopleDialog"
			@save="onUpdateExamPeople"
            :active="queryParams.answerPeople"
		/>
	</div>
</template>

<script>
import examPeopleDialog from '@/components/examPeopleDialog.vue';
import courseContent from './courseContent.vue';
import { getCourseInfo, onCourseUpdatePart } from '@/api/course';

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
            loading: false,
            saveLoading: false,
			queryParams: {
				answerPeople: [],
				answerPeopleInfoList: [],
			},
			courseTypeCode: [],
			classTypeOptions: [],
			courseTime: [],
			examPeopleDialog: false,
		};
	},
	methods: {
		onCourseCompChange(data) {
			this.queryParams.courseContentList = data.filter(el => {
                return !el.disabled
            });
		},
		onUpdateExamPeople({ answerPeople, answerPeopleInfo }) {
			this.queryParams.answerPeopleInfoList =
				_.cloneDeep(answerPeopleInfo);
			this.queryParams.answerPeople = _.cloneDeep(answerPeopleInfo);
		},
		onSelectExamDialog() {
			this.examPeopleDialog = true;
		},
		initCourseData(courseId) {

            this.loading = true;
			getCourseInfo({
				courseId,
			}).then((res) => {
				if (res.data) {
					const courseTime = [
						new Date(res.data.startTime),
						new Date(res.data.endTime),
					];
                    // 已经存在的不可编辑
                    res.data.courseContentVOList = res.data.courseContentVOList.map(el => {
                        el.disabled = true;
                        return el;
                    })
					this.queryParams = {
						courseTime,
						...this.queryParams,
						...res.data,
					};
				}
			})
            .finally(() => {
                this.loading = false;
            })
		},
		onClose() {
			this.$router.go(-1);
		},
		onSave() {
			this.$refs.initFormRef.validate((valid) => {
				if (valid) {
                    this.saveLoading = true;
					return onCourseUpdatePart({
						...this.queryParams,
					}).then((res) => {
						this.$message.success('保存成功');
						this.$router.replace('/testTrain/course');
					})
                    .finally(() => {
                        this.saveLoading = false;
                    })
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
