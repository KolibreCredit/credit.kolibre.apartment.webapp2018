/**
 * Created by long.jiang on 2016/12/23.
 */

$(document).ready(function () {
    getInvoke(constants.URLS.GETCURRENTTENANT, function (res) {
        if (res.succeeded) {
            var tenantInfo = res.data;
            if (tenantInfo.credentialType == "IDCard") {
                $("#lbTitle1").html("身份证正面");
                $("#lbTitle2").html("身份证背面");
                $("#lbCredentialType").text("身份证");
            } else {
                $("#lbTitle1").html("护照个人信息页");
                $("#lbTitle2").html("护照签证信息页");
                $("#lbCredentialType").text("护照");
            }
            $("#lbRealName").html(replaceStr(tenantInfo.realName, 1));
            $("#lbCredentialNo").html(replaceStr(tenantInfo.credentialNo, 3));
            $("#imgCredentialFacePhotoUrl").attr("src", tenantInfo.credentialFacePhotoUrl);
            $("#imgCredentialBackPhotoUrl").attr("src", tenantInfo.credentialBackPhotoUrl);
            if (tenantInfo.selfiePhotoUrl != null) {
                $("#imgSelfiePhotoUrl").attr("src", tenantInfo.selfiePhotoUrl);
            } else {
                $("#imgSelfiePhotoUrl").attr("src", (tenantInfo.credentialType == "IDCard" ? "images/sfz3-2.png" : "images/hz3-2.png"));
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
        //
        document.querySelector('#imgChoose1').onclick = function () {
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

function chooseImage(index) {
    imgIndex = index;
    document.getElementById("imgChoose1").click();
}

var kinds = ["IDCardFace", "IDCardBack", "Selfie"];
var photoUrls = ["", "", ""];

function V2UploadImages(serverId) {
    var data = {
        serverId: serverId,
        kind: kinds[imgIndex],
        index: imgIndex
    };
    postInvoke(constants.URLS.UPLOADIMAGESWEIXIN, data, function (res) {
        if (res.succeeded) {
            if (res.data.index == 0) {
                photoUrls[0] = res.data.url;
                $("#imgCredentialFacePhotoUrl1").attr("src", res.data.url);
            }
            else if (res.data.index == 1) {
                photoUrls[1] = res.data.url;
                $("#imgCredentialBackPhotoUrl1").attr("src", res.data.url);
            }
            else {
                photoUrls[2] = res.data.url;
                $("#imgSelfiePhotoUrl1").attr("src", res.data.url);
            }
            $(".original").eq(res.data.index).hide();
            $(".camera").eq(res.data.index).show();
            $(".cameraMask").eq(res.data.index).show();
        }
    });
}

function saveImage(index) {
    var data = {
        photoType: kinds[index],
        photoUrl: photoUrls[index]
    };
    $(".msg-post").show();
    postInvoke(constants.URLS.UPDATETENANTPHOTO, data, function (res) {
        if (res.succeeded) {
            if (index == 0) {
                $("#imgCredentialFacePhotoUrl").attr("src", photoUrls[0]);
            }
            else if (index == 1) {
                $("#imgCredentialBackPhotoUrl").attr("src", photoUrls[1]);
            }
            else {
                $("#imgSelfiePhotoUrl").attr("src", photoUrls[2]);
            }
            cancelImage(index);
        } else {
            $(".msg-post").hide();
            mui.toast(res.message);
        }
    }, function (err) {
        $(".msg-post").hide();
        mui.toast(err.message);
    });
}

function cancelImage(index) {
    $(".original").eq(index).show();
    $(".camera").eq(index).hide();
    $(".cameraMask").eq(index).hide();
}
