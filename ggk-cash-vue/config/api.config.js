const isPro = Object.is(process.env.NODE_ENV, 'production')
module.exports = {
    // baseUrl: isPro ? 'http://h5-test.nzha.com/' : 'api/'
    // baseUrl: isPro ? 'http://wjz.paopaoren.cn/' : 'api/'
    baseUrl: isPro ? 'https://ubase.qianr.com/' : 'api/'
}