<template>
	<div style="height: 100%">
		<el-dialog
			title="创建题库"
			:visible.sync="dialogVisible"
			width="40%"
			destroy-on-close
			:before-close="handleClose"
		>
			<el-form
				class="demo-ruleForm"
				label-width="100px"
				:model="Form"
				ref="Form"
				label-position="top"
			>
				<el-form-item
					label="名称"
					prop="questionName"
					:rules="{
						required: true,
						message: '请输入',
						trigger: 'blur',
					}"
				>
					<el-input
						v-model="Form.questionName"
						aria-placeholder="请输入题库名称"
						placeholder="请输入题库名称"
					></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="cancel">取 消</el-button>
				<el-button :loading="addLoading" type="primary" @click="addTest"
					>创建</el-button
				>
				<!-- <el-button
					:loading="addLoading"
					type="primary"
					@click="addEdit(true)"
					>保存并编辑题库</el-button
				> -->
			</span>
		</el-dialog>
		<!--    </el-scrollbar>-->
		<div class="disp_flex flex_column" style="height: 100%">
			<el-card shadow="hover">
				<div class="disp_flex ju_bet">
					<el-form inline ref="Form" :model="payload">
						<el-form-item style="margin-bottom: 0" label="题库名称">
							<el-input
								v-model="payload.questionName"
								placeholder="请输入题库名称"
							/>
						</el-form-item>
					</el-form>
					<div>
						<el-button type="primary" @click="search"
							>搜索</el-button
						>
						<el-button @click="clear">重置</el-button>
					</div>
				</div>
			</el-card>
			<el-card
				shadow="hover"
				v-loading="loading"
				style="margin-top: 24px"
				:body-style="{ height: '100%', paddingBottom: '80px' }"
				class="m-card-full-body flex"
			>
				<div slot="header" class="disp_flex ju_bet ali_cen">
					<span class="m-card-header-title" style="font-weight: 600"
						>基本列表</span
					>
					<el-button
						type="primary"
						icon="el-icon-plus"
						@click="onCreateDialog"
						v-if="perms.includes('sys:questionBank:add')"
						>创建题库</el-button
					>
				</div>
				<mTable
					ref="mTable"
					height="100%"
					:loading.sync="loading"
					stripe
					:columns="columns"
					:request="tklist"
					:payload="payload"
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
					<template slot="createTime">
						<el-table-column
							label="创建时间"
							sortable
							align="center"
						>
							<template v-slot="{ row }">
								{{ FilterTime(row.createTime) }}
							</template>
						</el-table-column>
					</template>
					<template slot="action">
						<el-table-column
							label="操作"
							width="200"
							align="center"
						>
							<template v-slot="{ row }">
								<el-button
									v-if="
										perms.includes(
											'sys:questionBank:detail'
										)
									"
									type="text"
									@click="editbank(row.id)"
									>管理题库</el-button
								>
								<el-button
									type="text"
									v-if="
										perms.includes(
											'sys:questionBank:export'
										)
									"
									@click="
										exportFile(row.id, row.questionName)
									"
									:disabled="!row.id"
									>导出题库
								</el-button>
								<el-button
									v-if="
										perms.includes(
											'sys:questionBank:delete'
										)
									"
									type="text"
									@click="del(row.id)"
									>删除</el-button
								>
							</template>
						</el-table-column>
					</template>
				</mTable>
			</el-card>
		</div>
	</div>
</template>
<script>
import {
	tklist,
	tktypelist,
	tkadd,
	tkdel,
	exportFile,
	QuestionBankTypeList,
	question_bank_type,
	questionBankCheck,
} from '@/api/pxks';
import mTable from '@c/business/table';
import moment from 'moment';
import { ADownFIle } from '@/utils';

const { VUE_APP_BASE_URL, VUE_APP_BASE_API } = process.env;

export default {
	components: {
		mTable,
	},
	data() {
		return {
			loading: false,
			addLoading: false,
			options: [],
			Form: {
				questionName: '',
				questionBankTypeId: '',
			},
			dialogVisible: false,
			payload: {
				questionName: undefined,
				questionType: undefined,
			},
			questionName: undefined,
			columns: [
				{
					label: '序号',
					slot: 'index',
				},
				{
					label: '名称',
					prop: 'questionName',
				},
				{
					label: '总题数',
					prop: 'totalQuestion',
				},
				{
					label: '创建人',
					prop: 'createUserName',
				},
				{
					slot: 'createTime',
				},
				{
					slot: 'action',
				},
			],
			perms: [],
		};
	},
	methods: {
		tklist,
		onCreateDialog() {
			const h = this.$createElement;
			const title = h('p', null, [
				h('span', null, '名称 '),
				h('i', { style: 'color: red' }, '*'),
			]);
			this.$prompt(title, '创建题库', {
				confirmButtonText: '创建',
				cancelButtonText: '取消',
				inputPattern: /^.+$/,
				inputErrorMessage: '题库名称不能为空',
			})
				.then(({ value }) => {
					this.Form.questionName = value;
					this.addTest();
				})
				.catch(() => {
					// 取消
				});
		},
		exportFile(questionBankId, fileName = '题库') {
			ADownFIle(
				VUE_APP_BASE_URL +
					VUE_APP_BASE_API +
					'/itembank/theme/excel/themeList?questionBankId=' +
					questionBankId,
				fileName
			);
		},
		async clear() {
			const { questionName, questionType } = this.payload;
			if (questionType || questionName) {
				this.payload = {
					questionName: undefined,
					questionType: undefined,
				};
				await this.$nextTick();
				this.$refs.Form.resetFields();
				await this.search();
			}
		},
		async search() {
			// const data = await tklist({questionName: this.questionName})
			// this.tableData = data.data.records
			this.$refs.mTable.resetInit();
		},
		editbank(id) {
			this.$router.push(`/testTrain/itembank/itemmanager?id=${id}`);
		},
		async del(id) {
			questionBankCheck({
				questionId: id,
			}).then((res) => {
				if (res.data > 0) {
					this.$confirm(
						'该题库中部分试题已被试卷选用，无法删除',
						'提示',
						{
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning',
						}
					);
				} else {
					this.$confirm('确定删除该数据吗', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
					}).then(async () => {
						const res = await tkdel(id);
						const status = res?.data;
						const msg =
							res?.msg || (status ? '删除成功' : '删除失败');
						if (status) {
							await this.search();
						}
						this.$message[status ? 'success' : 'error'](msg);
					});
				}
			});
		},
		cancel() {
			this.dialogVisible = false;

			this.$refs.Form.resetFields();
		},
		handleSizeChange(val) {
			// 改变每页显示的条数
			this.PageSize = val;
			// 点击每页显示的条数时，显示第一页
			this.tklist({
				current: this.currentPage,
				size: this.PageSize,
			});
			// this.getData(val,1)
			// 注意：在改变每页显示的条数时，要将页码显示到第一页
			this.currentPage = 1;
		},
		// 显示第几页
		handleCurrentChange(val) {
			// 改变默认的页数
			this.currentPage = val;
			this.tklist({
				current: this.currentPage,
				size: this.PageSize,
			});
			// 切换页码时，要获取每页显示的条数
			// this.getData(this.PageSize,(val)*(this.pageSize))
		},
		addTest() {
			this.$refs.Form.validate(async (valid) => {
				if (this.addLoading || !valid) return false;
				this.addLoading = true;
				const { questionBankTypeId, ...rest } = this.Form;
				const res = await tkadd({
					...rest,
					questionBankTypeCode: questionBankTypeId,
				});
				this.addLoading = false;
				const status = res?.data;
				const msg = res?.msg || (status ? '创建成功' : '创建失败');
				if (status) {
					await this.clear();
					await this.search();
					this.dialogVisible = false;
					this.Form = {
						questionName: '',
						questionBankTypeId: '',
					};
				}
				this.$message[status ? 'success' : 'error'](msg);
			});
		},
		async addEdit() {
			await this.$refs.Form.validate(async (valid) => {
				if (this.addLoading || !valid) return false;
				this.addLoading = true;
				const { questionBankTypeId, ...rest } = this.Form;
				const res = await tkadd({
					...rest,
					questionBankTypeCode: questionBankTypeId,
				});

				this.addLoading = false;
				this.$refs.Form.resetFields();
				this.dialogVisible = false;
				const status = res?.data;
				if (status) {
					const datas = await tklist();
					const id = datas?.data?.records?.[0]?.id;
					if (id) {
						this.$router.push(
							`/testTrain/itembank/itemmanager?id=${id}`
						);
					}
				}
			});
		},
		handleClose(done) {
			this.$confirm('确认关闭？')
				.then((_) => {
					done();
				})
				.catch((_) => {});
		},

		handleSelectionChange(val) {
			console.log(val);
			// this.multipleSelection = val;
		},
		FilterTime(timeStr) {
			if (!timeStr) return '-';
			return moment(new Date(timeStr)).format('yyyy-MM-DD HH:mm');
		},
		// async tklist(xx) {
		//   const datas = await tklist(xx)
		//   this.total = datas.data.total
		//   this.tableData = datas.data.records
		//   const {data} = await tktypelist()
		//   this.options = data.records
		//   console.log(data);
		// }
	},
	mounted() {
		this.perms = this.$store.getters.user.perms;
	},
};
</script>

<style lang="scss" scoped>
.demo-ruleForm {
	padding: 15px 0;
}
</style>
