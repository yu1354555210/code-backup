/**
 * 默认的全局配置
 */


export default {
  baseURL: 'https://app1-api.qianr.com', //正式
  // baseURL: 'http://app1.qianr.com', //测试
  header: {},
  method: 'GET',
  dataType: 'json',
  // #ifndef MP-ALIPAY || APP-PLUS
  responseType: 'text',
  // #endif
  custom: {},
  // #ifdef H5 || APP-PLUS || MP-ALIPAY || MP-WEIXIN
  timeout: 60000,
  // #endif
  // #ifdef APP-PLUS
  sslVerify: true,
  // #endif
  // #ifdef H5
  withCredentials: false,
  // #endif
  // #ifdef APP-PLUS
  firstIpv4: false,
  // #endif
  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300
  }
}
