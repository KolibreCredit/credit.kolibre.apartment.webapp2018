/**
 * Created by long.jiang on 2016/12/12.
 */

var waitTimer = null;
var waitCount = 60;
var isSendCaptcha = true;
var isUserVerify = false;

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
    if (waitCount == 40) {
        $("#divVoiceCall").show();
    }
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
    var businessType = "TenantRegisterOrLogin";
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
    if (!isUserVerify) {
        mui.toast(constants.msgInfo.loginErr5);
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
        businessType: "TenantRegisterOrLogin",
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
                            window.location.href = "gateLock.html?coolkit={0}".format("coolkit");
                        }, 1000);
                    }
                    else {
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
    }
    else if (loginState == "PasswordNotExist") {
        mui.toast(constants.msgInfo.loginErr2);
    }
    else if (loginState == "Locked") {
        mui.toast(constants.msgInfo.loginErr3);
    }
    else {
        mui.toast(constants.msgInfo.loginErr4);
    }
};

function userVerify() {
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
    return true;
}

$(document).ready(function () {
    $('#divSlideVerify').slideVerify({
        type: 1,		//类型
        vOffset: 5,	//误差量，根据需求自行调整
        explain: '向右滑动验证',
        barSize: {
            width: '100%',
            height: '40px',
        },
        userVerify: userVerify,
        ready: function () {
        },
        success: function () {
            // alert('验证成功，添加你自己的代码！');
            //......后续操作
            isUserVerify = true;
        },
        error: function () {
            //alert('验证失败！');
            isUserVerify = false;
        }
    });
});