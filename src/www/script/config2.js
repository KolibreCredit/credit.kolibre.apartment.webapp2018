/**
 * Created by long.jiang on 2017/1/10.
 */
var tenancyId = "", qrCode  = "";
var tabIndex = -1;
var ispostData = true;
//
function V2UploadImages(serverId) {
    var data = {
        serverId: serverId,
        kind: "Other",
        index: tabIndex
    };
    postInvoke(constants.URLS.UPLOADIMAGESWEIXIN, data, function (res) {
        if (res.succeeded) {
            qrCode  = res.data.url;
            $("#imgQrCode").attr("src", qrCode).show();
            $(".add").eq(res.data.index).hide();
        }
    });
}

function wxChooseImage(index) {
    tabIndex = index;
    document.getElementById("chooseImage").click();
}

//
function apply() {
    if (!ispostData) {
        mui.toast(constants.msgInfo.postData);
        return false;
    }
    if (qrCode == '') {
        mui.toast("二维码不能为空");
        return false;
    }
    ispostData = false;
    $(".msg-post").show();
    var data = {
        tenancyId: tenancyId,
        qrCode : qrCode
    };
    postInvoke(constants.URLS.CREATESHORTLINK, data, function (res) {
        $(".msg-post").hide();
        ispostData = true;
        if (res.succeeded) {
            mui.toast("二维码上传成功");
            setTimeout(function () {
                window.location.href = "qcode.html?qrCodeModelType=Manual&qrCode={0}".format(res.data.qrCode);
            }, 2000);
        } else {
            mui.toast(res.message);
        }
    }, function (err) {
        ispostData = true;
        $(".msg-post").hide();
        mui.toast(err.message);
    });
}

$(document).ready(function () {
    tenancyId = getURLQuery("tenancyId");
    //
    var signUrl = constants.URLS.SIGNATURE.format(encodeURIComponent(window.location.href));
    signInvoke(signUrl, function (res) {
        wx.config({
            debug: false,
            appId: res.data.appId,
            timestamp: res.data.timestamp,
            nonceStr: res.data.nonceStr,
            signature: res.data.signature,
            jsApiList: ['checkJsApi', 'chooseImage', 'uploadImage']
        });
        document.querySelector('#chooseImage').onclick = function () {
            wx.chooseImage({
                count: 1,
                sizeType: ['original'],
                sourceType: ['album', 'camera'],
                success: function (res) {
                    wx.uploadImage({
                        localId: res.localIds[0],
                        isShowProgressTips: 1,
                        success: function (res1) {
                            V2UploadImages(res1.serverId);
                        }
                    });
                }
            });
        };
    });
});