/**
 * Created by long.jiang on 2016/12/12.
 */
var token = "";
var waitTimer = null;
var waitCount = 60;
var isSendCaptcha = true;
var url = "";

//
function sendWaitTimer() {
    if (waitCount > 0) {
        $('#btnSendCaptcha').text(waitCount + 'S');
        waitCount = waitCount - 1;
    } else {
        clearInterval(waitTimer);
        $('#btnSendCaptcha').text('获取验证码');
        waitCount = 60;
        isSendCaptcha = true;
    }
}

//
function sendCaptcha() {
    if (isSendCaptcha) {
        var cellphone = $("#txtPhone").val();
        if (cellphone == '') {
            mui.toast(constants.msgInfo.phone);
            return false;
        }
        if (!constants.REGEX.CELLPHONE.test(cellphone)) {
            mui.toast(constants.msgInfo.phoneerr);
            return false;
        }
        var businessType = "2011";
        var data = {
            cellphone: cellphone,
            businessType: businessType
        };
        isSendCaptcha = false;
        waitTimer = setInterval(function () {
            sendWaitTimer();
        }, 1000);
        postInvoke(constants.URLS.SENDSMSCODE, data, function (res) {
            if (res.succeeded) {
                token = res.data.token;
                mui.toast(constants.msgInfo.send);
            } else {
                waitCount = 0;
                mui.toast(res.message);
            }
        }, function (res) {
            waitCount = 0;
            mui.toast(res.message);
        });
    }
}

function loginByCaptcha() {
    if (token == '') {
        mui.toast(constants.msgInfo.tokenerr);
        return false;
    }
    var cellphone = $("#txtPhone").val();
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
    showloading();
    var verify = {
        token: token,
        smsCode: captcha
    };
    postInvoke(constants.URLS.VERIFYSMSCODE, verify, function (res) {
        hideloading();
        if (res.succeeded) {
            var accountGroup = getCookie(constants.COOKIES.TAG);
            var data = {
                token: token,
                accountType: "Tenant",
                isPersonal: true,
                client: "M",
                accountGroup: accountGroup
            };
            postInvoke(constants.URLS.LOGINBYSMSCODEV2, data, function (res1) {
                if (res1.succeeded) {
                    setAuth(res1.authId);
                    mui.toast(constants.msgInfo.loginSuccess);
                    setTimeout(function () {
                        if (url != '') {
                            window.location.href = decodeURIComponent(url);
                        } else {
                            window.location.href = "index.html";
                        }
                    }, 2000);
                } else {
                    mui.toast(res1.message);
                }
            }, function (err) {
                mui.toast(err.message);
            });
        } else {
            mui.toast(res.message);
        }
    }, function (err) {
        hideloading();
        mui.toast(err.message);
    });
}

function showloading() {
    $(".msg-post").show();
}

function hideloading() {
    $(".msg-post").hide();
}

$(document).ready(function () {
    url = getURLQuery("url");
});