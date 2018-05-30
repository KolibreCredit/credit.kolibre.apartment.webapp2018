/**
 * Created by long.jiang on 2017/1/10.
 */
var imgUrl1 = "";
var ispostData = true;
var isChooseImage = false;
var contractId = "";
var orderId = "";

//
function V2UploadImages(serverId) {
    var data = {
        serverId: serverId,
        kind: "FaceRecognition"
    };
    postInvoke(constants.URLS.UPLOADIMAGESWEIXIN, data, function (res) {
        if (res.succeeded) {
            imgUrl1 = res.data.url;
            $("#imgSelfiePhotoUrl").attr("src", imgUrl1);
            if (!isChooseImage) {
                isChooseImage = true;
                $("#chooseImage").attr("src", "images/20180530/choose.png");
            }
        }
    });
}

function faceRecognition2() {
    postInvoke(constants.URLS.FACERECOGNITION, {}, function (res) {
        $(".msg-post").hide();
        ispostData = true;
        if (res.succeeded) {
            mui.toast(constants.msgInfo.faceRecognition);
            setTimeout(function () {
                if (contractId != "") {
                    window.location.href = "instalment.html?contractId={0}".format(contractId);
                } else {
                    window.location.href = "instalment.html?orderId={0}".format(orderId);
                }
            }, 2000);
        } else {
            mui.toast(res.message);
            setTimeout(function () {
                $(".msg-alert").show();
            }, 2000);
        }
    }, function (err) {
        ispostData = true;
        $(".msg-post").hide();
        mui.toast(err.message);
        setTimeout(function () {
            $(".msg-alert").show();
        }, 2000);
    });
}

//
function faceRecognition() {
    if (!ispostData) {
        mui.toast(constants.msgInfo.postData);
        return false;
    }
    if (imgUrl1 == '') {
        mui.toast(constants.msgInfo.imgFaceRecognition);
        return false;
    }
    ispostData = false;
    $(".msg-post").show();
    var data = {
        photoType: "FaceRecognition",
        photoUrl: imgUrl1
    };
    postInvoke(constants.URLS.UPDATETENANTPHOTO, data, function (res) {
        if (res.succeeded) {
            faceRecognition2();
        } else {
            ispostData = true;
            $(".msg-post").hide();
            mui.toast(res.message);
        }
    }, function (err) {
        ispostData = true;
        $(".msg-post").hide();
        mui.toast(err.message);
    });
}

function hideAlert() {
    $(".msg-alert").hide();
}

$(document).ready(function () {
    contractId = getURLQuery("contractId");
    orderId = getURLQuery("orderId");
    getInvoke(constants.URLS.GETCURRENTTENANT, function (res) {
        if (res.succeeded) {
            if (res.data.faceRecognitionPhotoUrl != null && res.data.faceRecognitionPhotoUrl != "") {
                imgUrl1 = res.data.faceRecognitionPhotoUrl;
                $("#imgSelfiePhotoUrl").attr("src", imgUrl1);
                $("#chooseImage").attr("src", "images/20180530/choose.png");
                isChooseImage = true;
            }
        }
    });
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
                sizeType: ['compressed'],
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