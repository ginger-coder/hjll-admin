module.exports = {
	deviceData:[
		{label:'设备编码',prop:'deviceCode',type:'input'},
		{label:'设备名称',prop:'deviceName',type:'input'},
		{label:'设备类型',prop:'deviceType',type:'select',key:'deviceType'},
		{label:'设备细分类型',prop:'deviceSecondType',type:'select',key:'deviceSecondType'},
	],
	machineData:[
		{label:'机房细分类型',prop:'machineRoomType',type:'select',key:'machineRoomType'},
		{label:'机房编码',prop:'machineRoomCode',type:'input'},
		{label:'机房名称',prop:'machineRoomName',type:'input'},
		
	],
	towerData:[
		{label:'铁塔细分类型',prop:'towerType',type:'select',key:'towerType'},
		{label:'铁塔编码',prop:'towerCode',type:'input'},
		{label:'铁塔名称',prop:'towerName',type:'input'},
	],
	stationData:[
		{label:'基站细分类型',prop:'stationType',type:'select',key:'stationType'},
		// {label:'运营商',prop:'operator',type:'select',key:'operator',multiple:true,},
		// {label:'基站保障等级',prop:'protectionLevel',type:'select',key:'protectionLevel',multiple:true,},
	],
	corelationStaion:[
		{label:'基站编码',prop:'stationCode',type:'input'},
		{label:'基站名称',prop:'stationName',type:'input'},
		{label:'基站细分类型',prop:'stationType',type:'select',key:'stationType'},
	]	
};
