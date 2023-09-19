module.exports = {
	comm: [
		{ label: "性别", value: "gender" },
		{ label: "学历", value: "education" },
		{ label: "学位", value: "degree" },
	],
	// 性别
	gender: [
		{ label: "保密", value: 0 },
		{ label: "男", value: 1 },
		{ label: "女", value: 2 },
	],
	// 学历
	education: [
		{ label: "小学", value: "primary" },
		{ label: "初中", value: "junior high" },
		{ label: "高中", value: "Regular High" },
		{ label: "大学专科", value: "junior college" },
		{ label: "大学本科", value: "Undergraduate Studies" },
		{ label: "研究生", value: "PG" },
	],
	//学位
	degree: [
		{ label: "学士", value: "bachelor" },
		{ label: "硕士", value: "master" },
		{ label: "博士", value: "doctor" },
	],
	ispStatus: {
        signType: [
            {
                label: '法人代表认证',
                value: 1
            },
            {
                label: '代理人认证',
                value: 2
            },
            {
                label: '个体工商户认证',
                value: 3
            },
        ],
        signStatus: [
            {
                label: '全部',
                value: ''
            },
            {
                label: '认证成功',
                value: 1
            },
            {
                label: '认证失败',
                value: 3
            },
        ],
        pdfSignStatus: [
            {
                label: '全部',
                value: ''
            },
            {
                label: '未发起',
                value: 0
            },
            {
                label: '待签署',
                value: 1
            },
            {
                label: '已拒签',
                value: 2
            },
            {
                label: '已完成',
                value: 3
            },
            {
                label: '已过期',
                value: 4
            },
        ],
		page: [
			{ label: "未认证", value: "0" },
			{ label: "待审核", value: "1" }, 
			{ label: "已认证", value: "2" },
			{ label: "认证失败", value: "3" },
		],
		verify: [
			{ label: "等待验证",text: "等待验证", value: "0" },
			{ label: "验证成功",text: "验证成功", value: "1" },
			{ label: "验证失败",text: "验证失败", value: "2" },
		],
		verifyWay: [
			{ label: "法定代表人验证",text: "法定代表人验证", value: "0" },
			{ label: "对公账户验证", text: "对公账户验证", value: "1" },
		],
		audit: [
			{ label: "待审核", text: "待审核", value: "0" },
			{ label: "审核通过", text: "审核通过", value: "1" },
			{ label: "审核未通过", text: "审核未通过", value: "2" },
		],
		audit2: [
			{ label: "待审核", text: "待审核", value: "0" },
			{ label: "审核通过", text: "审核通过", value: "1" },
			{ label: "审核未通过", text: "审核未通过", value: "2" },
			{ label: "弃用", text: "弃用", value: "3" },
		],
	},
	ompStatus: {
		page: [
			// { label: "待实名认证", value: "0" },
			// { label: "待上岗培训", value: "1" },
			// { label: "上岗培训中", value: "2" },
			// { label: "未通过上岗培训", value: "3" },
			// { label: "待理论考试", value: "4" },
			// { label: "理论考试中", value: "5" },
			// { label: "未通过理论考试", value: "6" },
			// { label: "待实操考试", value: "7" },
			// { label: "实操考试中", value: "8" },
			// { label: "未通过实操考试", value: "9" },
			// { label: "待签约", value: "10" },
			// { label: "已签约", value: "11" },
			{ label: "未实名", text: "未实名", value: 1 },
			{ label: "未签约", text: "未签约", value: 2 },
			{ label: "未考试", text: "未考试", value: 3 },
			{ label: "已完成", text: "已实名", value: 4 },
            // 1未实名，2未签约，3未考试，4已完成
		],
		role: [
			{ label: "关闭", value: "0" },
			{ label: "开启", value: "1" },
		],
		skill: [
			{ label: "关闭", value: "0" },
			{ label: "开启", value: "1" },
		],
		cert: [
			{ label: "关闭", value: "0" },
			{ label: "开启", value: "1" },
		],
		sign: [
			{ label: "未签约", value: "0" },
			{ label: "已签约", value: "1" },
			{ label: "待审核", value: "2" },
		],
	},
	orderStatus: [
		// 未派单：0
		// 未派单：1
		// 待确认（强制派单给别人需要接单人确认）：2
		// 已接单：3
		// 已出发：4
		// 已到达：5
		// 处理中：6
		// 已回单：7
		// 已确认（前端确认）：8
		// 已完成：9
		// 转让：10
		// 后台确认：11
		{ label: "未派单", value: "0", class: "info" },
		{ label: "已派单", value: "1", class: "success" },
		{ label: "待接单人确认", value: "2", class: "warning" },
		{ label: "已接单", value: "3", class: "success" },
		{ label: "已出发", value: "4", class: "success" },
		{ label: "已到达", value: "5", class: "success" },
		{ label: "处理中", value: "6", class: "warning" },
		{ label: "已回单", value: "7", class: "success" },
		{ label: "已确认", value: "11", class: "success" },
		{ label: "已完成", value: "9", class: "success" },
		{ label: "未提交", value: "20", class: "info" },
		{ label: "待审批", value: "21", class: "success" },
		{ label: "已通过", value: "22", class: "success" },
		{ label: "已驳回", value: "23", class: "warning" },
		{ label: "已过期", value: "24", class: "warning" },
	],
	orderErrStatus: [
		{ label: "全部", value: "7", class: "success" },
		{ label: "超时未抢单", value: "6", class: "success" },
		{ label: "超时未确认", value: "2", class: "success" },
		{ label: "超时未出发", value: "3", class: "warning" },
		{ label: "超时未到达", value: "4", class: "success" },
		{ label: "超时未完成", value: "5", class: "success" },
	],
	isCity: [
		{ label: "非市区", value: "0", },
		{ label: "市区", value: "1", },
	],
	siteType: [
		{ label: "机房站", value: "1", },
		{ label: "机柜站", value: "2", },
		{ label: "隧道室分站", value: "3", },
		{ label: "拉远站", value: "4", },
		{ label: "楼宇室分站", value: "5", },
		{ label: "微站", value: "6", },
		{ label: "塔站", value: "7", },
		{ label: "宏站", value: "8", },
		{ label: "暂无数据", value: "9", },
		{ label: "室分站", value: "10", },
		{ label: "宏站远供站", value: "11", },
		{ label: "拉远远供站", value: "12", },
	],
	towerType: [
		{ label: "H杆塔", value: "1", },
		{ label: "单管塔", value: "2", },
		{ label: "地面支撑杆", value: "3", },
		{ label: "仿生树", value: "4", },
		{ label: "简易落地塔", value: "5", },
		{ label: "角钢塔", value: "6", },
		{ label: "楼顶景观塔", value: "7", },
		{ label: "楼面抱杆", value: "8", },
		{ label: "楼面单管塔", value: "9", },
		{ label: "楼面角钢塔", value: "10", },
		{ label: "楼面拉线塔", value: "11", },
		{ label: "楼面美化塔", value: "12", },
		{ label: "楼面美化天线外罩", value: "13", },
		{ label: "楼面三管塔", value: "14", },
		{ label: "楼面增高架", value: "15", },
		{ label: "楼面增高架", value: "16", },
		{ label: "路灯杆塔", value: "17", },
		{ label: "落地拉线塔", value: "18", },
		{ label: "落地增高架", value: "19", },
		{ label: "三管塔", value: "20", },
		{ label: "双轮景观塔", value: "21", },
		{ label: "水泥杆塔", value: "22", },
		{ label: "四管塔", value: "23", },
		{ label: "通信灯杆塔", value: "24", },
		{ label: "一体化塔房", value: "25", },
		{ label: "造型景观塔", value: "26", },
		{ label: "暂无分类", value: "27", },
		{ label: "楼面支撑杆", value: "28", },
	],
	machineType: [
		{ label: "框架机房", value: "1", },
		{ label: "砖混房屋", value: "2", },
		{ label: "彩钢板机房", value: "3", },
		{ label: "一体化机房", value: "4", },
		{ label: "一体化机柜", value: "5", },
		{ label: "无机房", value: "6", },
		{ label: "暂无分类", value: "7", },
	],
	orderPayStatus: [
		{ label: "未支付", value: "0" },
		{ label: "已支付", value: "1" },
	],
	createWay: [
		{ label: "手动", value: "1" },
		{ label: "自动", value: "2" },
		{ label: "动环", value: "3" },
	],
	orderTypes: [
		{ label: "巡检", value: "2" },
		{ label: "故障", value: "3" },
		{ label: "发电", value: "1" },
	],
	// 工单紧急程度
	orderUrgency: [
		{ label: "紧急", value: "2" },
		{ label: "正常", value: "1" },
	],
	getLabel: (list = [], value) => {
		const item = list.filter((item) => `${item.value}` === `${value}`)[0] || { label: "-" };
		return item.label;
	},
	getClass: (list = [], value) => {
		const item = list.filter((item) => `${item.value}` === `${value}`)[0] || { class: "info" };
		return item.class;
	},
};
