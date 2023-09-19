import request from './request';

// handle
function ompManager(opt, data, post) {
	opt.method = opt.method || 'get';
	let json;
	if (opt.method === 'get') {
		json = {
			url: `/user/ums-member/${opt.name}`,
			method: 'get',
			params: data,
		};
	} else {
		json = {
			url: `/user/ums-member/${opt.name}`,
			method: opt.method,
			params: data,
			data: post,
		};
	}
	return request(json);
}

function ompManagerexport(url, params) {
	let json = {
		url: url,
		method: 'get',
		params,
	};
	return request(json);
}

const page = (opt, data, post) => {
	return ompManager({ name: 'list' }, data, post);
};

const create = async (data, post) => {
	const { code } = await ompManager(
		{ name: 'save', method: 'post' },
		data,
		post
	);
	return code;
};

const remove = async (data) => {
	return ompManager({ name: 'remove' }, data);
};

const update = async (data, post) => {
	const { code } = await ompManager(
		{ name: 'update', method: 'post' },
		data,
		post
	);
	return code;
};

const info = async (data, post) => {
	const { data: info } = await ompManager(
		{ name: 'umsMemberVo/detail' },
		data,
		post
	);
	return info;
};

const orderList = async (data) => {
	// const {data: {records, total, size}} = await ompManager({name: "umsMemberVo/list"}, data, post);
	let json = {
		url: '/order/user-order/page',
		method: 'get',
		params: data,
	};
	const {
		data: { records, total, size },
	} = await request(json);
	return { records, total, size };
};

const verifyMobile = async (data, post) => {
	const { code } = await ompManager({ name: 'phoneVerify' }, data, post);
	return code;
};
const verifyIdCard = async (data, post) => {
	const { code } = await ompManager({ name: 'cardVerify' }, data, post);
	return code;
};
// 证书列表
export function Certificatelist(data) {
	return request({
		url: '/certificate/page',
		method: 'GET',
		params: data,
	});
}

//
// 邀请人列表分页
function getIntentionPage(data) {
	return request({
		url: '/user/ums/intention/page',
		method: 'get',
		params: data,
	});
}
// 回访登记
function intentFollowUp(data) {
	return request({
		url: '/user/ums/intention/follow/up',
		method: 'post',
		data,
	});
}
// 详情
function getIntentionInfo(id) {
	return request({
		url: '/user/ums/intention/' + id,
		method: 'get',
	});
}

export {
	page,
	create,
	update,
	info,
	orderList,
	verifyMobile,
	verifyIdCard,
	remove,
	ompManagerexport,
	getIntentionPage,
	intentFollowUp,
	getIntentionInfo,
};
