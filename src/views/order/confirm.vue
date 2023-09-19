<template>
	<div class="app-container">
		<el-scrollbar wrap-class="app-container-wrapper">
			<div ref="pageHead">
				<el-form ref="searchs" :model="searchs" class="form_horizontal">
					<el-form-item label="工单编号：" prop="serialNumber">
						<el-input placeholder="请输入工单编号" clearable v-model="searchs.serialNumber" @clear="do_search" @keyup.enter.native="do_search"> </el-input>
					</el-form-item>
					<!-- <el-form-item label="工单状态：" prop="workOrderStatus">
						<el-select v-model="searchs.workOrderStatus" clearable @change="do_search">
							<el-option v-for="item in stateData" :key="'state' + item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item> -->
					<el-form-item>
						<el-button icon="el-icon-search" type="primary" v-hold-click @click="do_search">筛选</el-button>
						<el-button icon="el-icon-refresh" v-hold-click @click="search_reset">重置</el-button>
					</el-form-item>
				</el-form>
				<!-- <div v-if="perOperate" class="page_handle_group">
					<el-button type="primary" icon="el-icon-plus" v-hold-click @click="jump('/order/orderCreate')">新增</el-button>
				</div> -->
				<!-- 已选 -->
				<!-- <template v-if="perOperate">
                    <div class="table_selection_card">
                        已选 <span class="mcolor">{{tableSelectionIds.length}}</span> 项
                        <el-button type="text" :disabled="tableSelectionIds.length==0" @click="handleSelectionClear">清空</el-button>
                    </div>
                    <div class="sh1"></div>
                </template> -->
			</div>
			<template>
				<el-table :data="lists" ref="lists" fit highlight-current-row border class="no_border_table" v-loading.body="loading" element-loading-spinner="el-icon-loading" element-loading-custom-class="custom-loading" :max-height="tableMaxHeight" :row-key="getRowKey" @selection-change="handleSelectionChange" @cell-click="cell_click">
					<!-- <el-table-column v-if="perOperate" key="selection" type="selection" :reserve-selection="true" align="center" :selectable="checkboxInit" fixed></el-table-column>
					<el-table-column v-else key="id" type="index" width="50" align="center" label="#" fixed></el-table-column> -->
					<el-table-column key="id" type="index" width="50" align="center" label="#" fixed>
						<template slot-scope="scope">
							{{ scope.$index + 1 + (currentPage - 1) * pageSize }}
						</template>
					</el-table-column>
					<el-table-column label="工单类型" width="100" prop="workOrderTypeName" fixed>
						<template slot-scope="scope">
							{{ scope.row.workOrderTypeName || "-" }}
						</template>
					</el-table-column>
					<el-table-column label="编号" prop="serialNumber" min-width="140">
						<template slot-scope="scope">
							{{ scope.row.serialNumber || "-" }}
						</template>
					</el-table-column>
					<el-table-column label="省份" prop="provinceName">
						<template slot-scope="scope">
							{{ scope.row.provinceName || "-" }}
						</template>
					</el-table-column>
					<el-table-column label="城市" prop="cityName">
						<template slot-scope="scope">
							{{ scope.row.cityName || "-" }}
						</template>
					</el-table-column>
					<el-table-column label="区县" prop="districtName">
						<template slot-scope="scope">
							{{ scope.row.districtName || "-" }}
						</template>
					</el-table-column>
					<el-table-column label="站点" prop="siteName" min-width="140" show-overflow-tooltip>
						<template slot-scope="scope">
							{{ scope.row.siteName || "-" }}
						</template>
					</el-table-column>
					<el-table-column label="接单人" prop="nickName" min-width="140" show-overflow-tooltip>
						<template slot-scope="scope">
							{{ scope.row.nickName || "-" }}
						</template>
					</el-table-column>
					<el-table-column label="手机号" prop="mobile" min-width="140" show-overflow-tooltip>
						<template slot-scope="scope">
							{{ scope.row.mobile || "-" }}
						</template>
					</el-table-column>
					<el-table-column label="状态" width="140" prop="stateName">
						<template slot-scope="scope">
							<div class="disp_flex ali_cen">
								<div v-if="scope.row.workOrderStatus != null" class="table_status_box" :class="tableStatusClass(stateData, scope.row.workOrderStatus)"></div>
								{{ tableStatusLabel(stateData, scope.row.workOrderStatus) }}
								<!-- 待确认 -->
								<el-popconfirm title="确定确认工单吗？" :hide-icon="true" :key="scope.row.serialNumber" @confirm="confirmOrder(scope.row)">
									
								</el-popconfirm>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="创建时间" width="188" prop="createTime_"> </el-table-column>
					<el-table-column v-if="perOperate" label="操作" align="center" width="138" fixed="right">
						<template slot-scope="scope">
							<el-popconfirm title="确定确认工单吗？" :hide-icon="true" @confirm="confirmOrder(scope.row)">
								
							</el-popconfirm>
							<el-button @click.stop="do_info(scope.row)" type="text" style="margin-right: 10px">详情</el-button>
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
import { workOrder } from "@/api/order";
import { orderStatus , getLabel, getClass,} from "@/utils/dict";

export default {
	components: {},
	data() {
		return {
			pageFun: workOrder,
			apiKey: "workOrder",
			searchs_default: {
				workOrderStatus: "7",
			},

			stateData: orderStatus,
		};
	},
	mixins: [basic],
	methods: {
		tableStatusLabel(list, value) {
			return getLabel(list, value);
		},
		tableStatusClass(list, value) {
			return getClass(list, value);
		},
		checkboxInit(row, index) {
			// 管理员账号不可删除
			return row.grade != 10;
		},
		filter_page_row(row) {
			let that = this;

			row.name = row.name || row.account || "";

			row.roleno_names = row.roleno_names || "";
			row.roleName = row.roleno_names || "";

			row.stateName = "";
			row.stateName = that.filterDictLabel(that.stateData, row.state);
			return row;
		},
		doCommand(command, row) {
			switch (command) {
				case "info":
					this.jump(`/order/orderInfo?id=${row.id}`);
					break;
				case "set":
					break;
				case "sign":
					break;
				case "edit":
					this.jump(`/order/orderInfo?id=${row.id}`);
					break;
				case "delete":
					break;
			}
		},
		do_info:function(row){
			var that = this
			this.jump(`/order/orderInfo?id=${row.id}`);
		},
		confirmOrder:function(row){
			var that = this
			let _post = row
			_post.id = row.id
			_post.workOrderStatus  = 11
			workOrder({ method: "post", name: "update" }, {}, _post).then((res) => {
				this.$message({
					message: '工单确认成功',
					type: 'success'
				})
				that.paging_change(that.currentPage);
			});
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

	.btn {
		&-verify {
			background: #4993f7;
			border-radius: 4px;
			color: white;
			width: 45px;
			height: 22px;
			display: inline-block;
			text-align: center;
			margin-left: 0.3rem;
			font-size: 13px;

			&:hover {
				cursor: pointer;
			}
		}
	}
}
</style>
