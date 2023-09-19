import Vue from 'vue';

import 'normalize.css/normalize.css'; // A modern alternative to CSS resets

// import "default-passive-events";

import ElementUI from 'element-ui';
import './styles/element-variables.scss';
import 'element-ui/lib/theme-chalk/index.css';

import {dictItemTypes} from "./api/dict";

import dataV from '@jiaminghi/data-view'

window._AMapSecurityConfig = {
	securityJsCode: 'c5f8a65ffa1133ecf4808d5297015b52',
};

Vue.use(dataV);


//全局修改默认配置
ElementUI.Dialog.props.closeOnClickModal.default = false;
ElementUI.Dialog.props.closeOnPressEscape.default = false;
ElementUI.Dialog.props.modalAppendToBody.default = false;

import { message } from './utils/resetMessage';
Vue.use(ElementUI, { size: 'medium' });
Vue.prototype.$message = message;

import '@/styles/index.scss'; // global css
import '@/assets/icon/iconfont.css'; // https://www.iconfont.cn/图标css引入

import App from './App';
import store from './store';
import router from './router';

import '@/icons'; // icon
import '@/permission'; // permission control
import echarts from 'echarts';
import $ from 'jquery';
Vue.prototype.$ = $;
Vue.prototype.$echarts = echarts;
if (process.env.NODE_ENV == 'production') {
	console.log = () => {};
}
import moment from "moment";

Vue.prototype.$moment = moment;

Vue.prototype.$dict = dictItemTypes;

Vue.directive("holdClick", {
	bind: function (el, binding, vnode) {
		function clickHandler(e) {
			if (el.contains(e.target)) {
				if (!el.disabled) {
					el.disabled = true;
					setTimeout(() => {
						el.disabled = false;
					}, binding.value || 1000);
				}
				return false;
			}
			if (binding.expression) {
				binding.value(e);
			}
		}
		el.__vueClickOutside__ = clickHandler;
		document.addEventListener('click', clickHandler);
	},
	unbind(el, binding) {
		document.removeEventListener('click', el.__vueClickOutside__);
		delete el.__vueClickOutside__;
	},
});

Vue.config.productionTip = false;

new Vue({
	el: '#app',
	router,
	store,
	render: (h) => h(App),
});

router.beforeEach((to, from, next) => {
	next();
});
