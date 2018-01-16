/**
 * Created by long.jiang on 2017/1/10.
 */
var imgUrl1 = "";
var ispostData = true;

function V2UploadImages(serverId) {
    var data = {
        serverId: serverId,
        kind: "Selfie"
    };
    postInvoke(constants.URLS.UPLOADIMAGESWEIXIN, data, function (res) {
        if (res.succeeded) {
            imgUrl1 = res.data.url;
            $("#imgSelfiePhotoUrl").attr("src", imgUrl1);
        }
    });
}

//
function apply() {
    if (!ispostData) {
        mui.toast(constants.msgInfo.postData);
        return false;
    }
    if (imgUrl1 == '') {
        mui.toast(constants.msgInfo.imgIDCarderr);
        return false;
    }
    ispostData = false;
    $(".msg-post").show();
    var contractConfirmInfoId = getCookie(constants.COOKIES.CONTRACTCONFIRMINFOID);
    var data = {
        contractConfirmInfoId: contractConfirmInfoId,
        pictureType: "Selfie",
        pictureUrls: [imgUrl1]
    };
    postInvoke(constants.URLS.UPLOADPICTURES, data, function (res) {
        $(".msg-post").hide();
        ispostData = true;
        if (res.succeeded) {
            mui.toast(constants.msgInfo.imgIDCard);
            setTimeout(function () {
                window.location.href = "apply4.html";
            }, 1000);
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
    getInvoke(constants.URLS.GETCURRENTTENANT, function (res) {
        if (res.succeeded) {
            if (res.data.credentialType == "IDCard") {
                $("#imgSelfiePhotoUrl").attr("src", "images/demo4.png");
                $("#lbTitle").html("本人手持身份证照片");

            } else {
                $("#imgSelfiePhotoUrl").attr("src", "images/hz4.png");
                $("#lbTitle").html("本人手持护照照片");
            }
        }
    });
    //
    var signUrl = constants.URLS.SIGNATURE.format(encodeURIComponent(window.location.href.split("#")[0]));
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