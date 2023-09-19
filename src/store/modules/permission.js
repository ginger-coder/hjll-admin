// import { asyncRoutes, constantRoutes } from '@/router'
import { routerPhasII } from "@/router/routerPhasII";  //权限管第二期
import { menusRoutes } from '@/api/menu';

import Layout from '@/layout'
import emptyLayout from '@/layout/emptyLayout'
import noLeftLayout from "@/layout/noLeftLayout";


export const loadView = (component) => { // 路由懒加载
    // return () => import(`@/${component}`)
    return (resolve) => require([`@/views/${component}`], resolve)

}

// const modules = import.meta.glob('../../views/**/**.vue');
const hasPermission = (roles, route) => {
	if (route.meta && route.meta.roles) {
		
		if (roles.includes('ROOT')) {
			return true;
		}
		return roles.some((role) => {
			
			if (route.meta?.roles !== undefined) {
		  return (route.meta.roles).includes(role);
		}
	  });
	}
	return false;
};
export function filterAsyncRoutes(routes,roles) {
	const res = []
	if(routes && routes.length>0){
		
		routes.forEach(route => {
			const tmp = { ...route }
			if (tmp && tmp.meta && tmp.meta) {
				tmp.hidden = tmp.meta.hidden
			}
			
			if (hasPermission(roles, tmp)) {
				
				if(tmp.component =='Layout'){
					tmp.component=Layout
				}else if(tmp.component =='emptyLayout'){
					tmp.component=emptyLayout
				}else if(tmp.component =='noLeftLayout'){
					tmp.component=noLeftLayout
				} else {
					tmp['component']= loadView(tmp.component)
				}
				if (tmp.children && tmp.children.length>0) {
					tmp.children = filterAsyncRoutes(tmp.children,roles)
				}
				res.push(tmp)
			}
			
		})
	}

	return res
}


const state = {
    routes: [],
    addRoutes: [],
    iops: {}
}

const mutations = {
    SET_ROUTES: (state, routes) => {
        state.addRoutes = routes
        state.routes = routerPhasII.concat(routes)
    },
    SET_IOPS: (data) => {
        state.iops[data.name] = data.value
    },
}

const actions = {
    generateRoutes({ commit }, roles) {
        return new Promise(resolve => {
			menusRoutes().then(res=>{
				const asyncRoutes = res.data;
				const accessedRoutes = filterAsyncRoutes(asyncRoutes, roles);
				commit('SET_ROUTES', accessedRoutes)
				resolve(accessedRoutes)
			})
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}