import request from './request';

// handle
function ispManager(opt, data, post) {
	opt.method = opt.method || 'get';
	let json;
	if (opt.method === 'get') {
		json = {
			url: `/admin/company-info/${opt.name}`,
			method: 'get',
			params: data,
			data: post,
		};
		// if (post) {
		//
		// }
	} else {
		json = {
			url: `/admin/company-info/${opt.name}`,
			method: opt.method,
			params: data,
			data: post,
		};
	}
	return request(json);
}

const page = (opt, data, post) => {
	return ispManager({ name: 'page' }, data, post);
};
const ispPage = (opt, data, post) => {
	return ispManager({ name: 'page' }, data, post);
};
const companyDetail = (opt, data, post) => {
	return ispManager({ name: 'companyDetail' }, data, post);
};
const qiantianSave = (post) => {
	return ispManager({ name: 'qiantianSave', method: 'post' }, {}, post);
};
const qiantianSaveAgain = (post) => {
	return ispManager({ name: 'qiantianSaveAgain', method: 'post' }, {}, post);
};

// const info = async (data, post) => {
//     const {data: info} = await ispManager({name: "detail"}, data, post);
//     return info;
// };
const info = (data) => {
	return request({
		url: '/system/enterprise/detail/' + data,
		method: 'get',
	});
};
const getOrderList = (params) => {
	return request({
		url: '/order/work-order/page/ent',
		method: 'get',
        params
	});
};

const removeCompany = async (data) => {
	return ispManager({ name: 'removeCompany' }, data);
};

const orderList = async (data, post) => {
	const {
		data: { records, total, size },
	} = await ispManager({ name: 'workOrderList' }, data, post);
	return { records, total, size };
};
const companyPage = (opt, data, post) => {
	let json = {
		url: `/system/enterprise/pages`,
		method: 'get',
		params: opt,
	};
	return request(json);
};

// 发起签约
export function enterpriseInitiateProtocol(data) {
	return request(
		{
			url: `/system/enterprise/initiate/protocol`,
			method: 'post',
			data,
		},
		{
			headers: {
				'Content-Type:': 'multipart/form-data',
			},
		}
	);
}
const throughPage = (opt, data, post) => {
	let json = {
		url: `/admin/company-info/throughPage`,
		method: 'get',
		params: opt,
	};
	return request(json);
};
// 获取协议图片列表
const getProtocolImgList = (opt) => {
	let json = {
		url: `/system/enterprise/protocol/img/list/${opt.id}`,
		method: 'get',
	};
	return request(json);
};
// 删除上传协议文件
const deleteEnterprise = (opt) => {
	let json = {
		url: `/system/enterprise/delete/${opt.id}`,
		method: 'delete',
	};
	return request(json);
};
// 上传协议文件
const cancelEnterprise = (opt) => {
	let json = {
		url: `/system/enterprise/cancel/${opt.id}`,
		method: 'delete',
	};
	return request(json);
};
// 获取协议详情
const getProtocolDetail = (opt) => {
	let json = {
		url: `/system/enterprise/protocol/detail/${opt.id}`,
		method: 'get',
	};
	return request(json);
};

const create = async (data, post) => {
	const { code } = await ispManager(
		{ name: 'verificationAccount', method: 'post' },
		data,
		post
	);
	return code;
};

const update = async (post) => {
	const { code } = await ispManager(
		{ name: 'updateCompanyInfo', method: 'post' },
		{},
		post
	);
	return code;
};
const updateUser = async (data) => {
	const { code } = await ispManager(
		{ name: 'updateUser', method: 'post' },
		data
	);
	return code;
};

const check = async (data, post) => {
	const check = await ispManager(
		{ name: 'check', method: 'post' },
		data,
		post
	);
	return check;
};

const audit = async (post) => {
	const { code } = await ispManager(
		{ name: 'updateCompanyInfo', method: 'post' },
		{},
		post
	);
	return code;
};

const verifyMoney = async (data, post) => {
	const t = await ispManager({ name: 'update', method: 'post' }, data, post);
	return t;
};

const checkList = async (opt, data, post) => {
	return ispManager({ name: 'checkList' }, data, post);
};

const verifyUserName = async (data, post) => {
	const { code } = await ispManager({ name: 'verifyUserName' }, data, post);
	return code;
};
const verifyEmail = async (data, post) => {
	const { code } = await ispManager({ name: 'verifyEmail' }, data, post);
	return code;
};
const verifyCompanyName = async (data, post) => {
	const { code } = await ispManager(
		{ name: 'verifyCompanyName' },
		data,
		post
	);
	return code;
};

const verifyLicenseNumber = async (data, post) => {
	const { code } = await ispManager({ name: 'verifyBusiness' }, data, post);
	return code;
};

export {
	page,
	info,
	companyDetail,
	orderList,
	create,
	update,
	updateUser,
	audit,
	checkList,
	verifyUserName,
	check,
	verifyEmail,
	verifyCompanyName,
	verifyLicenseNumber,
	verifyMoney,
	qiantianSave,
	qiantianSaveAgain,
	removeCompany,
	ispPage,
	throughPage,
	companyPage,
	getProtocolImgList,
	deleteEnterprise,
	getProtocolDetail,
	cancelEnterprise,
    getOrderList,
};
