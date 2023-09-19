const validateLongitude = (rule, value, callback) => {
	//经度,整数部分为0-180小数部分为0到6位
	var longreg = /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/
	if (!longreg.test(value)) {
	  callback(new Error('经度整数部分为0-180,小数部分为0到6位!'))
	}
	callback()
  }
  const validateLatitude = (rule, value, callback) => {
	//纬度,整数部分为0-90小数部分为0到6位
	var latreg = /^(\-|\+)?([0-8]?\d{1}\.\d{0,6}|90\.0{0,6}|[0-8]?\d{1}|90)$/
	if (!latreg.test(value)) {
	  callback(new Error('纬度整数部分为0-90,小数部分为0到6位!'))
	}
	callback()
  }
  function isvalidPhone(phone) {
	const reg = /^1([38][0-9]|4[014-9]|[59][0-35-9]|6[2567]|7[0-8])\d{8}$/
	return reg.test(phone)
  }
  const validPhone = (rule, value, callback) => {
	if (!value) {
	  callback(new Error('请输入电话号码'))
	} else if (!isvalidPhone(value)) { //判断用户输入的值是否符合规则
	  callback(new Error('请输入正确的11位手机号码'))
	} else {
	  callback()
	}
  }
  const validCascader = (rule, value, callback) => {
	console.log(value)
	if (!value) {
	  callback(new Error('请选择所属区域'))
	} else {
	  callback();
	}
  }
  const checkData = (rule, value, callback) =>{
    if(value) {
        if (/[\u4E00-\u9FA5]/g.test(value)) {
            callback(new Error('不能含有中文'))
        } else {
            callback()
        }
    }
    callback()
  }
  const checkAge = (rule, value, callback) => {
	if(value){
	  if (!/(^[0-9]\d*$)/.test(value)) {
	  	callback(new Error('请输入数字值'))
	  } else {
		callback()
	  }
	}else{
		callback(new Error('请输入必填项'))
	}
  }
  const checkAge2 = (rule, value, callback) => {
	if(value){
		if (!/(^[0-9]\d*$)/.test(value)) {
		callback(new Error('请输入数字值'))
		} else {
		if (value > 200) {
		  callback(new Error('不能超过200'))
		} else {
		  callback()
		}
		}
	  }else{
		  callback(new Error('请输入必填项'))
	  }
  }
module.exports = {
	rules:{
		areaCode:[{ required: true, trigger: "change" ,validator: validCascader}],
		lat:[ { required: true, validator: validateLatitude, trigger: 'blur' },
		{ validator: validateLatitude, trigger: 'change' }],
		lng:[{ required: true, validator: validateLongitude, trigger: 'blur' },
		{ validator: validateLongitude, trigger: 'change' }],
		machineRoomLevel:[{ required: true, message: "机房等级", trigger: "change" }],
		machineRoomStatus:[{ required: true, message: "机房状态", trigger: "change" }],
		machineRoomType:[{ required: true, message: "机房细分类型", trigger: "change" }],
		towerType:[{ required: true, message: "铁塔细分类型", trigger: "change" }],
		// towerHugRodName:[{ required: true, message: "抱杆名称", trigger: "blur" }],
		// towerHugRodType:[{ required: true, message: "抱杆类型", trigger: "change" }],
		// status:[{ required: true, message: "维护状态", trigger: "change" }],
		stationType:[{ required: true, message: "基站细分类型", trigger: "change" }],
		stationName:[{ required: true, message: "基站名称", trigger: "blur" }],
		address:[{ required: true, message: "基站详细地址", trigger: "blur" }],
		status:[{ required: true, message: "基站状态", trigger: "blur" }],
		secondStatus:[{ required: true, message: "基站二级状态", trigger: "blur" }],
		startTime:[{ required: true, message: "开始使用时间", trigger: "blur" }],
		protectionLevel:[{ required: true, message: "基站保障等级", trigger: "blur" }],
		terrain:[{ required: true, message: "基站地形", trigger: "blur" }],
		weather:[{ required: true, message: "气候分区", trigger: "blur" }],
		// operator:[{ required: true, message: "运营商共享情况", trigger: "blur" }],
		// stationType:[{ required: true, message: "站型", trigger: "change" }],
		// deviceStandard:[{ required: true, message: "设备制式", trigger: "change" }],
		// preserveLevel:[{ required: true, message: "基站维护服务等级", trigger: "change" }],
		// powerGenerationService:[{ required: true, message: "是否购买发电服务", trigger: "change" }],
		// rentStartTime:[{ required: true, message: "起租时间", trigger: "change" }],
		// rentTerm:[{ required: true, message: "租期（年）", trigger: "blur" }],
		// rentEndTime:[{ required: true, message: "租期截止日期", trigger: "change" }],
		realEstateContacts:[{ required: true, message: "物业联系人", trigger: "blur" }],
		realEstatePhone:[{ required: true, trigger: "blur", validator: validPhone }],
		getInStation:[{ required: true, message: "0-6点是否可以上站", trigger: "change" }],
		powerSupplyModeFirst:[{ required: true, message: "供电方式（一级）", trigger: "change" }],
		powerSupplyModeSecond:[{ required: true, message: "供电方式（二级）", trigger: "change" }],
		powerSupplyDeptPhone:[{ required: true, trigger: "blur", validator: validPhone }],
		powerGenerationCondition:[{ required: true, message: "是否具备发电条件", trigger: "change" }],
		batterySupportExtraTime:[{ required: true, trigger: "blur", validator: checkAge }],
		batterySupportTime:[{ required: true,validator: checkAge, trigger: "blur" }],
		generationWaitingTime:[{ required: true, validator: checkAge, trigger: "blur" }],
		voltageGateRestriction:[{ required: true, message: "发电电压限制（v）", trigger: "change" }],
		requiredEnginePower:[{ required: true, trigger: "blur" ,validator: checkAge2,}],
		deviceType:[{ required: true, message: "设备类型", trigger: "change" }],
		deviceSecondType:[{ required: true, message: "设备细分类型", trigger: "change" }],
		deviceVersion:[{ required: true, trigger: "blur",validator: checkData }],
		enduranceTime:[{ required: true, message: "续航时长（小时）", trigger: "blur" }],
		regStatus:[{ required: true, message: "注册状态", trigger: "change" }],
		ratedPower:[{ required: true, message: "额定功率（KVA）", trigger: "blur" }],
		ratedWorkingVoltage:[{ required: true, message: "额定工作电压（V）", trigger: "blur" }],
		tankVolume:[{ required: true, message: "油箱容积（L）", trigger: "blur" }],
	}
};
