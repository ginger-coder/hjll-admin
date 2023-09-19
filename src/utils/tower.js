module.exports = {
	ironTower:[
		{label:'铁塔编码',prop:'towerCode'},
		{label:'所属区域',prop:'areaCode',type:'areaSelect',},
		{label:'经度',prop:'lng',type:'number',},
		{label:'纬度',prop:'lat',type:'number',},
		{label:'生产厂商',prop:'manufacturer',type:'select',key:'manufacturer'},
		{label:'铁塔状态',prop:'status',type:'select',key:'useStatus'},
		{label:'天线数量（根）',prop:'antennaNum',type:'integer',},
		{label:'塔桅净高度（米）',prop:'mastHigh',type:'integer',},
		{label:'承受风压值(kN/m2)',prop:'windPressureResistanceValue',type:'integer',},
		{label:'投产时间',prop:'startTime',type:'time',},
		{label:'维保厂家',prop:'maintenanceManufacturer',type:'select',key:'manufacturer'},
		{label:'维保期限（年）',prop:'maintenancePeriod',type:'integer',},
		{label:'出保时间',prop:'releaseTime',type:'time',},
		{label:'垂直度',prop:'perpendicularity',type:'select',key:'perpendicularity'},
		{label:'铁塔平台',prop:'towerPlatform',type:'select',key:'towerPlatform'},
		{label:'爬梯及护罩',prop:'ladderAndShield',type:'select',key:'ladderAndShield'},
		{label:'塔结构',prop:'towerStructure',type:'select',key:'towerStructure'},
		{label:'塔脚螺栓',prop:'towerBolt',type:'select',key:'towerBolt'},
		{label:'铁塔接地',prop:'towerGrounding',type:'select',key:'towerGrounding'},
		{label:'旁边有无安装铁塔空间',prop:'towerSpace',type:'select',key:'towerSpace'},
	],
	linkData:[
		{label:'抱杆类型',prop:'towerHugRodType',},
		{label:'抱杆状态',prop:'status',},
		{label:'抱杆高度（米）',prop:'high',},
	],
	linkDatas:[
		{label:'平台类型',prop:'towerPlatformType',},
		{label:'平台状态',prop:'status',},
		{label:'平台高度（米）',prop:'high',},
	],
	selectKey:{}
};