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
					<div class="avatar">
						<el-image
							v-if="form.signInfoMessageVo.workingPic"
							:src="`${
								baseUpload + form.signInfoMessageVo.workingPic
							}`"
							:fit="'cover'"
							class="logo"
						></el-image>
						<el-avatar v-else shape="square" :size="96">{{
							form.umsMember.nickName
						}}</el-avatar>
					</div>
					<div style="flex: 1">
						<div class="title">
							<div class="left">
								<h2>{{ form.umsMember.nickName }}</h2>
								<el-tag
									:type="
										(form.umsMember.sign || 0) === 0
											? 'info'
											: 'success'
									"
									effect="dark"
								>
									{{
										label(
											signState,
											form.umsMember.sign || 0
										)
									}}
								</el-tag>
								<div class="score">
									<svg-icon
										icon-class="star"
										width="80px"
									></svg-icon>
									<span>{{
										Number.parseFloat(
											`${form.umsMember.score || 0}`
										).toFixed(1)
									}}</span>
								</div>
							</div>
							<div class="right">
								<el-button
									type="primary"
									plain
									@click="showAccount"
									>保险信息</el-button
								>
								<el-button
									type="primary"
									plain
									@click="showAccount"
									>账户详情</el-button
								>
							</div>
						</div>
						<div class="tip">
							<span style="margin-right: 15px"
								>手机:
								<span class="content">{{
									desensitization(form.umsMember.mobile, 3)
								}}</span></span
							>
							<span style="margin-right: 15px"
								>所属项目:
								<span class="content">{{
									form.signInfoMessageVo.projectName
								}}</span></span
							>
							<span
								>所属工作组:
								<span class="content">{{
									form.signInfoMessageVo.groupName
								}}</span></span
							>
						</div>
						<div>
							<span
								>身份证号:
								<span class="content">{{
									desensitization(form.umsMember.card) || '-'
								}}</span></span
							>
							<span
								>身份证:
								<span
									class="content link"
									v-if="form.umsMember.cardUrl"
									@click="view(form.umsMember.cardUrl)"
									>点击查看</span
								>
								<span v-else class="content">-</span>
							</span>
							<span
								>注册时间:
								<span class="content">{{
									parse_time(
										new Date(
											form.umsMember.createTime
										).getTime(),
										'{y}-{m}-{d} {h}:{i}:{s}'
									) || '-'
								}}</span></span
							>
							<span
								>认证时间:
								<span class="content">{{
									parse_time(
										new Date(
											form.umsMember.updateTime
										).getTime(),
										'{y}-{m}-{d} {h}:{i}:{s}'
									) || '-'
								}}</span></span
							>
						</div>
					</div>
				</div>

				<div class="ceateatbox">
					<h3 style="margin: 0 0 1rem 0">签约信息</h3>
					<div style="display: flex">
						<div style="width: 50%">
							<span style="display: block; white-space: normal"
								>工作区域:
								<span class="content">{{
									form.signInfoMessageVo.workArea || '-'
								}}</span></span
							>

							<span style="display: block"
								>角色:
								<span class="content">{{
									form.signInfoMessageVo.role || '-'
								}}</span></span
							>
							<span style="display: block"
								>技能:
								<span class="content">{{
									form.signInfoMessageVo.skill || '-'
								}}</span></span
							>
							<span style="display: block"
								>证书:
								<span
									class="content link"
									v-if="zslist.length != 0"
									@click="Viewphoto"
									>点击查看</span
								>
								<span v-else class="content">-</span>
							</span>
						</div>

						<div style="width: 50%">
							<span style="display: block"
								>合同扫描件:
								<span
									class="content link"
									v-if="form.umsMember.contract"
									@click="view(form.umsMember.contract)"
								>
									点击查看
								</span>
								<span v-else class="content">-</span>
							</span>
							<div>
								<span style="display: block"
									>签约时间:
									<span class="content">{{
										parse_time(
											new Date(
												form.signInfoMessageVo.signTime
											).getTime(),
											'{y}-{m}-{d} {h}:{i}:{s}'
										) || '-'
									}}</span></span
								>
							</div>
						</div>
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
					<h4>{{ form.umsMember.workOrderNum || 0 }}</h4>
					<div v-if="statistic.select === 0" class="under-line"></div>
				</div>
				<div
					:class="['block', statistic.select === 1 ? 'gray' : '']"
					@click="clickStatistic(1)"
				>
					<span>全部工单</span>
					<h4>{{ form.umsMember.allWorkOrderNum || 0 }}</h4>
					<div v-if="statistic.select === 1" class="under-line"></div>
				</div>
				<div :class="['block', statistic.select === 2 ? 'gray' : '']">
					<span>累计金额</span>
					<h4>{{ (form.umsMember.money || 0).toFixed(2) }}</h4>
					<div v-if="statistic.select === 2" class="under-line"></div>
				</div>
				<div :class="['block', statistic.select === 3 ? 'gray' : '']">
					<span>提现明细</span>
					<h4>{{ 0 }}</h4>
					<div v-if="statistic.select === 3" class="under-line"></div>
				</div>
			</div>
		</div>
		<div class="scrllbar form_box">
			<div class="list">
				<h3>{{ statistic.label[statistic.select] }}</h3>
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
						></el-table-column>
						<el-table-column
							label="工单类型"
							width="100"
							prop="workOrderTypeName"
						>
							<template v-slot="{ row }">
								{{ row.workOrderTypeName || '-' }}
							</template>
						</el-table-column>
						<el-table-column label="编号" width="220">
							<template v-slot="{ row }">
								{{ row.orderNumber || '-' }}
							</template>
						</el-table-column>
						<el-table-column label="地区" width="240">
							<template v-slot="{ row }">
								{{ row.address || '-' }}
							</template>
						</el-table-column>
						<!-- <el-table-column label="省份">
              <template v-slot="{row}">
                {{ row.provinceName || "-" }}
              </template>
            </el-table-column>
            <el-table-column label="城市">
              <template v-slot="{row}">
                {{ row.cityName || "-" }}
              </template>
            </el-table-column>
            <el-table-column label="区县">
              <template v-slot="{row}">
                {{ row.districtName || "-" }}
              </template>
            </el-table-column> -->
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
								<div
									v-if="`${row.workOrderStatus}` === '0'"
									class="status_box"
								>
									<span class="dot-dispatch">●</span>
									未派单
									<el-popover
										:ref="`pop${row.id}`"
										trigger="click"
										placement="right"
										title="确定要派单吗?"
									>
										<div
											style="
												text-align: right;
												margin: 1rem 0 0 0;
											"
										>
											<el-button
												size="small"
												text
												@click="visible = false"
												>取消</el-button
											>
											<el-button
												size="small"
												type="primary"
												@click="visible = false"
												>确认</el-button
											>
										</div>
										<template #reference>
											<span
												@click="
													doCommand('dispatch', row)
												"
												class="btn-dispatch"
												>派单</span
											>
										</template>
									</el-popover>
								</div>
								<div v-else>
									<span
										v-if="row.workOrderStatus"
										class="dot-normal"
										>●</span
									>
									{{ label(stateData, row.workOrderStatus) }}
								</div>
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
						<!-- <el-table-column v-if="perOperate" label="操作" align="center" width="138" fixed="right">
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
            </el-table-column> -->
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
		<el-dialog
			title="提示"
			:visible.sync="centerDialogVisible"
			class="el-dialog-unify el-dialog-medium"
			width="1284px"
			center
		>
			<div
				style="
					display: flex;
					flex-wrap: wrap;
					justify-content: space-between;
				"
			>
				<div></div>
				<el-carousel trigger="click" height="600px" style="width: 100%">
					<el-carousel-item v-for="(item, i) in zslist" :key="i">
						<div class="img-box">
							<div
								style="
									font-weight: 600;
									font-size: 20px;
									margin-top: 10px;
									margin-bottom: 10px;
								"
							>
								{{ item.name }}
							</div>
							<img  alt=""  />
							<el-image
                                style="height: 500px"
								:src="item.url"
								:preview-src-list="[item.url]"
							>
							</el-image>
						</div>
					</el-carousel-item>
				</el-carousel>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="centerDialogVisible = false"
					>取 消</el-button
				>
				<el-button type="primary" @click="centerDialogVisible = false"
					>确 定</el-button
				>
			</span>
		</el-dialog>
		<div class="footer"></div>
	</div>
</template>
<script>
import basic from '@/mixins/basic';
import { desensitization } from '@/utils';
import uploadPics from '@/components/custom/uploadPics';
import uploadFiles from '@/components/custom/uploadFile';
import { info, orderList } from '@/api/omp';
import { getLabel, ompStatus, orderStatus } from '@/utils/dict';
import { parseTime } from '@/utils';
import { BASE_UPLOAD } from '@/config';

export default {
	components: {
		uploadPics,
		uploadFiles,
	},
	data() {
		return {
			baseUpload: BASE_UPLOAD,
			id: '',
			moduleTitle: '账号',
			apiKey: 'adminId',

			title: '',
			titleTips: '',
			form: {
				umsMember: {},
				signInfoMessageVo: {},
			},
			rules: {},
			statistic: {
				label: ['处理中工单', '全部工单', '累计金额', '提现明细'],
				select: 0,
			},
			stateData: orderStatus,
			orderList: [],
			signState: ompStatus.sign,
			zslist: [],
			centerDialogVisible: false,
		};
	},
	mixins: [basic],
	async created() {
		const { id } = this.$route.query;
		this.id = id;
		this.title = `运维人员详情`;
		if (`${id}`.length > 0 && id) {
			info({ userId: id }).then((t) => {
				this.zslist = t.certificateUmsVos?.map((el) => {
					return {
						url: BASE_UPLOAD + el.certificateUrl,
						name: el.certificateName,
					};
				}) || [];

				const { umsMember, signInfoMessageVo } = t;
				this.form = {
					umsMember: umsMember || {},
					signInfoMessageVo: signInfoMessageVo || {},
				};
			});
			this.fetchList();
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
		desensitization,
		Viewphoto() {
			this.centerDialogVisible = true;
		},
		back() {
			this.$router.go(-1);
		},
		parse_time(date, fmt) {
			return parseTime(date, fmt);
		},
		label(list, value) {
			return getLabel(list, value);
		},
		handleMobile(m) {
			return m && m.length > 0
				? m.replace(/^(\d{3})\d{4}(\d{4})$/, '$1XXXX$2')
				: '-';
		},
		getLabelName(list, key) {
			return (list || []).map((item) => item[key]).join(',') || '-';
		},
		view(url = '') {
			url && window.open(this.baseUpload + url);
		},
		showAccount() {
			this.$message({ type: 'info', message: '敬请期待' });
		},
		clickStatistic(v) {
			const old = this.statistic.select;
			this.statistic.select = v;
			if (old !== v) {
				this.fetchList();
			}
		},
		doCommand(command, row) {
			switch (command) {
				case 'info':
					this.jump(`/order/orderInfo?id=${row.id}`);
					break;
			}
		},
		async fetchList(p, s) {
			if (s && !Number.isNaN(s)) {
				this.pageSize = s;
			}
			if (p && !Number.isNaN(p)) {
				this.currentPage = p;
			}
			const data = {
				userId: this.id,
				size: this.pageSize,
				current: this.currentPage,
			};
			if (this.statistic.select === 0) {
				data['orderStatus'] = 6;
				data['workOrderStatus'] = 6;
			}
			const { records, total, size } = await orderList(data);
			this.orderList = records.map((el) => {
				const add = el.address.split(' / ');
				return {
					...el,
					provinceName: add[0],
					cityName: add[1],
					districtName: add[2],
				};
			});
			this.total = total;
			this.pageSize = size;
		},
	},
};
</script>
<style lang="scss" scoped>
.img-box {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
.ceateatbox {
	background: #e5e7e7;
	border-radius: 4px;
	padding: 10px;
	span {
		margin-top: 8px;
		font-size: 14px;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.75);
		.content {
			color: #95979a;
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

	.divider {
		height: 1px;
		background-image: linear-gradient(
			to right,
			#d1d2d9 0%,
			#d1d2d9 50%,
			transparent 0%
		);
		background-size: 14px 1px;
		background-repeat: repeat-x;
	}

	.cert-add {
		display: flex;
		justify-content: center;
		align-items: center;

		width: 100%;
		height: 38px;
		border: 1px dashed #8f959e;
		background: #eaecf1;
		border-radius: 5px;

		&:hover {
			cursor: pointer;
			background: #dadbe0;
		}
	}

	.head {
		padding: 24px;

		.first {
			display: flex;
			margin-bottom: 1rem;

			.title {
				display: flex;
				justify-content: space-between;

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

				.left {
					display: flex;
				}
			}

			.avatar {
				margin-right: 12px;
			}

			.tip {
				margin: 0.4rem 0 0.9rem 0;
			}

			div {
				&:first-child {
					.content {
						margin-bottom: 1rem;
					}
				}
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

				&:nth-child(2) {
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

			//&:nth-child(4) {
			//  &:hover {
			//    cursor: pointer;
			//  }
			//}
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

	.score {
		height: 22px;
		margin-left: 1rem;

		display: flex;
		align-items: center;

		svg {
			width: 24px;
			height: 24px;
			margin-right: 0.3rem;
			color: #e6a23c;
		}

		span {
			font-size: 21px;
			color: #e6a23c;
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
