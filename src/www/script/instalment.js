/**
 * Created by long.jiang on 2016/12/12.
 */
var waitTimer = null;
var waitCount = 60;
var isVerify = true;
var isSendCaptcha = true;
var contractId = "";
var orderNo = "";
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
        var data = {
            contractId: contractId,
            cellphone: cellphone
        };
        waitTimer = setInterval(function () {
            sendWaitTimer();
        }, 1000);
        postInvoke(constants.URLS.SENDSMSAUTHCODE, data, function (res) {
            if (res.succeeded) {
                orderNo = res.data;
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
function verifySmsAuthCode() {
    if (isVerify) {
        if (orderNo == "") {
            mui.toast(constants.msgInfo.senderr);
            return false;
        }
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
        $(".msg-post").show();
        isVerify = false;
        var verify = {
            contractId: contractId,
            orderNo: orderNo,
            code: captcha
        };
        postInvoke(constants.URLS.VERIFYSMSAUTHCODE, verify, function (res) {
            $(".msg-post").hide();
            isVerify = true;
            if (res.succeeded) {
                window.location.replace("instalmentResults.html?succeeded=1");
            } else {
                mui.toast(res.message);
                setTimeout(function () {
                    window.location.replace("instalmentResults.html?succeeded=0");
                }, 2000);
            }
        }, function (err) {
            $(".msg-post").hide();
            isVerify = true;
            mui.toast(err.message);
        });
    }
}

function showAgreement() {
    $("#divAgreementList").show();
}

function hideAgreement() {
    $("#divAgreementList").hide();
}

//
$(document).ready(function () {
    contractId = getURLQuery("contractId");
});
