<template>
	<div style="height: 100%" class="formPage" ref="rmInfo">
	  <div class="header_box disp_flex ju_bet ali_cen">
		<div>
		  <div class="title">{{ title }}</div>
		</div>
		<div class="back_box">
		  <el-button v-hold-click type="primary" @click="save">保存</el-button>
		  <el-button v-hold-click type="" @click="back">返回</el-button>
		</div>
  
	  </div>
	  <div class="form_box scrllbar">
		<el-form label-width="250px" :rules="rules" ref="form" :model="form">
		  <template>
			<span  v-for="(item,index) in tableKey" :key="index">
				<template v-if="item.isFirst" >
				<el-divider v-if="item.isDivider"></el-divider>
				<el-form-item :label="item.firstName" class="f18"></el-form-item>
				<el-form-item label=" "></el-form-item>
				<el-form-item label=" "></el-form-item>
				</template>
				<el-form-item v-if="item.type=='areaSelect'" :label="item.label+'：'" :prop="item['prop']">
				<area-select style="width: 100%" @change="changeArea($event)"
							:class="title=='编辑' + module_title?'placeholdertype':null"
							:placeholder="placeholder"
							:value="[form.province, form.city, form.county]"></area-select>
				</el-form-item>
				<el-form-item v-else-if="item.type=='select'" :label="item.label+'：'" :prop="item['prop']">
				<el-select v-model="form[item['prop']]" filterable :placeholder="item['placeholder']">
					<el-option v-for="(t,i) in selectKey[item['prop']]" :key="i" :label="t.label" :value="t.value"></el-option>
				</el-select>
				</el-form-item>
				<el-form-item v-else-if="item.type=='siteSelect'" :label="item.label+'：'" :prop="item['prop']">
				<el-select v-model="form[item['prop']]" filterable ref="select" :loading="loading">
					<el-option created v-for="t in zzLists" :label="t.label" :value="t.value" :key="'t'+t.value"></el-option>
				</el-select>
				</el-form-item>
				<el-form-item v-else-if="item.type=='time'" :label="item.label+'：'" :prop="item['prop']">
				<el-date-picker
					v-model="form[item['prop']]"
					type="date"
					value-format="yyyy-MM-dd"
					placeholder="选择日期时间">
				</el-date-picker>
				</el-form-item>
				<el-form-item v-else-if="item.type=='timeRange'" :label="item.label+'：'" :prop="item['prop']">
				<el-time-picker
					is-range
					value-format="HH:mm:ss"
					v-model="form[item['prop']]"
					range-separator="至"
					start-placeholder="开始时间"
					end-placeholder="结束时间"
					placeholder="选择时间范围">
				</el-time-picker>
				</el-form-item>
				<el-form-item v-else :label="item.label+'：'" :prop="item['prop']">
				<el-input v-model="form[item['prop']]" placeholder="请输入"></el-input>
				</el-form-item>
				<!-- <span v-if="module_title=='机房'">
					<el-divider v-if="item.isDivider"></el-divider>
					<el-form-item :label="item.firstName" class="f18"></el-form-item>
					<el-form-item v-if="item.moduleType=='zz'" :label="item.label+'：'">
						<span v-if="item.type=='select'">{{ label(item.prop,form.siteInfoVO[item.prop] ) }}</span>
						<span v-else-if="item.type=='time'">{{ timeFilter(form.siteInfoVO[item.prop]) || '-' }}</span>
						<span v-else>{{ form.siteInfoVO[item.prop] || '-' }}</span>
					</el-form-item>
				</span> -->
			</span>
			<!-- <span  v-for="(item,index) in tableKey" :key="index">
				<el-form-item :label="item.firstName" class="f18"></el-form-item>
			</span> -->
		  </template>
		</el-form>
	  </div>
	</div>
  </template>
  <script>
  import basic from "@/mixins/basic";
  import {zz, tt, jf} from "@/api/device";
  
  import areaSelect from "@/components/custom/areaSelect";
  
  import {parseTime, deepClone} from "@/utils";
  import {orderTypes, orderStatus, orderPayStatus, createWay, orderUrgency} from "@/utils/dict";
  import {zzTable, ttTable, jfTable, getLabel, selectKey} from "@/utils/rmTableKey";
  
  export default {
	components: {
	  areaSelect,
	},
	data() {
	  return {
		title: "",
		module: '',
		module_title: "",
		id: "",
		pageFun: null,
		placeholder:'',
		tableKey: [],
		selectKey: selectKey,
		siteInfoVO:[],
		zzLists: [],
		loading: false,
		pageNo: 1,
		noMore: false,
		pageSize:10,
		form: {
		  	siteId: undefined
		},
		rules: {
		  lng: [
            { required: true, message: '请输入经度', trigger: 'blur' }
          ],
          lat: [
            { required: true, message: '请输入纬度', trigger: 'blur' }
          ],
		  siteId: [
			{required: true, type: 'number', message: '请选择所属基站', trigger: 'blur'}
		  ]
		},
	  };
	},
	mixins: [basic],
	created() {
	  var that = this
	  const {id, module} = this.$route.query;
	  this.id = id;
	  this.module = module;
	  switch (module) {
		case 'zz':
		  this.module_title = '站址'
		  that.tableKey = zzTable.filter(item => {
			return item.isCreate && item.isZz
		  })
		  that.pageFun = zz
		  break;
		case 'tt':
		  this.module_title = '铁塔'
		  that.tableKey = ttTable.filter(item => {
			return item.isCreate
		  })
		  that.pageFun = tt
		  break;
		case 'jf':
		  this.module_title = '机房'
		  that.tableKey = jfTable.filter(item => {
			return item.isCreate
		  })
		  that.pageFun = jf
		  break;
	  }
	  that.title = '新增' + that.module_title
	  that.placeholder = '请选择区域'
	  that.loader_site(this.form)
	  if (id) {
		that.title = '编辑' + that.module_title
		this.loader_info();
	  }
	},
	mounted() {
	  let that = this;
	  that.$nextTick(() => {
		if(that.$refs.select){
			that.$refs.select[0].$refs.scrollbar.$refs.wrap.addEventListener('scroll',this.scolling)
			that.$refs.rmInfo.scrollTop = 0;
		}
	  });
	  that.initer();
	},
	methods: {
		scolling(){
			let that = this
			let e = that.$refs.select[0].$refs.scrollbar.$refs.wrap
			let loadMore = e.scrollHeight -  e.scrollTop <=  e.clientHeight
			if(loadMore){
				that.loader_site(this.form)
			}
		},
	  initer: function () {
		let that = this;
	  },
	  label(list, value) {
		var that = this
		return getLabel(selectKey[list], value)
	  },
	  // 站址
	 loader_site: function (data, next) {
		var that = this
		let {pageNo,pageSize} = this
		zz({method: "get", name: "page"}, {
		  current: pageNo,
		  size: pageSize,
		  province: data.province,
		  city: data.city,
		  county: data.county
		})
			.then((res) => {
			//   let _list = [];
			  if(pageNo === res.data.total){
			  // 获取到最后的值时，不再监听滚动条的动作，移除滚动事件
			  	that.$nextTick(() => {
					that.$refs.select[0].$refs.scrollbar.$refs.wrap.removeEventListener('scroll',this.scolling())
				});
			    this.noMore = true
			  }
	          this.pageNo++
			  res.data.records.map((item) => {
				that.zzLists.push({
				  label: item.name,
				  value: item.id,
				});
			  })
	        //   _list.push(res.data.records)
			//   that.zzLists = _list;
			  next && next()
  
			})
			.catch((error) => {
			});
	  },
	  changeArea({province, city, area}) {
		var that = this
		this.form.siteId = ''
  
		this.form.province = province;
		this.form.city = city;
		this.form.county = area;
		if (!province) {
		  that.zzLists = []
		  that.jfLists = []
		} else {
		  that.loader_site(this.form)
		}
	  },
	  back() {
		this.$router.go(-1);
	  },
	  loader_info: function () {
		let that = this;
		console.log(that.id);
		that.pageFun({method: "get", name: "detail"}, {id: that.id})
			.then((res) => {
			  let _data = res.data || {};
			  that.loader_site(_data, (() => {
				that.$nextTick(() => {
				  if (_data.nightExemption) {
					_data.nightExemption = _data.nightExemption.split("~")
				  }
				  if(_data.siteInfoVO){
					that.siteInfoVO = _data.siteInfoVO
					delete that.siteInfoVO.id
					let newObj = Object.assign(_data, that.siteInfoVO)
					that.form = newObj
				  }else{
					that.form = _data
				  }
				  that.placeholder =  that.form.provinceName+'/'+that.form.cityName+'/'+ that.form.countyName
				// that.form = _data
				//   that.placeholder =  that.form.provinceName+'/'+that.form.cityName+'/'+ that.form.countyName
				//   that.siteInfoVO = _data.siteInfoVO
				})
			  }));
			})
			.catch((error) => {
			});
	  },
	  timeFilter(time) {
		return parseTime(new Date(time).getTime(), "{y}-{m}-{d} {h}:{i}:{s}") || "-";
	  },
	  save: function () {
		var that = this
		that.$refs["form"].validate((valid) => {
  
		  if (valid) { 
			var _post = deepClone(that.form)
			// if(_post.lng && _post.lat){
				if (Array.isArray(_post.nightExemption) && _post.nightExemption.length == 2) {
			  		_post.nightExemption = _post.nightExemption[0] + '~' + _post.nightExemption[1]
				}
				var json = {method: "post", name: "save"}
				if (that.id) {
				json.name = 'update'
				}
				that.pageFun(json, {}, _post).then((res) => {
				that.$message({
					type: "success",
					message: res.msg,
				});
				that.back();
				});
			// }else{
			// 	that.$message.warning('经纬度为必填信息！请输入经纬度！')
			// }
			
		  }
		})
  
	  },
	},
  };
  </script>
  <style lang="scss">
  .placeholdertype input::-webkit-input-placeholder{
	color: #333 !important;
  }
  .placeholdertype input::placeholder{
	color: #333 !important;
  }
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
  
  .form_box {
	margin-top: 40px;
	padding: 20px;
	background: #ffffff;
  
	.el-form-item {
	  width: 33.3%;
	  min-width: 360px;
	  display: inline-block;
	  vertical-align: top;
	}
  
	::v-deep {
	  .f18 {
		.el-form-item__label {
		  font-size: 18px;
		}
	  }
	}
  }
  </style>
  