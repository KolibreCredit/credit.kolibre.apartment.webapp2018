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
        var cellphone = $("#txtPhone").val().trimPhone();
        if (cellphone == '') {
            mui.toast(constants.msgInfo.phone);
            return false;
        }
        if (!constants.REGEX.CELLPHONE.test(cellphone)) {
            mui.toast(constants.msgInfo.phoneerr);
            return false;
        }
        isSendCaptcha = false;
        var businessType = "UpdateTenantInfo";
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
function editorVerify() {
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
        var verify = {
            cellphone: cellphone,
            businessType: "UpdateTenantInfo",
            validateCode: captcha
        };
        postInvoke(constants.URLS.VERIFY, verify, function (res) {
            if (res.succeeded) {
                isChangeCellphone = true;
                window.location.href = "verify.html?authCode={0}".format(res.data.authCode);
            } else {
                isChangeCellphone = true;
                mui.toast(res.message);
            }
        }, function (err) {
            isChangeCellphone = true;
            mui.toast(err.message);
        });
    }
}

//
$(document).ready(function () {
    getInvoke(constants.URLS.GETCURRENTTENANT, function (res) {
        if (res.succeeded) {
            $('#txtPhone').val(res.data.cellphone);
        }
    });
});