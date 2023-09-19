import request from "./request";

// 
export function dictCreate(opt, data, post) {
	let json = {
		url: `/system/dict/types`,
		method: "post",
		params: data,
		data: post,
	};
	return request(json);
}
export function dictUpdate(opt, data, post) {
	let json = {
		url: `/system/dict/types/${post.id}`,
		method: "put",
		data: post,
	};
	return request(json);
}
export function dictPages(opt, data, post) {
	let json = {
		url: `/system/dict/types/pages`,
		method: "get",
		params: data,
		data: post,
	};
	return request(json);
}
export function dictInfo(opt, data, post) {
	let json = {
		url: `/system/dict/types/${post.id}/form`,
		method: "get",
		params: data,
		data: post,
	};
	return request(json);
}
export function dictRemove(opt, data, post) {
	let json = {
		url: `/system/dict/types/${post.id}`,
		method: "delete",
	};
	return request(json);
}
// 
export function dictItemCreate(opt, data, post) {
	let json = {
		url: `/system/dict/items`,
		method: "post",
		params: data,
		data: post,
	};
	return request(json);
}
export function dictItemUpdate(opt, data, post) {
	let json = {
		url: `/system/dict/items/${post.id}`,
		method: "put",
		data: post,
	};
	return request(json);
}

export const dictItemTypes = async (dictProp) => {
	const res = await dictItemPages(
		{},
		{
			typeCode: dictProp,
			size: 100
		}
	);
	return  res?.data?.list;
};

export function dictItemPages(opt, data, post) {
	let json = {
		url: `/system/dict/items/pages`,
		method: "get",
		params: data,
		data: post,
	};
	return request(json);
}
export function dictItemInfo(opt, data, post) {
	let json = {
		url: `/system/dict/items/${post.id}/form`,
		method: "get",
		params: data,
		data: post,
	};
	return request(json);
}
export function dictItemRemove(opt, data, post) {
	let json = {
		url: `/system/dict/items/${post.id}`,
		method: "delete",
	};
	return request(json);
}
export function getDictTypesItem(opt, data, post) {
	let json = {
		url: `/system/dict/types/${opt.name}/items`,
		method: "get",
		params: data,
		data: post,
	};
	return request(json);
}