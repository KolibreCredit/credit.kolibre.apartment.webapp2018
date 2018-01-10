/**
 * Created by long.jiang on 2016/12/12.
 */
var waitTimer = null;
var waitCount = 60;
var isSendCaptcha = true;
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
        var businessType = "TenantRegister";
        var data = {
            cellphone: cellphone,
            businessType: businessType
        };
        waitTimer = setInterval(function () {
            sendWaitTimer();
        }, 1000);
        isSendCaptcha = false;
        postInvoke(constants.URLS.SEND, data,
            function (res) {
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

function register() {
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
        cellphone: cellphone,
        businessType: "TenantRegister",
        validateCode: captcha
    };
    postInvoke(constants.URLS.VERIFY, verify, function (res) {
        if (res.succeeded) {
            var data = {
                authCode: res.data.authCode,
                description: "M注册",
                password: password
            };
            postInvoke(constants.URLS.TENANT, data, function (res1) {
                if (res1.succeeded) {
                    setToken(res1.headers['x-KC-SID']);
                    mui.toast(constants.msgInfo.register);
                    setTimeout(function () {
                        window.location.href = "index.html";
                    }, 1000);
                } else {
                    mui.toast(constants.msgInfo.registererr);
                }
            }, function (res) {
                mui.toast(res.message);
            });
        }
    }, function (res) {
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