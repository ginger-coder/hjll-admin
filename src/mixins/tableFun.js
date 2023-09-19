import { parseTime } from "@/utils";
export default {
	data() {
		return {
			loading: true,
			total: 0,
			currentPage: 1,
			pageSize: 30,
			pagerCount: 5, //大于等于 5 且小于等于 21 的奇数
			pageSizes: [30, 50, 100],
			lists: [],
		};
	},
	methods: {
		paging_change: function (page) {
			let that = this;

			that.currentPage = page;

			that.do_lists(page);
		},
		size_change: function (size) {
			let that = this;

			that.pageSize = size;
			that.currentPage = 1;

			that.do_lists();
		},

		do_lists: function (skip) {
			let that = this;

			if (!that.pageFun) return;

			that.$emit("lists");

			that.loading = true;

			if (skip < 1) skip = 1;

			let param = {
				...{
					current: skip || 1,
					size: that.pageSize,
				},
				...that.searchs,
			};
			let post = {
				...that.searchs,
			};
			if (!skip) that.currentPage = 1;
			if (that.module) post.module = that.module;

			let opt = {
				name: "page",
				method: "get",
			};

			that.pageFun(opt, param, post)
				.then((res) => {
					res = res || {};
					
					let _data = [];
					if (res.data.records) _data = res.data.records
					if (res.data.list) _data = res.data.list
					if (Array.isArray(res.data)) _data = res.data
					
					that.total = res.data.total || 0;

					let list = [];

					_data.map((row) => {
						row = that.filter_row(row);
						list.push(row);
					});

					if (res.data.total > 0 && list.length === 0) {
						that.paging_change(that.currentPage - 1);
					} else {
						that.lists = list;
						that.loading = false;
					}
					that.$emit("lists.end");
					that.$nextTick(() => {
						// table 显示合计
						that.tableShowSummaryFilter("lists", that.lists);
						that.filterTableSelection();
					});
				})
				.catch((err) => {
					console.warn(err);
					that.lists = [];
					that.loading = false;
					that.$emit("lists.end");
					that.$nextTick(() => {
						// table 显示合计
						that.tableShowSummaryFilter("lists", that.lists);
						that.filterTableSelection();
					});
				});
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
			row.createdAt = row.createdAt || row.tim;
			row.createTime = parseTime(new Date(row.createdAt), "{y}-{m}-{d} {h}:{i}:{s}") || "-";

			// 更新时间
			row.updatedAt = row.updatedAt || row.tim_up || row.createdAt;
			row.updateTime = parseTime(new Date(row.updatedAt), "{y}-{m}-{d} {h}:{i}:{s}") || "-";

			if (that.filter_page_row) row = that.filter_page_row(row);

			return row;
		},
	},
};
