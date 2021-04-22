const isPro = Object.is(process.env.NODE_ENV, 'production')
module.exports = {
  // baseUrl: isPro ? 'http://h5-test.binglue.com/' : 'api/'
  baseUrl: isPro ? document.location.origin + '/' : 'api/'
}