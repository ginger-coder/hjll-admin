<template>
	<div>
		<el-dialog
			title="课程数据"
			:visible.sync="visibleDialog"
			destroy-on-close
			width="1100px"
			:before-close="onCancel"
		>
			<div style="height: 600px; padding-bottom: 50px">
				<mTable
					ref="mTable"
					:loading.sync="loading"
					stripe
					:columns="columns"
					:request="learnStudyCourseData"
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
					<el-table-column slot="status" label="课程状态">
						<template slot-scope="scope">
							<el-link
								:underline="false"
								:type="scope.row.status | statusStyle"
								>{{ scope.row.status | filterStatus }}</el-link
							>
						</template>
					</el-table-column>
					<el-table-column
						slot="action"
						label="操作"
						width="200"
						align="center"
					>
						<template slot-scope="scope">
							<el-button
								type="text"
								@click="checkInfo(scope.row.courseId)"
								>详细数据</el-button
							>
						</template>
					</el-table-column>
				</mTable>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="onCancel">确定</el-button>
			</div>
		</el-dialog>
		<el-dialog title="课程数据" :visible.sync="infoDrawer" width="800px">
			<mTable
				ref="infoTable"
				:loading.sync="infoLoading"
				stripe
				:columns="infoColumns"
				:request="learnStudyCourseBookData"
				:payload="infoQueryParams"
				:alertText="true"
                height="500px"
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
			</mTable>
		</el-dialog>
	</div>
</template>

<script>
import mTable from '@c/business/table';
import { learnStudyCourseData, learnStudyCourseBookData } from '@/api/pxks';

export default {
	name: 'corseDataDialog',
	components: {
		mTable,
	},
	watch: {
		visible(value) {
			if (value) {
				setTimeout((el) => {
					this.queryParams.memberId = this.id;
					this.infoQueryParams.memberId = this.id;
					this.$refs.mTable.resetInit();
				}, 500);
			}
		},
	},
	filters: {
		filterStatus(status) {
			let statusText = '';
			switch (status) {
				case 0:
					statusText = '未发布';
					break;
				case 1:
					statusText = '已发布';
					break;
				case 2:
					statusText = '进行中';
					break;
				case 3:
					statusText = '已结束';
					break;
				default:
					break;
			}
			return statusText;
		},
		statusStyle(status) {
			let type = '';
			switch (status) {
				case 0:
					type = 'warning';
					break;
				case 1:
					type = 'success';
					break;
				case 2:
					type = 'danger';
					break;
				case 3:
					type = 'default';
					break;

				default:
					break;
			}
			return type;
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
		learnStudyCourseData,
		learnStudyCourseBookData,
		checkInfo(id) {
			this.infoQueryParams.courseId = id;
			this.infoDrawer = true;
			setTimeout((el) => {
				this.$refs.infoTable.resetInit();
			}, 500);
		},
		onCancel() {
			this.visibleDialog = false;
		},
	},
	created() {},
	data() {
		return {
			loading: false,
			infoLoading: false,
			infoDrawer: false,
			queryParams: {},
			infoQueryParams: {},
			columns: [
				{
					label: '序号',
					slot: 'index',
				},
				{
					label: '课程名称',
					prop: 'courseName',
				},
				{
					label: '课程分类',
					prop: 'courseTypeName',
				},
				{
					slot: 'status',
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
					label: '完成比例',
					prop: 'coursewareFinishRate',
				},
				{
					slot: 'action',
				},
			],
			infoColumns: [
				{
					label: '序号',
					slot: 'index',
				},
				{
					label: '小节名称',
					prop: 'courseContentName',
				},
				{
					label: '课件名称',
					prop: 'coursewareName',
				},
				{
					label: '课件类型',
					prop: 'fileType',
				},
				{
					label: '课件分类',
					prop: 'coursewareTypeName',
				},
				{
					label: '完成比例',
					prop: 'courseContentProgressRate',
				},
			],
		};
	},
};
</script>

<style lang="scss" scoped></style>
