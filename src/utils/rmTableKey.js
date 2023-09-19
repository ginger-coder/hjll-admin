module.exports = {
	zzTable:[
		{label:'站址名称',prop:'name',type:'input',isCreate:true,isUpdate:true,isInfo:true,isFirst:true,isDivider:false,firstName:'站址信息',isZz:true},

		{label:'所属区域',prop:'',type:'areaSelect',isCreate:true,isUpdate:true,isInfo:false,isZz:true},

		{label:'所属省份',prop:'provinceName',type:'areaSelect',isCreate:false,isUpdate:false,isInfo:true,isZz:true},
		{label:'所属城市',prop:'cityName',type:'areaSelect',isCreate:false,isUpdate:false,isInfo:true,isZz:true},
		{label:'所属区、县',prop:'countyName',type:'areaSelect',isCreate:false,isUpdate:false,isInfo:true,isZz:true},

		{label:'共享情况',prop:'operator',type:'input',isCreate:true,isUpdate:true,isInfo:true,isZz:true},
		{label:'产权方',prop:'usageScenario',type:'input',isCreate:true,isUpdate:true,isInfo:true,isZz:true},
		{label:'气候分区',prop:'climate',type:'select',isCreate:true,isUpdate:true,isInfo:true,isZz:true},
		{label:'站址地形',prop:'terrain',type:'select',isCreate:true,isUpdate:true,isInfo:true,isZz:true},
		{label:'资源编号',prop:'resourceCode',type:'input',isCreate:true,isUpdate:true,isInfo:true,isZz:true},
		{label:'站址运维ID',prop:'operationCode',type:'input',isCreate:true,isUpdate:true,isInfo:true,isZz:true},
		{label:'自使用运维ID',prop:'hnSiteCode',type:'input',isCreate:true,isUpdate:true,isInfo:true,isZz:true},
		{label:'站址来源',prop:'source',type:'select',isCreate:true,isUpdate:true,isInfo:true,isZz:true},
		{label:'站址细分类型',prop:'siteType',type:'select',isCreate:true,isUpdate:true,isInfo:true,isZz:true},

		{label:'站址细分类型二级分类',prop:'secondSiteType',type:'select',isCreate:true,isUpdate:true,isInfo:true,isZz:true},
		{label:'站址状态',prop:'siteStatus',type:'select',isCreate:true,isUpdate:true,isInfo:true,isZz:true},
		{label:'维护状态',prop:'maintenanceStatus',type:'select',isCreate:true,isUpdate:true,isInfo:true,isZz:true},
		{label:'站址详细地址',prop:'address',type:'input',isCreate:true,isUpdate:true,isInfo:true,isZz:true},
		{label:'经度',prop:'lng',type:'input',isCreate:true,isUpdate:true,isInfo:true,isZz:true},
		{label:'纬度',prop:'lat',type:'input',isCreate:true,isUpdate:true,isInfo:true,isZz:true},
		{label:'高度',prop:'altitude',type:'input',isCreate:true,isUpdate:true,isInfo:true,isZz:true},
		// {label:'所属区域',prop:'area',type:'input',isCreate:true,isUpdate:true,isInfo:true,isZz:true},
		// {label:'运营商',prop:'operator',type:'input',isCreate:true,isUpdate:true,isInfo:true,isZz:true},

		{label:'是否夜间免责站点',prop:'nightDisclaimer',type:'select',isCreate:true,isUpdate:true,isInfo:true,isZz:true},
		{label:'夜间免责时间段',prop:'nightExemption',type:'timeRange',isCreate:true,isUpdate:true,isInfo:true,isZz:true},
		{label:'0~6点是否可以上站',prop:'upperStation',type:'select',isCreate:true,isUpdate:true,isInfo:true,isZz:true},
		{label:'站点全免责维护环境恶略因素',prop:'disclaimer',type:'select',isCreate:true,isUpdate:true,isInfo:true,isZz:true},
		{label:'站址保障等级',prop:'securityLevel',type:'select',isCreate:true,isUpdate:true,isInfo:true,isZz:true},
		{label:' 物业属性',prop:'property',type:'select',isCreate:true,isUpdate:true,isInfo:true,isZz:true},
		{label:' 上站难易程度',prop:'difficultyLevel',type:'select',isCreate:true,isUpdate:true,isInfo:true,isZz:true},
		{label:' 上站困难原型(详细说明)',prop:'description',type:'select',isCreate:true,isUpdate:true,isInfo:true,isZz:true},
		{label:'修改时间',prop:'updateTime',type:'time',isCreate:false,isUpdate:false,isInfo:true,isZz:true},
		{label:'修改人',prop:'updateUser',type:'input',isCreate:false,isUpdate:false,isInfo:true,isZz:true},
		{label:'状态',prop:'status',type:'select',isCreate:false,isUpdate:false,isInfo:true,isZz:true},

		{label:'所属省份',prop:'provinceName',type:'input',isCreate:false,isUpdate:false,isInfo:true,isFirst:true,isDivider:true,firstName:'关联铁塔信息',isTt:true},
		{label:'所属城市',prop:'cityName',type:'input',isCreate:false,isUpdate:false,isInfo:true,isTt:true},
		{label:'所属区、县',prop:'countyName',type:'input',isCreate:false,isUpdate:false,isInfo:true,isTt:true},
		{label:'所属基站',prop:'siteName',type:'input',isCreate:false,isUpdate:false,isInfo:true,isTt:true},
		{label:'铁塔类型',prop:'towerType',type:'select',isCreate:true,isUpdate:true,isInfo:true,isTt:true},
		{label:'铁塔名称',prop:'towerName',type:'input',isCreate:true,isUpdate:true,isInfo:true,isTt:true},
		{label:'资源编号',prop:'resourceCode',type:'input',isCreate:true,isUpdate:true,isInfo:true,isTt:true},
		{label:'铁塔编码',prop:'towerCode',type:'input',isCreate:true,isUpdate:true,isInfo:true,isTt:true},
		{label:'塔桅净高度（M）',prop:'towerNetHeight',type:'input',isCreate:true,isUpdate:true,isInfo:true,isTt:true},
		{label:'天线数量',prop:'mastNum',type:'input',isCreate:true,isUpdate:true,isInfo:true,isTt:true},
		{label:'平台数量',prop:'platformNum',type:'input',isCreate:true,isUpdate:true,isInfo:true,isTt:true},
		{label:'入网时间',prop:'netTime',type:'time',isCreate:true,isUpdate:true,isInfo:true,isTt:true},
		{label:'生产厂家',prop:'manufacturer',type:'input',isCreate:true,isUpdate:true,isInfo:true,isTt:true},
		{label:'维护单位',prop:'tendingUnit',type:'input',isCreate:true,isUpdate:true,isInfo:true,isTt:true},
		{label:'垂直度',prop:'planeSurface',type:'input',isCreate:true,isUpdate:true,isInfo:true,isTt:true},
		{label:'塔构件',prop:'towerLink',type:'input',isCreate:true,isUpdate:true,isInfo:true,isTt:true},
		{label:'塔脚螺栓',prop:'towerBolt',type:'input',isCreate:true,isUpdate:true,isInfo:true,isTt:true},
		{label:'铁塔接地',prop:'towerGrounding',type:'input',isCreate:true,isUpdate:true,isInfo:true,isTt:true},
		{label:'铁塔平台',prop:'towerPlatform',type:'input',isCreate:true,isUpdate:true,isInfo:true,isTt:true},
		{label:'爬梯及护罩',prop:'ladderShield',type:'input',isCreate:true,isUpdate:true,isInfo:true,isTt:true},
		{label:'旁边有无安装铁塔空间',prop:'isTowerSpace',type:'select',isCreate:true,isUpdate:true,isInfo:true,isTt:true},
		{label:'铁塔状态',prop:'towerStatus',type:'select',isCreate:true,isUpdate:true,isInfo:true,isTt:true},
		{label:'铁塔是否外挂非运营商资产',prop:'isPylon',type:'select',isCreate:true,isUpdate:true,isInfo:true,isTt:true},
		{label:'修改时间',prop:'updateTime',type:'time',isCreate:false,isUpdate:false,isInfo:true,isTt:true},
		{label:'修改人',prop:'updateUser',type:'input',isCreate:false,isUpdate:false,isInfo:true,isTt:true},
		
		{label:'所属省份',prop:'provinceName',type:'input',isCreate:false,isUpdate:false,isInfo:true,isFirst:true,isDivider:true,firstName:'关联机房信息',isJf:true},
		{label:'所属城市',prop:'cityName',type:'input',isCreate:false,isUpdate:false,isInfo:true,isJf:true},
		{label:'所属区、县',prop:'countyName',type:'input',isCreate:false,isUpdate:false,isInfo:true,isJf:true},

		{label:'所属基站',prop:'siteName',type:'',isCreate:false,isUpdate:false,isInfo:true,isJf:true},
		{label:'机房类型及标识代码',prop:'machineType',type:'select',isCreate:false,isUpdate:false,isInfo:true,isJf:true},
		{label:'机房名称',prop:'machineName',type:'input',isCreate:false,isUpdate:false,isInfo:true,isJf:true},
		{label:'资源编号',prop:'resourceCode',type:'input',isCreate:false,isUpdate:false,isInfo:true,isJf:true},
		{label:'机房编号',prop:'machineCode',type:'input',isCreate:false,isUpdate:false,isInfo:true,isJf:true},
		{label:'机房等级',prop:'machineLevel',type:'select',isCreate:false,isUpdate:false,isInfo:true,isJf:true},
		{label:'长度',prop:'length',type:'input',isCreate:false,isUpdate:false,isInfo:true,isJf:true},
		{label:'高度',prop:'height',type:'input',isCreate:false,isUpdate:false,isInfo:true,isJf:true},
		{label:'宽度',prop:'width',type:'input',isCreate:false,isUpdate:false,isInfo:true,isJf:true},
		{label:'占用面积（平方米）',prop:'occupiedArea',type:'input',isCreate:false,isUpdate:false,isInfo:true,isJf:true},
		{label:'维护人员',prop:'userName',type:'input',isCreate:false,isUpdate:false,isInfo:true,isJf:true},
		{label:'维护人员电话',prop:'userPhone',type:'input',isCreate:false,isUpdate:false,isInfo:true,isJf:true},
		{label:'详细地址',prop:'machineAddress',type:'input',isCreate:false,isUpdate:false,isInfo:true,isJf:true},
		{label:'修改时间',prop:'updateTime',type:'time',isCreate:false,isUpdate:false,isInfo:true,isJf:true},
		{label:'修改人',prop:'updateUser',type:'input',isCreate:false,isUpdate:false,isInfo:true,isJf:true},
		{label:'状态',prop:'status',type:'select',isCreate:false,isUpdate:false,isInfo:true,isJf:true},

	],
	ttTable:[
		{label:'所属区域',prop:'',type:'areaSelect',isCreate:true,isUpdate:true,isInfo:false,},

		{label:'所属省份',prop:'provinceName',type:'areaSelect',isCreate:false,isUpdate:false,isInfo:true,isFirst:true,isDivider:false,firstName:'铁塔信息'},
		{label:'所属城市',prop:'cityName',type:'areaSelect',isCreate:false,isUpdate:false,isInfo:true},
		{label:'所属区、县',prop:'countyName',type:'areaSelect',isCreate:false,isUpdate:false,isInfo:true},

		{label:'所属基站',prop:'siteId',type:'siteSelect',isCreate:true,isUpdate:true,isInfo:false},
		{label:'所属基站',prop:'siteName',type:'',isCreate:false,isUpdate:false,isInfo:true},

		// {label:'所属机房',prop:'machineId',type:'machSelect',isCreate:true,isUpdate:true,isInfo:true},

		{label:'铁塔类型',prop:'towerType',type:'select',isCreate:true,isUpdate:true,isInfo:true},
		{label:'铁塔名称',prop:'towerName',type:'input',isCreate:true,isUpdate:true,isInfo:true},
		{label:'资源编号',prop:'resourceCode',type:'input',isCreate:true,isUpdate:true,isInfo:true},
		{label:'铁塔运维ID',prop:'towerCode',type:'input',isCreate:true,isUpdate:true,isInfo:true},
		{label:'铁塔自使用运维ID',prop:'hnTowerCode',type:'input',isCreate:true,isUpdate:true,isInfo:true},
		{label:'塔桅净高度（M）',prop:'towerNetHeight',type:'input',isCreate:true,isUpdate:true,isInfo:true},
		{label:'天线数量',prop:'mastNum',type:'input',isCreate:true,isUpdate:true,isInfo:true},
		{label:'平台数量',prop:'platformNum',type:'input',isCreate:true,isUpdate:true,isInfo:true},
		{label:'入网时间',prop:'netTime',type:'time',isCreate:true,isUpdate:true,isInfo:true},
		{label:'生产厂家',prop:'manufacturer',type:'input',isCreate:true,isUpdate:true,isInfo:true},
		{label:'维护单位',prop:'tendingUnit',type:'input',isCreate:true,isUpdate:true,isInfo:true},
		{label:'修改时间',prop:'updateTime',type:'time',isCreate:false,isUpdate:false,isInfo:true},
		{label:'修改人',prop:'updateUser',type:'input',isCreate:false,isUpdate:false,isInfo:true},

		{label:'站址名称',prop:'name',type:'input',moduleType:'zz',isInfo:true,isFirst:true,isDivider:true,firstName:'关联站址信息',},
		{label:'所属区域',prop:'',type:'areaSelect',isCreate:true,isUpdate:true,isInfo:false,isZz:true},

		{label:'所属省份',prop:'provinceName',type:'areaSelect',isCreate:false,isUpdate:false,isInfo:true,isZz:true},
		{label:'所属城市',prop:'cityName',type:'areaSelect',isCreate:false,isUpdate:false,isInfo:true,isZz:true},
		{label:'所属区、县',prop:'countyName',type:'areaSelect',isCreate:false,isUpdate:false,isInfo:true,isZz:true},

		{label:'共享情况',prop:'operator',type:'input',isCreate:true,isUpdate:true,isInfo:true,isZz:true,moduleType:'zz'},
		{label:'产权方',prop:'usageScenario',type:'input',isCreate:true,isUpdate:true,isInfo:true,isZz:true,moduleType:'zz'},
		{label:'气候分区',prop:'climate',type:'select',isCreate:true,isUpdate:true,isInfo:true,isZz:true,moduleType:'zz'},
		{label:'站址地形',prop:'terrain',type:'select',isCreate:true,isUpdate:true,isInfo:true,isZz:true,moduleType:'zz'},
		{label:'资源编号',prop:'resourceCode',type:'input',isCreate:true,isUpdate:true,isInfo:true,isZz:true,moduleType:'zz'},
		{label:'站址运维ID',prop:'operationCode',type:'input',isCreate:true,isUpdate:true,isInfo:true,isZz:true,moduleType:'zz'},
		{label:'自使用运维ID',prop:'hnSiteCode',type:'input',isCreate:true,isUpdate:true,isInfo:true,isZz:true,moduleType:'zz'},
		{label:'站址来源',prop:'source',type:'select',isCreate:true,isUpdate:true,isInfo:true,isZz:true,moduleType:'zz'},
		{label:'站址细分类型',prop:'siteType',type:'select',isCreate:true,isUpdate:true,isInfo:true,isZz:true,moduleType:'zz'},

		{label:'站址细分类型二级分类',prop:'secondSiteType',type:'select',isCreate:true,isUpdate:true,isInfo:true,isZz:true,moduleType:'zz'},
		{label:'站址状态',prop:'siteStatus',type:'select',isCreate:true,isUpdate:true,isInfo:true,isZz:true,moduleType:'zz'},
		{label:'维护状态',prop:'maintenanceStatus',type:'select',isCreate:true,isUpdate:true,isInfo:true,isZz:true,moduleType:'zz'},
		{label:'站址详细地址',prop:'address',type:'input',isCreate:true,isUpdate:true,isInfo:true,isZz:true,moduleType:'zz'},
		{label:'经度',prop:'lng',type:'input',isUpdate:true,isInfo:true,moduleType:'zz'},
		{label:'纬度',prop:'lat',type:'input',isCreate:true,isUpdate:true,isInfo:true,isZz:true,moduleType:'zz'},
		{label:'高度',prop:'altitude',type:'input',isCreate:true,isUpdate:true,isInfo:true,moduleType:'zz'},
		// {label:'所属区域',prop:'area',type:'input',isCreate:true,isUpdate:true,isInfo:true,isZz:true},
		// {label:'运营商',prop:'operator',type:'input',isCreate:true,isUpdate:true,isInfo:true,isZz:true},

		{label:'是否夜间免责站点',prop:'nightDisclaimer',type:'select',isCreate:true,isUpdate:true,isInfo:true,isZz:true,moduleType:'zz'},
		{label:'夜间免责时间段',prop:'nightExemption',type:'timeRange',isCreate:true,isUpdate:true,isInfo:true,isZz:true,moduleType:'zz'},
		{label:'0~6点是否可以上站',prop:'upperStation',type:'select',isCreate:true,isUpdate:true,isInfo:true,isZz:true,moduleType:'zz'},
		{label:'站点全免责维护环境恶略因素',prop:'disclaimer',type:'select',isCreate:true,isUpdate:true,isInfo:true,isZz:true,moduleType:'zz'},
		{label:'站址保障等级',prop:'securityLevel',type:'select',isCreate:true,isUpdate:true,isInfo:true,isZz:true,moduleType:'zz'},
		{label:' 物业属性',prop:'property',type:'select',isCreate:true,isUpdate:true,isInfo:true,isZz:true,moduleType:'zz'},
		{label:' 上站难易程度',prop:'difficultyLevel',type:'select',isCreate:true,isUpdate:true,isInfo:true,isZz:true,moduleType:'zz'},
		{label:' 上站困难原型(详细说明)',prop:'description',type:'select',isCreate:true,isUpdate:true,isInfo:true,isZz:true,moduleType:'zz'},
		{label:'修改时间',prop:'updateTime',type:'time',isCreate:false,isUpdate:false,isInfo:true,isZz:true,moduleType:'zz'},
		{label:'修改人',prop:'updateUser',type:'input',isCreate:false,isUpdate:false,isInfo:true,isZz:true,moduleType:'zz'},
		{label:'状态',prop:'status',type:'select',isCreate:false,isUpdate:false,isInfo:true,isZz:true,moduleType:'zz'},

	],
	jfTable:[
		{label:'所属区域',prop:'',type:'areaSelect',isCreate:true,isUpdate:true,isInfo:false,},

		{label:'所属省份',prop:'provinceName',type:'areaSelect',isCreate:false,isUpdate:false,isInfo:true,isFirst:true,isDivider:false,firstName:'机房信息'},
		{label:'所属城市',prop:'cityName',type:'areaSelect',isCreate:false,isUpdate:false,isInfo:true},
		{label:'所属区、县',prop:'countyName',type:'areaSelect',isCreate:false,isUpdate:false,isInfo:true},

		{label:'所属基站',prop:'siteId',type:'siteSelect',isCreate:true,isUpdate:true,isInfo:false},
		{label:'所属基站',prop:'siteName',type:'',isCreate:false,isUpdate:false,isInfo:true},

		// {label:'所属机房',prop:'machineId',type:'machSelect',isCreate:true,isUpdate:true,isInfo:true},

		{label:'机房名称',prop:'machineName',type:'input',isCreate:true,isUpdate:true,isInfo:true},
		{label:'资源名称',prop:'资源名称',type:'input',isCreate:true,isUpdate:true,isInfo:true},
		{label:'机房资源编码',prop:'resourceCode',type:'input',isCreate:true,isUpdate:true,isInfo:true},
		{label:'机房运维ID',prop:'machineCode',type:'input',isCreate:true,isUpdate:true,isInfo:true},
		{label:'机房自使用运维ID',prop:'hnMachineCode',type:'input',isCreate:true,isUpdate:true,isInfo:true},
		{label:'长度',prop:'length',type:'input',isCreate:true,isUpdate:true,isInfo:true},
		{label:'宽度',prop:'width',type:'input',isCreate:true,isUpdate:true,isInfo:true},
		{label:'高度',prop:'height',type:'input',isCreate:true,isUpdate:true,isInfo:true},
		{label:'占用面积',prop:'occupiedArea',type:'input',isCreate:true,isUpdate:true,isInfo:true},
		{label:'详细地址',prop:'machineAddress',type:'input',isCreate:true,isUpdate:true,isInfo:true},
		{label:'共享情况',prop:'operator',type:'input',isCreate:true,isUpdate:true,isInfo:true},
		{label:'是否市区',prop:'isCity',type:'input',isCreate:true,isUpdate:true,isInfo:true},
		{label:'机房性质',prop:'machineNature',type:'input',isCreate:true,isUpdate:true,isInfo:true},
		{label:'机房等级',prop:'machineLevel',type:'input',isCreate:true,isUpdate:true,isInfo:true},
		{label:'机房类型',prop:'machineType',type:'select',isCreate:true,isUpdate:true,isInfo:true},
		{label:'在用情况',prop:'isUse',type:'input',isCreate:true,isUpdate:true,isInfo:true},
		{label:'资源数量',prop:'-',type:'input',isCreate:true,isUpdate:true,isInfo:true},

		{label:'修改时间',prop:'updateTime',type:'time',isCreate:false,isUpdate:false,isInfo:true},
		{label:'修改人',prop:'updateUser',type:'input',isCreate:false,isUpdate:false,isInfo:true},

		{label:'站址名称',prop:'name',type:'input',moduleType:'zz',isInfo:true,isFirst:true,isDivider:true,firstName:'关联站址信息',},
		{label:'所属区域',prop:'',type:'areaSelect',isCreate:true,isUpdate:true,isInfo:false,isZz:true},

		{label:'所属省份',prop:'provinceName',type:'areaSelect',isCreate:false,isUpdate:false,isInfo:true,isZz:true},
		{label:'所属城市',prop:'cityName',type:'areaSelect',isCreate:false,isUpdate:false,isInfo:true,isZz:true},
		{label:'所属区、县',prop:'countyName',type:'areaSelect',isCreate:false,isUpdate:false,isInfo:true,isZz:true},

		{label:'共享情况',prop:'operator',type:'input',isCreate:true,isUpdate:true,isInfo:true,isZz:true,moduleType:'zz'},
		{label:'产权方',prop:'usageScenario',type:'input',isCreate:true,isUpdate:true,isInfo:true,isZz:true,moduleType:'zz'},
		{label:'气候分区',prop:'climate',type:'select',isCreate:true,isUpdate:true,isInfo:true,isZz:true,moduleType:'zz'},
		{label:'站址地形',prop:'terrain',type:'select',isCreate:true,isUpdate:true,isInfo:true,isZz:true,moduleType:'zz'},
		{label:'资源编号',prop:'resourceCode',type:'input',isCreate:true,isUpdate:true,isInfo:true,isZz:true,moduleType:'zz'},
		{label:'站址运维ID',prop:'operationCode',type:'input',isCreate:true,isUpdate:true,isInfo:true,isZz:true,moduleType:'zz'},
		{label:'自使用运维ID',prop:'hnSiteCode',type:'input',isCreate:true,isUpdate:true,isInfo:true,isZz:true,moduleType:'zz'},
		{label:'站址来源',prop:'source',type:'select',isCreate:true,isUpdate:true,isInfo:true,isZz:true,moduleType:'zz'},
		{label:'站址细分类型',prop:'siteType',type:'select',isCreate:true,isUpdate:true,isInfo:true,isZz:true,moduleType:'zz'},

		{label:'站址细分类型二级分类',prop:'secondSiteType',type:'select',isCreate:true,isUpdate:true,isInfo:true,isZz:true,moduleType:'zz'},
		{label:'站址状态',prop:'siteStatus',type:'select',isCreate:true,isUpdate:true,isInfo:true,isZz:true,moduleType:'zz'},
		{label:'维护状态',prop:'maintenanceStatus',type:'select',isCreate:true,isUpdate:true,isInfo:true,isZz:true,moduleType:'zz'},
		{label:'站址详细地址',prop:'address',type:'input',isCreate:true,isUpdate:true,isInfo:true,isZz:true,moduleType:'zz'},
		{label:'经度',prop:'lng',type:'input',isUpdate:true,isInfo:true,moduleType:'zz'},
		{label:'纬度',prop:'lat',type:'input',isCreate:true,isUpdate:true,isInfo:true,isZz:true,moduleType:'zz'},
		{label:'高度',prop:'altitude',type:'input',isCreate:true,isUpdate:true,isInfo:true,moduleType:'zz'},
		// {label:'所属区域',prop:'area',type:'input',isCreate:true,isUpdate:true,isInfo:true,isZz:true},
		// {label:'运营商',prop:'operator',type:'input',isCreate:true,isUpdate:true,isInfo:true,isZz:true},

		{label:'是否夜间免责站点',prop:'nightDisclaimer',type:'select',isCreate:true,isUpdate:true,isInfo:true,isZz:true,moduleType:'zz'},
		{label:'夜间免责时间段',prop:'nightExemption',type:'timeRange',isCreate:true,isUpdate:true,isInfo:true,isZz:true,moduleType:'zz'},
		{label:'0~6点是否可以上站',prop:'upperStation',type:'select',isCreate:true,isUpdate:true,isInfo:true,isZz:true,moduleType:'zz'},
		{label:'站点全免责维护环境恶略因素',prop:'disclaimer',type:'select',isCreate:true,isUpdate:true,isInfo:true,isZz:true,moduleType:'zz'},
		{label:'站址保障等级',prop:'securityLevel',type:'select',isCreate:true,isUpdate:true,isInfo:true,isZz:true,moduleType:'zz'},
		{label:' 物业属性',prop:'property',type:'select',isCreate:true,isUpdate:true,isInfo:true,isZz:true,moduleType:'zz'},
		{label:' 上站难易程度',prop:'difficultyLevel',type:'select',isCreate:true,isUpdate:true,isInfo:true,isZz:true,moduleType:'zz'},
		{label:' 上站困难原型(详细说明)',prop:'description',type:'select',isCreate:true,isUpdate:true,isInfo:true,isZz:true,moduleType:'zz'},
		{label:'修改时间',prop:'updateTime',type:'time',isCreate:false,isUpdate:false,isInfo:true,isZz:true,moduleType:'zz'},
		{label:'修改人',prop:'updateUser',type:'input',isCreate:false,isUpdate:false,isInfo:true,isZz:true,moduleType:'zz'},
		{label:'状态',prop:'status',type:'select',isCreate:false,isUpdate:false,isInfo:true,isZz:true,moduleType:'zz'},
	],

	// jfTable:[
	// 	{key:'provinceName',label:'所属省份'},
	// 	{key:'cityName',label:'所属城市'},
	// 	{key:'countyName',label:'所属区县'},
	// 	{key:'siteName',label:'所属基站'},
	// 	{key:'machineType',label:'机房类型',type:'otherType'},
	// 	{key:'machineName',label:'机房名称'},
	// 	{key:'resourceCode',label:'资源编号'},
	// 	{key:'machineCode',label:'机房编号'},
	// 	{key:'machineLevel',label:'机房等级',type:'otherType'},
	// 	{key:'length',label:'长度(M)'},
	// 	{key:'width',label:'宽度(M)'},
	// 	{key:'height',label:'高度(M)'},
	// 	{key:'occupiedArea',label:'占用面积(平方米)'},
	// 	{key:'userName',label:'维护人员'},
	// 	{key:'userPhone',label:'维护人员电话'},
	// 	{key:'machineAddress',label:'详细地址'},
	// 	{key:'createTime',label:'创建时间'},
	// 	{key:'updateTime',label:'修改时间'},
	// 	{key:'createTime_',label:'创建时间'},
	// 	{key:'updateTime_',label:'修改时间'},
	// 	{key:'remark',label:'备注'},
	// 	{key:'status',label:'状态',type:'status'},
	// ],
	xdcTable:[
		{key:'provinceName',label:'所属省份'},
		{key:'cityName',label:'所属城市'},
		{key:'countyName',label:'所属区县'},
		{key:'siteName',label:'所属站点'},
		{key:'machineName',label:'所属机房'},
		{key:'name',label:'蓄电池名称'},
		{key:'resourceCode',label:'资源编号'},
		{key:'batteryCode',label:'蓄电池编码'},
		{key:'fixedAssetsCode',label:'固定资产编号'},
		{key:'deviceType',label:'设备类型',type:'otherType'},
		{key:'unitFactory',label:'设备厂家'},
		{key:'unitType',label:'设备型号'},
		{key:'unitBrand',label:'设备品牌'},
		{key:'producedDate',label:'生产日期'},
		{key:'deviceCount',label:'设备数量'},
		{key:'capacity',label:'单组额定容量（AH）'},
		{key:'powerLevel',label:'单体电压等级（V）',type:'otherType'},
		{key:'batteryCount',label:'单组蓄电池个数（只）'},
		{key:'isVariant',label:'外观有无变形',type:'isTrue'},
		{key:'isWeeping',label:'是否漏液',type:'isTrue'},
		{key:'isErosion',label:'连接铜排有无腐蚀',type:'isTrue'},
		{key:'isCollapse',label:'电池支撑部位是否有沉重塌陷变形问题',type:'otherType'},
		{key:'capacityMethod',label:'容量测试方法',type:'otherType'},
		{key:'meterBrand',label:'容量测试仪表品牌'},
		{key:'scrapBattery',label:'测试结果：报废电池只数（只）'},
		{key:'manufacturer',label:'供应商'},
		{key:'replaceCompany',label:'原代维公司'},
		{key:'startUseDate',label:'开始使用时间'},
		{key:'serviceDate',label:'维保期'},
		{key:'serviceMan',label:'维保厂家'},
		{key:'isPolicy',label:'是否出保'},
		{key:'isPolicyDate',label:'出保时间'},
		{key:'remark',label:'备注'},
		{key:'createTime_',label:'创建时间'},
		{key:'updateTime_',label:'修改时间'},
		{key:'createUser',label:'创建人'},
		{key:'updateUser',label:'修改人'},
		{key:'status',label:'状态',type:'status'},
	],
	kgdyTable:[
		{key:'provinceName',label:'所属省份'},
		{key:'cityName',label:'所属城市'},
		{key:'countyName',label:'所属区县'},
		{key:'companyName',label:'共享运营商'},
		{key:'siteName',label:'所属站点'},
		{key:'machineName',label:'所属机房'},
		{key:'name',label:'开关电源名称'},
		{key:'resourceCode',label:'资源编号'},
		{key:'switchPowerCode',label:'开关电源编码'},
		{key:'fixedAssetsCode',label:'固定资产编号'},
		{key:'deviceCount',label:'设备数量'},
		{key:'unitFactory',label:'设备厂家'},
		{key:'unitType',label:'设备型号'},
		{key:'unitBrand',label:'设备品牌'},
		{key:'producedDate',label:'生产日期'},
		{key:'monitorModule',label:'监控模块型号'},
		{key:'efficientModule',label:'高效整流模块总数（块）'},
		{key:'generalModule',label:'普通整流模块总数（块）'},
		{key:'rectifierModule',label:'整流模块型号'},
		{key:'twice_power',label:'开关电源系统是否具有二次下电功能',type:'isTrue'},
		{key:'residueSlot',label:'剩余槽位数（个）',type:'isTrue'},
		{key:'pilotLamp',label:'告警指示灯状态',type:'radius'},
		{key:'antiThunder',label:'防雷模块指示是否正常',type:'isTrue'},
		{key:'moduleFunction',label:'模块功能是否正常',type:'isTrue'},
		{key:'ratedPower',label:'额定输出电压（V）',type:'otherType'},
		{key:'monitor',label:'监控显示屏是否正常',type:'isTrue'},
		{key:'replaceCompany',label:'监控显示屏是否正常',type:'原代维公司'},
		{key:'switchType',label:'开关电源类型',type:'otherType'},
		{key:'startUseDate',label:'开始使用时间'},
		{key:'serviceDate',label:'维保期'},
		{key:'serviceMan',label:'维保厂家'},
		{key:'isPolicy',label:'是否出保'},
		{key:'isPolicyDate',label:'出保时间'},
		{key:'remark',label:'备注'},
		{key:'createTime_',label:'创建时间'},
		{key:'updateTime_',label:'修改时间'},
		{key:'createUser',label:'创建人'},
		{key:'updateUser',label:'修改人'},
		{key:'status',label:'状态',type:'status'},
	],
	fsuTable:[
		{key:'provinceName',label:'所属省份'},
		{key:'cityName',label:'所属城市'},
		{key:'countyName',label:'所属区县'},
		{key:'companyName',label:'共享运营商'},
		{key:'siteName',label:'所属站点'},
		{key:'towerName',label:'所属铁塔'},
		{key:'machineName',label:'所属机房'},
		{key:'name',label:'FSU名称'},
		{key:'resourceCode',label:'资源编号'},
		{key:'fsuCode',label:'FSU编号'},
		{key:'lng',label:'经度'},
		{key:'lat',label:'纬度'},
		{key:'power',label:'功率(W)'},
		{key:'length',label:'长度(M)'},
		{key:'width',label:'宽度(M)'},
		{key:'height',label:'高度(M)'},
		{key:'interfaceNum',label:'接口数量'},
		{key:'unitFactory',label:'设备厂家'},
		{key:'unitType',label:'设备型号'},
		{key:'unitBrand',label:'设备品牌'},
		{key:'producedDate',label:'生产日期'},
		{key:'devicePerson',label:'设备负责人'},
		{key:'devicePersonPhone',label:'设备负责人联系方式'},
		{key:'useStatus',label:'使用状态'},
		{key:'serviceDate',label:'维保期'},
		{key:'serviceMan',label:'维保厂家'},
		{key:'isPolicy',label:'是否出保'},
		{key:'isPolicyDate',label:'出保时间'},
		{key:'remark',label:'备注'},
		{key:'createTime_',label:'创建时间'},
		{key:'updateTime_',label:'修改时间'},
		{key:'createUser',label:'创建人'},
		{key:'updateUser',label:'修改人'},
		{key:'status',label:'状态',type:'status'},
	],
	getLabel: (list = [], value) => {
		const item = list.filter((item) => `${item.value}` === `${value}`)[0] || { label: "-" };
		return item.label;
	},
	selectKey:{
		climate:
			[{ label: "温暖", value: '1', },]
		,
		terrain:[
			{ label: "高山", value: 1, },
			{ label: "平原", value: 2, },
			{ label: "丘陵", value: 3, },
		],
		property:[
			{ label: "个人", value: 1, },
			{ label: "机关企事业单位", value: 2, },
			{ label: "政府规划", value: 3, },
		],
		difficultyLevel:[
			{ label: "容易上站", value: 1, },
			{ label: "无法上站", value: 2, },
			{ label: "需协调上站", value: 3, },
		],
		upperStation:[
			{ label: "是", value: 1, },
			{ label: "否", value: 2, },
		],
		status:[
			{ label: "正常", value: 0, },
			{ label: "禁用", value: 1, },
		],
		siteStatus:[
			{ label: "交维", value: 1, },
		],
		source:[
			{ label: "自有站", value: 1, },
			{ label: "社会站", value: 2, },
		],
		disclaimer:[
			{ label: "高山站", value: 1, },
			{ label: "海岛站", value: 2, },
			{ label: "其它", value: 3, },
			{ label: "沙漠站", value: 4, },
			{ label: "新能源站", value: 5, },
		],
		maintenanceStatus:[
			{ label: "在建", value: 1, },
			{ label: "在网", value: 2, },
			{ label: "待注销", value: 3, },
		],
		nightDisclaimer:[
			{ label: "是", value: 1, },
			{ label: "否", value: 2, },
		],
		siteType:[
			{ label: "机房站", value: 1, },
			{ label: "机柜站", value: 2, },
			{ label: "隧道室分站", value: 3, },
			{ label: "拉远站", value: 4, },
			{ label: "楼宇室分站", value: 5, },
			{ label: "微站", value: 6, },
			{ label: "塔站", value: 7, },
			{ label: "宏站", value: 8, },
			{ label: "暂无数据", value: 9, },
			{ label: "室分站", value: 10, },
			{ label: "宏站远供站", value: 11, },
			{ label: "拉远远供站", value: 12, },
			
		],
		deviceType:[
			{value:1,label:'AGM蓄电池'},
			{value:2,label:'胶体蓄电池'},
			{value:3,label:'磷酸铁锂蓄电池'},
			{value:4,label:'其他'},
			{value:5,label:'锂电蓄电池'},
			{value:6,label:'普通阀控密封铅酸蓄电池'},
			{value:7,label:'蓄电池恒温箱'},
			{value:8,label:'暂无分类'},
		],
		capacityMethod:[
			{value:1,label:'内阻法'},
			{value:2,label:'电导法'},
		],
		isCollapse:[
			{value:1,label:'有塌陷变形'},
			{value:2,label:'无塌陷变形'},
		],
		powerLevel:[
			{value:1,label:'12V'},
			{value:2,label:'2V'},
			{value:3,label:'6V'},
		],

		ratedPower:[
			{value:1,label:'分列式'},
			{value:2,label:'组合式'},
		],
		hotAsk:[
			{value:0,label:'有'},
			{value:1,label:'无'},
		],
		switchType:[
			{value:1,label:'-48V'},
			{value:2,label:'-24V'},
		],

		// fsu
		useStatus:[
			{value:1,label:'工程'},
			{value:2,label:'现网'},
			{value:3,label:'空载'},
			{value:4,label:'退网'},
		],
		// 机房
		machineType: [
			{ label: "框架机房", value: 1, },
			{ label: "砖混房屋", value: 2, },
			{ label: "彩钢板机房", value: 3, },
			{ label: "一体化机房", value: 4, },
			{ label: "一体化机柜", value: 5, },
			{ label: "无机房", value: 6, },
			{ label: "暂无分类", value: 7, },
		],
		machineLevel:[
			{value:1,label:'A类'},
			{value:2,label:'B类'},
		],
		firstPowerWay:[
			{value:1 , label:'直供'},
			{value:2 , label:'转供'},
			{value:3 , label:'风力发电'},
			{value:4 , label:'太阳能供电'},
			{value:5 , label:'风光互补'},
			{value:6 , label:'其他新能源,机房未交接'},
			
		],
		isCity: [
			{ label: "非市区", value: "0", },
			{ label: "市区", value: "1", },
		],
		secondSiteType:[
			{value:1,label:'密集市区'},
			{value:2,label:'一般市区'},
			{value:3,label:'县城'},
			{value:4,label:'乡镇'},
			{value:5,label:'农村'},
			{value:6,label:'3A以上景区'},
			{value:7,label:'其他景区'},
			{value:8,label:'校园'},
			{value:9,label:'高铁线'},
			{value:10,label:'高速'},
			{value:11,label:'国道'},
			{value:12,label:'其他交通干线'},
			{value:13,label:'住宅小区'},
			{value:14,label:'商业市场'},
			{value:15,label:'工业园'},
			{value:16,label:'室分-宾馆酒店'},
			{value:17,label:'室分-餐饮娱乐场所'},
			{value:18,label:'室分-车站'},
			{value:19,label:'室分-大型场馆'},
			{value:20,label:'室分-大型商场'},
			{value:21,label:'室分-党政机关'},
			{value:22,label:'室分-地铁'},
			{value:23,label:'室分-高铁'},
			{value:24,label:'室分-机场'},
			{value:25,label:'室分-码头'},
			{value:26,label:'室分-商务楼宇'},
			{value:27,label:'室分-隧道'},
			{value:28,label:'室分-校园'},
			{value:29,label:'室分-医院'},
			{value:30,label:'室分-其'}
		],
		secondPowerWay:[
			{value:1 , label:'市电10KV'},
			{value:2 , label:'市电220V'},
			{value:3 , label:'市电380V'},
			{value:4 , label:'风力发电'},
			{value:5 , label:'太阳能供电'},
			{value:6 , label:'风光互补风光互补'},
			{value:6 , label:'其他新能源,机房未交接'},
		],
		backUpPower:[
			{value:0 , label:'无'},
			{value:2 , label:'2组'},
		],
		isNightSite:[
			{value:0 , label:'是'},
			{value:1 , label:'否'},
		],
		isPower:[
			{value:1 , label:'是'},
			{value:2 , label:'否'},
		],
		isTowerSpace:[
			{value:1 , label:'有'},
			{value:2 , label:'无'},
		],
		nightService:[
			{value:0 , label:'是'},
			{value:1 , label:'否'},
		],
		towerStatus:[
			{value:0 , label:'正常'},
			{value:1 , label:'禁用'},
		],
		isPylon:[
			{value:1 , label:'是'},
			{value:2 , label:'否'},
		],
		basicElectricity:[
			{value:1 , label:'市区3小时保障市区3小时保障'},
			{value:2 , label:'无备电'},
		],
		oil:[
			{value:1 , label:'固定油机'},
			{value:2 , label:'无'},
		],
		oilChargeType:[
			{value:1 , label:'按次'},
			{value:2 , label:'包干'},
		],
		additionalType:[
			{ label: "无", value: 0, },
			{ label: "1小时", value: 1, },
			{ label: "2小时", value: 2, },
			{ label: "3小时", value: 3, },
			{ label: "4小时", value: 4, },
			{ label: "5小时", value: 5, },
			{ label: "6小时", value: 6, },
			{ label: "7小时", value: 7, },
		],
		machineType: [
			{ label: "框架机房", value: 1, },
			{ label: "砖混房屋", value: 2, },
			{ label: "彩钢板机房", value: 3, },
			{ label: "一体化机房", value: 4, },
			{ label: "一体化机柜", value: 5, },
			{ label: "无机房", value: 6, },
			{ label: "暂无分类", value: 7, },
		],
		securityLevel: [
			{ label: "L1-运营商传输节点站（铁塔产权）", value: 1, },
			{ label: "L2-党政军重保站", value: 2, },
			{ label: "L3-运营商重保站（含乡镇重保站）", value: 3, },
			{ label: "L4-运营商高等级站", value: 4, },
			{ label: "L5-普通站址", value: 5, },
		],
		towerType: [
			{ label: "H杆塔", value: 1, },
			{ label: "单管塔", value: 2, },
			{ label: "地面支撑杆", value: 3, },
			{ label: "仿生树", value: 4, },
			{ label: "简易落地塔", value: 5, },
			{ label: "角钢塔", value: 6, },
			{ label: "楼顶景观塔", value: 7, },
			{ label: "楼面抱杆", value: 8, },
			{ label: "楼面单管塔", value: 9, },
			{ label: "楼面角钢塔", value: 10, },
			{ label: "楼面拉线塔", value: 11, },
			{ label: "楼面美化塔", value: 12, },
			{ label: "楼面美化天线外罩", value: 13, },
			{ label: "楼面三管塔", value: 14, },
			{ label: "楼面增高架", value: 15, },
			{ label: "楼面增高架", value: 16, },
			{ label: "路灯杆塔", value: 17, },
			{ label: "落地拉线塔", value: 18, },
			{ label: "落地增高架", value: 19, },
			{ label: "三管塔", value: 20, },
			{ label: "双轮景观塔", value: 21, },
			{ label: "水泥杆塔", value: "2" },
			{ label: "四管塔", value: 23, },
			{ label: "通信灯杆塔", value: 24, },
			{ label: "一体化塔房", value: 25, },
			{ label: "造型景观塔", value: 26, },
			{ label: "暂无分类", value: 27, },
			{ label: "楼面支撑杆", value: 28, },
		],
	}
};