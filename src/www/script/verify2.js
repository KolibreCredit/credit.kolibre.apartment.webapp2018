/**
 * Created by long.jiang on 2016/12/13.
 */
var credentialType = "IDCard";
//
var facePhotoUrl = "";
var backPhotoUrl = "";
var credentialsPhotoUrl = "";
var backUrl = "";
var credentialNo = "";

function chooseType2() {
    $("#div11").hide();
    $("#div10").show();
    $("#div21").hide();
    $("#div20").show();
    $("#div31").hide();
    $("#div30").show();
    if (credentialType == "Passport") {
        credentialType = "IDCard";
        $(".chooseTip").html("有效二代身份证");
        $("#div10 .title").html("身份证<span style=\"color:#f58a00\">正面</span>");
        $("#div20 .title").html("身份证<span style=\"color:#f58a00\">背面</span>");
        $("#div10 .demo").attr("src", "images/sfz1-2.png");
        $("#div20 .demo").attr("src", "images/sfz2-2.png");
    } else {
        credentialType = "Passport";
        $(".chooseTip").html("有效护照");
        $("#div10 .title").html("护照<span style=\"color:#f58a00\">个人信息页</span>");
        $("#div20 .title").html("护照<span style=\"color:#f58a00\">签证信息页</span>");
        $("#div10 .demo").attr("src", "images/hz1-2.png");
        $("#div20 .demo").attr("src", "images/hz2-2.png");
    }
}

function V2UploadImages(serverId, imgIndex) {
    var data = {
        serverId: serverId,
        type: credentialType,
        index: imgIndex,
        credentialNo: credentialNo,
        credentialFace: (imgIndex == 0 ? true : false)
    };
    postInvoke(constants.URLS.UPLOADIMAGES, data, function (res) {
        if (res.index == 0) {
            facePhotoUrl = res.url;
            $('#img12').attr('src', facePhotoUrl);
            setTimeout(function () {
                $("#div10").hide();
                $("#div11").show();
            }, 500);

        } else if (res.index == 1) {
            backPhotoUrl = res.url;
            $('#img22').attr('src', backPhotoUrl);
            setTimeout(function () {
                $("#div20").hide();
                $("#div21").show();
            }, 500);
        }
        else {
            credentialsPhotoUrl = res.url;
            $('#img32').attr('src', credentialsPhotoUrl);
            setTimeout(function () {
                $("#div30").hide();
                $("#div31").show();
            }, 500);
        }
    });
}

function verify() {
    if (facePhotoUrl == '') {
        mui.toast(constants.msgInfo.img1err);
        return false;
    }
    if (backPhotoUrl == '') {
        mui.toast(constants.msgInfo.img2err);
        return false;
    }
    if (credentialsPhotoUrl == '') {
        mui.toast(constants.msgInfo.img3err);
        return false;
    }
    var data = {
        credentialType: credentialType,
        credentialFaceUrl: facePhotoUrl,
        credentialBackUrl: backPhotoUrl,
        selies: credentialsPhotoUrl
    };
    $(".msg-post").show();
    postInvoke(constants.URLS.VERIFYV2, data, function (res) {
        if (res.succeeded) {
            $(".msg-post").hide();
            mui.toast(constants.msgInfo.verify);
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
    getInvoke(constants.URLS.GETCURRENTHOUSEACCOUNTINFO, function (res) {
        $('#lbRealName').html(res.realName);
        $('#lbCredentialNo').html(res.credentialNo);
        credentialNo = res.credentialNo;
    });
});