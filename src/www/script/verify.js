/**
 * Created by long.jiang on 2016/12/13.
 */
var credentialTabIndex = -1;
//
var realName = "";
var credentialNo = "";
//
var kinds = ["IDCardFace", "IDCardBack", "Selfie"];
var credientalFacePhotoUrl = "";
var credientalBackPhotoUrl = "";
var selfiePhotoUrl = "";
//
var backUrl = "";

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
                $("#div10 .title").html("身份证<span style=\"color:#f58a00\">正面</span>");
                $("#div20 .title").html("身份证<span style=\"color:#f58a00\">背面</span>");
                $("#div10 .demo").attr("src", "images/sfz1-2.png");
                $("#div20 .demo").attr("src", "images/sfz2-2.png");
                $("#div30 .demo").attr("src", "images/sfz3-2.png");
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
        $("#div10 .title").html("护照<span style=\"color:#f58a00\">个人信息页</span>");
        $("#div20 .title").html("护照<span style=\"color:#f58a00\">签证信息页</span>");
        $("#div10 .demo").attr("src", "images/hz1-2.png");
        $("#div20 .demo").attr("src", "images/hz2-2.png");
        $("#div30 .demo").attr("src", "images/hz3-2.png");
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
        credentialBackUrl: credientalBackPhotoUrl,
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
                if (backUrl != "") {
                    window.location.href = backUrl;
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
    postInvoke(constants.URLS.UPLOADIMAGES, data, function (res) {
        if (res.index == 0) {
            credientalFacePhotoUrl = res.url;
            $('#img12').attr('src', credientalFacePhotoUrl);
            setTimeout(function () {
                $("#div10").hide();
                $("#div11").show();
            }, 500);

        } else if (res.index == 1) {
            credientalBackPhotoUrl = res.url;
            $('#img22').attr('src', credientalBackPhotoUrl);
            setTimeout(function () {
                $("#div20").hide();
                $("#div21").show();
            }, 500);
        }
        else {
            selfiePhotoUrl = res.url;
            $('#img32').attr('src', selfiePhotoUrl);
            setTimeout(function () {
                $("#div30").hide();
                $("#div31").show();
            }, 500);
        }
    });
}

function weixinSign() {
    var signUrl = constants.URLS.SIGNATURE.format(encodeURIComponent(window.location.href));
    $.ajax({
        type: 'get',
        url: signUrl,
        contentType: 'application/json'
    })
        .done(function (res) {
            wx.config({
                debug: false,
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
}

$(document).ready(function () {
    backUrl = decodeURIComponent(getURLQuery("url"));
    weixinSign();
});