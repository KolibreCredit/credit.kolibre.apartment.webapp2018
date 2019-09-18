/**
 * Created by long.jiang on 2016/12/12.
 */

var waitTimer = null;
var waitCount = 60;
var isSendCaptcha = true;
var isUserVerify = false;
var slider = null;

function sendWaitTimer() {
    if (waitCount > 0) {
        $('#btnSendCaptcha').text(waitCount + language.getLangValue("10011", '秒'));
        waitCount = waitCount - 1;
    } else {
        clearInterval(waitTimer);
        $('#btnSendCaptcha').text(language.getLangValue("10006", '获取验证码'));
        waitCount = 60;
        isSendCaptcha = true;
    }
}

function showCaptcha() {
    if (!isSendCaptcha) {
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
    $("#divAlert").show();
}

function hideCaptcha() {
    slider.restore();
    $("#divAlert").hide();
}

function sendCaptcha() {
    if (!isSendCaptcha) {
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
    var businessType = "HoupuTenantLogin";
    var data = {
        cellphone: cellphone,
        businessType: businessType
    };
    isSendCaptcha = false;
    waitTimer = setInterval(function () {
        sendWaitTimer();
    }, 1000);
    postInvoke(constants.URLS.SEND, data, function (res) {
        if (!res.succeeded) {
            waitCount = 0;
            mui.toast(res.message);
        }
    }, function (res) {
        waitCount = 0;
        mui.toast(res.message);
    });
}

function showloading() {
    $(".msg-post").show();
}

function hideloading() {
    $(".msg-post").hide();
}

function loginByCaptcha() {
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
    var verify = {
        cellphone: cellphone,
        businessType: "HoupuTenantLogin",
        validateCode: captcha
    };
    showloading();
    postInvoke(constants.URLS.VERIFY, verify, function (res) {
        hideloading();
        if (res.succeeded) {
            postInvoke(constants.URLS.QUICKLOGIN, {authCode: res.data.authCode}, function (res1) {
                if (res1.succeeded) {
                    if (res1.data.loginState == "Succeed") {
                        setToken(res1.headers["x-KC-SID"]);
                        mui.toast(constants.msgInfo.loginSuccess);
                        setTimeout(function () {
                            window.location.href = "coolkitgateLock.html";
                        }, 1000);
                    } else {
                        enumLoginState(res1.data.loginState);
                    }
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

var enumLoginState = function (loginState) {
    if (loginState == "PasswordError") {
        mui.toast(constants.msgInfo.loginErr1);
    } else if (loginState == "PasswordNotExist") {
        mui.toast(constants.msgInfo.loginErr2);
    } else if (loginState == "Locked") {
        mui.toast(constants.msgInfo.loginErr3);
    } else {
        mui.toast(constants.msgInfo.loginErr4);
    }
};

function userVerify() {
    return true;
}

$(document).ready(function () {
    slider = new FtSlider({
        id: "divSlideVerify",
        width: "100%",
        height: 40,
        textMsg: language.getLangValue("10008", "向右滑动验证"),
        successMsg: language.getLangValue("10010", "验证成功"),
        userVerify: userVerify,
        callback: function (res) {
            isUserVerify = res;
            if (isUserVerify) {
                sendCaptcha();
                setTimeout(function () {
                    hideCaptcha();
                }, 500);
            }
        }
    });
    $(".ft-slider").css({"line-height": "40px"});
    $(".ft-slider-bar").css({"width": "40px", "height": "40px"});
    getInvoke2(constants.URLS.GETCURRENTTENANT, function (res) {
        if (res.data != null) {
            window.location.replace("coolkitgateLock.html");
        }
    });
    language.init();
});