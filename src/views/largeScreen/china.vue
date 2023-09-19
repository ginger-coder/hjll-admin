<template>
	<!-- 中国地图 省级 一级页面 -->
	<div id="main"><dv-loading>Loading...</dv-loading></div>
</template>
<script>
import * as echarts from 'echarts';
import jsonData from '@p/china.json';
import { mapState } from 'vuex';
export default {
	computed: {
		...mapState(['screen']),
	},
	watch: {
		'screen.mapDataType': {
			handler(value) {
				this.init(this.screen.requestList[value]);
			},
		},
	},
	data() {
		return {
			myChart: null,
			domImg: require('@/assets/dtbj2.png'),
			dataList: [
				{ ename: 'nanhaizhudao', name: '南海诸岛' },
				{ ename: 'beijing', name: '北京' },
				{ ename: 'tianjin', name: '天津' },
				{ ename: 'shanghai', name: '上海' },
				{ ename: 'chongqing', name: '重庆' },
				{ ename: 'hebei', name: '河北' },
				{ ename: 'henan', name: '河南' },
				{ ename: 'yunnan', name: '云南' },
				{ ename: 'liaoning', name: '辽宁' },
				{ ename: 'heilongjiang', name: '黑龙江' },
				{ ename: 'hunan', name: '湖南' },
				{ ename: 'anhui', name: '安徽' },
				{ ename: 'shandong', name: '山东' },
				{ ename: 'xinjiang', name: '新疆' },
				{ ename: 'jiangsu', name: '江苏' },
				{ ename: 'zhejiang', name: '浙江' },
				{ ename: 'jiangxi', name: '江西' },
				{ ename: 'hubei', name: '湖北' },
				{ ename: 'guangxi', name: '广西' },
				{ ename: 'gansu', name: '甘肃' },
				{ ename: 'shanxi', name: '山西' },
				{ ename: 'neimenggu', name: '内蒙古' },
				{ ename: 'shanxi', name: '陕西' },
				{ ename: 'jilin', name: '吉林' },
				{ ename: 'fujian', name: '福建' },
				{ ename: 'guizhou', name: '贵州' },
				{ ename: 'guangdong', name: '广东' },
				{ ename: 'qinghai', name: '青海' },
				{ ename: 'xizang', name: '西藏' },
				{ ename: 'sichuan', name: '四川' },
				{ ename: 'ningxia', name: '宁夏' },
				{ ename: 'hainan', name: '海南' },
				{ ename: 'taiwan', name: '台湾' },
				{ ename: 'xianggang', name: '香港' },
				{ ename: 'aomen', name: '澳门' },
			],
		};
	},
	created() {},
	mounted() {
		this.initMap();
	},
	methods: {
		initMap() {
			let that = this;
			let domImg = document.createElement('img');

			domImg.style.height =
				domImg.height =
				domImg.width =
				domImg.style.width =
					'100px';
			domImg.src = that.domImg;
			domImg.onload = () => {
				that.$nextTick(async () => {
					let dataList = that.dataList;

					let geoCoordMap = {};
					let geoCoordMap2 = {};
					jsonData.features.forEach(function (v) {
						// 地区名称
						var name = v.properties.name;
						// 地区经纬度
						geoCoordMap[name] =
							(v.properties && v.properties.adcode) || v.adcode;
						geoCoordMap2[name] =
							v.properties.center || v.properties.cp;
					});

					const res = await this.screen.requestList[
						this.screen.mapDataType
					].url();
					if (res.code == 0) {
						for (let i = 0; i < dataList.length; i++) {
							for (const key in res.data.areaStation) {
								if (
									Object.hasOwnProperty.call(
										res.data.areaStation,
										key
									)
								) {
									const pNumber = res.data.areaStation[key];
									if (key.indexOf(dataList[i].name) >= 0) {
										dataList[i].value = pNumber;
										dataList[i].code =
											geoCoordMap[dataList[i].name];
										dataList[i].x =
											geoCoordMap2[dataList[i].name][0];
										dataList[i].y =
											geoCoordMap2[dataList[i].name][1];
									}
								}
							}
						}
					}
					that.myChart = echarts.init(
						document.getElementById('main')
					);
					// 注册中国地图 第一个参数为地图的名字，第二个参数为地图的json数据，第一个要和geo map一样
					echarts.registerMap('china', jsonData);

					var option = {
						tooltip: {
							show: true,
							trigger: 'item',
							alwaysShowContent: false,
							hideDelay: 100,
							triggerOn: 'mousemove',
							enterable: true,
							formatter: '',
							textStyle: {
								color: '#DADADA',
								fontSize: '12',
								width: 20,
								height: 30,
								overflow: 'break',
							},
							showDelay: 100,
						},
						geo: [
							{
								map: 'china',
								// 主图
								zlevel: 0,
								zoom: 1.2, //当前视角的缩放比例
								roam: false, //是否开启平游或缩放
								center: undefined,
								show: true,
								// geoIndex:1,
								symbolSize: function (val) {
									return 10;
								},
								showEffectOn: 'render',
								rippleEffect: {
									brushType: 'stroke',
								},
								hoverAnimation: true,
								label: {
									normal: {
										position: 'top',
										show: true,
										color: '#ffffff',
										fontSize: 12,
										borderColor: '#87C3FD', //地图边框颜色
									},
									emphasis: {
										color: '#fff',
										areaColor: '#069',
									},
								},
								itemStyle: {
									normal: {
										color: '#fdfbcc',
										shadowBlur: 1,
										shadowColor: '#fdfbcc',
										borderColor: '#87C3FD',
										borderWidth: 1,
										areaColor: {
											type: 'pattern',
											image: domImg, //配置图片
											repeat: 'repeat', //可选值repeat、no-repeat、repeat-x、repeat-y
										},
									},
									emphasis: {
										areaColor: '#155588', //悬浮区背景
										shadowColor: 'rgba(20, 113, 255,1)',
									},
								},
							},
							//第一层投影
							{
								map: 'china',
								zlevel: -1,
								zoom: 1.22, //当前视角的缩放比例
								roam: false, //是否开启平游或缩放
								center: undefined,
								show: true,
								label: {
									normal: {
										show: false,
									},
									emphasis: {
										show: false,
									},
								},
								itemStyle: {
									normal: {
										borderJoin: 'round',
										borderColor: 'rgba(176,228,252,0.3)',
										borderWidth: 3,
										areaColor: 'rgba(133,188,232,0.3)',
										shadowColor: 'rgba(20, 113, 255,3)',
										shadowOffsetX: 0,
										shadowOffsetY: 0,
										shadowBlur: 25,
									},
									emphasis: {
										show: false,
									},
								},
							},
							// 第二层投影
							{
								map: 'china',
								zlevel: -2,
								zoom: 1.2, //当前视角的缩放比例
								roam: false, //是否开启平游或缩放
								center: undefined,
								show: true,
								label: {
									normal: {
										show: false,
									},
									emphasis: {
										show: false,
									},
								},
								itemStyle: {
									normal: {
										borderJoin: 'round',
										areaColor: 'rgba(30,49,105,0.1)',
										shadowColor: 'rgba(20, 113, 255,3)',
										shadowOffsetX: -5,
										shadowOffsetY: 6,
									},
									emphasis: {
										show: false,
									},
								},
							},
						],
						series: [
							{
								name: '省份',
								// type: 'map',
								// geoIndex: 0, // 不可缺少，否则无tooltip 指示效果
								data: dataList,
								type: 'custom', //配置显示方式为用户自定义
								coordinateSystem: 'geo',
								silent: true,
								z: 2,
								itemStyle: {
									normal: {
										areaColor: '#01215c',
										borderWidth: 5, //设置外层边框
										borderColor: '#9ffcff',
									},
								},
								renderItem: function (params, api) {
									const data = dataList[params.dataIndex];
									const x = api.coord([data.x, data.y])[0];
									const y = api.coord([data.x, data.y])[1];
									if (data.value) {
										return {
											type: 'text',
											style: {
												text: data.value,
												fill: '#fff',
												font: 'bolder 12px "Microsoft YaHei", sans-serif',
												lineWidth: 50,
												x: x + 8,
												y: y - 115,
												textAlign: 'right',
											},
										};
									}
								},
							},
							{
								name: '省份',
								// type: 'map',
								// geoIndex: 0, // 不可缺少，否则无tooltip 指示效果
								data: dataList,
								type: 'custom', //配置显示方式为用户自定义
								coordinateSystem: 'geo',
								silent: true,
								z: 1,
								renderItem: function (params, api) {
									const data = dataList[params.dataIndex];
									if (data.value) {
										const x = api.coord([
											data.x,
											data.y,
										])[0];
										const y = api.coord([
											data.x,
											data.y,
										])[1];
										return {
											type: 'image',
											style: {
												image: 'https://cdn.hainacssp.com/web-assets/icon-map-china.svg',
												x: x,
												y: y - 100,
												with: 40,
												height: 100,
											},
										};
									}
								},
							},
						],
					};
					//设置配置项
					that.myChart.setOption(option);
					// 点击事件地图 enmae为获取省地图的json数据
					that.myChart.on('click', function (params) {
						// console.log('😂👨🏾‍❤️‍👨🏼==>： ', params); //===>打印后类似 xinjiang 新疆
						const name = params.name;
						const data = dataList.find((el) => el.name == name);
						if (data.value) {
							that.$router.push({
								path: '/province',
								query: {
									provinceName: data.ename,
									province: name,
									code: data.code,
									regionalLevel: 1,
								},
							});
						}
					});
					// 缩放适应
					window.addEventListener('resize', () => {
						that.myChart.resize();
					});
				});
			};
		},
		async init(request) {
			let dataList = this.dataList;
			let geoCoordMap = {};
			let geoCoordMap2 = {};
			jsonData.features.forEach(function (v) {
				// 地区名称
				var name = v.properties.name;
				// 地区经纬度
				geoCoordMap[name] =
					(v.properties && v.properties.adcode) || v.adcode;
				geoCoordMap2[name] = v.properties.center || v.properties.cp;
			});
			const res = await request.url();
			if (res.code == 0) {
				for (let i = 0; i < dataList.length; i++) {
					for (const key in res.data[request.key]) {
						if (
							Object.hasOwnProperty.call(
								res.data[request.key],
								key
							)
						) {
							if (key.indexOf(dataList[i].name) >= 0) {
								const pNumber = res.data[request.key][key];
								dataList[i].value = pNumber;
								dataList[i].code =
									geoCoordMap[dataList[i].name];
								dataList[i].x =
									geoCoordMap2[dataList[i].name][0];
								dataList[i].y =
									geoCoordMap2[dataList[i].name][1];
							}
						}
					}
				}
			}
			this.myChart.setOption({
				series: [
					{
						name: '省份',
						// type: 'map',
						// geoIndex: 0, // 不可缺少，否则无tooltip 指示效果
						data: dataList,
						type: 'custom', //配置显示方式为用户自定义
						coordinateSystem: 'geo',
						silent: true,
						z: 2,
						itemStyle: {
							normal: {
								areaColor: '#01215c',
								borderWidth: 5, //设置外层边框
								borderColor: '#9ffcff',
							},
						},
						renderItem: function (params, api) {
							const data = dataList[params.dataIndex];
							const x = api.coord([data.x, data.y])[0];
							const y = api.coord([data.x, data.y])[1];
							if (data.value) {
								return {
									type: 'text',
									style: {
										text: data.value,
										fill: '#fff',
										font: 'bolder 12px "Microsoft YaHei", sans-serif',
										lineWidth: 50,
										x: x + 8,
										y: y - 115,
										textAlign: 'right',
									},
								};
							}
						},
					},
					{
						name: '省份',
						// type: 'map',
						// geoIndex: 0, // 不可缺少，否则无tooltip 指示效果
						data: dataList,
						type: 'custom', //配置显示方式为用户自定义
						coordinateSystem: 'geo',
						silent: true,
						z: 1,
						renderItem: function (params, api) {
							const data = dataList[params.dataIndex];
							if (data.value) {
								const x = api.coord([data.x, data.y])[0];
								const y = api.coord([data.x, data.y])[1];
								return {
									type: 'image',
									style: {
										image: 'https://cdn.hainacssp.com/web-assets/icon-map-china.svg',
										x: x,
										y: y - 100,
										with: 40,
										height: 100,
									},
								};
							}
						},
					},
				],
			});
		},
	},
};
</script>

<style scoped>
#main {
	width: 100%;
	height: 100%;
	margin: 0 auto;
}
</style>
