<template>
	<div class="app-container">
		<el-scrollbar wrap-class="app-container-wrapper">
			<div ref="pageHead">
				<el-form ref="searchs" :model="searchs" class="form_horizontal">
					<el-form-item label="姓名：" prop="nickName">
						<el-input placeholder="请输入姓名" clearable v-model="searchs.nickName" @clear="do_search" @keyup.enter.native="do_search"></el-input>
					</el-form-item>
					<el-form-item label="手机号：" prop="mobile">
						<el-input placeholder="请输入手机号" clearable v-model="searchs.mobile" @clear="do_search" @keyup.enter.native="do_search"></el-input>
					</el-form-item>
					<el-form-item label="状态：" prop="sign">
						<el-select v-model="searchs.sign" clearable @change="do_search">
							<el-option v-for="item in stateData" :key="'state' + item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button icon="el-icon-search" type="primary" v-hold-click @click="do_search">筛选</el-button>
						<el-button icon="el-icon-refresh" v-hold-click @click="search_reset">重置</el-button>
					</el-form-item>
				</el-form>
			</div>
			<template>
				<el-table :data="lists" ref="lists" fit highlight-current-row border class="no_border_table" v-loading.body="loading" element-loading-spinner="el-icon-loading" element-loading-custom-class="custom-loading" :max-height="tableMaxHeight" :row-key="getRowKey" @selection-change="handleSelectionChange" @cell-click="cell_click">
					<el-table-column key="id" type="index" width="50" align="center" label="#" fixed>
						<template slot-scope="scope">
							{{ scope.$index + 1 + (currentPage - 1) * pageSize }}
						</template>
					</el-table-column>
					<el-table-column label="姓名" width="200" prop="nickName" show-overflow-tooltip>
						<template v-slot="{ row }">
							{{ row.nickName || "-" }}
						</template>
					</el-table-column>
					<el-table-column label="工作区域" min-width="150" prop="areaName" show-overflow-tooltip>
						<template v-slot="{row}">
						{{ row.areaName || "-" }}
						</template>
					</el-table-column>
					<el-table-column label="角色" min-width="120" prop="workRoleName" show-overflow-tooltip>
						<template v-slot="{row}">
						{{ row.workRoleName || "-" }}
						</template>
					</el-table-column>
					<!-- <el-table-column label="技能" prop="skill" show-overflow-tooltip>
						<template v-slot="{ row }">
							{{ row.workRoleName || '-' }}
						</template>
					</el-table-column> -->
					<el-table-column label="状态" width="110" prop="sign">
						<template v-slot="{ row }">
							<div class="status">
								<span :class="[row.sign == 1 ? 'dot-open' : 'dot-close']">●</span>
								<span v-if="row.sign==0">
								未签约
								</span>
								<span v-else-if="row.sign==1">
								已签约
								</span>
								<span v-else-if="row.sign==2">
								待审核
								</span>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="签约时间" width="188" prop="signTime_" sortable></el-table-column>
					<el-table-column v-if="perOperate" label="操作" align="center" width="138" fixed="right">
						<template v-slot="{ row }">
							<div v-if="row.sign==2">
								<el-button type="text" v-hold-click @click.stop="doCommand('info', row)"> 审核 </el-button>
								<el-button  type="text" v-hold-click @click.stop="doCommand('edit', row)"> 编辑 </el-button>
							</div>
							<div v-else-if="row.sign==0">
								<el-button  type="text" v-hold-click @click.stop="doCommand('edit', row)"> 编辑 </el-button>
							
							</div>
							<div v-else-if="row.sign==1">
								<el-button type="text" v-hold-click @click.stop="doCommand('info', row)"> 详情 </el-button>
								<el-button  type="text" v-hold-click @click.stop="doCommand('edit', row)"> 编辑 </el-button>
							</div>
							
						</template>
					</el-table-column>
				</el-table>
			</template>
		</el-scrollbar>
		<div ref="pagePagign" class="paging_fixed_bottom">
			<div class="pagign_box disp_flex ju_bet ali_cen">
				<div></div>
				<el-pagination background :total="total" :page-size="pageSize" :pager-count="pagerCount" :current-page="currentPage" layout="total,prev, pager, next,sizes, jumper" :page-sizes="pageSizes" @current-change="paging_change" @size-change="size_change"></el-pagination>
			</div>
		</div>
	</div>
</template>
<script>
import basic from "@/mixins/basic";
import accountForm from "./components/accountForm";
import accountInfo from "./components/accountInfo";
import { parseTime, numInput, fileDownload, deepClone } from "@/utils";

import { ompStatus } from "@/utils/dict";
// import { page } from "@/api/ompSign";
import {page} from "@/api/omp";


export default {
	components: {
		accountForm,
		accountInfo,
	},
	mounted() {
		// setTimeout(() => {
		//   this.lists = new Array(12).fill(0).map((_, idx) => {
		//     return {
		//       id: idx % 2 ?  idx : undefined,
		//       role: '巡检员、发电员',
		//       account: `0${idx}`,
		//       status: idx % 2
		//     }
		//   })
		// }, 1000)
	},
	data() {
		return {
			pageFun: page,
			moduleTitle: "账号",
			apiKey: "adminId",

			stateData: ompStatus.sign,
		};
	},
	mixins: [basic],
	methods: {
		checkboxInit(row, index) {
			// 管理员账号不可删除
			return row.grade !== 10;
		},
		filter_page_row(row) {
			let that = this;

			row.name = row.name || row.account || "";

			row.roleno_names = row.roleno_names || "";
			row.roleName = row.roleno_names || "";

			row.stateName = "";
			row.stateName = that.filterDictLabel(that.stateData, row.state);
			row.signTime_ = parseTime(new Date(row.signTime).getTime(), "{y}-{m}-{d} {h}:{i}:{s}") || "-";


			return row;
		},
		getLabelName(list, key) {
			return (list || []).map((item) => item[key]).join(",") || "-";
		},
		doCommand(command, row) {
			switch (command) {
				case "info":
					// this.jump(`/omp/ompSignInfo${`${row.id}`.length > 0 && row.id ? `?id=${row.id}` : ""}`);
					this.jump(`/omp/ompSignInfo?id=${row.id}&status=${row.sign}`);
					break;
				case "sign":
					this.jump(`/omp/ompSignCreate${`${row.id}`.length > 0 && row.id ? `?id=${row.id}` : ""}`);
					break;
				case "edit":
					this.jump(`/omp/ompSignCreate${`${row.id}`.length > 0 && row.id ? `?id=${row.id}` : ""}`);
					break;
			}
		},
	
	},
};
</script>
<style lang="scss" scoped>
.app-container {
	font-size: 0;
	position: relative;

	::v-deep {
		.el-table {
			&::before {
				content: none;
			}
		}
	}

	.dot {
		&-close {
			color: #909399;
		}

		&-open {
			color: #67c23a;
		}
	}

	.status {
		display: flex;
		align-items: center;

		span:nth-child(2) {
			margin: 0 4px;
		}
	}

	//.no_border_table {
	//  margin-bottom: 72px;
	//}
}
</style>
