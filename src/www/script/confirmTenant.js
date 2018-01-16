/**
 * Created by long.jiang on 2016/12/23.
 */
var url = "";
var credentialFacePhotoUrl = "";
var credentialBackPhotoUrl = "";
var selfiePhotoUrl = "";
//
$(document).ready(function () {
    url = getURLQuery("url");
    getInvoke(constants.URLS.GETCURRENTTENANT, function (res) {
        if (res.succeeded) {
            var tenantInfo = res.data;
            if (tenantInfo.credentialType == "IDCard") {
                $("#lbTitle1").html("身份证正面");
                $("#lbTitle2").html("身份证背面");
                $("#txtCredentialType").val("身份证");
            } else {
                $("#lbTitle1").html("护照个人信息页");
                $("#lbTitle2").html("护照签证信息页");
                $("#txtCredentialType").val("护照");
            }
            $("#txtRealName").val(tenantInfo.realName);
            $("#txtCredentialNo").val(tenantInfo.credentialNo);
            credentialFacePhotoUrl = tenantInfo.credentialFacePhotoUrl;
            $("#imgCredentialFacePhotoUrl").attr("src", credentialFacePhotoUrl);
            //
            credentialBackPhotoUrl = tenantInfo.credentialBackPhotoUrl;
            $("#imgCredentialBackPhotoUrl").attr("src", credentialBackPhotoUrl);
            //
            selfiePhotoUrl = tenantInfo.selfiePhotoUrl;
            $("#imgSelfiePhotoUrl").attr("src", selfiePhotoUrl);
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
                $("#imgCredentialFacePhotoUrl").attr("src", credentialFacePhotoUrl);
            }
            else if (res.data.index == 1) {
                credentialBackPhotoUrl = res.data.url;
                $("#imgCredentialBackPhotoUrl").attr("src", credentialBackPhotoUrl);
            }
            else {
                selfiePhotoUrl = res.data.url;
                $("#imgSelfiePhotoUrl").attr("src", selfiePhotoUrl);
            }
        }
    });
}

function confirmTenantInfo() {
    var realName = $("#txtRealName").val();
    if (realName == '') {
        mui.toast(constants.msgInfo.realName);
        return false;
    }
    var credentialNo = $("#txtCredentialNo").val();
    if (credentialNo == '') {
        mui.toast(constants.msgInfo.credentialNo);
        return false;
    }
    var credentialTabIndex = ($("#txtCredentialType").val() == "身份证" ? 0 : 1);
    if (credentialTabIndex == 0) {
        if (!constants.REGEX.CREDENTIALNO.test(credentialNo)) {
            mui.toast(constants.msgInfo.credentialNoerr);
            return false;
        }
    }
    if (credentialFacePhotoUrl == '') {
        mui.toast((credentialTabIndex == 0 ? constants.msgInfo.img10err : constants.msgInfo.img11err));
        return false;
    }
    if (credentialBackPhotoUrl == '') {
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
        credientalFacePhotoUrl: credentialFacePhotoUrl,
        updateFacePhoto: true,
        credientalBackPhotoUrl: credentialBackPhotoUrl,
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
                    window.location.href = "index.html";
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
