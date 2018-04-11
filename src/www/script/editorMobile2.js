/**
 * Created by long.jiang on 2016/12/12.
 */
var waitTimer = null;
var waitCount = 60;
var isChangeCellphone = true;
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

//
function sendCaptcha() {
    if (isSendCaptcha) {
        var cellphone = $("#txtPhone2").val().trimPhone();
        if (cellphone == '') {
            mui.toast(constants.msgInfo.phone);
            return false;
        }
        if (!constants.REGEX.CELLPHONE.test(cellphone)) {
            mui.toast(constants.msgInfo.phoneerr);
            return false;
        }
        isSendCaptcha = false;
        var businessType = "TenantChangeCellphone";
        var data = {
            cellphone: cellphone,
            businessType: businessType
        };
        waitTimer = setInterval(function () {
            sendWaitTimer();
        }, 1000);
        postInvoke(constants.URLS.SEND, data, function (res) {
            if (res.succeeded) {
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

//
function changeCellphone() {
    if (isChangeCellphone) {
        var cellphone = $("#txtPhone").val().trimPhone();
        if (cellphone == '') {
            mui.toast(constants.msgInfo.phone);
            return false;
        }
        if (!constants.REGEX.CELLPHONE.test(cellphone)) {
            mui.toast(constants.msgInfo.phoneerr);
            return false;
        }
        var cellphone2 = $("#txtPhone2").val().trimPhone();
        if (cellphone2 == '') {
            mui.toast(constants.msgInfo.phone);
            return false;
        }
        if (!constants.REGEX.CELLPHONE.test(cellphone2)) {
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
        isChangeCellphone = false;

        getInvoke(constants.URLS.GETTENANTBYCELLPHONE.format(cellphone), function (res) {
            if (res.succeeded) {
                var verify = {
                    cellphone: cellphone2,
                    businessType: "TenantChangeCellphone",
                    validateCode: captcha
                };
                postInvoke(constants.URLS.VERIFY, verify, function (res2) {
                    isChangeCellphone = true;
                    if (res2.succeeded) {
                        window.location.href = "verify2.html?authCode={0}&cellphone={1}".format(res2.data.authCode, cellphone);
                    } else {
                        mui.toast(res2.message);
                    }
                }, function (err) {
                    isChangeCellphone = true;
                    mui.toast(err.message);
                });
            } else {
                mui.toast(res.message);
            }
        }, function (err) {
            isChangeCellphone = true;
            mui.toast(err.message);
        });
    }
}