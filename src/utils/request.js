import axios from "axios";
import { MessageBox, Message } from "element-ui";
import store from "@/store";
import { getToken } from "@/utils/auth";

import { BASE_API } from "@/config";
// create an axios instance
const service = axios.create({
	baseURL: BASE_API, // url = base url + request url
	// withCredentials: true, // send cookies when cross-domain requests
	timeout: 20000, // request timeout
});

// request interceptor
service.interceptors.request.use(
	(config) => {
		// do something before request is sent
		console.log(store.getters.token);
		if (store.getters.token) {
			// let each request carry token
			// ['X-Token'] is a custom headers key
			// please modify it according to the actual situation
			config.headers["X-Token"] = getToken();
		}
		return config;
	},
	(error) => {
		// do something with request error
		console.log(error); // for debug
		return Promise.reject(error);
	}
);

// response interceptor
service.interceptors.response.use(
	(response) => {
		const res = response.data;
		return res;
	},
	(error) => {
		const err = error.response;
		if (err.status == 403) {
			store.dispatch("user/authLogout").then((res) => {
				location.reload();
			});
		} else {
			let _error = error.response.data.error;
			if (_error.code != 4001) {
				Message({
					message: _error.msg || _error.message,
					type: "warning",
					duration: 5 * 1000,
				});
			}
		}
		return Promise.reject(error);
	}
);

export default service;
