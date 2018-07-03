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
            //
            credentialFacePhotoUrl = tenantInfo.credentialFacePhotoUrl;
            if (credentialFacePhotoUrl != null && credentialFacePhotoUrl != "") {
                $("#imgCredentialFacePhotoUrl").attr("src", credentialFacePhotoUrl);
            } else {
                $(".original").eq(0).css({"border": "2px dotted #fd8b14"});
                $(".camera").eq(0).show();
                $(".choose").eq(0).hide();
                $("#imgCredentialFacePhotoUrl").attr("src", (tenantInfo.credentialType == "IDCard" ? "images/photo/sfz1.png" : "images/photo/hz1.png"));
            }
            ///
            credentialBackPhotoUrl = tenantInfo.credentialBackPhotoUrl;
            if (credentialBackPhotoUrl != null && credentialBackPhotoUrl != "") {
                $("#imgCredentialBackPhotoUrl").attr("src", credentialBackPhotoUrl);
            } else {
                $(".original").eq(1).css({"border": "2px dotted #fd8b14"});
                $(".camera").eq(1).show();
                $(".choose").eq(1).hide();
                $("#imgCredentialBackPhotoUrl").attr("src", (tenantInfo.credentialType == "IDCard" ? "images/photo/sfz2.png" : "images/photo/hz2.png"));
            }
            //
            selfiePhotoUrl = tenantInfo.selfiePhotoUrl;
            if (selfiePhotoUrl != null && selfiePhotoUrl != "") {
                $("#imgSelfiePhotoUrl").attr("src", selfiePhotoUrl);
            } else {
                $(".original").eq(2).css({"border": "2px dotted #fd8b14"});
                $(".camera").eq(2).show();
                $(".choose").eq(2).hide();
                $("#imgSelfiePhotoUrl").attr("src", (tenantInfo.credentialType == "IDCard" ? "images/photo/sfz3.png" : "images/photo/hz3.png"));
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
            $(".original").eq(res.data.index).css({"border": "2px solid #fcfcfc"});
            $(".camera").eq(res.data.index).hide();
            $(".choose").eq(res.data.index).show();
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
    /*    if (selfiePhotoUrl == '') {
            mui.toast(constants.msgInfo.img3err);
            return false;
        }*/
    var data = {
        realName: realName,
        credentialType: (credentialTabIndex == 0 ? "IDCard" : "Passport"),
        credentialNo: credentialNo,
        credientalFacePhotoUrl: credentialFacePhotoUrl,
        credientalBackPhotoUrl: credentialBackPhotoUrl,
        selfiePhotoUrl: selfiePhotoUrl
    };
    $(".msg-post").show();
    postInvoke(constants.URLS.CONFIRMTENANTINFO, data, function (res) {
        showContent(res.succeeded);
    }, function (err) {
        console.log(err.message);
        showContent(false);
    });
}

function showContent(succeeded) {
    var tplMsg = $("#tplMsg").html();
    if (succeeded) {
        $("#divMsgBody").html(tplMsg.format("images/success1.png", "成功提交个人信息", "需先确认租约，才能完成其他操作", "", succeeded));
    } else {
        $("#divMsgBody").html(tplMsg.format("images/fail1.png", "个人信息提交失败", "请及时修改，如果疑问联系客服", "400-921-5508", succeeded));
    }
    $(".msg-post").hide();
    setTimeout(function () {
        $(".msg-content").show();
    }, 100);
}

function hideContent(succeeded) {
    $(".msg-content").hide();
    if (succeeded) {
        window.location.href = "list.html";
    }
}
