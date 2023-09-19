import { getProtocolDetail } from '@/api/isp';

const getDefaultState = () => {
	return {
		fileList: [],
		agreementDocName: '',
		agreementNo: '',
		agreementSignStatus: '',
		createTime: '',
		fileList: [],
		historySignList: [],
		id: 0,
		remark: '',
		signCoordinate: '',
		signEndTime: '',
		step: 1,
		thumbnailUrl: '',
	};
};

const state = getDefaultState();

const mutations = {
	SET_FILE_INFO: (state, data) => {
		Object.assign(state, {
			...data,
			fileList: [
				{
					name: data.agreementDocName,
					url: data.thumbnailUrl,
					signatureId: data.id,
				},
			],
		});
	},
	DELETE_FILE: (state) => {
		Object.assign(state, {
			fileList: [],
		});
	},
	ADD_FILE: (state, data) => {
		state.fileList = [{ ...data }];
	},
	RESET_FILE: (state) => {
		Object.assign(state, getDefaultState());
	},
};

const actions = {
	// user login
	getFileInfo({ commit }, signatureId) {
		return new Promise((resolve, reject) => {
			getProtocolDetail({
				id: signatureId,
			})
				.then((res) => {
					commit('SET_FILE_INFO', res.data);
					resolve(res);
				})
				.catch((error) => {
					reject(error);
				});
		});
	},
	clearFile({ commit }) {
		commit('RESET_FILE');
	},
	addFileList({ commit }, data) {
		commit('ADD_FILE', data);
	},
	deleteFile({ commit }) {
		commit('DELETE_FILE');
	},
};

export default {
	namespaced: true,
	state,
	mutations,
	actions,
};
