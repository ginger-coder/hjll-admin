<template>
	<div class="sign-content">
		<div class="file-content">
			<div class="menu-left">
				<div class="top">
					<div class="header">第一步：选择签署方</div>
					<div class="menu-box">
						<div
							:class="current == 1 ? 'active item' : 'item'"
							@click="currentChange(1)"
						>
							<div class="name main">{{ entName }}</div>
							<div class="user">经办人：{{ signatory }}</div>
						</div>
						<div
							:class="current == 2 ? 'active item' : 'item'"
							@click="currentChange(2)"
						>
							<div class="name person">{{ signatory }}</div>
						</div>
					</div>
				</div>
				<el-divider></el-divider>
				<div class="buttom">
					<div class="header">第二步：拖拽至文件区域</div>
					<draggable
						v-model="mainImagelist"
						:group="{ name: 'itext', pull: 'clone' }"
						:sort="false"
						@end="moveEnd"
					>
						<transition-group type="transition">
							<div
								class="seal active"
								v-for="item in mainImagelist"
								:key="item.value"
								onselect="document.selection.empty();"
							>
								{{ item.name }}
							</div>
						</transition-group>
					</draggable>
				</div>
			</div>
			<div class="content-right" ref="contentRight">
				<div
					v-for="(item, index) in fileList"
					:key="index"
					class="imgBox"
					:style="{ width: item.width, height: item.height }"
				>
					<img
						:src="item.imgUrl"
						alt=""
						:style="{ width: item.width, height: item.height }"
					/>
					<div v-if="item.arrList.length">
						<el-tooltip
							v-for="(items, indexs) in item.arrList"
							effect="dark"
							content="Bottom Center 提示文字"
							placement="bottom"
							:key="indexs"
						>
							<template slot="content">
								<div
									class="delete-btn"
									style="cursor: pointer"
									@click="card_delete(items)"
								>
									删除
								</div>
							</template>
							<div
								class="dragContent"
								:class="{
									card_date: items.sealType == 5,
									card_middle: items.sealType == 4,
								}"
								:data-id="index + ',' + indexs"
								v-drag="{ setFileList }"
								:style="{
									top: items.top + 'px',
									left: items.left + 'px',
								}"
							>
								<div class="title">{{ items.name }}</div>
							</div>
						</el-tooltip>
					</div>
				</div>
			</div>
		</div>
		<div class="card-footer">
			<el-button class="submit-btn" size="medium" @click="handlePrev"
				>上一步</el-button
			>
			<el-button
				class="submit-btn"
				type="primary"
				size="medium"
				@click="handleNext"
				>发起签约</el-button
			>
		</div>
		<el-divider></el-divider>
	</div>
</template>
<script>
import { v4 as uuidv4 } from 'uuid';
import { getProtocolImgList, enterpriseInitiateProtocol } from '@/api/isp';
import { BASE_UPLOAD } from '@/config';
import draggable from 'vuedraggable';
import $ from 'jquery';
import _ from 'lodash';
const that = this;
let widthAndHeight = {
	width: 0,
	height: 0,
};
export default {
	name: 'card',
	components: { draggable },
	data() {
		return {
			id: '',
			signatureId: '',
			entName: '',
			signatory: '',
			fileList: [],
			viewUrl: BASE_UPLOAD,
			fromData: {
				fileTime: '',
			},
			current: 1,
			entQualificationNum: '',
			mainImagelist: [
				{
					name: '企业签章',
					value: 0,
				},
				{
					name: '法定代表人章',
					value: 2,
				},
				{
					name: '经办人印章',
					value: 3,
				},
				{
					name: '骑缝章',
					value: 4,
				},
				{
					name: '日期',
					value: 5,
				},
			],
		};
	},
	directives: {
		// 局部指令写法二
		drag: {
			// 配置对象
			bind(el, binding) {}, // 指令与元素成功绑定时调用
			inserted(el, binding) {
				el.onmousedown = (e) => {
					var disx = e.pageX - el.offsetLeft;
					var disy = e.pageY - el.offsetTop;
					document.onmousemove = function (e) {
						el.style.left = e.pageX - disx + 'px';
						el.style.top = e.pageY - disy + 'px';
					};
					document.onmouseup = (e) => {
						const iTop = el.offsetTop;
						const imageHeight = widthAndHeight.height;
						const tPageIndex = Math.ceil(iTop / imageHeight) - 1;
						let arr = el.getAttribute('data-id').split(',');
						let pIndex = parseFloat(arr[0]);
						let eIndex = parseFloat(arr[1]);

						const { setFileList } = binding.value;

						setTimeout(() => {
							setFileList(
								tPageIndex,
								pIndex,
								eIndex,
								el.offsetTop,
								el.offsetLeft
							);
						}, 200);
						document.onmousemove = document.onmouseup = null;
					};
				};
			}, // 指令所在元素被插入页面时调用
			update(el, binding) {}, // 指令所在模板结构被更新时调用
		},
	},
	async created() {
		const { id, signatureId, entQualificationNum, signatory, entName } =
			this.$route.query;
		this.id = id;
		this.entName = entName;
		this.signatory = signatory;
		this.id = id;
		this.signatureId = signatureId;
		this.entQualificationNum = entQualificationNum;
		this.getProtocolImg();
		document.body.ondrop = function (event) {
			event.preventDefault();
			event.stopPropagation();
		};
	},
	mounted() {},
	methods: {
		handleNext() {
			// 签约
			let coordinates = [];
			this.fileList.forEach((item) => {
				if (item.arrList.length > 0) {
					item.arrList.forEach((items) => {
						coordinates.push({
							x: items.left,
							y: items.Ptop,
							page: item.page,
							sealType: items.sealType,
							verticalPercent: items.verticalPercent,
						});
					});
				}
			});
			if (coordinates.length == 0) {
				return this.$message.error('请选择签章');
			}
			let newFormData = new FormData();
			newFormData.append('id', this.signatureId);
			newFormData.append('step', 3);
			coordinates.forEach((item, index) => {
				for (const key in item) {
					newFormData.append(
						`coordinates[${index}].${key}`,
						item[key]
					);
				}
			});
			newFormData.append('entQualificationNum', this.entQualificationNum);
			enterpriseInitiateProtocol(newFormData)
				.then((res) => {
					if (res.code == 0) {
						this.$router.push({
							path: '/isp/ispList',
						});
					}
				})
				.catch((err) => {});
		},
		handlePrev() {
			this.$router.go(-1);
		},
		setFileList(pageIndex, yPageIndex, targetIndex, top, left) {
			let tIndex = 0;
			const moveTarget = _.cloneDeep(
				this.fileList[yPageIndex].arrList[targetIndex]
			);
			if (pageIndex == yPageIndex) {
				tIndex = targetIndex;
			} else {
				tIndex = this.fileList[pageIndex].arrList?.length || 0;
				this.fileList[yPageIndex].arrList.splice(targetIndex, 1);
			}

			let Ptop = top % this.fileList[0].height;
			this.fileList[pageIndex].arrList[tIndex] = _.cloneDeep(moveTarget);
			this.fileList[pageIndex].arrList[tIndex].top = top;
			this.fileList[pageIndex].arrList[tIndex].left = left;
			this.fileList[pageIndex].arrList[tIndex].Ptop = Ptop;
			if (this.fileList[pageIndex].sealType == 4) {
				let verticalPercent = (Ptop / this.fileList[0].height).toFixed(
					3
				);
				this.fileList[pageIndex].arrList[tIndex].verticalPercent =
					verticalPercent;
			}
		},
		getProtocolImg() {
			getProtocolImgList({ id: this.signatureId })
				.then((res) => {
					if (res.code == 0) {
						let array = [];
						if (res.data) {
							res.data.forEach((element) => {
								let url = this.viewUrl + element.imgUrl;
								this.getImageWidthHeight(url, (res) => {
									widthAndHeight = { ...res };
									array.push({
										arrList: [],
										imgUrl: url,
										page: element.page,
										width: res.width,
										height: res.height,
									});
									array.sort((a, b) => a.page - b.page);
								});
							});
							this.fileList = array;
						}
					}
				})
				.catch((err) => {});
		},
		getImageWidthHeight(url, callback) {
			let image = new Image();
			let widthHeight = { width: null, height: null };
			// CORS 策略，会有跨域问题
			image.setAttribute('crossOrigin', 'Anonymous');
			image.src = url;
			image.onload = function () {
				widthHeight.width = image.naturalWidth;
				widthHeight.height = image.naturalHeight;
				callback(widthHeight);
			};
		},
		currentChange(val) {
			this.current = val;
			if (this.current == 1) {
				this.mainImagelist = [
					{
						name: '企业签章',
						value: 0,
					},
					{
						name: '法定代表人章',
						value: 2,
					},
					{
						name: '经办人印章',
						value: 3,
					},
					{
						name: '骑缝章',
						value: 4,
					},
					{
						name: '日期',
						value: 5,
					},
				];
			} else {
				this.mainImagelist = [
					{
						name: '个人签名',
						value: 1,
					},
					{
						name: '日期',
						value: 5,
					},
				];
			}
		},
		card_delete(item) {
			const { id, page } = item;
			this.fileList.forEach((el) => {
				el.arrList = el.arrList.filter((e) => e.id !== id);
			});
		},
		moveEnd(event) {
			console.log('event', event);
			let e = event.originalEvent;
			let leftBox = $('.content-right').offset().left;
			let topBox = $('.content-right').offset().top;
			let scrollLeft = this.$refs.contentRight.scrollLeft;
			let scrollTop = this.$refs.contentRight.scrollTop;
			let factX = e.clientX - leftBox; //相对于当窗口移动的宽度
			let factY = e.clientY - topBox; //相对于当窗口移动的高度
			let disx = factX + scrollLeft;
			let disy = factY + scrollTop;
			let Ptop = disy % this.fileList[0].height;
			let left = disx > 0 ? disx : 0;
			let top = disy > 0 ? disy : 0;
			console.log(
				'this.$refs.contentRight.scrollTop / this.fileList[0].height',
				top / this.fileList[0].height
			);
			let page = Math.floor(top / this.fileList[0].height);
			console.log('page', page);
			const uuid = uuidv4();
			if (this.current == 1) {
				if (event.newIndex == 0) {
					this.fileList[page].arrList.push({
						top: top,
						left: left,
						Ptop: Ptop,
						name: '企业签章',
						id: uuid,
						sealType: 0,
						page: page,
						verticalPercent: 0,
					});
				} else if (event.newIndex == 1) {
					this.fileList[page].arrList.push({
						top: top,
						left: left,
						Ptop: Ptop,
						name: '法定代表人章',
						id: uuid,
						sealType: 2,
						page: page,
						verticalPercent: 0,
					});
				} else if (event.newIndex == 2) {
					this.fileList[page].arrList.push({
						top: top,
						left: left,
						Ptop: Ptop,
						name: '经办人签章',
						id: uuid,
						sealType: 3,
						page: page,
						verticalPercent: 0,
					});
				} else if (event.newIndex == 3) {
					let verticalPercent = (
						Ptop / this.fileList[page].height
					).toFixed(3);
					const m_left = widthAndHeight.width - 60;
					this.fileList[page].arrList.push({
						top: top,
						left: m_left,
						Ptop: Ptop,
						name: '骑缝章',
						id: uuid,
						sealType: 4,
						page: page,
						verticalPercent: verticalPercent,
					});
				} else if (event.newIndex == 4) {
					this.fileList[page].arrList.push({
						top: top,
						left: left,
						Ptop: Ptop,
						name: '日期',
						id: uuid,
						sealType: 5,
						page: page,
						verticalPercent: 0,
					});
				}
			} else if (this.current == 2) {
				if (event.newIndex == 0) {
					this.fileList[page].arrList.push({
						top: top,
						left: left,
						Ptop: Ptop,
						name: '个人签名',
						id: uuid,
						sealType: 0,
						page: page,
						verticalPercent: 0,
					});
				} else if (event.newIndex == 1) {
					this.fileList[page].arrList.push({
						top: top,
						left: left,
						Ptop: Ptop,
						name: '日期',
						id: uuid,
						sealType: 5,
						page: page,
						verticalPercent: 0,
					});
				}
			}
		},
	},
};
</script>
<style lang="scss" scoped>
.sign-content {
	padding-top: 50px;
	.card-delete {
		cursor: pointer;
	}
	.file-content {
		display: flex;
		.menu-left {
			padding: 24px;
			width: 226px;
			background: #ffffff;
			box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.05);
			border-radius: 2px;
			border: 1px solid #e8e8e8;
			margin-right: 32px;
			.buttom {
				.header {
					font-size: 14px;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 600;
					color: rgba(0, 0, 0, 0.85);
					margin-bottom: 12px;
				}
				.seal {
					width: 100%;
					height: 32px;
					background: #fcfcfc;
					border-radius: 2px;
					padding-left: 17px;
					display: flex;
					align-items: center;
					margin-bottom: 10px;
					cursor: pointer;
					&.active {
						background: rgba(250, 173, 20, 0.1);
					}
				}
				// .seal-box {
				// 	padding: 10px 0;

				// }
			}
			.top {
				.header {
					font-size: 14px;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 600;
					color: rgba(0, 0, 0, 0.85);
					margin-bottom: 12px;
				}
				.menu-box {
					// padding-left: 20px;
					.item {
						position: relative;

						cursor: pointer;
						margin-bottom: 12px;
						padding: 12px;
						&.active {
							background: rgb(67, 101, 172, 0.1);
							border-radius: 4px;
						}
						.name {
							margin-bottom: 6px;
							display: flex;
							&.main {
								&::before {
									content: '主';
									display: block;
									width: 16px;
									height: 16px;
									background: #faad14;
									border-radius: 2px;
									display: flex;
									align-items: center;
									justify-content: center;
									font-size: 10px;
									font-family: PingFangSC-Semibold,
										PingFang SC;
									font-weight: 600;
									color: #ffffff;
									margin-right: 12px;
								}
							}
							&.person {
								&::before {
									content: '个';
									display: block;
									width: 16px;
									height: 16px;
									background: #149afa;
									border-radius: 2px;
									display: flex;
									align-items: center;
									justify-content: center;
									font-size: 10px;
									font-family: PingFangSC-Semibold,
										PingFang SC;
									font-weight: 600;
									color: #ffffff;
									margin-right: 12px;
								}
							}
						}
						.user {
							font-size: 12px;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: rgba(0, 0, 0, 0.45);
							padding-left: 28px;
						}
					}
				}
			}
		}
		.content-right {
			flex: 1;
			background: #f2f5fa;
			border-radius: 2px;
			overflow-y: auto;
			height: 560px;
			position: relative;
			.imgBox {
				width: 100%;
				.dragContent {
					width: 142px;
					height: 142px;
					border-width: 0.511797px;
					border-color: rgb(250, 173, 21);
					background-color: rgba(250, 173, 21, 0.12);
					border-radius: 0px 0px 4.09437px 4.09437px;
					border-style: dashed;
					position: absolute;
					z-index: 111;
					&.card_date {
						height: 40px;
					}
					&.card_middle {
						width: 60px;
					}
				}
			}
		}
	}
	.card-footer {
		text-align: center;
		padding: 20px;
	}
}
</style>
