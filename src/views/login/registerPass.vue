<template>
	<div class="login-container" :class="[rightBgWhite ? 'bg-white' : '', allowRegister ? 'show_register' : '']">
		<!-- <div class="page-col-bg"></div> -->
		<div class="page-col-login">
			<div class="login-form disp_flex flex_column">
				<div class="header" :style="loginFormStyle">
					<div class="title">中国{{ title }}</div>
					<div class="title-tips">助力中国通信维护领域降本增效</div>
				</div>
				<div class="pass_box">
					<i class="el-icon-success el-success"></i>
					<div class="pass_Text">你的账户：{{ email }} 注册成功</div>
					<div class="btn_box">
						<el-button class="btn" type="primary" @click="toCheck">立即完成认证</el-button>
						<div class="time_text">{{ time }}秒后自动跳转</div>
					</div>
				</div>
				<div class="footBar">
					<div class="disp_flex foot_txt_box ju_bet">
						<div class="foot_text">帮助</div>
						<div class="foot_text">隐私</div>
						<div class="foot_text">条款</div>
					</div>
					<div class="foot_text">copyright ©️ 2022 海纳实业控股集团有限公司</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { title, prefix, serverMock, loginWhite, allowRegister } from "@/settings";
import { encodeUnicode, decodeUnicode } from "@/utils";
import { setToken } from "@/utils/auth";

import { authLogin } from "@/api/auth";

export default {
	data() {
		return {
			rightBgWhite: loginWhite,
			allowRegister: allowRegister,
			title: title,

			form: {},

			email: "example@example.com",
			time: 10,
			timeFun: null,

			loginFormStyle: {},
			redirect: "",
		};
	},
	watch: {
		$route: {
			handler: function () {
				let that = this;
				that.timeFun = setInterval(() => {
					let _time = that.time;
					if (_time === 0) {
						that.toCheck();
						clearInterval(that.timeFun);
						return;
					} else {
						_time--;
					}
					console.log("++++");
					that.$set(that, "time", _time);
				}, 1000);
			},
			immediate: true,
		},
	},
	mounted() {
		let that = this;

		that.initer();

		that.$nextTick(() => {
			that.loginFormStyle = that.loginFormStyleFun();
		});
	},
	methods: {
		loginFormStyleFun() {
			let obj = {};
			let _height = window.innerHeight / 2;

			let height2 = 0;
			if (document.querySelector(".login-form")) height2 = _height - document.querySelector(".login-form").clientHeight / 0.2;
			if (height2 > 70) obj.marginTop = `${height2}px`;
			else obj.marginTop = `70px`;

			return obj;
		},
		initer() {
			let that = this;
			window.addEventListener("resize", () => {
				that.loginFormStyle = that.loginFormStyleFun();
			});
		},
		toCheck() {
			let that = this;
			that.$router.push("/prove/proveIndex");
		},
	},
	beforeDestroy() {
		let that = this;

		if (that.timeFun) {
			clearInterval(that.timeFun);
		}
	},
};
</script>
<style lang="scss" scoped>
@import "~@/styles/login.scss";
.pass_box {
	text-align: center;
	font-size: 16px;
	.el-icon-success {
		font-size: 100px;
	}
	.pass_Text {
		font-weight: 500;
		padding-top: 60px;
	}
	.btn_box {
		padding-top: 60px;
		.btn {
			width: 40%;
		}
		.time_text {
			color: rgba(0, 0, 0, 0.42745098039215684);
			font-size: 14px;
			padding-top: 14px;
		}
	}
}
</style>
<style>
#app,
body {
	height: 100vh !important;
}
</style>
