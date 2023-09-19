<template>
	<el-dialog
		title="备选试题"
		:visible.sync="visibleDialog"
		destroy-on-close
		width="900px"
		:before-close="handleDialogClose"
		:append-to-body="true"
	>
		<div>
			<div class="delete-box">
				<el-button type="text" @click="onDeleteItem"
					>批量删除</el-button
				>
			</div>
			<div style="height: 400px; padding-bottom: 50px;">
				<mTable
					ref="mTable"
					class="table-list"
					:loading.sync="loading"
					rowKey="themeId"
					stripe
					:columns="columns"
					:request="request.list"
					:payload="payload"
					:select="true"
					@select-change="onSelectChange"
					:refresh="isRefresh"
				>
					<template slot="action">
						<el-table-column
							label="操作"
							width="200"
							align="center"
						>
							<template v-slot="{ row }">
								<el-button
									type="text"
									@click="onDeleteItem([row.themeId])"
									>删除</el-button
								>
							</template>
						</el-table-column>
					</template>
				</mTable>
			</div>
		</div>
		<span slot="footer" class="dialog-footer">
			<el-button @click="handleDialogClose">关闭</el-button>
			<el-button type="primary" @click="batchSave">添加到题库</el-button>
		</span>
	</el-dialog>
</template>

<script>
import _ from 'lodash';
import mTable from '@c/business/table';
import {
	otherQuestionList,
	otherQuestionDelete,
	onBatchSave,
} from '@/api/pxks';

export default {
	name: 'checkOtherQuestion',
	components: {
		mTable,
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
		request: {
			type: Object,
			default: {
				list: () => {},
				del: () => {},
				save: () => {},
			},
		},
	},
	computed: {
		visibleDialog: {
			get: function () {
				this.isRefresh = !this.isRefresh;
				return this.visible;
			},
			set: function (val) {
				this.$emit('update:visible', val);
			},
		},
	},
	methods: {
		handleDialogClose() {
			this.visibleDialog = false;
		},
		batchSave() {
			this.request
				.save({
					[this.request.params]: this.id,
				})
				.then((data) => {
					this.$message.success('添加成功');
					this.handleDialogClose();
					this.$emit('success');
				});
		},
		onSelectChange({ row, selectKey, type }) {
            this.selectIds = _.cloneDeep(selectKey);
            console.log('selectKey', this.selectIds);
		},
		onDeleteItem(ids = []) {
            if(!this.selectIds.length && !ids.length) {
                this.$message.warning('请选择题目');
                return;
            }
			this.loading = true;
			const themeList = ids.length
				? _.cloneDeep(ids)
				: _.cloneDeep(this.selectIds);

            console.log('themeList', themeList);
			this.request
				.del({
					[this.request.params]: this.id,
					themeList,
				})
				.then((res) => {
					this.$refs.mTable.resetInit();
					this.$message.success('删除成功');
				})
				.finally(() => {
					this.loading = false;
				});
		},
	},
	data() {
		return {
			selectIds: [],
			isRefresh: false,
			loading: false,
			otherQuestionList,
			payload: {
				questionBankId: this.id,
				testPaperId: this.id,
			},
			columns: [
				{
					label: '题型',
					prop: 'themeTypeName',
				},
				{
					label: '难度',
					prop: 'questionsDifficultyName',
				},
				{
					label: '分类',
					prop: 'questionsTypeName',
				},
				{
					label: '题目',
					prop: 'themeName',
				},
				{
					slot: 'action',
				},
			],
		};
	},
};
</script>

<style lang="scss" scoped></style>
