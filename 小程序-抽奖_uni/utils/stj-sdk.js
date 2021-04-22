"use strict";

function analysis(t, a) {
  if (!wx.getStorageSync("stj_close")) {
    __wxConfig && void 0 !== __wxConfig.accountInfo && __wxConfig.accountInfo.appId;
    return wx.getClipboardData({
      success: function (n) {
        var e = n.data;

        if (e) {
          var o = wx.getStorageSync("puid");
          o || (o = new Array(32).join("a").replace(/a/g, function () {
            return String.fromCharCode(65 + Math.floor(26 * Math.random()));
          }), wx.setStorageSync("puid", o)), e = e.startsWith("skxcx") ? e : o, wx.request({
            url: "https://xcx.shike.com/xcx/api/" + version + "/analysisSDK",
            data: Object.assign(wx.getSystemInfoSync(), {
              d: e
            }, {
              inkey: t
            }),
            method: "POST",
            header: {
              "content-type": "application/x-www-form-urlencoded"
            },
            success: function (t) {
              t.data < 0 && wx.setStorageSync("stj_close", "1"), a && a({
                onlineNum: t.data
              });
            }
          });
        }
      }
    }), "success";
  }
}

var version = "1.0";
analysis.toString = function () {}, module.exports = {
  analysis: analysis
};