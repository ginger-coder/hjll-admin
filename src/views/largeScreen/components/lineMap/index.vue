<!--
  功能：智能调度地图
  作者：bianxiaokai
  时间：2023年09月13日 10:01:47
-->
<template>
	<div class="move_map_coniainer" id="move_map_coniainer">
		<dv-loading>Loading...</dv-loading>
	</div>
</template>
<script>
//import(导入)其他文件（如：组件，工具js，第三方插件js，json文件，图片文件等）
import AMapLoader from '@amap/amap-jsapi-loader';

export default {
	/**注册组件*/
	components: {},
	/**接受父组件传值*/
	props: {},
	name: 'move_map_coniainer',
	data() {
		return {
			map: null,
			SOC: 'CHN',
			colors: {},
			GDPSpeed: {
				520000: 10, //贵州
				540000: 10, //西藏
				530000: 8.5, //云南
				500000: 8.5, //重庆
				360000: 8.5, //江西
				340000: 8.0, //安徽
				510000: 7.5, //四川
				350000: 8.5, //福建
				430000: 8.0, //湖南
				420000: 7.5, //湖北
				410000: 7.5, //河南
				330000: 7.0, //浙江
				640000: 7.5, //宁夏
				650000: 7.0, //新疆
				440000: 7.0, //广东
				370000: 7.0, //山东
				450000: 7.3, //广西
				630000: 7.0, //青海
				320000: 7.0, //江苏
				140000: 6.5, //山西
				460000: 7, // 海南
				310000: 6.5, //上海
				110000: 6.5, // 北京
				130000: 6.5, // 河北
				230000: 6, // 黑龙江
				220000: 6, // 吉林
				210000: 6.5, //辽宁
				150000: 6.5, //内蒙古
				120000: 5, // 天津
				620000: 6, // 甘肃
				610000: 8.5, // 甘肃
				710000: 2.64, //台湾
				810000: 3.0, //香港
				820000: 4.7, //澳门
			},
		};
	},
	/**计算属性*/
	computed: {},
	/**监听data数据变化*/
	watch: {},
	/**所有方法*/
	methods: {
		getColorByDGP(adcode) {
			if (!this.colors[adcode]) {
				var gdp = this.GDPSpeed[adcode];
				if (!gdp) {
					this.colors[adcode] = 'rgb(227,227,227)';
				} else {
					var rg = 255 - Math.floor(((gdp - 5) / 5) * 255);
					this.colors[adcode] = 'rgb(' + rg + ',' + rg + ',255)';
				}
			}
			return this.colors[adcode];
		},
		async initMap() {
			if (this.map) {
				this.map.clearMap();
			}
			let AMap = await AMapLoader.load({
				version: '2.0',
				key: process.env.VUE_APP_MAP_KEY,
				plugins: [
					'AMap.DistrictSearch',
					'AMap.MarkerCluster',
					'AMap.LabelsLayer',
				], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
			});
			const disCountry = new AMap.DistrictLayer.Country({
				zIndex: 10,
				SOC: 'CHN',
				depth: 2,
				styles: {
					'stroke-width': 1.5,
					'nation-stroke': '#5c6db8',
					'coastline-stroke': 'transparent',
					'province-stroke': '#26367d',
					'city-stroke': 'transparent', //中国特有字段
					fill: (props) => {
						//中国特有字段
						return 'transparent';
					},
				},
			});
			this.map = new AMap.Map('move_map_coniainer', {
				zooms: [4, 30],
				center: [107.78964, 34.643964],
				showIndoorMap: false,
				zoom: 4.5,
				isHotspot: false,
				defaultCursor: 'pointer',
				touchZoomCenter: 1,
				pitch: 0,
				layers: [
                    disCountry, 
                    AMap.createDefaultLayer()
                ],
				//viewMode:'3D',
				resizeEnable: true,
				mapStyle: 'amap://styles/darkblue', //设置地图的显示样式
			});
		},
	},
	/**创建组件时执行(有VM对象this)*/
	created() {},
	/**加载完组件时执行(主要预处理数据)*/
	mounted() {
		this.initMap();
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
.move_map_coniainer {
	width: 100%;
	height: 100%;
}
</style>