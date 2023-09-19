<template>
	<div class="formPage" ref="rmInfo">
	<Anchor :list="list"/>
		<div class="header_box disp_flex ju_bet ali_cen">
			<div>
				<div class="title">{{ title }}</div>
			</div>
			<div class="back_box"><el-button v-hold-click type="" @click="back">返回</el-button></div>
		</div>
		<div class="form_box scrllbar">
			<el-form  label-width="250px">
				<template v-for="item in zzTable">
					<template v-if="item.isFirst">
						<el-divider v-if="item.isDivider"></el-divider>
						<el-form-item :label="item.firstName" class="f18"></el-form-item>
						<el-form-item label=" "></el-form-item>
						<el-form-item label=" "></el-form-item>
					</template>
					<el-form-item :label="item.label+'：'">
						<span v-if="item.type=='select'">{{ label(item.prop,zzInfo[item.prop] ) }}</span>
						<span v-else-if="item.type=='time'">{{ timeFilter(zzInfo[item.prop]) || '-' }}</span>
						<span v-else>{{ zzInfo[item.prop] || '-' }}</span>
					</el-form-item>
				</template>
				<div style="height:40px"></div>
				<el-form-item  label="关联铁塔信息" class="f18"></el-form-item>
				<template v-if="ttInfo && ttInfo.length">
					<template v-for="(tt,ttindex) in ttInfo">
						<el-collapse v-model="ttActive[ttindex]" >
							<el-collapse-item :name="'tt'+ttindex" >
								<template slot="title">
									<el-form-item label="铁塔名称："  class="nameForm">
										{{ tt.towerName }}
									</el-form-item>
									<i class="header-icon el-icon-zzInfo"></i>
								</template>
									<template v-for="(item,index) in ttTable">
										<el-form-item :label="item.label+'：'" :key="'ttItem'+ttindex+index">
											<span v-if="item.type=='select'">{{ label(item.prop,tt[item.prop] ) }}</span>
											<span v-else-if="item.type=='time'">{{ timeFilter(tt[item.prop]) || '-' }}</span>
											<span v-else>{{ tt[item.prop] || '-' }}</span>
										</el-form-item>
									</template>
								</el-collapse-item>
						</el-collapse>
					</template>
				</template>
				<div v-else class="f18 el-info" style="text-align:center">暂无关联数据</div>
				<div style="height:40px"></div>				
				<el-form-item   label="关联机房信息" class="f18"></el-form-item>
				<template v-if="jfInfo && jfInfo.length">
					<template v-for="(jf,jfindex) in jfInfo">
						<el-collapse v-model="jfActive[jfindex]" >
							<el-collapse-item :name="'jf'+jfindex" >
								<template slot="title">
									<el-form-item label="机房名称：" class="nameForm">
										{{ jf.machineName }}
									</el-form-item>
									<i class=" el-icon-zzInfo"></i>
								</template>
									<template v-for="(item,index) in jfTable">
										<el-form-item :label="item.label+'：'" :key="'jfItem'+jfindex+index">
											<span v-if="item.type=='select'">{{ label(item.prop,jf[item.prop] ) }}</span>
											<span v-else-if="item.type=='time'">{{ timeFilter(jf[item.prop]) || '-' }}</span>
											<span v-else>{{ jf[item.prop] || '-' }}</span>
										</el-form-item>
									</template>
								</el-collapse-item>
						</el-collapse>
					</template>
				</template>
				<div v-else class="f18 el-info" style="text-align:center">暂无关联数据</div>
			</el-form>
		</div>
	</div>
</template>
<script>
import basic from "@/mixins/basic";
import { zz, tt, jf} from "@/api/device";

import areaSelect from "@/components/custom/areaSelect";
import Anchor from './components/anchor'

import { parseTime, deepClone } from "@/utils";
import { orderTypes, orderStatus, orderPayStatus, createWay, orderUrgency } from "@/utils/dict";
import { zzTable, ttTable ,jfTable,getLabel,selectKey } from "@/utils/rmTableKey";
export default {
	components: {
		areaSelect,
		Anchor,
	},
	data() {
		return {
			title: "详情",
			id: "",
			pageFun:null,
			zzTable:[],
			ttTable:[],
			jfTable:[],

			ttActive:[],
			jfActive:[],

			zzInfo:{},
			ttInfo:[],
			jfInfo:[],

		};
	},
	mixins: [basic],
	created() {
		var that = this
		const { id } = this.$route.query;
		this.id = id;

		this.title = '站址详情'
		that.zzTable = zzTable.filter(item=>item.isZz && item.isInfo)
		that.ttTable = zzTable.filter(item=>item.isTt && item.isInfo)
		that.jfTable = zzTable.filter(item=>item.isJf && item.isInfo)
		that.pageFun = zz

		if (id) {
			this.loader_info();
		}
	},
	mounted() {
		let that = this;

		that.$nextTick(() => {
			that.$refs.rmInfo.scrollTop = 0;
		});
		that.initer();
	},
	methods: {
		initer: function () {
			let that = this;
		},
		label(list, value) {
			var that = this
			return getLabel(selectKey[list], value)
		},
		back() {
			this.$router.go(-1);
		},
		loader_info: function () {
			let that = this;
			console.log(that.id);
			that.pageFun({ method: "get", name: "detail" }, { id: that.id })
				.then((res) => {
					let _data = res.data || {}
					that.zzInfo = _data
					that.ttInfo = _data.towerInfoVOList || []
					that.jfInfo = _data.machineRoomInfoVOList || []
				})
				.catch((error) => {});
		},
		timeFilter(time){
			return parseTime(new Date(time).getTime(), "{y}-{m}-{d} {h}:{i}:{s}") || "-";
		},
	},
};
</script>
<style lang="scss">
.feedbackDrawerBox {
	.el-drawer__body {
		padding: 20px;
	}
}
</style>
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
}
.header_box {
	background: #ffffff;
	margin: -20px;
	padding: 20px;
	.title {
		font-size: 16px;
		font-weight: 500;
		margin-bottom: 10px;
	}
	.back_box {
	}
}
.form_box{
	margin-top: 40px;
	padding:20px;
	background: #ffffff;
	.el-form-item{
		width: 33.3%;
		min-width: 360px;
		display: inline-block;
		vertical-align: top;
	}
	::v-deep{
		.f18{
			.el-form-item__label{
				font-size: 18px;
			}
		}
		.el-collapse{
			border-top: unset;
			border-bottom: unset;
		}
		.el-collapse-item:last-child{
			margin-bottom: unset;
		}
	}
	.nameForm{
		&.el-form-item{
			width: 100%;
			margin-bottom:unset
		}
	}
}
</style>
