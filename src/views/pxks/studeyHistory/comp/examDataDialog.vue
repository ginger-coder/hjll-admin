<template>
	<el-dialog
		title="考试数据"
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
				:request="learnStudyExamData"
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
							@click="checkInfo(scope.row.id)"
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
</template>

<script>
import mTable from '@c/business/table';
import { learnStudyExamData } from '@/api/pxks';

export default {
	name: 'examDataDialog',
	components: {
		mTable,
	},
	watch: {
		visible(value) {
			if (value) {
				setTimeout(el => {
                    this.queryParams.memberId = this.id;
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
		learnStudyExamData,
        checkInfo(id) {
            console.log('查看详情');
        },
		onCancel() {
			this.visibleDialog = false;
		},
	},
	created() {
	},
	data() {
		return {
			loading: false,
			queryParams: {},
			columns: [
				{
					label: '序号',
					slot: 'index',
				},
				{
					label: '考试名称',
					prop: 'examName',
				},
				{
					label: '考试分类',
					prop: 'examTypeName',
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
					label: '分数',
					prop: 'scoreRate',
				},
			],
		};
	},
};
</script>

<style lang="scss" scoped></style>
