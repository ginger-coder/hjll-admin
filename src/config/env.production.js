// let _location = window.location;
// let _href = `${_location.protocol}//${_location.hostname}`;
// console.log("_href", _href);
// 正式环境配置
// module.exports = {
// 	BASE_URL: _href, // 项目地址
// 	BASE_API: _href + "/api", // 本地api请求地址
// 	BASE_UPLOAD: 'https://cdn.hainacssp.com/'
// };
// test环境配置
const BASE_URL = 'https://haijiu.hainacssp.com:4438'
module.exports = {
	BASE_URL, // 项目地址
	BASE_API: `${BASE_URL}/api`, // 本地api请求地址
	IMAGE_BASE_URL: `${BASE_URL}/app/share/share-web-app/pic`,
	BASE_UPLOAD: 'https://cdn.hainacssp.com/'
};
