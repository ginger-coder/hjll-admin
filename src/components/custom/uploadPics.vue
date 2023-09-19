<template>
	<div class="upload_pics">
		<!--  @end="draggable_end" -->
		<div class="el-upload-pics" v-if="max > 1">
			<vuedraggable class="wrapper" v-model="picsList" @change="pics_change">
				<transition-group name="pics">
					<div class="pic_item" v-for="(pic, p) in picsList" :key="'pic' + p" v-bind:key="'pic' + p" v-if="p < max">
						<el-card shadow="never" :body-style="{ padding: '0px', width: width + 'px', height: height + 'px' }">
							<el-image class="el_image_pic" fit="cover" :src="baseUpload + pic" :preview-src-list="isperview ? previewList : []"> </el-image>
						</el-card>
						<div class="img_close" v-hold-click @click="pics_remove(p)" v-if="!isdisabled">
							<i class="el-icon-error"></i>
						</div>
					</div>
				</transition-group>
			</vuedraggable>
		</div>
		<div v-else class="pic_item" v-for="(pic, p) in picsList">
			<el-card shadow="never" :body-style="{ padding: '0px', width: width + 'px', height: height + 'px' }">
				<el-image class="el_image_pic" fit="cover" :src="baseUpload + pic" :preview-src-list="isperview ? previewList : []"> </el-image>
				<div class="replace_btn" v-if="!isdisabled">
					<el-upload :headers="headerObj" :style="{ width: width + 'px', height: height + 'px' }" :action="action" accept="image/jpeg,image/jpg,image/png" :show-file-list="false" :on-success="pic_success" :on-progress="on_progress" :before-upload="before_upload"> 替换 </el-upload>
				</div>
			</el-card>
		</div>
		<el-upload :headers="headerObj" ref="upload2" v-if="picsList.length < max && !isdisabled" class="upload_pic" :style="{ width: width + 'px', height: height + 'px' }" :action="action" accept="image/jpeg,image/jpg,image/png" :limit="max > 1 ? max : 0" :multiple="max > 1 ? true : false" :show-file-list="false" :on-success="pic_success" :on-exceed="pic_exceed" :on-progress="on_progress" :before-upload="before_upload">
			<i class="el-icon-plus"></i>
		</el-upload>
	</div>
</template>
<script>
import { BASE_API, BASE_URL, BASE_UPLOAD } from "@/config";

// max:最大值
// isperview:是否预览
// isoperate:是否可以操作
// maxSize:图片大小,默认1M
//	picList
import vuedraggable from "vuedraggable";
import settings from "@/settings";
import store from "@/store";
import { getToken } from "@/utils/auth";

export default {
	components: {
		vuedraggable,
	},
	props: {
		width: {
			default: 80,
			type: Number,
		},
		height: {
			default: 80,
			type: Number,
		},
		max: {
			default: 9,
			type: Number,
		},
		isperview: {
			default: true,
			type: Boolean,
		},
		isdisabled: {
			default: false,
			type: Boolean,
		},
		isoperate: {
			default: true,
			type: Boolean,
		},
		maxSize: {
			default: "1024",
			type: String,
		},
		value: {
			default() {
				return [];
			},
			type: Array,
		},
	},
	data() {
		return {
			baseUpload: BASE_UPLOAD,
			mode: process.env.NODE_ENV,
			base_api: BASE_API,

			baseUrl: BASE_URL,

			picsList: [],
			previewList: [],

			action: BASE_API + "/admin/BasicFile/Upload",
			headerObj: {
				Authorization: getToken(),
			},
		};
	},
	watch: {
		value: function (val) {
			var that = this;
			that.loader_pic(val);
		},
		picsList: function () {
			// console.log('picsList  change')
		},
	},
	created() {},
	//渲染到页面的时候
	mounted() {
		var that = this;

		that.loader_pic(that.value);
	},
	methods: {
		loader_pic: function (val) {
			let that = this;

			that.picsList = val || [];
			var _previewList = [];
			if (that.picsList.length > 0) {
				that.picsList.map((url) => {
					_previewList.push(this.baseUpload + url);
				});
			} else {
				that.upload_destroy();
			}
			that.previewList = _previewList;
		},
		pic_success: function (a, b, c) {
			var that = this;
			var _arr = c;

			var _list = that.picsList || [];
			var _previewList = that.previewList || [];
			var _url = a.data;

			if (that.max > 1 && _list.length < that.max) {
				_list.push(_url);
				_previewList.push(BASE_URL + _url);
			} else {
				_list = [];
				_previewList = [];
				_list.push(_url);
				_previewList.push(BASE_URL + _url);
				that.picsList = _list;
				that.previewList = _previewList;
			}

			if (c[c.length - 1].status == "success") {
				setTimeout(function () {
					that.$loading().close();
				}, 1000);
			}

			if (that.picsList.length == 0) that.upload_destroy();

			this.$emit("success", that.picsList);
		},
		pic_exceed: function (files, fileList) {
			var that = this;

			var _num = 9 - that.picsList.length;
			this.$message.warning(`当前限制选择 9 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
		},
		on_progress: function (event, file, fileList) {
			// console.log('on_progress')
		},
		before_upload: function (file) {
			var that = this;

			that.$loading({
				lock: true,
				text: "上传中",
				spinner: "el-icon-loading",
				customClass: "custom-loading",
				background: "rgba(0, 0, 0, 0.7)",
			});

			// console.log('size',file.size)

			const isSize = file.size / 1024 / 1024 < that.maxSize / 1024; //限制图片大小
			if (!isSize) {
				this.$loading().close();
				this.$message.error("上传图片大小不能超过 " + that.maxSize / 1024 + "MB!");
			}
			return isSize;
		},
		pics_remove: function (p) {
			var that = this;

			console.log("------");
			that.$delete(that.picsList, p);

			if (that.picsList.length == 0) that.upload_destroy();

			this.$emit("success", that.picsList);
		},
		draggable_end: function (value) {
			var that = this;

			console.log("------");
			if (that.picsList.length == 0) that.upload_destroy();
			this.$emit("success", that.picsList);
		},
		upload_destroy: function () {
			var that = this;

			if (that.$refs.upload2) that.$refs.upload2.clearFiles();
		},
		pics_change: function () {
			let that = this;

			console.log("------");
			if (that.picsList.length == 0) that.upload_destroy();

			this.$emit("success", that.picsList);
		},
	},
};
</script>
<style>
.upload_pic,
.upload_pic .el-upload {
	width: 100%;
	height: 100%;
	display: inline-flex;
	align-items: center;
	justify-content: center;
}
.upload_pic {
	border: 1px dashed #d9d9d9;
	border-radius: 6px;
	background-color: #fbfdff;
}
.upload_pic i {
	font-size: 14px;
}
.img_close {
	position: absolute;
	top: -9px;
	right: -9px;
	height: 22px;
	opacity: 0;
	cursor: pointer;
}
.pic_item:hover .img_close {
	opacity: 0.5;
}
.pic_item:hover .img_close:hover {
	opacity: 1;
}

.img_close .el-icon-error {
	font-size: 22px;
	vertical-align: top;
}

.pic_item {
	margin: 0 8px 8px 0;
	display: inline-block;
	position: relative;
	overflow: initial;
}
.el_image_pic {
	width: 100%;
	height: 100%;
}

.el-dialog .el-image-viewer__close {
	color: #fff;
}

.replace_btn {
	position: absolute;
	background: rgba(0, 0, 0, 0.5);
	bottom: 0;
	left: 0;
	right: 0;
	color: #fff;
	height: 24px;
	line-height: 24px;
	font-size: 12px;
	text-align: center;
}
</style>
