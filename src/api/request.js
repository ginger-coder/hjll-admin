import axios from "axios";
import store from "@/store";

import { Message } from "element-ui";
import { resetRouter } from "@/router";
import router from "@/router";
import { BASE_API } from "@/config";
import qs from "qs";
import { getToken } from "@/utils/auth";
axios.defaults.headers.post["Content-Type"] = "application/json";

import { authLogout } from "@/api/auth";
let AuthorizationList = ["auth/oauth/token"];
const service = axios.create({
	baseURL: BASE_API,
	withCredentials: false,
	timeout: 1200000,
});
//请求发起 (更改请求头)
service.interceptors.request.use(
	(config) => {
		if(config && (config.url === '/admin/users/template' ||  config.url === '/admin/users/_export' || config.url.search('/user/ums-member/export')>-1 || config.url=='basestation/tSite/export')){
			config.responseType = 'arraybuffer'
		}

		if (store.getters.token) {
			config.headers["Authorization"] = getToken();
		}
		let index = AuthorizationList.findIndex((item) => {
			return item == config.url;
		});
		if (index >= 0) {
			config.headers["Authorization"] = "Basic cGMtc2hhcmUtYWRtaW46MTIzNDU2";
		}
		if (config.data) {
			let _configData = config.data;
			for (const key in _configData) {
				
				
				if (_configData[key] === NaN || _configData[key] === undefined) {
					delete _configData[key];
				} else if (_configData[key] === "") {
					// _configData[key] = null;
				}
			}
		}
		if (config.params) {
			let _configParams = config.params;
			for (const key in _configParams) {
				if (_configParams[key] === NaN || _configParams[key] === undefined) {
					delete _configParams[key];
				} else if (_configParams[key] === "") {
					// _configParams[key] = null;
				}
			}
		}
		config.params = {
			// t: new Date().getTime(),
			...config.params,
		};
		return config;
	},
	(error) => {
		error = error || {};
		Promise.reject(error);
	}
);

//请求响应统一接受(本地带登录) 本地登录
service.interceptors.response.use(
	(response) => {
		
		const res = response.data;
		if ((res.code && res.code.toString() != "00000" && res.code.toString() != "0"&& res.code.toString() != "4066"&& res.code.toString() != "4099") ) {
			
			Message({
				message: `${res.message || res.msg}`,
				type: "warning",
				duration: 5 * 1000,
			});
			return Promise.reject(res);
		}
		return res;
	},
	(error) => {
		let _error = error.response.data;
		if (_error.code == "A0230" || _error.code == "A0231") {
			store.dispatch("tagsView/delAllViews");
			store.dispatch("user/resetToken");
			resetRouter();
			router.replace({ path: "/login" });
		} else if (_error.code >= 500) {
			router.replace({ path: "/500" });
		} else {
			Message({
				message: _error.msg || _error.message,
				type: "warning",
				duration: 5 * 1000,
			});
		}
		return Promise.reject(error);
	}
);

export default service;
