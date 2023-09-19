<template>
	<el-dialog
		title="选择课件"
		:visible.sync="visibleDialog"
		destroy-on-close
		width="1100px"
		:before-close="onCancel"
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
				<el-select v-model="queryParams.fileType" placeholder="请选择">
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
					@change="onTypeCodeChange"
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
				<el-button @click="onSearchCourseWare" type="primary"
					>搜索</el-button
				>
				<el-button @click="onClear">重置</el-button>
			</el-form-item>
		</el-form>
		<div style="height: 500px; padding-bottom: 50px">
			<mTable
				ref="mTable"
				:loading.sync="loading"
				stripe
				:columns="columns"
				:request="getCoursewareList"
				:payload="queryParams"
				:alertText="true"
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
				<template slot="radio">
					<el-table-column label="" width="35">
						<template slot-scope="scope">
							<el-radio
								class="radio"
								v-model="bookId"
								:label="scope.row.id"
								@change.native="getCurrentGateway(scope.row)"
								><i></i>
							</el-radio>
						</template>
					</el-table-column>
				</template>
			</mTable>
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button @click="onCancel">取消</el-button>
			<el-button type="primary" @click="onSave" :loading="saveLoading"
				>保存</el-button
			>
		</div>
	</el-dialog>
</template>

<script>
import _ from 'lodash';
import mTable from '@c/business/table';
import { getCoursewareList } from '@/api/book';

export default {
	name: 'checkOtherQuestion',
	components: {
		mTable,
	},
	watch: {
		visible(value) {
			if (value) {
				this.onClear();
			}
		},
	},
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		id: {
			type: [Number, String],
			default: 0,
		},
	},
	computed: {
		visibleDialog: {
			get: function () {
				return this.visible;
			},
			set: function (val) {
				this.$emit('update:visible', val);
			},
		},
	},
	methods: {
		getCoursewareList,
		onTypeCodeChange(values) {
			this.queryParams.coursewareTypeCodeString = values.join(',');
		},
		getCurrentGateway(row) {
			this._save_book = _.cloneDeep(row);
		},
		onCancel() {
			this.visibleDialog = false;
			this._save_book = '';
		},
		onSave() {
			if (!this._save_book) {
				this.$message.warning('请选择课件');
				return;
			}
			this.$emit('save', this._save_book);
			this.visibleDialog = false;
		},
		onClear() {
			this.queryParams = {};
			this.onSearchCourseWare();
		},
		onSearchCourseWare() {
			if (this.$refs?.mTable) {
				this.$refs?.mTable.resetInit();
			}
		},
		onSelectChange({ row, selectKey, type }) {
			this._save_book = _.cloneDeep(row);
		},
	},
	async created() {
		this.coursewareTypeOptions = await this.$dict('courseware_type');
	},
	data() {
		return {
			coursewareTypeCode: [],
			bookId: '',
			saveLoading: false,
			loading: false,
			examPeopleDialog: false,
			queryParams: {},
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
			columns: [
				{
					slot: 'radio',
				},
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
			],
			_save_book: '',
		};
	},
};
</script>

<style lang="scss" scoped></style>
