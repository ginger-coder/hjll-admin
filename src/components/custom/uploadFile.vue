<template>
	<div>
		<el-upload :headers="headerObj" v-if="isshow" ref="upload2" class="upload_file" :action="action" :accept="uploadAccept" :multiple="max > 1 ? true : false" :show-file-list="showFileList" :file-list="filesDatas" :on-success="files_success" :on-exceed="files_exceed" :on-remove="files_remove" :disabled="isdisabled" :before-upload="before_upload">
			<el-button size="small" type="" icon="el-icon-upload2" :disabled="isdisabled" v-if="isshow">点击上传</el-button>
			<!-- :limit="max>1?max:0" -->
		</el-upload>
		<div>
			<ul v-if="!isshow && filesList.length && showFileList" class="infoFileListClass">
				<li @click="download(item)" v-for="(item, index) in filesList" :key="index"><i class="el-icon-document"></i>{{ item.name }}</li>
			</ul>
			<span v-if="!isshow && filesList.length == 0">-</span>
		</div>
	</div>
</template>
<script>
import { BASE_API, BASE_URL } from "@/config";
import { fileDownload } from "@/utils";

// max:最大值
// isperview:是否预览
// isoperate:是否可以操作
// maxSize:图片大小,默认1M
//	picList
import settings from "@/settings";
import store from "@/store";
import { getToken } from "@/utils/auth";

export default {
	props: {
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
		isshow: {
			default: true,
			type: Boolean,
		},
		showFileList: {
			default: true,
			type: Boolean,
		},
		maxSize: {
			default: "1024",
			type: String,
		},
		uploadAccept: {
			default: ".pdf,.doc,.docx,.xls,.xlsx",
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
			mode: process.env.NODE_ENV,
			base_api: BASE_API,

			baseUrl: BASE_URL,

			filesDatas: [],

			filesList: [],

			action: BASE_API + "/admin/BasicFile/Upload",
			headerObj: {
				Authorization: "",
			},
		};
	},
	watch: {
		value: function (val) {
			var that = this;
			that.loader_files(val);
		},
		filesList: function () {
			// console.log('filesList  change')
		},
	},
	//渲染到页面的时候
	mounted() {
		var that = this;
		if (store.getters.token) {
			that.headerObj["Authorization"] = getToken();
		}
		that.loader_files(that.value);
	},
	methods: {
		loader_files: function (val, a) {
			let that = this;
			that.filesList = val || [];
			that.filesDatas = val || [];
			let _list = [];
			if (that.filesList.length > 0) {
				that.filesList.map((item,index) => {
					_list.push({
						name: item,
						url: item,
					});
				});
			} else {
				that.upload_destroy();
			}
			that.filesDatas = _list
		},
		files_success: function (a, b, c) {
			var that = this;
			that.filesList = c || [];
			let _success_num = 0;
			if (c && c.length) {
				c.map((item) => {
					if (item.status == "success") {
						_success_num++;
					}
				});
			}
			if (_success_num == c.length) {
				that.$loading().close();
				this.$emit("success", that.filesList);
				return;
			}
		},
		files_exceed: function (files, fileList) {
			var that = this;

			console.log(that.filesDatas);
			var _num = 9 - that.filesList.length;
			this.$message.warning(`当前限制选择 9 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
		},
		before_upload: function (file) {
			var that = this;

			console.log(that.filesDatas);
			that.$loading({
				lock: true,
				text: "上传中",
				spinner: "el-icon-loading",
				background: "rgba(0, 0, 0, 0.7)",
			});

			// console.log('size',file.size)

			const isSize = file.size / 1024 / 1024 < that.maxSize / 1024; //限制图片大小
			if (!isSize) {
				this.$loading().close();
				this.$message.error("上传文件大小不能超过 " + that.maxSize / 1024 + "MB!");
			}
			return isSize;
		},
		files_remove: function (file, fileList) {
			var that = this;
			let index
			if (that.value) {
				index = that.filesList.findIndex(function (item) {
					return file.url == item
				});
			}else{
				index = that.filesList.findIndex(function (item) {
					return file.response.url == item.response.url;
				});
			}
			if (index >= 0) {
				that.$delete(that.filesList, index);
			}

			if (that.filesList.length == 0) that.upload_destroy();

			this.$emit("success", that.filesList);
		},
		upload_destroy: function () {
			var that = this;

			if (that.$refs.upload2) that.$refs.upload2.clearFiles();
		},

		download: function (fileinfo) {
			let that = this;
			fileDownload(fileinfo.url, fileinfo.name);
		},
	},
};
</script>
<style>
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
	width: 100%;
	height:  100%;
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
.infoFileListClass {
	margin-left: unset;
	padding: unset;
}
.infoFileListClass li {
	list-style-type: none;
	color: #666666;
	cursor: pointer;
	font-size: 14px;
}
.infoFileListClass .el-icon-document {
	margin-right: 10px;
}
.infoFileListClass li:hover {
	color: #e02020;
}
</style>
