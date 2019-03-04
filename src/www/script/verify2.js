/**
 * Created by long.jiang on 2016/12/13.
 */
var authCode = "";
var cellphone = "";
var credentialTabIndex = -1;
var realName = "";
var credentialNo = "";
//
var credentialTypes = ["IDCard", "Passport", "TaiwanPermit", "HongKongMacao","HongKongMacaoResidencePermit","TaiwanResidencePermit","Other"];
var kinds = ["IDCardFace", "IDCardBack", "Selfie"];
var credentialFacePhotoUrl = "";
var credentialBackPhotoUrl = "";
var selfiePhotoUrl = "";
var waitTimer = null;
var waitCount = 5;

//
function goLogin() {
    window.location.href = "login.html";
}

function goWaitTimer() {
    if (waitCount > 0) {
        waitCount = waitCount - 1;
        $('#lbWaitCount').text(waitCount + '秒');
    } else {
        clearInterval(waitTimer);
        goLogin();
    }
}

function startWaitTimer() {
    setTimeout(function () {
        $(".step1").hide();
        $(".step2").show();
        setInterval(function () {
            goWaitTimer();
        }, 1000);
    }, 500);
}

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
        $(".chooseTip").html("有效二代身份证");
        $("#lbTitle1").html("身份证<span style=\"color:#f58a00\">头像面</span>");
        $("#lbTitle2").html("身份证<span style=\"color:#f58a00\">国徽面</span>");
        $("#imgCredientalFacePhotoUrl").attr("src", "images/photo/sfz1.png");
        $("#imgCredientalBackPhotoUrl").attr("src", "images/photo/sfz2.png");
        $("#imgSelfiePhotoUrl").attr("src", "images/photo/sfz3.png");
    } else if (credentialTabIndex == 1) {
        $(".chooseTip").html("有效护照");
        $("#lbTitle1").html("护照<span style=\"color:#f58a00\">头像信息页</span>");
        $("#lbTitle2").html("护照<span style=\"color:#f58a00\">居留许可页</span>");
        $("#imgCredientalFacePhotoUrl").attr("src", "images/photo/hz1.png");
        $("#imgCredientalBackPhotoUrl").attr("src", "images/photo/hz2.png");
        $("#imgSelfiePhotoUrl").attr("src", "images/photo/hz3.png");
    } else {
        if (credentialTabIndex == 2) {
            $(".chooseTip").html("有效台胞证");
            $("#lbTitle1").html("台胞证<span style=\"color:#f58a00\">正面</span>");
            $("#lbTitle2").html("台胞证<span style=\"color:#f58a00\">反面</span>");
        }
        else if (credentialTabIndex == 3) {
            $(".chooseTip").html("有效港澳通行证");
            $("#lbTitle1").html("港澳通行证<span style=\"color:#f58a00\">正面</span>");
            $("#lbTitle2").html("港澳通行证<span style=\"color:#f58a00\">反面</span>");
        }
        else if (credentialTabIndex == 4) {
            $(".chooseTip").html("有效港澳居民居住证");
            $("#lbTitle1").html("港澳居民居住证<span style=\"color:#f58a00\">正面</span>");
            $("#lbTitle2").html("港澳居民居住证<span style=\"color:#f58a00\">反面</span>");
        }
        else if (credentialTabIndex == 5) {
            $(".chooseTip").html("有效台湾居民居住证");
            $("#lbTitle1").html("台湾居民居住证<span style=\"color:#f58a00\">正面</span>");
            $("#lbTitle2").html("台湾居民居住证<span style=\"color:#f58a00\">反面</span>");
        }
        else {
            $(".chooseTip").html("有效其他证件");
            $("#lbTitle1").html("其他证件<span style=\"color:#f58a00\">正面</span>");
            $("#lbTitle2").html("其他证件<span style=\"color:#f58a00\">反面</span>");
        }
        $("#imgCredientalFacePhotoUrl").attr("src", "images/photo/other1.png");
        $("#imgCredientalBackPhotoUrl").attr("src", "images/photo/other2.png");
        $("#imgSelfiePhotoUrl").attr("src", "images/photo/other3.png");
    }
    $(".step0").hide();
    $(".step1").show();
}

function confirmTenantInfo() {
    if (credentialFacePhotoUrl == '') {
        mui.toast(constants.msgInfo.img1err[credentialTabIndex]);
        return false;
    }
    if (credentialBackPhotoUrl == '') {
        mui.toast(constants.msgInfo.img2err[credentialTabIndex]);
        return false;
    }
    if (selfiePhotoUrl == '') {
        mui.toast(constants.msgInfo.img3err);
        return false;
    }
    var data = {
        authCode: authCode,
        cellphone: cellphone,
        realName: realName,
        credentialType: credentialTypes[credentialTabIndex],
        credentialNo: credentialNo,
        credentialFacePhotoUrl: credentialFacePhotoUrl,
        credentialBackPhotoUrl: credentialBackPhotoUrl,
        selfiePhotoUrl: selfiePhotoUrl
    };
    $(".msg-post").show();
    postInvoke(constants.URLS.CHANGECELLPHONEWITHINFO, data, function (res) {
        $(".msg-post").hide();
        if (res.succeeded) {
            $("#imgResult").attr("src", "images/success2.png");
            $("#divTip").html("手机号更换成功");
        } else {
            $("#imgResult").attr("src", "images/fail2.png");
            $("#divTip").html(res.message);
        }
        startWaitTimer();
    }, function (err) {
        $(".msg-post").hide();
        $("#imgResult").attr("src", "images/fail2.png");
        $("#divTip").html(err.message);
        startWaitTimer();
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
                credentialFacePhotoUrl = res.data.url;
                $('#imgCredientalFacePhotoUrl').attr('src', credentialFacePhotoUrl);
            } else if (res.data.index == 1) {
                credentialBackPhotoUrl = res.data.url;
                $('#imgCredientalBackPhotoUrl').attr('src', credentialBackPhotoUrl);
            }
            else {
                selfiePhotoUrl = res.data.url;
                $('#imgSelfiePhotoUrl').attr('src', selfiePhotoUrl);
            }
        }
    });
}

$(document).ready(function () {
    authCode = getURLQuery("authCode");
    cellphone = getURLQuery("cellphone");
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
    //
    var myScroll = new IScroll('#wrapper', {
        preventDefault: false,
        scrollX: true,
        scrollY: false,
        mouseWheel: false
    });
});