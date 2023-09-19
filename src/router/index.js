import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

import Layout from '@/layout';
import emptyLayout from '@/layout/emptyLayout';
import noLeftLayout from '@/layout/noLeftLayout';
import financeRouters from '@/router/finance';

export const constantRoutes = [
	{
		path: '/login',
		component: (resolve) => require(['@/views/login/index'], resolve),
		hidden: true,
	},
	{
		// 重定向到china
		path: '/largeScreen',
		redirect: '/china',
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
				meta: {
					title: '企业端首页',
					affix: true,
					icon: 'el-icon-menu1',
				},
			},
		],
	},
	{
		path: '/newIndex',
		component: emptyLayout,
		children: [
			{
				path: 'index',
				name: 'index',
				component: (resolve) =>
					require(['@/views/newIndex/index'], resolve),
				meta: {
					title: '企业端首页',
					affix: true,
					icon: 'el-icon-menu1',
				},
			},
		],
		hidden: true,
	},
	// 新增数据分析 11.20
	{
		path: '/addcount',
		component: Layout,
		children: [
			{
				path: 'index',
				name: 'index',
				component: (resolve) =>
					require(['@/views/addcount/index'], resolve),
				meta: { title: '数据分析', icon: 'addcount', affix: true },
			},
		],
	},
	// 地图模块 11.22
	{
		path: '/datamap',
		component: Layout,
		redirect: 'noRedirect',
		meta: { title: '数据监控', icon: 'datamap' },
		children: [
			{
				path: 'index',
				name: 'index',
				component: (resolve) =>
					require(['@/views/datamap/index'], resolve),
				meta: { title: '基站监控', icon: 'home', affix: true },
			},
			{
				path: 'pmap',
				name: 'pmap',
				component: (resolve) =>
					require(['@/views/datamap/personnelmap'], resolve),
				meta: { title: '人员监控', icon: 'home', affix: true },
			},
			{
				path: 'order',
				name: 'order',
				component: (resolve) =>
					require(['@/views/datamap/ordermonitor'], resolve),
				meta: { title: '工单监控', icon: 'home', affix: true },
			},
			{
				path: '/sealHead',
				target: '_blank',
				meta: {
					title: '动环监控',
					icon: 'home',
					affix: true,
					url: 'http://221.180.46.35:18888/vuepeim/login',
				},
			},
		],
	},
	// {
	//   path: "/newMessage",
	//   component: Layout,
	//   children: [
	//     {
	//       path: "index",
	//       name: "index",
	//       component: (resolve) => require(["@/views/newMessage/index"], resolve),
	//       meta: { title: "数据监控", icon: "addcount", affix: true },
	//     },
	//   ],
	// },

	{
		path: '/xiaoxiNew',
		component: Layout,
		children: [
			{
				path: 'index',
				name: 'index',
				component: (resolve) =>
					require(['@/views/xiaoxiNew/index'], resolve),
				meta: { title: '消息中心', icon: 'addcount', affix: true },
			},
		],
	},
	{
		path: '/isp',
		component: Layout,
		redirect: 'noRedirect',
		meta: { title: '客户管理', icon: 'isp' },
		children: [
			{
				path: 'ispList',
				name: 'ispList',
				component: (resolve) => require(['@/views/isp/list'], resolve),
				meta: { title: '客户管理', icon: '', affix: true },
			},
			{
				path: 'company',
				name: 'company',
				component: (resolve) =>
					require(['@/views/isp/company'], resolve),
				meta: { title: '政企权限管理', icon: '' },
			},
			{
				path: 'ispCreate',
				name: 'ispCreate',
				hidden: true,
				component: (resolve) =>
					require(['@/views/isp/create'], resolve),
				meta: {
					title: '客户信息',
					icon: '',
					affix: true,
					activeMenu: '/isp/ispList',
				},
			},
			{
				path: 'ispInfo',
				name: 'ispInfo',
				hidden: true,
				component: (resolve) => require(['@/views/isp/info'], resolve),
				meta: {
					title: '客户详情',
					icon: '',
					affix: true,
					activeMenu: '/isp/ispList',
				},
			},
			{
				path: 'sign',
				name: 'sign',
				hidden: true,
				component: (resolve) => require(['@/views/isp/sign'], resolve),
				meta: {
					title: '发起签约',
					icon: '',
					affix: true,
					activeMenu: '/isp/ispList',
				},
				children: [
					{
						path: 'card',
						name: 'card',
						component: (resolve) =>
							require(['@/views/isp/card'], resolve),
						meta: {},
					},
				],
			},
			{
				path: 'ispCheck',
				name: 'ispCheck',
				component: (resolve) => require(['@/views/isp/check'], resolve),
				meta: { title: '客户验证', icon: '', affix: true },
			},
			{
				path: 'ispAudit',
				name: 'ispAudit',
				component: (resolve) => require(['@/views/isp/audit'], resolve),
				meta: { title: '客户审核', icon: '', affix: true },
			},
			{
				path: 'ispAuditInfo',
				name: 'ispAuditInfo',
				hidden: true,
				component: (resolve) =>
					require(['@/views/isp/auditInfo'], resolve),
				meta: { title: '运营商审核', icon: '', affix: true },
			},
			{
				path: 'ispAuditPage',
				name: 'ispAuditPage',
				hidden: true,
				component: (resolve) =>
					require(['@/views/isp/auditInfo'], resolve),
				meta: { title: '运营商审核', icon: '', affix: true },
			},
		],
	},
	{
		path: '/omp',
		component: Layout,
		redirect: 'noRedirect',
		meta: { title: '运维管理', icon: 'omp' },
		children: [
			{
				path: 'ompList',
				name: 'ompList',
				component: (resolve) => require(['@/views/omp/list'], resolve),
				meta: { title: '人员管理', icon: '', affix: true },
			},
			{
				path: 'ompCreate',
				name: 'ompCreate',
				hidden: true,
				component: (resolve) =>
					require(['@/views/omp/create'], resolve),
				meta: {
					title: '新增运维人员',
					icon: '',
					affix: true,
					activeMenu: '/omp/ompList',
				},
			},
			{
				path: 'createskill',
				name: 'createskill',
				hidden: true,
				component: (resolve) =>
					require(['@/views/omp/createskill'], resolve),
				meta: {
					title: '创建技能',
					icon: '',
					affix: true,
					activeMenu: '/omp/ompSkill',
				},
			},
			{
				path: 'ompInfo',
				name: 'ompInfo',
				hidden: true,
				component: (resolve) => require(['@/views/omp/info'], resolve),
				meta: {
					title: '运维人员详情',
					icon: '',
					affix: true,
					activeMenu: '/omp/ompList',
				},
			},
			{
				path: 'zsinfo',
				name: 'zsinfo',
				hidden: true,
				component: (resolve) =>
					require(['@/views/omp/zsinfo'], resolve),
				meta: {
					title: '运维人员详情',
					icon: '',
					affix: true,
					activeMenu: '/omp/zsinfo',
				},
			},
			{
				path: 'zsadd',
				name: 'zsadd',
				hidden: true,
				component: (resolve) => require(['@/views/omp/zsadd'], resolve),
				meta: {
					title: '运维人员详情',
					icon: '',
					affix: true,
					activeMenu: '/omp/zsadd',
				},
			},
			{
				path: 'roleadd',
				name: 'roleadd',
				hidden: true,
				component: (resolve) =>
					require(['@/views/omp/roleadd'], resolve),
				meta: {
					title: '运维人员详情',
					icon: '',
					affix: true,
					activeMenu: '/omp/roleadd',
				},
			},
			{
				path: 'ompRole',
				name: 'ompRole',
				component: (resolve) => require(['@/views/omp/role'], resolve),
				meta: { title: '角色管理', icon: '', affix: true },
				children: [],
			},
			{
				path: 'createrole',
				name: 'createrole',
				hidden: true,
				component: (resolve) =>
					require(['@/views/omp/createrole'], resolve),
				meta: {
					title: '创建角色',
					icon: '',
					affix: true,
					activeMenu: '/omp/ompRole',
				},
			},
			{
				path: 'ompSkill',
				name: 'ompSkill',
				component: (resolve) => require(['@/views/omp/skill'], resolve),
				meta: { title: '技能管理', icon: '', affix: true },
			},
			{
				path: 'ompCert',
				name: 'ompCert',
				component: (resolve) => require(['@/views/omp/cert'], resolve),
				meta: { title: '证书管理', icon: '', affix: true },
			},
			{
				path: 'ompSign',
				name: 'ompSign',
				component: (resolve) => require(['@/views/omp/sign'], resolve),
				meta: { title: '签约管理', icon: '', affix: true },
			},
			{
				path: 'electronic',
				name: 'electronic',
				component: (resolve) =>
					require(['@/views/omp/electronic'], resolve),
				meta: { title: '电子签约', icon: '', affix: true },
			},
			{
				path: 'ompSignCreate',
				name: 'ompSignCreate',
				hidden: true,
				component: (resolve) =>
					require(['@/views/omp/signCreate'], resolve),
				meta: {
					title: '线下签约',
					icon: '',
					affix: true,
					activeMenu: '/omp/ompSign',
				},
			},
			{
				path: 'ompSignInfo',
				name: 'ompSignInfo',
				hidden: true,
				component: (resolve) =>
					require(['@/views/omp/signInfo'], resolve),
				meta: {
					title: '线下签约',
					icon: '',
					affix: true,
					activeMenu: '/omp/ompSign',
				},
			},
		],
	},
	// {
	//   path: "px",
	//   name: "px",
	//   redirect: "noRedirect",
	//   component: (resolve) => require(["@/views/omp/px/index"], resolve),
	//   meta: { title: "培训管理", icon: "order" },
	//   children: [
	//     {
	//       path: "xxpx",
	//       name: "xxpx",
	//       component: (resolve) => require(["@/views/omp/px/xxpx"], resolve),
	//       meta: { title: "线下培训管理" },
	//     },
	//     {
	//       path: "llks",
	//       name: "llks",
	//       component: (resolve) => require(["@/views/omp/px/llks"], resolve),
	//       meta: { title: "理论考试管理" },
	//     },
	//     {
	//       path: "scks",
	//       name: "scks",
	//       component: (resolve) => require(["@/views/omp/px/scks"], resolve),
	//       meta: { title: "实操考试管理" },
	//     },
	//     {
	//       path: "addressset",
	//       name: "addressset",
	//       component: (resolve) => require(["@/views/omp/px/addressset"], resolve),
	//       meta: { title: "地址设置" },
	//     },
	//     {
	//       path: "add",
	//       name: "add",
	//       component: (resolve) => require(["@/views/omp/px/addset"], resolve),
	//       meta: { title: "地址设置" },
	//       hidden: true,
	//     },
	//   ],
	// },
	{
		path: '/order',
		component: Layout,
		redirect: 'noRedirect',
		meta: { title: '工单管理', icon: 'order' },
		children: [
			{
				path: 'orderList',
				name: 'orderList',
				component: (resolve) =>
					require(['@/views/order/orderList'], resolve),
				meta: { title: '派单管理', icon: '', affix: true },
			},
			{
				path: 'orderApprovalList',
				name: 'orderApprovalList',
				component: (resolve) =>
					require(['@/views/order/approval/list'], resolve),
				meta: { title: '工单审批', icon: '', affix: true },
			},
			{
				path: 'orderApprovalDetails',
				name: 'orderApprovalDetails',
				hidden: true,
				component: (resolve) =>
					require(['@/views/order/approval/details'], resolve),
				meta: {
					title: '审批详情',
					icon: '',
					affix: true,
					activeMenu: '/order/orderApprovalDetails',
				},
			},
			{
				path: 'ordeReceipt',
				name: 'ordeReceipt',
				component: (resolve) =>
					require(['@/views/order/receipt/list'], resolve),
				meta: { title: '回单审核', icon: '', affix: true },
			},
			{
				path: 'ordeReceiptDetails',
				name: 'ordeReceiptDetails',
				hidden: true,
				component: (resolve) =>
					require(['@/views/order/receipt/details'], resolve),
				meta: {
					title: '回单详情',
					icon: '',
					affix: true,
					activeMenu: '/order/ordeReceipt',
				},
			},
			{
				path: 'patrolSchemeList',
				name: 'patrolSchemeList',
				hidden: true,
				component: (resolve) =>
					require(['@/views/order/patrolScheme/list'], resolve),
				meta: { title: '巡检计划', icon: '', affix: true },
			},
			{
				path: 'patrolSchemeDetails',
				name: 'patrolSchemeDetails',
				hidden: true,
				component: (resolve) =>
					require(['@/views/order/patrolScheme/details'], resolve),
				meta: { title: '巡检计划详情', icon: '', affix: true },
			},
			{
				path: 'patrolSchemeApproval',
				name: 'patrolSchemeApproval',
				hidden: true,
				component: (resolve) =>
					require(['@/views/order/patrolScheme/approval'], resolve),
				meta: { title: '巡检计划审批', icon: '', affix: true },
			},
			{
				path: 'createWorkOrder',
				name: 'createWorkOrder',
				hidden: true,
				component: (resolve) =>
					require(['@/views/order/createWorkOrder'], resolve),
				meta: {
					title: '新建工单1',
					icon: '',
					affix: true,
					activeMenu: '/order/orderList',
				},
			},
			{
				path: 'orderInfo1',
				name: 'orderInfo1',
				hidden: true,
				component: (resolve) =>
					require(['@/views/order/orderInfo'], resolve),
				meta: {
					title: '工单详情',
					icon: '',
					affix: true,
					activeMenu: '/order/orderList',
				},
			},
			{
				path: 'orderList',
				name: 'orderList',
				component: (resolve) =>
					require(['@/views/order/orderList'], resolve),
				meta: { title: '工单管理', icon: '', affix: true },
			},
			{
				path: 'orderCreate',
				name: 'orderCreate',
				hidden: true,
				component: (resolve) =>
					require(['@/views/order/create'], resolve),
				meta: {
					title: '新建工单',
					icon: '',
					affix: true,
					activeMenu: '/order/orderList',
				},
			},
			{
				path: 'orderInfo',
				name: 'orderInfo',
				hidden: true,
				component: (resolve) =>
					require(['@/views/order/info'], resolve),
				meta: {
					title: '工单详情',
					icon: '',
					affix: true,
					activeMenu: '/order/orderList',
				},
			},
			{
				path: 'orderConfirm',
				name: 'orderConfirm',
				component: (resolve) =>
					require(['@/views/order/confirm'], resolve),
				meta: { title: '工单审核', icon: '', affix: true },
			},
			{
				path: 'orderPay',
				name: 'orderPay',
				component: (resolve) => require(['@/views/order/pay'], resolve),
				meta: { title: '待支付工单', icon: '', affix: true },
			},
			{
				path: 'orderError',
				name: 'orderError',
				component: (resolve) =>
					require(['@/views/order/error'], resolve),
				meta: { title: '异常工单管理', icon: '', affix: true },
			},
			{
				path: '/patrol',
				name: 'patrol',
				component: (resolve) =>
					require(['@/views/order/patrol/index.vue'], resolve),
				meta: { title: '巡检计划管理', icon: '' },
			},
			{
				path: '/newPat',
				name: 'newPat',
				component: (resolve) =>
					require(['@/views/order/newPat.vue'], resolve),
				hidden: true,
				meta: {
					title: '新建巡检计划',
					icon: '',
					affix: true,
					activeMenu: '/order/patrol/newPat.vue',
				},
			},
			{
				path: 'config',
				name: 'config',
				redirect: 'noRedirect',
				component: (resolve) =>
					require(['@/views/order/config/index'], resolve),
				meta: { title: '配置管理' },
				children: [
					{
						path: 'xj',
						name: 'xj',
						redirect: 'noRedirect',
						component: (resolve) =>
							require(['@/views/order/config/xj/index'], resolve),
						meta: { title: '巡检配置' },
						children: [
							{
								path: 'mb',
								name: 'xjMb',
								component: (resolve) =>
									require([
										'@/views/order/config/xj/mb',
									], resolve),
								meta: { title: '巡检模板管理' },
							},
							{
								path: 'mbSet',
								name: 'xjMbSet',
								component: (resolve) =>
									require([
										'@/views/order/config/xj/mbSet',
									], resolve),
								meta: {
									title: '配置巡检模板',
									activeMenu: '@/views/order/config/xj/mb',
								},
								hidden: true,
							},
							{
								path: 'mk',
								name: 'xjMk',
								component: (resolve) =>
									require([
										'@/views/order/config/xj/mk',
									], resolve),
								meta: { title: '巡检模块管理' },
							},
							{
								path: 'mkSet',
								name: 'xjMkSet',
								component: (resolve) =>
									require([
										'@/views/order/config/xj/mkSet',
									], resolve),
								meta: {
									title: '配置巡检模块',
									activeMenu: '/order/config/xj/mk',
								},
								hidden: true,
							},
							{
								path: 'xm',
								name: 'xjXm',
								component: (resolve) =>
									require([
										'@/views/order/config/xj/xm',
									], resolve),
								meta: { title: '巡检项目管理' },
							},
							{
								path: 'xmSet',
								name: 'xjXmSet',
								component: (resolve) =>
									require([
										'@/views/order/config/xj/xmSet',
									], resolve),
								meta: {
									title: '配置巡检项目',
									activeMenu: '/order/config/xj/xm',
								},
								hidden: true,
							},
						],
					},
					{
						path: 'fd',
						name: 'fd',
						redirect: 'noRedirect',
						component: (resolve) =>
							require(['@/views/order/config/fd/index'], resolve),
						meta: { title: '发电配置' },
						children: [
							{
								path: 'mb',
								name: 'fdMb',
								component: (resolve) =>
									require([
										'@/views/order/config/fd/mb',
									], resolve),
								meta: { title: '发电模板管理' },
							},
							{
								path: 'mbSet',
								name: 'fdMbSet',
								component: (resolve) =>
									require([
										'@/views/order/config/fd/mbSet',
									], resolve),
								meta: { title: '配置发电模板' },
								hidden: true,
							},
							{
								path: 'hj',
								name: 'fdHj',
								component: (resolve) =>
									require([
										'@/views/order/config/fd/hj',
									], resolve),
								meta: { title: '发电环节管理' },
							},
							{
								path: 'hjSet',
								name: 'fdHjSet',
								component: (resolve) =>
									require([
										'@/views/order/config/fd/hjSet',
									], resolve),
								meta: { title: '配置发电环节' },
								hidden: true,
							},
						],
					},
					{
						path: 'gz',
						name: 'gz',
						redirect: 'noRedirect',
						component: (resolve) =>
							require(['@/views/order/config/gz/index'], resolve),
						meta: { title: '故障配置' },
						children: [
							{
								path: 'mb',
								name: 'gzMb',
								component: (resolve) =>
									require([
										'@/views/order/config/gz/mb',
									], resolve),
								meta: { title: '故障处理模板管理' },
							},
							{
								path: 'mbSet',
								name: 'gzMbSet',
								component: (resolve) =>
									require([
										'@/views/order/config/gz/mbSet',
									], resolve),
								meta: { title: '配置故障处理模板' },
								hidden: true,
							},
							{
								path: 'hj',
								name: 'gzHj',
								component: (resolve) =>
									require([
										'@/views/order/config/gz/hj',
									], resolve),
								meta: { title: '故障处理环节管理' },
							},
							{
								path: 'hjSet',
								name: 'gzHjSet',
								component: (resolve) =>
									require([
										'@/views/order/config/gz/hjSet',
									], resolve),
								meta: { title: '配置故障处理环节' },
								hidden: true,
							},
						],
					},
				],
			},
			{
				path: 'types',
				name: 'types',
				redirect: 'noRedirect',
				component: (resolve) =>
					require(['@/views/order/types/index'], resolve),
				meta: { title: '类型管理' },
				children: [
					{
						path: 'typesOrder',
						name: 'typesOrder',
						component: (resolve) =>
							require(['@/views/order/types/order'], resolve),
						meta: { title: '工单类型管理' },
					},
					{
						path: 'create',
						name: 'createTypesOrder',
						hidden: true,
						component: (resolve) =>
							require([
								'@/views/order/types/orderCreate',
							], resolve),
						meta: {
							title: '工单类型',
							activeMenu: '/order/types/typesOrder',
						},
					},
					{
						path: 'info',
						name: 'infoTypesOrder',
						hidden: true,
						component: (resolve) =>
							require(['@/views/order/types/orderInfo'], resolve),
						meta: {
							title: '工单类型详情',
							activeMenu: '/order/types/typesOrder',
						},
					},
					{
						path: 'typesXj',
						name: 'typesXj',
						component: (resolve) =>
							require(['@/views/order/types/xj'], resolve),
						meta: { title: '巡检类型管理' },
					},
					{
						path: 'createXj',
						name: 'createTypesXj',
						hidden: true,
						component: (resolve) =>
							require(['@/views/order/types/xjCreate'], resolve),
						meta: {
							title: '巡检类型',
							activeMenu: '/order/types/typesXj',
						},
					},
					{
						path: 'infoXj',
						name: 'infoTypesXj',
						hidden: true,
						component: (resolve) =>
							require(['@/views/order/types/xjInfo'], resolve),
						meta: {
							title: '巡检类型详情',
							activeMenu: '/order/types/typesXj',
						},
					},
				],
			},

			// {
			//   path: "type",
			//   name: "type",
			//   redirect: "noRedirect",
			//   component: (resolve) =>
			//     require(["@/views/order/type/index"], resolve),
			//   meta: { title: "工单类型" },
			//   children: [
			//     {
			//       path: "xj",
			//       name: "xj",
			//       redirect: "noRedirect",
			//       component: (resolve) =>
			//         require(["@/views/order/config/xj/index"], resolve),
			//       meta: { title: "巡检类工单配置" },
			//     },
			//     {
			//       path: "fd",
			//       name: "fd",
			//       redirect: "noRedirect",
			//       component: (resolve) =>
			//         require(["@/views/order/config/fd/index"], resolve),
			//       meta: { title: "发电类工单配置" },
			//     },
			//     {
			//       path: "gz",
			//       name: "gz",
			//       redirect: "noRedirect",
			//       component: (resolve) =>
			//         require(["@/views/order/config/gz/index"], resolve),
			//       meta: { title: "故障类工单配置" },
			//     },
			//   ],towerType
			// },
		],
	},
	// 222222 4
	{
		path: '/Security',
		component: Layout,
		redirect: 'noRedirect',
		meta: { title: '保障服务', icon: 'order' },
		children: [
			{
				path: '/sySecurity',
				name: 'sySecurity',
				component: (resolve) =>
					require(['@/views/Security/sySecurity'], resolve),
				meta: { title: '商业保障', icon: '', affix: true },
			},
			{
				path: 'health',
				name: 'health',
				component: (resolve) =>
					require(['@/views/Security/health'], resolve),
				meta: { title: '健康体检', icon: '', affix: true },
			},
			{
				path: 'referenceCheck',
				name: 'referenceCheck',
				component: (resolve) =>
					require(['@/views/Security/referenceCheck'], resolve),
				meta: { title: '背景调查', icon: '', affix: true },
			},
		],
	},
	// 2222222 2
	{
		path: '/rm',
		component: Layout,
		redirect: 'noRedirect',
		meta: { title: '资源管理', icon: 'rm' },
		children: [
			{
				path: 'sh',
				name: 'sh',
				component: (resolve) => require(['@/views/rm/sh'], resolve),
				meta: { title: '资源审核', icon: '', affix: true },
			},
			{
				path: 'maintenanceHistory',
				name: 'maintenanceHistory',
				component: (resolve) =>
					require(['@/views/rm/MaintenanceHistory'], resolve),
				meta: { title: '检修历史', icon: '', affix: true },
			},

			{
				path: 'rmZz',
				name: 'rmZz',
				component: (resolve) => require(['@/views/rm/zz'], resolve),
				meta: { title: '站址管理', icon: '', affix: true },
			},
			{
				path: 'rmCeate',
				name: 'rmCeate',
				hidden: true,
				component: (resolve) => require(['@/views/rm/create'], resolve),
				meta: { title: '资源', icon: '', affix: true },
			},
			{
				path: 'rmInfo',
				name: 'rmInfo',
				hidden: true,
				component: (resolve) => require(['@/views/rm/info'], resolve),
				meta: { title: '资源详情', icon: '', affix: true },
			},
			{
				path: 'rmZzInfo',
				name: 'rmZzInfo',
				hidden: true,
				component: (resolve) => require(['@/views/rm/zzInfo'], resolve),
				meta: { title: '资源详情', icon: '', activeMenu: '/rm/rmZz' },
			},
			{
				path: 'rmTT',
				name: 'rmTT',
				component: (resolve) => require(['@/views/rm/tt'], resolve),
				meta: { title: '铁塔管理', icon: '', affix: true },
			},
			{
				path: 'rmJF',
				name: 'rmJF',
				component: (resolve) => require(['@/views/rm/jf'], resolve),
				meta: { title: '机房管理', icon: '', affix: true },
			},
			{
				path: 'rmDevice',
				name: 'rmDevice',
				component: (resolve) => require(['@/views/rm/device'], resolve),
				meta: { title: '设备管理', icon: '', affix: true },
			},
			{
				path: 'rmDelivery',
				name: 'rmDelivery',
				component: (resolve) =>
					require(['@/views/rm/delivery'], resolve),
				meta: { title: '资源交割', icon: '', affix: true },
			},
			{
				path: 'rmMonitoring',
				name: 'rmMonitoring',
				component: (resolve) =>
					require(['@/views/rm/monitoring'], resolve),
				meta: { title: '监控管理', icon: '', affix: true },
			},
			{
				path: 'she',
				name: 'she',
				component: (resolve) => require(['@/views/rm/she'], resolve),
				meta: { title: '站址审核', icon: '', affix: true },
			},
			{
				path: 'sheinfo',
				name: 'sheinfo',
				hidden: true,
				component: (resolve) =>
					require(['@/views/rm/sheinfo'], resolve),
				meta: {
					title: '资源详情',
					icon: '',
					activeMenu: '/rm/sheinfo',
				},
			},
		],
	},
	{
		path: '/maintain',
		component: Layout,
		redirect: 'noRedirect',
		hidden: true,
		meta: { title: '维护表管理', icon: 'maintain' },
		children: [
			{
				path: 'gz',
				name: 'gz',
				component: (resolve) =>
					require(['@/views/maintain/gz'], resolve),
				meta: { title: '故障名称维护表', icon: '' },
			},
			{
				path: 'gzCreate',
				name: 'gzCreate',
				hidden: true,
				component: (resolve) =>
					require(['@/views/maintain/gzCreate'], resolve),

				meta: {
					title: '新增故障名称',
					icon: '',
					affix: true,
					activeMenu: '/maintain/gz',
				},
				// meta: { title: "新增故障名称", icon: "", activeMenu: "/maintain/gz" },
			},
			{
				path: 'gzInfo',
				name: 'gzInfo',
				hidden: true,
				component: (resolve) =>
					require(['@/views/maintain/gzInfo'], resolve),

				meta: {
					title: '故障名称详情',
					icon: '',
					affix: true,
					activeMenu: '/maintain/gz',
				},
				// meta: { title: "故障名称详情", icon: "", activeMenu: "/maintain/gz" },
			},
		],
	},
	{
		path: '/setting',
		component: Layout,
		redirect: 'noRedirect',
		hidden: true,
		children: [
			{
				path: 'personalCenter',
				name: 'personalCenter',
				component: (resolve) => {
					require(['@/views/system/personalCenter'], resolve);
				},
				meta: { title: '个人中心' },
			},
		],
	},
	{
		path: '/orderPrice',
		component: Layout,
		redirect: 'noRedirect',
		meta: { title: '定价管理', icon: 'orderprice' },
		children: [
			{
				path: 'xj',
				name: 'xj',
				component: (resolve) =>
					require(['@/views/orderPrice/xjprice'], resolve),
				meta: { title: '巡检定价模板', icon: '' },
			},
			{
				path: 'fd',
				name: 'fd',
				component: (resolve) =>
					require(['@/views/orderPrice/fdprice'], resolve),
				meta: { title: 'f模板', icon: '' },
			},
			{
				path: 'gz',
				name: 'gz',
				component: (resolve) =>
					require(['@/views/orderPrice/gzprice'], resolve),
				meta: { title: '故障定价模板', icon: '' },
			},
			{
				path: 'addxj',
				name: 'addxj',
				hidden: true,
				component: (resolve) =>
					require([
						'@/views/orderPrice/components/addmodule',
					], resolve),
				meta: { title: '巡检定价模板', icon: '' },
			},
		],
	},
	{
		path: '/gaojinguanli',
		component: Layout,
		children: [
			{
				path: 'index',
				name: 'index',
				component: (resolve) =>
					require(['@/views/gaojinguanli/index'], resolve),
				meta: { title: '告警管理', icon: 'addcount', affix: true },
			},
		],
	},
	{
		path: '/jiesuan',
		component: Layout,
		children: [
			{
				path: 'index',
				name: 'index',
				component: (resolve) =>
					require(['@/views/jiesuan/index'], resolve),
				meta: { title: '结算中心', icon: 'addcount', affix: true },
			},
		],
	},
	{
		path: '/testTrain',
		component: Layout,
		redirect: 'noRedirect',
		meta: { title: '培训', icon: 'pxks' },
		children: [
			{
				path: 'index',
				name: 'index',
				component: (resolve) =>
					require(['@/views/pxks/index'], resolve),
				meta: { title: '首页', icon: '' },
			},
			{
				path: 'itembank',
				name: 'itembank',
				component: (resolve) =>
					require(['@/views/pxks/testbank/testbank'], resolve),
				meta: { title: '题库', icon: '' },
			},
			{
				path: 'itemmanager',
				name: 'itemmanager',
				hidden: true,
				component: (resolve) =>
					require(['@/views/pxks/testbank/testmanager'], resolve),
				meta: { title: '题库管理' },
			},
			{
				path: 'test',
				name: 'test',
				redirect: 'noRedirect',
				component: (resolve) =>
					require(['@/views/pxks/test/index'], resolve),
				meta: { title: '试卷' },
				children: [
					{
						path: 'TestList',
						name: 'TestList',
						component: (resolve) =>
							require(['@/views/pxks/test/indextest'], resolve),
						meta: { title: '试卷' },
					},
					{
						path: 'testpaper',
						name: 'testpaper',
						hidden: true,
						component: (resolve) =>
							require(['@/views/pxks/test/testpaper'], resolve),
						meta: { title: '编辑试卷' },
					},
					{
						path: 'settest',
						name: 'settest',
						hidden: true,
						component: (resolve) =>
							require(['@/views/pxks/test/settest'], resolve),
						meta: { title: '设置试卷' },
					},
					{
						path: 'log',
						name: 'log',
						hidden: true,
						component: (resolve) =>
							require(['@/views/pxks/test/actionlog'], resolve),
						meta: { title: '答题记录' },
					},
				],
			},
			{
				path: 'examination',
				name: 'examination',
				redirect: 'noRedirect',
				component: (resolve) =>
					require(['@/views/examination/layout'], resolve),
				meta: { title: '考试' },
				children: [
					{
						path: 'list',
						name: 'list',
						component: (resolve) =>
							require(['@/views/examination/index'], resolve),
						meta: { title: '列表' },
					},
					{
						path: 'create',
						name: 'create',
						component: (resolve) =>
							require(['@/views/examination/create'], resolve),
						meta: { title: '创建' },
					},
					{
						path: 'edit',
						name: 'edit',
						component: (resolve) =>
							require(['@/views/examination/edit'], resolve),
						meta: { title: '编辑' },
					},
					{
						path: 'analysis',
						name: 'analysis',
						component: (resolve) =>
							require([
								'@/views/examination/examAnalysis',
							], resolve),
						meta: { title: '考试分析' },
					},
				],
			},
			{
				path: 'practice',
				name: 'practice',
				component: (resolve) =>
					require(['@/views/pxks/practice/index'], resolve),
				meta: { title: '练习' },
				children: [
					// pracAnalysis
					{
						path: 'analysis',
						name: 'analysis',
						component: (resolve) =>
							require([
								'@/views/pxks/practice/pracAnalysis.vue',
							], resolve),
						meta: { title: '练习分析' },
					},
				],
			},
			{
				path: 'book',
				name: 'book',
				component: (resolve) =>
					require(['@/views/pxks/classBook/index'], resolve),
				meta: { title: '课件' },
			},
			{
				path: 'course',
				name: 'course',
				component: (resolve) =>
					require(['@/views/pxks/course/index'], resolve),
				meta: { title: '课程' },
			},
		],
	},
	{
		path: '/system',
		component: Layout,
		redirect: 'noRedirect',
		meta: { title: '权限管理', icon: 'system' },
		children: [
			{
				path: 'user',
				name: 'user',
				component: (resolve) =>
					require(['@/views/system/user'], resolve),
				meta: { title: '用户管理', icon: '' },
			},
			{
				path: 'org',
				name: 'org',
				component: (resolve) =>
					require(['@/views/system/org'], resolve),
				meta: { title: '部门管理', icon: '' },
			},
			// {
			//   path: "role",
			//   name: "role",
			//   component: (resolve) =>
			//     require(["@/views/system/role"], resolve),
			//   meta: { title: "角色管理", icon: "" },
			// },
			// {
			//   path: "menu",
			//   name: "menu",
			//   component: (resolve) =>
			//     require(["@/views/system/menu"], resolve),
			//   meta: { title: "菜单管理", icon: "" },
			// },
			// {
			//   path: "dictionary",
			//   name: "dictionary",
			//   component: (resolve) =>
			//     require(["@/views/system/dictionary"], resolve),
			//   meta: { title: "字典管理", icon: "" },
			// },
		],
	},
	{
		path: '/personal',
		component: Layout,
		redirect: 'noRedirect',
		hidden: true,
		meta: { title: '个人中心', icon: 'personal' },
		children: [
			{
				path: 'personal',
				name: 'personal',
				hidden: true,
				component: (resolve) =>
					require(['@/views/personalcenter'], resolve),
				meta: { title: '个人中心', icon: '' },
			},
			{
				path: 'setting',
				name: 'setting',
				hidden: true,
				component: (resolve) =>
					require(['@/views/personalcenter/setting'], resolve),
				meta: { title: '账号设置', icon: '' },
			},
		],
	},
];

export const asyncRoutes = [];

const createRouter = () =>
	new Router({
		// mode: 'history', // require service support
		scrollBehavior: () => ({ y: 0 }),
		routes: constantRoutes,
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
