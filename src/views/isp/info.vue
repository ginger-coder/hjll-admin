<template>
	<div style="height: 100%">
		<div class="header_box disp_flex ju_bet ali_cen">
			<div>
				<div class="title">{{ title }}</div>
				<div class="titleTips">{{ titleTips }}</div>
			</div>
			<div class="back_box">
				<el-button v-hold-click type="" @click="back">返回</el-button>
			</div>
		</div>
		<div class="scrllbar form_box">
			<div class="head">
				<div class="first">
					<div class="left">
						<div class="avatar">
							<el-image
								v-if="info.authLicenseFile"
								:src="`${baseUpload + info.authLicenseFile}`"
								:fit="'cover'"
								class="logo"
							></el-image>
							<el-avatar v-else shape="square" :size="96">{{
								info.entName || '-'
							}}</el-avatar>
						</div>
						<div>
							<div class="title">
								<h2>
									{{ info.entName || '-' }}
								</h2>
								<el-tag
									class="verify-status"
									effect="dark"
									:type="
										`${info.authStatus}` === '认证成功'
											? 'success'
											: 'danger'
									"
								>
									{{ info.authStatus }}
								</el-tag>
							</div>
							<div class="tip">
								<span
									>简称:
									<span class="content">{{
										info.shortName || '-'
									}}</span></span
								>
								<span
									>邮箱:
									<span class="content">{{
										info.email || '-'
									}}</span></span
								>
							</div>
							<div>
								<span
									>营业执照注册号:
									<span class="content">{{
										info.entQualificationNum || '-'
									}}</span></span
								>
								<span
									>营业执照:
									<span
										class="content link"
										v-if="info.entLicenseFile"
										@click="view(info.entLicenseFile)"
									>
										点击查看
									</span>
									<span v-else class="content">-</span>
								</span>
								<span
									>授权书:
									<span
										class="content link"
										v-if="info.authLicenseFile"
										@click="view(info.authLicenseFile)"
										>点击查看</span
									>
									<span v-else class="content">-</span>
								</span>
								<span
									v-if="info.signatureId">签约信息:
									<span
										class="content link"
										@click="viewFile(info.signatureId)"
										>点击查看</span
									>
								</span>
							</div>
						</div>
					</div>
					<!-- <div class="right">
						<el-button type="primary" plain @click="showAccount"
							>查看账户详情</el-button
						>
					</div> -->
				</div>
				<div class="detail">
					<div>
						<span
							>法定代表人姓名:
							<span class="content">{{
								info.corporateName || '-'
							}}</span></span
						>
						<span
							>法定代表人身份证号:
							<span class="content">{{
								info.corporateIdCard || '-'
							}}</span></span
						>
					</div>
					<div>
						<span
							>注册时间:
							<span class="content">{{
								parse_time(
									new Date(info.registerTime).getTime(),
									'{y}-{m}-{d}'
								) || '-'
							}}</span></span
						>
						<span
							>认证时间:
							<span class="content">{{
								info.authTime || '-'
							}}</span></span
						>
						<span
							>验证方式:
							<span class="content">{{
								info.authWay
							}}</span></span
						>
					</div>
				</div>
			</div>
		</div>
		<div class="scrllbar form_box">
			<div class="statistic">
				<div
					:class="['block', statistic.select === 0 ? 'gray' : '']"
					@click="clickStatistic(0)"
				>
					<span>处理中工单</span>
					<h4>{{ info.disposeWorkOrderNum }}</h4>
					<div v-if="statistic.select === 0" class="under-line"></div>
				</div>
				<div
					:class="['block', statistic.select === 1 ? 'gray' : '']"
					@click="clickStatistic(1)"
				>
					<span>全部工单</span>
					<h4>{{ info.workOrderNum }}</h4>
					<div v-if="statistic.select === 1" class="under-line"></div>
				</div>
				<div :class="['block', statistic.select === 2 ? 'gray' : '']">
					<span>累计金额</span>
					<h4>{{ (info.money || 0).toFixed(2) }}</h4>
					<div v-if="statistic.select === 2" class="under-line"></div>
				</div>
				<div :class="['block', statistic.select === 3 ? 'gray' : '']">
					<span>全部站址</span>
					<h4>{{ info.stationCount }}</h4>
					<div v-if="statistic.select === 3" class="under-line"></div>
				</div>
			</div>
		</div>
		<div class="scrllbar form_box">
			<div class="list">
				<h3>
					{{ statistic.select === 0 ? '处理中工单' : '全部工单' }}
				</h3>
				<template>
					<el-table
						:data="orderList"
						ref="lists"
						fit
						highlight-current-row
						border
						class="no_border_table"
						element-loading-spinner="el-icon-loading"
						element-loading-custom-class="custom-loading"
						:max-height="tableMaxHeight"
						:row-key="getRowKey"
						@selection-change="handleSelectionChange"
						@cell-click="cell_click"
					>
						<el-table-column
							key="id"
							type="index"
							width="50"
							align="center"
							label="#"
							fixed
						>
							<template slot-scope="scope">
								{{
									scope.$index +
									1 +
									(currentPage - 1) * pageSize
								}}
							</template>
						</el-table-column>
						<el-table-column
							label="工单类型"
							width="100"
							prop="orderTypeName"
						>
							<template v-slot="{ row }">
								{{ row.orderTypeName || '-' }}
							</template>
						</el-table-column>
						<el-table-column
							label="编号"
							width="130"
							prop="serialNumber"
							sortable
						>
							<template v-slot="{ row }">
								{{ row.serialNumber || '-' }}
							</template>
						</el-table-column>
						<el-table-column label="省份" prop="provinceName">
							<template v-slot="{ row }">
								{{ row.provinceName || '-' }}
							</template>
						</el-table-column>
						<el-table-column label="城市" prop="cityName">
							<template v-slot="{ row }">
								{{ row.cityName || '-' }}
							</template>
						</el-table-column>
						<el-table-column label="区县" prop="districtName">
							<template v-slot="{ row }">
								{{ row.areaName || '-' }}
							</template>
						</el-table-column>
						<el-table-column
							label="站点"
							min-width="180"
							prop="siteName"
							show-overflow-tooltip
						>
							<template v-slot="{ row }">
								{{ row.siteName || '-' }}
							</template>
						</el-table-column>
						<el-table-column label="状态" width="140" prop="status">
							<template v-slot="{ row }">
								<span
									v-if="row.workOrderStatus"
									class="dot-normal"
									>●</span
								>
								{{ label(stateData, row.workOrderStatus) }}
								<!--                <div v-if="`${row.workOrderStatus}` === '0'" class="status_box">
                  <span class="dot-dispatch">●</span>
                  未派单
                  <el-popover
                      :ref="`pop${row.id}`"
                      trigger="click"
                      placement="right"
                      title="确定要派单吗?"
                  >
                    <div style="text-align: right; margin: 1rem 0 0 0">
                      <el-button size="small" text @click="visible = false">取消</el-button>
                      <el-button size="small" type="primary" @click="visible = false">确认</el-button>
                    </div>
                    <template #reference>
                      <span @click="doCommand('dispatch',row)" class="btn-dispatch">派单</span>
                    </template>
                  </el-popover>
                </div>-->
								<!--                <div v-else>
                  <span v-if="row.workOrderStatus" class="dot-normal">●</span>
                  {{ label(stateData, row.workOrderStatus) }}
                </div>-->
							</template>
						</el-table-column>
						<el-table-column
							label="创建时间"
							width="188"
							prop="createTime"
							sortable
						>
							<template v-slot="{ row }">
								{{
									parse_time(
										new Date(row.createTime).getTime(),
										'{y}-{m}-{d} {h}:{i}:{s}'
									) || '-'
								}}
							</template>
						</el-table-column>
						<!--            <el-table-column v-if="perOperate" label="操作" align="center" width="138" fixed="right">
              <template v-slot="{row}">
                <el-button type="text" v-hold-click
                           @click.stop="doCommand('info',row)">
                  详情
                </el-button>
                <el-dropdown @command="doCommand($event, row)">
                  <el-button @click.stop type="text">更多</el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="info">详情</el-dropdown-item>
                    <el-dropdown-item command="dispatch">派单</el-dropdown-item>
                    <el-dropdown-item command="verify">取消</el-dropdown-item>
                    <el-dropdown-item command="audit">确认</el-dropdown-item>
                    <el-dropdown-item command="audit">支付</el-dropdown-item>
                    <el-dropdown-item command="edit">编辑</el-dropdown-item>
                    <el-dropdown-item command="delete"><span class="el-danger">删除</span></el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>-->
					</el-table>
					<div ref="pagePagign" class="">
						<div class="pagign_box disp_flex ju_bet ali_cen">
							<div></div>
							<el-pagination
								background
								:total="total"
								:page-size="pageSize"
								:pager-count="pagerCount"
								:current-page="currentPage"
								layout="total,prev, pager, next,sizes, jumper"
								:page-sizes="pageSizes"
								@current-change="
									(page) => {
										fetchList(page);
									}
								"
								@size-change="(size) => fetchList(null, size)"
							></el-pagination>
						</div>
					</div>
				</template>
			</div>
		</div>

		<div class="footer"></div>
		<el-dialog
			:visible.sync="pdfInfoVisible"
			class="el-dialog-unify el-dialog-medium"
			width="1284px"
		>
			<div class="pdf-container">
				<div class="desc">
					<el-form ref="form" :model="form" label-width="100px">
						<el-form-item label="协议编号：">
							{{ pdfInfo.agreementNo || '-' }}
						</el-form-item>
						<el-form-item label="详情：">
							<div class="sign-footer">
								<div class="desc">
									<ul v-for="(item, index) in pdfInfo.historySignList" :key="index">
										<li>{{ item.createTime }}</li>
										<li>{{ item.agreementNo }}</li>
										<li>
											{{
												item.agreementSignStatus
											}}
										</li>
										<li v-if="item.remark">原因：{{ item.remark }}</li>
									</ul>
								</div>
							</div>
						</el-form-item>
					</el-form>
				</div>
				<div class="image-container">
					<img
						v-for="(item, index) in pdfImageArr"
						:key="index"
						:src="item.targetURL"
					/>
				</div>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="pdfInfoVisible = false">取消</el-button>
				<el-button type="primary" @click="pdfInfoVisible = false"
					>确定</el-button
				>
			</span>
		</el-dialog>
	</div>
</template>
<script>
import basic from '@/mixins/basic';
import { parseTime } from '@/utils';
import { BASE_UPLOAD } from '@/config';

import uploadPics from '@/components/custom/uploadPics';
import uploadFiles from '@/components/custom/uploadFile';
import {
	info,
	getOrderList,
	getProtocolDetail,
	getProtocolImgList,
} from '@/api/isp';
import { getLabel, ispStatus, orderStatus } from '@/utils/dict';

export default {
	components: {
		uploadPics,
		uploadFiles,
	},
	filters: {
		// 1待签署，2：已拒签，3：已完成，4：已过期
		formatStatus(value) {
			let status = '';
			switch (value) {
				case 1:
					status = '待签署';
					break;
				case 2:
					status = '已拒签';
					break;
				case 3:
					status = '已完成';
					break;
				case 4:
					status = '已过期';
					break;
				default:
					break;
			}
			return status;
		},
	},
	data() {
		return {
			baseUpload: BASE_UPLOAD,
			id: '',
			moduleTitle: '账号',
			apiKey: 'adminId',

			title: '',
			titleTips: '',
			form: {},
			rules: {},
			statistic: {
				select: 0,
			},
			info: {},
			stateData: orderStatus,
			verifyState: ispStatus.verify,
			verifyWay: ispStatus.verifyWay,
			orderList: [],

			pdfInfoVisible: false,
			pdfInfo: {},
			pdfImageArr: [],
		};
	},
	mixins: [basic],
	async created() {
		const { id } = this.$route.query;
		this.id = id;
		this.title = `运营商详情`;
		if (`${id}`.length > 0 && id) {
			const res = await info(id);
			this.info = res.data;
			await this.fetchList();
		}
	},
	mounted() {
		// setTimeout(() => {
		//   this.lists = new Array(12).fill(0).map((_, idx) => {
		//     return {
		//       id: idx,
		//       no: idx,
		//       status: idx,
		//     }
		//   })
		// }, 1000)
	},
	methods: {
		viewFile(signatureId) {
			this.pdfInfoVisible = true;
			getProtocolDetail({
				id: signatureId,
			}).then((res) => {
				if (res.code == 0) {
					this.pdfInfo = { ...this.pdfInfo, ...res.data };
				}
			});
			getProtocolImgList({
				id: signatureId,
			}).then((res) => {
				if (res.code == 0) {
					console.log('ewa', res.data);
					if (res.data) {
						this.pdfImageArr = res.data.map((el) => {
							el.targetURL = this.baseUpload + el.imgUrl;
                            return el;
						});
					}
				}
			});
		},
		back() {
			this.$router.go(-1);
		},
		async fetchList(p, s) {
			if (s && !Number.isNaN(s)) {
				this.pageSize = s;
			}
			if (p && !Number.isNaN(p)) {
				this.currentPage = p;
			}
			const data = {
				tenantId: this.info.tenantId,
				size: this.pageSize,
				current: this.currentPage,
			};
			if (this.statistic.select === 0) {
				data['workOrderStatus'] = 6;
			}
			const res = await getOrderList(data);
			const { records, total, size } = res.data;
			this.orderList = records;
			this.total = total;
			this.pageSize = size;
		},
		view(url = '') {
			url && window.open(`${this.baseUpload + url}`);
		},
		parse_time(date, fmt) {
			return parseTime(date, fmt);
		},
		clickStatistic(v) {
			const old = this.statistic.select;
			this.statistic.select = v;
			if (old !== v) {
				this.fetchList();
			}
		},
		label(list, value) {
			return getLabel(list, value);
		},
		doCommand(command, row) {
			switch (command) {
				case 'info':
					this.jump(`/order/orderInfo?id=${row.id}`);
					break;
			}
		},
		showAccount() {
			this.$message({ type: 'info', message: '敬请期待' });
		},
	},
};
</script>
<style lang="scss" scoped>
.pdf-container {
	.image-container {
		overflow-y: auto;
		height: 500px;
		img {
			width: 100%;
		}
	}
}
.sign-footer {
	text-align: center;
	.desc {
		border-radius: 2px;
		border: 1px solid #f5f5f5;
		padding: 16px;
		margin: 0 auto;
		ul {
			display: flex;
			li {
				list-style: none;
				padding: 0;
				margin: 0;
				margin-right: 20px;
			}
		}
	}
}

.app-container {
	font-size: 0;
	position: relative;

	::v-deep {
		.el-table {
			&::before {
				content: none;
			}
		}

		.el-avatar {
			margin: 0;
		}
	}
}

.header_box {
	background: #ffffff;
	margin: -20px;
	padding: 20px;

	.title {
		font-size: 20px;
		font-weight: 500;
		margin-bottom: 10px;
	}

	.back_box {
	}
}

.form_box {
	background-color: #ffffff;
	//height: calc(100% - 80px);
	margin-top: 40px;
	border-radius: 4px;

	.el-form {
		width: 50%;
		min-height: 800px;
		margin: 0 auto;
		padding-top: 40px;
	}

	.head {
		padding: 24px;

		.first {
			display: flex;
			justify-content: space-between;
			margin-bottom: 1rem;

			.left {
				display: flex;

				.title {
					display: flex;

					h2 {
						font-size: 22px;
						margin: 0 0.6rem 0 0;
					}

					span {
						height: 24px;
						display: flex;
						justify-content: center;
						align-items: center;
					}
				}

				.avatar {
					margin-right: 12px;
				}

				.tip {
					margin: 1rem 0;
				}

				div {
					&:first-child {
						.content {
							margin-bottom: 1rem;
						}
					}

					&:nth-child(2) {
						padding: 3px 0 0 0;
					}
				}
			}

			.right {
				right: 0;
			}
		}

		.detail {
			display: flex;
			flex-direction: column;
			padding: 16px;
			background: #e5e7e7;
			border-radius: 6px;

			div {
				display: flex;

				&:first-child {
					margin-bottom: 1rem;
				}
			}
		}

		.content,
		.link {
			font-size: 15px;
		}

		.content {
			margin-right: 1rem;
		}

		.link {
			color: rgb(73, 147, 247);
			font-weight: 400;

			&:hover {
				cursor: pointer;
			}
		}
	}

	.statistic {
		display: flex;
		justify-content: space-between;

		.block {
			position: relative;
			padding: 20px;
			width: 25%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			h4 {
				margin: 1rem 0 0 0;
				font-size: 28px;
			}

			&:nth-child(1) {
				border-radius: 4px 0 0 4px;

				&:hover {
					cursor: pointer;
				}
			}

			&:nth-child(2) {
				&:hover {
					cursor: pointer;
				}
			}
		}

		.under-line {
			position: absolute;
			bottom: 6px;

			width: 60%;
			height: 4px;
			border-radius: 6px;
			background: rgb(73, 147, 247);
		}

		.gray {
			background: rgb(248, 249, 250);
		}
	}

	.list {
		padding: 24px;

		h3 {
			margin: 0 0 1rem 0;
		}

		.dot {
			&-dispatch {
				color: #909399;
			}

			&-normal {
				color: #e6a23c;
			}
		}

		.btn {
			&-dispatch {
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
}

.logo {
	width: 96px;
	height: 96px;
}

.footer {
	height: 80px;
}
</style>
