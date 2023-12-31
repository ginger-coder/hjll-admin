module.exports = {
	settleData:[
		{label:'钱包选择',prop:'walletId',type:'select',key:'wallet'},
		{label:'所属项目',prop:'belongProject',type:'select',key:'billType'},
		{label:'所属工作组',prop:'belongGroup',type:'select',key:'group'},
		{label:'审核状态',prop:'examineStatus',type:'select',key:'status'},
	],
	accountData:[
		{label:'钱包选择',prop:'walletId',type:'select',key:'wallet'},
		// {label:'所属业务',prop:'billType',type:'select'},
		{label:'创建时间',prop:'time',type:'time',key:'deviceType'},
	],
	selectKey:{
		status:[
			{
				label:'待审核',
				value:0,
			},
			{
				label:'已通过',
				value:1,
			},
			{
				label:'已取消',
				value:'-1',
			}
		],
		billType:[],
		group:[],
		wallet:[],
		roleList:[],
	}
};
