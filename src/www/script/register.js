/**
 * Created by long.jiang on 2016/12/12.
 */
var waitTimer = null;
var waitCount = 60;
var isSendCaptcha = true;
var token = "";
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
        var businessType = 103;
        var data = {
            cellphone: cellphone,
            businessType: businessType
        };
        waitTimer = setInterval(function() {
            sendWaitTimer();
        }, 1000);
        isSendCaptcha = false;
        postInvoke(constants.URLS.SENDSMSCODE, data,
            function(res) {
                isSendCaptcha = true;
                if (res.succeeded) {
                    token = res.data.token;
                    mui.toast(constants.msgInfo.send);
                } else {
                    waitCount = 0;
                    mui.toast(res.message);
                }
            }, function(res) {
                isSendCaptcha = true;
                waitCount = 0;
                mui.toast(res.message);
            });
    }
}

function register() {
    if (token === '') {
        mui.toast(constants.msgInfo.tokenerr);
        return false;
    }
    var cellphone = $("#txtPhone").val();
    if (cellphone === '') {
        mui.toast(constants.msgInfo.phone);
        return false;
    }
    if (!constants.REGEX.CELLPHONE.test(cellphone)) {
        mui.toast(constants.msgInfo.phoneerr);
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
    var rpassword = $("#txtRPassword").val();
    if (rpassword === '') {
        mui.toast(constants.msgInfo.password);
        return false;
    }
    if (!constants.REGEX.PASSWORD.test(rpassword)) {
        mui.toast(constants.msgInfo.passworderr);
        return false;
    }
    if (password != rpassword) {
        mui.toast(constants.msgInfo.passwordsame);
        return false;
    }
    if ($("#chkAgreement").attr("src").indexOf('check1.png') === -1) {
        mui.toast(constants.msgInfo.agreement1);
        return false;
    }
    var verify = {
        token: token,
        smsCode: captcha
    };
    postInvoke(constants.URLS.VERIFYSMSCODE, verify, function(res) {
        if (res.succeeded) {
            var data = {
                token: token,
                accountType: "Tenant",
                isPersonal: true,
                client: "M",
                password: password
            };
            postInvoke(constants.URLS.REGISTER, data,
                function(res1, status, xhr) {
                    if (res1.succeeded) {
                        setCookie(constants.COOKIES.AUTH, xhr.getResponseHeader('X-KC-SID'));
                        mui.toast(constants.msgInfo.register);
                        setTimeout(function() {
                            window.location.href = "index.html";
                        }, 1000);
                    } else {
                        mui.toast(constants.msgInfo.registererr);
                    }
                }, function(res) {
                    mui.toast(res.message);
                });
        }
    }, function(res) {
        mui.toast(res.message);
    });
}

function agreement(curImg) {
    if (curImg.src.indexOf("check1.png") != -1) {
        curImg.src = "images/check0.png";
    } else {
        curImg.src = "images/check1.png";
    }
}

$(document).ready(function() {
    $(".msg-alert").hide();
});