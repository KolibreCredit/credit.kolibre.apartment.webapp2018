var roomId = "";
var item = null;
//
var waitTimer = null;
var waitCount = 60;
var isSendCaptcha = true;
//
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
    var appointmentTime = $("#lbAppointmentTime").val();
    if (appointmentTime == "") {
        mui.toast(constants.msgInfo.appointmentTime);
        return false;
    }
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
                    }, 2000);
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
            $(".huxing").find("span").html((item.rentType == "ZhengZu" ? "整租" : "合租") + " / " + item.roomTypeName + " / " + (item.roomTypeSize * 0.0001).toFixed(2) + "㎡");
            $(".apartmentAddress").find("span").html(item.apartmentAddress);
            $(".rent").html((item.retailPrice > 0 ? "{0}元/月".format((item.retailPrice * 0.01).toFixed(0)) : "敬请期待…"));
        } else {
            mui.toast(res.message);
        }
    }, function (err) {
        mui.toast(err.message);
    });
    //
    var children3 = [{value: "00", text: "00分"}, {value: "30", text: "30分"}];
    var children2 = [];
    for (var hour = 8; hour < 22; hour++) {
        children2.push({value: (hour < 10 ? "0" + hour : hour), text: hour + "时", children: children3});
    }
    getInvoke(constants.URLS.GETRESERVATIONTIMES, function (res) {
        var dateData = [];
        var resItem = null;
        for (var i = 0; i < res.data.length; i++) {
            resItem = res.data[i];
            dateData.push({value: resItem.keyTime, text: resItem.valueTime, children: children2});
        }
        var dateDataPicker3 = new mui.PopPicker({layer: 3});
        dateDataPicker3.setData(dateData);
        $(".mui-picker").eq(0).css({"width": "50%"});
        $(".mui-picker").eq(1).css({"width": "25%"});
        $(".mui-picker").eq(2).css({"width": "25%"});
        //
        var showAppointmentTime = document.getElementById('dtAppointmentTime');
        var appointmentTimeResult = document.getElementById('lbAppointmentTime');
        showAppointmentTime.addEventListener('tap', function () {
            dateDataPicker3.show(function (items) {
                appointmentTimeResult.value = items[0].value + " " + items[1].value + ":" + items[2].value;
            });
        }, false);
    });
});