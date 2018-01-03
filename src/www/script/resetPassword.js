/**
 * Created by long.jiang on 2016/12/12.
 */
var token = "";
var waitTimer = null;
var waitCount = 60;
var isResetPassword = true;
var isSendCaptcha = true;
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

function sendCaptcha() {
    if (isSendCaptcha) {
        var cellphone = $("#txtPhone").val();
        if (cellphone === '') {
            mui.toast(constants.msgInfo.phone);
            return false;
        }
        if (!constants.REGEX.CELLPHONE.test(cellphone)) {
            mui.toast(constants.msgInfo.phoneerr);
            return false;
        }
        isSendCaptcha = false;
        var businessType = "301";
        var data = {
            cellphone: cellphone,
            businessType: businessType
        };
        waitTimer = setInterval(function() {
            sendWaitTimer();
        }, 1000);
        postInvoke(constants.URLS.SENDSMSCODE, data,
            function(res) {
                if (res.succeeded) {
                    token = res.data.token;
                    mui.toast(constants.msgInfo.send);
                } else {
                    mui.toast(constants.msgInfo.senderr);
                }
            }, function(res) {
                waitCount = 0;
                mui.toast(res.message);
            });
    }
}

function changePassword() {
    if (isResetPassword) {
        var cellphone = $("#txtPhone").val();
        if (cellphone === '') {
            mui.toast(constants.msgInfo.phone);
            return false;
        }
        if (!constants.REGEX.CELLPHONE.test(cellphone)) {
            mui.toast(constants.msgInfo.phoneerr);
            return false;
        }
        if (token === '') {
            mui.toast(constants.msgInfo.tokenerr);
            return false;
        }
        var captcha = $("#txtCaptcha").val();
        if (captcha === '') {
            mui.toast(constants.msgInfo.captcha);
            return false;
        }
        if (!constants.REGEX.CHECKCODE.test(captcha)) {
            mui.toast(constants.msgInfo.captchaerr);
            return false;
        }
        var password = $("#txtPassword").val();
        if (password === '') {
            mui.toast(constants.msgInfo.password);
            return false;
        }
        if (!constants.REGEX.PASSWORD.test(password)) {
            mui.toast(constants.msgInfo.passworderr);
            return false;
        }
        isResetPassword = false;
        var verify = {
            token: token,
            smsCode: captcha
        };
        postInvoke(constants.URLS.VERIFYSMSCODE, verify, function(res) {
            if (res.succeeded) {
                var data = {
                    token: token,
                    password: password
                };
                postInvoke(constants.URLS.CHANGEPASSWORD, data,
                    function(res) {
                        isResetPassword = true;
                        if (res.succeeded) {
                            mui.toast(constants.msgInfo.resetPassword);
                            setTimeout(function() {
                                window.location.href = "login.html";
                            }, 1000);
                        } else {
                            mui.toast(constants.msgInfo.resetPassworderr);
                        }
                    }, function(res) {
                        isResetPassword = true;
                        mui.toast(res.message);
                    });
            } else {
                isResetPassword = true;
                mui.toast(res.message);
            }
        }, function(res) {
            isResetPassword = true;
            mui.toast(res.message);
        });
    }
}
