<template>
	<div style="height: 100%">
		<div v-loading="loading" class="formPage" ref="gzCreate">
			<div class="header_box disp_flex ju_bet ali_cen">
				<div>
					<div class="title">{{ title }}</div>
				</div>
				<div class="back_box"><el-button v-hold-click type="" @click="back">返回</el-button></div>
			</div>
			<div class="form_box scrllbar">
				<el-form ref="form" :model="form" :rules="rules" label-width="130px">
					<el-form-item label="故障名称：" prop="faultName">
						<el-input v-model="form.faultName" placeholder="请输入"></el-input>
					</el-form-item>
					<el-form-item label="故障类型：" prop="faultType">
						<el-select v-model="form.faultType" >
							<el-option v-for="item in gzTypeLists" :key="'state' + item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="设备类型：" prop="deviceTypeId" >
						<el-select v-model="form.deviceTypeId" @change="change_deviceType">
							<el-option v-for="item in sbTypeLists" :key="'state' + item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="设备：" prop="deviceId">
						<el-select v-model="form.deviceId" >
							<el-option v-for="item in sblists" :key="'state' + item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="备注：" prop="remark">
						<el-input type="textarea" :rows="3" placeholder="请输入备注" v-model="form.remark"> </el-input>
					</el-form-item>
					<el-form-item label=" " style="margin-top: 40px">
						<el-button v-hold-click type="primary" @click="submitForm">保存</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>
<script>
import basic from "@/mixins/basic";
import { gz } from "@/api/maintain";
import {} from "@/utils/dict";
import { deepClone,priceInput } from "@/utils";
import { device} from "@/api/device";

import store from "@/store";
export default {
	components: {
	},
	data() {
		return {
			title: "",
			loading: false,
			id:'',

			form: {},

			rules: {
				faultName:[{required:true,message:'请输入',trigger:"blur"}],
				faultType:[{required:true,message:'请选择',trigger:"change",type:'number'}],
				deviceTypeId:[{required:true,message:'请选择',trigger:"change",type:'number'}],
				deviceId:[{required:true,message:'请选择',trigger:"change",type:'number'}],
			},
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
	created() {
		let _query = this.$route.query;
		if (_query.id) {
			this.id = _query.id
			this.title = "编辑故障名称";
			this.loader_info()
		} else {
			this.title = "创建故障名称";
		}
	},
	mounted() {
		let that = this;
		that.$nextTick(() => {
			that.$refs.gzCreate.scrollTop = 0;
		});
		that.initer();
	},
	methods: {
		back() {
			this.$router.go(-1);
		},
		initer: function () {
			let that = this;
			that.loader_sbTypesLists();
		},
		loader_info: function () {
			let that = this;
			gz({ method: "get", name: "detail" }, { id: that.id })
				.then((res) => {
					if (res.data && res.data.deviceTypeId!=null) {
						that.loader_sbLists(res.data.deviceTypeId,function () {
							that.$nextTick(()=>{
								that.form = res.data
							})
						})
					}
				})
				.catch((error) => {});
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
		change_deviceType:function(val){
			var that = this
			that.$set(that.form,'deviceId','')
			that.sblists = []
			if (val) {
				that.loader_sbLists(val)
			}
		},
		// 设备
		loader_sbLists: function (deviceTypeId,next) {
			let that = this;

			device({ method: "get", name: "page" }, { current: 1, size: 3000,url:'device-info' ,deviceTypeId:deviceTypeId})
				.then((res) => {
					let _list = [];
					res.data.records.map((item) => {
						_list.push({
							label: item.deviceName,
							value: item.id,
						});
					});
					that.sblists = _list;
					next && next()
				})
				.catch((error) => {});
		},
		submitForm: function () {
			let that = this;
			that.$refs.form.validate((valid) => {
				if (valid) {
					var _post = deepClone(that.form);
					var json = {
						method:'post',
						name: that.id ? 'update' : 'save'
					}
					
					gz(json, {}, _post).then((res) => {
						that.$message({
							type: "success",
							message: res.msg,
						});
						that.back();
					});
				}
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
.form_box {
	background-color: #ffffff;
	margin-top: 40px;
	border-radius: 4px;
	.el-form {
		width: 50%;
		min-width: 450px;
		min-height: 800px;
		margin: 0 auto;
		padding-top: 40px;
	}
}
</style>
