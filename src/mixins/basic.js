import { BASE_API, BASE_URL } from "@/config";
import { parseTime, numInput, fileDownload, deepClone } from "@/utils";

import variables from "@/styles/variables.scss";

import { getLabel, getClass } from "@/utils/dict";
import tableScrollMixin from "@/mixins/tableScroll";
import tableSelection from "@/mixins/tableSelection";
import tableFun from "@/mixins/tableFun";
import { mapState, mapMutations, mapGetters } from "vuex";
import utilMixin from "./util";

export default {
	data() {
		return {
			perInfo: true,
			perOperate: true,

			searchs: {},

			isedit: false,
			isinfo: false,
			isdialog: false,
			formSubmitLoading: false,

			forms: {},
			form_defaults: {},

			rules: {},

			pickerOptions: {
				disabledDate(time) {
					return time.getTime() > Date.now();
				},
			},

			tableMaxHeight: 0, //table高度最大值
			rowHeight: 45, //一行的高度
			tableHeadFootHeight: 44, //表头高度
			pagePaging: 20, //页面内边距值（上下）

			priority_popover: {
				id: "",
				isshow: false,
				priority: 0,
			},

			stateData: [
				{ label: "显示", value: 1 },
				{ label: "隐藏", value: 0 },
			],
		};
	},
	mixins: [tableFun, tableScrollMixin, utilMixin, tableSelection],
	watch: {
		lists: {
			handler() {
				this.$nextTick(() => {
					// 滚动到顶部
					// if(this.$refs.lists) this.$refs.lists.bodyWrapper.scrollTop = 0;
				});
			},
			deep: true,
			immediate: true,
		},
		needTagsView: {
			handler() {
				this.getTableMaxHeight();
			},
			deep: true,
			immediate: true,
		},
	},
	computed: {
		...mapGetters(["grade"]),
		needTagsView() {
			return this.$store.state.settings.tagsView;
		},
	},
	created() {
		let that = this;
		
		if (that.page_created) that.page_created();
	},
	mounted() {
		let that = this;
		that.searchs = { ...that.searchs_default } || {};
		that.$nextTick(() => {
			that.getTableMaxHeight();
		});

		window.addEventListener("resize", () => {
			that.getTableMaxHeight();
		});

		let _iops = that.$store.getters.permission.iops[that.$route.name] || {};

		that.perInfo = _iops.isinfo || true;
		that.perOperate = _iops.isoperate || true;

		if (that.pageFun && that.apiKey) that.do_lists();
		if (that.page_mounted) that.page_mounted();
	},
	methods: {
		tableStatusLabel(list, value) {
			return getLabel(list, value);
		},
		tableStatusClass(list, value) {
			return getClass(list, value);
		},
		jump(route, isReplace) {
			let that = this;
			if (isReplace) {
				that.$router.replace(route);
			} else {
				that.$router.push(route);
			}
		},
		getTableMaxHeight() {
			let that = this;

			let val = 0;
			let minHeight = that.tableHeadFootHeight + that.rowHeight;
			minHeight = minHeight > 88 ? minHeight : 88;

			let window_height = window.innerHeight; //window
			// console.log('window_height',window_height)
			let page_head_height = 0; //app_head
			let pagign_height = 0; //pagign
			if (that.$refs.pageHead) page_head_height = that.$refs.pageHead.clientHeight;
			// console.log('page_head_height',page_head_height)
			if (that.$refs.pagePagign) pagign_height = that.$refs.pagePagign.clientHeight - 1;
			// console.log('pagign_height',pagign_height)
			val = window_height - variables.topBarHeight.replace("px", "") - page_head_height - pagign_height - that.pagePaging;
			// console.log('topBarHeight',variables.topBarHeight.replace('px', ''))
			if (that.needTagsView) val = val - variables.tagsViewHeight.replace("px", "");
			// console.log('tagsViewHeight',variables.tagsViewHeight.replace('px', ''))
			val = val > minHeight ? val : minHeight;
			// console.log('pagePaging',that.pagePaging)
			that.tableMaxHeight = val - 20;
			// console.log('tableMaxHeight',that.tableMaxHeight)
		},
		do_search: function () {
			let that = this;
			that.do_lists();
		},
		search_reset: function () {
			let that = this;

			that.searchs = { ...that.searchs_default } || {};
			if (that.module) that.searchs.module = that.module;
			if (that.$refs.searchAreaSelect) {
				this.$refs.searchAreaSelect.value1 = [];
			}
			if (that.$refs.searchCompanySelect) {
				this.$refs.searchCompanySelect.value1 = [];
			}
			if (that.$refs.searchCooSelect) {
				this.$refs.searchCooSelect.value1 = "";
			}
			if (that.$refs.areaSelect) {
				this.$refs.areaSelect.value1 = [];
			}
			that.handleSelectionClear && that.handleSelectionClear();
			that.do_lists();
		},

		filter_row: function (row) {
			let that = this;

			row.id = row._id || row.id;
			row.name = row.name || row.names || "";

			// 排序
			row.priority = row.priority || 0;
			row.priorityShow = false;

			// 图片
			row.pics = row.pics || [];
			row.pic = row.pic || row.pics[0] || "";

			// 创建者
			row.adminName = "-";
			if (row.adminId && row.admin && row.admin.name) row.adminName = row.admin.name;

			// state
			row.stateName = "";
			row.stateName = that.filterDictLabel(that.stateData || [], row.state);

			// 创建时间
			row.createdAt = row.createTime || row.tim;
			row.createTime_ = parseTime(new Date(row.createdAt).getTime(), "{y}-{m}-{d} {h}:{i}:{s}") || "-";

			// 更新时间
			row.updatedAt = row.updateTime || row.tim_up;
			row.updateTime_ = parseTime(new Date(row.updatedAt).getTime(), "{y}-{m}-{d} {h}:{i}:{s}") || "-";

			if (that.filter_page_row) row = that.filter_page_row(row);

			return row;
		},
		request_info: function (id, next) {
			let that = this;

			that.pageFun(
				{ name: "detail" },
				{
					[that.apiKey]: id,
				}
			)
				.then((res) => {
					res = that.filter_row(res.data);
					next(res);
				})
				.catch((res) => {
					console.log("res", res);
				});
		},
		form_reset: function () {
			let that = this;
			that.forms = deepClone(that.form_defaults);
			that.isinfo = false;
			if (that.$refs.dialogScrollbar) {
				that.$refs.dialogScrollbar.wrap.scrollTop = 0;
			}
			that.isedit = false;
		},
		form_create: function () {
			let that = this;

			that.form_reset();

			that.isdialog = true;
		},
		// table_cell_edit: function(row) {
		//     let that = this;

		//     that.request_info(row.id, function(info) {
		//         that.forms = { ...info };
		//         that.isedit = true;
		//         that.isdialog = true;

		//         that.$nextTick(() => {
		//             if (that.$refs.forms) that.$refs.forms.clearValidate()
		//         })

		//         if (that.page_table_cell_edit) that.page_table_cell_edit(info);
		//     })
		// },
		toCreate() {
			let that = this;

			that.$refs.formDialog.openDialog();
		},
		table_cell_edit: function (row) {
			let that = this;

			that.request_info(row.id, function (info) {

				that.$nextTick(() => {
					if (that.$refs.forms) that.$refs.forms.clearValidate()
				})
		        if (that.page_table_cell_edit) that.page_table_cell_edit(info);
				console.log(info);

				that.$refs.formDialog && that.$refs.formDialog.openDialog(info);

			});
		},
		table_cell_info: function (row) {
			let that = this;

			that.request_info(row.id, function (info) {
				if (that.$refs.infoDrawer) {
					that.$refs.infoDrawer.openDrawer(row.id, info);
				}
			});
		},
		form_remark_input() {
			let that = this;
			if (that.isdialog) that.$refs.forms.validateField("remark");
		},
		form_dialog_cancel: function () {
			let that = this;

			that.form_reset();

			if (that.$refs.forms) that.$refs.forms.resetFields();
			that.isdialog = false;
			that.formSubmitLoading = false;
		},
		form_dialog_submit: function () {
			let that = this;
			if (that.formSubmitLoading) return;
			let post = { ...that.forms };
			that.$refs["forms"].validate((valid) => {
				if (valid) {
					that.formSubmitLoading = true;
					let param = {
						...post,
					};
					let opt = {
						name: that.isedit ? "modify" : "create",
						method: "post",
					};
					that.pageFun(opt, {}, param)
						.then(() => {
							that.$message({
								message: "提交成功",
								type: "success",
							});
							that.paging_change(that.currentPage);
							that.form_dialog_cancel();
						})
						.catch((res) => {
							that.formSubmitLoading = false;
							console.log("res", res);
						});
				}
			});
		},
		// 调整排序 start
		priorityPopoverShow(row) {
			let that = this;

			that.priority_popover.id = row.id;
			that.priority_popover.priority = row.priority || 0;
		},
		show_priority_popover: function (index, row) {
			let that = this;
			if (that.priority_popover.isShow) return;

			that.priority_popover.id = row.id;
			that.priority_popover.priority = row.priority || 0;
			that.priority_popover.isShow = true;
		},
		hide_priority_popover: function () {
			let that = this;

			document.querySelectorAll(".el-popover").forEach((item) => {
				item.style.display = "none";
			});

			that.$nextTick(() => {
				that.priority_popover.isShow = false;
				that.priority_popover.priority = 0;
				that.priority_popover.id = "";
			});
		},
		priorityInput: function (val) {
			let that = this;
			if (typeof val != "number") {
				val = Number(numInput(val));

				that.priority_popover.priority = val;
			}
		},
		priority_popover_submit: function (index, id) {
			let that = this;

			that.pageFun({ name: "modify", method: "post" }, {}, { id: id, priority: that.priority_popover.priority })
				.then((res) => {
					that.hide_priority_popover();
					that.paging_change(that.currentPage);
				})
				.catch((err) => {
					that.hide_priority_popover();
				});
		},
		// 调整排序 end
		to_export: function () {
			let that = this;

			let param = { ...that.searchs };
			if (that.tableSelectionIds.length) {
				param.ids = that.tableSelectionIds;
			}
			if (!that.pageExportFun) return;

			that.pageExportFun(param).then((res) => {
				that.$message({
					type: "success",
					message: "导出中",
				});
				fileDownload(BASE_URL + res.url, res.filenames || fileName || "");
			});
		},
		formDialogSubmit() {
			let that = this;

			if (that.$refs.infoPopup && that.$refs.infoPopup.isShow) {
				that.request_info(that.$refs.infoPopup.id, function (info) {
					that.$refs.infoPopup.openPopup(info);
				});
			}

			that.paging_change(that.currentPage);

			that.formDialogSubmitAfter && that.formDialogSubmitAfter();
		},
		table_cell_info(row) {
			let that = this;

			that.request_info(row.id, function (info) {
				that.$refs.infoPopup.openPopup(info);
			});
		},
		handleCommand(command, row) {
			let that = this;

			switch (command) {
				case "state0":
				case "state1":
					that.table_cell_state(row);
					break;
				case "delete":
					that.table_cell_remove(row);
					break;
			}
		},
		table_cell_state(row) {
			let that = this;

			that.batchModityState(row.state == 1 ? 0 : 1, [{ name: row.name, id: row.id }]);
		},
		table_cell_remove(row) {
			let that = this;

			that.batchRemove([{ name: row.name, id: row.id }]);
		},
		// state修改  单个/多个
		batchModityState(oState, arr) {
			let that = this;

			arr = arr || [];

			let oStateName = that.filterDictLabel(that.stateData, oState);
			let names = [];
			let ids = [];

			arr.map((item) => {
				names.push(item.name);
				ids.push(item.id);
			});

			let text = "";
			if (arr.length > 2) {
				text = `确定将 ${names.slice(0, 2).join("、")} 等${arr.length}个${that.moduleTitle || ""}${oStateName}吗？`;
			} else {
				text = `确定将 ${names.join("、")} ${that.moduleTitle || ""}${oStateName}吗？`;
			}

			that.$confirm(text, "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning",
			})
				.then(() => {
					that.pageFun(
						{ name: "setBatch", method: "post" },
						{},
						{
							key: "state",
							value: oState,
							ids: ids,
						}
					)
						.then((res) => {
							that.$message.success("设置成功");
							that.paging_change(that.currentPage);
							that.handleSelectionClear();
						})
						.catch((err) => {});
				})
				.catch(() => {});
		},
		// 删除/批量删除
		batchRemove(arr) {
			let that = this;

			arr = arr || [];

			let names = [];
			let ids = [];

			arr.map((item) => {
				names.push(item.name);
				ids.push(item.id);
			});

			let text = "";
			if (arr.length > 2) {
				text = `确定将 ${names.slice(0, 2).join("、")} 等${arr.length}个${that.moduleTitle || "数据"}删除吗？`;
			} else {
				text = `确定将 ${names.join("、")} ${that.moduleTitle || "数据"}删除吗？`;
			}

			that.$confirm(text, "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning",
			})
				.then(() => {
					that.pageFun(
						{ name: "removeMany", method: "post" },
						{},
						{
							ids: ids,
						}
					)
						.then((res) => {
							that.$message.success("删除成功");
							that.do_search();
							that.handleSelectionClear();
						})
						.catch((err) => {});
				})
				.catch(() => {});
		},
		infoPopupOperation(type, id) {
			let that = this;

			switch (type) {
				case "edit":
					that.table_cell_edit({ id: id });
					break;
			}
		},
		// 批量导出
		pageModuleExport() {
			let that = this;
		},
	},
	beforeDestroy(){
		var that = this
		console.log(that.$route);
		console.log(this.$store.state.permission.routes);
		
		
	}
};
