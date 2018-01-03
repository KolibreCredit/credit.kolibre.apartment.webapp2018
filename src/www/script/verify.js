/**
 * Created by long.jiang on 2016/12/13.
 */
var credentialType = "";
var credentialTabIndex = -1;
//
var realName = "";
var credentialNo = "";
//
var facePhotoUrl = "";
var backPhotoUrl = "";
var url = "";

//
function chooseType(tabIndex) {
    credentialTabIndex = tabIndex;
    $(".selectv").hide();
    $(".selecttype").removeClass("active").eq(tabIndex).addClass("active").find(".selectv").show();
}

function step() {
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
        postInvoke(constants.URLS.IDENTITYVERIFY, data, function (res) {
            if (res.succeeded) {
                credentialType = "IDCard";
                $("#lbTitle1").html("请上传您的有效二代身份证");
                $("#lbTitle2").html("上传身份证正面");
                $("#lbTitle3").html("上传身份证背面");
                $("#imgDemo1").attr("src", "images/sfz1.png");
                $("#imgDemo2").attr("src", "images/sfz2.png");
                $(".step0").hide();
                $(".step1").show();
            } else {
                mui.toast(res.message);
            }
        }, function (err) {
            mui.toast(err.message);
        });
    } else {
        credentialType = "Passport";
        $("#lbTitle1").html("请上传您的有效护照");
        $("#lbTitle2").html("上传护照个人信息页");
        $("#lbTitle3").html("上传护照签证信息页");
        $("#imgDemo1").attr("src", "images/hz1.png");
        $("#imgDemo2").attr("src", "images/hz2.png");
        $(".step0").hide();
        $(".step1").show();
    }
}

function V2UploadImages(imgData, imgIndex) {
    var data = {
        type: credentialType,
        base64String: imgData,
        index: imgIndex,
        credentialNo: credentialNo,
        credentialFace: (imgIndex == 0 ? true : false)
    };
    postInvoke(constants.URLS.V2UPLOADIMAGES, data, function (res) {
        if (res.index == 0) {
            facePhotoUrl = res.url;
        } else {
            backPhotoUrl = res.url;
        }
        if (imgIndex == 0) {
            document.getElementById('imgIdentity1').setAttribute('src', imgData);
            document.getElementById("divIdentity1").style.display = 'none';
            document.getElementById("divIdentity1Img").style.display = 'block';
            $('#img1').replaceWith('<input type="file" accept="image/*" id="img1" name="img1" class="input-upload-image"/>');
        } else {
            document.getElementById('imgIdentity2').setAttribute('src', imgData);
            document.getElementById("divIdentity2").style.display = 'none';
            document.getElementById("divIdentity2Img").style.display = 'block';
            $('#img2').replaceWith('<input type="file" accept="image/*" id="img2" name="img2" class="input-upload-image"/>');
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
    var data = {
        credentialType: credentialType,
        credentialNo: credentialNo,
        realName: realName,
        credentialFacePhotoUrl: facePhotoUrl,
        credentialBackPhotoUrl: backPhotoUrl,
        client: "M"
    };
    $(".msg-post").show();
    postInvoke(constants.URLS.CREATEACCOUNTINFO, data, function (res) {
        if (res.succeeded) {
            $(".msg-post").hide();
            mui.toast(constants.msgInfo.verify);
            setTimeout(function () {
                if (url != "") {
                    window.location.href = url;
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

$(document).ready(function () {
    url = getURLQuery("url");
});