<template>
	<div class="sign-content" v-loading="loading">
		<div class="header">上传文件</div>
		<el-upload
			action="#"
			:before-upload="before_upload"
			:limit="1"
			:file-list="fileList"
			:show-file-list="false"
			accept=".pdf"
		>
			<el-button size="small" type="primary" icon="el-icon-upload2"
				>上传</el-button
			>
			<span slot="tip" class="el-upload__tip">
				支持上传pdf,不超过30M,且只能上传一个
			</span>
		</el-upload>
		<div class="file-list">
			<div class="file-warp" :key="item" v-for="item in file.fileList">
				<div class="file-card">
					<div class="file-image">
						<div class="check">
							<img
								:src="viewUrl + item.url"
								alt=""
								style="width: 150px"
							/>
						</div>
					</div>
					<div class="file-title">
						{{ item.name }}
					</div>
					<div class="file-footer">
						<div
							class="delete-btn"
							@click="deleteBtn(item.signatureId)"
						>
							<i class="btn el-icon-delete"></i>删除
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="card-footer">
			<el-button
				class="submit-btn"
				type="primary"
				size="medium"
				@click="handleNext"
				>下一步</el-button
			>
		</div>
		<el-divider></el-divider>
	</div>
</template>
<script>
import {
	enterpriseInitiateProtocol,
	deleteEnterprise,
	getProtocolDetail,
} from '@/api/isp';
import { mapState } from 'vuex';
import { BASE_UPLOAD } from '@/config';
export default {
	name: 'card',
	components: {},
	data() {
		return {
			loading: false,
			signatureId: '',
			id: '',
			ids: '',
			entName: '',
			signatory: '',
			entQualificationNum: '',
			fileList: [],
			viewUrl: BASE_UPLOAD,
            signEndTime: '',
		};
	},
    computed: mapState(['file']),
	async created() {
		const { id, entQualificationNum, signatory, entName, signatureId } =
			this.$route.query;
		this.entName = entName;
		this.signatory = signatory;
		this.entQualificationNum = entQualificationNum;
		this.id = id;
		if (signatureId) {
			this.signatureId = signatureId;
			// this.getDetail();
		}
	},
	mounted() {},
	methods: {
		handleNext() {
			if (this.file.fileList.length == 0) {
				return this.$message.error('请上传文件');
			}
			this.$router.push({
				path: '/isp/ispSign/time',
				query: {
					id: this.id,
					signatureId: this.signatureId,
					entQualificationNum: this.entQualificationNum,
                    signEndTime: this.file.signEndTime,
					signatory:this.signatory,
					entName:this.entName,
				},
			});
		},
		before_upload(files) {
			const isSize = files.size / 1024 / 1024 <= 30; //限制图片大小
			if (!isSize) {
				return this.$message.error('上传图片大小不能超过 30MB!');
			}
			let newFormData = new FormData();
			newFormData.append('step', 1);
			newFormData.append('protocolFile', files);
			newFormData.append('entQualificationNum', this.entQualificationNum);
			this.loading = true;
			enterpriseInitiateProtocol(newFormData)
				.then((res) => {
					if (res.code == 0) {
                        this.$store.dispatch('file/addFileList',{
							name: files.name,
							url: res.data.thumbnailUrl,
							signatureId: res.data.id,
						});
						this.signatureId = res.data.id;
					}
				})
				.catch((err) => {})
				.finally(() => {
					this.loading = false;
				});
		},
		deleteBtn(signatureId) {
			deleteEnterprise({ id: signatureId })
				.then((res) => {
					if (res.code == 0) {
						this.$message.success('删除成功');
						this.$store.dispatch('file/deleteFile');
					}
				})
				.catch((err) => {});
		},
		getDetail() {
			getProtocolDetail({ id: this.signatureId })
				.then((res) => {
					if (res.code == 0) {
						this.fileList = [
							{
								name: res.data.agreementDocName,
								url: res.data.thumbnailUrl,
								signatureId: res.data.id,
							},
						];
                        this.signEndTime = res.data.signEndTime || '';
					}
				})
				.catch((err) => {});
		},
	},
};
</script>
<style lang="scss" scoped>
.conainer {
	min-height: 100%;
	background-color: #fff;
	padding: 20px;
	box-sizing: border-box;
}
.sign-content {
	.header {
		padding: 20px 0;
		font-size: 14px;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 600;
	}
	.file-list {
		padding-top: 30px;
		display: flex;
		flex-wrap: wrap;
		max-width: 100%;
		.file-warp {
			margin: 0 8px 20px;
		}
		.file-card {
			width: 245px;
			height: auto;
			background: #ffffff;
			border-radius: 8px;
			border: 1px solid #e9e9e9;
			padding-bottom: 20px;
			.file-image {
				width: 100%;
				height: auto;
				position: relative;
				.check {
					text-align: center;
				}
			}
			.file-title {
				box-sizing: border-box;
				padding: 16px 10px;
				font-size: 16px;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: rgba(0, 0, 0, 0.85);
				height: 60px;
				display: -webkit-box;
				overflow: hidden;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
			}
			.file-footer {
				display: flex;
				padding-top: 20px;
				justify-content: flex-end;
				padding-right: 20px;
				.delete-btn {
					font-size: 16px;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #4365ac;
					cursor: pointer;
					.btn {
						margin-right: 5px;
					}
				}
			}
		}
	}
	.card-footer {
		text-align: center;
		padding: 20px;
	}
}
</style>
