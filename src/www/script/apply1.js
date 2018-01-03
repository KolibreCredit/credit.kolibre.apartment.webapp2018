/**
 * Created by long.jiang on 2017/1/9.
 */

var waitCount = 0;
function apply() {
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
    if (!constants.REGEX.CREDENTIALNO.test(credentialNo)) {
        mui.toast(constants.msgInfo.credentialNoerr);
        return false;
    }
    var cellphone = $("#txtCellphone").val();
    if (cellphone == '') {
        mui.toast(constants.msgInfo.phone);
        return false;
    }
    if (!constants.REGEX.CELLPHONE.test(cellphone)) {
        mui.toast(constants.msgInfo.phoneerr);
        return false;
    }
    var data = {
        realName: realName,
        idCardNo: credentialNo,
        cellphone: cellphone
    };
    postInvoke(constants.URLS.THREEFACTORVERIFY, data, function (res) {
        if (res.succeeded) {
            $(".msg-icon").addClass("success");
            $(".msg-tip").html("认证成功");
            $(".msg-content").show();
            setTimeout(function () {
                window.location.href = "apply2.html";
            }, 2000);
        } else {
            waitCount = waitCount + 1;
            $(".msg-icon").addClass("fail");
            $(".msg-tip").html((waitCount < 3 ? "认证失败\<br/>请重新认证" : "认证失败"));
            $(".msg-content").show();
            setTimeout(function () {
                if (waitCount < 3) {
                    $(".msg-content").hide();
                } else {
                    $(".msg-content").hide();
                    $(".step0").hide();
                    $(".step1").show();
                }
            }, 2000);
        }
    }, function (err) {
        mui.toast(err.message);
    });
}

var waitTimer = null;
var waitCount2 = 60;
var token = "";
var isSendCaptcha = true;
//
function sendWaitTimer() {
    if (waitCount2 > 0) {
        $('#btnSendCaptcha').text(waitCount2 + 'S');
        waitCount2 = waitCount2 - 1;
    } else {
        clearInterval(waitTimer);
        $('#btnSendCaptcha').text('获取验证码');
        waitCount2 = 60;
        isSendCaptcha = true;
    }
}

function sendCaptcha() {
    if (isSendCaptcha) {
        var cellphone = $("#txtCellphone2").val();
        if (cellphone === '') {
            mui.toast(constants.msgInfo.phone);
            return false;
        }
        if (!constants.REGEX.CELLPHONE.test(cellphone)) {
            mui.toast(constants.msgInfo.phoneerr);
            return false;
        }
        isSendCaptcha = false;
        var businessType = 500;
        var data = {
            cellphone: cellphone,
            businessType: businessType
        };
        waitTimer = setInterval(function () {
            sendWaitTimer();
        }, 1000);
        isSendCaptcha = false;
        postInvoke(constants.URLS.SENDSMSCODE, data,
            function (res) {
                isSendCaptcha = true;
                if (res.succeeded) {
                    token = res.data.token;
                    mui.toast(constants.msgInfo.send);
                } else {
                    waitCount2 = 0;
                    mui.toast(res.message);
                }
            }, function (res) {
                isSendCaptcha = true;
                waitCount2 = 0;
                mui.toast(res.message);
            });
    }
}

function moblieApply() {
    if (token == '') {
        mui.toast(constants.msgInfo.tokenerr);
        return false;
    }
    var cellphone = $("#txtCellphone2").val();
    if (cellphone == '') {
        mui.toast(constants.msgInfo.phone);
        return false;
    }
    if (!constants.REGEX.CELLPHONE.test(cellphone)) {
        mui.toast(constants.msgInfo.phoneerr);
        return false;
    }

    var captcha = $("#txtCaptcha").val();
    if (captcha == '') {
        mui.toast(constants.msgInfo.captcha);
        return false;
    }
    if (!constants.REGEX.CHECKCODE.test(captcha)) {
        mui.toast(constants.msgInfo.captchaerr);
        return false;
    }
    var cellphoneBelong = $("#txtSource").val();
    if (cellphoneBelong == '') {
        mui.toast(constants.msgInfo.source2);
        return false;
    }
    var verify = {
        token: token,
        smsCode: captcha
    };
    postInvoke(constants.URLS.VERIFYSMSCODE, verify, function (res) {
        if (res.succeeded) {
            var data = {
                token: token,
                cellphoneBelong: cellphoneBelong
            };
            postInvoke(constants.URLS.SMSCODEVERIFY, data, function (res1) {
                if (res1.succeeded) {
                    $(".msg-icon").removeClass("fail").addClass("success");
                    $(".msg-tip").html("认证成功");
                    $(".msg-content").show();
                    setTimeout(function () {
                        window.location.href = "apply2.html";
                    }, 2000);
                } else {
                    $(".msg-icon").addClass("fail");
                    $(".msg-tip").html("认证失败");
                    $(".msg-content").show();
                    setTimeout(function () {
                        window.location.href = constants.URLS.WEIXIBILL;
                    }, 2000);
                }
            }, function (err) {
                mui.toast(err.message);
            });
        } else {
            mui.toast(res.message);
        }
    }, function (err) {
        mui.toast(err.message);
    });
}

function getLeaseinfo() {
    var leaseId = getCookie(constants.COOKIES.LEASEID);
    getInvoke(constants.URLS.GETLEASEINFO.format(leaseId), function (res) {
        if (res.productNo == "221010410") {
            $(".step1").show();
        }
        else if (res.productNo == "221010510") {
            $(".step1").show();
        }
        else if (res.productNo == "221010610") {
            $(".step1").show();
        }
        else {
            $(".step0").show();
        }
    });
}

$(document).ready(function () {
    //getLeaseinfo();
});