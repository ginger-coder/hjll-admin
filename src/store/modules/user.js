import { authLogin, authLogout, authInfo, resetPassword } from "@/api/auth";
import { check } from "@/api/isp";
import { getToken, setToken, removeToken, setUserInfo, getUserInfo, removeUserInfo } from "@/utils/auth";
import { resetRouter } from "@/router";
import router from "@/router";
import { Message } from "element-ui";

import store from "@/store";
import { BASE_URL } from "@/config";
import { isHttp } from "@/utils/validate";

const getDefaultState = () => {
	return {
		token: getToken(),
		name: "",
		avatar: "",
		accountId: "",
		grade: 0,
		perms: [],
		roles: [],
		gender: null,
	};
};

const state = getDefaultState();

const mutations = {
	RESET_STATE: (state) => {
		Object.assign(state, getDefaultState());
	},
	SET_TOKEN: (state, token) => {
		state.token = token;
	},
	SET_NAME: (state, name) => {
		state.name = name;
	},
	SET_AVATAR: (state, avatar) => {
		state.avatar = avatar;
	},
	SET_GRADE: (state, grade) => {
		state.grade = grade || 0;
	},
	SET_GENDER: (state, gender) => {
		state.gender = gender || 0;
	},
	SET_CLV2: (state, value) => {
		state.comno_lv2 = value || 0;
	},
	SET_CLV3: (state, value) => {
	state.comno_lv3 = value || 0;
	},
	SET_ACCOUNTID: (state, value) => {
		state.accountId = value || 0;
	},
	SET_PERMS: (state, value) => {
		state.perms = value || [];
	},
	SET_ROLES: (state, value) => {
		state.roles = value || [];
	},
};

const actions = {
	// user login
	authLogin({ commit }, userInfo) {
		const { username, password,tenantId } = userInfo;
		return new Promise((resolve, reject) => {
			authLogin({ method: "post", name: "" }, { username: username.trim(), password: password, grant_type: "password",tenantId:tenantId })
				.then((response) => {
					const { data } = response;

					commit("SET_ACCOUNTID", data.userId);
					commit("SET_TOKEN", data.token_type + " " + data.access_token);
					setToken(data.token_type + " " + data.access_token);
					// setUserInfo("userId", data.userId);
					resolve(data);
				})
				.catch((error) => {
					reject(error);
				});
		});
	},
	authLogout({ commit }, userInfo) {
		return new Promise((resolve, reject) => {
			authLogout()
				.then((response) => {
					const { data } = response;
					// console.log();
					store.dispatch("tagsView/delAllViews");
					store.dispatch("user/resetToken");
					resetRouter();
					router.replace({ path: "/login" });
					Message({
						type: "success",
						message: response.msg || response.message,
					});
					resolve(data);
				})
				.catch((error) => {
					reject(error);
				});
		});
	},

	// get user info
	authInfo({ commit, state }) {
		return new Promise((resolve, reject) => {
			authInfo()
				.then((response) => {
					const { data } = response;
					console.log(data);

					const { roleKey, nickname, companyName, perms, roles,userId } = data;
					localStorage.setItem('adminUserId',userId)
					commit("SET_NAME", nickname);
					if (roles.includes('ROOT')) {
						commit("SET_PERMS", ['sys:user:add','sys:user:edit','sys:user:del','sys:role:menus:add']);
					}else{
						commit("SET_PERMS", perms);
					}
					commit("SET_ROLES", roles);

					// roleKey:admin/common
					// nickName:用户名
					// companyName:运营商名
					// let _name = "";
					// if (roleKey == "admin") {
					// 	_name = "管理员" + "-" + nickName;
					// } else if (roleKey == "common") {
					// 	_name = companyName + "-" + nickName;
					// }

					resolve(data);

					// setUserInfo("ispIsPassAudit", "false");
					// if (roleKey == "common") {
					// 	check().then((res) => {
					// 			console.log(res);
								
					// 			setUserInfo("ispIsPassAudit", "true");
								
					// 			// if (res.data.authenStatus != "1") {
					// 			// 	router.replace({ path: "/prove/proveIndex" });
					// 			// }
					// 			resolve(res.data);
					// 		})
					// 		.catch((err) => {
					// 			if (err.code == 4005) {
					// 				router.replace({ path: "/prove/proveIndex" });
					// 			}
					// 			resolve(data);
					// 		});
					// } else if(roleKey =='admin'){
						// resolve(data);
					// }else{
					// 	store.dispatch("user/authLogout");
					// }
					// let _avatar = "";
					// if (avatar && !isHttp(avatar)) _avatar = BASE_URL + avatar;
					// else _avatar = avatar;
					// commit("SET_AVATAR", _avatar);
					// commit("SET_ACCOUNTID", _id);
					// commit("SET_GENDER", gender);
					// commit("SET_CLV2", comno_lv2);
					// commit("SET_CLV3", comno_lv3);
				})
				.catch((error) => {
					// reject(error);
				});
		});
	},

	// remove token
	resetToken({ commit }) {
		return new Promise((resolve) => {
			removeToken(); // must remove  token  first

			removeUserInfo("userId");
			removeUserInfo("systemName");
			removeUserInfo("roleKey");
			removeUserInfo("nickName");
			removeUserInfo("companyName");
			removeUserInfo("ispIsPassAudit");

			commit("RESET_STATE");
			resolve();
		});
	},
};

export default {
	namespaced: true,
	state,
	mutations,
	actions,
};
