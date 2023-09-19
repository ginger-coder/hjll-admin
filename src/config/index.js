// 根据环境引入不同配置 process.env.NODE_ENV
// 如果开发环境中 vue.config.js 代理请求关联了这里的变量，这里的每次改动都要重启。
// const environment = process.env.NODE_ENV || 'development'
// const config = require('./env.' + environment)
// module.exports = config

/***
 * 20230309
 * env.*.js 暂停
 * 根据 vue .env.* || .env.*.local 文件返回不同环境的变量, 兼容旧变量文件
 * .env 所有的环境中引入 写入全局需要的变量
 * .env.production 正式环境引入 非必要不要改
 * .env.test 测试环境引入 非必要不要改
 * .env.development 开发环境引入 如果不是新增变量不要提交,最好自建 .env.local 文件进行开发调试、
 *  自建 .env.*.local 文件覆盖对应环境的变量,git忽略
 * .env.local 在所有的环境中被载入，会覆盖.env的变量。
 * .env.production.local 会覆盖 .env.production
 * .env.development.local 会覆盖 .env.development
 * .env.test.local 会覆盖 .env.test
 */

const {
  VUE_APP_IMAGE_BASE_URL,
  VUE_APP_BASE_API,
  VUE_APP_BASE_URL,
  VUE_APP_BASE_UPLOAD,
} = process.env;
module.exports = {
  BASE_API: VUE_APP_BASE_API,
  BASE_URL: VUE_APP_BASE_URL + VUE_APP_BASE_API,
  IMAGE_BASE_URL: VUE_APP_BASE_URL + VUE_APP_IMAGE_BASE_URL,
  BASE_UPLOAD: VUE_APP_BASE_UPLOAD,
};
