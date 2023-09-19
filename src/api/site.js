import request from "./request";

// 工单
export function area(opt, data, post) {
	opt.method = opt.method || "get";
	let json = {};
	if (opt.method == "get") {
		json = {
			url: `/admin/blade-region/${opt.name}`,
			method: "get",
			params: data,
		};
	} else {
		json = {
			url: `/admin/blade-region/${opt.name}`,
			method: opt.method,
			params: data,
			data: post,
		};
	}
	if (opt.name == "update") {
		json.url += `?workOrder=${post.id}`;
	}
	return request(json);
}
