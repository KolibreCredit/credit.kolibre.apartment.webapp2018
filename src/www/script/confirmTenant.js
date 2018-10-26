/**
 * Created by long.jiang on 2016/12/23.
 */
var url = "";
var credentialTabIndex = -1;
var credentialTypes = ["IDCard", "Passport", "TaiwanPermit", "HongKongMacao", "Other"];
var credentialFacePhotoUrl = "";
var credentialBackPhotoUrl = "";
var selfiePhotoUrl = "";
//
$(document).ready(function () {
    url = getURLQuery("url");
    getInvoke(constants.URLS.GETCURRENTTENANT, function (res) {
        if (res.succeeded) {
            var tenantInfo = res.data;
            //
            credentialFacePhotoUrl = tenantInfo.credentialFacePhotoUrl;
            if (credentialFacePhotoUrl != null && credentialFacePhotoUrl != "") {
                $("#imgCredentialFacePhotoUrl").attr("src", credentialFacePhotoUrl);
                $(".choose").eq(0).show();
            } else {
                $(".original").eq(0).css({"border": "2px dotted #fd8b14"});
                $(".camera").eq(0).show();
                if (tenantInfo.credentialType == "IDCard") {
                    $("#imgCredentialFacePhotoUrl").attr("src", "images/photo/sfz1.png");
                } else if (tenantInfo.credentialType == "Passport") {
                    $("#imgCredentialFacePhotoUrl").attr("src", "images/photo/hz1.png");
                } else {
                    $("#imgCredentialFacePhotoUrl").attr("src", "images/photo/other1.png");
                }
            }
            //
            credentialBackPhotoUrl = tenantInfo.credentialBackPhotoUrl;
            if (credentialBackPhotoUrl != null && credentialBackPhotoUrl != "") {
                $("#imgCredentialBackPhotoUrl").attr("src", credentialBackPhotoUrl);
                $(".choose").eq(1).show();
            } else {
                $(".original").eq(1).css({"border": "2px dotted #fd8b14"});
                $(".camera").eq(1).show();
                if (tenantInfo.credentialType == "IDCard") {
                    $("#imgCredentialBackPhotoUrl").attr("src", "images/photo/sfz2.png");
                } else if (tenantInfo.credentialType == "Passport") {
                    $("#imgCredentialBackPhotoUrl").attr("src", "images/photo/hz2.png");
                } else {
                    $("#imgCredentialBackPhotoUrl").attr("src", "images/photo/other2.png");
                }
            }
            //
            selfiePhotoUrl = tenantInfo.selfiePhotoUrl;
            if (selfiePhotoUrl != null && selfiePhotoUrl != "") {
                $("#imgSelfiePhotoUrl").attr("src", selfiePhotoUrl);
                $(".choose").eq(2).show();
            } else {
                $(".original").eq(2).css({"border": "2px dotted #fd8b14"});
                $(".camera").eq(2).show();
                if (tenantInfo.credentialType == "IDCard") {
                    $("#imgSelfiePhotoUrl").attr("src", "images/photo/sfz3.png");
                } else if (tenantInfo.credentialType == "Passport") {
                    $("#imgSelfiePhotoUrl").attr("src", "images/photo/hz3.png");
                } else {
                    $("#imgSelfiePhotoUrl").attr("src", "images/photo/other3.png");
                }
            }
            $("#txtRealName").val(tenantInfo.realName);
            if (tenantInfo.credentialType == "IDCard") {
                credentialTabIndex = 0;
                $("#lbTitle1").html("身份证头像面");
                $("#lbTitle2").html("身份证国徽面");
                $("#txtCredentialType").val("身份证");
            } else if (tenantInfo.credentialType == "Passport") {
                credentialTabIndex = 1;
                $("#lbTitle1").html("头像信息页");
                $("#lbTitle2").html("居留许可页");
                $("#txtCredentialType").val("护照");
            }
            else if (tenantInfo.credentialType == "TaiwanPermit") {
                credentialTabIndex = 2;
                $("#lbTitle1").html("台胞证正面");
                $("#lbTitle2").html("台胞证反面");
                $("#txtCredentialType").val("台胞证");
            }
            else if (tenantInfo.credentialType == "HongKongMacao") {
                credentialTabIndex = 3;
                $("#lbTitle1").html("港澳通行证正面");
                $("#lbTitle2").html("港澳通行证反面");
                $("#txtCredentialType").val("港澳通行证");
            }
            else {
                credentialTabIndex = 4;
                $("#lbTitle1").html("其他证件正面");
                $("#lbTitle2").html("其他证件反面");
                $("#txtCredentialType").val("其他证件");
            }
            $("#txtCredentialNo").val(tenantInfo.credentialNo);
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
    if (credentialTabIndex == 0) {
        if (!constants.REGEX.CREDENTIALNO.test(credentialNo)) {
            mui.toast(constants.msgInfo.credentialNoerr);
            return false;
        }
    }
    if (credentialFacePhotoUrl == '') {
        mui.toast(constants.msgInfo.img1err[credentialTabIndex]);
        return false;
    }
    if (credentialBackPhotoUrl == '') {
        mui.toast(constants.msgInfo.img2err[credentialTabIndex]);
        return false;
    }
    /*    if (selfiePhotoUrl == '') {
            mui.toast(constants.msgInfo.img3err);
            return false;
        }*/
    var data = {
        realName: realName,
        credentialType: credentialTypes[credentialTabIndex],
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
