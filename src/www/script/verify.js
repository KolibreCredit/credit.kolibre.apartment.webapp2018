/**
 * Created by long.jiang on 2016/12/13.
 */
var url = "";
//
var credentialTabIndex = -1;
var realName = "";
var credentialNo = "";
//
var kinds = ["IDCardFace", "IDCardBack", "Selfie"];
var credientalFacePhotoUrl = "";
var credientalBackPhotoUrl = "";
var selfiePhotoUrl = "";

//
function chooseType(tabIndex) {
    credentialTabIndex = tabIndex;
    $(".selectv").hide();
    $(".selecttype").removeClass("active").eq(tabIndex).addClass("active").find(".selectv").show();
}
//
function twoFactorVerify() {
    if (credentialTabIndex == -1) {
        mui.toast(constants.msgInfo.credentialType);
        return false;
    }
    realName = $("#txtRealName").val();
    if (realName == '') {
        mui.toast(constants.msgInfo.realName);
        return false;
    }
    credentialNo = $("#txtCredentialNo").val();
    if (credentialNo == '') {
        mui.toast(constants.msgInfo.credentialNo);
        return false;
    }
    if (credentialTabIndex == 0) {
        if (!constants.REGEX.CREDENTIALNO.test(credentialNo)) {
            mui.toast(constants.msgInfo.credentialNoerr);
            return false;
        }
    }
    if (credentialTabIndex == 0) {
        var data = {
            realName: realName,
            idCardNo: credentialNo
        };
        $(".msg-post").show();
        postInvoke(constants.URLS.TWOFACTORVERIFY, data, function (res) {
            $(".msg-post").hide();
            if (res.succeeded) {
                $(".chooseTip").html("有效二代身份证");
                $("#lbTitle1").html("身份证<span style=\"color:#f58a00\">正面</span>");
                $("#lbTitle2").html("身份证<span style=\"color:#f58a00\">背面</span>");
                $("#imgCredientalFacePhotoUrl").attr("src", "images/20180103/sfz1.png");
                $("#imgCredientalBackPhotoUrl").attr("src", "images/20180103/sfz2.png");
                $("#imgSelfiePhotoUrl").attr("src", "images/20180103/sfz3.png");
                $(".step0").hide();
                $(".step1").show();
            } else {
                mui.toast(res.message);
            }
        }, function (err) {
            $(".msg-post").hide();
            mui.toast(err.message);
        });
    } else {
        $(".chooseTip").html("有效护照");
        $("#lbTitle1").html("护照<span style=\"color:#f58a00\">个人信息页</span>");
        $("#lbTitle2").html("护照<span style=\"color:#f58a00\">签证信息页</span>");
        $("#imgCredientalFacePhotoUrl").attr("src", "images/20180103/hz1.png");
        $("#imgCredientalBackPhotoUrl").attr("src", "images/20180103/hz2.png");
        $("#imgSelfiePhotoUrl").attr("src", "images/20180103/hz3.png");
        $(".step0").hide();
        $(".step1").show();
    }
}

function confirmTenantInfo() {
    if (credientalFacePhotoUrl == '') {
        mui.toast((credentialTabIndex == 0 ? constants.msgInfo.img10err : constants.msgInfo.img11err));
        return false;
    }
    if (credientalBackPhotoUrl == '') {
        mui.toast((credentialTabIndex == 0 ? constants.msgInfo.img20err : constants.msgInfo.img21err));
        return false;
    }
    if (selfiePhotoUrl == '') {
        mui.toast(constants.msgInfo.img3err);
        return false;
    }
    var data = {
        realName: realName,
        credentialType: (credentialTabIndex == 0 ? "IDCard" : "Passport"),
        credentialNo: credentialNo,
        credientalFacePhotoUrl: credientalFacePhotoUrl,
        updateFacePhoto: true,
        credientalBackPhotoUrl: credientalBackPhotoUrl,
        updateBackPhoto: true,
        selfiePhotoUrl: selfiePhotoUrl,
        updateSelfPhoto: true
    };
    $(".msg-post").show();
    postInvoke(constants.URLS.CONFIRMTENANTINFO, data, function (res) {
        if (res.succeeded) {
            $(".msg-post").hide();
            mui.toast(constants.msgInfo.verify.format(credentialTabIndex == 0 ? "身份证" : "护照"));
            setTimeout(function () {
                if (url != "") {
                    window.location.href = decodeURIComponent(url);
                } else {
                    window.location.href = "user.html";
                }
            }, 1000);
        } else {
            $(".msg-post").hide();
            mui.toast(res.message);
        }
    }, function (err) {
        $(".msg-post").hide();
        mui.toast(err.message);
    });
}

function V2UploadImages(serverId, imgIndex) {
    var data = {
        serverId: serverId,
        kind: kinds[imgIndex],
        index: imgIndex
    };
    postInvoke(constants.URLS.UPLOADIMAGESWEIXIN, data, function (res) {
        if (res.succeeded) {
            if (res.data.index == 0) {
                credientalFacePhotoUrl = res.data.url;
                $('#imgCredientalFacePhotoUrl').attr('src', credientalFacePhotoUrl);
            } else if (res.data.index == 1) {
                credientalBackPhotoUrl = res.data.url;
                $('#imgCredientalBackPhotoUrl').attr('src', credientalBackPhotoUrl);
            }
            else {
                selfiePhotoUrl = res.data.url;
                $('#imgSelfiePhotoUrl').attr('src', selfiePhotoUrl);
            }
        }
    });
}

$(document).ready(function () {
    url = decodeURIComponent(getURLQuery("url"));
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
        document.querySelector('#chooseImg1').onclick = function () {
            wx.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera'],
                success: function (res) {
                    wx.uploadImage({
                        localId: res.localIds[0],
                        isShowProgressTips: 1,
                        success: function (res1) {
                            V2UploadImages(res1.serverId, 0);
                        }
                    });
                }
            });
        };
        //
        document.querySelector('#chooseImg2').onclick = function () {
            wx.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera'],
                success: function (res) {
                    wx.uploadImage({
                        localId: res.localIds[0],
                        isShowProgressTips: 1,
                        success: function (res1) {
                            V2UploadImages(res1.serverId, 1);
                        }
                    });
                }
            });
        };
        //
        document.querySelector('#chooseImg3').onclick = function () {
            wx.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera'],
                success: function (res) {
                    wx.uploadImage({
                        localId: res.localIds[0],
                        isShowProgressTips: 1,
                        success: function (res1) {
                            V2UploadImages(res1.serverId, 2);
                        }
                    });
                }
            });
        };
    });
});