<template>
	<div style="height: 100%">
		<!-- <div class="header_box disp_flex ju_bet ali_cen">
			<div>
			<div class="title">{{ title }}</div>
			<div class="titleTips">{{ titleTips }}</div>
			</div>
			<div class="back_box">
				<el-button v-hold-click type="primary" @click="save">保存</el-button>
				<el-button v-hold-click type="" @click="back">返回</el-button>
			</div>
		</div>

		<div class="form_box scrllbar">
			<div>
				<template v-if="form.linkVOList && form.linkVOList.length>0">
					<div v-for="(item,index) in form.linkVOList" :key="item.linkId" >
						<div class="card_item disp_flex ju_bet ali_cen">
							<div style="margin-right: 20px;" class="flex">{{item.linkName}}</div>
							<div class="">
								<el-button size="small" v-hold-click type="danger" @click="removeList(index)">删除</el-button>
							</div>
						</div>
						<div class="sh1" style="background: #f2f2f2"></div>
					</div>
				</template>
				<div v-else class="empty_box card_item">
					暂无数据
				</div>
			</div>
			<div class="sh1" style="background: #f2f2f2"></div>
			<div class="sh1" style="background: #f2f2f2"></div>
			<div class="table_box card_item">
				<div style="font-size:16px;font-weight:bold;margin:-20px 0 20px">添加发电环节</div>
				<el-form ref="searchs" :model="searchs" class="form_horizontal" style="margin-bottom:10px">
					<el-form-item label="发电环节：" prop="name">
						<el-input placeholder="请输入" clearable v-model="searchs.name" @clear="do_search" @keyup.enter.native="do_search"> </el-input>
					</el-form-item>
					<el-form-item>
						<el-button icon="el-icon-search" type="primary" v-hold-click @click="do_search">筛选</el-button>
						<el-button icon="el-icon-refresh" v-hold-click @click="search_reset">重置</el-button>
					</el-form-item>
				</el-form>
				<el-table :data="lists" ref="lists" fit highlight-current-row border class="no_border_table" v-loading.body="loading" element-loading-spinner="el-icon-loading" element-loading-custom-class="custom-loading" :max-height="tableMaxHeight" :row-key="getRowKey" @selection-change="handleSelectionChange" @cell-click="cell_click">
					<el-table-column key="id" type="index" width="50" align="center" label="#" fixed>
						<template slot-scope="scope">
							{{ scope.$index + 1 + (currentPage - 1) * pageSize }}
						</template>
					</el-table-column>
					<el-table-column label="模板名称" min-width="100" prop="name" fixed>
						<template slot-scope="scope">
							{{ scope.row.name || "-" }}
						</template>
					</el-table-column>
					<el-table-column label="创建时间" width="188" prop="createTime">
						<template slot-scope="scope"> {{ scope.row.createTime_ }} </template>
					</el-table-column>
					<el-table-column v-if="perOperate" label="操作" align="center" width="80" fixed="right">
						<template slot-scope='scope'>
							<el-button type="text" v-hold-click @click.stop="topAdd(scope.row)"> 添加 </el-button>
						</template>
					</el-table-column>
				</el-table>
				<div class="disp_flex ali_cen ju_bet" style="margin-top:10px">
					<div></div>
					<el-pagination background :total="total" :page-size="pageSize" :pager-count="pagerCount" :current-page="currentPage" layout="total,prev, pager, next,sizes, jumper" :page-sizes="pageSizes" @current-change="paging_change" @size-change="size_change"></el-pagination>
				</div>
			</div>
		</div>
		<div class="footer"></div> -->
		<el-form style="display: flex;flex-wrap: wrap" label="left"  label-width="100px" :model="searchform">
	<el-form-item label="记录项：">
		<el-input placeholder="请输入" v-model="searchform.record" @input="oninput"></el-input>
	</el-form-item>
	<el-form-item label="要求：">
	   <el-input placeholder="请输入" v-model="searchform.askfor"> </el-input>
	</el-form-item>

	<el-form-item>
		<el-button type="primary" style="height:36px">查询</el-button>
		<el-button type="primary" style="height:36px" @click="preserve">保存</el-button>
	</el-form-item>
		</el-form>
		<el-card >
			<div class="bottomBox" v-for="item,index in rasters" :key="index">
			<div class="leftBox">
			<div>{{ item.name }}</div>
			<div>{{ item.requireInfo  }}</div>
			<div><el-checkbox v-model="checkedPhoto">拍照</el-checkbox></div>
			<div><el-checkbox v-model="isResult">记录数值 电压</el-checkbox></div>
			<div><el-checkbox v-model="isRemark">备注</el-checkbox></div>
			</div>
			<div>
				<el-button class="btn" @click="remove(index)">移除</el-button>
			</div>
			</div>
		</el-card>
		<el-card>
			<div class="bottomBox" v-for="item,index in rescode" :key="index">
			<div class="leftBox">
			<div>{{ item.name }}</div>
			<div>{{ item.requireInfo  }}</div>
			<div><el-checkbox v-model="checkedPhoto">拍照</el-checkbox></div>
			<div><el-checkbox v-model="isResult">记录数值 电压</el-checkbox></div>
			<div><el-checkbox v-model="isRemark">备注</el-checkbox></div>
			</div>
			<div>
				<el-button class="btn" @click="addbtns(index)">添加</el-button>
			</div>
			</div>
		</el-card>
	</div>
</template>
<script>
import basic from "@/mixins/basic";
import {parseTime} from "@/utils";
import { mbConfig,hjConfig,configuration,getEllList,preserve } from "@/api/orderFdConfig";

export default {
	components: {
	},
	data() {
	return {
		// title: "配置发电模板",
		// titleTips: "",
		// pageFun:hjConfig,
		// id: '',
		// apiKey: "id",
		// searchs_default:{
		// 	status:0
		// },

		// form: {
		// 	linkList:[]
		// },
		// rules: {},
		searchform:{
			record:'',
			askfor:'',
		},
	    rescode:[],
		rasters:[],
		checkedPhoto:true,
		checked:true,
		isRemark:true,
		isResult:true,
		requireList:''
	};
	},
	mixins: [basic],
	created() {
		const { id } = this.$route.query;
		console.log(id);
		this.id = id;
		if (id) {
			this.loader_info();
		}
	},
	mounted() {
		getEllList({current:1,size:5}).then(res=>{
			this.checkedPhoto=res.data.records.isPhoto==0?true:false
			this.isRemark=res.data.records.isRemark==0?true:false
			this.isResult=res.data.records.isResult==0?false:true
			console.log(res.data.records);
			this.rescode=res.data.records
			console.log(res,223);
		})
	},
	methods: {
		back() {
			this.$router.go(-1);
		},
		loader_info:function(){
			var that = this
			mbConfig({ method: "get", name: "detail" }, { templateId: that.id })
			.then((res)=>{
				that.form = res.data || []
				that.form.linkVOList = res.data.linkVOList || []
				console.log(that.form,);
				
			})
		},

		save:function(){
			var that = this
			let _post = that.form
			if (_post.linkVOList && _post.linkVOList.length ) {
				_post.linkList = _post.linkVOList.map(item=>item.linkId).filter(id=>id).join(",")
			}else{
				_post.linkList = ''
			}
			mbConfig({ method: "post", name: "update" }, {}, {id:_post.id,linkList:_post.linkList}).then((res) => {
				that.$message({
					type: "success",
					message: res.msg,
				});
				that.back();
			});
		},
		topAdd:function(row){
			var that = this
			
			let _json = {
				linkName:row.name,
				linkId:row.id
			}

			if (that.form.linkVOList && that.form.linkVOList.length == 0 ) {
				that.form.linkVOList.push(_json)
				return
			}
			if (that.form.linkVOList && that.form.linkVOList.length && row.id ) {
				let _index = that.form.linkVOList.findIndex(item=>item.linkId === row.id)
				if (_index<0) {
					that.form.linkVOList.push(_json)
				}else{
					this.$message({
						message: '该模块已存在，请勿重复添加',
						type: 'warning'
					})
				}
			}
		},
		removeList:function(index){
			var that = this
			that.$delete(that.form.linkVOList,index)
		},
		oninput(){
			var that = this
			configuration({value:1,name:that.searchform.record}).then(res=>{
				console.log(res);
			})
		},
		addbtns(e){
			this.rasters.push(this.rescode[e])
			this.rescode.splice(e,1)
		},
		remove(e){
			this.rescode.push(this.rasters[e])
			this.rasters.splice(e,1)
		},
		preserve(){
			this.requireList=[]
			this.rasters.map(el=>{
			this.requireList+=el.id+','
			})
			console.log(this.requireList,112);
			console.log(this.rasters,110);
			this.requireList = this.requireList.substring(0, this.requireList.lastIndexOf(','))
			this.form.requireList=this.requireList
			preserve(this.form).then(res=>{
				if(res.code==0){
					this.$message({
					message:res.msg,
					type:'success'
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
	font-size: 20px;
	font-weight: 500;
	margin-bottom: 10px;
	}
}

.form_box {
	background-color: #ffffff;
	margin-top: 40px;
	border-radius: 4px;
	.card_item {
		padding: 20px;
		font-size: 14px;
	}
}
.empty_box{
	text-align: center;
	color: #949599;
	font-size: 16px;
	font-weight: bold;
}
.table_box{
	margin-top: 20px;
}
el-form{
  ::v-deeep	el-form-item{
		margin-right: 20px;
	}
}
.bottomBox{
	width: 100%;
	height: 80px;
	background-color: #F5F5F5;
	line-height: 80px;
	margin-bottom: 10px;
	padding:0 30px;
	display: flex;
	justify-content: space-between;
	.leftBox{
		display: flex;
	}
	div{
		margin-right: 45px;
	}
}
::v-deep .btn{
	background-color:#F5F5F5 !important;
	border: none;
	
}
.el-card{
	margin-bottom: 10px;
}
</style>
