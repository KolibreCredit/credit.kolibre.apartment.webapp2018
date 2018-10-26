/**
 * Created by long.jiang on 2016/12/13.
 */
var url = "";
//
var credentialTabIndex = -1;
var realName = "";
var credentialNo = "";
//
var credentialTypes = ["IDCard", "Passport", "TaiwanPermit", "HongKongMacao", "Other"];
var kinds = ["IDCardFace", "IDCardBack", "Selfie"];
var credentialFacePhotoUrl = "";
var credentialBackPhotoUrl = "";
var selfiePhotoUrl = "";
var imgIndex = -1;
var authCode = "";

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
                if (res.data.succeeded) {
                    $(".chooseTip").html("有效二代身份证");
                    $("#lbTitle1").html("身份证<span style=\"color:#f58a00\">头像面</span>");
                    $("#lbTitle2").html("身份证<span style=\"color:#f58a00\">国徽面</span>");
                    $("#imgCredientalFacePhotoUrl").attr("src", "images/photo/sfz1.png");
                    $("#imgCredientalBackPhotoUrl").attr("src", "images/photo/sfz2.png");
                    $("#imgSelfiePhotoUrl").attr("src", "images/photo/sfz3.png");
                    $(".step0").hide();
                    $(".step1").show();
                } else {
                    mui.toast(res.data.message);
                }
            } else {
                mui.toast(res.message);
            }
        }, function (err) {
            $(".msg-post").hide();
            mui.toast(err.message);
        });
    } else if (credentialTabIndex == 1) {
        $(".chooseTip").html("有效护照");
        $("#lbTitle1").html("护照<span style=\"color:#f58a00\">头像信息页</span>");
        $("#lbTitle2").html("护照<span style=\"color:#f58a00\">居留许可页</span>");
        $("#imgCredientalFacePhotoUrl").attr("src", "images/photo/hz1.png");
        $("#imgCredientalBackPhotoUrl").attr("src", "images/photo/hz2.png");
        $("#imgSelfiePhotoUrl").attr("src", "images/photo/hz3.png");
        $(".step0").hide();
        $(".step1").show();
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
        else {
            $(".chooseTip").html("有效其他证件");
            $("#lbTitle1").html("其他证件<span style=\"color:#f58a00\">正面</span>");
            $("#lbTitle2").html("其他证件<span style=\"color:#f58a00\">反面</span>");
        }
        $("#imgCredientalFacePhotoUrl").attr("src", "images/photo/other1.png");
        $("#imgCredientalBackPhotoUrl").attr("src", "images/photo/other2.png");
        $("#imgSelfiePhotoUrl").attr("src", "images/photo/other3.png");
        $(".step0").hide();
        $(".step1").show();
    }
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
    /* if (selfiePhotoUrl == '') {
         mui.toast(constants.msgInfo.img3err);
         return false;
     }*/
    var data = {
        authCode: authCode,
        realName: realName,
        credentialType: credentialTypes[credentialTabIndex],
        credentialNo: credentialNo,
        credentialFacePhotoUrl: credentialFacePhotoUrl,
        credentialBackPhotoUrl: credentialBackPhotoUrl,
        selfiePhotoUrl: selfiePhotoUrl
    };
    $(".msg-post").show();
    if (authCode != "") {
        postInvoke(constants.URLS.MOBILEUPDATETENANTINFO, data, function (res) {
            if (res.succeeded) {
                clearToken();
                $(".msg-post").hide();
                mui.toast(constants.msgInfo.verify.format("证件"));
                setTimeout(function () {
                    window.location.href = "login.html";
                }, 1000);
            } else {
                $(".msg-post").hide();
                mui.toast(res.message);
            }
        }, function (err) {
            $(".msg-post").hide();
            mui.toast(err.message);
        });
    } else {
        postInvoke(constants.URLS.UPLOADTENANTINFO, data, function (res) {
            if (res.succeeded) {
                $(".msg-post").hide();
                mui.toast(constants.msgInfo.verify.format("证件"));
                setTimeout(function () {
                    if (!res.data.confirmed) {
                        window.location.href = "confirmTenant.html?url=list.html";
                    }
                    else if (url != "") {
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
}

function V2UploadImages(serverId) {
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
            $(".item").eq(res.data.index).css({"border": "2px solid #fcfcfc"});
            $(".item").eq(res.data.index).find(".camera").hide();
            $(".item").eq(res.data.index).find(".choose").show();
        }
    });
}

function chooseImage(index) {
    imgIndex = index;
    document.getElementById("chooseImg").click();
}

$(document).ready(function () {
    url = decodeURIComponent(getURLQuery("url"));
    authCode = getURLQuery("authCode");
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
        document.querySelector('#chooseImg').onclick = function () {
            wx.chooseImage({
                count: 1,
                sizeType: ['original', 'compressed'],
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
    //demo
    /*  $(".item").eq(0).css({"border": "2px solid #fcfcfc"});
     $(".item").eq(0).find(".camera").hide();
     $(".item").eq(0).find(".choose").show();*/
    var myScroll = new IScroll('#wrapper', {
        preventDefault: false,
        scrollX: true,
        scrollY: false,
        mouseWheel: false
    });
});