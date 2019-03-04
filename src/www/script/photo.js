/**
 * Created by long.jiang on 2016/12/23.
 */
$(document).ready(function () {
    getInvoke(constants.URLS.GETCURRENTTENANT, function (res) {
        if (res.succeeded) {
            var tenantInfo = res.data;
            if (tenantInfo.credentialType == "IDCard") {
                $("#lbTitle1").html("身份证头像面");
                $("#lbTitle2").html("身份证国徽面");
                $("#lbCredentialType").text("身份证");
                $("#imgSelfiePhotoUrl").attr("src", "images/photo/sfz3.png");
            } else if (tenantInfo.credentialType == "Passport") {
                $("#lbTitle1").html("头像信息页");
                $("#lbTitle2").html("居留许可页");
                $("#lbCredentialType").text("护照");
                $("#imgSelfiePhotoUrl").attr("src", "images/photo/hz3.png");
            }
            else if (tenantInfo.credentialType == "TaiwanPermit") {
                $("#lbTitle1").html("台胞证正面");
                $("#lbTitle2").html("台胞证反面");
                $("#lbCredentialType").text("台胞证");
                $("#imgSelfiePhotoUrl").attr("src", "images/photo/other3.png");
            }
            else if (tenantInfo.credentialType == "HongKongMacao") {
                $("#lbTitle1").html("港澳通行证正面");
                $("#lbTitle2").html("港澳通行证反面");
                $("#lbCredentialType").text("港澳通行证");
                $("#imgSelfiePhotoUrl").attr("src", "images/photo/other3.png");
            }
            else if (tenantInfo.credentialType == "HongKongMacaoResidencePermit") {
                $("#lbTitle1").html("港澳居民居住证正面");
                $("#lbTitle2").html("港澳居民居住证反面");
                $("#lbCredentialType").text("港澳居民居住证");
                $("#imgSelfiePhotoUrl").attr("src", "images/photo/other3.png");
            }
            else if (tenantInfo.credentialType == "TaiwanResidencePermit") {
                $("#lbTitle1").html("台湾居民居住证正面");
                $("#lbTitle2").html("台湾居民居住证反面");
                $("#lbCredentialType").text("台湾居民居住证");
                $("#imgSelfiePhotoUrl").attr("src", "images/photo/other3.png");
            }
            else {
                $("#lbTitle1").html("其他证件正面");
                $("#lbTitle2").html("其他证件反面");
                $("#lbCredentialType").text("其他证件");
                $("#imgSelfiePhotoUrl").attr("src", "images/photo/other3.png");
            }
            $("#lbRealName").html(replaceStr(tenantInfo.realName, 1));
            $("#lbCredentialNo").html(replaceStr(tenantInfo.credentialNo, 3));
            $("#imgCredentialFacePhotoUrl").attr("src", tenantInfo.credentialFacePhotoUrl);
            $("#imgCredentialBackPhotoUrl").attr("src", tenantInfo.credentialBackPhotoUrl);
            if (tenantInfo.selfiePhotoUrl != null) {
                $("#imgSelfiePhotoUrl").attr("src", tenantInfo.selfiePhotoUrl);
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
