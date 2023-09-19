<!--
  功能：公共地图组件
  作者：bianxiaokai
  时间：2023年09月15日 08:31:09
-->
<template>
	<div class="map-container">
		<div @click="onBack" v-if="mapType !== 'province'" class="returnClass">
			返回
		</div>
		<div class="static-map" ref="staticEchartsMap"></div>
	</div>
</template>
<script>
//import(导入)其他文件（如：组件，工具js，第三方插件js，json文件，图片文件等）
import * as echarts from 'echarts';
import * as axios from 'axios';
import _ from 'lodash';
import chinaData from '@p/china.json';
import { cityMap } from '@p/city/china-main-city-map';
import { provinceList } from './data';
const bgIMG = require('@/assets/dtbj2.png');
export default {
	/**注册组件*/
	components: {},
	/**接受父组件传值*/
	props: {},
	name: 'static-map',
	data() {
		return {
			myChart: null,
			provinceList,
			domImg: null,
			mapType: 'province',
			addressJSON: null,
			seriesData: [],
		};
	},
	/**计算属性*/
	computed: {},
	/**监听data数据变化*/
	watch: {},
	/**所有方法*/
	methods: {
		addImageProcess(src) {
			return new Promise((resolve, reject) => {
				let domImg = document.createElement('img');
				domImg.style.height =
					domImg.height =
					domImg.width =
					domImg.style.width =
						'100px';
				domImg.onerror = reject;
				domImg.src = src;
				domImg.onload = () => resolve(domImg);
			});
		},
		async initChartMap() {
			this.myChart = echarts.init(this.$refs.staticEchartsMap);
			this.domImg = await this.addImageProcess(bgIMG);

			this.getAreaData();
		},
		async getAreaData(params, areaType = 'province') {
			// 加载接口地图的真实数据
            this.$emit('change', params);
			let address = '';
			let areaData = {};
			if (!params?.area) {
				address = 'china';
				areaData = chinaData;
				chinaData.features.forEach(function (v) {
					// 地区名称
					var name = v.properties.name;
					for (let i = 0; i < provinceList.length; i++) {
						if (name.indexOf(provinceList[i].name) >= 0) {
							const center =
								v.properties.center || v.properties.cp;
							provinceList[i].value = 0;
							provinceList[i].code =
								(v.properties && v.properties.adcode) ||
								v.adcode;
							provinceList[i].x = center[0];
							provinceList[i].y = center[1];
						}
					}
				});
				this.seriesData = _.cloneDeep(provinceList);
			} else {
				address = params.area;
				const addressJSON = await axios.get(
					`${process.env.VUE_APP_MAP_BASE}/${params.path}/${
						cityMap[address] ? cityMap[address] : address
					}.json`
				);
				areaData = addressJSON.data;
				const data = [];
				addressJSON.data.features.forEach((item) => {
					const lang = item.properties.cp
						? item.properties.cp
						: item.properties.center;
					data.push({
						name: item.properties.name,
						value: 0,
						code: item?.id || item.properties.adcode,
						x: lang[0],
						y: lang[1],
					});
				});
				this.seriesData = _.cloneDeep(data);
			}
			const series = [
				{
					name: address,
					data: this.seriesData,
					renderItem: (params, api) => {
						const data = this.seriesData[params.dataIndex];
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
					name: address,
					data: this.seriesData,
					renderItem: (params, api) => {
						const data = this.seriesData[params.dataIndex];
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
			];
			echarts.registerMap(address, areaData);
			this.initChartOption(address, series);
            this.mapType = areaType;
		},
		initChartOption(address, seriesList) {
			const series = seriesList.map((el, index) => {
				return {
					name: el.name,
					data: el.data,
					type: 'custom', //配置显示方式为用户自定义
					coordinateSystem: 'geo',
					silent: true,
					z: index == 0 ? 2 : 1,
					renderItem: el.renderItem,
				};
			});
			const option = {
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
						map: address,
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
									image: this.domImg, //配置图片
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
						map: address,
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
						map: address,
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
				series: series,
			};
			this.myChart.setOption(option);
			this.myChart.on('click', this.mapClickData);
			// 缩放适应
			window.addEventListener('resize', () => {
				this.myChart.resize();
			});
		},
		mapClickData(params) {
			if (this.mapType == 'end') return false;
			const name = params.name;
			const data = this.seriesData.find((el) => el.name == name);

			const localArr =
				JSON.parse(localStorage.getItem('staticMap')) || [];

            let mapParams = {};
			if (this.mapType == 'province') {
                mapParams = {
					area: data.ename,
					code: data.code,
                    path: 'province',
				};
				// 请求对应省数据
				this.getAreaData(mapParams, 'city');
			} else if (this.mapType == 'city') {
                mapParams = {
					area: name,
					code: data.code,
                    path: 'city',
				};
				// 请求对应省数据
				this.getAreaData(mapParams, 'end');
			}
			localArr.push(mapParams);
			localStorage.setItem('staticMap', JSON.stringify(localArr));
		},
		onBack() {
			const localArr = JSON.parse(localStorage.getItem('staticMap'));
			if (localArr.length == 1) {
				this.getAreaData();
				localStorage.setItem('staticMap', JSON.stringify([]));
			} else if (localArr.length == 2) {
				const data = localArr[0];
				this.getAreaData({
					...data
				}, 'city');
				localArr.pop();
				localStorage.setItem('staticMap', JSON.stringify(localArr));
			}
		},
	},
	/**创建组件时执行(有VM对象this)*/
	created() {},
	/**加载完组件时执行(主要预处理数据)*/
	mounted() {
		localStorage.setItem('staticMap', JSON.stringify([]));
		this.initChartMap();
	},
	beforeCreate() {
		/**生命周期 - 创建之前*/
	},
	beforeMount() {
		/**生命周期 - 挂载之前*/
	},
	beforeUpdate() {
		/**生命周期 - 更新之前*/
	},
	updated() {
		/**生命周期 - 更新之后*/
	},
	beforeDestroy() {
		/**生命周期 - 销毁之前*/
	},
	destroyed() {
		/**生命周期 - 销毁完成*/
	},
	activated() {
		/**keep-alive组件激活时调用。仅针对keep-alive组件有效*/
	},
	deactivated() {
		/**keep-alive组件停用时调用。仅针对keep-alive组件有效*/
	},
};
</script>
<style scoped lang="scss">
/* @import url(); 引入css类 */
.static-map,
.map-container {
	width: 100%;
	height: 100%;
	position: relative;
	z-index: 1;
	.returnClass {
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
}
</style>
