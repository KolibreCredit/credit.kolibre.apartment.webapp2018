/**
 * Created by long.jiang on 2017/1/9.
 */
var waitCount = 60;
var waitTimer = null;
var isSendCaptcha = true;

//
function sendWaitTimer() {
    if (waitCount > 0) {
        $('#btnSendCaptcha').text(waitCount + '秒');
        waitCount = waitCount - 1;
    } else {
        clearInterval(waitTimer);
        $('#btnSendCaptcha').text('获取验证码');
        waitCount = 60;
        isSendCaptcha = true;
    }
}

function sendCaptcha() {
    if (isSendCaptcha) {
        var cellphone = $("#txtCellphone").val();
        if (cellphone === '') {
            mui.toast(constants.msgInfo.phone);
            return false;
        }
        if (!constants.REGEX.CELLPHONE.test(cellphone)) {
            mui.toast(constants.msgInfo.phoneerr);
            return false;
        }
        var businessType = "TenantThreeFactoryVerify";
        var data = {
            cellphone: cellphone,
            businessType: businessType
        };
        waitTimer = setInterval(function () {
            sendWaitTimer();
        }, 1000);
        isSendCaptcha = false;
        postInvoke(constants.URLS.SEND, data, function (res) {
            isSendCaptcha = true;
            if (res.succeeded) {
                mui.toast(constants.msgInfo.send);
            } else {
                waitCount = 0;
                mui.toast(res.message);
            }
        }, function (res) {
            isSendCaptcha = true;
            waitCount = 0;
            mui.toast(res.message);
        });
    }
}

function apply() {
    var cellphone = $("#txtCellphone").val();
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
        cellphone: cellphone,
        businessType: "TenantThreeFactoryVerify",
        validateCode: captcha
    };
    postInvoke(constants.URLS.VERIFY, verify, function (res) {
        if (res.succeeded) {
            var data = {
                authCode: res.data.authCode,
                cellphoneAscription: cellphoneBelong,
                contractConfirmInfoId: getCookie(constants.COOKIES.CONTRACTCONFIRMINFOID)
            };
            postInvoke(constants.URLS.TENANTVALIDATECODEVERIFY, data, function (res1) {
                if (res1.succeeded) {
                    $(".msg-icon").removeClass("fail").addClass("success");
                    $(".msg-tip").html("认证成功");
                    $(".msg-content").show();
                    setTimeout(function () {
                        toApplys(res1.data.nextStep);
                    }, 2000);
                } else {
                    $(".msg-icon").addClass("fail");
                    $(".msg-tip").html("认证失败");
                    $(".msg-content").show();
                    setTimeout(function () {
                        bill();
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