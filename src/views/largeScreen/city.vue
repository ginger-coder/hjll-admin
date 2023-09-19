<template>
	<div
		style="width: 100%; height: 100%; position: relative; padding-top: 40px"
	>
		<!-- 中国地图 渲染县级 三级页面 接受来自市点击的name，渲染不同市json-->
		<div @click="onBack" class="returnClass">返回</div>
		<div class="tip" v-if="cityId === undefined">
			敬请谅解，乡镇数据正在努力更新中...
		</div>
		<!-- echarts的容器 -->
		<div id="echarts" ref="echarts" class="cityCharts" v-if="!mapVisible">
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
import { cityMap } from '@p/city/china-main-city-map';
import clusterMap from '@c/clusterMap.vue';
import { getStationMonitoring } from '@/api/lagreScreen';
import { mapState } from 'vuex';
export default {
	components: { clusterMap },
	data() {
		return {
			cityId: null,
			domImg: require('@/assets/dtbj2.png'),
			myChart: null,
			keyword: '',
			mapVisible: false,
			mapRequest: () => {},
			address: {},
		};
	},
	computed: {
		...mapState(['screen']),
	},
	watch: {
		'screen.mapDataType': {
			handler(value) {
				this.mapRequest =
					this.screen.requestList[this.screen.mapDataType].url;
                if(!this.mapVisible) {
                    this.init(this.screen.requestList[value]);
                }
			},
		},
	},
	created() {},
	async mounted() {
		let { city, code } = this.$route.query;
		// 第二种方式通过js文件引入json
		this.cityId = cityMap[city];
        this.address = await axios.get(`${process.env.VUE_APP_MAP_BASE}/city/${this.cityId}.json`);
		// 初始化地图数据接口
		this.mapRequest = this.screen.requestList[this.screen.mapDataType].url;
		// 初始化echarts

		// if (that.cityId === undefined) return;
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
		async init(req) {
			let { city, code } = this.$route.query;
			const response = await this.screen.requestList[
				this.screen.mapDataType
			].url({
				city: code.substr(0, 4),
			});
			this.seriseData = [];
			if (response.code == 0) {
				this.address.data.features.forEach((item) => {
					// series是数组里面data是一个对象，所以要用series[0].data.push
					if (response.data[req.key][item.properties.name] != null) {
						const cityNumber =
							response.data[req.key][item.properties.name];
						this.seriseData.push({
							name: item.properties.name,
							value: cityNumber,
							code: item.properties.adcode,
							x: item.properties.center[0],
							y: item.properties.center[1],
						});
					}
				});
			}
			this.myChart.setOption({
				series: [
					{
						name: city,
						// type: 'map',
						// geoIndex: 0, // 不可缺少，否则无tooltip 指示效果
						data: this.seriseData,
						type: 'custom', //配置显示方式为用户自定义
						coordinateSystem: 'geo',
						silent: true,
						z: 2,
						renderItem: (params, api) => {
							const data = this.seriseData[params.dataIndex];
                            if(data.value) {
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
						name: city,
						// type: 'map',
						// geoIndex: 0, // 不可缺少，否则无tooltip 指示效果
						data: this.seriseData,
						type: 'custom', //配置显示方式为用户自定义
						coordinateSystem: 'geo',
						silent: true,
						z: 1,
						renderItem: (params, api) => {
							const data = this.seriseData[params.dataIndex];
                            if(data.value) {
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
		initEchart() {
			this.myChart = echarts.init(this.$refs.echarts);
			this.getJson();
			this.myChart.on('click', (params) => {
				const name = params.name;
				const data = this.seriseData.find(
					(el) => el.name == name
				);
                if(data.value) {
                    this.keyword = String(data.code);
                    this.mapVisible = true;
                    this.myChart.dispose();
                }
			});

			// 缩放适应
			window.addEventListener('resize', () => {
				this.myChart.resize();
			});
		},
		async getJson() {
			var domImg = document.createElement('img');
			domImg.style.height =
				domImg.height =
				domImg.width =
				domImg.style.width =
					'100px';
			domImg.src = this.domImg;
			let { city, code } = this.$route.query;
			
			// 地图注册，第一个参数的名字必须和option.geo.map一致，第二个参数是地图json数据
			echarts.registerMap(city, this.address.data);
			const request = this.screen.requestList[this.screen.mapDataType];
			const response = await request.url({
				city: code.substr(0, 4),
			});
			this.seriseData = [];
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
							code: item.properties.adcode,
							x: item.properties.center[0],
							y: item.properties.center[1],
						});
					}
				});
			}
			let option = {
				// 背景颜色
				color: '#fff',
				// backgroundColor: "#0b1c3e",
				title: {
					text: '',
					top: '8%',
					left: '8%',
					textStyle: {
						fontSize: 14,
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
						map: city,
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
						select: {
							// 地图选中区域样式
							label: {
								// 选中区域的label(文字)样式
								color: '#fff',
							},
							itemStyle: {
								// 选中区域的默认样式
								areaColor: '#70C7F4',
							},
						},
						label: {
							normal: {
								position: 'top',
								show: true,
								color: '#ffffff',
								fontSize: 12,
								fontWeight: 800,
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
						map: city,
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
						map: city,
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
						name: city,
						// type: 'map',
						// geoIndex: 0, // 不可缺少，否则无tooltip 指示效果
						data: this.seriseData,
						type: 'custom', //配置显示方式为用户自定义
						coordinateSystem: 'geo',
						silent: true,
						z: 2,
						renderItem: (params, api) => {
							const data = this.seriseData[params.dataIndex];
                            if(data.value) {
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
						name: city,
						// type: 'map',
						// geoIndex: 0, // 不可缺少，否则无tooltip 指示效果
						data: this.seriseData,
						type: 'custom', //配置显示方式为用户自定义
						coordinateSystem: 'geo',
						silent: true,
						z: 1,
						renderItem: (params, api) => {
							const data = this.seriseData[params.dataIndex];
                            if(data.value) {
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
			this.myChart.setOption(option);
		},
	},
};
</script>
<style>
.cityCharts {
	width: 100%;
	height: 100%;
	margin: 0 auto;
}
.tip {
	text-align: center;
	margin-top: 30px;
	color: #fff;
	font-size: 15px;
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