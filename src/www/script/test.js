$(document).ready(function () {
    var signUrl = 'http://server-apartment.dev.kolibre.credit/WeChatApplet/Platform/WeChatApplet/Signature?url=' + encodeURIComponent(window.location.href.split("?")[0]);
    $.ajax({
        type: 'get',
        url: signUrl,
        contentType: 'application/json'
    })
        .done(function (res) {
            wx.config({
                debug: true,
                appId: res.appId,
                timestamp: res.timestamp,
                nonceStr: res.nonceStr,
                signature: res.signature,
                jsApiList: ['checkJsApi', 'chooseImage', 'uploadImage']
            });
        })
        .fail(function () {
            alert('获取认证异常');
        });
    document.querySelector('#chooseImage').onclick = function () {
        wx.chooseImage({
            count: 1,// 默认9
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                wx.uploadImage({
                    localId: res.localIds[0],
                    isShowProgressTips: 1,
                    success: function (res1) {
                        //images.serverId = res1.serverId;
                        $("#divmsg").html(JSON.stringify(res1.serverId));
                    }
                });
            }
        });
    };
});