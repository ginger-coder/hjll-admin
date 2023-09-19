<template>
	<div class="app-container">
		<el-scrollbar wrap-class="app-container-wrapper">
			<div ref="pageHead">
				<el-form ref="searchs" :model="searchs" class="form_horizontal">
					<el-form-item label="类型名称：" prop="name">
						<el-input placeholder="请输入类型名称" clearable v-model="searchs.name" @clear="do_search" @keyup.enter.native="do_search"> </el-input>
					</el-form-item>
					<el-form-item label="状态：" prop="status">
						<el-select v-model="searchs.status" clearable @change="do_search">
							<el-option v-for="item in temuseStatusLists" :key="'workOrderuseStatus' + item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button icon="el-icon-search" type="primary" v-hold-click @click="do_search">筛选</el-button>
						<el-button icon="el-icon-refresh" v-hold-click @click="search_reset">重置</el-button>
					</el-form-item>
				</el-form>
				<div v-if="perOperate" class="page_handle_group">
					<el-button type="primary" icon="el-icon-plus" v-hold-click  @click="jump('/types/createXj')">新增</el-button>
				</div>
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
					<el-table-column label="细分类型名称" min-width="100" prop="name" fixed show-overflow-tooltip>
						<template slot-scope="scope">
							{{ scope.row.name || "-" }}
						</template>
					</el-table-column>
						<el-table-column label="服务类型" min-width="100" prop="orderTypeCodeName" fixed show-overflow-tooltip>
						<template slot-scope="scope">
							{{ scope.row.orderTypeCodeName || "-" }}
						</template>
					</el-table-column>
					<el-table-column label="类型编码" min-width="100" prop="code" >
						<template slot-scope="scope">
							{{ scope.row.code || "-" }}
						</template>
					</el-table-column>
                    <el-table-column label="状态" width="120" align="center" prop="status">
                        <template slot-scope="scope">
							<!-- <el-tag size="mini" v-html="'启用'" v-if="scope.row.useStatus == 0"></el-tag>
							<el-tag type="info" size="mini" v-html="'禁用'" v-if="scope.row.useStatus == 1"></el-tag> -->
							<el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#909399" :active-value='0' :inactive-value='1' @change="table_cell_state_change(scope.row,$event)">
							</el-switch>
                        </template>
                    </el-table-column>
					<el-table-column label="创建时间" width="188" prop="createTime">
						<template slot-scope="scope"> {{ scope.row.createTime_ }} </template>
					</el-table-column>
					<el-table-column v-if="perOperate" label="操作" align="center" width="160" fixed="right">
						<template v-slot="{ row }">
							<el-button type="text" v-hold-click @click.stop="doCommand('info', row)">详情 </el-button>
							<el-dropdown @command="doCommand($event, row)">
								<el-button @click.stop type="text">更多</el-button>
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item command="edit">编辑</el-dropdown-item>
									<el-dropdown-item command="delete"><span class="el-danger">删除</span></el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
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
import { xjType } from "@/api/order";
import { getLabel, getClass, orderuseStatus } from "@/utils/dict";
import { deepClone } from "@/utils";


export default {
	data() {
		return {
			pageFun: xjType,
			apiKey: "id",

			temuseStatusLists: [
				{label:'开启',value:0},
				{label:'关闭',value:1}
			],
		};
	},
	mixins: [basic],
	methods: {
		tableuseStatusLabel(list, value) {
			return getLabel(list, value);
		},
		tableuseStatusClass(list, value) {
			return getClass(list, value);
		},
		filter_page_row(row) {
			let that = this;

			return row;
		},
		doCommand(command, row) {
			switch (command) {
				case "info":
					this.jump(`/types/infoXj?id=${row.id}`);
					break;
				case "edit":
					this.jump(`/types/createXj?id=${row.id}`);
					break;
				case "delete":
                    this.table_row_remove(row);
					break;
			}
		},

		table_cell_state_change(row, status) {
			let that = this;
			row.status = status
			that.pageFun({name: 'update', method: 'post'}, {},row)
				.then(res => {
					that.$message.success("修改成功");
					that.paging_change(that.currentPage);
				})
				.catch(err => {

				})
		},
		table_row_remove:function(row){
			var that = this

            let _form=new FormData()
			_form.append('ids',row.id)
			that.pageFun(
				{ name: "remove", method: "post" },
				{},
				_form
			)
				.then((res) => {
					that.$message.success("删除成功");
					that.paging_change(that.currentPage);
				})
				.catch((err) => {});
		},
		openDialog:function(row){
			var that = this
			this.$refs.configFormDialog.openDialog(row)
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
