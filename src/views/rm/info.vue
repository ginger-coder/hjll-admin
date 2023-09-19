<template>
	<div style="height: 100%" class="formPage" ref="rmInfo">
		<div class="header_box disp_flex ju_bet ali_cen">
			<div>
				<div class="title">{{ title }}</div>
			</div>
			<div class="back_box"><el-button v-hold-click type="" @click="back">返回</el-button></div>
		</div>
		<div class="form_box scrllbar">
			<el-form  label-width="250px">
				<span  v-for="(item,index) in tableKey" :key="index">
					<template v-if="item.isFirst">
						<el-divider v-if="item.isDivider"></el-divider>
						<el-form-item :label="item.firstName" class="f18"></el-form-item>
						<el-form-item label=" "></el-form-item>
						<el-form-item label=" "></el-form-item>
					</template>
					<el-form-item v-if="item.moduleType=='zz'" :label="item.label+'：'">
						<span v-if="item.type=='select'">{{ label(item.prop,info.siteInfoVO[item.prop] ) }}</span>
						<span v-else-if="item.type=='time'">{{ timeFilter(info.siteInfoVO[item.prop]) || '-' }}</span>
						<span v-else>{{ info.siteInfoVO[item.prop] || '-' }}</span>
					</el-form-item>
					<el-form-item v-else :label="item.label+'：'">
						<span v-if="item.type=='select'">{{ label(item.prop,info[item.prop] ) }}</span>
						<span v-else-if="item.type=='time'">{{ timeFilter(info[item.prop]) || '-' }}</span>
						<span v-else>{{ info[item.prop] || '-' }}</span>
					</el-form-item>
				</span>
			</el-form>
		</div>
	</div>
</template>
<script>
import basic from "@/mixins/basic";
import { zz, tt, jf} from "@/api/device";

import areaSelect from "@/components/custom/areaSelect";

import { parseTime, deepClone } from "@/utils";
import { orderTypes, orderStatus, orderPayStatus, createWay, orderUrgency } from "@/utils/dict";
import { zzTable, ttTable ,jfTable,getLabel,selectKey } from "@/utils/rmTableKey";
export default {
	components: {
		areaSelect,
	},
	data() {
		return {
			title: "详情",
			id: "",
			module: "",
			pageFun:null,

			tableKey:[],

			info:{}

		};
	},
	mixins: [basic],
	created() {
		var that = this
		const { id,module } = this.$route.query;
		this.id = id;
		this.module = module;
		switch (module) {
			case 'zz':
				this.title = '站址详情'
				that.tableKey = zzTable.filter(item=>item.isInfo)
				that.pageFun = zz
				break;
			case 'tt':
				this.title = '铁塔详情'
				that.tableKey = ttTable.filter(item=>item.isInfo)
				that.pageFun = tt
				break;
				case 'jf':
					this.title = '机房详情'
					that.tableKey = jfTable.filter(item=>item.isInfo)
					that.pageFun = jf
				break;
		}
		if (id) {
			this.loader_info();
		}
	},
	mounted() {
		let that = this;

		// that.$nextTick(() => {
		// 	that.$refs.rmInfo.scrollTop = 0;
		// });
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
					that.info = _data
					that.info.siteInfoVO = _data.siteInfoVO || {}
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
	}
}
</style>
