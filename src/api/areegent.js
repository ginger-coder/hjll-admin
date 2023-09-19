import request from "./request";
export function arggentpage(data) {
	return request({  //列表数据
		url: `/admin/agreement/page`,
		method: "get",
		params:data,
	});
}
export function arggentadd(data) {
	return request({ //列表新增
		url: `/admin/agreement/save`,
		method: "post",
		data,
	});
}
export function arggentselect() {
	return request({ //协议类型字典查询
		url: `/admin/dict/types/agreement_type_code/items`,
		method: "get",

	});
}
export function datacompile(data) {
	return request({ //编辑详情
		url: `/admin/agreement/details`,
		method: "get",
        params:data
	});
}
export function dataput(data) {
	return request({ //编辑更新
		url: `/admin/agreement/update`,
		method: "post",
        data
	});
}
export function datarelease(data) {
	return request({ //数据发布
		url: `/admin/agreement/issue`,
		method: "get",
        params:data
	});
}
export function datadelete(data) {
	return request({ //数据删除
		url: `/admin/agreement/delete`,
		method: "get",
        params:data
	});
}
export function undateInfor(data) {
	return request({ //已更新数据详情
		url: `/admin/agreement/details`,
		method: "get",
        params:data
	});
}
export function storydate(data) {
	return request({ //历史版本
		url: `/admin/agreement/history/version`,
		method: "get",
        params:data
	});
}