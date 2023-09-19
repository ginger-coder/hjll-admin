<template>
	<div style="height: 100%">
		<div v-loading="loading" class="formPage" ref="gzCreate">
			<div class="header_box disp_flex ju_bet ali_cen">
				<div>
					<div class="title">{{ title }}</div>
				</div>
				<!-- <div class="back_box"><el-button v-hold-click type="" @click="back">返回</el-button></div> -->
			</div>
			<div class="form_box scrllbar">
				<el-form ref="form" :model="form" :rules="rules" label-width="130px">
					<el-form-item label="角色名称：" prop="name">
						<el-input v-model="form.name" placeholder="请输入" :disabled="disabled"></el-input>
					</el-form-item>
					<el-form-item label="角色代号：" prop="code">
						<el-input v-model="form.code" placeholder="请输入" :disabled="disabled" onkeyup="value=value.replace(/[^0-9.]/g,'')"></el-input>
					</el-form-item>
					<el-form-item label="工单类型：" prop="orderReqList">
						<treeNode :menuData="orderTypeData" v-model="form.orderReqList" @getDataList="getDataList"></treeNode>
					</el-form-item>
					<!-- <el-form-item label="备注（可选）：" prop="remark">
						<el-input type="textarea" :rows="3" placeholder="请输入备注" v-model="form.remark"> </el-input>
					</el-form-item> -->
					<el-form-item label=" " style="margin-top: 40px">
						<el-button v-hold-click type="primary" @click="submitForm">提交</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>
<script>
import basic from "@/mixins/basic";
import { gz } from "@/api/maintain";
import { } from "@/utils/dict";
import { deepClone, priceInput } from "@/utils";
import { saverole,updaterole,rolecode } from '@/api/createskill'
import {detail} from "@/api/workRole";
import {workOrderType} from '@/api/order'
import treeNode from "@c/treeNode";
import store from "@/store";
export default {
	components: {
		treeNode
	},
	data() {
		return {
			title: "创建角色",
			loading: false,
			id: '',

			form: {
				name: '',
				code: '',
				orderReqList:[],
				echoDataList:[]
			},

			rules: {
				name: [{ required: true, message: '请输入', trigger: "blur" }],
				code: [{ required: true, validator: this.validateCode, trigger: "blur" }],
				orderReqList: [{ required: true,  message: '请选择工单类型', trigger: "blur " }],
			},
			orderTypeData:[],
			disabled:false
		};
	},
	mixins: [basic],
	created() {
		// let _query = this.$route.query;
		// if (_query.id) {
		// 	this.id = _query.id
		// 	this.title = "编辑角色";
		// 	this.loader_info()
		// } else {
		// 	this.title = "创建角色";
		// }
		if (this.$route.query.allData) {
			this.updata()
			this.disabled=true;
		}else{
			this.getAllOrderType();
			this.disabled=false;
		}
	},
	mounted() {
		let that = this;
		that.$nextTick(() => {
			that.$refs.gzCreate.scrollTop = 0;
		});
	},
	methods: {
		back() {
			this.$router.go(-1);
		},
		getAllOrderType(){
			workOrderType({method: "get", name: "getAllOrderType"})
				.then((res) => {
					let data = res?.data;
					this.orderTypeData=this.treeDataFun(data);
				})
				.catch((error) => {
			});
		},
		treeDataFun(data) {
          let arr = []
          data.forEach(item=>{
			if(item.children){
                arr.push({
                    code: item.code,
                    name: item.name,
                    parentCode: item.parentCode,
                    children: this.treeDataFun(item.children),
                    checked:false,

                })
            }else{
                arr.push({
					code: item.code,
                    name: item.name,
                    parentCode: item.parentCode,
                    checked:false,
                })
            }
               
          })
          return arr;
      	},
		async updata() {
			if (this.$route.query.allData) {
				let formObj = decodeURIComponent(this.$route.query.allData)
				var editdata = JSON.parse(formObj)
				this.title = "编辑角色";
				this.form.id = editdata.id
				this.form.code = editdata.code
				this.form.name = editdata.name
				this.form['id'] = editdata.id
    			const {code, data} = await detail({id:this.form['id']});
				this.orderTypeData=data.echoDataList
				if(this.orderTypeData==null){
					this.getAllOrderType();
				}else{
					this.getDataList(this.orderTypeData)
				}

			}
		},
		getDataList(data){
			setTimeout(() => {
				this.$refs.form.clearValidate(['orderReqList'])
			}, 30);
			let Array=[];
			data.forEach(function(item1){
				if(item1.children){
					item1.children.forEach(function(item2){
						if(item2.children){
							item2.children.forEach(function(item3){
								if(item3.checked){
									if(item1.indeterminate==false&&item1.checked==true){
										Array.push({'firstOrderType':item1.code,'secondOrderType':item2.code,'thirdOrderType':item3.code})
									}else{
										if((item2.indeterminate==true&&item2.checked==true)||(!item2.indeterminate&&item2.checked==true)){
											Array.push({'firstOrderType':null,'secondOrderType':item2.code,'thirdOrderType':item3.code})
										}else{
											Array.push({'firstOrderType':null,'secondOrderType':null,'thirdOrderType':item3.code})
										}
									}
								}
							})
						}else{
							if(item1.indeterminate==false&&item1.checked==true){
								Array.push({'firstOrderType':item1.code,'secondOrderType':item2.code,'thirdOrderType':null})
							}else{
								if(item2.indeterminate==false&&item2.checked==true){
									Array.push({'firstOrderType':null,'secondOrderType':item2.code,'thirdOrderType':null})
								}
							}
						}
					})
				}
			})
			this.form.orderReqList=Array;
			this.form.echoDataList=data;
		},
		submitForm: function () {
			let that = this;
			that.$refs.form.validate(async (valid) => {
				if (valid) {
					if (this.form.id) {
					try {
							const data = await updaterole(this.form)
						} catch (error) {

						}
					} else {
							try {
							const data = await saverole(this.form)
						} catch (error) {

						}
					}
					this.back()

					// var _post = deepClone(that.form);
					// var json = {
					// 	method:'post',
					// 	name: that.id ? 'update' : 'save'
					// }

					// gz(json, {}, _post).then((res) => {
					// 	that.$message({
					// 		type: "success",
					// 		message: res.msg,
					// 	});
					// 	that.back();
					// });
				}
			});
		},
		async validateCode(rule, value, callback) {
			if (value === '' || value === undefined) {
				callback(new Error('请输入技能代号'))
			} else {
				if(!this.form.id){
					try {
						await rolecode({code:this.form.code});
						} catch (e) {
						// callback()
						callback(new Error('系统中存在此代号'));
					}
					// callback()
				}
				
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
}

.header_box {
	background: #ffffff;
	margin: -20px;
	padding: 20px;

	.title {
		// font-size: 16px;
		// font-weight: 500;
		margin-bottom: 10px;
	}

	.back_box {}
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
