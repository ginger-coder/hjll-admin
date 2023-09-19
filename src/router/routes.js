// 权限路由
let json = [
	{
		path: "/prove",
		component: "layout/noLeftLayout",
		meta: { title: "运营商账号与认证体系" },
		nodeKey: "prove",
		alwaysShow: true,
		redirect: "noRedirect",
		children: [
			{
				path: "index",
				name: "proveIndex",
				nodeKey: "proveIndex",
				component: "views/isp/list",
				meta: { title: "运营商账号与认证体系" },
				alwaysShow: true,
				children: [
					{
						path: "info",
						name: "info",
						nodeKey: "proveIndexInfo",
						component: "",
						meta: { title: "查看" },
						hidden: true,
					},
					{
						path: "operate",
						name: "operate",
						nodeKey: "proveIndexOperate",
						component: "",
						meta: { title: "编辑" },
						hidden: true,
					},
				],
			},
		],
	},
	// {
	// 	path: "/isp",
	// 	component: "layout/layout",
	// 	meta: { title: "运营商管理",  },
	// 	nodeKey: "isp",
	// 	alwaysShow: true,
	// 	redirect: "noRedirect",
	// 	children: [
	// 		{
	// 			path: "list",
	// 			name: "ispList",
	// 			nodeKey: "ispList",
	// 			component: "views/isp/list",
	// 			meta: { title: "运营商管理" },
	// 			alwaysShow: true,
	// 			children: [
	// 				{
	// 					path: "info",
	// 					name: "info",
	// 					nodeKey: "ispListInfo",
	// 					component: "",
	// 					meta: { title: "查看" },
	// 					hidden: true,
	// 				},
	// 				{
	// 					path: "operate",
	// 					name: "operate",
	// 					nodeKey: "ispListOperate",
	// 					component: "",
	// 					meta: { title: "编辑" },
	// 					hidden: true,
	// 				},
	// 			],
	// 		},
	// 		{
	// 			path: "create",
	// 			name: "ispCreate",
	// 			nodeKey: "ispCreate",
	// 			component: "views/isp/create",
	// 			meta: { title: "运营商管理" },
	// 			alwaysShow: true,
	// 			children: [
	// 				{
	// 					path: "info",
	// 					name: "info",
	// 					nodeKey: "ispListInfo",
	// 					component: "",
	// 					meta: { title: "查看" },
	// 					hidden: true,
	// 				},
	// 				{
	// 					path: "operate",
	// 					name: "operate",
	// 					nodeKey: "ispListOperate",
	// 					component: "",
	// 					meta: { title: "编辑" },
	// 					hidden: true,
	// 				},
	// 			],
	// 		},
	//     ]
	// },
];

export default json;
