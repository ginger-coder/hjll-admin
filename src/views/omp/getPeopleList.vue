<template>
	<div class="men-container">
		<div ref="pageHead">
			<el-form ref="searchs" :model="searchs" class="form_horizontal">
				<el-form-item label="姓名：" prop="nickName">
					<el-input
						placeholder="请输入姓名"
						clearable
						v-model="searchs.name"
						@clear="do_search"
						@keyup.enter.native="do_search"
					></el-input>
				</el-form-item>
				<el-form-item label="推荐人姓名：" prop="nickName">
					<el-input
						placeholder="请输入推荐人姓名"
						clearable
						v-model="searchs.referrer"
						@clear="do_search"
						@keyup.enter.native="do_search"
					></el-input>
				</el-form-item>
				<el-form-item label="状态：" prop="returnStatus">
					<el-select
						v-model="searchs.returnStatus"
						clearable
						@change="do_search"
					>
						<el-option label="未联系" :value="0"></el-option>
						<el-option label="已联系" :value="1"></el-option>
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
		</div>
		<el-table
			:data="lists"
			fit
			highlight-current-row
			border
			class="no_border_table"
			v-loading="loading"
			height="calc(100% - 146px)"
		>
			<el-table-column
				key="id"
				type="index"
				align="center"
				label="序号"
				width="50"
			></el-table-column>
			<el-table-column label="姓名" prop="name" />
			<el-table-column label="年龄" prop="age" />
			<el-table-column label="手机号码" prop="mobile" />
			<el-table-column label="状态" prop="returnStatus" />
			<el-table-column label="提交时间" prop="createTime" />
			<el-table-column label="推荐人" prop="referrer" />
			<el-table-column label="推荐人邀请码" prop="referrerCode" />
			<el-table-column label="操作" align="center">
				<template v-slot="{ row }">
					<el-button
						type="text"
						v-if="row.returnStatus == '未联系'"
						@click="onFollowUp(row)"
					>
						回访登记
					</el-button>
					<el-button type="text" @click="onCheckInfo(row.id)">
						详情
					</el-button>
				</template>
			</el-table-column>
			<el-table-column label="备注" width="200" prop="remark" />
		</el-table>
		<div ref="pagePagign" class="paging_fixed_bottom">
			<div class="pagign_box disp_flex ju_bet ali_cen">
				<div></div>
				<el-pagination
					background
					:total="total"
					:page-size="searchs.size"
					:pager-count="pagerCount"
					:current-page="searchs.current"
					layout="total,prev, pager, next,sizes, jumper"
					:page-sizes="pageSizes"
					@current-change="paging_change"
					@size-change="size_change"
				></el-pagination>
			</div>
		</div>
		<el-dialog
			title="回访登记"
			:visible.sync="backVisible"
			class="el-dialog-unify el-dialog-small"
			width="600px"
			:before-close="handleClose"
		>
			<el-form ref="form" :model="backParams" label-width="110px">
				<el-form-item label="初步回访意向">
					<el-select
						v-model="backParams.returnIntention"
						placeholder="请选择活动区域"
					>
						<el-option
							:label="item"
							:value="item"
							:key="index"
							v-for="(item, index) in followUpList"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="备注">
					<el-input
						type="textarea"
						v-model="backParams.remark"
						:rows="5"
					></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="handleClose">取 消</el-button>
				<el-button type="primary" @click="onSaveBack">确 定</el-button>
			</span>
		</el-dialog>
		<el-dialog
			title="详情"
			:visible.sync="infoVisible"
			class="el-dialog-unify el-dialog-medium"
			width="1284px"
			:before-close="handleInfoClose"
		>
			<el-descriptions direction="vertical" :column="6" border>
				<el-descriptions-item label="姓名">{{
					infoData.name
				}}</el-descriptions-item>
				<el-descriptions-item label="年龄">{{
					infoData.age
				}}</el-descriptions-item>
				<el-descriptions-item label="手机号码">{{
					infoData.mobile
				}}</el-descriptions-item>
				<el-descriptions-item label="维修经验" :span="2">
					<el-tag size="small">{{ infoData.experience }}</el-tag>
				</el-descriptions-item>
				<el-descriptions-item label="意向城市">{{
					infoData.area
				}}</el-descriptions-item>
				<el-descriptions-item label="提交时间">{{
					infoData.createTime
				}}</el-descriptions-item>
				<el-descriptions-item label="状态">{{
					infoData.returnStatus
				}}</el-descriptions-item>
				<el-descriptions-item
					label="回访登记时间"
					v-if="infoData.returnStatus == '已联系'"
					>{{ infoData.updateTime }}</el-descriptions-item
				>
				<el-descriptions-item
					v-if="infoData.returnStatus == '已联系'"
					label="回访登记"
					>{{ infoData.returnIntention }}</el-descriptions-item
				>
			</el-descriptions>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="handleInfoClose"
					>确 定</el-button
				>
			</span>
		</el-dialog>
	</div>
</template>
<script>
import { getIntentionPage, intentFollowUp, getIntentionInfo } from '@/api/omp';
import moment from 'moment';
export default {
	mounted() {
		this.do_search();
	},
	filters: {
		formatTime(time) {
			return moment(time).format('YYYY-MM-DD HH:mm:ss');
		},
	},
	data() {
		return {
			infoVisible: false,
			followUpList: [
				'符合招募要求并已引导入驻',
				'符合招募要求',
				'不符合要求',
			],
			backVisible: false,
			loading: false,
			pagerCount: 5,
			total: 0,
			lists: [],
			pageSizes: [10, 30, 50, 100],
			searchs: {
				size: 10,
				current: 1,
			},
			backParams: {},
			infoData: {},
		};
	},
	methods: {
		onCheckInfo(id) {
			this.infoVisible = true;
			getIntentionInfo(id).then((res) => {
				this.infoData = res.data;
			});
		},
		handleInfoClose() {
			this.infoVisible = false;
			this.infoData = {};
		},
		onFollowUp(row) {
			this.backParams.id = row.id;
			this.backVisible = true;
		},
		onSaveBack() {
			intentFollowUp(this.backParams).then((res) => {
				this.backVisible = false;
				this.initList();
			});
		},
		handleClose() {
			this.backParams = {
				returnIntention: '',
				remark: '',
			};
			this.backVisible = false;
		},
		paging_change(page) {
			this.searchs.current = page;
			this.initList();
		},
		size_change(size) {
			this.searchs.current = 1;
			this.searchs.size = size;
			this.initList();
		},
		do_search() {
			this.searchs.current = 1;
			this.initList();
		},
		initList() {
			this.loading = true;
			getIntentionPage(this.searchs).then((res) => {
				this.lists = res.data.records || [];
				this.loading = false;
			});
		},
		search_reset() {
			this.searchs = {
				size: 10,
				current: 1,
			};
			this.initList();
		},
	},
};
</script>
<style lang="scss" scoped>
.men-container {
    height: 100%;
}
// 	font-size: 0;
// 	position: relative;
// 	// padding: 20px;
// 	background: #ffffff;
// 	border-radius: 4px;
// 	display: flex;
// 	height: 100%;
// 	flex-direction: column;
// 	::v-deep {
// 		.el-table {
// 			&::before {
// 				content: none;
// 			}
// 		}
// 		.el-tab-pane {
// 			height: 100%;
// 		}
// 		.el-tabs {
// 			flex: 1;
// 			.el-tabs__content {
// 				height: calc(100% - 80px);
// 			}
// 		}
// 	}

// 	//.no_border_table {
// 	//  margin-bottom: 72px;
// 	//}

// 	.score {
// 		height: 22px;
// 		display: flex;
// 		align-items: center;

// 		svg {
// 			width: 20px;
// 			height: 20px;
// 			margin-right: 0.3rem;
// 			color: #e6a23c;
// 		}

// 		span {
// 			font-size: 17px;
// 			color: #e6a23c;
// 		}
// 	}
// }
</style>
