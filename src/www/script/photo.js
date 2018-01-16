/**
 * Created by long.jiang on 2016/12/23.
 */
var tenantInfo = null;
$(document).ready(function () {
    getInvoke(constants.URLS.GETCURRENTTENANT, function (res) {
        if (res.succeeded) {
            tenantInfo = res.data;
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
            $("#imgSelfiePhotoUrl").attr("src", tenantInfo.selfiePhotoUrl);
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
var credentialFacePhotoUrl = "";
var credentialBackPhotoUrl = "";
var selfiePhotoUrl = "";

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
                $("#imgCredentialFacePhotoUrl1").attr("src", credentialFacePhotoUrl);
            }
            else if (res.data.index == 1) {
                credentialBackPhotoUrl = res.data.url;
                $("#imgCredentialBackPhotoUrl1").attr("src", credentialBackPhotoUrl);
            }
            else {
                selfiePhotoUrl = res.data.url;
                $("#imgSelfiePhotoUrl1").attr("src", selfiePhotoUrl);
            }
            $(".original").eq(res.data.index).hide();
            $(".camera").eq(res.data.index).show();
            $(".cameraMask").eq(res.data.index).show();
        }
    });
}

function saveImage(index) {
    /*   var data = {
           credientalFacePhotoUrl: credientalFacePhotoUrl,
           credientalBackPhotoUrl: credientalBackPhotoUrl,
           selfiePhotoUrl: selfiePhotoUrl
       };
       $(".msg-post").show();
       postInvoke(constants.URLS.CONFIRMTENANTINFO, data, function (res) {
           if (res.succeeded) {

           } else {
               $(".msg-post").hide();
               mui.toast(res.message);
           }
       }, function (err) {
           $(".msg-post").hide();
           mui.toast(err.message);
       });*/
    if (index == 0) {
        $("#imgCredentialFacePhotoUrl").attr("src", credentialFacePhotoUrl);
    }
    else if (index == 1) {
        $("#imgCredentialBackPhotoUrl").attr("src", credentialBackPhotoUrl);
    }
    else {
        $("#imgSelfiePhotoUrl").attr("src", selfiePhotoUrl);
    }
    $(".original").eq(index).show();
    $(".camera").eq(index).hide();
    $(".cameraMask").eq(index).hide();
}

function cancelImage(index) {
    $(".original").eq(index).show();
    $(".camera").eq(index).hide();
    $(".cameraMask").eq(index).hide();
}
