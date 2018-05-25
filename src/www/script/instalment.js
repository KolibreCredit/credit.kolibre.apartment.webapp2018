/**
 * Created by long.jiang on 2016/12/12.
 */
var waitTimer = null;
var waitCount = 60;
var isVerify = true;
var isSendCaptcha = true;
var contractId = "";
var orderId = "";
var orderNo = "";
var waitCount2 = 60;
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
            cellphone: cellphone
        };
        if (orderId != "") {
            data = $.extend({}, data, {
                orderId: orderId
            });
        }
        if (contractId != "") {
            data = $.extend({}, data, {
                contractId: contractId
            });
        }
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
        if (orderNo == "") {
            mui.toast(constants.msgInfo.ordernoerr);
            return false;
        }
        $(".msg-post").show();
        isVerify = false;
        var verify = {
            orderNo: orderNo,
            code: captcha
        };
        if (orderId != "") {
            verify = $.extend({}, verify, {
                orderId: orderId
            });
        }
        if (contractId != "") {
            verify = $.extend({}, verify, {
                contractId: contractId
            });
        }
        postInvoke(constants.URLS.VERIFYSMSAUTHCODE, verify, function (res) {
            if (res.succeeded) {
                var loanApply = {
                    orderNo: orderNo,
                    contractId: contractId,
                    loanRecordId: res.data.loanRecordId
                };
                setTimeout(function () {
                    getLoanApplyResult(loanApply);
                }, 3000);
            } else {
                errInstalmentResults(res.message);
            }
        }, function (err) {
            errInstalmentResults(err.message);
        });
    }
}

function goInstalmentResults() {
    $(".msg-alert").hide();
    setTimeout(function () {
        window.location.replace("instalmentResults.html?succeeded=1");
    }, 200);
}

function getLoanApplyResult(loanApply) {
    postInvoke(constants.URLS.GETLOANAPPLYRESULT, loanApply, function (res) {
        if (res.succeeded) {
            if (res.data.state == "Succeed") {
                waitCount2 = 60;
                isVerify = true;
                $(".msg-post").hide();
                setTimeout(function () {
                    $(".msg-alert").show();
                }, 200);
            } else if (res.data.state == "Continue") {
                if (waitCount2 > 0) {
                    waitCount2 = waitCount2 - 1;
                    setTimeout(function () {
                        getLoanApplyResult(loanApply)
                    }, 3000);
                } else {
                    errInstalmentResults(res.data.message);
                }
            } else {
                errInstalmentResults(res.data.message);
            }
        } else {
            errInstalmentResults(res.message);
        }
    }, function (err) {
        errInstalmentResults(err.message);
    });
}

function errInstalmentResults(message) {
    mui.toast(message);
    setTimeout(function () {
        waitCount2 = 60;
        isVerify = true;
        $(".msg-post").hide();
        window.location.replace("instalmentResults.html?succeeded=0");
    }, 2000);
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
    orderId = getURLQuery("orderId");
});


