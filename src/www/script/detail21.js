var roomId = "";
var item = null;
//
var waitTimer = null;
var waitCount = 60;
var isSendCaptcha = true;
function sendWaitTimer() {
    if (waitCount > 0) {
        $('.lbSmsCode').text(waitCount + 'S');
        waitCount = waitCount - 1;
    } else {
        clearInterval(waitTimer);
        $('.lbSmsCode').text('获取验证码');
        isSendCaptcha = true;
        waitCount = 60;
    }
}

function sendCaptcha() {
    if (isSendCaptcha) {
        var cellphone = $("#txtContactPhone").val();
        if (cellphone === '') {
            mui.toast(constants.msgInfo.phone);
            return false;
        }
        if (!constants.REGEX.CELLPHONE.test(cellphone)) {
            mui.toast(constants.msgInfo.phoneerr);
            return false;
        }
        isSendCaptcha = false;
        var businessType = "RoomSourceReservation";
        var data = {
            businessType: businessType,
            cellphone: cellphone
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

function appointment() {
    var contactPhone = $("#txtContactPhone").val();
    if (contactPhone == '') {
        mui.toast(constants.msgInfo.contactPhone);
        return false;
    }
    if (!constants.REGEX.CELLPHONE.test(contactPhone)) {
        mui.toast(constants.msgInfo.contactPhoneerr);
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
    var appointmentName = $("#txtPppointmentName").val();
    if (appointmentName == '') {
        mui.toast(constants.msgInfo.appointmentName);
        return false;
    }
    var appointmentTime = $("#lbAppointmentTime").html();
    $(".msg-alert").show();
    var verify = {
        cellphone: contactPhone,
        businessType: "RoomSourceReservation",
        validateCode: captcha
    };
    postInvoke(constants.URLS.VERIFY, verify, function (res) {
        if (res.succeeded) {
            var data = {
                authCode: res.data.authCode,
                roomId: roomId,
                roomSourceName: item.roomSourceName,
                tenantName: appointmentName,
                reservationTime: appointmentTime + ":00"
            };
            postInvoke(constants.URLS.CREATERESERVATION, data, function (res1) {
                $(".msg-alert").hide();
                if (res1.succeeded) {
                    mui.toast(constants.msgInfo.appointment);
                    setTimeout(function () {
                        window.location.href = "appointment2.html";
                    },2000);
                } else {
                    mui.toast(res1.message);
                }
            }, function (err) {
                $(".msg-alert").hide();
                mui.toast(err.message);
            });
        } else {
            $(".msg-alert").hide();
            mui.toast(res.message);
        }
    }, function (err) {
        $(".msg-alert").hide();
        mui.toast(err.message);
    });
}

$(document).ready(function () {
    roomId = getURLQuery("roomId");
    getInvoke(constants.URLS.GETROOMSOURCE.format(roomId), function (res) {
        if (res.succeeded) {
            item = res.data;
            $("#imgUrl").attr("src", (item.pictures == null ? "images/dataErr.png" : item.pictures[0]));
            $(".projectName").html(item.roomSourceName);
            $(".rent").html((item.retailPrice > 0 ? "{0}元/月".format((item.retailPrice * 0.01).toFixed(0)) : "敬请期待…"));
        } else {
            mui.toast(res.message);
        }
    }, function (err) {
        mui.toast(err.message);
    });
});