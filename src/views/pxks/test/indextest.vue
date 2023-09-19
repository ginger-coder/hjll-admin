<template>
	<div style="height: 100%">
		<!--    </el-scrollbar>-->
		<div class="disp_flex flex_column" style="height: 100%">
			<el-card shadow="hover">
				<div class="disp_flex ju_bet">
					<el-form inline ref="Form" :model="queryParams">
						<el-form-item label="名称">
							<el-input
								v-model="queryParams.testPaperName"
								placeholder="请输入"
							/>
						</el-form-item>
						<el-form-item label="分类">
							<el-select
								v-model="testPaperTypeData"
								placeholder="请选择"
								style="width: 240px"
								clearable
								multiple
								collapse-tags
								@change="onChangeTestPaperType"
							>
								<el-option
									:label="item.name"
									:value="item.id"
									v-for="item in classTypeOptions"
									:key="item.id"
								></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="状态">
							<el-select
								v-model="queryParams.status"
								placeholder="请选择"
								style="width: 240px"
								clearable
							>
								<el-option label="启用" :value="0"></el-option>
								<el-option label="禁用" :value="1"></el-option>
							</el-select>
						</el-form-item>
					</el-form>
					<div>
						<el-button type="primary" @click="search"
							>搜索</el-button
						>
						<el-button @click="clear('Form')">重置</el-button>
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
					<span class="m-card-header-title">基本列表</span>
					<el-button
						type="primary"
						icon="el-icon-plus"
						@click="onCreateDialog"
                        v-if="perms.includes('sys:testPaper:add')"
						>创建试卷</el-button
					>
				</div>
				<mTable
					ref="mTable"
					height="100%"
					:loading.sync="loading"
					stripe
					:columns="columns"
					:request="testpaper"
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
					<template slot="status" v-if="perms.includes('sys:testPaper:status')">
						<el-table-column label="状态" sortable>
							<template v-slot="{ row }">
								<span
									class="status-item"
									:class="{
										active: row.status == 0,
										stop: row.status != 0,
									}"
									>{{
										row.status == 0 ? '启用' : '禁用'
									}}</span
								>
							</template>
						</el-table-column>
					</template>
					<template slot="action">
						<el-table-column label="操作" width="200">
							<template v-slot="{ row }">
								<el-button
									v-if="row.status != 0 &&  perms.includes('sys:testPaper:settest')"
									type="text"
									@click="editTestPaper(row.id)"
									>管理试卷</el-button
								>
								<el-button
									type="text"
									v-if="row.status == 1"
									@click="onStatusChange(row)"
									>启用试卷</el-button
								>
								<el-button
									type="text"
									v-else
									@click="onStatusChange(row)"
									>禁用试卷</el-button
								>
								<el-button v-if="perms.includes('sys:testPaper:delete')" type="text" @click="del(row.id)"
									>删除</el-button
								>
							</template>
						</el-table-column>
					</template>
				</mTable>
			</el-card>
		</div>
		<!-- 创建试卷 -->
		<el-dialog
			title="创建试卷"
			:visible.sync="dialogVisible"
			width="400px"
			:before-close="handleCreateClose"
		>
			<el-form
				:model="createQueryParams"
				ref="numberValidateForm"
				label-width="50px"
			>
				<el-form-item
					label="名称"
					prop="testPaperName"
					:rules="[{ required: true, message: '名称不能为空' }]"
				>
					<el-input
						v-model="createQueryParams.testPaperName"
						autocomplete="off"
					></el-input>
				</el-form-item>
				<el-form-item
					label="分类"
					prop="testPaperTypeCode"
					:rules="[{ required: true, message: '请选择分类' }]"
				>
					<el-select
						v-model="createQueryParams.testPaperTypeCode"
						placeholder="请选择"
						clearable
						style="width: 100%"
					>
						<el-option
							:label="item.name"
							:value="item.id"
							v-for="item in classTypeOptions"
							:key="item.id"
						></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="handleCreateClose">取消</el-button>
				<el-button
					type="primary"
					:loading="addLoading"
					@click="handleCreate('numberValidateForm')"
					>创建</el-button
				>
			</span>
		</el-dialog>
	</div>
</template>
<script>
import {
	testpaper,
	addtest,
	testPagerUpdateStatus,
	deleteTestPager,
	testPaperCheck,
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
			dialogVisible: false,
			queryParams: {
				status: '',
				testPaperName: '',
				testPaperTypeCode: '',
			},
			createQueryParams: {
				testPaperName: '',
				testPaperTypeCode: '',
			},
			testPaperTypeData: [],
			classTypeOptions: [],
			loading: false,
			addLoading: false,
			columns: [
				{
					label: '序号',
					slot: 'index',
				},
				{
					label: '名称',
					prop: 'testPaperName',
				},
				{
					label: '分类',
					prop: 'testPaperTypeName',
				},
				{
					slot: 'status',
				},
				{
					label: '题数',
					prop: 'testPaperThemeCount',
				},
				{
					label: '总分',
					prop: 'totalScore',
				},
				{
					label: '已应用考试',
					prop: 'examNames',
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
            perms: [],
		};
	},
	mounted() {
        this.perms = this.$store.getters.user.perms;
    },
	async created() {
		this.classTypeOptions = await this.$dict('test_paper_type');
	},
	methods: {
		testpaper,
		onChangeTestPaperType(val) {
			this.queryParams.testPaperTypeCodeString = val.join(',');
		},
		onCreateDialog() {
			this.dialogVisible = true;
		},
		handleCreateClose() {
			this.$refs.numberValidateForm.resetFields();
			this.createQueryParams = {
				testPaperName: '',
				testPaperTypeCodeString: '',
			};
			this.dialogVisible = false;
		},
		handleCreate(FormRef) {
			// 创建
			this.$refs[FormRef].validate((valid) => {
				if (this.addLoading || !valid) return false;
				this.addLoading = true;
				addtest({ ...this.createQueryParams })
					.then((res) => {
						const status = res?.data;
						const msg =
							res?.msg || (status ? '创建成功' : '创建失败');
						if (status) {
							this.dialogVisible = false;
							this.createQueryParams = {
								testPaperName: '',
								testPaperTypeCodeString: '',
							};
							this.handleCreateClose();
							this.search();
						}
						this.$message[status ? 'success' : 'error'](msg);
					})
					.finally(() => {
						this.addLoading = false;
					});
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
		clear() {
			this.queryParams = {
				status: '',
				testPaperName: '',
				testPaperTypeCodeString: '',
			};
			this.testPaperTypeData = [];
			this.search();
		},
		search() {
			this.$refs.mTable.resetInit();
		},
		editTestPaper(ids) {
			this.$router.push(`/testTrain/TestList/testpaper/?id=${ids}`);
		},
		async del(id) {
			const checkResult = await testPaperCheck({
				testPaperId: id,
			});
			if (checkResult.data && checkResult.data.length) {
				const h = this.$createElement;
				const books = [
					h(
						'h4',
						null,
						'该试卷已被下列考试选用，无法删除。若想删除，请先删除相关考试.'
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
				this.$confirm('确认是否删除试卷?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}).then(() => {
					deleteTestPager(id).then((res) => {
						this.$message.success('删除成功');
						this.search();
					});
				});
			}
		},
		cancel() {
			this.dialogVisible = false;

			this.$refs.Form.resetFields();
		},
		async onStatusChange({ id, status }) {
			const desc = status == 0 ? '禁用' : '启用';
			const paramsStatus = status == 0 ? 1 : 0;
			let isAxios = true;
			console.log('paramsStatus', paramsStatus);
			if (paramsStatus == 1) {
				const checkResult = await testPaperCheck({
					testPaperId: id,
				});
				if (checkResult.data && checkResult.data.length) {
					isAxios = false;
					const h = this.$createElement;
					const books = [
						h(
							'h4',
							null,
							'该试卷已被下列考试选用，无法' +
								desc +
								'。若想' +
								desc +
								'，请先删除相关考试.'
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
					isAxios = true;
				}
			}
			if (isAxios) {
				this.$confirm('确认' + desc + '吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				})
					.then(() => {
						this.loading = true;
						testPagerUpdateStatus({
							id,
							status: paramsStatus,
						})
							.then((res) => {
								this.search();
							})
							.finally(() => {
								this.loading = false;
							});
					})
					.catch(() => {
						this.search();
					});
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.status-item {
	position: relative;
	padding-left: 10px;
	&.active::before {
		content: '';
		width: 6px;
		height: 6px;
		border-radius: 50%;
		position: absolute;
		left: -5px;
		top: 4px;
		background: #52c41a;
	}
	&.stop::before {
		content: '';
		width: 6px;
		height: 6px;
		background: #f5222d;
		border-radius: 50%;
		position: absolute;
		left: -5px;
		top: 4px;
	}
}
.demo-ruleForm {
	padding: 15px 0;
}
</style>
