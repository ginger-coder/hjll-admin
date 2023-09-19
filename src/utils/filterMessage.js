module.exports = {
	systemFilter:[
		{label:'消息分类',prop:'messageTypeCode',type:'select',key:'classify'},
		{label:'消息状态',prop:'status',type:'select',key:'status'},
		{label:'消息标题',prop:'title',type:'input'},
		{label:'创建时间',prop:'createdTime',type:'time'},
		{label:'发送时间',prop:'sendTime',type:'time2'},
	],
	systemFilter2:[
		{label:'消息分类',prop:'messageTypeCode',type:'select',key:'classify'},
		{label:'消息状态',prop:'readStatus',type:'select',key:'readStatus'},
		{label:'消息标题',prop:'title',type:'input'},
		{label:'接收时间',prop:'sendTime',type:'time2'},
	],
	orderFilter:[
		{label:'消息内容',prop:'msgContent',type:'input'},
		// {label:'消息类型',prop:'dataCategory',type:'select',key:'dataCategory'},
		{label:'消息状态',prop:'readStatus',type:'select',key:'readStatus'},
		{label:'消息时间',prop:'createdTime',type:'time'},
	],
	popleData:[
		{label:'所属区域',prop:'areaCode',type:'areaSelect'},
		{label:'角色',prop:'role',type:'select',key:'roleList2'},
		{label:'签约情况',prop:'sign',type:'select',key:'sign'},
		{label:'姓名',prop:'nickName',type:'input'},
	],
	companyData:[
		{label:'注册手机号',prop:'mobile',type:'input'},
		{label:'企业名称',prop:'entName',type:'input'},
		{label:'工商注册号',prop:'entQualificationNum',type:'input'},
	],
	interiorData:[
		{label:'姓名/工号/手机号',prop:'keywords',type:'input'},
		// {label:'工号',prop:'nickName',type:'input'},
		// {label:'手机号',prop:'phone',type:'input'},
		{label:'类型',prop:'userType',type:'select',key:'typeList'},
		{label:'角色',prop:'roleList',type:'select',key:'roleList',multiple:true},
	],
	selectKey:{
		classify:[],
		roleList2:[],
		status:[
			{
				label:'待发送',
				value:'0'
			},
			{
				label:'已发送',
				value:'1'
			}
		],
		readStatus:[
			{
				label:'未读',
				value:'0'
			},
			{
				label:'已读',
				value:'1'
			}
		],
		sign:[
			{
				label:'未签约',
				value:'0'
			},
			{
				label:'已签约',
				value:'1'
			}
		],
		dataCategory:[
			{
				label:'全部',
				value:'全部'
			},
			{
				label:'工单审批',
				value:'工单审批'
			},
			{
				label:'工单超时',
				value:'工单超时'
			},
			{
				label:'工单回单',
				value:'工单回单'
			},
			{
				label:'工单支付',
				value:'工单支付'
			}
		],
		roleList:[
			// {
			// 	label:'巡检员',
			// 	value:'巡检员'
			// },
			// {
			// 	label:'发电员',
			// 	value:'发电员'
			// },
			// {
			// 	label:'维修员',
			// 	value:'维修员'
			// },
		],
		typeList:[
			// {
			// 	label:'全部',
			// 	value:'0'
			// },
			// {
			// 	label:'正式',
			// 	value:'1'
			// },
			// {
			// 	label:'实习',
			// 	value:'2'
			// },
			// {
			// 	label:'外包',
			// 	value:'3'
			// },
			// {
			// 	label:'劳务',
			// 	value:'4'
			// },
		]
	}
};
