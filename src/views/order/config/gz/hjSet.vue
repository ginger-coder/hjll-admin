<template>
	<div style="height: 100%">
		<div class="header_box disp_flex ju_bet ali_cen">
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
				<template v-if="form.requireListInfo && form.requireListInfo.length>0">
					<div v-for="(item,index) in form.requireListInfo" :key="item.id" >
						<div class="card_item disp_flex  ali_cen ju_bet">
							<div class="card_item_box item_name">
								<div class="card_item_box_header">{{item.contentName}}</div>
							</div>
							<div class="card_item_box disp_flex ali_cen">
								<el-input style="margin-right:10px;width:200px" v-model="item.requireInfo" placeholder="请输入标题"></el-input>
								<div style="width:80px" v-if="item.contentType==1">拍照类</div>
								<div style="width:80px" v-if="item.contentType==2">记录类</div>
							</div>
							<div class="card_item_box item_summary">
								<div class="disp_flex ali_cen">
									<el-checkbox v-if="item.contentType==1" :true-label="0" :false-label="1" v-model="item.isPhoto">必填</el-checkbox>
									<el-checkbox v-if="item.contentType==2" :true-label="0" :false-label="1" v-model="item.isResult">必填</el-checkbox>
								</div>
							</div>
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
			<template v-if="pzLists.length">
				<div class="sh1" style="background: #f2f2f2"></div>
				<div class="card_item">
					<div>添加报备内容（拍照类）</div>
					<div class="card_item_tag"><el-tag v-for="item in pzLists" :key="item.id" size="small" type="info" @click="topAdd(item)">{{item.name}}</el-tag> </div>
				</div>
			</template>
			<template v-if="jlLists.length">
				<div class="sh1" style="background: #f2f2f2"></div>
				<div class="card_item">
					<div>添加报备内容（记录类）</div>
					<div class="card_item_tag"><el-tag v-for="item in jlLists" :key="item.id" size="small" type="info" @click="topAdd(item)">{{item.name}}</el-tag></div>
				</div>
			</template>
		</div>
		<div class="footer"></div>
	</div>
</template>
<script>
import {parseTime} from "@/utils";
import { hjConfig, yqConfig, requireConfig } from "@/api/orderGzConfig";

export default {
	components: {
	},
	data() {
	return {
		title: "配置故障处理环节",
		titleTips: "",


		id: '',

		form: {
			requireListInfo:[]
		},
		rules: {},

		pzLists:[],
		jlLists:[]

	};
	},
	mixins: [],
	created() {
		const { id } = this.$route.query;
		this.id = id;
		if (id) {
			this.loader_info();
			this.loader_set()
		}
	},
	mounted() {
	},
	methods: {
		back() {
			this.$router.go(-1);
		},
		loader_info:function(){
			var that = this
			hjConfig({ method: "get", name: "detail" }, { id: that.id })
			.then((res)=>{
				that.form = res.data || []
				that.form.requireListInfo = res.data.requireListInfo || []
			})
		},
		loader_set:function(){
			var that = this
			that.pzLists = []
			that.jlLists = []

			yqConfig({method:'get',name:'page'},{size:'999',current:0}).then((res)=>{
				console.log(res);
				let _data = res.data.records || []
				if(_data && _data.length){
					_data.map(item=>{
						// 1 拍照
						// 2 记录
						switch (item.type) {
							case 1:
								that.pzLists.push(item)
								break;
							case 2:
								that.jlLists.push(item)
								break;
						}
					})
				}
			})
		},

		save:function(){
			var that = this
			let _post = that.form
			let _postJson = []
			var json = {}
			
			_post.requireListInfo.map(item=>{
				json = {
					linkId:that.form.id,
					id:item.id,
					contentId:item.contentId,
					requireInfo:item.requireInfo,
					isResult:item.isResult,
					isPhoto:item.isPhoto,
				}
				_postJson.push(json)
			})
			requireConfig({method:'post',name:'faultListBatch'},{},{linkId:that.form.id,list:_postJson}).then((res)=>{
				var post = {
					requireList:res.data,
					id:that.form.id
				}
				hjConfig({ method: "post", name: "update" }, {}, post).then((res) => {
					that.$message({
						type: "success",
						message: res.msg,
					});
					that.back();
				});
			})
		},
		topAdd:function(row){
			var that = this
			
			let _json = {
				contentId:row.id,
				contentType:row.type,
				contentName:row.name,

				isPhoto:1,
				isResult:1,
				requireInfo:''
			}

			if (that.form.requireListInfo && that.form.requireListInfo.length == 0 ) {
				that.form.requireListInfo.push(_json)
				return
			}
			if (that.form.requireListInfo && that.form.requireListInfo.length && row.id ) {
				let _index = that.form.requireListInfo.findIndex(item=>item.contentId === row.id)
				if (_index<0) {
					that.form.requireListInfo.push(_json)
				}else{
					this.$message({
						message: '该选项已存在，请勿重复添加',
						type: 'warning'
					})
				}
			}
		},
		removeList:function(index){
			var that = this
			that.$delete(that.form.requireListInfo,index)
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
		.card_item_box{
			width:calc((100% - 100px) / 3);
			margin-right: 20px;
			.card_item_box_header{
				margin-bottom: 6px;
			}
		}
		.card_item_tag{
			// display: ;
			.el-tag{
				margin-top:10px;
				margin-right:10px;
				cursor: pointer;
			}
		}
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

</style>
