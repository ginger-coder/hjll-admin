
const state = {
  hamburger:{
    show:true,
  },
  sidebar: {
    opened: localStorage.getItem('sidebarStatus') ? !!+localStorage.getItem('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop',
  refreshView:true
}

const mutations = {
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    localStorage.setItem('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  OPEN_SIDEBAR: (state, withoutAnimation) => {
    localStorage.setItem('sidebarStatus', 1)
    state.sidebar.opened = true
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  CHANGE_HAMBURGER: (state, showHamburger) => {
    state.hamburger.show = showHamburger
  },
  CHANGE_REFRESHVIEW: (state, refreshView) => {
    state.refreshView = refreshView
  },
}

const actions = {
  toggleSideBar({ commit }) {
    if(state.sidebar.opened){
      commit('CLOSE_SIDEBAR', false)
    } else {
      commit('OPEN_SIDEBAR', false)
    }
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  openSideBar({ commit }, { withoutAnimation }) {
    commit('OPEN_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  changeHamburger({ commit }, showHamburger) {
    commit('CHANGE_HAMBURGER', showHamburger)
  },
  changeRefreshview({ commit }, refreshView) {
    commit('CHANGE_REFRESHVIEW', refreshView)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
