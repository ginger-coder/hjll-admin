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
		<el-form ref="form" :model="form" :rules="rules" label-width="130px">
			<el-form-item label="姓名：" prop="nickName">
				<el-input v-model="form.nickName" disabled></el-input>
			</el-form-item>
			<el-form-item label="选择工作地区：" prop="keyword">
			<!--          <el-select-->
			<!--              v-model="form.region"-->
			<!--              placeholder="请选择工作地区"-->
			<!--              style="width: 100%"-->
			<!--          >-->
			<!--            <el-option-->
			<!--                v-for="item in options"-->
			<!--                :key="item.value"-->
			<!--                :label="item.label"-->
			<!--                :value="item.value"-->
			<!--            />-->
			<!--          </el-select>-->
			<area-select style="width: 100%" @change="changeArea($event)"
				:value="[form.province, form.city, form.area]"></area-select>

			</el-form-item>
			<el-form-item label="选择角色：" prop="role">
			<el-select v-model="form.role" multiple placeholder="请选择角色(多选)" style="width: 100%">
				<el-option v-for="item in roleOp" :key="item.id" :label="item.name" :value="item.id" />
			</el-select>
			</el-form-item>
			<el-form-item label="选择技能：" prop="skill">
			<el-select v-model="form.skill" multiple placeholder="请选择(多选)" style="width: 100%">
				<el-option v-for="item in skillOp" :key="item.id" :label="item.name" :value="item.id" />
			</el-select>
			</el-form-item>
			<el-form-item label="技能相关证书：" prop="keyword">
				<template v-for="(item, idx) in (form.cert || [])">
					<el-select v-model="form.cert[idx].key" placeholder="请选择" style="width: 100%" clearable>
						<el-option v-for="item in certOp" :key="item.value" :disabled="form.cert.some(t=>t.key===item.value)" :label="item.label" :value="item.value" >
						</el-option>
					</el-select>
					<!-- certificateDTOList -->
					<upload-files 
						:key="'certUrl'+idx" 
						:ref="'certUrl'+idx" 
						upload-accept="image/png,image/jpg,.pdf" 
						:maxSize="'10240'" 
						@success="to_set_cert_pics($event, idx)" 
						:value="form.cert[idx].value"
						style="margin-top: 0.6rem">
					</upload-files>
					<div class="disp_flex ali_cen">
						<div class="tips el-info">支持扩展名：.pdf .jpg .png</div>
						<div v-if="idx > 0" class="btn-remove" @click="form.cert.splice(idx, 1)">删除</div>
					</div>
				</template>
				<div v-hold-click class="cert-add" @click="addCrt">继续添加证书</div>
			</el-form-item>
			<el-form-item label="合同扫描件：" prop="contract">
			<upload-files key="contract" ref="upload1" upload-accept="image/png,image/jpg,.pdf" :max="1" :maxSize="'1024'"
				@success="to_set_pics($event, 'contract')"></upload-files>
			<div class="disp_flex ali_cen">
				<div class="tips el-info">支持扩展名：.pdf .jpg .png</div>
			</div>
			</el-form-item>
			<el-form-item label=" " style="margin-top: 40px">
			<el-button v-hold-click @click="" style="min-width: 180px" @click="$router.go(-1)">取消</el-button>
			<el-button v-hold-click type="primary" @click="submit" style="min-width: 180px">{{
			`${form.sign}` == '1' ? '保存' : '签约'
			}}
			</el-button>
			<div style="height: 60px"></div>
			</el-form-item>
		</el-form>
		</div>
		<div class="footer"></div>
	</div>
	</template>
	<script>
	import basic from "@/mixins/basic";

	import uploadPics from "@/components/custom/uploadPics";
	import uploadFiles from "@/components/custom/uploadFile";
	import { getUmsInfo, saveSign, update } from "@/api/ompSign";
	import * as role from "@/api/workRole";
	import * as skill from "@/api/workSkill";
	import AreaSelect from "@/components/custom/areaSelect";
	import { workOrder } from "@/api/order";

	export default {
	components: {
		AreaSelect,
		uploadPics,
		uploadFiles,
	},
	data() {
		return {
		id: '',
		moduleTitle: "账号",
		apiKey: "adminId",

		title: "",
		titleTips: "",
		form: {
			skill: [],
			role: [],
			contract: undefined,
			cert: [
			],
			skillCertificate: []
		},
		rules: {},
		roleOp: [],
		skillOp: [],
		certOp: [
			{value:1, label:'电工证'},
			{value:2, label:'高压操作证'},
		]
		};
	},
	mixins: [basic],
	async created() {
		var that = this
		const { id } = this.$route.query;
		this.id = id;
		this.title = `${this.form.status}` === '1' ? '修改签约' : '线下签约';
		await role.page(null, { current: 1, size: 999 }).then(t => {
			this.roleOp = t.data.records;
		});
		await skill.page(null, { current: 1, size: 999 }).then(t => {
			this.skillOp = t.data.records;
		});

		if (`${id}`.length > 0 && id) {

		let _form = new FormData()
		_form.append('userId', id)
		let _data = await getUmsInfo(_form);
		this.form = _data.umsMember
		
		if (_data.umsMember.certificate) {
			that.$set(this.form,'cert',JSON.parse(_data.umsMember.certificate) || [{ id: '', url: '' }])
		}else{
			that.$set(this.form,'cert',[{ key: '', value: '' }])
		}
		

		that.form.role = []
		that.form.skill = []
		_data.roleInfoList.map(i => {
			that.form.role.push(Number.parseInt(Object.keys(i)[0]))
		});
		_data.skillInfoList.map(i => {
			that.form.skill.push(Number.parseInt(Object.keys(i)[0]))
		});

		}
	},
	methods: {
		back() {
			this.$router.go(-1);
		},
		changeArea({ province, city, area }) {
			this.form.province = province;
			this.form.city = city;
			this.form.area = area;
		},
		to_set_pics(files, key) {
			this.form[key] = files.map(item => { return item.response.data })[0];
		},
		to_set_cert_pics(files,index) {
			var that = this
			console.log(files);
			
			let url =  files.map(item => {
				if (item.response && item.response.data ) {
					return item.response.data
				}else{
					return item
				}
			});
			that.$set(this.form.cert[index],'value',url)
			console.log(this.form.cert);
			
		},
		addCrt:function(){
			var that = this
			
			that.$set(that.form.cert,[that.form.cert.length],{ id: '', url: '' })
		},
		submit() {
			this.$refs["form"].validate(async (valid) => {
				if (valid) {
				this.loading = true;
				// if (`${this.form.status}` === '1') {
				//   const code = await update({...this.form, status: 1});
				//   if (code ==  0) {
				//     this.$message({
				//       type: "success",
				//       message: "保存成功",
				//     });
				//   }
				// } else {
				//   const code = await create({...this.form, status: 1});
				//   if (code ==  0) {
				//     this.$message({
				//       type: "success",
				//       message: "签约成功",
				//     });
				//   }
				// }

				let certificateDTOList = this.form.cert.map(item=>{
					if (item.key) {
						return {
							key:item.key,
							value:item.value
						}
					}else{
						this.$message({
							message: '请选择相关技能证书',
							type: 'warning'
						})
						return 
					}
				})
				console.log('11');
				
				let _json = {
					userId: this.form.id, // 用户id
					roleList: this.form.role, // 角色集合
					skillList: this.form.skill, // 技能集合
					provinceCode: this.form.province, // 所属省
					cityCode: this.form.city, // 所属市
					areaCode: this.form.area, // 所属区县
					contract: this.form.contract, // 合同扫描件
					sign: 1,
					certificateDTOList,
				}
				saveSign(_json).then(code => {
					if (code ==  0) {
					this.$message({
						type: "success",
						message: "操作成功",
					});
					}
				}).finally(() => {
					this.loading = false;
					this.back();
				})
				}
			})
		}
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

	.back_box {}
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
		background-image: linear-gradient(to right, #d1d2d9 0%, #d1d2d9 50%, transparent 0%);
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

	.ali_cen {
		display: flex;
		justify-content: space-between;

		.btn {
		&-remove {
			justify-content: center;
			display: flex;
			align-items: center;
			background: #4993f7;
			border-radius: 4px;
			color: white;
			width: 45px;
			height: 22px;
			text-align: center;
			margin-left: .3rem;
			font-size: 13px;

			&:hover {
			cursor: pointer;
			}
		}
		}
	}
	}

	.footer {
	height: 80px;
	}
	</style>
