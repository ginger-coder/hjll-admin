<template>
	<div style="width: 100%; height: 100%; position: relative">
		<!-- 中国地图 展示市 二级页面 接受来自省点击的ename，渲染不同省json-->
		<div @click="onBack" class="returnClass">返回</div>
		<!-- echarts 容器 -->
		<div :id="id" class="provinceCharts" v-if="!mapVisible">
			<dv-loading>Loading...</dv-loading>
		</div>
		<clusterMap
			:keyword="keyword"
			:request="mapRequest"
			:dataType="screen.mapDataType"
			v-if="mapVisible"
		/>
	</div>
</template>
<script>
import * as echarts from 'echarts';
import axios from 'axios';
import clusterMap from '@c/clusterMap.vue';
import { mapState } from 'vuex';
export default {
	components: { clusterMap },
	computed: {
		...mapState(['screen']),
	},
	watch: {
		'screen.mapDataType': {
			handler(value) {
                this.mapRequest = this.screen.requestList[value].url;
                if(!this.mapVisible) {
                    this.reloadEchart(this.screen.requestList[value]);
                }
			}
		},
	},
	data() {
		return {
			domImg: require('@/assets/dtbj2.png'),
			id:
				'echarts_' +
				new Date().getTime() +
				Math.floor(Math.random() * 1000),
			myChart: null,
			address: null,
			seriseData: [],
			filterName: {
				beijing: '110100',
				tianjin: '120100',
				shanghai: '310100',
				chongqing: '500100',
				xianggang: '810100',
				aomen: '820100',
			},
			mapVisible: false,
			keyword: '',
			mapRequest: () => {},
            provinceName: '',
		};
	},
	created() {},
	async mounted() {
        this.provinceName = this.$route.query.provinceName;
		this.address = await axios.get(
			`${process.env.VUE_APP_MAP_BASE}/province/${this.provinceName}.json`
		);
        this.mapRequest = this.screen.requestList[this.screen.mapDataType].url;
		this.initEchart();
	},
	methods: {
		onBack() {
			if (this.mapVisible) {
				this.mapVisible = false;
				setTimeout((e) => {
					this.initEchart();
				}, 100);
			} else {
				this.$router.go(-1);
			}
		},
		async reloadEchart(req) {
			let that = this;
			let province = this.$route.query.province;

			let code = String(this.$route.query.code || '');
			this.seriseData = [];
			const isOtherCity = Object.keys(this.filterName).includes(
				this.$route.query.provinceName
			);
			let otherCode = '';
			const params = {};
			if (isOtherCity) {
				otherCode = this.filterName[
					this.$route.query.provinceName
				].substr(0, 4);
				Object.assign(params, {
					city: otherCode,
				});
			} else {
				Object.assign(params, {
					province: code?.substr(0, 2),
				});
			}
			const response = await req.url(params);
			if (response.code == 0) {
				this.address.data.features.forEach((item) => {
					// series是数组里面data是一个对象，所以要用series[0].data.push
					if (response.data[req.key][item.properties.name] != null) {
						const cityNumber =
							response.data[req.key][item.properties.name];
						this.seriseData.push({
							name: item.properties.name,
							value: cityNumber,
							code: item.id,
							x: item.properties.cp[0],
							y: item.properties.cp[1],
						});
					}
				});
			}
			this.myChart.setOption({
				series: [
					{
						name: province,
						// type: 'map',
						// geoIndex: 0, // 不可缺少，否则无tooltip 指示效果
						data: this.seriseData,
						type: 'custom', //配置显示方式为用户自定义
						coordinateSystem: 'geo',
						silent: true,
						z: 2,
						renderItem: function (params, api) {
							const data = that.seriseData[params.dataIndex];
							if (data.value) {
								const x = api?.coord([data.x, data.y])[0];
								const y = api?.coord([data.x, data.y])[1];
								return {
									type: 'text',
									style: {
										text: data.value,
										fill: '#fff',
										font: 'bolder 12px "Microsoft YaHei", sans-serif',
										lineWidth: 50,
										x: x + 20,
										y: y - 20,
										textAlign: 'right',
									},
								};
							}
						},
					},
					{
						name: province,
						// type: 'map',
						// geoIndex: 0, // 不可缺少，否则无tooltip 指示效果
						data: this.seriseData,
						type: 'custom', //配置显示方式为用户自定义
						coordinateSystem: 'geo',
						silent: true,
						z: 1,
						renderItem: function (params, api) {
							const data = that.seriseData[params.dataIndex];
							if (data.value) {
								const x = api.coord([data.x, data.y])[0];
								const y = api.coord([data.x, data.y])[1];
								return {
									type: 'image',
									style: {
										image: 'https://cdn.hainacssp.com/web-assets/icon-map-city.svg',
										x: x,
										y: y - 30,
										with: 30,
										height: 30,
									},
								};
							}
						},
					},
				],
			});
		},
		async initEchart() {

			// 初始化echarts
			this.myChart = echarts.init(document.getElementById(this.id));
			// 根据china.vue点击的省份，传过来的名称（china定义的ename）获取数据（不同json）！！！ 重要
			// 这里是第一种方式，通过上级定义的ename获取数据
			// city.vue中是第二种方式，通过单独的js文件的键值对的key获取对应的json
			this.getJson();

			// 点击市数据跳转到区县数据
			this.myChart.on('click', (params) => {
				const name = params.name;
				const data = this.seriseData.find((el) => el.name == name);
				const isOtherCity = Object.keys(this.filterName).includes(
					this.provinceName
				);
				if (isOtherCity) {
					this.keyword = data.code;
					this.mapVisible = true;
					return;
				}

				if (data.value) {
					const code = String(data.code);
					this.$router.push({
						path: '/city',
						query: {
							city: name,
							code,
							regionalLevel: 2,
						},
					});
				}
			});
			// 缩放适应
			window.addEventListener('resize', () => {
				this.myChart.resize();
			});
		},
		async getJson() {
			let that = this;
			let province = this.$route.query.province;
			let code = String(this.$route.query.code || '');
			var domImg = document.createElement('img');
			domImg.style.height =
				domImg.height =
				domImg.width =
				domImg.style.width =
					'100px';
			domImg.src = that.domImg;
			echarts.registerMap(province, this.address.data);

			this.seriseData = [];

			const request = this.screen.requestList[this.screen.mapDataType];
			const isOtherCity = Object.keys(this.filterName).includes(
				this.$route.query.provinceName
			);
			let otherCode = '';
			const params = {};
			if (isOtherCity) {
				otherCode = this.filterName[
					this.$route.query.provinceName
				].substr(0, 4);
				Object.assign(params, {
					city: otherCode,
				});
			} else {
				Object.assign(params, {
					province: code?.substr(0, 2),
				});
			}
			const response = await request.url(params);
			if (response.code == 0) {
				this.address.data.features.forEach((item) => {
					// series是数组里面data是一个对象，所以要用series[0].data.push
					if (
						response.data[request.key][item.properties.name] != null
					) {
						const cityNumber =
							response.data[request.key][item.properties.name];
						this.seriseData.push({
							name: item.properties.name,
							value: cityNumber,
							code: item.id,
							x: item.properties.cp[0],
							y: item.properties.cp[1],
						});
					}
				});
			}
			var option = {
				// 背景颜色
				// backgroundColor: "#0b1938",
				title: {
					text: '',
					top: '8%',
					left: '8%',
					textStyle: {
						fontSize: 14,
						fontWeight: 300,
						color: '#fff',
					},
				},
				// 提示浮窗样式
				tooltip: {
					show: true,
					trigger: 'item',
					alwaysShowContent: false,
					backgroundColor: '#0C121C',
					borderColor: 'rgba(0, 0, 0, 0.16);',
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
				// 地图配置
				geo: [
					{
						map: province,
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
							emphasis: { color: '#fff', areaColor: '#069' },
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
						map: province,
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
						map: province,
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
						name: province,
						// type: 'map',
						// geoIndex: 0, // 不可缺少，否则无tooltip 指示效果
						data: this.seriseData,
						type: 'custom', //配置显示方式为用户自定义
						coordinateSystem: 'geo',
						silent: true,
						z: 2,
						renderItem: function (params, api) {
							const data = that.seriseData[params.dataIndex];
							if (data.value) {
								const x = api.coord([data.x, data.y])[0];
								const y = api.coord([data.x, data.y])[1];
								return {
									type: 'text',
									style: {
										text: data.value,
										fill: '#fff',
										font: 'bolder 12px "Microsoft YaHei", sans-serif',
										lineWidth: 50,
										x: x + 20,
										y: y - 20,
										textAlign: 'right',
									},
								};
							}
						},
					},
					{
						name: province,
						// type: 'map',
						// geoIndex: 0, // 不可缺少，否则无tooltip 指示效果
						data: this.seriseData,
						type: 'custom', //配置显示方式为用户自定义
						coordinateSystem: 'geo',
						silent: true,
						z: 1,
						renderItem: function (params, api) {
							const data = that.seriseData[params.dataIndex];
							if (data.value) {
								const x = api.coord([data.x, data.y])[0];
								const y = api.coord([data.x, data.y])[1];
								return {
									type: 'image',
									style: {
										image: 'https://cdn.hainacssp.com/web-assets/icon-map-city.svg',
										x: x,
										y: y - 30,
										with: 30,
										height: 30,
									},
								};
							}
						},
					},
				],
			};
			// 将定义的数据设置进myChart （myChary 是初始化echarts）
			that.myChart.setOption(option);
		},
	},
};
</script>
<style scoped>
.provinceCharts {
	width: 100%;
	height: 100%;
}
.returnClass {
	position: absolute;
	left: 0;
	top: 0;
	width: 124px;
	height: 30px;
	border-radius: 10px;
	text-align: center;
	line-height: 30px;
	color: #2593ff;
	font-size: 16px;
	background: url('~@/assets/images/returnBj.png') 0 0/100% 100% no-repeat;
	opacity: 0.8;
	cursor: pointer;
	z-index: 99999;
}
.returnClass:hover {
	opacity: 1;
}
</style>
