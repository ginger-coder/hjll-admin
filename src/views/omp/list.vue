<template>
	<div class="person-container">
		<el-tabs>
			<el-tab-pane label="入驻人员管理">
				<div ref="pageHead">
					<el-form
						ref="searchs"
						:model="searchs"
						class="form_horizontal"
					>
						<el-form-item label="姓名：" prop="nickName">
							<el-input
								placeholder="请输入姓名"
								clearable
								v-model="searchs.nickName"
								@clear="do_search"
								@keyup.enter.native="do_search"
							></el-input>
						</el-form-item>
						<el-form-item label="注册状态：" prop="userStatusName">
							<el-select
								v-model="searchs.userStatus"
								clearable
								@change="do_search"
							>
								<el-option
									v-for="item in stateData"
									:key="'state' + item.value"
									:label="item.label"
									:value="item.value"
								></el-option>
							</el-select>
						</el-form-item>
						<el-form-item>
							<el-button
								icon="el-icon-search"
								type="primary"
								v-hold-click
								@click="do_search"
								>查询</el-button
							>
							<el-button
								icon="el-icon-refresh"
								v-hold-click
								@click="search_reset"
								>重置</el-button
							>
						</el-form-item>
					</el-form>
					<div v-if="perOperate && false" class="page_handle_group">
						<!-- <el-button type="primary" icon="el-icon-plus" v-hold-click @click="jump('/omp/ompCreate')">新增</el-button> -->
						<el-button type="" v-hold-click @click="toExport"
							>导出</el-button
						>
					</div>
				</div>
				<el-table
					:data="lists"
					ref="lists"
					fit
					highlight-current-row
					border
					class="no_border_table"
					v-loading.body="loading"
					element-loading-spinner="el-icon-loading"
					element-loading-custom-class="custom-loading"
					:max-height="tableMaxHeight"
					:row-key="getRowKey"
					@selection-change="handleSelectionChange"
					@cell-click="cell_click"
					height="calc(100% - 100px)"
				>
					<el-table-column
						key="id"
						type="index"
						width="50"
						align="center"
						label="序号"
						fixed
					></el-table-column>
					<el-table-column
						label="姓名"
						prop="nickName"
						show-overflow-tooltip
					>
						<template v-slot="{ row }">
							{{ row.nickName || '-' }}
						</template>
					</el-table-column>
					<el-table-column
						label="所属项目"
						prop="projectName"
						show-overflow-tooltip
					/>
					<el-table-column
						label="所属工作组"
						prop="workGroupName"
						show-overflow-tooltip
					/>
					<el-table-column
						label="角色"
						prop="workRoleName"
						show-overflow-tooltip
					>
						<template v-slot="{ row }">
							{{ row.workRoleName || '-' }}
						</template>
					</el-table-column>
					<el-table-column label="注册状态" prop="autonymStatus">
						<template v-slot="{ row }">
							<div class="status_box"></div>
							{{ row.userStatusName }}
						</template>
					</el-table-column>
					<el-table-column
						label="注册时间"
						prop="createTime"
						sortable
					>
						<template v-slot="{ row }">
							{{ row.createTime | formatTime }}
						</template>
					</el-table-column>
					<el-table-column label="推荐人" prop="referrer" />
					<el-table-column label="推荐人邀请码" prop="referrerCode" />
					<el-table-column label="操作" align="center" fixed="right">
						<template v-slot="{ row }">
							<el-button
								type="text"
								v-hold-click
								@click.stop="doCommand('info', row)"
							>
								详情
							</el-button>
							<el-dropdown
								@command="doCommand($event, row)"
								v-if="perOperate && false"
							>
								<el-button @click.stop type="text"
									>更多</el-button
								>
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item command="set"
										>设置为</el-dropdown-item
									>
									<el-dropdown-item
										command="sign"
										v-if="`${row.sign}` === '0'"
										>签约</el-dropdown-item
									>
									<el-dropdown-item command="edit"
										>编辑</el-dropdown-item
									>
									<el-dropdown-item command="delete"
										><span class="el-danger"
											>删除</span
										></el-dropdown-item
									>
								</el-dropdown-menu>
							</el-dropdown>
						</template>
					</el-table-column>
				</el-table>
				<div ref="pagePagign" class="paging_fixed_bottom">
					<div class="pagign_box disp_flex" style="justify-content: right;">
						<el-pagination
							background
							:total="total"
							:page-size="pageSize"
							:pager-count="pagerCount"
							:current-page="currentPage"
							layout="total,prev, pager, next,sizes, jumper"
							:page-sizes="pageSizes"
							@current-change="paging_change"
							@size-change="size_change"
						></el-pagination>
					</div>
				</div>
			</el-tab-pane>
			<el-tab-pane label="意向人员管理">
				<getPeopleList />
			</el-tab-pane>
		</el-tabs>
	</div>
</template>
<script>
import basic from '@/mixins/basic';
import accountForm from './components/accountForm';
import accountInfo from './components/accountInfo';
import { parseTime, downLoadFile } from '@/utils';

import { getLabel, ompStatus } from '@/utils/dict';
import { page, remove, ompManagerexport } from '@/api/omp';
import { signManager } from '@/api/ompSign';
import areaSelect from '@/components/custom/areaSelect';
import moment from 'moment';

import getPeopleList from './getPeopleList.vue';
export default {
	components: {
		accountForm,
		accountInfo,
		areaSelect,
		getPeopleList,
	},
	mounted() {
		// setTimeout(() => {
		//   this.lists = new Array(12).fill(0).map((_, idx) => {
		//     return {
		//       id: idx,
		//       role: '巡检员、发电员',
		//       account: `0${idx}`,
		//       grade: idx
		//     }
		//   })
		// }, 1000)
	},
	filters: {
		formatTime(time) {
			return moment(time).format('YYYY-MM-DD HH:mm:ss');
		},
	},
	data() {
		return {
			perOperate: false,
			pageFun: page,
			moduleTitle: '账号',
			apiKey: 'adminId',

			stateData: ompStatus.page,
		};
	},
	mixins: [basic],
	methods: {
		changeArea(val, type) {
			let that = this;
			let { province, city, area } = val;

			that[type].province = province;
			that[type].city = city;
			that[type].area = area;
			console.log(type, 222);

			that.do_search();
		},
		checkboxInit(row, index) {
			// 管理员账号不可删除
			return row.grade !== 10;
		},
		filter_page_row(row) {
			let that = this;

			row.name = row.name || row.account || '';

			row.roleno_names = row.roleno_names || '';
			row.roleName = row.roleno_names || '';

			row.stateName = '';
			row.stateName = that.filterDictLabel(that.stateData, row.state);

			return row;
		},
		doCommand(command, row) {
			switch (command) {
				case 'info':
					this.jump(`/omp/ompInfo?id=${row.id}`);
					break;
				case 'set':
					this.$message({ type: 'info', message: '敬请期待' });
					break;
				case 'sign':
					this.jump(`/omp/ompSign`);
					break;
				case 'edit':
					this.jump(`/omp/ompCreate?id=${row.id}`);
					break;
				case 'delete':
					this.table_remove(row);
					break;
			}
		},
		table_remove: function (row) {
			var that = this;

			that.$confirm('确定删除该数据吗', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					remove({ id: row.id })
						.then((res) => {
							that.$message.success('删除成功');
							that.paging_change(that.currentPage);
						})
						.catch((err) => {});
				})
				.catch(() => {});
		},
		label(list, value) {
			return getLabel(list, value);
		},
		filterAutonymStatus(value, row) {
			return row.autonymStatus === value;
		},
		// 调整排序 end
		toExport: function () {
			let that = this;

			var url = '/user/ums-member/export';

			let param = {};
			if (that.selectIds.length) {
				url = url + '/' + that.selectIds.join(',');
				param = {
					type: 'byIds',
				};
			} else {
				param = {
					type: 'all',
				};
			}

			ompManagerexport(url, param).then((res) => {
				that.$message({
					type: 'success',
					message: '导出中',
				});
				downLoadFile(res, '运维人员导出数据');
			});
		},
	},
};
</script>
<style lang="scss" scoped>
.person-container {
	font-size: 0;
	position: relative;
	padding: 20px;
	background: #ffffff;
	border-radius: 4px;
	display: flex;
	height: 100%;

	::v-deep {
		// .el-table {
		// 	&::before {
		// 		content: none;
		// 	}
		// }
		.el-tab-pane {
			height: 100%;
		}
		.el-tabs {
			flex: 1;
			.el-tabs__content {
				height: calc(100% - 80px);
			}
		}
	}

	//.no_border_table {
	//  margin-bottom: 72px;
	//}

	.score {
		height: 22px;
		display: flex;
		align-items: center;

		svg {
			width: 20px;
			height: 20px;
			margin-right: 0.3rem;
			color: #e6a23c;
		}

		span {
			font-size: 17px;
			color: #e6a23c;
		}
	}
}
</style>
