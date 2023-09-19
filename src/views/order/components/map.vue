<template>
	<div id="orderInfo"></div>
</template>

<script>
import AMapLoader from "@amap/amap-jsapi-loader";
export default {
	data() {
		return {
			map: null,
		};
	},
	methods: {
		initMap() {
			console.log("initMap");
			AMapLoader.load({
				key: process.env.VUE_APP_MAP_KEY, //key值是key值 和安全密钥不同
				version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
				plugins: [], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
			})
				.then((AMap) => {
					// 初始化地图
					this.map = new AMap.Map("orderInfo", {
						viewMode: "2D", // 是否为3D地图模式
						zoom: 15, // 初始化地图级别
						center: [113.57865, 37.94702], //中心点坐标
						resizeEnable: true,
					});

					// this.map.add([markerPoint, markerPoint1, markerPoint2, markerPoint3, markerPoint5, markerPoint6, markerPoint7, markerPoint8]);
					console.log(this.map);
				})
				.catch((e) => {
					console.log(e);
				});
		},
	},
	mounted() {
		console.log("mounted");
		//DOM初始化完成进行地图初始化
		this.initMap();
	},
};
</script>

<style lang="scss" scoped>
#orderInfo {
	padding: 0px;
	margin: 0px;
	width: 100%;
	height: 400px;
}
</style>
