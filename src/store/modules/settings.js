import variables from '@/styles/element-variables.scss'
import defaultSettings from '@/settings'

import { prefix } from "@/settings"

const storageThemeSettings = JSON.parse(localStorage.getItem(prefix + '_theme_settings') || '{}');

const { layout, sTheme, showSettings, fixedHeader, sidebarLogo, tagsView, screenfull, openSearch, openRefresh } = defaultSettings

let isBoolean = (val) => {
    return typeof(val) == 'boolean'
}

const state = {
    layout: storageThemeSettings.layout || layout,
    sTheme: storageThemeSettings.theme || sTheme,
    theme: variables.theme,
    showSettings: showSettings,
    fixedHeader: fixedHeader,
    tagsView: isBoolean(storageThemeSettings.tagsView) ? storageThemeSettings.tagsView : tagsView,
    sidebarLogo: sidebarLogo,
    screenfull: isBoolean(storageThemeSettings.screenfull) ? storageThemeSettings.screenfull : screenfull,
    openSearch: isBoolean(storageThemeSettings.openSearch) ? storageThemeSettings.openSearch : openSearch,
    openRefresh: isBoolean(storageThemeSettings.openRefresh) ? storageThemeSettings.openRefresh : openRefresh,
    themeDrawerShow: false
}

const mutations = {
    CHANGE_SETTING: (state, { key, value }) => {
        // eslint-disable-next-line no-prototype-builtins
        if (state.hasOwnProperty(key)) {
            state[key] = value
        }
    }
}

const actions = {
    changeSetting({ commit }, data) {
        commit('CHANGE_SETTING', data)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}