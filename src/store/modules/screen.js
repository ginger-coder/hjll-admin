import { getStationMonitoring, getOrderMonitoring, getMemberMonitoring } from '@/api/lagreScreen';
const getDefaultState = () => {
	return {
		mapDataType: 1,
		requestList: {
			1: {
				url: getStationMonitoring,
				key: 'areaStation',
			},
			2: {
				url: getOrderMonitoring,
				key: 'areaOrder',
			},
			3: {
				url: getMemberMonitoring,
				key: 'areaMember',
			},
		},
	};
};

const state = getDefaultState();

const mutations = {
	SET_MAP_TYPE: (state, data) => {
		Object.assign(state, {
			mapDataType: data,
		});
	},
};

const actions = {
	onSetMapDataType({ commit }, type) {
		commit('SET_MAP_TYPE', type);
	},
};

export default {
	namespaced: true,
	state,
	mutations,
	actions,
};
