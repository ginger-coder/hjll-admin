<template>
	<el-cascader class="dialog_forms_input_long" collapse-tags :clearable="isclearable" :disabled="isdisabled" v-model="value1" :options="regions" :props="props" @change="areaChange" ref="cascader" :placeholder="placeholder"> </el-cascader>
</template>
<script>
import { regionData, CodeToText } from "element-china-area-data";
import { area } from "@/api/area";
import { deepClone } from "@/utils"; 

export default {
	props: {
		isclearable: {
			default: true,
			type: Boolean,
		},
		placeholder: {
			default: '请选择区域',
			type: String,
		},
		isdisabled: {
			default: false,
			type: Boolean,
		},
		ischeckStrictly: {
			default: false,
			type: Boolean,
		},
		ismultiple: {
			default: false,
			type: Boolean,
		},
		isEcho: {
			default: false,
			type: Boolean,
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
			regions: [],
			props: {
				lazy: true,
				expandTrigger: "hover",
				// value: "row",
				checkStrictly: false,
				multiple: false,
				lazyLoad: (node, resolve) => {
					let that = this;
					const { level, value } = node;
					if (level == 1) {
						that.loader_next_area({ provinceCode: value }, function (list) {
							resolve(list);
						});
					} else if (level == 2) {
						that.loader_next_area({ cityCode: value }, function (list) {
							list.map((item) => {
								item.leaf = true;
							});
							resolve(list);
						});
					}else{
						resolve([])
					}
				},
			},

			value1: [],

			areaInfo: {},
		};
	},
	watch: {
		value: function (val) {
			var that = this;
			
			// that.value1 = val;

			if (val.length == 0) {
				// 清空级联选择器选中状态
				this.$refs.cascader.$refs.panel.clearCheckedNodes();
				// 清除高亮
				this.$refs.cascader.$refs.panel.activePath = [];
			}
		},
		isEcho: function (val) {
			var that = this;
			if (val) {
				if (this.value.length) {
					// that.loader_next_area()
				}
				
			}
		},
		ischeckStrictly: function (val) {
			let that = this;
			
			that.$set(that.props,'checkStrictly',val)
		},
		ismultiple: function (val) {
			let that = this;

			that.props.multiple = val;
		},
		value1: function () {
			
			if (this.$refs.cascader) {
				this.$refs.cascader.dropDownVisible = false; //监听值发生变化就关闭它
			}
		},
	},
	//渲染到页面的时候
	mounted() {
		var that = this;
		that.initer();
	},
	methods: {
		initer: function () {
			var that = this;
			that.loader_next_area();
			that.value1 = that.value;
			
			that.$set(that.props,'checkStrictly',that.ischeckStrictly)
			
			that.props.multiple = that.ismultiple;
		},
		loader_next_area: function (searchs = {}, next) {
			let that = this;
			area({ method: "get", name: "RegionList" }, searchs).then((res) => {
				console.log(res);
				var _list = [];
				if (res.data && res.data.length) {
					res.data.map((item) => {
						var json = {
							value: item.code,
							row: { code: item.code, name: item.name },
							label: item.name,
						};
						_list.push(json);
					});
					if (JSON.stringify(searchs) === "{}") {
						that.regions = _list;
					} else {
						next && next(_list);
					}
				}else{
					next && next(_list);
				}
			});
		},
		areaChange: function (value) {
			let that = this;
			if (value.length) {
				that.$emit("change", { province: value[0], city: value[1], area: value[2] });
			} else {
				that.$emit("change", {});
			}
		},
	},
};
</script>
<style></style>
