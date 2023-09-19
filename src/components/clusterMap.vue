<!--
  功能：大屏地图组件
  作者：bianxiaokai
  时间：2023年08月12日 11:20:05
-->
<template>
	<div class="vueMapContainer">
		<div
			ref="vue_map_InfoWindow"
			class="vue_map_InfoWindow"
			v-show="tipShow"
		>
			<div class="header">
				<div class="close" @click="onCloseTool">&times;</div>
			</div>
			<ul class="list">
				<li>
					<span class="span-1">站点名称:</span>
					<span class="span-2">{{ tipInfo.stationName }}</span>
				</li>
				<li>
					<span class="span-1">共享情况:</span>
					<span class="span-2">{{ tipInfo.sharingCondition }}</span>
				</li>
                <li>
                    <span class="span-1">站点状态:</span>
                    <span class="span-2">{{tipInfo.stationStatusName}}</span>
                </li>
				<li>
					<span class="span-1">保障等级:</span>
					<span class="span-2">{{
						tipInfo.protectionLevel
					}}</span>
				</li>
				<li>
					<span class="span-1">最近巡检:</span>
					<span class="span-2">{{ tipInfo.startTime }}</span>
				</li>
			</ul>
		</div>
		<div
			ref="order_map_InfoWindow"
			class="order_map_InfoWindow"
			v-show="orderShow"
		>
			<div class="header">
				<div class="close" @click="onCloseTool">&times;</div>
			</div>
			<ul class="list">
                <div style="color: #ddd">进行中：</div>
				<li v-for="item in orderInfo.list" :key="item.id">
					<span class="span-1">{{ item.name }} * </span>
					<span class="span-2">{{ item.od_list.length }}</span>
				</li>
			</ul>
		</div>
		<div class="screenVueMap" id="screenVueMap" ref="mapContainer">
			<dv-loading>Loading...</dv-loading>
		</div>
	</div>
</template>
<script>
//import(导入)其他文件（如：组件，工具js，第三方插件js，json文件，图片文件等）
import AMapLoader from '@amap/amap-jsapi-loader';
import _ from 'lodash';
export default {
	/**注册组件*/
	components: {},
	/**接受父组件传值*/
	props: {
		keyword: {
			type: String,
			default: '中国',
		},
		request: {
			type: Function,
			default: () => {},
		},
		dataType: {
			type: String | Number,
			default: 1,
		},
	},
	name: 'screenVueMap',
	data() {
		return {
			AMap: null,
			cluster: null,
			district: null,
			map: null,
			gridSize: 60,
			points: [
				{ lnglat: ['108.939621', '34.343147'] },
				{ lnglat: ['112.985037', '23.15046'] },
			],
			marker: [],
			polygons: [],
			tipShow: false,
			tipInfo: {},
			infoWindow: null,

            orderInfo: {},
            orderShow: false,
		};
	},
	/**计算属性*/
	computed: {},
	/**监听data数据变化*/
	watch: {
		keyword: {
			handler(val) {
				this.initMap(this.request);
			},
			immediate: true,
		},
		request: {
			handler(val) {
				console.log('request', val);
				this.initMap(val);
			},
			deep: true,
            immediate: true,
		},
	},
	/**所有方法*/
	methods: {
		renderClusterMarker(context, marker, AMap) {
			let count = marker.length;
			// 聚合中点个数
			var clusterCount = context.count;
			var size = Math.round(
				25 + Math.pow(clusterCount / count, 1 / 5) * 40
			);
			var div = document.createElement('div');
			// 聚合点配色
			var defaultColor = [
				'204,235,197',
				'168,221,181',
				'123,204,196',
				'78,179,211',
				'43,140,190',
			];
			var bgColor = '';
			if (clusterCount >= 0 && clusterCount < 10) {
				bgColor = defaultColor[0];
			} else if (clusterCount >= 10 && clusterCount < 100) {
				bgColor = defaultColor[1];
			} else if (clusterCount >= 100 && clusterCount < 1000) {
				bgColor = defaultColor[2];
			} else if (clusterCount >= 1000 && clusterCount < 10000) {
				bgColor = defaultColor[3];
			} else if (clusterCount >= 10000) {
				bgColor = defaultColor[4];
			}
			div.style.backgroundImage = 'url(https://cdn.hainacssp.com/web-assetsicon-screen-dian.png)';
			div.style.backgroundSize = '100% 100%';

			div.style.width = div.style.height = size + 'px';
			// div.style.border = 'solid 1px rgba(' + bgColor + ',1)';
			// div.style.borderRadius = size / 2 + 'px';
			div.innerHTML = context.count;
			div.style.lineHeight = size + 'px';
			div.style.color = '#ffffff';
			div.style.fontSize = '14px';
			div.style.textAlign = 'center';
			context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2));
			context.marker.setContent(div);
		},
		renderMarker(context, AMap) {
			var userData = context.data[0];
			var content = '';
			if (this.dataType == 1) {
				content = `
                    <div style="postion:relative">
                        <img src="https://cdn.hainacssp.com/web-assetsicon-station.png"  style="width: 30px" />
                        ${
							userData.alarmStatus == 1
								? '<img src="https://cdn.hainacssp.com/web-assetswarning.gif" style="position: absolute; top: 0; left: 25px; width: 20px" />'
								: ''
						}
                    </div>
                `;
			} else if (this.dataType == 2) {
				content = `
                    <div style="postion:relative">
                        <img src="https://cdn.hainacssp.com/web-assetsicon-order.svg" style="width: 30px" />
                        <div style="width: 50px; color: #fff; text-align: center; position: absolute; left: 50%; margin-left: -25px; font-size: 12px">工单 * ${userData.size}</div>
                    </div>
                `;
			} else {
                // 1 : 不在线 0 在线
                const img = userData.status == 0 ? 'https://cdn.hainacssp.com/web-assets/icon-memebr-line.png' : 'https://cdn.hainacssp.com/web-assets/icon-member-unline.png';
				content = `
                    <div style="postion:relative">
                        <img src="${img}" style="width: 30px" />
                        <div style="width: 50px; color: #fff; text-align: center; position: absolute; left: 50%; margin-left: -25px; font-size: 12px">${userData.userName}</div>
                    </div>
                `;
			}
			var offset = new AMap.Pixel(-9, -9);
			context.marker.setContent(content);
			context.marker.setOffset(offset);
			const item = context?.data?.[0];
			context.marker.isCluster = item.isCluster;
			const icon = item.icon || item?.props?.icon;
			icon && context.marker.setIcon(icon);
			if (!item.isCluster) {
				context.marker.setzIndex(1000);
			}
			const title = item.title || item?.props?.title;
			title && context.marker.setTitle(title);
			context.marker.on('click', (e) => {
                if(this.dataType == 2) {
                    this.showOrderInfoWindowFun(item.props || item, AMap);
                } else if(this.dataType == 1){
                    this.showInfoWindowFun(item.props || item, AMap);
                }
			});
			this.$emit('renderMarkerClick', context);
		},
		setMaker(marker, AMap) {
			AMap.plugin(['AMap.MarkerCluster'], () => {
				if (this.cluster) {
					this.cluster.setMap(null);
					this.cluster = null;
				}
				this.cluster = new AMap.MarkerCluster(this.map, marker, {
					gridSize: this.gridSize, // 设置网格像素大小
					renderClusterMarker: (context) =>
						this.renderClusterMarker(context, marker, AMap), // 自定义聚合点样式
					renderMarker: (context) => this.renderMarker(context, AMap), // 自定义非聚合点样式
				});
			});
		},
		showInfoWindowFun(props, AMap) {
			this.infoWindow = new AMap.InfoWindow({
				isCustom: true,
				content: this.$refs.vue_map_InfoWindow,
				// offset: new AMap.Pixel(-20, -56),
			});
			this.tipInfo = {
				...props,
			};
			// this.map.setFitView();
			this.tipShow = true;
			this.infoWindow.open(this.map, [
				props.lnglat.lng,
				props.lnglat.lat,
			]);
		},
		showOrderInfoWindowFun(props, AMap) {
			this.infoWindow = new AMap.InfoWindow({
				isCustom: true,
				content: this.$refs.order_map_InfoWindow,
				// offset: new AMap.Pixel(-20, -56),
			});
			this.orderInfo = props;
			// this.map.setFitView();
			this.orderShow = true;
			this.infoWindow.open(this.map, props.lnglat);
		},
		onCloseTool() {
			this.clearMap();
		},
		clearMap() {
			if (!this.map) return false;
			// this.map.clearMap();
			this.map.clearInfoWindow();
			this.cluster && this.map.remove(this.cluster);
		},
		async initMap(request = () => {}) {
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
			this.map = new AMap.Map('screenVueMap', {
				viewMode: '2D', // 地图模
				zoom: 3.9, //初始化地图级别
				mapStyle: 'amap://styles/darkblue', //设置地图的显示样式
			});
			this.district = new AMap.DistrictSearch({
                // subdistrict: 0, //获取边界不需要返回下级行政区
				extensions: 'all', //返回行政区边界坐标组等具体信息
				level: 'district', //查询行政级别为 市
				zooms: [3, 20],
			});
			this.district.search(this.keyword, (status, result) => {
				if (this.polygons.length) {
					this.map.remove(this.polygons); //清除上次结果
					this.polygons = [];
				}
				if (status == 'complete') {
					const bounds = result.districtList[0].boundaries;
					if (bounds) {
						// 显示对应的行政区域
						for (let i = 0, l = bounds.length; i < l; i++) {
							//生成行政区划polygon

							const polygon = new AMap.Polygon({
								strokeWeight: 1,
								path: bounds[i],
								fillOpacity: 0.1,
								// fillColor: 'transparent',
								// strokeColor: 'transparent',
							});
							this.polygons.push(polygon);
						}
					}
					this.map.add(this.polygons);
					this.map.setFitView(
						this.polygons,
						false,
						[150, 60, 100, 60]
					); //视口自适应
					request({
						area: this.keyword,
					}).then((res) => {
						if (res.code == 0) {
							let markers = [];
							if (this.dataType == 1) {
								markers = res.data.siteInfoList.map((el) => {
									return {
										lnglat: [el.lng, el.lat],
										...el,
									};
								});
							} else if (this.dataType == 2) {
								const mks = {};
								res.data.orderInfoList.forEach((el) => {
									const formatKey = el.lng + ',' + el.lat;
									if (mks[formatKey]?.length) {
										mks[formatKey].push({
											lnglat: [el.lng, el.lat],
											...el,
										});
									} else {
										mks[formatKey] = [
											{
												lnglat: [el.lng, el.lat],
												...el,
											},
										];
									}
								});
								const newDataList = [];
								for (const key in mks) {
									if (Object.hasOwnProperty.call(mks, key)) {
										const element = mks[key];
										const [lng, lat] = key.split(',');
										const item = {
											lnglat: [lng, lat],
											list: [],
                                            size: element.length,
										};
                                        const od = {};
                                        element.forEach(el => {
                                            if(od[el.orderTypeName]?.length) {
                                                od[el.orderTypeName].push(el)
                                            } else {
                                                od[el.orderTypeName] = [el];
                                            }
                                        })

                                        const odArr = [];
                                        for (const k in od) {
                                            if (Object.hasOwnProperty.call(od, k)) {
                                                const el = od[k];
                                                const odi = {
                                                    name: k,
                                                    od_list: el
                                                }
                                                odArr.push(odi);
                                            }
                                            item.list = odArr;
                                        }
                                        newDataList.push(item);
									}
								}
								markers = _.cloneDeep(newDataList);
							} else if (this.dataType == 3) {
								markers = res.data.map((el) => {
									return {
										lnglat: [el.lng, el.lat],
										...el,
									};
								});
							}

							this.setMaker(markers, AMap);
						}
					});
				}
			});
		},
	},
	/**创建组件时执行(有VM对象this)*/
	created() {},
	/**加载完组件时执行(主要预处理数据)*/
	mounted() {
		// this.initMap();
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
.header {
	display: flex;
	justify-content: flex-end;
	.close {
		font-size: 16px;
        padding-right: 13px;
		cursor: pointer;
        color: #fff;
	}
}
.vueMapContainer {
	width: 100%;
	height: 100%;
}
.screenVueMap {
	width: 100%;
	height: 100%;
}
.vue_map_InfoWindow {
	display: inline-block;
	margin-left: 100px;
	padding: 12px 16px;
	/*height: 165px;*/
	background: url('https://cdn.hainacssp.com/web-assetsicon-screen-tip-bg-v7.png') no-repeat;
    background-size: 100% 100%;
	min-width: 300px;
    color: #fff;

	.el-breadcrumb {
		padding: 5px 0;
	}

	.el-breadcrumb__item {
		font-size: 14px;
		//font-family: PingFangSC-Regular, PingFang SC, serif;
		font-weight: 400;
	}

	::v-deep .location .el-breadcrumb__inner {
		color: #5674e5;
	}

	.list {
		padding-left: 0;
		list-style: none;
		margin: 0;

		li {
			position: relative;
			padding: 2px 0;
			font-size: 14px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(255, 255, 255, .8);
			line-height: 24px;
			display: flex;

			.span-1 {
				flex: 0 0 80px;
				position: relative;
				padding-left: 15px;
			}

			.span-1:after {
				content: '';
				position: absolute;
				width: 6px;
				height: 6px;
				border: 1px solid #FFF;
				border-radius: 50%;
				top: 10px;
				//top: 50%;
				left: 0;
				//transform: translateY(-50%);
			}

			.span-2 {
				flex: 1;
			}
		}

		//li::after {
		//  content: '';
		//  position: absolute;
		//  width: 6px;
		//  height: 6px;
		//  border: 1px solid #5674E5;
		//  border-radius: 50%;
		//  top: 50%;
		//  left: 0;
		//  transform: translateY(-50%);
		//}
	}
}
.order_map_InfoWindow {
	display: inline-block;
	// margin-left: 100px;
	padding: 12px 16px;
	/*height: 165px;*/
	background: url('https://cdn.hainacssp.com/web-assetsicon-screen-tip-bg-v7.png') no-repeat;
    background-size: 100% 100%;
	min-width: 300px;

	.el-breadcrumb {
		padding: 5px 0;
	}

	.el-breadcrumb__item {
		font-size: 14px;
		//font-family: PingFangSC-Regular, PingFang SC, serif;
		font-weight: 400;
	}

	::v-deep .location .el-breadcrumb__inner {
		color: #5674e5;
	}

	.list {
		padding-left: 0;
		list-style: none;
		margin: 0;
        height: 100px;
        overflow-y: auto;

		li {
			position: relative;
			padding: 2px 0;
			font-size: 14px;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: rgba(255, 255, 255, .8);
			line-height: 24px;
			display: flex;
		}

		//li::after {
		//  content: '';
		//  position: absolute;
		//  width: 6px;
		//  height: 6px;
		//  border: 1px solid #5674E5;
		//  border-radius: 50%;
		//  top: 50%;
		//  left: 0;
		//  transform: translateY(-50%);
		//}
	}
}
</style>
