<template>
	<div class="mapContent">
		<div id="orderInfo"></div>
		<div class="input-card">
			<div class="items" @click="startAnimation">播放</div>
			<!-- <h4>轨迹回放控制</h4>
			<div class="input-item">
				<input type="button" class="btn" value="开始动画" id="start" @click="startAnimation"/>
				<input type="button" class="btn" value="暂停动画" id="pause" @click="pauseAnimation"/>
			</div>
			<div class="input-item">
				<input type="button" class="btn" value="继续动画" id="resume" @click="resumeAnimation"/>
				<input type="button" class="btn" value="停止动画" id="stop" @click="stopAnimation"/>
			</div> -->
		</div>
	</div>
</template>

<script>
import AMapLoader from "@amap/amap-jsapi-loader";
export default {
	props: {
		lineArr: Array,
    },
	data() {
		return {
			map: null,
			marker:null
		};
	},
	methods: {
		initMap() {
			AMapLoader.load({
				key: process.env.VUE_APP_MAP_KEY, //key值是key值 和安全密钥不同
				version: "1.4.15", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
				plugins: [], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
			})
				.then((AMap) => {
					// 初始化地图
					this.map = new AMap.Map("orderInfo", {
						viewMode: "2D", // 是否为3D地图模式
						zoom: 15, // 初始化地图级别
					});
					this.marker = new AMap.Marker({
						map: this.map,
						position: this.lineArr[0],
						// icon: "https://webapi.amap.com/images/car.png",
						icon:  require("@/assets/people.png"),
						icon:new AMap.Icon({            
							image: require("@/assets/people.png"),
							size: new AMap.Size(52, 52),  //图标大小
							imageSize: new AMap.Size(30,30)
						}), 
						offset: new AMap.Pixel(-26, -13),
						// autoRotation: true,
						angle:0,
					});
					// 绘制轨迹
					var polyline = new AMap.Polyline({
						map: this.map,
						path: this.lineArr,
						showDir:true,
						strokeColor: "#5A77E2",  //线颜色
						strokeWeight: 6,      //线宽
					});

					var passedPolyline = new AMap.Polyline({
						map: this.map,
						strokeColor: "#AF5",  //线颜色
						strokeWeight: 6,      //线宽
					});

					this.marker.on('moving', function (e) {
						passedPolyline.setPath(e.passedPath);
					});
					this.map.setFitView();
				})
				.catch((e) => {
					console.log(e);
				});
		},
		startAnimation () {
			this.marker.moveAlong(this.lineArr, 2500);
		},
	    pauseAnimation () {
			this.marker.pauseMove();
		},
		resumeAnimation () {
			this.marker.resumeMove();
		},
        stopAnimation () {
			this.marker.stopMove();
		}
	},
	mounted() {
		console.log("mounted");
		//DOM初始化完成进行地图初始化
		this.initMap();
		// setTimeout(()=>{
		// 	this.startAnimation();
		// },2000)
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
.mapContent{
	position: relative;
	z-index: 111;
	.input-card{
		position: absolute;
		top: 20px;
		right: 20px;
		display: flex;
		.items{
			background: #fff;
			padding: 10px 30px;
			text-align: center;
			margin-left: 20px;
			cursor: pointer;
		}
	}
}
</style>
