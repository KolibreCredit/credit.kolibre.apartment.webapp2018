/**
 * Created by long.jiang on 2016/10/21.
 */
$(document).ready(function() {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.indexOf('micromessenger') !== -1) {
        var shareData = {
            title: '即刻注册云棱镜，快速免费帮你查信用',
            desc: '即刻注册云棱镜，快速免费帮你查信用',
            link: 'http://m.yintongzhengxin.com/app/register20161024.html',
            imgUrl: 'http://m.yintongzhengxin.com/chandiao/imager/logoshare.jpg'
        };
        var weixinUrl = 'http://server.kolibre.credit/Utilities/Signature/Signature?url=' + encodeURIComponent(window.location.href.split("#")[0]);
        $.ajax({
            type: 'get',
            url: weixinUrl,
            contentType: 'application/json',
            success: function(res) {
                wx.config({
                    debug: false,
                    appId: res.appId,
                    timestamp: res.timestamp,
                    nonceStr: res.nonceStr,
                    signature: res.signature,
                    jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage']
                });
                wx.ready(function() {
                    wx.onMenuShareTimeline({
                        title: shareData.title,
                        desc: shareData.desc,
                        link: shareData.link,
                        imgUrl: shareData.imgUrl,
                        success: function() {
                            alert('分享成功');
                        }
                    });
                    //
                    wx.onMenuShareAppMessage({
                        title: shareData.title,
                        desc: shareData.desc,
                        link: shareData.link,
                        imgUrl: shareData.imgUrl,
                        success: function() {
                            alert('分享成功');
                        }
                    });
                });
            },
            error: function() {
                alert('获取认证异常');
            }
        });
    }
});