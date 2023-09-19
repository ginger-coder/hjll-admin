import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

import Layout from '@/layout';
import emptyLayout from '@/layout/emptyLayout';
import noLeftLayout from '@/layout/noLeftLayout';

export const routerPhasII = [
	{
		path: '/aiMove',
		name: 'aiMove',
		component: (resolve) =>
			require(['@/views/largeScreen/aiMove/index'], resolve),
		hidden: false,
	},
	{
		path: '/alarm',
		name: 'alarm',
		component: (resolve) =>
			require(['@/views/largeScreen/monitoringAlarm/index'], resolve),
		hidden: false,
	},
	{
		path: '/largeScreen',
		component: (resolve) => require(['@/views/largeScreen/index'], resolve),
		hidden: true,
		children: [
			{
				path: '/china',
				name: '',
				component: (resolve) =>
					require(['@/views/largeScreen/china'], resolve),
				meta: {
					loading: true,
				},
			},
			{
				path: '/city',
				name: '',
				component: (resolve) =>
					require(['@/views/largeScreen/city'], resolve),
				meta: {
					loading: true,
				},
			},
			{
				path: '/city2',
				name: '',
				component: (resolve) =>
					require(['@/views/largeScreen/city'], resolve),
				meta: {
					loading: true,
				},
			},
			{
				path: '/province',
				name: '',
				component: (resolve) =>
					require(['@/views/largeScreen/province'], resolve),
				meta: {
					loading: true,
				},
			},
		],
	},
	{
		path: '/login',
		component: (resolve) => require(['@/views/login/index'], resolve),
		hidden: true,
	},
	{
		path: '/register',
		component: (resolve) => require(['@/views/login/register'], resolve),
		hidden: true,
	},
	{
		path: '/registerPass',
		component: (resolve) =>
			require(['@/views/login/registerPass'], resolve),
		hidden: true,
	},
	{
		path: '/passwordReset',
		component: (resolve) =>
			require(['@/views/login/passwordReset'], resolve),
		hidden: true,
	},
	{
		path: '/401',
		component: (resolve) => require(['@/views/401'], resolve),
		hidden: true,
	},
	{
		path: '/404',
		component: (resolve) => require(['@/views/404'], resolve),
		hidden: true,
	},
	{
		path: '/500',
		component: (resolve) => require(['@/views/500'], resolve),
		hidden: true,
	},
	{
		path: '/dict',
		component: (resolve) => require(['@/views/dict'], resolve),
		hidden: true,
		target: true,
	},
	{
		path: '/util',
		component: (resolve) => require(['@/views/util'], resolve),
		hidden: true,
		target: true,
	},
	{
		path: '/',
		component: Layout,
		redirect: '/index',
		children: [
			{
				path: 'index',
				name: 'index',
				component: (resolve) =>
					require(['@/views/home/index'], resolve),
				meta: { title: '首页', affix: true, icon: 'el-icon-menu1' },
			},
		],
	},
	// {
	//   path: "/personal",
	//   component: Layout,
	//   redirect: "noRedirect",
	//   hidden: true,
	//   meta: { title: "个人中心", icon: "personal" },
	//   children: [
	//     {
	//       path: "personal",
	//       name: "personal",
	//       hidden: true,
	//       component: (resolve) => require(["@/views/personalcenter"], resolve),
	//       meta: { title: "个人中心", icon: "" },
	//     },
	//     {
	//       path: "setting",
	//       name: "setting",
	//       hidden: true,
	//       component: (resolve) =>
	//         require(["@/views/personalcenter/setting"], resolve),
	//       meta: { title: "账号设置", icon: "" },
	//     },
	//   ],
	// },
];

export const asyncRoutes = [];

const createRouter = () =>
	new Router({
		// mode: 'history', // require service support
		scrollBehavior: () => ({ y: 0 }),
		routes: routerPhasII,
	});

const router = createRouter();

router.selfaddRoutes = function (params) {
	router.matcher = new Router().matcher;
	router.addRoutes(params);
};

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
	const newRouter = createRouter();
	router.matcher = newRouter.matcher; // reset router
}

router.beforeEach((form, to, next) => {
	const {
		fullPath,
		meta: { title, url },
	} = form;
	if (title === '动环监控' && fullPath === '/sealHead') {
		window.open(url);
	} else {
		next();
	}
});
export default router;
