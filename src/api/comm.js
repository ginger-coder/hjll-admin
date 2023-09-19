import request from "@/utils/request";

export function upload(data) {
	return request({
		url: "/comm/upload",
		method: "post",
		data,
	});
}
export function storageQuery(data) {
	return request({
		url: "/comm/storage/query",
		method: "get",
		params: data,
	});
}
export function storageList(data) {
	return request({
		url: "/comm/storage/list",
		method: "get",
		params: data,
	});
}
export function storageCreate(data) {
	return request({
		url: "/comm/storage/create",
		method: "post",
		data,
	});
}
export function storageModify(data) {
	return request({
		url: "/comm/storage/modify?storageId=" + data.id,
		method: "post",
		data,
	});
}
export function storageInfo(data) {
	return request({
		url: "/comm/storage/info",
		method: "get",
		params: data,
	});
}
export function storageRemove(data) {
	return request({
		url: "/comm/storage/remove",
		method: "get",
		params: data,
	});
}
// 上传文件
export function fileUpload(data) {
	return request({
		url: "/basic/BasicFile/Upload",
		method: "post",
		data,
	});
}
