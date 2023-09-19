<template>
	<div class="app-container">
		<el-scrollbar wrap-class="app-container-wrapper">
			<div ref="pageHead">
				<el-form ref="searchs" :model="searchs" class="form_horizontal">
					<el-form-item label="故障名称：" prop="name">
						<el-input placeholder="请输入故障名称" clearable v-model="searchs.faultName" @clear="do_search" @keyup.enter.native="do_search"> </el-input>
					</el-form-item>
					<el-form-item label="所属设备类型：" prop="deviceTypeId">
						<el-select v-model="searchs.deviceTypeId" @change="do_search">
							<el-option v-for="item in sbTypeLists" :key="'deviceTypeId' + item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="所属设备：" prop="name">
						<el-select v-model="searchs.deviceId" @change="do_search">
							<el-option v-for="item in sblists" :key="'deviceId' + item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="故障类型：" prop="faultType">
						<el-select v-model="searchs.faultType" @change="do_search">
							<el-option v-for="item in gzTypeLists" :key="'faultType' + item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="状态：" prop="status">
						<el-select v-model="searchs.status" clearable @change="do_search">
							<el-option v-for="item in temStatusLists" :key="'workOrderStatus' + item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button icon="el-icon-search" type="primary" v-hold-click @click="do_search">筛选</el-button>
						<el-button icon="el-icon-refresh" v-hold-click @click="search_reset">重置</el-button>
					</el-form-item>
				</el-form>
				<div v-if="perOperate" class="page_handle_group">
          <el-button type="primary" icon="el-icon-plus" v-hold-click @click="to_create()">新增</el-button>
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
					<el-table-column label="故障名称" min-width="100" prop="name" fixed show-overflow-tooltip>
						<template slot-scope="scope">
							{{ scope.row.faultName || "-" }}
						</template>
					</el-table-column>
					<el-table-column label="所属设备类型" prop="deviceTypeName" min-width="140">
						<template slot-scope="scope">
							{{ scope.row.deviceTypeName || "-" }}
						</template>
					</el-table-column>
					<el-table-column label="所属设备" prop="deviceName">
						<template slot-scope="scope">
							{{ scope.row.deviceName || "-" }}
						</template>
					</el-table-column>
					<el-table-column label="故障分类" prop="faultTypeName">
						<template slot-scope="scope">
							{{ scope.row.faultTypeName || "-" }}
						</template>
					</el-table-column>
          <el-table-column label="状态" width="120" align="center" prop="status">
              <template slot-scope="scope">
							<!-- <el-tag size="mini" v-html="'启用'" v-if="scope.row.status == 0"></el-tag>
							<el-tag type="info" size="mini" v-html="'禁用'" v-if="scope.row.status == 1"></el-tag> -->
							<el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#909399" :active-value='0' :inactive-value='1' @change="table_cell_state_change(scope.row,$event)">
							</el-switch>
              </template>
          </el-table-column>
					<el-table-column label="创建时间" width="188" prop="createTime">
						<template slot-scope="scope"> {{ scope.row.createTime_ }} </template>
					</el-table-column>
					<el-table-column v-if="perOperate" label="操作" align="center" width="160" fixed="right">
						<template v-slot="{ row }">
							<el-button type="text" v-hold-click @click.stop="doCommand('info', row)"> 详情 </el-button>
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
import { gz } from "@/api/maintain";
import { getLabel, getClass, orderStatus } from "@/utils/dict";
import { deepClone } from "@/utils";
import { device} from "@/api/device";

export default {
		components: {},
	data() {
		return {
			pageFun: gz,
			apiKey: "id",

			temStatusLists: [
				{label:'开启',value:0},
				{label:'关闭',value:1}
			],

			sblists:[],
			sbTypeLists:[],
			gzTypeLists:[
				{value:1,label:'隐患检查'},
				{value:2,label:'数值校对'},
				{value:3,label:'数量核对'},
				{value:4,label:'内容核对'},
			]
		};
	},
	mixins: [basic],
	mounted() {
		let that = this;
    that.loader_sbTypesLists()
    that.loader_sbLists()
	},
	methods: {
		tableStatusLabel(list, value) {
			return getLabel(list, value);
		},
		tableStatusClass(list, value) {
			return getClass(list, value);
		},
		filter_page_row(row) {
			let that = this;

			return row;
		},
		doCommand(command, row) {
			switch (command) {
				case "info":
					this.jump(`/maintain/gzInfo?id=${row.id}`);
					break;
				case "edit":
					this.jump(`/maintain/gzCreate?id=${row.id}`);
					break;
				case "delete":
              this.table_row_remove(row);
					break;
			}
		},

		// 设备类型
		loader_sbTypesLists: function () {
			let that = this;
			device({ method: "get", name: "page" }, { current: 1, size: 3000,url:'device-type-info' })
				.then((res) => {
					let _list = [];
					res.data.records.map((item) => {
						_list.push({
							label: item.name,
							value: item.id,
						});
					});
					that.sbTypeLists = _list;
				})
				.catch((error) => {});
		},
		// 设备
		loader_sbLists: function () {
			let that = this;

			device({ method: "get", name: "page" }, { current: 1, size: 3000,url:'device-info' })
				.then((res) => {
					let _list = [];
					res.data.records.map((item) => {
						_list.push({
							label: item.deviceName,
							value: item.id,
						});
					});
					that.sblists = _list;
				})
				.catch((error) => {});
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

			that.$confirm('确认删除该数据吗?', "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning",
			})
				.then(() => {
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
				})
				.catch(() => {});
		},
		to_create:function(row){
			var that = this
			this.jump(`/maintain/gzCreate`);
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
