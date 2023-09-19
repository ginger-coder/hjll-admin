import request from "./request";

// 模板
export function mbConfig(opt, data, post) {
	opt.method = opt.method || "get";
	let json = {};
	if (opt.method == "get") {
		json = {
			url: `/user/dynamo-template/${opt.name}`,
			method: "get",
			params: data,
			data: post,
		};
	} else {
		json = {
			url: `/user/dynamo-template/${opt.name}`,
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

// 发电配置
export function configuration(data){
	return request ({
		url:"/user/dynamo-require/query",
		method:'post',
		data,
	   })
}
// 发电分页
export function getEllList(data){
	return request ({
		url:"/user/dynamo-require/page",
		method:'get',
		params:data,
	   })
}
// 发电保存
export function preserve(data){
	return request ({
		url:"/user/dynamo-template/update",
		method:'post',
		data
	   })
}
// 发电新增客户
export function clientele(){
	return request ({
		url:"/user/company-info/page?current=1&size=999",
		method:'get',
	   })
}
// 发电新增地区
export function region(data){
	return request ({
		url:"/user/blade-region/RegionList/operatorId",
		method:'get',
        params:data
	   })
}
// 发电新增接口
export function portAdd(data){
	return request ({
		url:"/user/dynamo-template/save",
		method:'post',
        data,
	   })
}
// 新建油价计费方式
export function oilPrice(data){
	return request ({
		url:"/admin/dict/items/pages",
		method:'get',
		params:data
	   })
}
// 发电要求配置
export function askfor(data){
	return request ({
		url:"/user/dynamo-require/page",
		method:'get',
		data
	   })
}
// 发电要求新增
export function asmethods(data){
	return request ({
		url:"/user/dynamo-require/save",
		method:'post',
		data
	   })
}
// 发电要求配置
export function disposition(data){
	return request ({
		url:"/user/dynamo-require/update",
		method:'post',
		data
	   })
}
// 发电要求搜索
export function search(data){
	return request ({
		url:"/user/dynamo-require/page",
		method:'get',
		params:data
	   })
}
// 发电要求删除
export function deleteList(data){
	return request ({
		url:"/user/dynamo-require/remove",
		method:'post',
		params:data
	   })
}
// 发电字典查询
export function dictionaries(data){
	return request ({
		url:"/system/dict/types/getItemByCode",
		method:'get',
	    params: data
	   })
}
// 环节
export function hjConfig(opt, data, post) {
	opt.method = opt.method || "get";
	let json = {};
	if (opt.method == "get") {
		json = {
			url: `/user/dynamo-link/${opt.name}`,
			method: "get",
			params: data,
			data: post,
		};
	} else {
		json = {
			url: `/user/dynamo-link/${opt.name}`,
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
// 环节
export function requireConfig(opt, data, post) {
	opt.method = opt.method || "get";
	let json = {};
	if (opt.method == "get") {
		json = {
			url: `/user/dynamo-require/${opt.name}`,
			method: "get",
			params: data,
			data: post,
		};
	} else {
		json = {
			url: `/user/dynamo-require/${opt.name}`,
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
// 要求
export function yqConfig(opt, data, post) {
	opt.method = opt.method || "get";
	let json = {};
	if (opt.method == "get") {
		json = {
			url: `/user/dynamo-content/${opt.name}`,
			method: "get",
			params: data,
			data: post,
		};
	} else {
		json = {
			url: `/user/dynamo-content/${opt.name}`,
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
// 项目
export function xmConfig(opt, data, post) {
	opt.method = opt.method || "get";
	let json = {};
	if (opt.method == "get") {
		json = {
			url: `/user/polling-item/${opt.name}`,
			method: "get",
			params: data,
			data: post,
		};
	} else {
		json = {
			url: `/user/polling-item/${opt.name}`,
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
// 巡检项目批量保存巡检要求
export function xmyqConfig(opt, data, post) {
	opt.method = opt.method || "get";
	let json = {};
	if (opt.method == "get") {
		json = {
			url: `/user/polling-require/requireListBatch`,
			method: "get",
			params: data,
			data: post,
		};
	} else {
		json = {
			url: `/user/polling-require/requireListBatch`,
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