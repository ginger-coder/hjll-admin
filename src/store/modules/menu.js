import { menusRoutes } from "@/api/menu";
import { check } from "@/api/isp";
import { getToken, setToken, removeToken, setUserInfo, getUserInfo, removeUserInfo } from "@/utils/auth";
import { resetRouter } from "@/router";
import router from "@/router";
import { Message } from "element-ui";

import store from "@/store";
import { BASE_URL } from "@/config";
import { isHttp } from "@/utils/validate";

const getDefaultState = () => {
};

const state = getDefaultState();

const mutations = {
	RESET_STATE: (state) => {
		Object.assign(state, getDefaultState());
	},
};

const actions = {
	// user login
	menusRoutes({ commit }, userInfo) {
		return new Promise((resolve, reject) => {
			menusRoutes()
				.then((response) => {
					const { data } = response;
					console.log(data);
					
					// commit("SET_ACCOUNTID", data.userId);
					// commit("SET_TOKEN", data.token_type + " " + data.access_token);
					// setToken(data.token_type + " " + data.access_token);
					// setUserInfo("userId", data.userId);
					resolve(data);
				})
				.catch((error) => {
					reject(error);
				});
		});
	},
};

export default {
	namespaced: true,
	state,
	mutations,
	actions,
};
