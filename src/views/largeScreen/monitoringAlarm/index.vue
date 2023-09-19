<template>
	<ScaleBox
		class="large-screen-view"
		:width="1750"
		:height="994"
		bgc="transparent"
		:delay="100"
		:isFlat="true"
	>
		<!-- 开场动画 -->
		<my-start v-if="StartFlag" />
		<!-- 点击跳过按钮 -->
		<div id="timer" v-if="StartFlag" @click="Skip">
			<div class="timer-text">跳过</div>
			<div class="timer-round">
				<div class="left wrap">
					<div class="left-radius radius"></div>
				</div>
				<div class="right wrap">
					<div class="right-radius radius"></div>
				</div>
			</div>
		</div>
		<!-- 渲染主页 -->
		<div class="animate__animated" ref="animate">
			<div class="container-header" v-if="!StartFlag">
				<!-- 时间组件 -->
				<!--<my-time class="my-time" />-->
				<div class="left-h3" @click="goZy()" style="cursor: pointer">
					海久六灵数字维护共享平台
				</div>
				<div class="navList">
					<div class="item" @click="onPage('/china')">概览</div>
					<div class="item2" @click="onPage('/aiMove')">智能调度</div>
					<div class="item2">预检预修</div>
					<div class="item2 nav-active" @click="onPage('/alarm')">监控告警</div>
					<div class="item2">研判分析</div>
					<div class="item2">无人机巡检</div>
					<div class="item2">智慧基站</div>
                    <div class="item2">基站消防</div>
				</div>
				<div class="zhmc">
					<div class="name">{{ name }}<i></i></div>
					<div class="nameXl">
						<div class="item" @click="goZy">管理后台</div>
						<div class="item" @click="logout">退出系统</div>
					</div>
				</div>
			</div>
			<div class="container-content" v-if="!StartFlag">
				<div class="container-left">
					<div class="count-share">
						<div class="com-count-title">
							<i class="logo"></i>资源总览
						</div>
						<div class="com-screen-content zyzl">
							<div class="bj">
								<div class="zbj"></div>
								<div class="fbj"></div>
								<div class="fbj2"></div>
								<dv-decoration-12
									style="
										height: 100%;
										position: absolute;
										width: 100%;
										left: 0px;
										bottom: 0px;
										opacity: 0.05;
									"
								/>
							</div>
							<dv-loading v-if="!showZyzl">Loading...</dv-loading>
							<div class="containerBox" v-show="showZyzl">
								<div class="swiper-container">
									<div class="swiper-wrapper">
										<div class="swiper-slide item">
											<div
												class="dataList"
												v-if="showZyzl"
											>
												<div class="item dist-item">
													<div class="name">
														维护站址数
													</div>
													<div class="bottom">
														<count-to
															class="data-count"
															:startVal="0"
															:endVal="
																zyzl.stationNum
															"
															:decimals="0"
															:duration="2000"
														></count-to>
														<div class="dw">个</div>
													</div>
												</div>
												<div class="item dist-item">
													<div class="name">
														维护人员数
													</div>
													<div class="bottom">
														<count-to
															class="data-count"
															:startVal="0"
															:endVal="
																zyzl.umsMemberNum
															"
															:decimals="0"
															:duration="2000"
														></count-to>
														<div class="dw">人</div>
													</div>
												</div>
												<div class="item dist-item">
													<div class="name">
														工单数
													</div>
													<div class="bottom">
														<count-to
															class="data-count"
															:startVal="0"
															:endVal="
																zyzl.workOrderNum
															"
															:decimals="0"
															:duration="2000"
														></count-to>
														<div class="dw">个</div>
													</div>
												</div>
												<div class="item dist-item">
													<div class="name">
														覆盖地县数
													</div>
													<div class="bottom">
														<count-to
															class="data-count"
															:startVal="0"
															:endVal="
																zyzl.bladeReginNum
															"
															:decimals="0"
															:duration="2000"
														></count-to>
														<div class="dw">个</div>
													</div>
												</div>
												<div class="item dist-item">
													<div class="name">
														在线人数
													</div>
													<div class="bottom">
														<count-to
															class="data-count"
															:startVal="0"
															:endVal="
																Number(
																	zyzl.onlineNum ||
																		0
																)
															"
															:decimals="0"
															:duration="2000"
														></count-to>
														<div class="dw">人</div>
													</div>
												</div>
												<div class="item dist-item">
													<div class="name">
														工单交易额
													</div>
													<div class="bottom">
														<count-to
															class="data-count"
															:startVal="0"
															:endVal="
																Number(
																	zyzl.money
																)
															"
															:decimals="2"
															:duration="2000"
														></count-to>
														<div class="dw">元</div>
													</div>
												</div>
											</div>
										</div>
										<div class="swiper-slide item">
											<div
												class="dataList"
												v-if="showZyzl"
											>
												<div class="item dist-item">
													<div class="name">
														更新整治
													</div>
													<div class="bottom">
														<count-to
															class="data-count"
															:startVal="0"
															:endVal="72570.0"
															:decimals="2"
															:duration="4000"
														></count-to>
														<div class="dw">元</div>
													</div>
												</div>
												<div
													class="item dist-item"
												></div>
												<div
													class="item dist-item"
												></div>
												<div class="item dist-item">
													<div class="name">
														电费缴纳
													</div>
													<div class="bottom">
														<count-to
															class="data-count"
															:startVal="0"
															:endVal="1701886.42"
															:decimals="2"
															:duration="4000"
														></count-to>
														<div class="dw">元</div>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div class="swiper-button-prev"></div>
									<div class="swiper-button-next"></div>
								</div>
							</div>
						</div>
					</div>
					<div class="count-share">
						<div class="com-count-title">
							<i class="logo"></i>站点类型分布
						</div>
						<div class="com-screen-content jzlxfb">
							<div class="bj">
								<div class="zbj"></div>
								<div class="fbj"></div>
								<div class="fbj2"></div>
								<dv-decoration-6
									style="
										height: 100%;
										position: absolute;
										width: 100%;
										left: 0px;
										bottom: 0px;
										opacity: 0.05;
									"
								/>
							</div>
							<my-chart
								:my-option="chartJzData"
								v-if="showJzlx"
							/>
							<dv-loading v-if="!showJzlx">Loading...</dv-loading>
						</div>
					</div>
					<div class="count-share">
						<div class="com-count-title">
							<i class="logo"></i>人员角色分布
						</div>
						<div class="com-screen-content ryjsfb">
							<div class="bj">
								<div class="zbj"></div>
								<div class="fbj"></div>
								<div class="fbj2"></div>
								<dv-decoration-6
									style="
										height: 100%;
										position: absolute;
										width: 100%;
										left: 0px;
										bottom: 0px;
										opacity: 0.05;
									"
								/>
							</div>
							<dv-loading
								v-if="!showAnalyzeSkillTypeRatioInCodeList"
								>Loading...</dv-loading
							>
							<my-chart
								:my-option="chartRyjsfbData"
								style="height: 100%"
								v-if="showAnalyzeSkillTypeRatioInCodeList"
							/>
						</div>
					</div>
				</div>
				<!-- 地图 -->
				<div class="mid">
					<static-map @change="changeInit"/>
				</div>
				<div class="container-right">
					<div class="count-share">
						<div class="com-count-title">
							<i class="logo"></i>FSU概况
						</div>
						<div class="com-screen-content fsu">
							<div class="bj">
								<div class="zbj"></div>
								<div class="fbj"></div>
								<div class="fbj2"></div>
								<dv-decoration-12
									style="
										height: 100%;
										position: absolute;
										width: 100%;
										left: 0px;
										bottom: 0px;
										opacity: 0.1;
									"
								/>
							</div>
							<dv-loading v-if="!showAnalyzeFsu"
								>Loading...</dv-loading
							>
							<div class="dataFsu" v-if="showAnalyzeFsu">
								<div class="item">
									<img src="@/assets/images/zai.png" alt="" />
									<div class="dataRight">
										<div class="name">在线</div>
										<count-to
											class="data-count"
											:startVal="0"
											:endVal="analyzeFsu.countOnline"
											:decimals="0"
											:duration="2000"
										></count-to>
									</div>
								</div>
								<div class="item">
									<img src="@/assets/images/li.png" alt="" />
									<div class="dataRight">
										<div class="name">离线</div>
										<count-to
											class="data-count"
											:startVal="0"
											:endVal="analyzeFsu.countOffline"
											:decimals="0"
											:duration="2000"
										></count-to>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="count-share">
						<div class="com-count-title">
							<i class="logo"></i>实时告警
						</div>
						<div class="com-screen-content ssgj">
							<div class="bj">
								<div class="zbj"></div>
								<div class="fbj"></div>
								<div class="fbj2"></div>
							</div>
							<dv-loading v-if="!showRealActiveAlarm"
								>Loading...</dv-loading
							>
							<!-- 自动滚动表格 -->
							<ScrollTableGj
								style="z-index: 2; position: relative"
								:realActiveAlarm="realActiveAlarm"
								v-if="showRealActiveAlarm"
							/>
						</div>
					</div>
					<div class="count-share">
						<div class="com-count-title">
							<i class="logo"></i>告警级别统计
						</div>
						<div class="com-screen-content gjjb">
							<div class="bj">
								<div class="zbj"></div>
								<div class="fbj"></div>
								<div class="fbj2"></div>
							</div>
							<dv-loading v-if="!showAnalyzeAlertLevelRatio"
								>Loading...</dv-loading
							>
							<div
								class="gjjbtj"
								v-if="showAnalyzeAlertLevelRatio"
							>
								<div class="left">
									<div class="all">
										<dv-decoration-9 class="number">{{
											analyzeAlertLevelRatio &&
											analyzeAlertLevelRatio.length > 0
												? analyzeAlertLevelRatio[0]
														.total
												: 0
										}}</dv-decoration-9>
										<!--<img src="@/assets/images/zhuan.png" alt="">-->
										<!--<span class="number">{{analyzeAlertLevelRatio&&analyzeAlertLevelRatio.length>0?analyzeAlertLevelRatio[0].total:0}}</span>-->
									</div>
									<div class="info">告警总量 单位(个)</div>
								</div>
								<div class="right">
									<dv-decoration-10
										style="
											position: absolute;
											left: 0px;
											top: 25%;
											opacity: 0.5;
											height: 50%;
										"
									/>
									<div
										class="item"
										v-if="analyzeAlertLevelRatioNew.one"
									>
										<div class="logo logo1">
											<span>{{
												analyzeAlertLevelRatioNew.one
													.name
											}}</span>
										</div>
										<div class="val">
											<div class="bfb">
												·{{
													analyzeAlertLevelRatioNew
														.one.cnt
												}}
											</div>
											<div class="jtz">
												·{{
													analyzeAlertLevelRatioNew
														.one.ratio
												}}
											</div>
										</div>
									</div>
									<div
										class="item"
										v-if="analyzeAlertLevelRatioNew.two"
									>
										<div class="logo logo2">
											<span>{{
												analyzeAlertLevelRatioNew.two
													.name
											}}</span>
										</div>
										<div class="val">
											<div class="bfb">
												·{{
													analyzeAlertLevelRatioNew
														.two.cnt
												}}
											</div>
											<div class="jtz">
												·{{
													analyzeAlertLevelRatioNew
														.two.ratio
												}}
											</div>
										</div>
									</div>
									<div
										class="item"
										v-if="analyzeAlertLevelRatioNew.three"
									>
										<div class="logo logo3">
											<span>{{
												analyzeAlertLevelRatioNew.three
													.name
											}}</span>
										</div>
										<div class="val">
											<div class="bfb">
												·{{
													analyzeAlertLevelRatioNew
														.three.cnt
												}}
											</div>
											<div class="jtz">
												·{{
													analyzeAlertLevelRatioNew
														.three.ratio
												}}
											</div>
										</div>
									</div>
									<div
										class="item"
										v-if="analyzeAlertLevelRatioNew.four"
									>
										<div class="logo logo4">
											<span>{{
												analyzeAlertLevelRatioNew.four
													.name
											}}</span>
										</div>
										<div class="val">
											<div class="bfb">
												·{{
													analyzeAlertLevelRatioNew
														.four.cnt
												}}
											</div>
											<div class="jtz">
												·{{
													analyzeAlertLevelRatioNew
														.four.ratio
												}}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="container-content" v-if="!StartFlag">
				<div class="container-left">
					<div class="count-share">
						<div class="com-count-title">
							<i class="logo"></i>实时工单
						</div>
						<div class="com-screen-content ssgd">
							<div class="bj">
								<div class="zbj"></div>
								<div class="fbj"></div>
								<div class="fbj2"></div>
							</div>
							<!-- 自动滚动表格 -->
							<dv-loading v-if="!showQueryRecentlyWorkOrder"
								>Loading...</dv-loading
							>
							<ScrollTable
								v-if="showQueryRecentlyWorkOrder"
								style="z-index: 2; position: relative"
								:queryRecentlyWorkOrder="queryRecentlyWorkOrder"
							/>
						</div>
					</div>
				</div>
				<div class="container-center">
					<div class="count-share">
						<div class="com-count-title">
							<i class="logo"></i>工单数趋势
							<div class="navList">
								<div
									:class="
										gdSqsLast == '1W'
											? 'active navItem'
											: 'navItem'
									"
									@click="
										gdSqsLast = '1W';
										getAnalyzeWorkOrderTrendQuantity();
									"
								>
									周
								</div>
								<div
									:class="
										gdSqsLast == '1M'
											? 'active navItem'
											: 'navItem'
									"
									@click="
										gdSqsLast = '1M';
										getAnalyzeWorkOrderTrendQuantity();
									"
								>
									月
								</div>
							</div>
						</div>
						<div class="com-screen-content gdqs">
							<div class="bj">
								<div class="zbj"></div>
								<div class="fbj"></div>
								<div class="fbj2"></div>
							</div>
							<dv-loading v-if="!showChartGdSqs"
								>Loading...</dv-loading
							>

							<my-chart
								:my-option="chartGdSqs"
								v-if="showChartGdSqs"
							/>
						</div>
					</div>
					<div class="count-share">
						<div class="com-count-title">
							<i class="logo"></i>工单交易额趋势
							<div class="navList">
								<div
									:class="
										gdJyeLast == '1W'
											? 'active navItem'
											: 'navItem'
									"
									@click="
										gdJyeLast = '1W';
										getAnalyzeWorkOrderTrendAmount();
									"
								>
									周
								</div>
								<div
									:class="
										gdJyeLast == '1M'
											? 'active navItem'
											: 'navItem'
									"
									@click="
										gdJyeLast = '1M';
										getAnalyzeWorkOrderTrendAmount();
									"
								>
									月
								</div>
							</div>
						</div>
						<div class="com-screen-content gdjye">
							<div class="bj">
								<div class="zbj"></div>
								<div class="fbj"></div>
								<div class="fbj2"></div>
							</div>
							<dv-loading v-if="!showChartGdJyeQs"
								>Loading...</dv-loading
							>
							<my-chart
								:my-option="chartGdJyeQs"
								v-if="showChartGdJyeQs"
							/>
						</div>
					</div>
				</div>
				<div class="container-right">
					<div class="count-share">
						<div class="com-count-title">
							<i class="logo"></i>全国热榜
						</div>
						<div class="com-screen-content qgrb">
							<div class="bj">
								<div class="zbj"></div>
								<div class="fbj"></div>
								<div class="fbj2"></div>
							</div>
							<div class="rbBox" v-if="showNationalHot">
								<div class="boxItem">
									<div class="top">
										<i class="logo"></i>工单数
									</div>
									<div class="bottom pm">
										<div
											class="item"
											v-for="(
												item, i
											) in nationalHot.topUmsMember"
										>
											<img
												src="@/assets/images/jb1.png"
												alt=""
												v-if="i == 0"
											/>
											<img
												src="@/assets/images/jb2.png"
												alt=""
												v-else-if="i == 1"
											/>
											<img
												src="@/assets/images/jb3.png"
												alt=""
												v-else
											/>
											<div class="name">
												{{ item.name }}
											</div>
											<div class="val">
												{{ item.completeWorkOrderNums }}
											</div>
										</div>
									</div>
								</div>
								<div class="boxItem">
									<div class="top">
										<i class="logo"></i>各地交易额
									</div>
									<div class="bottom jye">
										<div
											class="item"
											v-for="(
												item, i
											) in nationalHot.topHotArea"
											v-if="i < 5"
										>
											<div class="name">
												{{ item.cityName }}
											</div>
											<div class="val">
												{{
													item.completeWorkOrderMoney
												}}
											</div>
											<img
												src="@/assets/images/shang.png"
												alt=""
												class="pmlogo"
												v-if="item.flag == 1"
											/>
											<img
												src="@/assets/images/zhong.png"
												alt=""
												class="pmlogo2"
												v-if="item.flag == 0"
											/>
											<img
												src="@/assets/images/xia.png"
												alt=""
												class="pmlogo"
												v-if="item.flag == -1"
											/>
										</div>
									</div>
								</div>
							</div>
							<dv-loading v-if="!showNationalHot"
								>Loading...</dv-loading
							>
						</div>
					</div>
				</div>
			</div>
			<div class="container-bottom" v-if="!StartFlag"></div>
		</div>
	</ScaleBox>
</template>
<script>
import { mapGetters } from 'vuex';
import { mapState } from 'vuex';
import 'swiper/dist/css/swiper.min.css';
import 'swiper/dist/js/swiper.min';
import Swiper from 'swiper';
import ScrollTable from '../components/scrollTable/index.vue';
import ScrollTableGj from '../components/scrollTableGj/index.vue';
import MyChart from '../components/MyEcharts/index.vue';
import MyStart from '../components/MyStart/index.vue';
import MyTime from '../components/MyTime/index.vue';
import * as echarts from 'echarts';
import StaticMap from '@c/staticMap/index.vue';
import CountTo from 'vue-count-to';
import {
	analyzeStationTypeRatioInCodeList,
	resourceOverview,
	realActiveAlarm,
	queryRecentlyWorkOrder,
	nationalHot,
	analyzeWorkOrderTrend,
	analyzeSkillTypeRatioInCodeList,
	analyzeAlertLevelRatio,
	analyzeFsu,
} from '@/api/lagreScreen';
import ScaleBox from 'vue2-scale-box';

const colors = [
	new echarts.graphic.LinearGradient(0, 0, 0, 1, [
		{
			offset: 0,
			color: 'rgb(128, 255, 165)',
		},
		{
			offset: 1,
			color: 'rgb(1, 191, 236)',
		},
	]),
	new echarts.graphic.LinearGradient(0, 0, 0, 1, [
		{
			offset: 0,
			color: 'rgb(0, 221, 255)',
		},
		{
			offset: 1,
			color: 'rgb(77, 119, 255)',
		},
	]),
	new echarts.graphic.LinearGradient(0, 0, 0, 1, [
		{ offset: 0, color: '#FC6679' },
		{ offset: 1, color: '#FDC581' },
	]),
	new echarts.graphic.LinearGradient(0, 0, 0, 1, [
		{
			offset: 0,
			color: 'rgb(55, 162, 255)',
		},
		{
			offset: 1,
			color: 'rgb(116, 21, 219)',
		},
	]),
	new echarts.graphic.LinearGradient(0, 0, 0, 1, [
		{
			offset: 0,
			color: 'rgb(255, 0, 135)',
		},
		{
			offset: 1,
			color: 'rgb(135, 0, 157)',
		},
	]),
	new echarts.graphic.LinearGradient(0, 0, 0, 1, [
		{
			offset: 0,
			color: 'rgb(255, 191, 0)',
		},
		{
			offset: 1,
			color: 'rgb(224, 62, 76)',
		},
	]),
];
export default {
	components: {
		MyTime,
		ScaleBox,
		MyStart,
		CountTo,
		ScrollTableGj,
		ScrollTable,
		MyChart,
		StaticMap,
	},
	computed: {
		...mapGetters(['name']),
		...mapState(['screen']),
	},
	data() {
		return {
			mapTypeList: [
				{
					value: 1,
					label: '站点',
					active: true,
				},
				{
					value: 2,
					label: '工单',
					active: false,
				},
				{
					value: 3,
					label: '人员',
					active: false,
				},
			],
			parameter: {
				code: '',
				regionalLevel: this.$route.query.regionalLevel
					? this.$route.query.regionalLevel
					: '',
			},
			zyzl: {},
			showZyzl: false,
			analyzeFsu: {},
			showAnalyzeFsu: false,
			nationalHot: {},
			showNationalHot: false,
			realActiveAlarm: [],
			showRealActiveAlarm: false,
			analyzeAlertLevelRatio: [{}],
			analyzeAlertLevelRatioNew: {},
			showAnalyzeAlertLevelRatio: false,
			queryRecentlyWorkOrder: [],
			showQueryRecentlyWorkOrder: false,
			analyzeWorkOrderTrend: null,
			analyzeSkillTypeRatioInCodeList: null,
			analyzeStationTypeRatioInCodeList: null,
			StartFlag: false,
			timer: null,
			JumpOutTimer: null,

			chartJzData: {
				tooltip: {
					show: false,
				},
				legend: {
					show: false,
				},
				toolbox: {
					show: false,
				},
				series: {},
			},

			chartRyjsfbData: {
				tooltip: {
					trigger: 'item',
				},
				legend: {
					itemWidth: 12,
					itemHeight: 5,
					orient: 'vertical',
					left: 'right',
					top: 'center',
					textStyle: { color: 'rgba(255,255,255,0.6)', size: 12 },
				},
				label: {
					show: false,
					position: 'center',
				},
				// label: {
				//     alignTo: 'edge',
				//     formatter: '{name|{b}}\n{time|{c} 小时}',
				//     minMargin: 5,
				//     edgeDistance: 10,
				//     lineHeight: 15,
				//     rich: {
				//         time: {
				//             fontSize: 10,
				//             color: '#999'
				//         }
				//     },
				//     color:"#ffffff"
				// },
				series: [
					{
						opacity: 0.8,
						color: colors,
						name: '人员角色分布',
						type: 'pie',
						minAngle: 15, //最小角度
						startAngle: 320, //起始角度
						radius: ['40%', '80%'],
						center: ['20%', '50%'],
						avoidLabelOverlap: false,
						label: {
							show: false,
							position: 'center',
							color: '#fff',
							fontSize: 10,
						},
						emphasis: {
							label: {
								show: true,
								fontSize: 18,
								fontWeight: 'bold',
							},
						},
						labelLine: {
							show: false,
						},
						data: [
							{ value: 1048, name: 'Search Engine' },
							{ value: 735, name: 'Direct' },
							{ value: 580, name: 'Email' },
							{ value: 484, name: 'Union Ads' },
							{ value: 300, name: 'Video Ads' },
						],
					},
				],
			},

			gdSqsLast: '1M',
			showChartGdJyeQs: false,
			showJzlx: false,
			showAnalyzeSkillTypeRatioInCodeList: false,
			showChartGdSqs: false,
			chartGdSqs: {
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'shadow',
					},
				},
				legend: {
					itemHeight: 5,
					itemWidth: 15,
					padding: 0,
					top: '0',
					textStyle: { color: '#fff' },
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					top: '15%',
					containLabel: true,
				},

				xAxis: {
					color: 'rgba(255,255,255,0.2)', // 设置坐标轴颜色
					splitLine: { show: false }, //去除网格线
					axisLine: {
						lineStyle: {
							color: "'rgba(255,255,255,0.2)",
						},
					},
					axisLabel: {
						textStyle: {
							color: 'rgba(255,255,255,0.4)', //坐标值得具体的颜色
						},
					},
					type: 'category',
					boundaryGap: true,
					data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
				},
				yAxis: {
					splitLine: {
						lineStyle: {
							type: 'dashed',
							color: 'rgba(255,255,255,0.2)', //坐标轴线颜色
							width: '1',
						},
					},
					color: '#eee',
					type: 'value',
					axisLine: {
						lineStyle: {
							color: 'rgba(255,255,255,0.2)',
						},
					},
					axisLabel: {
						textStyle: {
							color: 'rgba(255,255,255,0.4)', //坐标值得具体的颜色
						},
					},
				},
				series: [],
			},
			gdJyeLast: '1M',
			chartGdJyeQs: {
				color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
				legend: {
					padding: 0,
					itemHeight: 10,
					itemWidth: 15,
					top: '0',
					textStyle: { color: '#fff' },
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					top: '15%',
					containLabel: true,
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'cross',
						label: {
							backgroundColor: '#6a7985',
						},
					},
				},
				xAxis: {
					color: 'rgba(255,255,255,0.2)', // 设置坐标轴颜色

					splitLine: { show: false }, //去除网格线
					axisLine: {
						lineStyle: {
							color: 'rgba(255,255,255,0.2)',
						},
					},
					axisLabel: {
						textStyle: {
							color: 'rgba(255,255,255,0.4)', //坐标值得具体的颜色
						},
					},
					type: 'category',
					boundaryGap: true,
					data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
				},
				yAxis: {
					color: 'rgba(255,255,255,0.2)',
					type: 'value',
					splitLine: {
						lineStyle: {
							color: 'rgba(255,255,255,0.2)', //坐标轴线颜色
							width: '1',
							type: 'dashed',
						},
					},
					axisLine: {
						lineStyle: {
							color: 'rgba(255,255,255,0.2)',
						},
					},
					axisLabel: {
						textStyle: {
							color: 'rgba(255,255,255,0.4)', //坐标值得具体的颜色
						},
					},
				},
				series: [],
			},
		};
	},
	created() {},

	watch: {
		'$route.path': function (newVal, oldVal) {
			this.init();
		},
	},
	mounted() {
		var that = this;
		if (window.performance.navigation.type !== 1) {
			this.StartFlag = false;
			this.timer = null;
			this.JumpOutTimer = null;
		}

		this.init();
		this.timer = setTimeout(() => {
			that.StartFlag = false;
		}, 3700);
		this.JumpOutTimer = setTimeout(() => {
			if (that.StartFlag) {
				this.$refs.animate.classList.add('active');
			}
		}, 3700);
	},
	methods: {
		onSelectMap(item) {
			// 地图类型选择
			this.$store.dispatch('screen/onSetMapDataType', item.value);
		},
		onPage(path) {
			this.$router.push(path);
		},
		logout() {
			this.$store.dispatch('user/authLogout').then((res) => {
				// this.$router.push(`/login?redirect=${this.$route.fullPath}`)
			});
		},
		initCode() {},
		changeInit() {
			this.init();
		},
		initLb() {
			new Swiper('.swiper-container', {
				loop: false,
				autoplay: false,
				updateOnImagesReady: true,
				slidesPerView: 1, //设置slider容器能够同时显示的slides数量
				//spaceBetween : '10%',按container的百分比

				observer: true, //在 Swiper 的上启用动态检查器(Mutation Observer)，如果你更改swiper 的样式（隐藏/显示）或修改其子元素（添加/删除幻灯片），Swiper 会更新（重新初始化）并触发 observerUpdate 事件。
				observeParents: true,
				observeSlideChildren: true,

				pagination: {
					el: '.swiper-pagination',
					clickable: true,
					paginationClickable: true,
				},
				// 如果需要前进后退按钮
				navigation: {
					nextEl: '.swiper-button-next', // 右按钮
					prevEl: '.swiper-button-prev', // 左按钮
				},
			});
		},
		init() {
			this.initLb();
			this.zyzl = {};
			this.showZyzl = false;
			this.analyzeFsu = {};
			this.showAnalyzeFsu = false;
			this.nationalHot = {};
			this.showNationalHot = false;
			this.realActiveAlarm = [];
			this.showRealActiveAlarm = false;
			this.analyzeAlertLevelRatio = [{}];
			this.analyzeAlertLevelRatioNew = {};
			this.showAnalyzeAlertLevelRatio = false;
			this.queryRecentlyWorkOrder = [];
			this.showQueryRecentlyWorkOrder = false;

			this.showChartGdJyeQs = false;
			this.showJzlx = false;
			this.showAnalyzeSkillTypeRatioInCodeList = false;
			this.showChartGdSqs = false;

			this.parameter = {
				code: '',
				regionalLevel: this.$route.query.regionalLevel
					? this.$route.query.regionalLevel
					: '',
			};
			var code = this.$route.query.code + '';
			if (
				this.$route.query.code &&
				this.$route.query.regionalLevel &&
				this.$route.query.regionalLevel == 1
			) {
				this.parameter.code = code.substring(0, 2);
			}
			if (
				this.$route.query.code &&
				this.$route.query.regionalLevel &&
				this.$route.query.regionalLevel == 2
			) {
				this.parameter.code = code.substring(0, 4);
			}
			if (
				this.$route.query.code &&
				this.$route.query.regionalLevel &&
				this.$route.query.regionalLevel == 3
			) {
				this.parameter.code = code;
			}
			var that = this;
			resourceOverview(this.parameter).then((res) => {
				console.log(res.data);
				this.zyzl = res.data;
				this.showZyzl = true;
			});

			analyzeFsu(this.parameter).then((res) => {
				console.log(res.data);
				this.analyzeFsu = res.data;
				this.showAnalyzeFsu = true;
			});

			analyzeAlertLevelRatio('1M', this.parameter).then((res) => {
				console.log(res.data);
				this.analyzeAlertLevelRatio = res.data;
				for (var i = 0; i < res.data.length; i++) {
					if (res.data[i].name == '一级') {
						this.analyzeAlertLevelRatioNew.one = res.data[i];
					}
					if (res.data[i].name == '二级') {
						this.analyzeAlertLevelRatioNew.two = res.data[i];
					}
					if (res.data[i].name == '三级') {
						this.analyzeAlertLevelRatioNew.three = res.data[i];
					}
					if (res.data[i].name == '四级') {
						this.analyzeAlertLevelRatioNew.four = res.data[i];
					}
				}
				this.showAnalyzeAlertLevelRatio = true;
			});

			nationalHot('1M', this.parameter).then((res) => {
				console.log(res.data);
				this.nationalHot = res.data;
				this.showNationalHot = true;
			});
			//实时告警
			realActiveAlarm('1M', this.parameter).then((res) => {
				console.log(res.data);
				this.realActiveAlarm = res.data;
				this.showRealActiveAlarm = true;
			});

			//工单列表
			queryRecentlyWorkOrder('1M', this.parameter).then((res) => {
				this.queryRecentlyWorkOrder = res.data;
				this.showQueryRecentlyWorkOrder = true;
			});

			//基站类别
			analyzeStationTypeRatioInCodeList(this.parameter).then((res) => {
				console.log(res.data);
				let scaleData = res.data;
				var data = [];
				var color = colors;
				for (var i = 0; i < res.data.length; i++) {
					data.push({
						value: scaleData[i].cnt,
						name: scaleData[i].name,
						label: { color: '#ddd' },
						itemStyle: {
							color: color[i],
						},
					});
				}
				var seriesObj = [
					{
						name: '',
						type: 'pie',
						radius: '65%',
						// roseType: 'area',
						// clockwise: false,
						// minAngle: 0, //最小角度
						// startAngle: 95, //起始角度
						label: {
							show: true,
							position: 'outside',
							formatter: function (params) {
								var percent = 0;
								var total = 0;
								for (var i = 0; i < scaleData.length; i++) {
									total += scaleData[i].cnt;
								}
								percent = (
									(params.value / total) *
									100
								).toFixed(2);

								if (params.name !== '') {
									return (
										params.name +
										'{white|' +
										' ' +
										percent +
										'%}'
									);
								} else {
									return '';
								}
							},
							rich: {
								white: {
									color: 'rgba(255,255,255,0.6)',
									align: 'center',
									padding: [3, 0],
								},
							},
						},
						itemStyle: {
							color: colors,
						},
						data: data,
					},
				];
				that.chartJzData.series = seriesObj;
				that.showJzlx = true;
			});

			that.getAnalyzeSkillTypeRatioInCodeList();
			that.getAnalyzeWorkOrderTrendQuantity();
			//根据行政区域级别与code统计在此区域的工单交易数或交易额趋势
			that.getAnalyzeWorkOrderTrendAmount();
		},
		getAnalyzeSkillTypeRatioInCodeList() {
			//根据行政区域级别与code统计此区域的运维角色下人员个数比例
			var that = this;
			analyzeSkillTypeRatioInCodeList(this.parameter).then((res) => {
				let list = [];
				for (let i = 0; i < res.data.length; i++) {
					list.push({
						name: res.data[i].name,
						value: res.data[i].cnt,
					});
				}
				this.chartRyjsfbData.series[0].data = list;
				this.showAnalyzeSkillTypeRatioInCodeList = true;
			});
		},
		getAnalyzeWorkOrderTrendQuantity() {
			var that = this;
			that.showChartGdSqs = false;
			var obj = JSON.parse(JSON.stringify(this.parameter));
			obj.last = that.gdSqsLast;
			analyzeWorkOrderTrend('quantity', obj).then((res) => {
				console.log(res.data);
				this.analyzeWorkOrderTrend = res.data;
				let xAxis = [];
				let newList2 = [];
				let dataObj = [];
				for (let i = 0; i < res.data.length; i++) {
					xAxis.push(res.data[i].date);
					for (let b = 0; b < res.data[i].dataList.length; b++) {
						if (!newList2.includes(res.data[i].dataList[b].name)) {
							newList2.push(res.data[i].dataList[b].name);
							dataObj.push({
								name: res.data[i].dataList[b].name,
								data: [],
							});
						}
					}
				}
				for (let i = 0; i < res.data.length; i++) {
					for (let c = 0; c < dataObj.length; c++) {
						let hasVal = false;
						for (let b = 0; b < res.data[i].dataList.length; b++) {
							if (
								dataObj[c].name == res.data[i].dataList[b].name
							) {
								dataObj[c].data.push(
									Number(res.data[i].dataList[b].value)
								);
								hasVal = true;
							}
						}
						if (!hasVal) {
							dataObj[c].data.push(0);
						}
					}
				}
				this.chartGdSqs.xAxis.data = xAxis;
				let seriesList = [];
				for (let c = 0; c < dataObj.length; c++) {
					seriesList.push({
						name: dataObj[c].name,
						type: 'bar',
						stack: 'Search Engine',
						emphasis: {
							focus: 'series',
						},
						itemStyle: {
							opacity: 0.8,
							color: colors[c],
						},
						data: dataObj[c].data,
					});
				}
				that.chartGdSqs.series = seriesList;

				that.showChartGdSqs = true;
			});
		},
		getAnalyzeWorkOrderTrendAmount() {
			var that = this;
			var obj2 = JSON.parse(JSON.stringify(this.parameter));
			obj2.last = that.gdJyeLast;
			that.showChartGdJyeQs = false;
			analyzeWorkOrderTrend('amount', obj2).then((res) => {
				let xAxis = [];
				let newList2 = [];
				let dataObj = [];
				for (let i = 0; i < res.data.length; i++) {
					xAxis.push(res.data[i].date);
					for (let b = 0; b < res.data[i].dataList.length; b++) {
						if (!newList2.includes(res.data[i].dataList[b].name)) {
							newList2.push(res.data[i].dataList[b].name);
							dataObj.push({
								name: res.data[i].dataList[b].name,
								data: [],
							});
						}
					}
				}
				for (let i = 0; i < res.data.length; i++) {
					for (let c = 0; c < dataObj.length; c++) {
						let hasVal = false;
						for (let b = 0; b < res.data[i].dataList.length; b++) {
							if (
								dataObj[c].name == res.data[i].dataList[b].name
							) {
								dataObj[c].data.push(
									Number(res.data[i].dataList[b].value)
								);
								hasVal = true;
							}
						}
						if (!hasVal) {
							dataObj[c].data.push(0);
						}
					}
				}
				this.chartGdJyeQs.xAxis.data = xAxis;
				let seriesList = [];
				for (let c = 0; c < dataObj.length; c++) {
					seriesList.push({
						name: dataObj[c].name,
						type: 'line',
						stack: 'Total',
						smooth: true,
						lineStyle: {
							width: 0, //外边线宽度
						},
						showSymbol: false,
						label: {
							show: true,
							position: 'top',
						},

						areaStyle: {
							opacity: 0.8,
							color: colors[c],
						},
						emphasis: {
							focus: 'series',
						},

						data: dataObj[c].data,
					});
				}
				that.chartGdJyeQs.series = seriesList;

				that.showChartGdJyeQs = true;
			});
		},
		Skip() {
			this.$refs.animate.classList.add('active');
			this.StartFlag = false;
			clearTimeout(this.timer);
			this.timer = null;
			clearTimeout(this.JumpOutTimer);
			this.JumpOutTimer = null;
		},
		goZy() {
			this.$router.push({
				path: '/',
			});
		},
	},
};
</script>
<style lang="scss" scoped>
//各种高度
.zyzl {
	height: 145px;
	padding-left: 0 !important;
	padding-right: 0 !important;
}
.jzlxfb {
	height: 162px;
}
.ryjsfb {
	height: 154px;
	padding-bottom: 0px !important;
}
.ssgd {
	height: 193px;
}
.fsu {
	height: 105px;
}
.ssgj {
	height: 204px;
}
.gjjb {
	height: 152px;
}
.gdqs {
	height: 193px;
}
.gdjye {
	height: 193px;
}

.nav-active {
	color: #fff !important;
}

.qgrb {
	height: 193px;
	padding-left: 0 !important;
	padding-right: 0 !important;
}
.navList {
	// margin-right: 15px;
	float: right;
	margin-top: 6px;
	.navItem {
		float: right;
		width: 42px;
		height: 18px;
		background: linear-gradient(
			180deg,
			rgba(15, 74, 159, 0) 0%,
			rgba(17, 75, 160, 0.95) 100%
		);
		border: 1px solid rgba(0, 45, 89, 0.8);
		color: rgba(216, 240, 255, 0.5);
		text-shadow: 0px 0px 4px #0091ff;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: 7px;
		cursor: pointer;
	}
	.active {
		background: linear-gradient(
			180deg,
			rgba(15, 74, 159, 0) 0%,
			rgba(17, 75, 160, 0.95) 100%
		);
		border: 1px solid rgba(30, 123, 214, 0.8);
		color: #d8f0ff;
		line-height: 15px;
		text-shadow: 0px 0px 9px #0091ff, 0px 0px 4px #0091ff;
	}
}
.rbBox {
	position: relative;
	z-index: 2;
	display: flex;
	justify-content: space-evenly;
	.boxItem {
		width: 45%;
	}
	.top {
		color: #fff;
		font-size: 14px;
		padding: 0;
		height: 25px;
		line-height: 25px;
		background: url('~@/assets/images/kuang-top.png') 0 0/100% 100%
			no-repeat;
		letter-spacing: 1px;
		.logo {
			width: 18px;
			height: 18px;
			float: left;
			margin: 4px;
			background: url('~@/assets/images/jt.png') 0 0/100% 100% no-repeat;
		}
	}
	.bottom {
		overflow: hidden;
		height: 130px;
		width: 100%;
		background: linear-gradient(
			180deg,
			#1a4b83 0%,
			rgba(73, 188, 253, 0) 100%
		);
		&.jye {
			padding: 10px 30px;
			padding-bottom: 0;
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			.item {
				display: flex;
				justify-content: space-around;
				height: 20px;
				justify-items: center;
				align-items: center;
				font-size: 12px;
				.name {
					color: #47a4ff;
					text-align: left;
				}
				.val {
					color: #25e4ff;
					flex: 1;
					text-align: center;
				}
				.pmlogo {
					height: 8px;
				}
				.pmlogo2 {
					width: 5px;
				}
			}
		}
		&.pm {
			padding: 10px 30px;
			padding-bottom: 0;
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			.item {
				overflow: hidden;
				color: #fff;
				min-height: 20px;
				display: flex;
				align-items: center;
				justify-items: center;
				font-size: 12px;
				justify-content: space-between;
				img {
					width: 20px;
					margin-right: 10px;
				}
				.name {
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					text-align: center;
					flex: 1;
				}
				.val {
					width: 30px;
					text-align: right;
					color: #25e4ff;
				}
			}
		}
	}
}
.gjjbtj {
	position: relative;
	z-index: 2;
	display: flex;
	justify-content: space-between;
	padding: 0 10px;
	height: 100%;
	justify-items: center;
	.left {
		width: 100px;
		margin-right: 15px;
		.info {
			color: #fff;
			width: 100%;
			text-align: center;
			font-size: 12px;
			background: none;
			margin-top: 8px;
		}
		.all {
			width: 100%;
			position: relative;
			.number {
				width: 100px;
				height: 100px;
				color: #fff;
				font-size: 16px;
				font-weight: bold;
			}
			img {
				display: block;
				width: 100%;
				-webkit-transform: rotate(360deg);
				animation: rotation 2s linear infinite;
				-moz-animation: rotation 2s linear infinite;
				-webkit-animation: rotation 2s linear infinite;
				-o-animation: rotation 2s linear infinite;
			}
		}
	}
	.right {
		flex: 1;
		background: linear-gradient(
			180deg,
			#1a4b83 0%,
			rgba(73, 188, 253, 0) 100%
		);
		display: flex;
		flex-wrap: wrap;
		border-radius: 10px;
		padding: 10px;
		position: relative;
		.item {
			width: 50%;
			display: flex;
			justify-content: center;
			.logo {
				width: 32px;
				background: url('~@/assets/images/tjbj.png') no-repeat;
				background-size: 100%;
				background-position-y: center;
				margin-right: 4px;
				display: flex;
				align-items: center;
				justify-content: center;
				span {
					color: #fff;
					font-size: 12px;
					transform: scale(0.8);
				}
			}
			.logo1 {
				background: url('~@/assets/images/logo1.png') no-repeat;
				background-size: 100%;
				background-position-y: center;
			}
			.logo2 {
				background: url('~@/assets/images/logo2.png') no-repeat;
				background-size: 100%;
				background-position-y: center;
			}
			.logo3 {
				background: url('~@/assets/images/logo3.png') no-repeat;
				background-size: 100%;
				background-position-y: center;
			}
			.logo4 {
				background: url('~@/assets/images/logo4.png') no-repeat;
				background-size: 100%;
				background-position-y: center;
			}
			.val {
				display: flex;
				align-items: start;
				flex-direction: column;
				justify-content: center;
				font-size: 12px;
				width: 50px;
				.bfb {
					color: #fff;
				}
				.jtz {
					color: #2593ff;
				}
			}
		}
	}
}

// !!!注意行内式 不会自动将px转化rem，不会实现响应式，不建议写行内式
.dataFsu {
	display: flex;
	justify-content: space-between;
	position: relative;
	z-index: 1;
	.item {
		width: 50%;
		display: flex;
		justify-content: center;
		.dataRight {
			color: #fff;
			font-size: 14px;
			display: flex;
			justify-content: center;
			flex-direction: column;
			.name {
				font-size: 14px;
				color: #ffffff;
				margin-bottom: 4px;
				opacity: 0.8;
			}
			.data-count {
				color: #18b4ff;
				font-size: 18px;
				font-weight: bold;
				text-align: center;
			}
		}
		img {
			width: 60px;
			margin-right: 15px;
		}
	}
}
.dataList {
	padding: 0 30px;
	display: flex;
	flex-wrap: wrap;
	width: 100%;
	position: relative;
	box-sizing: border-box;
	z-index: 1;
	justify-content: space-between;
	.itemNo {
		height: 0;
		width: 50%;
	}
	.item {
		display: flex;
		min-width: 33%;
		flex-direction: column;
		margin-bottom: 22px;
		.name {
			color: #ffffff;
			font-size: 14px;
			line-height: 15px;
			opacity: 0.8;
		}
		.bottom {
			color: #18b4ff;
			font-size: 18px;
			line-height: 25px;
			font-weight: bold;
			display: flex;
			justify-content: start;
			align-items: baseline;
			span {
				color: #18b4ff;
				font-size: 20px;
				font-weight: bold;
			}
			.dw {
				font-weight: normal;
				color: #ffffff;
				font-size: 14px;
				margin-left: 3px;
				opacity: 0.6;
			}
		}
	}
}
/*媒体查询*/
/*当页面大于1200px 时，大屏幕，主要是PC 端*/
@media (min-width: 1024px) and (max-width: 1566px) {
	.dist-item {
		font-size: 12px !important;
		color: #141c48;
	}
	.large-screen-view .container-header .left-h3 {
		font-size: 18px !important;
		width: 407px !important;
	}
	.large-screen-view .container-header .navList .item2 {
		width: 120px !important;
		font-size: 14px !important;
	}
	.large-screen-view .container-header .navList .item {
		width: 120px !important;
		font-size: 14px !important;
	}
}
.large-screen-view {
	height: 100vh;

	//   点击跳过按钮样式
	#timer {
		position: fixed;
		z-index: 2;
		top: 10px;
		right: 20px;
		width: 36px;
		height: 36px;
		margin: 0 auto;
		cursor: pointer;

		.timer-text {
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 12px;
			color: #ffffff;
			background: rgba(0, 0, 0, 0.2);
			border-radius: 50%;
		}

		.timer-round {
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;

			.wrap {
				width: 50%;
				height: 100%;
				position: absolute;
				top: 0;
				overflow: hidden;

				.radius {
					width: 200%;
					height: 100%;
					border-radius: 50%;
					position: absolute;
					top: 0;
					border: 2px solid #ffffff;
				}
			}

			.left {
				left: 0;

				.left-radius {
					left: 0;
					transform: rotate(45deg);
					border-left-color: #3385ff;
					border-bottom-color: #3385ff;
					animation: leftRadius 3.7s linear;
					/*动画停留在最后一帧*/
					animation-fill-mode: forwards;
					-moz-animation-fill-mode: forwards;
					-webkit-animation-fill-mode: forwards;
					-o-animation-fill-mode: forwards;
				}
			}

			.right {
				right: 0;

				.right-radius {
					right: 0;
					transform: rotate(45deg);
					border-right-color: #3385ff;
					border-top-color: #3385ff;
					animation: rightRadius 3.7s linear;
					/*动画停留在最后一帧*/
					animation-fill-mode: forwards;
					-moz-animation-fill-mode: forwards;
					-webkit-animation-fill-mode: forwards;
					-o-animation-fill-mode: forwards;
				}
			}
		}
	}

	@keyframes leftRadius {
		0% {
			transform: rotate(45deg);
		}

		50% {
			transform: rotate(45deg);
		}

		100% {
			transform: rotate(225deg);
		}
	}

	@keyframes rightRadius {
		0% {
			transform: rotate(45deg);
		}

		50% {
			transform: rotate(225deg);
		}

		100% {
			transform: rotate(225deg);
		}
	}

	.animate__animated {
		display: flex;
		flex-direction: column;
		min-height: 100%;
		background: url('~@/assets/images/view_bg2.png') 0 0 / cover repeat;
		background-attachment: fixed;
	}
	.animate__animated.active {
		animation: zoomInDown 1s;
	}

	@keyframes zoomInDown {
		from {
			opacity: 0;
			-webkit-transform: scale3d(0.1, 0.1, 0.1) translate3d(0, -1000px, 0);
			transform: scale3d(0.1, 0.1, 0.1) translate3d(0, -1000px, 0);
			-webkit-animation-timing-function: cubic-bezier(
				0.55,
				0.055,
				0.675,
				0.19
			);
			animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
		}

		60% {
			opacity: 1;
			-webkit-transform: scale3d(0.475, 0.475, 0.475)
				translate3d(0, 60px, 0);
			transform: scale3d(0.475, 0.475, 0.475) translate3d(0, 60px, 0);
			-webkit-animation-timing-function: cubic-bezier(
				0.175,
				0.885,
				0.32,
				1
			);
			animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);
		}
	}
	.container-bottom {
		height: 22px;
		line-height: 22px;
		background: url('~@/assets/images/view_bottom.png') 0 0/100% 100%
			no-repeat;
	}

	.container-header {
		width: 100%;
		height: 98px;
		text-align: center;
		box-sizing: border-box;
		background: url('~@/assets/images/bigTop.png') 0 0/100% 100% no-repeat;
		// overflow: hidden;
		display: flex;
		flex-direction: row;
		.my-time {
			margin-top: 3px;
		}
		.zhmc {
			width: 221px;
			height: 52px;
			position: relative;
			padding-top: 14px;
			.nameXl {
				display: none;
				width: 100px;
				height: 80px;
				position: absolute;
				left: 55px;
				top: 50px;
				background: url('~@/assets/images/bjk2.png') 0 0/100% 100%
					no-repeat;
				z-index: 9;
				.item {
					line-height: 40px;
					text-align: center;
					color: #ffffff;
					font-size: 14px;
					cursor: pointer;
				}
				.item:hover {
					color: #2593ff;
				}
			}
			.name {
				margin: 0 auto;
				font-size: 13px;
				font-weight: 500;
				color: #ffffff;
				line-height: 45px;
				height: 35px;
				width: 200px;
				background: url('~@/assets/images/zhmc.png') no-repeat;
				background-size: 75% auto;
				background-position: center;
				cursor: pointer;
				position: relative;
				display: flex;
				align-items: center;
				text-indent: 50px;
			}
			i {
				background: url('~@/assets/images/sjx.png') 0 0/83% 100%
					no-repeat;
				height: 5px;
				margin-left: 4px;
				width: 10px;
				display: block;
			}
		}
		.zhmc:hover .nameXl {
			display: block;
		}
		.navList {
			padding-top: 14px;
			flex-grow: 1;
			flex-shrink: 1;
			flex-basis: 0%;
			display: flex;
			justify-content: center;
			// flex: 1 1 auto;

			.item {
				float: left;
				width: 150px;
				height: 40px;
				line-height: 40px;
				background: url('~@/assets/images/nav1.png') 0 0/100% 100%
					no-repeat;
				text-align: center;
				font-size: 18px;
				letter-spacing: 1px;
				font-family: sszhjt;
				color: #70aad3;
				cursor: pointer;
				text-indent: 20px;
			}
			.item2 {
				float: left;
				width: 150px;
				// width: 300px;
				// margin-left: -153px;
				height: 40px;
				line-height: 40px;
				background: url('~@/assets/images/nav2.png') 0 0/100% 100%
					no-repeat;
				// text-align: right;
				// padding-right: 30px;
				font-size: 18px;
				letter-spacing: 1px;
				font-family: sszhjt;
				color: #70aad3;
				margin-left: -25px;
				/*background-size: 300px 100%;*/
				/*background-position-x: right;*/
				cursor: pointer;
				text-indent: 30px;
			}
		}
		.left-h3 {
			line-height: 80px;
			font-size: 27px;
			color: rgb(255, 255, 255);
			font-weight: normal;
			justify-content: center;
			text-align: left;
			padding-left: 20px;
			font-family: sszhjt;

			letter-spacing: 10px;
			margin-top: 0;
			margin-bottom: 0;
			width: 530px;
			height: 80px;
			overflow: hidden;
			// flex: 0 0 auto;
		}
	}

	.container-content {
		display: flex;
		justify-content: space-between;
		box-sizing: border-box;
		flex: 1;

		.com-count-title {
			color: #fff;
			font-size: 14px;
			padding: 0;
			height: 30px;
			line-height: 30px;
			background: url('~@/assets/images/kuang-top.png') 0 0/100% 100%
				no-repeat;
			letter-spacing: 1px;
		}
		.com-count-title .logo {
			width: 13px;
			height: 15px;
			float: left;
			margin: 8px 6px 0px 14px;
			background: url('~@/assets/images/kuang-logo.png') 0 0/100% 100%
				no-repeat;
		}

		.com-screen-content,
		.com-screen-content2 {
			width: 100%;
			position: relative;
			padding: 20px;
			padding-bottom: 10px;
			margin-top: 10px;
		}
		.com-screen-content .bj {
			position: absolute;
			width: 100%;
			height: 100%;
			padding: 2px;
			margin-top: 2px;
			z-index: 0;
			top: 0;
			left: 0;
		}
		.com-screen-content .bj .zbj {
			background: linear-gradient(
				180deg,
				#2387f9 0%,
				rgba(73, 188, 253, 0) 100%
			);
			opacity: 0.14;
			width: 100%;
			height: 100%;
		}
		.com-screen-content .bj .fbj {
			position: absolute;
			left: 0;
			top: 0;
			width: 15px;
			height: 15px;
			background: url('~@/assets/images/bjk.png') 0 0/100% 100% no-repeat;
		}
		.com-screen-content .bj .fbj2 {
			position: absolute;
			right: 0;
			top: 0;
			width: 15px;
			height: 15px;
			background: url('~@/assets/images/bjk.png') 0 0/100% 100% no-repeat;
			rotate: 90deg;
		}

		.count-resource,
		.count-share {
			position: relative;
			padding: 3px;
			box-sizing: border-box;
			/*border: 1px solid #1bb4f9;*/
			/*box-shadow: #1bb4f9 0px 0px 5px 1px inset;*/
			border-radius: 5px;
			// margin-bottom: 15px;
			overflow: hidden;
		}

		.q1 {
			--borderWidth: 3px;
			height: 60%;
			position: relative;
			z-index: 0;
			overflow: hidden;
			z-index: 0;
			border-radius: 5px;
			// box-shadow: 2px 2px 2px #182e57;
			// border: none;

			&::after,
			&::before {
				box-sizing: border-box;
			}

			&::before {
				content: '';
				position: absolute;
				z-index: -2;
				left: -50%;
				top: -50%;
				width: 200%;
				height: 200%;
				background-repeat: no-repeat;
				background-position: 0 0;
				background-image: conic-gradient(
					transparent,
					rgba(168, 239, 255, 1),
					transparent 30%
				);
				animation: rotate 7s linear infinite;
			}

			&::after {
				content: '';
				position: absolute;
				z-index: -1;
				left: calc(var(--borderWidth) / 2);
				top: calc(var(--borderWidth) / 2);
				width: calc(100% - var(--borderWidth));
				height: calc(100% - var(--borderWidth));
				background-color: #141c48;
				border-radius: 5px;
			}
		}

		@keyframes rotate {
			100% {
				transform: rotate(1turn);
			}
		}

		.container-left {
			position: relative;
			width: 25%;
			flex: 1;
			.count-share {
				background-size: cover;
				padding: 0 12px;
				padding-left: 20px;
			}
		}
		.container-center {
			position: relative;
			flex: 2;
			display: flex;
			width: 50%;
			justify-content: space-between;
			.count-share {
				flex: 1;
				background-size: cover;
				padding: 0 12px;
			}
		}
		.container-right {
			position: relative;
			width: 25%;
			flex: 1;
			.count-share {
				background-size: cover;
				padding: 0 12px;
				padding-right: 20px;
			}
		}

		.mid {
			width: 50%;
			padding: 10px 0;
			padding-top: 0;
			height: 626px;
			flex: 2;
			position: relative;
			.map-data-container {
				position: absolute;
				top: -20px;
				left: 50%;
				margin-left: -183px;
				z-index: 2;
				ul {
					display: flex;
					li {
						display: block;
						width: 122px;
						height: 36px;
						background: linear-gradient(
							270deg,
							rgba(37, 147, 255, 0) 0%,
							rgba(37, 147, 255, 0.58) 40%,
							rgba(37, 147, 255, 0.6) 43%,
							rgba(37, 147, 255, 0.61) 47%,
							rgba(37, 147, 255, 0) 100%
						);
						border-radius: 1px;
						color: #fff;
						opacity: 0.55;
						line-height: 36px;
						text-align: center;
						cursor: pointer;
						&.active {
							opacity: 1;
						}
					}
				}
			}
		}

		.container-right {
			position: relative;
			display: flex;
			flex-direction: column;
			width: 25%;
			flex: 1;
			.count-resource {
				margin-left: 10px;
				float: left;
				height: 140px;
				background-size: cover;
			}
		}
	}

	.footer-wrap {
		padding: 0 12px;
		display: flex;
		justify-content: space-between;
		width: 100%;

		.border-container {
			position: relative;
			border: 1px solid #1bb4f9;
			box-shadow: #1bb4f9 0px 0px 5px 1px inset;
			border-radius: 5px;
			width: 230px;
			height: 145px;

			.tile-size-color {
				font-size: 12px;
				color: #fff;
			}

			.name-title {
				background: #4545e3;
				padding: 3px 5px;
				border-bottom-right-radius: 6px;
				border-bottom-left-radius: 6px;
				position: absolute;
				left: 5%;
				font-size: 8px;
			}
		}
	}
}
@-webkit-keyframes rotation {
	from {
		-webkit-transform: rotate(0deg);
	}
	to {
		-webkit-transform: rotate(360deg);
	}
}
.swiper-button-next,
.swiper-container-rtl .swiper-button-prev {
	right: 5px;
	width: 25px;
	height: 22px;
}
.swiper-button-prev,
.swiper-container-rtl .swiper-button-next {
	left: 5px;
	width: 25px;
	height: 22px;
}
</style>
