<template>
	<div class="disp_flex flex_column" style="height: 100%">
		<el-card
			shadow="hover"
			style="margin-bottom: 24px"
			:body-style="{ padding: '16px 20px 0 20px' }"
		>
			<el-form
				ref="form"
				:inline="true"
				:model="queryParams"
				class="demo-form-inline"
			>
				<el-form-item label="名称">
					<el-input
						placeholder="请输入"
						v-model="queryParams.coursewareName"
					>
					</el-input>
				</el-form-item>
				<el-form-item label="类型">
					<el-select
						v-model="queryParams.fileType"
						placeholder="请选择"
					>
						<el-option
							v-for="item in fileTypeList"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="分类">
					<el-select
						v-model="coursewareTypeCode"
						placeholder="请选择"
						multiple
					>
						<el-option
							:label="item.name"
							:value="item.id"
							v-for="item in coursewareTypeOptions"
							:key="item.id"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button @click="onSearch" type="primary">搜索</el-button>
					<el-button @click="resetField" type="primary" plain
						>重置</el-button
					>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card
			shadow="hover"
			class="m-card-full-body flex"
			:body-style="{ height: '91%', paddingBottom: '10px' }"
		>
			<div slot="header" class="disp_flex ali_cen ju_bet">
				<el-button
					@click="createBook"
					type="primary"
					icon="el-icon-plus"
					>上传课件
				</el-button>
			</div>
			<mTable
				ref="mTable"
				height="100%"
				:loading.sync="loading"
				stripe
				:columns="columns"
				:request="getCoursewareList"
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
				<template slot="action">
					<el-table-column label="操作" width="200" align="center">
						<template v-slot="{ row }">
							<el-button type="text" @click="editBookInfo(row.id)"
								>管理课件</el-button
							>
							<el-button type="text" @click="onDownloadBook(row)"
								>下载</el-button
							>
							<el-button type="text" @click="onCheckBook(row.id)"
								>查看使用记录
							</el-button>
							<el-button type="text" @click="onDeleteBook(row.id)"
								>删除
							</el-button>
						</template>
					</el-table-column>
				</template>
			</mTable>
		</el-card>
		<el-dialog
			title="上传课件"
			:visible.sync="createParams.visible"
			width="800px"
		>
			<el-form :model="createParams" ref="createBookForm">
				<el-form-item
					label="上传"
					:label-width="formLabelWidth"
					prop="coursewareName"
					:rules="[{ required: true, message: '请上传课件' }]"
				>
					<el-upload
						class="upload-demo"
						ref="uploadRef"
						drag
						:action="action"
						:headers="headerObj"
						:before-upload="beforeLoadImageUpload"
						:on-success="handleThthemeNameUrlSuccess"
						:on-error="handleThthemeNameUrlError"
						:limit="1"
						accept=".mp4,.mp3,.rmvb,.flv,.pdf,.ppt"
					>
						<i class="el-icon-upload"></i>
						<div class="el-upload__text">
							将文件拖到此处，或<em>点击上传</em>
						</div>
						<div
							class="el-upload__tip"
							slot="tip"
							style="color: #999"
						>
							<p style="line-height: 5px">
								支持上传文件类型即要求：
							</p>
							<p style="line-height: 5px">
								视频：MP4、Rmvb、Flv，大小不超过1G
							</p>
							<p style="line-height: 5px">
								音频：MP3，大小不超过200M
							</p>
							<p style="line-height: 5px">PPT：大小不超过200M</p>
							<p style="line-height: 5px">PDF：大小不超过500M</p>
						</div>
					</el-upload>
				</el-form-item>
				<el-form-item
					label="名称"
					:label-width="formLabelWidth"
					prop="coursewareName"
					:rules="[{ required: true, message: '名称不能为空' }]"
				>
					<el-input
						v-model="createParams.coursewareName"
						autocomplete="off"
					></el-input>
				</el-form-item>
				<el-form-item
					label="分类"
					:label-width="formLabelWidth"
					prop="coursewareTypeCode"
					:rules="[{ required: true, message: '分类不能为空' }]"
				>
					<el-select
						v-model="createParams.coursewareTypeCode"
						placeholder="请选择"
					>
						<el-option
							:label="item.name"
							:value="item.id"
							v-for="item in coursewareTypeOptions"
							:key="item.id"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item
					label="说明"
					:label-width="formLabelWidth"
					prop="illustrate"
				>
					<el-input
						v-model="createParams.illustrate"
						autocomplete="off"
						type="textarea"
					></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="onCloseBook">取 消</el-button>
				<el-button
					type="primary"
					@click="onCreateBook"
					:loading="btnLoading"
					>确 定</el-button
				>
			</div>
		</el-dialog>
		<el-dialog
			title="管理课件"
			:visible.sync="editParams.visible"
			width="800px"
		>
			<el-form :model="editParams" ref="editBookForm">
				<el-form-item
					label="名称"
					:label-width="formLabelWidth"
					prop="coursewareName"
					:rules="[{ required: true, message: '名称不能为空' }]"
				>
					<el-input
						v-model="editParams.coursewareName"
						autocomplete="off"
					></el-input>
				</el-form-item>
				<el-form-item
					label="分类"
					:label-width="formLabelWidth"
					prop="coursewareTypeCode"
					:rules="[{ required: true, message: '分类不能为空' }]"
				>
					<el-select
						v-model="editParams.coursewareTypeCode"
						placeholder="请选择"
					>
						<el-option
							:label="item.name"
							:value="item.id"
							v-for="item in coursewareTypeOptions"
							:key="item.id"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item
					label="说明"
					:label-width="formLabelWidth"
					prop="illustrate"
				>
					<el-input
						v-model="editParams.illustrate"
						autocomplete="off"
						type="textarea"
					></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="onCloseEditBook">取 消</el-button>
				<el-button
					type="primary"
					@click="onUpdateBook"
					:loading="btnLoading"
					>确 定</el-button
				>
			</div>
		</el-dialog>
		<el-dialog
			title="关联课程列表"
			:visible.sync="checkParams.visible"
			width="800px"
		>
			<mTable
				ref="checkTable"
				height="400px"
				:loading.sync="checkLoading"
				stripe
				:columns="checkColumns"
				:request="getBookHistory"
				:payload="checkParams"
			>
				<template slot="action">
					<el-table-column label="操作" width="200" align="center">
						<template v-slot="{ row }">
							<el-button type="text" @click="checkBookInfo(row)"
								>查看课程</el-button
							>
						</template>
					</el-table-column>
				</template>
			</mTable>
			<div slot="footer" class="dialog-footer">
				<el-button
					type="primary"
					@click="() => checkParams.visible = false"
					>关 闭</el-button
				>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import _ from 'lodash';
import mTable from '@c/business/table';
import { downloadFile } from '@/utils';
import {
	getCoursewareList,
	createCourseBook,
	getBookInfo,
	coursewareUpdate,
	coursewareDelete,
	delCoursewareCheck,
    getBookHistory,
} from '@/api/book';
import { BASE_API, BASE_URL } from '@/config';
import { getToken } from '@/utils/auth';
import store from '@/store';

const defaultParams = {
	visible: false,
	coursewareName: '',
	coursewareTypeCode: '',
	coursewareUrl: '',
	fileType: '',
	illustrate: '',
};
export default {
	components: {
		mTable,
	},
	data() {
		return {
			loading: false,
			headerObj: {},
			action: BASE_API + '/basic/BasicFile/itembankUpload',
			formLabelWidth: '100px',

			createParams: _.cloneDeep(defaultParams),
			editParams: _.cloneDeep(defaultParams),

            checkLoading: false,
			checkParams: {
				visible: false,
			},

			btnLoading: false,

			coursewareTypeOptions: [],
			fileTypeList: [
				{
					label: '视频',
					value: '视频',
				},
				{
					label: '音频',
					value: '音频',
				},
				{
					label: 'PPT',
					value: 'PPT',
				},
				{
					label: 'PDF',
					value: 'PDF',
				},
			],
			coursewareTypeCode: [],
			queryParams: {},
			columns: [
				{
					label: '序号',
					slot: 'index',
				},
				{
					label: '名称',
					prop: 'coursewareName',
				},
				{
					label: '类型',
					prop: 'fileType',
				},
				{
					label: '分类',
					prop: 'coursewareTypeName',
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
			checkColumns: [
				{
					label: '课程名称',
					prop: 'courseName',
				},
				{
					label: '开始时间',
					prop: 'startTime',
				},
				{
					label: '结束时间',
					prop: 'endTime',
				},
				{
					slot: 'action',
				},
			],
		};
	},
	methods: {
        getBookHistory,
		getCoursewareList,
		onCheckBook(id) {
            this.checkLoading = true;
			this.checkParams.coursewareId = id;
			this.checkParams.visible = true;
            setTimeout(() => {
                this.$refs.checkTable.resetInit();
            }, 500)
		},
        checkBookInfo(row) {
            this.$router.push({
                path: '/testTrain/course',
                query: {
                    courseName: row.courseName,
                    type: 'book'
                }
            })
        },
		onCreateBook() {
			this.$refs.createBookForm.validate((valid) => {
				if (valid) {
					this.btnLoading = true;
					createCourseBook(this.createParams)
						.then((res) => {
							this.$message.success('创建成功');
							this.onCloseBook();
							this.onSearch();
						})
						.finally(() => {
							this.btnLoading = false;
						});
				} else {
					return false;
				}
			});
		},
		onDownloadBook(row) {
			downloadFile(row.coursewareUrl, row.coursewareName, (progress) => {
				// 下载进度
				console.log('progress: ' + progress + '%');
			}).then(() => {
				// 下载完成todo
				console.log('下载完成');
			});
		},
		onUpdateBook() {
			this.$refs.editBookForm.validate((valid) => {
				if (valid) {
					this.btnLoading = true;
					coursewareUpdate(this.editParams)
						.then((res) => {
							this.$message.success('更新成功');
							this.onCloseEditBook();
							this.onSearch();
						})
						.finally(() => {
							this.btnLoading = false;
						});
				} else {
					return false;
				}
			});
		},
		async onDeleteBook(id) {
			const checkResult = await delCoursewareCheck({
				coursewareId: id,
			});
			if (checkResult.data && checkResult.data.length) {
				const h = this.$createElement;
				const books = [
					h(
						'h4',
						null,
						'该课件已被下列课程选用，无法删除。若想删除，请先删除相关课程.'
					),
				];
				for (let i = 0; i < checkResult.data.length; i++) {
					const el = `《${checkResult.data[i]}》`;
					books.push(h('p', null, el));
				}
				this.$msgbox({
					message: h('div', null, books),
					showCancelButton: true,
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				});
			} else {
				this.$confirm('确认是否删除课件?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}).then(() => {
					coursewareDelete(id).then((res) => {
						this.$message.success('删除成功');
						this.onSearch();
					});
				});
			}
		},
		onCloseBook() {
			this.createParams.visible = false;
			this.$refs.createBookForm.resetFields();
		},
		onCloseEditBook() {
			this.editParams.visible = false;
			this.$refs.editBookForm.resetFields();
		},
		onSearch() {
			this.queryParams.coursewareTypeCodeString =
				this.coursewareTypeCode.join(',');
			this.$refs.mTable.resetInit();
		},
		resetField() {
			this.queryParams = {};
			this.$refs.mTable.resetInit();
		},
		createBook() {
			this.createParams = {
				..._.cloneDeep(defaultParams),
				visible: true,
			};
			this.$refs.uploadRef?.clearFiles();
		},
		editBookInfo(id) {
			// this.$refs.editBookForm.resetFields();
			this.editParams.visible = true;
			getBookInfo({
				id,
			}).then((res) => {
				const {
					id,
					coursewareName,
					coursewareTypeCode,
					illustrate,
					coursewareUrl,
					fileType,
				} = res.data;
				this.editParams = {
					...this.editParams,
					id,
					coursewareUrl,
					coursewareName,
					coursewareTypeCode,
					illustrate,
					fileType,
				};
			});
		},
		exportFile() {},
		del() {},
		FilterTime() {},
		handleThthemeNameUrlError() {
			this.$message.error('上传失败');
		},
		handleThthemeNameUrlSuccess(response, file, fileList, item) {
			console.log('response.data.url', response.data);
			this.createParams.coursewareUrl = response.data.url;
			this.createParams.coursewareName = response.data.fileName;
			this.createParams.fileType = response.data.suffix;
		},
		beforeLoadImageUpload(file) {
			console.log('file', file.type);
			const size = file.size / 1024 / 1024;
			console.log('size', size);
			if (file.type.indexOf('pdf') > -1) {
				if (size > 500) {
					this.$message.warning('PDF大小不超过500M');
					return false;
				}
			}
			if (file.type.indexOf('ppt') > -1) {
				if (size > 200) {
					this.$message.warning('PPT大小不超过200M');
					return false;
				}
			}
			if (
				file.type.indexOf('mp4') > -1 ||
				file.type.indexOf('rmvb') > -1 ||
				file.type.indexOf('flv') > -1
			) {
				if (size > 1024) {
					this.$message.warning('视频大小不超过1G');
					return false;
				}
			}
			if (file.type.indexOf('mp3') > -1) {
				if (size > 200) {
					this.$message.warning('音频大小不超过200M');
					return false;
				}
			}
			return true;
		},
	},
	async created() {
		this.coursewareTypeOptions = await this.$dict('courseware_type');
		if (store.getters.token) {
			this.headerObj['Authorization'] = getToken();
		}
	},
};
</script>

<style lang="scss" scoped></style>
