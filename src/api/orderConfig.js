import request from "./request";

// 模版
export function mbConfig(opt, data, post) {
	opt.method = opt.method || "get";
	let json = {};
	if (opt.method == "get") {
		json = {
			url: `/user/polling-template/${opt.name}`,
			method: "get",
			params: data,
			data: post,
		};
	} else {
		json = {
			url: `/user/polling-template/${opt.name}`,
			method: opt.method,
			params: data,
			data: post,
		};
	}
	// if (opt.name == "update") {
	// 	json.url += `?workOrder=${post.id}`;
	// }
	return request(json);
}