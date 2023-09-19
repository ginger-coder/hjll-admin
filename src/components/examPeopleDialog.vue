<template>
	<el-dialog
		title="选择考试人群"
		:visible.sync="visibleDialog"
		destroy-on-close
		width="1100px"
		:before-close="onCancel"
	>
		<el-form :inline="true" class="disp_flex ju_bet ali_cen">
			<div>
				<el-form-item label="区域">
					<!-- :value="[form.province, form.city, form.area]" -->
					<areaSelectAll
						ref="areaSelect"
						@change="changeArea"
						:ismultiple="true"
						:isCollapse="true"
					></areaSelectAll>
				</el-form-item>
				<el-form-item label="角色">
					<el-select
						v-model="peopleQueryParams.role"
						placeholder="请选择"
						style="width: 200px"
						clearable
					>
						<el-option
							v-for="item in roleUserList"
							:label="item.name"
							:value="item.name"
							:key="item.id"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="签约情况">
					<el-select
						v-model="peopleQueryParams.sign"
						placeholder="请选择"
						style="width: 240px"
						clearable
					>
						<el-option label="未签约" :value="0"></el-option>
						<el-option label="已签约" :value="1"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="评分">
					<el-input
						style="width: 50px"
						v-model="peopleQueryParams.scoreStart"
					>
					</el-input>
					<span
						class="h"
						style="margin-left: 10px; margin-right: 10px"
						>-</span
					>
					<el-input
						style="width: 50px"
						v-model="peopleQueryParams.scoreEnd"
					>
					</el-input>
				</el-form-item>
				<el-form-item label="姓名">
					<el-input
						placeholder="请输入"
						v-model="peopleQueryParams.nickName"
					>
					</el-input>
				</el-form-item>
				<el-form-item label="手机号">
					<el-input
						placeholder="请输入"
						v-model="peopleQueryParams.mobile"
					>
					</el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onSearchPeople"
						>查询</el-button
					>
					<el-button @click="onClear">重置</el-button>
				</el-form-item>
			</div>
		</el-form>
		<div style="height: 500px">
			<el-alert
				class="table_alert"
				type="info"
				show-icon
				close-text="清空"
				@close="closeTable"
				v-if="save_people.length"
			>
				<template slot="title">
					<div class="table_alert_title">
						已选择<span class="table_alert_title_num">{{
							save_people.length || 0
						}}</span
						>项
					</div>
				</template>
			</el-alert>
			<mTable
				ref="mTable"
				:loading.sync="peopleLoading"
				stripe
				:columns="columns"
				:request="examPeopleListV2"
				:payload="peopleQueryParams"
				:select="true"
				@select-change="onSelectChange"
				:active="activeSelect"
				rowKey="userId"
			>
				<template slot="action">
					<el-table-column slot="examMode" label="模式">
						<template slot-scope="scope">
							{{
								scope.row.examMode == 0
									? '正式考试'
									: '模拟考试'
							}}
						</template>
					</el-table-column>
					<el-table-column slot="status" label="状态">
						<template slot-scope="scope">
							{{ scope.row.status | filterStatus }}
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
import areaSelectAll from '@c/areaSelectLocal.vue';
import { work_role_page } from '@/api/pxks';
import { examPeopleListV2 } from '@/api/exam';

export default {
	name: 'examPeopleDialog',
	components: {
		mTable,
		areaSelectAll,
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
		active: {
			type: Array,
			default() {
				return [];
			},
		},
	},
	computed: {
		visibleDialog: {
			get: function () {
				this.onClear();
				return this.visible;
			},
			set: function (val) {
				this.$emit('update:visible', val);
			},
		},
		// 	activeSelect() {
		// 		if (this.active.length && !this.dialogActive.length) {
		// 			return this.active;
		// 		}
		// 		if (!this.active.length && this.dialogActive.length) {
		// 			return this.dialogActive;
		// 		}
		// 		if (this.active.length && this.dialogActive.length) {
		// 			return [...new Set([...this.active, ...this.dialogActive])];
		// 		}
		// 		if (!this.active.length && !this.dialogActive.length) {
		// 			return [];
		// 		}
		// 	},
	},
	watch: {
		active(value) {
			this.activeSelect = _.cloneDeep(value).map(el => el.userId || el);
			this.save_people = value.map((el) => {
				if (el.userId) {
					return el;
				} else {
					return {
						userId: el,
					};
				}
			});
		},
		visible(value) {
			if (value) {
				this.activeSelect = _.cloneDeep(this.active).map(el => el.userId || el);
				this.save_people = this.active.map((el) => {
					if (el.userId) {
						return el;
					} else {
						return {
							userId: el,
						};
					}
				});
			}
		},
	},
	methods: {
		examPeopleListV2,
		changeArea(val) {
			console.log('ara', val);
			this.peopleQueryParams.areaList = val.map((el) => el[2]);
		},
		onCancel() {
			this.visibleDialog = false;
			this.save_people = [];
			this.dialogActive = [];
			this.page_people = {};
			this.activeSelect = [];
		},
		onSave() {
			if (!this.save_people || !this.save_people.length) {
				this.$message.warning('请选择考试人员');
				return;
			}
			const answerPeople = this.save_people.map((el) => el.userId);
			// 发起保存请求
			const answerPeopleInfo = _.cloneDeep(this.save_people);

			console.log('answerPeople', answerPeople);
			console.log('answerPeopleInfo', answerPeopleInfo);
			this.$emit('save', {
				answerPeople,
				answerPeopleInfo,
			});
			// examUpdate({
			// 	id: this.id,
			// 	answerPeople,
			// })
			// 	.then((res) => {
			// 		this.$message.success('保存成功');
			// 	})
			// 	.finally(() => {
			// 		this.saveLoading = false;
			// 	});
			this.visibleDialog = false;
		},
		closeTable() {
			this.save_people = [];
			this.dialogActive = [];
			this.active = [];
			this.page_people = {};
			this.$refs?.mTable.resetInit();
		},
		onClear() {
			this.peopleQueryParams = {};
			this.onSearchPeople();
		},
		onSearchPeople() {
			setTimeout(() => {
				this.$refs?.mTable.resetInit();
			}, 500);
		},
		formatArr(arr) {
			let map = new Map();
			for (let i of arr) {
				if (!map.has(i.userId)) {
					map.set(i.userId, i);
				}
			}
			return [...map.values()];
		},
		// 处理选中、删除 保存记录
		onSelectChange({ row, selectKey, type, current, activeRow, pageData }) {
			if (type !== 'checkAll') {
				if (this.activeSelect.includes(activeRow.userId)) {
					// 移除
					this.save_people = this.save_people.filter(
						(el) => el.userId !== activeRow.userId
					);
				} else {
					this.page_people[current] = this.formatArr([
						...(this.page_people[current]
							? this.page_people[current]
							: []),
						...row,
					]);
					let sumPeople = [];
					for (const page in this.page_people) {
						if (
							Object.hasOwnProperty.call(this.page_people, page)
						) {
							const el = this.page_people[page];
							sumPeople = [...sumPeople, ...el];
						}
					}
					this.save_people = this.formatArr([
						...this.save_people,
						...sumPeople,
					]);
				}
			} else {
				if (!row.length) {
					pageData.forEach((el) => {
						const isIncludes = this.save_people.findIndex(
							(item) => item.userId == el.userId
						);
						if (isIncludes >= 0) {
							this.save_people = this.save_people.filter(
								(item) => item.userId != el.userId
							);
						}
					});
				} else {
					this.save_people = this.formatArr([
						...this.save_people,
						...row,
					]);
				}
			}

			this.activeSelect = this.save_people.map((el) => el.userId);
		},
	},
	created() {
		work_role_page({
			size: 100,
			current: 1,
		}).then((res) => {
			// console.log('res', res);
			this.roleUserList = res.data.records;
		});
	},
	data() {
		return {
			saveLoading: false,
			peopleLoading: false,
			examPeopleDialog: false,
			roleUserList: [],
			peopleQueryParams: {},
			columns: [
				{
					label: '姓名',
					prop: 'nickName',
				},
				{
					label: '区域',
					prop: 'areaFullName',
				},
				{
					label: '角色',
					prop: 'workRoleName',
				},
				{
					label: '签约情况',
					prop: 'sign',
				},
				{
					label: '评分',
					prop: 'score',
				},
			],
			page_people: {},
			save_people: [],
			current: 0,
			dialogActive: [], //手动选择考生
			activeSelect: [],
		};
	},
};
</script>

<style lang="scss" scoped>
.table_alert {
	border: 1px solid #bae7ff;
	background-color: #e6f7ff !important;
	margin-bottom: 15px;

	.table_alert_title {
		color: #000000 !important;
	}

	.table_alert_title_num {
		color: #1890ff;
		padding: 0 5px;
	}

	.el-alert__icon,
	.el-alert__closebtn {
		color: #1890ff !important;
	}
}
.dialog-footer {
	padding-top: 50px;
}
</style>
