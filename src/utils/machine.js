module.exports = {
	machineRoom:[
		{label:'机房编码',prop:'machineRoomCode'},
		{label:'所属区域',prop:'areaCode',type:'areaSelect',},
		{label:'经度',prop:'lng',type:'number',},
		{label:'纬度',prop:'lat',type:'number',},
		{label:'机房等级',prop:'machineRoomLevel',type:'select',key:'machineRoomLevel'},
		{label:'机房状态',prop:'status',type:'select',key:'useStatus'},
		{label:'投产时间',prop:'startTime',type:'time',},
		{label:'机房长度（米）',prop:'length',type:'integer',},
		{label:'机房宽度（米）',prop:'wide',type:'integer',},
		{label:'机房高度（米）',prop:'high',type:'integer',},
		{label:'建筑面积',prop:'floorArea',type:'integer',ping:true,},
		{label:'已占面积',prop:'usableArea',type:'integer',ping:true,},
		{label:'空闲面积',prop:'freeArea',type:'integer',ping:true,},
		{label:'门锁类型',prop:'doorLockType',type:'select',key:'doorLockType'},
		// {label:'运营商共享',prop:'type',type:'input',},
	],
	selectKey:{}
};
