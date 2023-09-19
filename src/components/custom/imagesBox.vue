<template>
	<el-card
		class="pics_card"
		:body-style="{padding:'0px'}"
		:style="{width: width+'px',height: height+'px'}"
		shadow="never"
		v-if="previewList && previewList.length>0">
		<el-image
			:style="{width: width+'px',height: height+'px'}"
			fit="cover"
			:src="previewList[0]" 
			:preview-src-list="previewList"
			>
		</el-image>
		<div class="pics_num" v-if="previewList.length>1">{{previewList.length}}张</div>
	</el-card>
</template>
<script>
import { BASE_API,BASE_URL,BASE_UPLOAD } from '@/config'

import settings from '@/settings';

  export default{
	components:{
	},
	props: {
		width: {
			default: 100,
			type: Number
		},
		height: {
			default: 100,
			type: Number
		},
		value:{
			default() {
				return []
			},
			type:Array
		}
	},
	data(){
		return{
			mode:process.env.NODE_ENV,
			base_api:BASE_API,
			
			baseUrl:BASE_URL,

			picsList:[],
			previewList:[],

		}
	},
	watch:{
		value:function(val){
			var that=this;
			that.loader_pic(val);


		},
		picsList:function(){
			// console.log('picsList  change')
		}
	},
	//渲染到页面的时候
	mounted () {
		var that=this;

		
		that.loader_pic(that.value);
	},
	methods:{
		loader_pic:function(val){
			let that=this;

			that.picsList=val || [];
			var _previewList=[];
			if(that.picsList.length>0){
				that.picsList.map(url => {
					_previewList.push(BASE_UPLOAD+url)
				})
			} else {
				// that.upload_destroy();
			}
			that.previewList=_previewList;
		},
	}
  }
</script>
<style lang="scss" scoped>
.pics_card{
	position: relative;
	display: inline-block;
	border:0;
	background-color:transparent;
	vertical-align:top;

	.el-image{
		vertical-align:top;
	}
}
.pics_num{
	background-color: rgba(0,0,0,.5);
	position:absolute;
	left:0;
	right:0;
	bottom:0;
	height:24px;
	color:#fff;
	font-size:12px;
	display: flex;
	align-items:center;
	justify-content: center;
	cursor: pointer;
}
</style>