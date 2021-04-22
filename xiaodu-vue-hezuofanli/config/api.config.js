const isPro = Object.is(process.env.NODE_ENV, 'production')
module.exports = {
    // baseUrl: isPro ? 'http://h5-test.nzha.com/' : 'api/'
    baseUrl: isPro ? 'http://h5.nzha.com/' : 'api/'
}